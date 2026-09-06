declare module '*.txt' {
  const content: string;
  export default content;
}

/** Cloudflare Workers Static Assets binding (`env.ASSETS`). */
interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}
