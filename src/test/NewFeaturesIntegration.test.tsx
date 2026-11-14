import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';
import Topbar from '../components/navigation/Topbar';
import Story from '../components/story/Story';
import { RECIPIENT_NADYA } from '../data/recipients';

describe('New Features & Indonesian Localization Integration Tests', () => {
  const originalInnerWidth = window.innerWidth;
  const originalLocation = window.location;

  beforeEach(() => {
    vi.useFakeTimers();
    window.innerWidth = 390;
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

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
        search: `?q=${RECIPIENT_NADYA.token}`,
        pathname: '/see-you/',
        origin: 'https://sutasomakrisnanda.github.io',
      },
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    window.innerWidth = originalInnerWidth;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
    vi.restoreAllMocks();
  });

  it('renders initial opener view with bell-ringing animation, Komnasinfo seal, and locked scroll', () => {
    const { container } = render(<App />);

    // Topbar header has wordmark and icon-only audio button
    expect(screen.getByRole('heading', { level: 1, name: /see you/i })).toBeInTheDocument();
    const audioBtn = screen.getByTestId('audio-toggle');
    expect(audioBtn).toBeInTheDocument();
    expect(audioBtn.querySelector('svg')).toBeInTheDocument();

    // Progress bar and page counter must NOT exist
    expect(container.querySelector('.progress-track')).toBeNull();
    expect(container.querySelector('.chapter-counter')).toBeNull();

    // Opener layer indication & recipient name
    expect(screen.getByText(/surat ini ditulis khusus untuk/i)).toBeInTheDocument();
    expect(screen.getByTestId('recipient-name')).toHaveTextContent('Nadya Putri');

    // Message
    expect(screen.getByText(/seseorang ingin menyampaikan/i)).toBeInTheDocument();

    // Envelope bell-ringing idle class
    const envelope = container.querySelector('.envelope');
    expect(envelope).toHaveClass('is-bell-ringing');

    // Komnasinfo seal icon in envelope
    const sealImg = container.querySelector('.seal-icon');
    expect(sealImg).toBeInTheDocument();
    expect(sealImg).toHaveAttribute('alt', 'Logo Komnas');

    // Body scroll is locked when unopened
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('envelope is touch-sensitive, opens with full-screen transition, and resets on read again', async () => {
    const { container } = render(<App />);

    const envelope = container.querySelector('.envelope');
    expect(envelope).toBeInTheDocument();

    // Tap anywhere on envelope
    act(() => {
      fireEvent.click(envelope!);
    });

    // Opening state triggers
    expect(envelope).toHaveClass('is-opening');

    // Fast-forward timers for full-screen veil expansion and unlocking
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // After opening, body scroll lock is released
    expect(document.body.style.overflow).toBe('');

    // Click "Baca dari Awal" (Read from Beginning) in Chapter 5
    const readAgainBtn = screen.getByTestId('read-again');
    expect(readAgainBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(readAgainBtn);
    });

    // View returns to locked opener state
    expect(document.body.style.overflow).toBe('hidden');
    expect(container.querySelector('.envelope')).toBeInTheDocument();
  });

  it('renders Topbar with icon-only audio toggle button switching between mute and playing icons', async () => {
    const { container } = render(<Topbar />);

    expect(container.querySelector('.progress-track')).toBeNull();
    expect(container.querySelector('.chapter-counter')).toBeNull();

    const audioBtn = screen.getByTestId('audio-toggle');
    // Initially muted
    expect(audioBtn).toHaveClass('is-muted');
    expect(audioBtn.querySelector('.audio-icon-muted')).toBeInTheDocument();

    // Click button
    await act(async () => {
      fireEvent.click(audioBtn);
    });

    // Toggled to playing with sound waves icon
    expect(audioBtn).toHaveClass('is-playing');
    expect(audioBtn.querySelector('.audio-icon-playing')).toBeInTheDocument();
  });

  it('renders Indonesian Story chapters with continuous infinite auto-scrolling carousel', () => {
    const onReadAgain = vi.fn();
    const onNextChapter = vi.fn();

    const { container } = render(
      <Story
        recipient={RECIPIENT_NADYA}
        onReadAgain={onReadAgain}
        onNextChapter={onNextChapter}
      />
    );

    // Chapter 01: Greeting
    const greetingSec = container.querySelector('#greeting-section');
    expect(greetingSec).toBeInTheDocument();
    expect(greetingSec).toHaveAttribute('data-chapter', '01');
    expect(screen.getByText(/salam pembuka/i)).toBeInTheDocument();
    expect(screen.getByText(/lanjut membaca/i)).toBeInTheDocument();

    // Chapter 02: Facilitator
    const facSec = container.querySelector('#facilitator-section');
    expect(facSec).toHaveAttribute('data-chapter', '02');
    expect(screen.getByText(/surat dari fasilitator/i)).toBeInTheDocument();
    expect(screen.getByText(/baca pesan tim/i)).toBeInTheDocument();

    // Chapter 03: Team Messages with continuous infinite carousel
    const teamSec = container.querySelector('#team-section');
    expect(teamSec).toHaveAttribute('data-chapter', '03');
    const teamCarousel = container.querySelector('.team-carousel');
    expect(teamCarousel).toBeInTheDocument();

    // Test pause on touch/mouse
    fireEvent.touchStart(teamCarousel!);
    expect(teamCarousel).toHaveClass('is-paused');

    fireEvent.touchEnd(teamCarousel!);
    expect(teamCarousel).toHaveClass('is-scrolling');

    // Chapter 04: Moments with horizontal photo carousel
    const momentsSec = container.querySelector('#moments-section');
    expect(momentsSec).toHaveAttribute('data-chapter', '04');
    expect(container.querySelector('.photo-carousel')).toBeInTheDocument();
    expect(screen.getByText(/kenangan bersama/i)).toBeInTheDocument();
    expect(screen.getByText(/baca penutup/i)).toBeInTheDocument();

    // Chapter 05: Closing
    const closingSec = container.querySelector('#closing-section');
    expect(closingSec).toHaveAttribute('data-chapter', '05');
    expect(screen.getByText(/sampai jumpa/i)).toBeInTheDocument();

    // Buttons
    const saveBtn = screen.getByTestId('save-memory');
    expect(saveBtn).toHaveTextContent(/simpan kenangan ini/i);

    const readAgainBtn = screen.getByTestId('read-again');
    expect(readAgainBtn).toHaveTextContent(/baca dari awal/i);
  });
});
