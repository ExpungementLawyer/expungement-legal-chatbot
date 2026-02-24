import React from 'react';
import { createRoot } from 'react-dom/client';
import WidgetApp from './app/WidgetApp';

const WIDGET_VERSION = '2026-02-24.11';

function resolveScriptTag() {
  if (document.currentScript) return document.currentScript;

  const scripts = Array.from(document.getElementsByTagName('script')).reverse();
  return (
    scripts.find((node) => /widget\.js(\?|$)/.test(node.getAttribute('src') || '') && node.hasAttribute('data-api')) ||
    scripts.find((node) => /widget\.js(\?|$)/.test(node.getAttribute('src') || '')) ||
    null
  );
}

function resolveApiBase(scriptTag) {
  try {
    const fromAttr = scriptTag?.getAttribute('data-api');
    if (fromAttr) return fromAttr.replace(/\/$/, '');

    const fromScript = scriptTag?.src ? new URL(scriptTag.src, window.location.href).origin : '';
    if (fromScript) return fromScript.replace(/\/$/, '');

    return window.location.origin;
  } catch {
    return window.location.origin;
  }
}

function ensureCss(apiBase) {
  const existing = document.getElementById('el-legal-widget-css');
  if (existing) return;

  const link = document.createElement('link');
  link.id = 'el-legal-widget-css';
  link.rel = 'stylesheet';
  link.href = `${apiBase}/widget.css?v=${encodeURIComponent(WIDGET_VERSION)}`;
  document.head.appendChild(link);
}

function mountWidget() {
  if (document.getElementById('el-legal-widget-app')) return;

  const scriptTag = resolveScriptTag();
  const apiBase = resolveApiBase(scriptTag);

  ensureCss(apiBase);

  const mountPoint = document.createElement('div');
  mountPoint.id = 'el-legal-widget-app';
  document.body.appendChild(mountPoint);

  createRoot(mountPoint).render(<WidgetApp apiBase={apiBase} />);

  console.info(`[Expungement Widget ${WIDGET_VERSION}] API base: ${apiBase}`);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountWidget);
} else {
  mountWidget();
}
