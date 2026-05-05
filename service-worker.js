/*!
 * Generic Service Worker for Thorium projects
 * Version 3.4 january, 2022
 * Copyright 2018-2022 Nymphide Lab.
 * https://www.nymphidelab.com
 * MIT License
 * See the file LICENSE for details.
*/

const CACHE_NAME = 'musiclove-cache-v41';
const APP_SHELL = [
  './',
  './offline.html',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './css/app.css',
  './css/framework7-bundle.min.css',
  './css/framework7-keypad.min.css',
  './css/thorium.min.css',
  './css/classes.css',
  './css/custom.css',
  './css/pages/index.css',
  './js/framework/framework7-bundle.min.js',
  './js/thorium.config.js',
  './js/plugins/thorium.core.min.js',
  './js/iframe-style-injector.js',
  './js/custom.js',
  './js/service-worker-register.js',
  './font-awesome/css/font-awesome.min.css'
];

function isSameOriginRequest(request) {
  return new URL(request.url).origin === self.location.origin;
}

// Function to get current cache name
async function getCurrentCacheName() {
  try {
    const response = await fetch('./version.json');
    if (response.ok) {
      const versionData = await response.json();
      return `${CACHE_NAME}${versionData.version}`;
    }
  } catch (error) {
    console.log('[ServiceWorker] Version check failed:', error);
  }
  return CACHE_NAME + '0';
}

// Function to check if cache needs update
async function checkForUpdates() {
  try {
    const response = await fetch('./version.json');
    if (response.ok) {
      const versionData = await response.json();
      const currentCacheName = await getCurrentCacheName();
      const expectedCacheName = `${CACHE_NAME}${versionData.version}`;
      
      if (currentCacheName !== expectedCacheName) {
        console.log('[ServiceWorker] New version detected, clearing cache');
        await clearOldCache();
        return true;
      }
    }
  } catch (error) {
    console.log('[ServiceWorker] Version check failed:', error);
  }
  return false;
}

// Clear old cache
async function clearOldCache() {
  const cacheNames = await caches.keys();
  const currentCacheName = await getCurrentCacheName();
  await Promise.all(
    cacheNames.map(cacheName => {
      if (cacheName.startsWith(CACHE_NAME) && cacheName !== currentCacheName) {
        return caches.delete(cacheName);
      }
    })
  );
}

// Install event - cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cacheName = await getCurrentCacheName();
      const cache = await caches.open(cacheName);
      console.log('[ServiceWorker] Caching app shell');
      await Promise.all(
        APP_SHELL.map(async asset => {
          try {
            await cache.add(asset);
          } catch (error) {
            console.log('[ServiceWorker] Failed to cache app shell asset:', asset, error);
          }
        })
      );
      console.log('[ServiceWorker] App shell cached');
      return self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      clearOldCache(),
      self.clients.claim()
    ])
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  if (!isSameOriginRequest(event.request)) return;

  // Skip certain URLs
  if (event.request.url.includes('firestore.googleapis.com')) return;
  if (event.request.url.includes('.php')) return;

  event.respondWith(
    (async () => {
      const cacheName = await getCurrentCacheName();
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        // If we have a cached response, check if we need to update cache
        event.waitUntil(
          (async () => {
            try {
              const needsUpdate = await checkForUpdates();
              if (needsUpdate) {
                const networkResponse = await fetch(event.request);
                if (networkResponse.ok) {
                  const newCache = await caches.open(await getCurrentCacheName());
                  await newCache.put(event.request, networkResponse.clone());
                }
              }
            } catch (error) {
              console.log('[ServiceWorker] Update check failed:', error);
            }
          })()
        );
        return cachedResponse;
      }

      // If not in cache, try network
      try {
        const networkResponse = await fetch(event.request);
        // Cache successful responses
        if (networkResponse.ok) {
          await cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // If both cache and network fail, show offline page
        const offlineResponse = await cache.match('./offline.html');
        if (offlineResponse) {
          return offlineResponse;
        }
        throw error;
      }
    })()
  );
});