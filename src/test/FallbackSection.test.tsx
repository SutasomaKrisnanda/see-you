import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FallbackSection from '../components/fallback/FallbackSection';

describe('FallbackSection Component (Milestone 2)', () => {
  it('renders container with id="invalid" and data-testid="fallback-section"', () => {
    const { container } = render(<FallbackSection />);

    const fallback = container.querySelector('#invalid');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveAttribute('data-testid', 'fallback-section');
    expect(fallback?.classList.contains('invalid')).toBe(true);
    expect(fallback?.classList.contains('fallback-section')).toBe(true);
  });

  it('renders brand wordmark SEE YOU. and Indonesian headline', () => {
    render(<FallbackSection />);

    const wordmark = screen.getByRole('heading', { level: 1, name: /see you/i });
    expect(wordmark).toBeInTheDocument();

    const title = screen.getByRole('heading', {
      level: 2,
      name: /surat tidak ditemukan/i,
    });
    expect(title).toBeInTheDocument();
  });

  it('renders helpful user guidance instructing user to check link or re-scan hamper QR', () => {
    const { container } = render(<FallbackSection />);
    const text = container.textContent || '';

    // Must match Indonesian guidance patterns
    expect(/hamper|bunga|pindai|scan|periksa|qr/i.test(text)).toBe(true);
    expect(/tidak valid|tidak dapat menemukan surat/i.test(text)).toBe(true);
  });

  it('guarantees strict confidentiality: zero intern names disclosed in DOM', () => {
    const { container } = render(<FallbackSection />);
    const text = container.textContent || '';

    const protectedNames = ['Nadya Putri', 'Budi Santoso', 'Siti Rahma', 'Dewi Ayu', 'Aya'];
    for (const name of protectedNames) {
      expect(text.includes(name)).toBe(false);
    }
  });

  it('does NOT render the interactive wax seal stamp button (.stamp-btn)', () => {
    const { container } = render(<FallbackSection />);

    const stampBtn =
      container.querySelector('.stamp-btn') ||
      container.querySelector('[data-testid="stamp-btn"]') ||
      container.querySelector('button');

    expect(stampBtn).toBeNull();
  });
});
