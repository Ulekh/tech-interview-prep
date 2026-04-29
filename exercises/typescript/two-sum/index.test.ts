import { describe, it, expect } from 'vitest';
import { twoSum } from './index';

describe('twoSum', () => {
  it('should return [0, 1] for nums = [2, 7, 11, 15], target = 9', () => {
    expect(twoSum([2, 7, 11, 15], 9).sort()).toEqual([0, 1]);
  });

  it('should return [1, 2] for nums = [3, 2, 4], target = 6', () => {
    expect(twoSum([3, 2, 4], 6).sort()).toEqual([1, 2]);
  });

  it('should return [0, 1] for nums = [3, 3], target = 6', () => {
    expect(twoSum([3, 3], 6).sort()).toEqual([0, 1]);
  });
});
