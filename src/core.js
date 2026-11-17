const DEFAULT_WINDOW = 3;

/**
 * Clamp a window size to an odd integer >= 1.
 *
 * WHY: A median needs an odd-sized window to have a unique middle element.
 * Even windows have an ambiguous median (any value between the two centres),
 * so we normalise to the next odd number rather than silently returning a
 * different statistic than the caller expects.
 */
export function normaliseWindow(size) {
  if (!Number.isInteger(size) || size < 1) {
    throw new TypeError('window size must be a positive integer');
  }
  return size % 2 === 1 ? size : size + 1;
}

/**
 * Compute the median of a numeric array without mutating the input.
 *
 * WHY: Sorting a copy keeps the sliding-window loop free of side effects on
 * the caller's buffer. For small windows this is simpler and faster than a
 * balanced-tree or two-heap structure, and median filters are almost always
 * used with small windows.
 */
export function median(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  if (sorted.length % 2 === 1) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Apply a sliding-window median filter to a one-dimensional signal.
 *
 * WHY: Edge samples have fewer than `window` neighbours. We shrink the window
 * symmetrically at the boundaries (reflecting the available samples) instead
 * of padding with zeros, which would bias the first and last samples toward 0.
 * The window size is accepted as a number and normalised to the next odd
 * integer so the median is always well defined.
 */
export function medianFilter(signal, window = DEFAULT_WINDOW) {
  if (!Array.isArray(signal)) {
    throw new TypeError('signal must be an array');
  }
  const size = normaliseWindow(window);
  const half = (size - 1) / 2;
  const out = new Array(signal.length);
  for (let i = 0; i < signal.length; i += 1) {
    const start = Math.max(0, i - half);
    const end = Math.min(signal.length, i + half + 1);
    out[i] = median(signal.slice(start, end));
  }
  return out;
}
