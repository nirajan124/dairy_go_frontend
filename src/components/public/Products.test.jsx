import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Products from './Products';

jest.mock('axios');
import axios from 'axios';

describe('Products component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders products from API', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { _id: '1', title: 'Milk', description: 'Fresh milk', price: 10, image: null },
        { _id: '2', title: 'Cheese', description: 'Aged cheese', price: 20, image: null },
      ],
    });
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/Milk/i)).toBeInTheDocument();
    expect(screen.getByText(/Cheese/i)).toBeInTheDocument();
  });

  it('shows error state if API fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error'));
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/Demo Mode/i)).toBeInTheDocument();
  });
}); 