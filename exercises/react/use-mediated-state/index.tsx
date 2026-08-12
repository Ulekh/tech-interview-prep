import React, { useState } from 'react';
import './style.css';

export const UseMediatedState = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="use-mediated-state-container">
      <h1>UseMediatedState</h1>
      <p>This is your new React exercise.</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
};

export default UseMediatedState;