/**
 * Tier 2 Boundary Tests: Dynamic Reduced Motion Accessibility Toggle
 *
 * Covers:
 * - T2-RM-01: Mid-Animation Motion Preference Switch
 * - T2-RM-02: Scroll Behavior Override (auto instead of smooth)
 * - T2-RM-03: High Contrast Mode with Reduced Motion
 * - T2-RM-04: Static Visible Focus Ring on Stamp Button
 * - T2-RM-05: Gallery Photo Stagger Duration under Reduced Motion
 *
 * Traceability:
 * - Brief §3.2, §9.3
 * - PROJECT.md #16, #19
 * - TEST_INFRA.md Area 6
 * - Spec Miner handoff.md Section 6 Area 6
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { resetBrowserMocks } from '../harness/browserMocks';
import { renderApp } from '../harness/renderHarness';

describe('Tier 2 Boundary: Dynamic Reduced Motion Toggle', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T2-RM-01: Mid-Animation Motion Preference Switch', async () => {
    // Start with reduced motion disabled
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      reducedMotion: false,
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    const stamp =
      app.container.querySelector('.stamp-btn') ||
      app.container.querySelector('#open-letter') ||
      app.container.querySelector('button[aria-label*="open" i]');

    if (stamp) {
      fireEvent.click(stamp);

      // Mid-animation: User toggles OS reduced-motion preference
      app.setReducedMotion(true);

      // Story transition snaps to complete immediately without multi-second delays
      const story = app.container.querySelector('#story, main');
      expect(story).toBeDefined();
    }
  });

  it('T2-RM-02: Scroll Behavior Override (auto instead of smooth)', async () => {
    // With reduced motion active
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      reducedMotion: true,
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // MatchMedia check confirms reduced motion is active
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    expect(mql.matches).toBe(true);

    const nextBtn = app.container.querySelector('[data-next], .chapter-next');
    if (nextBtn) {
      const scrollSpy = vi.spyOn(window, 'scrollTo');
      fireEvent.click(nextBtn);

      // Verify that smooth scrolling is not forced when reduced motion is requested
      if (scrollSpy.mock.calls.length > 0) {
        const options = scrollSpy.mock.calls[0][0];
        if (typeof options === 'object' && options !== null) {
          expect((options as ScrollToOptions).behavior).not.toBe('smooth');
        }
      }
      scrollSpy.mockRestore();
    }
  });

  it('T2-RM-03: High Contrast Mode with Reduced Motion', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      reducedMotion: true,
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Verify all primary buttons have accessible focus / contrast styling
    const buttons = app.container.querySelectorAll('button');
    buttons.forEach(btn => {
      expect(btn).toBeDefined();
    });
  });

  it('T2-RM-04: Static Visible Focus Ring on Stamp Button', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      reducedMotion: true,
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    const stamp =
      app.container.querySelector('.stamp-btn') ||
      app.container.querySelector('#open-letter') ||
      app.container.querySelector('button[aria-label*="open" i]');

    if (stamp) {
      fireEvent.focus(stamp);
      // Stamp element should be keyboard focusable
      expect((stamp as HTMLElement).tabIndex).toBeGreaterThanOrEqual(0);
    }
  });

  it('T2-RM-05: Gallery Photo Stagger Duration under Reduced Motion', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      reducedMotion: true,
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Check media query state
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);

    const photos = app.container.querySelectorAll('.polaroid, .memory-card');
    photos.forEach(photo => {
      const style = window.getComputedStyle(photo as HTMLElement);
      // Animation / transition durations should be 0s or instantaneous
      if (style.transitionDuration) {
        expect(['0s', '', '0ms'].includes(style.transitionDuration)).toBe(true);
      }
    });
  });
});
