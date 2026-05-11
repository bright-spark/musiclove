/**
 * Cross-subdomain key/value store for *.theradio.fm using cookies (Domain=.theradio.fm).
 * localStorage is isolated per origin; cookies set with this domain are visible on all subdomains.
 *
 * Large values are split across tr_kv_v1_0, tr_kv_v1_1, … — keep entries reasonable (prefs, not big queues).
 */
(function (global) {
  var COOKIE_BASE = 'tr_kv_v1';
  var DOMAIN = '.theradio.fm';
  var MAX_AGE_SEC = 400 * 24 * 60 * 60;
  var CHUNK = 3500;
  var MAX_COOKIE_CHUNKS = 96;

  function isTheradioProdHost() {
    if (typeof location === 'undefined') return false;
    var h = location.hostname;
    return h === 'theradio.fm' || /\.theradio\.fm$/i.test(h);
  }

  function getCookieMap() {
    var out = {};
    if (typeof document === 'undefined' || !document.cookie) return out;
    document.cookie.split(';').forEach(function (part) {
      var i = part.indexOf('=');
      if (i < 0) return;
      var k = part.slice(0, i).trim();
      var v = part.slice(i + 1).trim();
      out[k] = decodeURIComponent(v.replace(/\+/g, ' '));
    });
    return out;
  }

  function readChunks() {
    var map = getCookieMap();
    var single = map[COOKIE_BASE];
    if (single !== undefined) return single;

    var parts = [];
    for (var n = 0; n < MAX_COOKIE_CHUNKS; n++) {
      var key = COOKIE_BASE + '_' + n;
      if (!(key in map)) break;
      parts.push(map[key]);
    }
    return parts.length ? parts.join('') : '';
  }

  function parseBag(raw) {
    if (!raw) return {};
    try {
      var o = JSON.parse(raw);
      return typeof o === 'object' && o !== null && !Array.isArray(o) ? o : {};
    } catch (e) {
      return {};
    }
  }

  function loadBag() {
    return parseBag(readChunks());
  }

  function clearOldChunks(map) {
    for (var k in map) {
      if (Object.prototype.hasOwnProperty.call(map, k) && k.indexOf(COOKIE_BASE) === 0) {
        document.cookie =
          k +
          '=; Max-Age=0; domain=' +
          DOMAIN +
          '; path=/; Secure; SameSite=Lax';
      }
    }
  }

  function writeBag(bag) {
    if (typeof document === 'undefined') return;
    var json = JSON.stringify(bag);
    var map = getCookieMap();
    clearOldChunks(map);

    if (json.length <= CHUNK) {
      document.cookie =
        COOKIE_BASE +
        '=' +
        encodeURIComponent(json) +
        '; domain=' +
        DOMAIN +
        '; path=/; Max-Age=' +
        MAX_AGE_SEC +
        '; Secure; SameSite=Lax';
      return;
    }

    var chunks = [];
    for (var i = 0; i < json.length; i += CHUNK) {
      chunks.push(json.slice(i, i + CHUNK));
    }
    chunks.forEach(function (chunk, idx) {
      document.cookie =
        COOKIE_BASE +
        '_' +
        idx +
        '=' +
        encodeURIComponent(chunk) +
        '; domain=' +
        DOMAIN +
        '; path=/; Max-Age=' +
        MAX_AGE_SEC +
        '; Secure; SameSite=Lax';
    });
  }

  function mirrorLocal(key, value) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) {}
  }

  global.TheradioSharedKV = {
    isActive: function () {
      return isTheradioProdHost();
    },

    /** @returns {string|null} */
    getItem: function (key) {
      if (!isTheradioProdHost()) {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          return null;
        }
      }
      var bag = loadBag();
      if (Object.prototype.hasOwnProperty.call(bag, key) && bag[key] !== undefined) {
        return bag[key];
      }
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },

    setItem: function (key, value) {
      if (!isTheradioProdHost()) {
        try {
          localStorage.setItem(key, value);
        } catch (e) {}
        return;
      }
      var bag = loadBag();
      bag[key] = value;
      bag._u = Date.now().toString(36);
      writeBag(bag);
      mirrorLocal(key, value);
    },

    removeItem: function (key) {
      if (!isTheradioProdHost()) {
        try {
          localStorage.removeItem(key);
        } catch (e) {}
        return;
      }
      var bag = loadBag();
      delete bag[key];
      bag._u = Date.now().toString(36);
      writeBag(bag);
      mirrorLocal(key, null);
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
