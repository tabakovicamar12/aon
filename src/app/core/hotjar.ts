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
