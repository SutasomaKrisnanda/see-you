import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Foundational Smoke Test (Milestone 1)', () => {
  it('mounts the application container without throwing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('renders the initial brand wordmark heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1, name: /see you/i });
    expect(heading).toBeInTheDocument();
  });

  it('verifies jsdom environment and test harness are fully functional', () => {
    expect(window).toBeDefined();
    expect(document).toBeDefined();
    expect(document.body).toBeInTheDocument();
    expect(window.matchMedia).toBeDefined();
    expect(window.scrollTo).toBeDefined();
  });
});
