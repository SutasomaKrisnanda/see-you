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

  it('renders initial opener view with simple clean layout, Komnasinfo seal, and locked scroll', () => {
    const { container } = render(<App />);

    // Topbar header has wordmark and Unmute button
    expect(screen.getByRole('heading', { level: 1, name: /see you/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unmute musik/i })).toBeInTheDocument();

    // Progress bar and page counter must NOT exist
    expect(container.querySelector('.progress-track')).toBeNull();
    expect(container.querySelector('.chapter-counter')).toBeNull();

    // Opener layer indication & recipient name
    expect(screen.getByText(/surat ini ditulis khusus untuk/i)).toBeInTheDocument();
    expect(screen.getByTestId('recipient-name')).toHaveTextContent('Nadya Putri');

    // Message
    expect(screen.getByText(/seseorang ingin menyampaikan/i)).toBeInTheDocument();

    // Komnasinfo seal icon in envelope
    const sealImg = container.querySelector('.seal-icon');
    expect(sealImg).toBeInTheDocument();
    expect(sealImg).toHaveAttribute('alt', 'Logo Komnas');

    // Body scroll is locked when unopened
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('envelope is touch-sensitive and opens with transition when clicked', async () => {
    const { container } = render(<App />);

    const envelope = container.querySelector('.envelope');
    expect(envelope).toBeInTheDocument();
    expect(envelope).toHaveClass('is-idle');

    // Tap anywhere on envelope
    act(() => {
      fireEvent.click(envelope!);
    });

    // Opening state triggers
    expect(envelope).toHaveClass('is-opening');

    // Fast-forward timers for expansion and unlocking
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // After opening, body scroll lock is released
    expect(document.body.style.overflow).toBe('');
  });

  it('renders Topbar without progress bar and counter, with monokrom audio track', async () => {
    const { container } = render(<Topbar />);

    expect(container.querySelector('.progress-track')).toBeNull();
    expect(container.querySelector('.chapter-counter')).toBeNull();

    const audioBtn = screen.getByTestId('audio-toggle');
    expect(audioBtn).toHaveTextContent(/unmute/i);

    // Audio element toggles
    await act(async () => {
      fireEvent.click(audioBtn);
    });
    expect(audioBtn).toHaveAttribute('aria-pressed');
  });

  it('renders Indonesian Story chapters starting at Chapter 01 (Greeting) with responsive carousels', () => {
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

    // Chapter 03: Team Messages with horizontal swipe carousel
    const teamSec = container.querySelector('#team-section');
    expect(teamSec).toHaveAttribute('data-chapter', '03');
    expect(container.querySelector('.team-carousel')).toBeInTheDocument();
    expect(screen.getByText(/pesan dari rekan/i)).toBeInTheDocument();
    expect(screen.getByText(/lihat kenangan/i)).toBeInTheDocument();

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

    fireEvent.click(readAgainBtn);
    expect(onReadAgain).toHaveBeenCalledTimes(1);
  });
});
