import React, { useState } from 'react';
import './style.css';
import Tabs from './tabs';

export const Tabs_1 = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="tabs_1-container">
      <Tabs />
    </div>
  );
};

export default Tabs_1;
