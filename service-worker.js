/*!
 * Generic Service Worker for theradiofm projects
 * Version 3.4 january, 2022
 * Copyright 2018-2022 Nymphide Lab.
*/

const origin=self.location.origin;
const skipAllExternalUrl=true;
const blacklist=["https://firestore.googleapis.com","version.json",".php","%7B%7Binstimage%7D%7D"];
const preloadList=['./','./offline.html', './index.html', './manifest.json', './favicon.ico', './assets/css/style.css', './assets/js/main.js', './assets/js/jquery-3.6.0.min.js', './assets/js/bootstrap.bundle.min.js', './assets/js/bootstrap.bundle.min.js.map', './assets/js/bootstrap.min.js ', './assets/js/bootstrap.min.js.map', './assets/js/popper.min.js', './assets/js/popper.min.js.map', './assets/js/jquery-3.6.0.min.js', './assets/js/jquery-3.6.0.min.map', './assets/js/jquery-3.6.0.slim.min.js', './assets/js/jquery-3.6.0.slim.min.map', './assets/js/jquery-3.6.0.slim.min.js', './assets/js/jquery-3.6.0.slim.min.map', './assets/js/bootstrap.min.js', './assets/js/bootstrap.min.js.map', './assets/js/popper.min.js', './assets/js/popper.min.js.map', './assets/js/jquery-3.6.0.min.js', './assets/js/jquery-3.6.0.min.map', './assets/js/jquery-3.6.0.slim.min.js', './assets/js/jquery-3.6.0.slim.min.map', './assets/js/jquery-3.6.0.slim.min.js', './assets/js/jquery-3.6.0.slim.min.map', './assets/js/bootstrap.min.js', './assets/js/bootstrap.min.js.map', './assets/js/popper.min.js', './assets/js/popper.min.js.map', './assets/js/jquery-3.6.0.min.js', './assets/js/jquery-3.6.0.min.map', './assets/js/jquery-3.6.0.slim.min.js', './assets/js/jquery-3.6.0.slim.min.map', './assets/js/jquery-3.6.0.slim.min.js', './assets/js/jquery-3.6.0.slim.min.map', './assets/js/bootstrap.min.js', './assets/js/bootstrap.min.js.map', './assets/js/popper.min.js', './assets/js/popper.min.js.map', './assets/js/jquery-3.6.0.min.js', './assets/js/jquery-3.6.0.min.map', './assets/js/jquery-3.6.0.slim.min.js', './assets/js/jquery-3.6.0.slim.min.map', './assets/js/jquery-3.6.0.slim.min.js', './assets/js/jquery-3.6.0.slim.min.map', './assets/js/bootstrap.min.js', './assets/js/bootstrap.min.js.map', './assets/js/popper.min.js', './assets/js/popper.min.js.map', './assets/js/jquery-3.6.0.min.js', './assets/js/jquery-3.6.0.min.map', './assets]  // List of files to be preloaded in the cache

function isRejectable(url) {
  if ((skipAllExternalUrl == true) && (url.indexOf(origin) == -1)) {
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

/* -- SW Initialization --*/
var preLoad = function(){
  console.log('[fm.theradio.serviceworker] Service Worker Installation');
  return caches.open('theradiofm-cache')
  .then(function(cache) {
    return cache.addAll(preloadList);
  });
}

self.addEventListener('activate', function(event) {
  console.log('[fm.theradio.serviceworker] service worker activated');
});

/* -- SW Fetch during use --*/
self.addEventListener('fetch', function(event) {
  if ( isRejectable(event.request.url)==true) {
    console.log('[fm.theradio.serviceworker] request rejected '+event.request.url);
    return;
  }
  event.respondWith(
    checkResponse(event.request)
    .catch(function() {
      console.log('[fm.theradio.serviceworker] file returned from cache: '+event.request.url);
      return returnFromCache(event.request);
    }
  ));
  event.waitUntil(
    addToCache(event.request)
  );
});

var checkResponse = function(request){
  return new Promise(function(fulfill, reject) {
    fetch(request)
    .then(function(response){
      if(response.status !== 404) {
        console.log('[fm.theradio.serviceworker] Response Status '+response.status+": "+request.url);
        fulfill(response)
      } else {
        console.log("[fm.theradio.serviceworker] reject response for url "+request.url);
        reject();
      }
    }, reject)
  });
};

var addToCache = function (request) {
  try {
    return caches.open('theradiofm-cache').then(function (cache) {
      return fetch(request)
        .then(function (response) {
          console.log('fm.theradio.serviceworker] file added to cache ' + request.url);
          return cache.put(request, response);
        });
    });
  }
  catch(err) {
    console.log('fm.theradio.serviceworker] error ' + err.message);
  }  
};

var returnFromCache = function (request) {
  return caches.open('theradiofm-cache')
    .then(function (cache) {
      return cache.match(request)
        .then(function (matching) {
          if (!matching || matching.status == 404) {
            console.log("[fm.theradio.serviceworker] offline page");
            return cache.match('offline.html');
          } else {
            console.log("[fm.theradio.serviceworker] cache returned " + request.url);
            return matching
          }
        });
    });
};