import React from 'react';
import { render, screen } from '@testing-library/react';
import { UseDeferredValue } from './index';

describe('use-deferred-value', () => {
  it('should render correctly', () => {
    render(<UseDeferredValue />);
    expect(screen.getByText(/UseDeferredValue/i)).toBeInTheDocument();
  });
});