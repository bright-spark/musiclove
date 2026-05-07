var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
import indexHtmlSource from "./69545e46d75f4ec83e5c1ab52a742bea0083dbea-index-html-embed.txt";
var THERADIOFM_WEBRADIO = "https://theradiofm.webradiosite.com";
var ROOT_EMBED_SHELL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>theradio.fm</title>
  <style>
    html, body { margin: 0; height: 100%; overflow: hidden; background: #000; }
    iframe { display: block; width: 100%; height: 100%; border: 0; }
  </style>
</head>
<body>
  <iframe
    src="${THERADIOFM_WEBRADIO}/"
    title="theradio.fm"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    loading="eager"
    referrerpolicy="strict-origin-when-cross-origin"
  ></iframe>
</body>
</html>
`;
var CRAWLER_USER_AGENT_PATTERN = /bot|crawler|spider|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|pinterest|embedly|quora link preview|outbrain|vkshare|skypeuripreview|ia_archiver/i;
var STATIC_ASSET_PATH_PATTERN = /^\/(?:assets|css|font-awesome|icons|js|pages|screenshots)\//i;
var FILE_EXTENSION_PATTERN = /\.[a-z0-9]{2,8}$/i;
function isStaticAssetPath(pathname) {
  return STATIC_ASSET_PATH_PATTERN.test(pathname) || FILE_EXTENSION_PATTERN.test(pathname);
}
__name(isStaticAssetPath, "isStaticAssetPath");
function isCrawlerRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";
  return request.method === "GET" && !isStaticAssetPath(url.pathname) && CRAWLER_USER_AGENT_PATTERN.test(userAgent);
}
__name(isCrawlerRequest, "isCrawlerRequest");
function isAppPagePath(pathname) {
  return pathname === "/app" || pathname === "/app/";
}
__name(isAppPagePath, "isAppPagePath");
function isRootDocumentPath(pathname) {
  return pathname === "/" || pathname === "/index.html";
}
__name(isRootDocumentPath, "isRootDocumentPath");
function buildProxyRequest(request) {
  const incomingUrl = new URL(request.url);
  const proxyUrl = new URL(incomingUrl.pathname + incomingUrl.search, "https://play.theradio.fm");
  const userAgent = request.headers.get("user-agent") || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  const headers = new Headers({
    accept: request.headers.get("accept") || "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "accept-language": request.headers.get("accept-language") || "en-US,en;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "user-agent": userAgent,
    "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1"
  });
  return new Request(proxyUrl.toString(), {
    method: "GET",
    headers,
    redirect: "follow"
  });
}
__name(buildProxyRequest, "buildProxyRequest");
async function fetchWithRedirects(request, maxRedirects = 5) {
  let currentRequest = request;
  let redirectCount = 0;
  const redirectHistory = [];
  while (redirectCount < maxRedirects) {
    const response = await fetch(currentRequest, { redirect: "manual" });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      redirectHistory.push(`${response.status} -> ${location}`);
      if (!location) {
        throw new Error(`Redirect ${response.status} without Location header`);
      }
      currentRequest = new Request(location, {
        method: "GET",
        headers: currentRequest.headers
      });
      redirectCount++;
    } else {
      return { response, redirectHistory };
    }
  }
  throw new Error(`Too many redirects: ${redirectHistory.join(", ")}`);
}
__name(fetchWithRedirects, "fetchWithRedirects");
var src_default = {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      if (isAppPagePath(url.pathname)) {
        if (request.method !== "GET" && request.method !== "HEAD") {
          return new Response("Method Not Allowed", { status: 405 });
        }
        return new Response(request.method === "HEAD" ? null : indexHtmlSource, {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, max-age=300, s-maxage=600"
          }
        });
      }
      if (!isCrawlerRequest(request)) {
        if (request.method === "GET" && isRootDocumentPath(url.pathname)) {
          return new Response(ROOT_EMBED_SHELL_HTML, {
            status: 200,
            headers: {
              "content-type": "text/html; charset=utf-8",
              "cache-control": "public, max-age=120, s-maxage=300",
              // Allow embedding the webradiosite origin inside our iframe (browser enforces child frame policy).
              "content-security-policy": "frame-src https://theradiofm.webradiosite.com"
            }
          });
        }
        return fetch(request);
      }
      const proxyRequest = buildProxyRequest(request);
      const { response: proxyResponse, redirectHistory } = await fetchWithRedirects(proxyRequest);
      const headers = new Headers(proxyResponse.headers);
      headers.set("cache-control", "public, max-age=300, s-maxage=300");
      headers.set("x-og-proxy", "play.theradio.fm");
      if (redirectHistory.length > 0) {
        headers.set("x-redirect-history", redirectHistory.join("; "));
      }
      const body = proxyResponse.body;
      return new Response(body, {
        status: proxyResponse.status,
        statusText: proxyResponse.statusText,
        headers
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[og-proxy] Error:", message);
      return new Response(`OG Proxy Error: ${message}`, {
        status: 502,
        headers: {
          "content-type": "text/plain",
          "x-og-proxy-error": message
        }
      });
    }
  }
};

// ../../../.nvm/versions/node/v24.15.0/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../.nvm/versions/node/v24.15.0/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-uskPLz/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../../.nvm/versions/node/v24.15.0/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-uskPLz/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
