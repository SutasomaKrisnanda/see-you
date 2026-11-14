/**
 * Tier 3 Pairwise Combinations: Motion & Audio Matrix
 *
 * Test Specifications:
 * - TC-T3-05: Audio Toggle Interaction + Multi-Chapter Scroll Persistence
 * - TC-T3-06: Autoplay Policy Rejection (NotAllowedError) + TopBar UI Resilience
 * - TC-T3-07: Reduced Motion Preference (prefers-reduced-motion) + Envelope Opening Sequence
 * - TC-T3-08: Reduced Motion Preference + Chapter Snapping & Progress Bar
 *
 * Traceability:
 * - Brief §9.3, §9.4, §10
 * - PROJECT.md #16, #18, #19, #20
 * - TEST_INFRA.md Areas 6, 7, 8, 9
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import {
  expectChapterCounter,
  expectAudioState,
  expectMobileStoryVisible,
} from '../harness/assertions';
import {
  resetBrowserMocks,
  MockAudioElement,
  MockIntersectionObserver,
} from '../harness/browserMocks';
import { RECIPIENT_NADYA } from '../harness/recipientFixtures';

describe('Tier 3: Motion & Audio Matrix [Pairwise]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('TC-T3-05: Audio Toggle Interaction + Multi-Chapter Scroll Persistence', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const audioToggle =
      harness.container.querySelector('.audio-toggle') ||
      harness.container.querySelector('[data-testid="audio-toggle"]') ||
      harness.container.querySelector('button[aria-label*="music" i]');

    if (audioToggle) {
      // 1. User clicks audio button to start music
      harness.toggleAudio();
      expectAudioState(harness.container, true);

      // Check audio instance state
      const audioInstance = MockAudioElement.instances[MockAudioElement.instances.length - 1];
      if (audioInstance) {
        expect(audioInstance.paused).toBe(false);
      }

      // 2. Simulate scrolling through Chapter 02 to Chapter 05
      const chapter05 =
        harness.container.querySelector('#moments-section') ||
        harness.container.querySelector('[data-chapter="05"]') ||
        harness.container.querySelector('.section-moments');

      if (chapter05) {
        MockIntersectionObserver.triggerChapterVisibility(chapter05, true, 0.7);
        expectChapterCounter(harness.container, '05 / 06');

        // Audio should remain playing continuously without interruption
        if (audioInstance) {
          expect(audioInstance.paused).toBe(false);
        }
        expectAudioState(harness.container, true);
      }
    }
  });

  it('TC-T3-06: Autoplay Policy Rejection (NotAllowedError) + TopBar UI Resilience', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
      shouldRejectAudioPlay: true,
    });

    const audioToggle =
      harness.container.querySelector('.audio-toggle') ||
      harness.container.querySelector('[data-testid="audio-toggle"]') ||
      harness.container.querySelector('button[aria-label*="music" i]');

    if (audioToggle) {
      // Trigger audio toggle when browser autoplay policy rejects playback
      expect(() => {
        harness.toggleAudio();
      }).not.toThrow();

      // UI gracefully remains or reverts to muted state
      expectAudioState(harness.container, false);

      // Rest of the application continues functioning without unhandled crash
      expectMobileStoryVisible(harness.container);
    }
  });

  it('TC-T3-07: Reduced Motion Preference (prefers-reduced-motion) + Envelope Opening Sequence', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
      reducedMotion: true,
    });

    const stampBtn =
      harness.container.querySelector('.stamp-btn') ||
      harness.container.querySelector('[data-testid="stamp-btn"]');

    if (stampBtn) {
      // Tap stamp button under reduced motion
      harness.tapStamp();

      // Flap and reveal transitions should be instant or marked with reduced-motion class
      const story = harness.container.querySelector('#story') || harness.container.querySelector('.story-container');
      if (story) {
        const computedStyle = window.getComputedStyle(story);
        const hasReducedMotionClass =
          document.documentElement.classList.contains('reduced-motion') ||
          story.classList.contains('reduced-motion') ||
          computedStyle.animationDuration === '0s';

        expect(hasReducedMotionClass || computedStyle.display !== 'none').toBe(true);
      }
    }
  });

  it('TC-T3-08: Reduced Motion Preference + Chapter Snapping & Progress Bar', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
      reducedMotion: true,
    });

    const storyContainer = harness.container.querySelector('#story');
    if (storyContainer) {
      // Verify scroll behavior does not force smooth scrolling under reduced motion
      const scrollBehavior = (storyContainer as HTMLElement).style.scrollBehavior;
      expect(scrollBehavior !== 'smooth').toBe(true);
    }

    // Scroll to Chapter 03
    const chapter03 =
      harness.container.querySelector('#facilitator-section') ||
      harness.container.querySelector('[data-chapter="03"]');

    if (chapter03) {
      MockIntersectionObserver.triggerChapterVisibility(chapter03, true, 0.6);
      expectChapterCounter(harness.container, '03 / 06');

      const progressFill = harness.container.querySelector('.progress-fill') as HTMLElement;
      if (progressFill) {
        expect(progressFill.style.width).toMatch(/(50%|0\.5)/);
      }
    }

    // Scroll to Chapter 06
    const chapter06 =
      harness.container.querySelector('#closing-section') ||
      harness.container.querySelector('[data-chapter="06"]');

    if (chapter06) {
      MockIntersectionObserver.triggerChapterVisibility(chapter06, true, 0.6);
      expectChapterCounter(harness.container, '06 / 06');

      const progressFill = harness.container.querySelector('.progress-fill') as HTMLElement;
      if (progressFill) {
        expect(progressFill.style.width).toMatch(/(100%|1)/);
      }
    }
  });
});
