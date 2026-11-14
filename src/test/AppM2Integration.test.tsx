import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App from '../App';
import { RECIPIENT_NADYA, RECIPIENT_BUDI } from '../data/recipients';

describe('App Milestone 2 Integration', () => {
  const originalInnerWidth = window.innerWidth;
  const originalLocation = window.location;

  beforeEach(() => {
    window.innerWidth = 1024;
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
    vi.restoreAllMocks();
  });

  function setupMockEnv(options: {
    width: number;
    pointerCoarse: boolean;
    pointerFine: boolean;
    search: string;
    href?: string;
  }) {
    window.innerWidth = options.width;

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches:
        query === '(pointer: coarse)'
          ? options.pointerCoarse
          : query === '(pointer: fine)'
            ? options.pointerFine
            : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const href =
      options.href ||
      `https://sutasomakrisnanda.github.io/see-you/${options.search}`;

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href,
        search: options.search,
        pathname: '/see-you/',
        origin: 'https://sutasomakrisnanda.github.io',
      },
    });
  }

  it('renders DesktopQRScreen on desktop viewport and excludes #story', () => {
    setupMockEnv({
      width: 1280,
      pointerCoarse: false,
      pointerFine: true,
      search: `?q=${RECIPIENT_NADYA.token}`,
    });

    const { container } = render(<App />);

    expect(container.querySelector('#desktop-gate')).toBeInTheDocument();
    expect(container.querySelector('#story')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: /see you/i })).toBeInTheDocument();
  });

  it('renders FallbackSection on mobile viewport when token is missing and excludes #story', () => {
    setupMockEnv({
      width: 390,
      pointerCoarse: true,
      pointerFine: false,
      search: '',
    });

    const { container } = render(<App />);

    expect(container.querySelector('#invalid')).toBeInTheDocument();
    expect(container.querySelector('#story')).toBeNull();
    expect(container.querySelector('#desktop-gate')).toBeNull();
  });

  it('renders FallbackSection on mobile viewport when token is invalid and excludes #story', () => {
    setupMockEnv({
      width: 390,
      pointerCoarse: true,
      pointerFine: false,
      search: '?q=corrupted_invalid_token_9999',
    });

    const { container } = render(<App />);

    expect(container.querySelector('#invalid')).toBeInTheDocument();
    expect(container.querySelector('#story')).toBeNull();
  });

  it('renders mobile story with resolved recipient name when token is valid on mobile', () => {
    setupMockEnv({
      width: 390,
      pointerCoarse: true,
      pointerFine: false,
      search: `?q=${RECIPIENT_NADYA.token}`,
    });

    const { container } = render(<App />);

    expect(container.querySelector('#story')).toBeInTheDocument();
    expect(container.querySelector('#desktop-gate')).toBeNull();
    expect(container.querySelector('#invalid')).toBeNull();

    const coverName = container.querySelector('#recipient-cover');
    expect(coverName).toBeInTheDocument();
    expect(coverName?.textContent).toContain('Nadya Putri');
  });

  it('dynamically switches from desktop gate to mobile story upon viewport resize', () => {
    setupMockEnv({
      width: 1280,
      pointerCoarse: false,
      pointerFine: true,
      search: `?q=${RECIPIENT_BUDI.token}`,
    });

    const { container } = render(<App />);
    expect(container.querySelector('#desktop-gate')).toBeInTheDocument();
    expect(container.querySelector('#story')).toBeNull();

    // Resize to mobile
    act(() => {
      window.innerWidth = 375;
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(pointer: coarse)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      window.dispatchEvent(new Event('resize'));
    });

    expect(container.querySelector('#desktop-gate')).toBeNull();
    expect(container.querySelector('#story')).toBeInTheDocument();
    expect(container.querySelector('#recipient-cover')?.textContent).toContain('Budi Santoso');
  });
});
