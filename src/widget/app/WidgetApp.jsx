import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { postJson, streamAssistantReply } from './api';
import { formatTime, getSessionId, parseAssistantText } from './utils';
import HeaderBar from './components/HeaderBar';
import InputComposer from './components/InputComposer';
import QuickReplies from './components/QuickReplies';
import SkeletonCard from './components/SkeletonCard';
import { AssistantCard, EligibilityCard, UserCard } from './components/ConversationCard';
import { ContactCaptureCard, LeadCaptureCard } from './components/ContactCards';

const SCROLL_EPSILON = 1;

function createId(prefix = 'msg') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`;
}

function asUserEntry(text) {
  return {
    id: createId('usr'),
    type: 'user',
    body: text,
    timestamp: formatTime(),
  };
}

function asAssistantEntry(text) {
  const parsed = parseAssistantText(text);
  return {
    id: createId('asst'),
    type: 'assistant',
    title: parsed.title,
    body: parsed.body,
    bulletItems: parsed.bulletItems,
    notes: parsed.notes,
    rawText: text,
    timestamp: formatTime(),
  };
}

function asEligibilityEntry(result) {
  const nextSteps = String(result?.nextSteps || '')
    .split(/\n+/)
    .map((line) => line.replace(/^([-*•]|\d+\.)\s+/, '').trim())
    .filter(Boolean)
    .slice(0, 5);

  const notes = String(result?.disclaimer || '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    id: createId('elig'),
    type: 'eligibility',
    body: result?.reason || 'Eligibility review generated.',
    bulletItems: nextSteps,
    notes,
    rawText: `${result?.reason || ''}\n${result?.nextSteps || ''}`,
    timestamp: formatTime(),
  };
}

function isScrollableElement(node) {
  if (!(node instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(node);
  const overflowY = style.overflowY;
  if (!/(auto|scroll|overlay)/.test(overflowY)) return false;
  return node.scrollHeight > node.clientHeight + SCROLL_EPSILON;
}

function findNearestScrollable(node, boundaryNode) {
  let current = node instanceof Element ? node : null;
  while (current && current !== boundaryNode) {
    if (isScrollableElement(current)) return current;
    current = current.parentElement;
  }
  return isScrollableElement(boundaryNode) ? boundaryNode : null;
}

function isIOSDevice() {
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  return /iP(hone|ad|od)/.test(platform) || (/Mac/.test(platform) && 'ontouchend' in document) || /iP(hone|ad|od)/.test(ua);
}

function lockDocumentScroll() {
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const html = document.documentElement;
  const body = document.body;

  html.classList.add('el-widget-body-lock');
  body.classList.add('el-widget-body-lock');
  body.style.top = `-${scrollY}px`;

  return () => {
    html.classList.remove('el-widget-body-lock');
    body.classList.remove('el-widget-body-lock');
    body.style.top = '';
    window.scrollTo(0, scrollY);
  };
}

function installTouchBoundaryGuard(overlayEl, fallbackScrollEl) {
  const state = {
    startY: 0,
    activeScroller: fallbackScrollEl,
  };

  const getScroller = (eventTarget) =>
    findNearestScrollable(eventTarget, overlayEl) || state.activeScroller || fallbackScrollEl;

  const onTouchStart = (event) => {
    if (event.touches.length !== 1) return;
    state.startY = event.touches[0].clientY;
    state.activeScroller = getScroller(event.target);
  };

  const onTouchMove = (event) => {
    if (event.touches.length !== 1) return;

    const scroller = getScroller(event.target);
    if (!scroller) {
      event.preventDefault();
      return;
    }

    if (scroller.scrollHeight <= scroller.clientHeight + SCROLL_EPSILON) {
      event.preventDefault();
      return;
    }

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - state.startY;
    const atTop = scroller.scrollTop <= SCROLL_EPSILON;
    const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - SCROLL_EPSILON;

    if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
      event.preventDefault();
    }
  };

  overlayEl.addEventListener('touchstart', onTouchStart, { passive: true });
  overlayEl.addEventListener('touchmove', onTouchMove, { passive: false });

  return () => {
    overlayEl.removeEventListener('touchstart', onTouchStart);
    overlayEl.removeEventListener('touchmove', onTouchMove);
  };
}

export default function WidgetApp({ apiBase }) {
  const sessionId = useMemo(() => getSessionId(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [quickReplies, setQuickReplies] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [formMode, setFormMode] = useState(null);
  const [pendingInputType, setPendingInputType] = useState(null);

  const initializedRef = useRef(false);
  const conversationRef = useRef(null);
  const overlayRef = useRef(null);

  const placeholder =
    pendingInputType === 'name'
      ? 'Enter your first name...'
      : pendingInputType === 'arrest_date'
        ? 'Arrest date (YYYY or MM/YYYY)...'
        : pendingInputType === 'deferred_discharge_date'
          ? 'Deferred discharge date (YYYY or MM/YYYY)...'
          : pendingInputType === 'conviction_sentence_date'
            ? 'Sentence completion date (YYYY or MM/YYYY)...'
            : pendingInputType === 'offense'
              ? 'Describe your charge(s)...'
      : 'Describe your situation...';

  const trackEvent = useCallback(
    (event, data = '') => {
      postJson(`${apiBase}/api/event`, { sessionId, event, data }).catch(() => {
        // no-op
      });
    },
    [apiBase, sessionId]
  );

  const appendMessages = useCallback((nextEntry) => {
    setMessages((prev) => [...prev, nextEntry]);
  }, []);

  const removeMessageById = useCallback((id) => {
    setMessages((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const applyFlowPayload = useCallback(
    (payload) => {
      if (payload?.eligibilityResult) {
        const eligibilityEntry = asEligibilityEntry(payload.eligibilityResult);
        appendMessages(eligibilityEntry);
      }

      if (payload?.message) {
        const assistantEntry = asAssistantEntry(payload.message);
        appendMessages(assistantEntry);
      }

      setQuickReplies(payload?.quickReplies || []);

      if (payload?.inputType === 'contact_form') {
        setFormMode('contact');
        setPendingInputType(null);
      } else if (payload?.inputType === 'lead_form') {
        setFormMode('lead');
        setPendingInputType(null);
      } else if (
        payload?.inputType === 'name' ||
        payload?.inputType === 'offense' ||
        payload?.inputType === 'arrest_date' ||
        payload?.inputType === 'deferred_discharge_date' ||
        payload?.inputType === 'conviction_sentence_date'
      ) {
        setFormMode(null);
        setPendingInputType(payload.inputType);
      } else {
        setFormMode(null);
        setPendingInputType(null);
      }
    },
    [appendMessages]
  );

  const advanceFlow = useCallback(
    async (input) => {
      setIsLoading(true);
      const loadingId = createId('loading');
      appendMessages({ id: loadingId, type: 'loading' });

      try {
        const payload = await postJson(`${apiBase}/api/flow/advance`, { sessionId, input });
        removeMessageById(loadingId);
        applyFlowPayload(payload);
      } catch (err) {
        removeMessageById(loadingId);
        appendMessages(
          asAssistantEntry(err.message || 'We could not process that request. Please try again.')
        );
      } finally {
        setIsLoading(false);
      }
    },
    [apiBase, appendMessages, applyFlowPayload, removeMessageById, sessionId]
  );

  const initializeFlow = useCallback(async () => {
    setIsLoading(true);

    try {
      const payload = await postJson(`${apiBase}/api/flow/state`, { sessionId });
      applyFlowPayload(payload);
      initializedRef.current = true;
      trackEvent('dashboard_opened');
    } catch (err) {
      appendMessages(asAssistantEntry(err.message || 'Unable to initialize assistant.'));
    } finally {
      setIsLoading(false);
    }
  }, [apiBase, applyFlowPayload, appendMessages, sessionId, trackEvent]);

  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      initializeFlow();
    }
  }, [isOpen, initializeFlow]);

  useEffect(() => {
    if (!isOpen) return undefined;
    return lockDocumentScroll();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const updateViewportHeight = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty('--el-widget-vh', `${Math.round(viewportHeight)}px`);
    };

    updateViewportHeight();

    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
    window.visualViewport?.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('scroll', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
      window.visualViewport?.removeEventListener('resize', updateViewportHeight);
      window.visualViewport?.removeEventListener('scroll', updateViewportHeight);
      document.documentElement.style.removeProperty('--el-widget-vh');
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    if (!('ontouchstart' in window)) return undefined;

    const overlayEl = overlayRef.current;
    const fallbackScrollEl = conversationRef.current;
    if (!overlayEl || !fallbackScrollEl) return undefined;

    const supportsOverscrollContain = typeof CSS !== 'undefined' && CSS.supports?.('overscroll-behavior-y', 'contain');

    if (supportsOverscrollContain && !isIOSDevice()) return undefined;
    return installTouchBoundaryGuard(overlayEl, fallbackScrollEl);
  }, [isOpen]);

  useEffect(() => {
    const panel = conversationRef.current;
    if (!panel) return;
    panel.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' });
  }, [messages, quickReplies, formMode]);

  const handleQuickReply = useCallback(
    (reply) => {
      setQuickReplies([]);
      appendMessages(asUserEntry(reply.label));
      trackEvent('quick_reply_selected', { id: reply.id });

      if (reply.id === 'talk_human') {
        setFormMode('lead');
        return;
      }

      advanceFlow(reply.id);
    },
    [advanceFlow, appendMessages, trackEvent]
  );

  const handleStreamChat = useCallback(
    async (message) => {
      const loadingId = createId('loading');
      appendMessages({ id: loadingId, type: 'loading' });
      setIsLoading(true);

      let streamEntryId = null;
      let finalText = '';

      try {
        finalText = await streamAssistantReply({
          apiBase,
          message,
          sessionId,
          onChunk: (fullText) => {
            const parsed = parseAssistantText(fullText);

            setMessages((prev) => {
              const withoutLoading = prev.filter((entry) => entry.id !== loadingId);

              if (!streamEntryId) {
                streamEntryId = createId('asst');
                return [
                  ...withoutLoading,
                  {
                    id: streamEntryId,
                    type: 'assistant',
                    title: parsed.title,
                    body: parsed.body,
                    bulletItems: parsed.bulletItems,
                    notes: parsed.notes,
                    rawText: fullText,
                    timestamp: formatTime(),
                  },
                ];
              }

              return withoutLoading.map((entry) => {
                if (entry.id !== streamEntryId) return entry;
                return {
                  ...entry,
                  title: parsed.title,
                  body: parsed.body,
                  bulletItems: parsed.bulletItems,
                  notes: parsed.notes,
                  rawText: fullText,
                };
              });
            });
          },
        });

        const parsedFinal = parseAssistantText(finalText);

        setMessages((prev) => {
          const latest = prev[prev.length - 1];
          if (latest?.id === loadingId) {
            const fallback = finalText?.trim()
              ? {
                  id: createId('asst'),
                  type: 'assistant',
                  title: parsedFinal.title,
                  body: parsedFinal.body,
                  bulletItems: parsedFinal.bulletItems,
                  notes: parsedFinal.notes,
                  rawText: finalText,
                  timestamp: formatTime(),
                }
              : asAssistantEntry('No response was generated. Please try again.');

            return prev.filter((entry) => entry.id !== loadingId).concat(fallback);
          }

          if (streamEntryId) {
            return prev.map((entry) => {
              if (entry.id !== streamEntryId) return entry;
              return {
                ...entry,
                title: parsedFinal.title,
                body: parsedFinal.body,
                bulletItems: parsedFinal.bulletItems,
                notes: parsedFinal.notes,
                rawText: finalText,
              };
            });
          }

          return prev;
        });

        setQuickReplies([
          { id: 'start_over', label: 'Run Eligibility Check' },
          { id: 'talk_human', label: 'Request Attorney Follow-Up' },
        ]);
      } catch (err) {
        removeMessageById(loadingId);
        appendMessages(asAssistantEntry(err.message || 'Connection issue. Please try again.'));
      } finally {
        setIsLoading(false);
      }
    },
    [apiBase, appendMessages, removeMessageById, sessionId]
  );

  const handleSubmit = useCallback(async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    setInputValue('');
    setQuickReplies([]);
    appendMessages(asUserEntry(message));
    trackEvent('message_submitted');

    if (pendingInputType) {
      setPendingInputType(null);
      await advanceFlow(message);
      return;
    }

    await handleStreamChat(message);
  }, [inputValue, isLoading, appendMessages, trackEvent, pendingInputType, advanceFlow, handleStreamChat]);

  const handleContactSubmit = useCallback(
    async ({ email, phone }) => {
      setFormMode(null);
      const display = [email ? `Email: ${email}` : '', phone ? `Phone: ${phone}` : '']
        .filter(Boolean)
        .join(' | ');
      appendMessages(asUserEntry(display || 'Contact details provided'));
      await advanceFlow({ email, phone });
    },
    [advanceFlow, appendMessages]
  );

  const handleLeadSubmit = useCallback(
    async ({ name, email, phone }) => {
      setIsLoading(true);
      const loadingId = createId('loading');
      appendMessages({ id: loadingId, type: 'loading' });

      try {
        await postJson(`${apiBase}/api/lead`, { sessionId, name, email, phone });
        removeMessageById(loadingId);
        setFormMode(null);
        const assistantEntry = asAssistantEntry(
          'Your request has been submitted. A member of our legal team will follow up within one business day.'
        );
        appendMessages(assistantEntry);
        setQuickReplies([{ id: 'start_over', label: 'Check Another Situation' }]);
        trackEvent('lead_submitted');
      } catch (err) {
        removeMessageById(loadingId);
        appendMessages(asAssistantEntry(err.message || 'Unable to submit request. Please try again.'));
      } finally {
        setIsLoading(false);
      }
    },
    [apiBase, appendMessages, removeMessageById, sessionId, trackEvent]
  );

  return (
    <div id="el-legal-widget-root" className="font-body">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-[99998] rounded border border-legal-gold bg-legal-navy px-4 py-3 text-sm font-bold uppercase tracking-wide text-legal-cream shadow-legal transition hover:bg-legal-navyDeep"
        >
          Open Legal Assistant
        </button>
      )}

      {isOpen && (
        <section
          ref={overlayRef}
          className="el-widget-overlay fixed left-0 top-0 z-[99999] w-full bg-[rgba(9,19,37,0.35)] p-3 sm:p-5 lg:p-6"
          style={{ height: 'var(--el-widget-vh, 100dvh)' }}
        >
          <div className="mx-auto flex h-full max-w-[980px] flex-col overflow-hidden rounded border border-legal-border bg-legal-cream shadow-legal">
            <HeaderBar onClose={() => setIsOpen(false)} />

            <div className="flex min-h-0 flex-1 flex-col">
              <div ref={conversationRef} className="el-conversation-scroll min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-4">
                  {messages.map((entry) => {
                    if (entry.type === 'loading') return <SkeletonCard key={entry.id} />;
                    if (entry.type === 'user') return <UserCard key={entry.id} entry={entry} />;
                    if (entry.type === 'eligibility') return <EligibilityCard key={entry.id} entry={entry} />;
                    return <AssistantCard key={entry.id} entry={entry} />;
                  })}

                  <QuickReplies items={quickReplies} onSelect={handleQuickReply} />

                  {formMode === 'contact' && (
                    <ContactCaptureCard onSubmit={handleContactSubmit} disabled={isLoading} />
                  )}

                  {formMode === 'lead' && (
                    <LeadCaptureCard onSubmit={handleLeadSubmit} disabled={isLoading} />
                  )}
                </div>
              </div>

              <InputComposer
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSubmit}
                disabled={isLoading}
                placeholder={placeholder}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
