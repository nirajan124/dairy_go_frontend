import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Faq from './Faq';

describe('Faq component', () => {
  it('renders FAQ items and toggles answers', () => {
    render(
      <MemoryRouter>
        <Faq />
      </MemoryRouter>
    );
    const question = screen.getByText(/Frequently Asked Questions/i);
    expect(question).toBeInTheDocument();
    // Find a question and click to toggle answer
    const faqItem = screen.getAllByRole('button')[0];
    fireEvent.click(faqItem);
    // After click, at least one answer should be visible
    const answers = screen.getAllByText(/answer/i);
    expect(answers.length).toBeGreaterThan(0);
  });
}); 