import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Aboutus from './Aboutus';

describe('Aboutus component', () => {
  it('renders company info and team section', () => {
    render(
      <MemoryRouter>
        <Aboutus />
      </MemoryRouter>
    );
    expect(screen.getByText(/About Dairy Go/i)).toBeInTheDocument();
    expect(screen.getByText(/Our Team/i)).toBeInTheDocument();
  });
}); 