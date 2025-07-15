import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Payments from './Payments';

describe('Payments component', () => {
  it('renders payments heading or amount column', () => {
    render(
      <MemoryRouter>
        <Payments />
      </MemoryRouter>
    );
    const heading = screen.queryByText(/Payments/i);
    const amount = screen.queryByText(/Amount/i);
    expect(heading || amount).toBeTruthy();
  });
}); 