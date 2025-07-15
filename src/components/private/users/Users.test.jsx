import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Users from './Users';

describe('Users component', () => {
  it('renders users heading or email column', () => {
    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );
    const heading = screen.queryByText(/Users/i);
    const email = screen.queryByText(/Email/i);
    expect(heading || email).toBeTruthy();
  });
}); 