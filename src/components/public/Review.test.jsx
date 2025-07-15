import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Review from './Review';

describe('Review component', () => {
  it('renders review heading and review list', () => {
    render(
      <MemoryRouter>
        <Review />
      </MemoryRouter>
    );
    expect(screen.getByText(/Customer Reviews/i)).toBeInTheDocument();
    const reviews = screen.getAllByText(/Reviews/i);
    expect(reviews.length).toBeGreaterThan(0);
  });
}); 