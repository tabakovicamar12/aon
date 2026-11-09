/**
 * Loads Microsoft Clarity (usability testing: heatmaps, session recordings).
 * Clarity follows in-app page changes on its own, so no pageview calls are needed.
 */
export function loadClarity(projectId: string | null): void {
  if (!projectId || typeof window === 'undefined') return;
  const w = window as unknown as { clarity?: ((...args: unknown[]) => void) & { q?: unknown[] } };
  if (w.clarity) return;
  const queue: unknown[] = [];
  const clarity = ((...args: unknown[]) => void queue.push(args)) as ((...args: unknown[]) => void) & { q?: unknown[] };
  clarity.q = queue;
  w.clarity = clarity;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`;
  document.head.appendChild(script);
}
