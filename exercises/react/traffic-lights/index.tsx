import React, { useState } from 'react';
import './style.css';

const RED_LIGHT_MS = 4000;
const YELLOW_LIGHT_MS = 500;
const GREEN_LIGHT_MS = 3000;

const config = [
  { color: 'red', duration: RED_LIGHT_MS },
  { color: 'yellow', duration: YELLOW_LIGHT_MS },
  { color: 'green', duration: GREEN_LIGHT_MS },
  { color: 'yellow', duration: YELLOW_LIGHT_MS },
];

export const TrafficLights = () => {
  const [currIdx, setCurrIdx] = useState<number>(0);

  React.useEffect(() => {
    const currentLight = config[currIdx];
    const timerId = setTimeout(() => {
      setCurrIdx((prevIdx) => (prevIdx + 1) % config.length);
    }, currentLight.duration);

    return () => clearTimeout(timerId);
  });

  return (
    <div className="traffic-lights-container">
      <h1>TrafficLights</h1>
      <p>This is your new React exercise.</p>
      <div className={`light ${config[currIdx].color}`}>{config[currIdx].color.toUpperCase()}</div>
    </div>
  );
};

export default TrafficLights;
