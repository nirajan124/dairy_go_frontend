import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const product = {
    _id: '1',
    title: 'Test Milk',
    description: 'A test product',
    price: 99,
    image: 'test.jpg',
  };

  it('renders product title, description, and price', () => {
    render(
      <MemoryRouter>
        <ProductCard packageData={product} />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Test Milk/i })).toBeInTheDocument();
    expect(screen.getByText(/A test product/i)).toBeInTheDocument();
    expect(screen.getByText(/99/i)).toBeInTheDocument();
  });

  it('renders a placeholder image if image is missing', () => {
    const productNoImage = { ...product, image: null };
    render(
      <MemoryRouter>
        <ProductCard packageData={productNoImage} />
      </MemoryRouter>
    );
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    // Optionally check for alt text or src
  });
}); 