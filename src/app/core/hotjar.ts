/** Loads the Hotjar tracking script (usability testing: heatmaps, session recordings). */
export function loadHotjar(siteId: number | null): void {
  if (!siteId || typeof window === 'undefined') return;
  const w = window as unknown as { hj?: unknown; _hjSettings?: unknown };
  if (w.hj) return;
  const queue: unknown[] = [];
  w.hj = (...args: unknown[]) => void queue.push(args);
  (w.hj as { q?: unknown[] }).q = queue;
  w._hjSettings = { hjid: siteId, hjsv: 6 };
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://static.hotjar.com/c/hotjar-${siteId}.js?sv=6`;
  document.head.appendChild(script);
}
