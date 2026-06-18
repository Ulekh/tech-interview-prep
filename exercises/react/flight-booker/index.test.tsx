import React from 'react';
import { render, screen } from '@testing-library/react';
import { FlightBooker } from './index';

describe('flight-booker', () => {
  it('should render correctly', () => {
    render(<FlightBooker />);
    expect(screen.getByText(/FlightBooker/i)).toBeInTheDocument();
  });
});