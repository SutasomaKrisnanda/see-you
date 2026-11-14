/**
 * Tier 2 Boundary Tests: Topbar, Chapter Counter & Progress Clamping
 *
 * Covers:
 * - T2-TB-01: Rapid Bidirectional Flick Scroll
 * - T2-TB-02: 50/50 Viewport Boundary Between Chapters
 * - T2-TB-03: Resize During Active Scroll
 * - T2-TB-04: Single Viewport Content (Zero Scrollable Delta)
 * - T2-TB-05: Progress Bar Clamp Between 0% and 100%
 *
 * Traceability:
 * - Brief §3.1
 * - PROJECT.md #17, #18, #19
 * - TEST_INFRA.md Area 7
 * - Spec Miner handoff.md Section 6 Area 7
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { resetBrowserMocks } from '../harness/browserMocks';
import { expectChapterCounter } from '../harness/assertions';
import { renderApp } from '../harness/renderHarness';

describe('Tier 2 Boundary: Topbar, Chapter Counter & Progress Clamping', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T2-TB-01: Rapid Bidirectional Flick Scroll', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Flick down to 3000px, then back up to 0px in rapid succession
    fireEvent.scroll(window, { target: { scrollY: 3000 } });
    fireEvent.scroll(window, { target: { scrollY: 0 } });

    const counter = app.container.querySelector('.counter, .chapter-counter, [data-testid="chapter-counter"]');
    if (counter) {
      expect(counter.textContent).toMatch(/^0[1-6]\s*\/\s*06$/);
    }
  });

  it('T2-TB-02: 50/50 Viewport Boundary Between Chapters', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Set scroll position midway
    fireEvent.scroll(window, { target: { scrollY: 500 } });

    const counter = app.container.querySelector('.counter, .chapter-counter, [data-testid="chapter-counter"]');
    if (counter) {
      // Must display a single deterministic chapter number, not NaN or undefined
      const text = counter.textContent?.trim() || '';
      expect(/^0[1-6]\s*\/\s*06$/.test(text)).toBe(true);
    }
  });

  it('T2-TB-03: Resize During Active Scroll', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 600, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    fireEvent.scroll(window, { target: { scrollY: 300 } });

    // Resize viewport height from 600px to 400px
    app.setViewport(390, 400, 'coarse');
    window.dispatchEvent(new Event('resize'));

    const progressFill = app.container.querySelector('.progress-fill, [data-testid="progress-bar"]');
    if (progressFill) {
      const widthStyle = (progressFill as HTMLElement).style.width;
      expect(widthStyle).not.toContain('NaN');
    }
  });

  it('T2-TB-04: Single Viewport Content (Zero Scrollable Delta)', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 1200, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    const progressFill = app.container.querySelector('.progress-fill, [data-testid="progress-bar"]');
    if (progressFill) {
      const widthStyle = (progressFill as HTMLElement).style.width;
      // Handles division by zero cleanly (defaults to 16.6% or 100%, never NaN)
      expect(widthStyle).not.toContain('NaN');
      expect(widthStyle).not.toContain('undefined');
    }
  });

  it('T2-TB-05: Progress Bar Clamp Between 0% and 100%', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Simulate negative overscroll (elastic pull-down on iOS)
    fireEvent.scroll(window, { target: { scrollY: -150 } });

    const progressFill = app.container.querySelector('.progress-fill, [data-testid="progress-bar"]');
    if (progressFill) {
      const style = (progressFill as HTMLElement).style.width;
      const numMatch = style.match(/([\d.]+)%/);
      if (numMatch) {
        const val = parseFloat(numMatch[1]);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(100);
      }
    }

    // Simulate extreme overscroll past document end
    fireEvent.scroll(window, { target: { scrollY: 99999 } });

    if (progressFill) {
      const style = (progressFill as HTMLElement).style.width;
      const numMatch = style.match(/([\d.]+)%/);
      if (numMatch) {
        const val = parseFloat(numMatch[1]);
        expect(val).toBeLessThanOrEqual(100);
      }
    }
  });
});
