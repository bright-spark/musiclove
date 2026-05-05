/* --- A place where you can add your own code -- */

const shellStorageKey = 'musiclove:shell:embedded-tabs';
const shellFrameSources = new Map();
const shellAllowedOrigins = new Set([
  window.location.origin,
  'https://play.theradio.fm',
  'https://freetheradio.replit.app',
  'https://v0-podcast-app-two.vercel.app',
  'https://tubeflix.net',
]);
let shellActiveFrameKey = null;

function getShellState() {
  try {
    return JSON.parse(localStorage.getItem(shellStorageKey)) || {};
  } catch (error) {
    return {};
  }
}

function setShellState(nextState) {
  localStorage.setItem(shellStorageKey, JSON.stringify(nextState));
}

function getFrameKey(iframe) {
  return iframe.id || iframe.title || iframe.src;
}

function normalizeIframePermissions(iframe) {
  const permissions = new Set(
    (iframe.getAttribute('allow') || '')
      .split(';')
      .map((permission) => permission.trim())
      .filter(Boolean)
  );

  permissions.add('web-share');
  permissions.add('fullscreen');
  iframe.setAttribute('allow', Array.from(permissions).join('; '));
  iframe.setAttribute('allowfullscreen', '');
}

function persistIframeSettings(iframe) {
  const state = getShellState();
  state.iframes = state.iframes || {};
  state.iframes[getFrameKey(iframe)] = {
    src: iframe.getAttribute('src'),
    allow: iframe.getAttribute('allow') || '',
    scrolling: iframe.getAttribute('scrolling') || '',
  };
  setShellState(state);
}

function restoreIframeSettings(iframe) {
  const state = getShellState();
  const saved = state.iframes && state.iframes[getFrameKey(iframe)];

  if (saved) {
    if (saved.allow) {
      iframe.setAttribute('allow', saved.allow);
    }

    if (saved.scrolling) {
      iframe.setAttribute('scrolling', saved.scrolling);
    }
  }

  normalizeIframePermissions(iframe);
  persistIframeSettings(iframe);
}

function activateShellTab(targetId) {
  if (!targetId) {
    return;
  }

  const targetTab = document.querySelector(targetId);

  if (!targetTab) {
    return;
  }

  document.querySelectorAll('.tab-link').forEach((link) => {
    link.classList.toggle('tab-link-active', link.getAttribute('href') === targetId);
  });

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('tab-active', `#${tab.id}` === targetId);
  });

  const activeIframe = targetTab.querySelector('iframe.embed-responsive-item');
  shellActiveFrameKey = activeIframe ? getFrameKey(activeIframe) : null;

  const state = getShellState();
  state.activeTab = targetId;
  state.activeFrame = shellActiveFrameKey;
  setShellState(state);
}

function getIframeTabId(iframe) {
  const tab = iframe.closest('.tab');
  return tab ? `#${tab.id}` : null;
}

function registerShellFrame(iframe) {
  if (iframe.contentWindow) {
    shellFrameSources.set(iframe.contentWindow, iframe);
  }
}

function getMessageIframe(event) {
  return shellFrameSources.get(event.source) || null;
}

function postMessageToIframe(iframe, message, origin) {
  if (!iframe || !iframe.contentWindow || !shellAllowedOrigins.has(origin)) {
    return;
  }

  iframe.contentWindow.postMessage(message, origin);
}

function isAllowedShellOrigin(event) {
  return shellAllowedOrigins.has(event.origin);
}

function setupEmbeddedTabPersistence() {
  document.querySelectorAll('iframe.embed-responsive-item').forEach((iframe) => {
    restoreIframeSettings(iframe);
    registerShellFrame(iframe);
    iframe.addEventListener('load', () => {
      registerShellFrame(iframe);
      persistIframeSettings(iframe);
    });
  });

  document.querySelectorAll('.tab-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');

      if (targetId) {
        activateShellTab(targetId);
      }
    });
  });

  // Cover (tab-0) on every load only; do not restore last-open tab from storage.
  activateShellTab('#tab-0');
}

function syncFullscreenShellContext() {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  const iframe = fullscreenElement && fullscreenElement.matches && fullscreenElement.matches('iframe.embed-responsive-item') ? fullscreenElement : null;

  if (!iframe) {
    return;
  }

  const tabId = getIframeTabId(iframe);

  if (tabId) {
    activateShellTab(tabId);
  }
}

async function handleEmbeddedShareMessage(event) {
  const data = event.data;

  if (!data || (data.type !== 'web-share' && data.type !== 'media-share')) {
    return;
  }

  const iframe = getMessageIframe(event);
  const frameKey = iframe ? getFrameKey(iframe) : null;
  const tabId = iframe ? getIframeTabId(iframe) : null;

  if (!isAllowedShellOrigin(event)) {
    postMessageToIframe(iframe, { type: 'web-share-result', ok: false, error: 'Message origin is not allowed', frameKey, tabId }, event.origin);
    return;
  }

  if (!iframe || (shellActiveFrameKey && frameKey !== shellActiveFrameKey)) {
    postMessageToIframe(iframe, { type: 'web-share-result', ok: false, error: 'Share request does not match the active shell tab', frameKey, tabId }, event.origin);
    return;
  }

  if (!navigator.share) {
    postMessageToIframe(iframe, { type: 'web-share-result', ok: false, error: 'Web Share API is not available', frameKey, tabId }, event.origin);
    return;
  }

  try {
    await navigator.share(data.payload || {});
    postMessageToIframe(iframe, { type: 'web-share-result', ok: true, frameKey, tabId }, event.origin);
  } catch (error) {
    postMessageToIframe(iframe, { type: 'web-share-result', ok: false, error: error.message, frameKey, tabId }, event.origin);
  }
}

function handleEmbeddedFullscreenMessage(event) {
  const data = event.data;

  if (!data || data.type !== 'shell-fullscreen-opened') {
    return;
  }

  const iframe = getMessageIframe(event);

  if (!iframe) {
    return;
  }

  if (!isAllowedShellOrigin(event)) {
    return;
  }

  const tabId = getIframeTabId(iframe);

  if (tabId) {
    activateShellTab(tabId);
  }
}

window.addEventListener('message', handleEmbeddedShareMessage);
window.addEventListener('message', handleEmbeddedFullscreenMessage);
document.addEventListener('fullscreenchange', syncFullscreenShellContext);
document.addEventListener('webkitfullscreenchange', syncFullscreenShellContext);
document.addEventListener('DOMContentLoaded', setupEmbeddedTabPersistence);
