import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Editprofile from './Editprofile';

describe('Editprofile component', () => {
  afterEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });

  it('shows alert on successful profile update', () => {
    window.alert = jest.fn();
    render(
      <MemoryRouter>
        <Editprofile />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Updated User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'updated@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+977 9800000000' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: 'New Address' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
    expect(window.alert).toHaveBeenCalledWith('Profile Updated Successfully!');
  });

  it('shows alert if password and confirm password do not match', () => {
    window.alert = jest.fn();
    render(
      <MemoryRouter>
        <Editprofile />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'abc123' } });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), { target: { value: 'xyz789' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));
    expect(window.alert).toHaveBeenCalledWith('New password and confirm password do not match!');
  });
}); 