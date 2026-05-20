import React from 'react';
import { render, screen } from '@testing-library/react';
import ImageCarousel from './image-carousel';

describe('image-carousel', () => {
  it('should render correctly', () => {
    render(<ImageCarousel />);
    expect(screen.getByText(/ImageCarousel/i)).toBeInTheDocument();
  });
});
