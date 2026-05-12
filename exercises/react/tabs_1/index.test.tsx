import React from 'react';
import { render, screen } from '@testing-library/react';
import { Tabs_1 } from './index';

describe('tabs_1', () => {
  it('should render correctly', () => {
    render(<Tabs_1 />);
    expect(screen.getByText(/Tabs_1/i)).toBeInTheDocument();
  });
});