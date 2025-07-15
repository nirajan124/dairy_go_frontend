import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ManageProducts from './ManageProducts';

describe('ManageProducts component', () => {
  it('renders heading or spinner', () => {
    render(
      <MemoryRouter>
        <ManageProducts />
      </MemoryRouter>
    );
    const heading = screen.queryByText(/Manage Dairy Products/i);
    const spinner = screen.queryByTestId('dairy-spinner') || screen.queryByText(/loading/i);
    expect(heading || spinner).toBeTruthy();
  });
}); 