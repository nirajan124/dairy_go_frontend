import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Myprofile from './Myprofile';

jest.mock('axios');
import axios from 'axios';

describe('Myprofile component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('fetches and displays user profile data', async () => {
    window.localStorage.setItem('userId', '123');
    window.localStorage.setItem('token', 'testtoken');
    axios.get.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          username: 'testuser',
          address: 'Test Address',
          profileImage: 'profile.jpg',
        },
      },
    });
    render(
      <MemoryRouter>
        <Myprofile />
      </MemoryRouter>
    );
    expect(await screen.findByText(/Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/1234567890/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Address/i)).toBeInTheDocument();
  });
}); 