import React, { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Fresh Dairy Delivered main heading', async () => {
  render(
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  );
  const heading = await screen.findByText(/Fresh Dairy Delivered/i);
  expect(heading).toBeInTheDocument();
}); 