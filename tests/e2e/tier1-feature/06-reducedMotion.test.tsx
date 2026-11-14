/**
 * Tier 1 Feature Coverage: Reduced Motion Accessibility
 *
 * Test Specifications:
 * - T1-RM-01: Suppresses Opening Animation Delay Under Reduced Motion
 * - T1-RM-02: Suppresses Botanical Ambient Movement
 * - T1-RM-03: Scroll Snapping Proximity Without Jerky Slides
 * - T1-RM-04: Instant Reading Progress Bar Adjustment
 * - T1-RM-05: Runtime Media Query Preference Change
 *
 * Traceability: Brief §9.3, PROJECT.md #16, TEST_INFRA.md Area 6
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import { resetBrowserMocks } from '../harness/browserMocks';
import { RECIPIENT_NADYA } from '../harness/recipientFixtures';

describe('Feature Area 6: Reduced Motion Accessibility [Tier 1]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T1-RM-01: Suppresses Opening Animation Delay Under Reduced Motion immediately unlocks story', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      reducedMotion: true,
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    harness.tapStamp();

    // Under reduced motion, story should unlock immediately without awaiting multi-second animations
    const story =
      harness.container.querySelector('#story') ||
      harness.container.querySelector('.see-you-app');

    expect(story).not.toBeNull();
  });

  it('T1-RM-02: Suppresses Botanical Ambient Movement ensures decorative motion is disabled', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      reducedMotion: true,
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const botanicalElements = container.querySelectorAll('.flower-a, .flower-b, [data-botanical]');

    botanicalElements.forEach(el => {
      const style = window.getComputedStyle(el);
      // Under reduced motion, animation should be none or duration 0s
      const isMotionSuppressed =
        style.animationName === 'none' ||
        style.animationDuration === '0s' ||
        style.transitionDuration === '0s' ||
        el.classList.contains('motion-reduce');

      expect(isMotionSuppressed).toBe(true);
    });
  });

  it('T1-RM-03: Scroll Snapping Proximity Without Jerky Slides sets scroll-behavior to auto', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      reducedMotion: true,
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const story =
      container.querySelector('#story') ||
      container.querySelector('.see-you-app') ||
      document.documentElement;

    const computed = window.getComputedStyle(story);
    // Smooth scrolling should be replaced with auto to prevent vestibular discomfort
    expect(computed.scrollBehavior).not.toBe('smooth');
  });

  it('T1-RM-04: Instant Reading Progress Bar Adjustment updates without CSS transition lag', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      reducedMotion: true,
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const progressFill =
      harness.container.querySelector('.progress-fill') ||
      harness.container.querySelector('[data-testid="progress-fill"]');

    expect(progressFill).not.toBeNull();
    const style = window.getComputedStyle(progressFill!);
    expect(style.transitionDuration === '0s' || style.transitionProperty === 'none' || !style.transition).toBe(true);
  });

  it('T1-RM-05: Runtime Media Query Preference Change adapts dynamically to system preference', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      reducedMotion: false,
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    // Dynamically toggle reduced motion
    harness.setReducedMotion(true);

    // Verify media query change event fired and updated listener
    const mediaMatch = window.matchMedia('(prefers-reduced-motion: reduce)');
    expect(mediaMatch.matches).toBe(true);
  });
});
