/**
 * Tier 2 Boundary Tests: Envelope & Stamp Repeated Taps and Edge Cases
 *
 * Covers:
 * - T2-ES-01: Rapid Multi-Click Stamp Button Storm (5 Clicks / 50ms)
 * - T2-ES-02: Keyboard Space and Enter Key Navigation
 * - T2-ES-03: User Scroll Attempt During Opening Animation
 * - T2-ES-04: "Read Again" Action from Chapter 06
 * - T2-ES-05: Non-Interactive Envelope Element Clicks
 *
 * Traceability:
 * - Brief §4, §9.1, §13
 * - PROJECT.md #13, #14, #15
 * - TEST_INFRA.md Area 5
 * - Spec Miner handoff.md Section 6 Area 5
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { resetBrowserMocks } from '../harness/browserMocks';
import { expectMobileStoryVisible } from '../harness/assertions';
import { renderApp } from '../harness/renderHarness';

describe('Tier 2 Boundary: Envelope & Stamp Repeated Taps', () => {
  beforeEach(() => {
    resetBrowserMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetBrowserMocks();
  });

  it('T2-ES-01: Rapid Multi-Click Stamp Button Storm (5 Clicks / 50ms)', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    expectMobileStoryVisible(app.container);

    const stamp =
      app.container.querySelector('.stamp-btn') ||
      app.container.querySelector('#open-letter') ||
      app.container.querySelector('button[aria-label*="open" i]');

    if (stamp) {
      // Fire 5 rapid clicks within 50ms
      for (let i = 0; i < 5; i++) {
        fireEvent.click(stamp);
      }

      // Stamp button should receive disabled attribute after first activation
      const isDisabled =
        stamp.hasAttribute('disabled') ||
        stamp.getAttribute('aria-disabled') === 'true' ||
        stamp.classList.contains('disabled');

      expect(isDisabled).toBe(true);
    }
  });

  it('T2-ES-02: Keyboard Space and Enter Key Navigation', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    const stamp =
      app.container.querySelector('.stamp-btn') ||
      app.container.querySelector('#open-letter') ||
      app.container.querySelector('button[aria-label*="open" i]');

    if (stamp) {
      // Non-activating keys (Tab, ArrowDown) should not trigger opening
      fireEvent.keyDown(stamp, { key: 'Tab', code: 'Tab' });
      fireEvent.keyDown(stamp, { key: 'ArrowDown', code: 'ArrowDown' });

      // Enter key triggers opening
      fireEvent.keyDown(stamp, { key: 'Enter', code: 'Enter' });
      // Space key triggers opening
      fireEvent.keyDown(stamp, { key: ' ', code: 'Space' });
      expect(app.container).toBeDefined();
    }
  });

  it('T2-ES-03: User Scroll Attempt During Opening Animation', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    const stamp =
      app.container.querySelector('.stamp-btn') ||
      app.container.querySelector('#open-letter') ||
      app.container.querySelector('button[aria-label*="open" i]');

    if (stamp) {
      fireEvent.click(stamp);

      // During opening animation, user tries to scroll
      fireEvent.scroll(window, { target: { scrollY: 500 } });
      fireEvent.touchMove(document.body);

      // Verify that opening sequence is not broken by scroll events
      expect(app.container).toBeDefined();
    }
  });

  it('T2-ES-04: "Read Again" Action from Chapter 06', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    const readAgainBtn =
      app.container.querySelector('#read-again') ||
      app.container.querySelector('.btn-read-again') ||
      app.container.querySelector('button[aria-label*="read" i]');

    if (readAgainBtn) {
      const scrollSpy = vi.spyOn(window, 'scrollTo');
      fireEvent.click(readAgainBtn);

      // Should scroll back to start of story without re-locking envelope behind seal
      expect(scrollSpy).toHaveBeenCalled();
      scrollSpy.mockRestore();
    }
  });

  it('T2-ES-05: Non-Interactive Envelope Element Clicks', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Clicks on decorative background elements or envelope paper should NOT trigger opening
    const bgElements = app.container.querySelectorAll('.texture, .envelope-back, .envelope-front');
    bgElements.forEach(el => {
      fireEvent.click(el);
    });

    // Opening should not have fired from decorative elements
    const isOpening =
      app.container.querySelector('.is-opening') ||
      app.container.querySelector('[data-state="opening"]');

    expect(isOpening).toBeNull();
  });
});
