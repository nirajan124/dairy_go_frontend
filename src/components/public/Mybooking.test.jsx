import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Mybooking from './Mybooking';

jest.mock('axios');
import axios from 'axios';

describe('Mybooking component', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders placeholder orders and statuses', async () => {
    window.localStorage.setItem('userId', '123');
    render(
      <MemoryRouter>
        <Mybooking />
      </MemoryRouter>
    );
    expect(await screen.findByText(/Fresh Whole Milk/i)).toBeInTheDocument();
    expect(screen.getByText(/Aged Cheddar Cheese/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirmed/i)).toBeInTheDocument();
    // There may be multiple 'Delivered' elements, so check at least one exists
    const delivered = screen.getAllByText(/Delivered/i);
    expect(delivered.length).toBeGreaterThanOrEqual(1);
  });
}); 