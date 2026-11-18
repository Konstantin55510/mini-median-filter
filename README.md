# mini-median-filter

Applies a sliding-window median filter to a one-dimensional signal for noise reduction.

```js
import { medianFilter, median, normaliseWindow } from './src/index.js';

const noisy = [1, 1, 100, 1, 1];
console.log(medianFilter(noisy, 3)); // [1, 1, 1, 1, 1]
console.log(median([3, 1, 2]));      // 2
console.log(normaliseWindow(4));     // 5
```

## Why this exists

A median filter removes isolated spikes without smearing the rest of the signal the way a
moving average does. The trade-off here is simplicity: the window is re-sorted on every step,
which is O(n * w log w) rather than the O(n log w) a two-heap or order-statistic tree would
give. For the small windows that median filters are normally used with, the constant factor
favours the straightforward version, and the code stays short enough to audit.

## Edge behaviour

Edge samples have fewer than `window` neighbours. This library shrinks the window
symmetrically at the boundaries rather than padding with zeros, so the first and last samples
are not dragged toward 0. A window size of 1 is the identity, an even window is rounded up to
the next odd size (a median needs a unique middle element), and a window larger than the
signal simply uses the whole signal at every position.
