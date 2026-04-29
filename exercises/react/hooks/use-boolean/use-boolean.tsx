import { useState } from "react";

/**
 * Custom hook to manage boolean state
 */
export default function useBoolean(initialValue: boolean = false) {
  // Your code here
  return {
    value: false,
    setTrue: () => {},
    setFalse: () => {},
    toggle: () => {},
  };
}
