import { describe, it, expect } from 'vitest';
import { sumArray } from "./index";

describe('sumArray', () => {
  it('should return 0 for empty array', () => {
    expect(sumArray([])).toBe(0);
  });

  it('should sum numbers correctly', () => {
    expect(sumArray([1, 2, 3])).toBe(6);
  });
});
