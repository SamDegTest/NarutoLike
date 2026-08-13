/**
 * Image Cache Preloader utility to cache and preload critical game assets (sprites, background UI, badges)
 * avoiding redundant network fetches during runs, battles and modal transitions.
 */

const preloadedCache = new Set<string>();

export function preloadImage(src: string): Promise<void> {
  if (!src || preloadedCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      preloadedCache.add(src);
      resolve();
    };
    img.onerror = () => {
      // Resolve anyway so Promise.all won't block
      resolve();
    };
    img.src = src;
  });
}

export function preloadImagesBatch(sources: string[]): Promise<void[]> {
  const uniqueSources = Array.from(new Set(sources.filter((s) => s && !preloadedCache.has(s))));
  return Promise.all(uniqueSources.map((src) => preloadImage(src)));
}
