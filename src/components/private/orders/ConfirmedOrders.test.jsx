import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ConfirmedOrders from './ConfirmedOrders';

describe('ConfirmedOrders component', () => {
  it('renders confirmed orders list', () => {
    render(
      <MemoryRouter>
        <ConfirmedOrders />
      </MemoryRouter>
    );
    expect(screen.getByText(/Confirmed Orders/i)).toBeInTheDocument();
  });
}); 