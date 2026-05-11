/* --- A place where you can add your own code -- */

const shellStorageKey = 'musiclove:shell:embedded-tabs';
const shellFrameSources = new Map();
const shellAllowedOrigins = new Set([
  window.location.origin,
  'https://play.theradio.fm',
  'https://browser.theradio.fm',
  'https://podcasts.theradio.fm',
  'https://tubeflix.theradio.fm',
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
  // Lets cross-origin embeds use the Storage Access API (cookies / unpartitioned storage).
  permissions.add('storage-access *');
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

/** Mixpanel: matches toolbar tabs + cover (tab-0); properties use snake_case */
const SHELL_TAB_ANALYTICS = {
  '#tab-0': { tab_name: 'Cover', tab_id: 'tab-0' },
  '#tab-1': { tab_name: 'Live Radio Player', tab_id: 'tab-1' },
  '#tab-2': { tab_name: 'Radio Browser', tab_id: 'tab-2' },
  '#tab-3': { tab_name: 'Podcast Player', tab_id: 'tab-3' },
  '#tab-4': { tab_name: 'TubeFlix.net Player', tab_id: 'tab-4' },
};

function trackShellTabActivated(targetId) {
  const mp = typeof window !== 'undefined' ? window.mixpanel : undefined;
  if (!mp || typeof mp.track !== 'function') {
    return;
  }

  const meta = SHELL_TAB_ANALYTICS[targetId];
  const payload = meta
    ? { tab_name: meta.tab_name, tab_id: meta.tab_id, url: window.location.href }
    : { tab_name: targetId, tab_id: targetId.replace(/^#/, ''), url: window.location.href };

  mp.track('Tab Clicked', payload);
}

function getActiveShellTabId() {
  const active = document.querySelector('.tabs .tab.tab-active');
  return active && active.id ? `#${active.id}` : null;
}

function activateShellTab(targetId, options) {
  const skipAnalytics = options && options.skipAnalytics === true;

  if (!targetId) {
    return;
  }

  const targetTab = document.querySelector(targetId);

  if (!targetTab) {
    return;
  }

  const previousTabId = getActiveShellTabId();
  const tabChanged = previousTabId !== targetId;

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

  if (!skipAnalytics && tabChanged) {
    trackShellTabActivated(targetId);
  }
}

function getIframeTabId(iframe) {
  const tab = iframe.closest('.tab');
  return tab ? `#${tab.id}` : null;
}

function getIframeEmbedOrigin(iframe) {
  const src = iframe.getAttribute('src');
  if (!src || src.startsWith('about:')) {
    return null;
  }
  try {
    return new URL(src, window.location.href).origin;
  } catch {
    return null;
  }
}

/**
 * Top-level delegation for third-party storage (Chrome et al.). Requires transient user
 * activation when calling from a tab click. Embedded origins still may need to call
 * document.requestStorageAccess() inside the iframe for full access in all browsers.
 */
function requestStorageAccessForEmbeddedIframe(iframe) {
  const origin = getIframeEmbedOrigin(iframe);
  if (!origin || origin === window.location.origin) {
    return;
  }
  if (typeof document.requestStorageAccessFor !== 'function') {
    return;
  }
  document.requestStorageAccessFor(origin).catch(() => {});
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
        const targetTab = document.querySelector(targetId);
        const iframe = targetTab && targetTab.querySelector('iframe.embed-responsive-item');
        if (iframe) {
          requestStorageAccessForEmbeddedIframe(iframe);
        }
      }
    });
  });

  // Cover (tab-0) on every load only; do not restore last-open tab from storage.
  activateShellTab('#tab-0', { skipAnalytics: true });
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

function getOgShareImageUrl() {
  const og = document.querySelector('meta[property="og:image"]');
  const raw = og?.getAttribute('content')?.trim();
  if (raw) {
    try {
      return new URL(raw, document.baseURI).href;
    } catch {
      return raw;
    }
  }
  const tw = document.querySelector('meta[name="twitter:image"]');
  const twRaw = tw?.getAttribute('content')?.trim();
  if (twRaw) {
    try {
      return new URL(twRaw, document.baseURI).href;
    } catch {
      return twRaw;
    }
  }
  return null;
}

async function sharePayloadWithOgImage(basePayload) {
  const base = basePayload || {};
  const { files: _ignoredEmbedFiles, ...rest } = base;

  const ogUrl = getOgShareImageUrl();
  if (!ogUrl) {
    return base;
  }

  let blob;
  try {
    const res = await fetch(ogUrl, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) {
      return base;
    }
    blob = await res.blob();
  } catch {
    return base;
  }

  if (!blob?.size) {
    return base;
  }

  const mime = blob.type && blob.type.startsWith('image/') ? blob.type : 'image/png';
  const imageFile = new File([blob], 'share.png', { type: mime });

  const { url: _omitUrl, ...restWithoutUrl } = rest;
  const candidates = [
    { ...rest, files: [imageFile] },
    { ...restWithoutUrl, files: [imageFile] },
    { title: rest.title, text: rest.text, files: [imageFile] },
    { text: rest.text || rest.title, files: [imageFile] },
    { files: [imageFile] },
  ];

  for (const data of candidates) {
    if (!data.files?.length) {
      continue;
    }
    if (typeof navigator.canShare !== 'function' || navigator.canShare(data)) {
      return data;
    }
  }

  return base;
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
    const sharePayload = await sharePayloadWithOgImage(data.payload || {});
    await navigator.share(sharePayload);
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

function handleWebradioStorageBridge(event) {
  var data = event.data;
  if (!data || typeof data !== 'object') return;
  var type = data.type;
  if (type !== 'WEBRADIO_SET' && type !== 'WEBRADIO_GET_REQUEST') return;

  var allowedWebradioOrigins = new Set([
    'https://play.theradio.fm',
    'https://browser.theradio.fm',
    'https://podcasts.theradio.fm',
    'https://tubeflix.theradio.fm',
  ]);
  if (!allowedWebradioOrigins.has(event.origin)) return;

  if (type === 'WEBRADIO_SET' && data.key != null) {
    var val = data.value == null ? '' : String(data.value);
    if (typeof TheradioSharedKV !== 'undefined' && TheradioSharedKV.setItem) {
      TheradioSharedKV.setItem(data.key, val);
    }
    try {
      localStorage.setItem(data.key, val);
    } catch (e) {}
    return;
  }

  if (type === 'WEBRADIO_GET_REQUEST' && data.reqId != null && data.key != null) {
    var read = null;
    if (typeof TheradioSharedKV !== 'undefined' && TheradioSharedKV.getItem) {
      read = TheradioSharedKV.getItem(data.key);
    }
    if (read == null) {
      try {
        read = localStorage.getItem(data.key);
      } catch (e) {}
    }
    if (event.source && typeof event.source.postMessage === 'function') {
      event.source.postMessage(
        {
          type: 'WEBRADIO_GET_RESPONSE',
          key: data.key,
          value: read,
          reqId: data.reqId,
        },
        event.origin
      );
    }
  }
}

window.addEventListener('message', handleEmbeddedShareMessage);
window.addEventListener('message', handleEmbeddedFullscreenMessage);
window.addEventListener('message', handleWebradioStorageBridge);
document.addEventListener('fullscreenchange', syncFullscreenShellContext);
document.addEventListener('webkitfullscreenchange', syncFullscreenShellContext);
document.addEventListener('DOMContentLoaded', setupEmbeddedTabPersistence);
