# Toggle Switch - Solution

## Implementation

```tsx
import React, { useState } from 'react';

interface ToggleSwitchProps {
  onToggle?: (isOn: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ onToggle }) => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div>
      <span>{isOn ? 'ON' : 'OFF'}</span>
      <button onClick={handleToggle} role="button">
        {isOn ? 'Switch OFF' : 'Switch ON'}
      </button>
    </div>
  );
};
```
