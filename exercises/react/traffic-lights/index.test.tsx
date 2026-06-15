import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrafficLights } from './index';

describe('traffic-lights', () => {
  it('should render correctly', () => {
    render(<TrafficLights />);
    expect(screen.getByText(/TrafficLights/i)).toBeInTheDocument();
  });
});