/**
 * Loads Hotjar (usability testing: heatmaps, session recordings).
 * New Hotjar accounts give a Contentsquare tag id (hex text, e.g. 'b70ec26c940b2');
 * older accounts give a numeric Hotjar Site ID. Both are accepted.
 */
export function loadHotjar(id: number | string | null): void {
  if (!id || typeof window === 'undefined') return;
  const w = window as unknown as { hj?: unknown; _hjSettings?: unknown; _uxa?: unknown };
  if (w.hj || w._uxa) return;
  const script = document.createElement('script');
  script.async = true;
  if (typeof id === 'string') {
    w._uxa = w._uxa ?? [];
    script.src = `https://t.contentsquare.net/uxa/${encodeURIComponent(id)}.js`;
  } else {
    const queue: unknown[] = [];
    w.hj = (...args: unknown[]) => void queue.push(args);
    (w.hj as { q?: unknown[] }).q = queue;
    w._hjSettings = { hjid: id, hjsv: 6 };
    script.src = `https://static.hotjar.com/c/hotjar-${id}.js?sv=6`;
  }
  document.head.appendChild(script);
}

/** Record IDs in the URL (orders, reports) collapse to ":id" so every detail page shares one heatmap. */
export function pageviewPath(url: string): string {
  const path = url.split(/[?#]/)[0] || '/';
  return path
    .split('/')
    .map((seg) => (/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(seg) || /^[a-z]{1,4}-[0-9a-z-]{6,}$/i.test(seg) || /^\d{3,}$/.test(seg) ? ':id' : seg))
    .join('/');
}

/**
 * The app is a single page: Contentsquare sees only the first page on its own, so every later
 * in-app navigation is reported as an artificial pageview.
 */
export function trackPageview(url: string): void {
  if (typeof window === 'undefined') return;
  const uxa = (window as unknown as { _uxa?: unknown[] })._uxa;
  if (Array.isArray(uxa) || (uxa && typeof (uxa as { push?: unknown }).push === 'function')) {
    (uxa as { push(v: unknown): void }).push(['trackPageview', pageviewPath(url)]);
  }
}
