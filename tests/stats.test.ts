import { describe, expect, it } from 'vitest';
import { average, lowFps, percentile } from '../src/utils/stats';

describe('performance statistics', () => {
  it('calculates average', () => expect(average([10, 20, 30])).toBe(20));
  it('calculates a bounded percentile', () => expect(percentile([1, 2, 3, 4], 0.5)).toBe(2));
  it('calculates 1% low from slowest frame times', () => expect(lowFps(Array.from({ length: 100 }, (_, i) => i === 99 ? 20 : 10), 0.01)).toBe(50));
  it('returns null for empty input', () => expect(lowFps([], 0.01)).toBeNull());
});
