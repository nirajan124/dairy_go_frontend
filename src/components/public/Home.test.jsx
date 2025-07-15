import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.reject(new Error('Network error'))), // Simulate backend not available
}));

describe('Home component', () => {
  it('renders the main heading', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const heading = screen.getByRole('heading', { name: /Fresh Dairy Products/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders placeholder products if API fails', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Demo Mode: Showing sample dairy products/i)).toBeInTheDocument();
    });
    // Check for at least one placeholder product title
    expect(screen.getByRole('heading', { name: /Fresh Whole Milk/i })).toBeInTheDocument();
  });
}); 