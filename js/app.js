var $ = Dom7;

// Init F7 App
var app = new Framework7({
  el: '#app',
  name: 'Music Love',
  theme: 'ios',
  darkMode: true,
  colors: {
    primary: '#ff3b30',
  },
  routes: routes,
  view: {
    browserHistory: true,
    browserHistorySeparator: '#',
    browserHistoryRoot: '/',
    stackPages: true,
    pushState: true,
  },
  navbar: {
    hideOnPageScroll: false,
    showOnPageScrollEnd: true,
  },
  toolbar: {
    hideOnPageScroll: false,
    showOnPageScrollEnd: true,
  },
  touch: {
    tapHold: true,
    tapHoldDelay: 750,
    iosTouchRipple: false,
  },
  panel: {
    swipe: true,
    swipeOnlyClose: true,
  },
  // App root data
  data() {
    return {
      user: {
        firstName: 'Guest',
        lastName: 'User',
      },
    };
  },
  // App root methods
  methods: {
    // Your app methods
  },
  // App events
  on: {
    init: async function () {
      // Clear all caches on app startup
      if ('caches' in window) {
        try {
          const cacheKeys = await caches.keys();
          await Promise.all(
            cacheKeys.map(key => caches.delete(key))
          );
          console.log('[App] Successfully cleared all caches');
        } catch (error) {
          console.error('[App] Error clearing caches:', error);
        }
      }
      console.log('App initialized');

      // Lazy-load deferred iframes when their tab is activated.
      // Use Framework7's tab:show event so we don't conflict with F7 tab handling.
      function activateDeferredIframes(tab) {
        tab.querySelectorAll('iframe[data-src]').forEach(iframe => {
          iframe.src = iframe.dataset.src;
          iframe.removeAttribute('data-src');
        });
      }

      // Activate iframes in the initially active tab
      const initialTab = document.querySelector('.tab.tab-active');
      if (initialTab) {
        activateDeferredIframes(initialTab);
      }

      // Let Framework7 manage tab switching; fire deferred load on show
      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('tab:show', () => activateDeferredIframes(tab));
      });
    },
    pageInit: function () {
      console.log('Page initialized');
    },
  },
});

// Export app variable
export default app;
