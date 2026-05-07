declare const thoriumCorePlugin: { appLoaded: () => void } | undefined;

interface MixpanelLike {
  init?: (token: string, opts: Record<string, unknown>) => void;
  track?: (event: string, props: Record<string, unknown>) => void;
}

interface Window {
  mixpanel?: MixpanelLike;
}
