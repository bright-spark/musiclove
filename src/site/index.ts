document.addEventListener('DOMContentLoaded', function () {
  if (typeof thoriumCorePlugin !== 'undefined') {
    thoriumCorePlugin.appLoaded();
  }
});

if (window.mixpanel && typeof window.mixpanel.init === 'function') {
  window.mixpanel.init('d3adebe9e832cbe08f347e5605206f9a', {
    debug: false,
    track_pageview: true,
    persistence: 'localStorage',
  });
}

const startTime = Date.now();

window.addEventListener('beforeunload', function () {
  const endTime = Date.now();
  const timeSpent = (endTime - startTime) / 1000;

  if (!window.mixpanel || typeof window.mixpanel.track !== 'function') {
    return;
  }

  window.mixpanel.track('Time Engaged', {
    time_spent_seconds: timeSpent,
    url: window.location.href,
  });
});
