# Two Sum - Solution

## Approach: Hash Map (One-pass)

The most efficient way to solve this is using a Hash Map (Object or `Map` in JS/TS).
As we iterate through the array, we check if the complement of the current number (target - nums[i]) already exists in the map.
If it does, we've found our pair. If not, we store the current number and its index in the map.

### Complexity
- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

### Implementation
```typescript
export function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}
```
