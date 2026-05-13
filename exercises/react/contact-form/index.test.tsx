import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContactForm } from './index';

describe('contact-form', () => {
  it('should render correctly', () => {
    render(<ContactForm />);
    expect(screen.getByText(/ContactForm/i)).toBeInTheDocument();
  });
});