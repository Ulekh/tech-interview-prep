import { Dispatch, SetStateAction, useState, useCallback } from 'react';

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: Dispatch<SetStateAction<number>>;
}

export default function useCounter(initialValue = 0): UseCounterReturn {
  throw new Error('Function is not implemented');
}
