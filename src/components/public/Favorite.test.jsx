import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Favorite from './Favorite';

describe('Favorite component', () => {
  it('renders at least one heading (favorite or empty state)', () => {
    render(
      <MemoryRouter>
        <Favorite />
      </MemoryRouter>
    );
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });
}); 
