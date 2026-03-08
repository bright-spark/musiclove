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
      
      // Set up tab functionality
      const tabLinks = document.querySelectorAll('.tab-link');
      const tabs = document.querySelectorAll('.tab');

      // Lazy-load deferred iframes when their tab is activated
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

      tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();

          // Remove active classes
          tabLinks.forEach(l => l.classList.remove('tab-link-active'));
          tabs.forEach(t => t.classList.remove('tab-active'));

          // Add active class to clicked tab
          link.classList.add('tab-link-active');

          // Get target tab ID and activate it
          const targetId = link.getAttribute('href');
          const targetTab = document.querySelector(targetId);
          if (targetTab) {
            targetTab.classList.add('tab-active');
            activateDeferredIframes(targetTab);
          }
        });
      });
    },
    pageInit: function () {
      console.log('Page initialized');
    },
  },
});

// Export app variable
export default app;
