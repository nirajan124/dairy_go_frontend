import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './Contact';

describe('Contact component', () => {
  it('renders contact form and shows validation error if fields are empty', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });
}); 