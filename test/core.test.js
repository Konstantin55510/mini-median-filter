import { test } from 'node:test';
import assert from 'node:assert/strict';

import { medianFilter, median, normaliseWindow } from '../src/index.js';

test('median of odd-length array is the middle element', () => {
  assert.equal(median([3, 1, 2]), 2);
});

test('median of even-length array averages the two centres', () => {
  assert.equal(median([4, 1, 3, 2]), 2.5);
});

test('median does not mutate its input', () => {
  const input = [9, 2, 7];
  median(input);
  assert.deepEqual(input, [9, 2, 7]);
});

test('normaliseWindow keeps odd sizes and rounds even sizes up', () => {
  assert.equal(normaliseWindow(3), 3);
  assert.equal(normaliseWindow(4), 5);
  assert.equal(normaliseWindow(1), 1);
});

test('normaliseWindow rejects non-positive and non-integer sizes', () => {
  assert.throws(() => normaliseWindow(0), TypeError);
  assert.throws(() => normaliseWindow(-3), TypeError);
  assert.throws(() => normaliseWindow(2.5), TypeError);
});

test('medianFilter smooths an impulse with window 3', () => {
  const noisy = [1, 1, 100, 1, 1];
  assert.deepEqual(medianFilter(noisy, 3), [1, 1, 1, 1, 1]);
});

test('medianFilter shrinks the window at the boundaries instead of zero-padding', () => {
  const signal = [10, 20, 30, 40, 50];
  assert.deepEqual(medianFilter(signal, 3), [15, 20, 30, 40, 45]);
});

test('medianFilter with window 1 is the identity', () => {
  const signal = [5, -1, 0, 42];
  assert.deepEqual(medianFilter(signal, 1), signal);
});

test('medianFilter normalises an even window to the next odd size', () => {
  const signal = [1, 2, 3, 4, 5];
  assert.deepEqual(medianFilter(signal, 2), medianFilter(signal, 3));
});

test('medianFilter on an empty signal returns an empty array', () => {
  assert.deepEqual(medianFilter([], 3), []);
});

test('medianFilter on a single sample returns that sample', () => {
  assert.deepEqual(medianFilter([7], 5), [7]);
});

test('medianFilter rejects a non-array signal', () => {
  assert.throws(() => medianFilter('123', 3), TypeError);
});
