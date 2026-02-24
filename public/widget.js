/* ═══════════════════════════════════════════════════════════════════════════
   Expungement.Legal — Chatbot Widget (Embeddable)
   
   Usage:
     <script src="https://your-domain.com/widget.js" data-api="https://your-api.com"></script>
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── Config ────────────────────────────────────────────────────────────
    const WIDGET_VERSION = '2026-02-24.5';

    function resolveScriptTag() {
        if (document.currentScript) return document.currentScript;
        const scripts = Array.from(document.getElementsByTagName('script')).reverse();
        return (
            scripts.find((s) => /widget\.js(\?|$)/.test(s.getAttribute('src') || '') && s.hasAttribute('data-api')) ||
            scripts.find((s) => /widget\.js(\?|$)/.test(s.getAttribute('src') || '')) ||
            null
        );
    }

    const SCRIPT = resolveScriptTag();
    const SCRIPT_SRC_ORIGIN = (() => {
        try {
            if (!SCRIPT || !SCRIPT.src) return '';
            return new URL(SCRIPT.src, window.location.href).origin;
        } catch (_) {
            return '';
        }
    })();
    const API_BASE = (SCRIPT?.getAttribute('data-api') || SCRIPT_SRC_ORIGIN || window.location.origin).replace(/\/$/, '');
    const SESSION_KEY = 'el_chatbot_session';

    console.info(`[Expungement Widget ${WIDGET_VERSION}] API base: ${API_BASE}`);

    // ─── Session ───────────────────────────────────────────────────────────
    function getSessionId() {
        let id = sessionStorage.getItem(SESSION_KEY);
        if (!id) {
            id = 'ses_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
            sessionStorage.setItem(SESSION_KEY, id);
        }
        return id;
    }

    const sessionId = getSessionId();
    let isOpen = false;
    let isLoading = false;
    let userScrolled = false;
    let retryCount = 0;

    function updateSendButtonState() {
        const inputEl = document.getElementById('el-input');
        const sendBtn = document.getElementById('el-send');
        if (!inputEl || !sendBtn) return;
        sendBtn.disabled = isLoading || inputEl.value.trim().length === 0;
    }

    // ─── Load CSS ──────────────────────────────────────────────────────────
    function loadCSS() {
        if (document.getElementById('el-chatbot-css')) return;
        const link = document.createElement('link');
        link.id = 'el-chatbot-css';
        link.rel = 'stylesheet';
        link.href = `${API_BASE}/widget.css?v=${encodeURIComponent(WIDGET_VERSION)}`;
        document.head.appendChild(link);
    }

    // ─── SVG Icons ─────────────────────────────────────────────────────────
    const ICONS = {
        chat: '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>',
        close: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
        send: '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
        person: '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
    };

    // ─── Build DOM ─────────────────────────────────────────────────────────
    function buildWidget() {
        // Launcher
        const launcher = document.createElement('button');
        launcher.id = 'el-chatbot-launcher';
        launcher.innerHTML = ICONS.chat;
        launcher.setAttribute('aria-label', 'Open chat');
        launcher.addEventListener('click', toggleWidget);
        document.body.appendChild(launcher);

        // Widget
        const widget = document.createElement('div');
        widget.id = 'el-chatbot-widget';
        widget.classList.add('el-closed');
        widget.innerHTML = `
      <div class="el-header">
        <div class="el-header-info">
          <div class="el-header-avatar">
            <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div class="el-header-text">
            <h3>Expungement.Legal</h3>
            <p>online</p>
          </div>
        </div>
        <div class="el-header-actions">
          <button class="el-header-btn" id="el-close-btn" aria-label="Close">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </button>
        </div>
      </div>
      <div class="el-messages" id="el-messages"></div>
      <div class="el-input-area">
        <input type="text" id="el-input" class="el-input-field" placeholder="Type a message" autocomplete="off">
        <button id="el-send" class="el-send-btn" disabled aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <button class="el-human-btn" id="el-human-form-btn">
        <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> 
        Talk to a real person
      </button>
    `;
        document.body.appendChild(widget);

        // Event listeners
        widget.querySelector('#el-close-btn').addEventListener('click', toggleWidget);
        document.getElementById('el-send').addEventListener('click', handleSend);
        document.getElementById('el-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
        });
        document.getElementById('el-input').addEventListener('input', updateSendButtonState);
        document.getElementById('el-human-form-btn').addEventListener('click', showLeadForm);
        updateSendButtonState();

        // Scroll detection
        const msgs = document.getElementById('el-messages');
        msgs.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = msgs;
            userScrolled = scrollHeight - scrollTop - clientHeight > 50;
        });
    }

    // ─── Toggle ────────────────────────────────────────────────────────────
    function toggleWidget() {
        isOpen = !isOpen;
        const widget = document.getElementById('el-chatbot-widget');
        const launcher = document.getElementById('el-chatbot-launcher');

        if (isOpen) {
            widget.classList.remove('el-closed');
            launcher.classList.add('el-hidden');
            trackEvent('widget_opened');
            // Start flow if first open
            if (!document.getElementById('el-messages').children.length) {
                startFlow();
            }
            document.getElementById('el-input').focus();
        } else {
            widget.classList.add('el-closed');
            launcher.classList.remove('el-hidden');
        }
    }

    // ─── Scroll to bottom ─────────────────────────────────────────────────
    function scrollToBottom(force) {
        if (userScrolled && !force) return;
        const msgs = document.getElementById('el-messages');
        msgs.scrollTo({ top: msgs.scrollHeight, behavior: 'smooth' });
    }

    function formatMessageTime(date = new Date()) {
        try {
            return new Intl.DateTimeFormat(undefined, {
                hour: 'numeric',
                minute: '2-digit',
            }).format(date);
        } catch (_) {
            const h = date.getHours();
            const m = String(date.getMinutes()).padStart(2, '0');
            return `${h}:${m}`;
        }
    }

    // ─── Add message ───────────────────────────────────────────────────────
    function addMessage(text, sender, id) {
        const msgs = document.getElementById('el-messages');
        const div = document.createElement('div');
        div.className = `el-msg el-msg-${sender}`;
        if (id) div.id = id;
        const prev = msgs.lastElementChild;
        const isContinuation =
            prev &&
            prev.classList &&
            prev.classList.contains('el-msg') &&
            prev.classList.contains(`el-msg-${sender}`);

        if (isContinuation) {
            prev.classList.remove('el-group-end');
            div.classList.add('el-group-continuation');
        }

        div.classList.add('el-group-end');
        div.innerHTML = `
      <div class="el-msg-bubble">${formatMessage(text)}</div>
      <div class="el-msg-time">${formatMessageTime()}</div>
    `;
        msgs.appendChild(div);
        scrollToBottom();
        return div;
    }

    function formatMessage(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            .replace(/\n{2,}/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^(.+)$/s, '<p>$1</p>')
            .replace(/• /g, '&bull; ');
    }

    // ─── Typing indicator ─────────────────────────────────────────────────
    function showTyping() {
        removeTyping();
        const msgs = document.getElementById('el-messages');
        const div = document.createElement('div');
        div.className = 'el-typing';
        div.id = 'el-typing';
        div.innerHTML = '<div class="el-typing-dot"></div><div class="el-typing-dot"></div><div class="el-typing-dot"></div>';
        msgs.appendChild(div);
        scrollToBottom();
    }

    function removeTyping() {
        const el = document.getElementById('el-typing');
        if (el) el.remove();
    }

    // ─── Quick replies ─────────────────────────────────────────────────────
    function showQuickReplies(replies) {
        if (!replies || !replies.length) return;
        removeQuickReplies();
        const msgs = document.getElementById('el-messages');
        const container = document.createElement('div');
        container.className = 'el-quick-replies';
        container.id = 'el-quick-replies';

        replies.forEach((r) => {
            const btn = document.createElement('button');
            btn.className = 'el-qr-btn';
            btn.textContent = r.label;
            btn.addEventListener('click', () => {
                removeQuickReplies();
                addMessage(r.label, 'user');
                handleQuickReply(r.id);
            });
            container.appendChild(btn);
        });

        msgs.appendChild(container);
        scrollToBottom();
    }

    function removeQuickReplies() {
        const el = document.getElementById('el-quick-replies');
        if (el) el.remove();
    }

    // ─── Eligibility result card ───────────────────────────────────────────
    function showEligibilityResult(result) {
        if (!result) return;
        const msgs = document.getElementById('el-messages');

        const statusLabels = {
            likely: '✅ You May Be Eligible!',
            not_yet: '⏳ Not Yet Eligible',
            needs_review: '🔍 Needs Attorney Review',
        };

        const bucketClass = result.bucket || result.eligible;

        const card = document.createElement('div');
        card.className = `el-result-card ${bucketClass}`;
        card.innerHTML = `
      <div class="el-result-status ${bucketClass}">${statusLabels[result.eligible] || '🔍 Review Needed'}</div>
      <div class="el-result-reason">${formatMessage(result.reason)}</div>
      <div class="el-result-next">${formatMessage(result.nextSteps)}</div>
      <div class="el-result-disclaimer">${result.disclaimer}</div>
    `;
        msgs.appendChild(card);
        scrollToBottom(true);
    }

    // ─── Lead capture form (full — for "talk to human" or late-stage) ──────
    function showLeadForm() {
        removeQuickReplies();
        const msgs = document.getElementById('el-messages');
        if (document.getElementById('el-lead-form')) return;

        addMessage("We'd love to help! Share your contact info below and our team will reach out within 1 business day. No obligation.", 'bot');

        const form = document.createElement('div');
        form.className = 'el-lead-form';
        form.id = 'el-lead-form';
        form.innerHTML = `
      <input type="text" id="el-lead-name" placeholder="Your name" />
      <input type="email" id="el-lead-email" placeholder="Email address" />
      <input type="tel" id="el-lead-phone" placeholder="Phone number (optional)" />
      <button class="el-lead-submit" id="el-lead-submit">Get Free Consultation</button>
    `;
        msgs.appendChild(form);
        scrollToBottom(true);
        document.getElementById('el-lead-submit').addEventListener('click', submitLead);
        trackEvent('lead_form_shown');
    }

    // ─── Contact capture form (mid-flow — email + phone only) ─────────────
    function showContactForm() {
        removeQuickReplies();
        const msgs = document.getElementById('el-messages');
        if (document.getElementById('el-contact-form')) return;

        const form = document.createElement('div');
        form.className = 'el-lead-form';
        form.id = 'el-contact-form';
        form.innerHTML = `
      <input type="email" id="el-contact-email" placeholder="Email address" />
      <input type="tel" id="el-contact-phone" placeholder="Phone number" />
      <button class="el-lead-submit" id="el-contact-submit">Continue</button>
    `;
        msgs.appendChild(form);
        scrollToBottom(true);

        document.getElementById('el-contact-submit').addEventListener('click', () => {
            const email = document.getElementById('el-contact-email').value.trim();
            const phone = document.getElementById('el-contact-phone').value.trim();
            if (!email && !phone) {
                addMessage('Please enter an email or phone so we can follow up with your results.', 'bot');
                return;
            }
            document.getElementById('el-contact-form').remove();
            addMessage(email ? `📧 ${email}` : `📱 ${phone}`, 'user');
            advanceFlow({ email, phone });
        });
    }

    async function submitLead() {
        const name = document.getElementById('el-lead-name').value.trim();
        const email = document.getElementById('el-lead-email').value.trim();
        const phone = document.getElementById('el-lead-phone').value.trim();
        const btn = document.getElementById('el-lead-submit');

        if (!name && !email) {
            addMessage('Please enter at least your name or email so we can reach you.', 'bot');
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Submitting…';

        try {
            const resp = await fetch(`${API_BASE}/api/lead`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, name, email, phone }),
            });

            if (resp.ok) {
                document.getElementById('el-lead-form').remove();
                addMessage('✅ Thank you! Our team will be in touch within 1 business day. If you have any other questions, feel free to keep chatting here.', 'bot');
                showQuickReplies([
                    { id: 'more_questions', label: 'Ask another question' },
                    { id: 'start_over', label: 'Check another record' },
                ]);
                trackEvent('lead_submitted');
            } else {
                btn.disabled = false;
                btn.textContent = 'Get Free Consultation';
                addMessage('Something went wrong. Please try again or call us directly.', 'bot');
            }
        } catch {
            btn.disabled = false;
            btn.textContent = 'Get Free Consultation';
            addMessage('Connection error. Please try again.', 'bot');
        }
    }

    // ─── Flow engine ───────────────────────────────────────────────────────
    async function startFlow() {
        showTyping();
        try {
            const resp = await fetch(`${API_BASE}/api/flow/state`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId }),
            });
            const data = await resp.json();
            removeTyping();

            if (data.message) addMessage(data.message, 'bot');
            if (data.quickReplies) showQuickReplies(data.quickReplies);
            trackEvent('flow_started');
        } catch {
            removeTyping();
            showError('Could not connect. Please try again.');
        }
    }

    async function advanceFlow(input) {
        showTyping();
        try {
            const resp = await fetch(`${API_BASE}/api/flow/advance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, input }),
            });
            const data = await resp.json();
            removeTyping();

            if (data.eligibilityResult) {
                showEligibilityResult(data.eligibilityResult);
                trackEvent('eligibility_result', { bucket: data.eligibilityResult.bucket });
            }

            if (data.message) addMessage(data.message, 'bot');

            // Handle special input types
            if (data.inputType === 'lead_form') {
                showLeadForm();
            } else if (data.inputType === 'contact_form') {
                showContactForm();
            } else if (data.inputType === 'name' || data.inputType === 'offense') {
                // For text inputs, just let the user type in the text field
                document.getElementById('el-input').placeholder =
                    data.inputType === 'name' ? 'Enter your first name…' : 'Type your charges here…';
                document.getElementById('el-input').focus();
                // Temporarily override send to advance flow with text
                pendingInputType = data.inputType;
            } else if (data.quickReplies) {
                showQuickReplies(data.quickReplies);
            }

            retryCount = 0;
        } catch {
            removeTyping();
            showError('Connection lost. Please try again.');
        }
    }

    function handleQuickReply(replyId) {
        if (replyId === 'talk_human') {
            showLeadForm();
            return;
        }
        advanceFlow(replyId);
    }

    // ─── Free-form chat (AI) ──────────────────────────────────────────────
    let pendingInputType = null;

    async function handleSend() {
        const input = document.getElementById('el-input');
        const message = input.value.trim();
        if (!message || isLoading) return;

        input.value = '';
        input.placeholder = 'Type your message…';
        updateSendButtonState();
        removeQuickReplies();
        addMessage(message, 'user');

        // If we're expecting a specific input type, route to flow
        if (pendingInputType) {
            pendingInputType = null;
            advanceFlow(message);
            return;
        }

        trackEvent('message_sent');
        await sendToAI(message);
    }

    async function sendToAI(message) {
        isLoading = true;
        updateSendButtonState();
        showTyping();

        try {
            const resp = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, sessionId }),
            });

            removeTyping();

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                if (err.error) {
                    addMessage(err.error, 'bot');
                } else {
                    showError('Something went wrong. Please try again.');
                }
                return;
            }

            // Stream SSE
            const reader = resp.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let fullText = '';
            const msgEl = addMessage('', 'bot', 'el-streaming');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);

                        let delta = '';
                        // OpenAI / OpenClaw format
                        if (parsed.choices?.[0]?.delta?.content) {
                            delta = parsed.choices[0].delta.content;
                        }
                        // Anthropic format
                        else if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                            delta = parsed.delta.text;
                        }

                        if (delta) {
                            fullText += delta;
                            const bubbleEl = msgEl.querySelector('.el-msg-bubble');
                            if (bubbleEl) {
                                bubbleEl.innerHTML = formatMessage(fullText);
                            }
                            scrollToBottom();
                        }
                    } catch {/* skip invalid JSON */ }
                }
            }

            // Finalize
            if (msgEl.id === 'el-streaming') msgEl.removeAttribute('id');
            const timeEl = msgEl.querySelector('.el-msg-time');
            if (timeEl) timeEl.textContent = formatMessageTime();
            retryCount = 0;

            // Show follow-up quick replies
            showQuickReplies([
                { id: 'start_over', label: 'Check eligibility' },
                { id: 'talk_human', label: 'Talk to someone' },
            ]);

        } catch (err) {
            removeTyping();
            showError('Connection error. Please try again.');
        } finally {
            isLoading = false;
            updateSendButtonState();
        }
    }

    // ─── Error / retry ────────────────────────────────────────────────────
    function showError(text) {
        const msgs = document.getElementById('el-messages');
        const div = document.createElement('div');
        div.className = 'el-error-msg';
        div.innerHTML = `${text}<br><button class="el-retry-btn" type="button">Try again</button>`;
        msgs.appendChild(div);
        scrollToBottom(true);

        const retryBtn = div.querySelector('.el-retry-btn');
        retryBtn.addEventListener('click', () => {
            div.remove();
            retryCount++;
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            setTimeout(() => startFlow(), delay);
        });
    }

    // ─── Analytics ─────────────────────────────────────────────────────────
    function trackEvent(event, data) {
        fetch(`${API_BASE}/api/event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, event, data: data || '' }),
        }).catch(() => { }); // Fire and forget
    }

    // ─── Init ──────────────────────────────────────────────────────────────
    function init() {
        loadCSS();
        buildWidget();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
