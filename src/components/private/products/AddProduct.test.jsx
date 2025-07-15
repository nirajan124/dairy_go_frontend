import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddProduct from './AddProduct';

describe('AddProduct component', () => {
  it('renders the add product form heading', () => {
    render(
      <MemoryRouter>
        <AddProduct />
      </MemoryRouter>
    );
    expect(screen.getByText(/Add New Dairy Product/i)).toBeInTheDocument();
  });
}); 