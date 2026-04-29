import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToggleSwitch } from './ToggleSwitch';
import React from 'react';

describe('ToggleSwitch', () => {
  it('should be OFF by default', () => {
    render(<ToggleSwitch />);
    expect(screen.getByText(/OFF/i)).toBeDefined();
  });

  it('should toggle to ON when clicked', () => {
    render(<ToggleSwitch />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText(/ON/i)).toBeDefined();
  });

  it('should call onToggle prop when clicked', () => {
    const onToggle = vi.fn();
    render(<ToggleSwitch onToggle={onToggle} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});
