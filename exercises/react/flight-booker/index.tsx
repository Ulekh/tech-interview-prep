import React, { useState } from 'react';
import './style.css';

export const FlightBooker = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flight-booker-container">
      <h1>FlightBooker</h1>
      <form>
        <input type="date" />
      </form>
    </div>
  );
};

export default FlightBooker;
