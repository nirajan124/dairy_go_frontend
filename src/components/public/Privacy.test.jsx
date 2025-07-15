import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Privacy from './Privacy';

describe('Privacy component', () => {
  it('renders privacy policy text', () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>
    );
    const privacy = screen.getAllByText(/privacy/i);
    expect(privacy.length).toBeGreaterThan(0);
    const policy = screen.getAllByText(/policy/i);
    expect(policy.length).toBeGreaterThan(0);
    expect(screen.getByText(/protecting your personal information/i)).toBeInTheDocument();
  });
}); 