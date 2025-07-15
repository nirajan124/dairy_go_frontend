import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetail from './ProductDetail';

jest.mock('axios');
import axios from 'axios';

describe('ProductDetail component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays product details including nutrition', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        _id: '1',
        name: 'Test Cheese',
        description: 'Aged cheese',
        price: 50,
        nutritionalInfo: {
          calories: 100,
          protein: 5,
          fat: 8,
          carbohydrates: 12,
          calcium: 200,
        },
        image: null,
        brand: 'TestBrand',
        category: 'Cheese',
        unit: 'kg',
        isOrganic: true,
        expiryDate: new Date().toISOString(),
      },
    });
    const { container } = render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('dairy-spinner')).toBeInTheDocument();
    const cheeseHeadings = await screen.findAllByText(/Test Cheese/i);
    expect(cheeseHeadings.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Aged cheese/i)).toBeInTheDocument();
    expect(screen.getByText(/50/i)).toBeInTheDocument();
    expect(screen.getByText(/calories/i)).toBeInTheDocument();
    expect(screen.getByText(/100/i)).toBeInTheDocument();
    expect(screen.getByText(/fat/i)).toBeInTheDocument();
    expect(screen.getByText(/8/i)).toBeInTheDocument();
    // Check for 'Protein: 5g' in a list item
    const lis = container.querySelectorAll('li');
    const proteinLi = Array.from(lis).find(li => li.textContent.replace(/\s+/g, ' ').includes('Protein: 5g'));
    expect(proteinLi).toBeTruthy();
  });

  it('shows error state if API fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error'));
    render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('dairy-spinner')).toBeInTheDocument();
    expect(await screen.findByText(/Failed to load product details/i)).toBeInTheDocument();
  });
}); 