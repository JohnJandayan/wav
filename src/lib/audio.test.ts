import { describe, expect, it } from 'vitest';
import { formatAudioTime } from './audio';
describe('audio clock', () => {
  it.each([
    [0, '0:00'],
    [9, '0:09'],
    [61, '1:01'],
    [83.9, '1:23'],
    [-5, '0:00'],
    [NaN, '0:00'],
    [Infinity, '0:00'],
  ] as const)('formats %s as %s', (seconds, result) =>
    expect(formatAudioTime(seconds)).toBe(result),
  );
});
