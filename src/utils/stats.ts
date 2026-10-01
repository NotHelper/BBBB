export function average(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Percentile where 0.99 means the 99th percentile of frame time samples. */
export function percentile(values: number[], p: number): number | null {
  if (!values.length) return null;
  const sorted = [...values].filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1));
  return sorted[index];
}

/**
 * FPS low methodology: take the slowest 1% / 0.1% of frame-time samples,
 * average their frame time, then convert that time back to FPS.
 */
export function lowFps(frameTimesMs: number[], fraction: number): number | null {
  const valid = frameTimesMs.filter(Number.isFinite).sort((a, b) => b - a);
  if (!valid.length || fraction <= 0 || fraction > 1) return null;
  const count = Math.max(1, Math.ceil(valid.length * fraction));
  const mean = average(valid.slice(0, count));
  return mean && mean > 0 ? 1000 / mean : null;
}
