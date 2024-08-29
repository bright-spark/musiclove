const origin = self.location.origin;
const skipAllExternalUrl = true;
const blacklist = ["https://firestore.googleapis.com", "version.json", ".php", "%7B%7Binstimage%7D%7D"];
const preloadList = ['./', './offline.html', './index.html', './manifest.json'];
const generalCacheName = 'theradio-plus-v14.1';

function isRejectable(url) {
  if ((skipAllExternalUrl === true) && (url.indexOf(origin) === -1)) {
    return true;
  } else {
    if (blacklist.some(v => url.includes(v))) {
      return true;
    } else {
      return false;
    }
  }
}

self.addEventListener('install', function(event) {
  event.waitUntil(preLoad());
  console.log('[fm.theradio.serviceworker] Service Worker Initialized');
});

var preLoad = function(){
  console.log('[fm.theradio.serviceworker] Service Worker Installation');
  return caches.open(generalCacheName)
  .then(function(cache) {
    return cache.addAll(preloadList);
  });
}

self.addEventListener('activate', function(event) {
  console.log('[fm.theradio.serviceworker] service worker activated');
});

self.addEventListener('fetch', function(event) {
  if (isRejectable(event.request.url)) {
    console.log('[fm.theradio.serviceworker] request rejected ' + event.request.url);
    return;
  }
  
  event.respondWith(
    checkResponse(event.request)
    .catch(function() {
      console.log('[fm.theradio.serviceworker] file returned from cache: ' + event.request.url);
      return returnFromCache(event.request);
    })
  );
  event.waitUntil(
    addToCache(event.request, generalCacheName)
  );
});

var checkResponse = function(request){
  return new Promise(function(fulfill, reject) {
    fetch(request)
    .then(function(response){
      if(response.status !== 404) {
        console.log('[fm.theradio.serviceworker] Response Status ' + response.status + ": " + request.url);
        fulfill(response);
      } else {
        console.log("[fm.theradio.serviceworker] reject response for url " + request.url);
        reject();
      }
    }, reject);
  });
};

var addToCache = function(request, cacheName) {
  try {
    return caches.open(cacheName).then(function(cache) {
      return fetch(request)
        .then(function(response) {
          if (response.ok) {
            console.log('[fm.theradio.serviceworker] file added to cache ' + request.url);
            return cache.put(request, response);
          }
        });
    });
  } catch(err) {
    console.log('[fm.theradio.serviceworker] error ' + err.message);
  }  
};

var returnFromCache = function(request) {
  return caches.open(generalCacheName)
    .then(function(cache) {
      return cache.match(request)
        .then(function(matching) {
          if (!matching || matching.status === 404) {
            console.log("[fm.theradio.serviceworker] offline page");
            return cache.match('offline.html');
          } else {
            console.log("[fm.theradio.serviceworker] cache returned " + request.url);
            return matching;
          }
        });
    });
};
