import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Counter } from './Counter';

describe('Counter component', () => {
  it('should render initial count', () => {
    render(<Counter />);
    expect(screen.getByText(/Count: 0/i)).toBeInTheDocument();
  });

  it('should increment count on button click', () => {
    render(<Counter />);
    const button = screen.getByText(/Increment/i);
    fireEvent.click(button);
    expect(screen.getByText(/Count: 1/i)).toBeInTheDocument();
  });
});
