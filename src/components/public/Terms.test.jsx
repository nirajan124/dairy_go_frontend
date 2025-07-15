import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Terms from './Terms';

describe('Terms component', () => {
  it('renders legal text', () => {
    render(
      <MemoryRouter>
        <Terms />
      </MemoryRouter>
    );
    const terms = screen.getAllByText(/terms/i);
    expect(terms.length).toBeGreaterThan(0);
    const conditions = screen.getAllByText(/conditions/i);
    expect(conditions.length).toBeGreaterThan(0);
    expect(screen.getByText(/governed by the laws/i)).toBeInTheDocument();
  });
}); 