import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DesktopQRScreen from '../components/desktop/DesktopQRScreen';

describe('DesktopQRScreen Component (Milestone 2)', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Reset location mock if needed
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('renders container with id="desktop-gate" and data-testid="desktop-gate"', () => {
    const { container } = render(
      <DesktopQRScreen url="https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit" />
    );

    const gate = container.querySelector('#desktop-gate');
    expect(gate).toBeInTheDocument();
    expect(gate).toHaveAttribute('data-testid', 'desktop-gate');
    expect(gate?.classList.contains('desktop-gate')).toBe(true);
  });

  it('renders the SEE YOU. brand wordmark with italic styling', () => {
    render(<DesktopQRScreen url="https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit" />);

    const wordmark = screen.getByRole('heading', { level: 1, name: /see you/i });
    expect(wordmark).toBeInTheDocument();
    expect(wordmark.textContent).toContain('SEE');
    expect(wordmark.textContent).toContain('YOU.');
  });

  it('renders headline and instructional copy guiding user to phone camera scan', () => {
    const { container } = render(
      <DesktopQRScreen url="https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit" />
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /this letter is meant to be opened on your phone/i,
      })
    ).toBeInTheDocument();

    const fullText = container.textContent || '';
    expect(/phone|scan|camera|pindai|buka di hp/i.test(fullText)).toBe(true);
  });

  it('renders dynamic QR code SVG with correct data-testid and payload attribute', () => {
    const targetUrl = 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit';
    const { container } = render(<DesktopQRScreen url={targetUrl} />);

    const qrElement = container.querySelector('[data-testid="qr-code"]') as SVGElement | null;
    expect(qrElement).not.toBeNull();
    expect(qrElement?.tagName.toLowerCase()).toBe('svg');
    expect(qrElement?.getAttribute('data-value')).toBe(targetUrl);
    expect(qrElement?.getAttribute('data-url')).toBe(targetUrl);
  });

  it('preserves additional query parameters and tracking tags in QR payload', () => {
    const targetUrl =
      'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit&source=hamper_qr&utm=gift';
    const { container } = render(<DesktopQRScreen url={targetUrl} />);

    const qrElement = container.querySelector('[data-testid="qr-code"]');
    expect(qrElement?.getAttribute('data-value')).toBe(targetUrl);
  });

  it('preserves deep-link hash fragments in QR payload', () => {
    const targetUrl =
      'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit#facilitator-section';
    const { container } = render(<DesktopQRScreen url={targetUrl} />);

    const qrElement = container.querySelector('[data-testid="qr-code"]');
    expect(qrElement?.getAttribute('data-value')).toBe(targetUrl);
  });

  it('preserves port numbers for local development (localhost:5173)', () => {
    const devUrl = 'http://localhost:5173/see-you/?q=tok_dev_128bit';
    const { container } = render(<DesktopQRScreen url={devUrl} />);

    const qrElement = container.querySelector('[data-testid="qr-code"]');
    expect(qrElement?.getAttribute('data-value')).toBe(devUrl);
  });

  it('never outputs ?q=undefined or ?q=null when URL lacks query parameters', () => {
    const cleanBaseUrl = 'https://sutasomakrisnanda.github.io/see-you/';
    const { container } = render(<DesktopQRScreen url={cleanBaseUrl} />);

    const qrElement = container.querySelector('[data-testid="qr-code"]');
    expect(qrElement?.getAttribute('data-value')).toBe(cleanBaseUrl);
    expect(container.innerHTML.includes('?q=undefined')).toBe(false);
    expect(container.innerHTML.includes('?q=null')).toBe(false);
  });
});
