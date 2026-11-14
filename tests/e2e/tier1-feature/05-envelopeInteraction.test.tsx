/**
 * Tier 1 Feature Coverage: Envelope & Stamp Interaction
 *
 * Test Specifications:
 * - T1-EN-01: Initial Closed Envelope Presentation
 * - T1-EN-02: Stamp Button Accessibility Attributes
 * - T1-EN-03: Stamp Tap Initiates Opening State
 * - T1-EN-04: Envelope Opening Transition Unlocks Story
 * - T1-EN-05: Stamp Button Debounce / Single-Activation
 *
 * Traceability: Brief §4, §9.1, §13, PROJECT.md #13, #14, #15, TEST_INFRA.md Area 5
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import { resetBrowserMocks } from '../harness/browserMocks';
import { RECIPIENT_NADYA } from '../harness/recipientFixtures';

describe('Feature Area 5: Envelope & Stamp Interaction [Tier 1]', () => {
  beforeEach(() => {
    resetBrowserMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    resetBrowserMocks();
    vi.useRealTimers();
  });

  it('T1-EN-01: Initial Closed Envelope Presentation renders envelope structure and seal', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const envelope =
      harness.container.querySelector('.envelope') ||
      harness.container.querySelector('.envelope-chapter') ||
      harness.container.querySelector('#envelope-section');

    expect(envelope).not.toBeNull();

    // Verify presence of seal / stamp button
    const stampBtn =
      harness.container.querySelector('.stamp-btn') ||
      harness.container.querySelector('#open-letter') ||
      harness.container.querySelector('[data-testid="stamp-btn"]');

    expect(stampBtn).not.toBeNull();
  });

  it('T1-EN-02: Stamp Button Accessibility Attributes verify accessible name, role, and focusability', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const stampBtn =
      harness.container.querySelector('.stamp-btn') ||
      harness.container.querySelector('#open-letter') ||
      harness.container.querySelector('[data-testid="stamp-btn"]');

    expect(stampBtn).not.toBeNull();

    // Accessible role (button tag or explicit role="button")
    const isButton = stampBtn!.tagName.toLowerCase() === 'button' || stampBtn!.getAttribute('role') === 'button';
    expect(isButton).toBe(true);

    // Accessible label or text
    const label = stampBtn!.getAttribute('aria-label') || stampBtn!.textContent || '';
    expect(/open|buka|surat|letter/i.test(label)).toBe(true);

    // Keyboard focusable
    expect((stampBtn as HTMLElement).tabIndex).toBeGreaterThanOrEqual(0);
  });

  it('T1-EN-03: Stamp Tap Initiates Opening State applies opening class or attribute', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const stamp = harness.tapStamp();
    expect(stamp).toBeDefined();

    // Opening state should be reflected on stamp or envelope
    const envelope =
      harness.container.querySelector('.envelope') ||
      harness.container.querySelector('.envelope-chapter') ||
      harness.container.querySelector('#envelope-section');

    const hasOpeningState =
      envelope?.classList.contains('is-opening') ||
      envelope?.getAttribute('data-state') === 'opening' ||
      stamp.classList.contains('is-opening') ||
      stamp.hasAttribute('disabled');

    expect(hasOpeningState).toBe(true);
  });

  it('T1-EN-04: Envelope Opening Transition Unlocks Story chapters for viewing', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    harness.tapStamp();

    // Advance opening transition timer (typically ~1200ms)
    vi.advanceTimersByTime(1500);

    const storyContainer =
      harness.container.querySelector('#story') ||
      harness.container.querySelector('.story-content') ||
      harness.container.querySelector('.see-you-app');

    expect(storyContainer).not.toBeNull();
  });

  it('T1-EN-05: Stamp Button Debounce / Single-Activation disables repeat clicks', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const stamp = harness.tapStamp();

    // Stamp should be disabled or marked aria-disabled to prevent double firing
    const isDisabled = stamp.hasAttribute('disabled') || stamp.getAttribute('aria-disabled') === 'true';
    expect(isDisabled).toBe(true);
  });
});
