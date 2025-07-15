import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PendingOrders from './PendingOrders';

describe('PendingOrders component', () => {
  it('renders pending orders list', () => {
    render(
      <MemoryRouter>
        <PendingOrders />
      </MemoryRouter>
    );
    expect(screen.getByText(/Pending Orders/i)).toBeInTheDocument();
  });
}); 