import React, { useState } from 'react';

/**
 * React Playground
 * Perfect for trying out hooks, components, or CSS ideas.
 */
export const PlaygroundApp = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>React Playground 🧪</h1>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(c => c - 1)}>Decrement</button>
    </div>
  );
};
