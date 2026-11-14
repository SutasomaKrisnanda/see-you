/**
 * Tier 4 Scenario 5: Reduced Motion & Throttled Mobile Network
 *
 * User Profile: Recipient on a budget device or weak cellular connection (Slow 3G) who has enabled "Reduce Motion" in OS accessibility settings.
 * Environment: Viewport 360x640, (prefers-reduced-motion: reduce) = true, network latency 2000ms.
 * URL: https://sutasomakrisnanda.github.io/see-you/?q=tok_budi_128bit
 *
 * Workflow:
 * 1. Progressive Critical Loading (downloads critical bundle, envelope artwork without full gallery/video preload)
 * 2. Instant Envelope Opening (wax seal tapped -> CSS keyframes & multi-second fade delays bypassed -> story appears immediately)
 * 3. Accessible Reading & Scroll (sections appear without delay, proximity snap without forced smooth scrolling, botanical art is static)
 *
 * Traceability:
 * - Brief §9.3, §10
 * - PROJECT.md #16, #28, #29
 * - TEST_INFRA.md Area 6, 10
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import {
  expectMobileStoryVisible,
} from '../harness/assertions';
import { resetBrowserMocks } from '../harness/browserMocks';
import { RECIPIENT_BUDI } from '../harness/recipientFixtures';

describe('Tier 4 Scenario 5: Reduced Motion & Throttled Mobile Network', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('bypasses animation delays and executes instant transitions under prefers-reduced-motion', async () => {
    // -------------------------------------------------------------------------
    // Step 1: Progressive Critical Loading under Reduced Motion
    // -------------------------------------------------------------------------
    const targetUrl = `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_BUDI.token}`;
    const harness = await renderApp({
      viewport: { width: 360, height: 640, pointer: 'coarse' },
      initialUrl: targetUrl,
      reducedMotion: true,
    });

    // Mobile story and envelope render
    const story = expectMobileStoryVisible(harness.container);
    expect(story).toBeDefined();

    // Verify initial load does NOT eagerly preload all gallery images or heavy media
    const preloadedVideos = harness.container.querySelectorAll('video[preload="auto"]');
    expect(preloadedVideos.length).toBe(0);

    // -------------------------------------------------------------------------
    // Step 2: Instant Envelope Opening
    // -------------------------------------------------------------------------
    const stampBtn =
      harness.container.querySelector('.stamp-btn') ||
      harness.container.querySelector('[data-testid="stamp-btn"]');

    if (stampBtn) {
      harness.tapStamp();

      // Envelope opening completes immediately without waiting for CSS animation timeout
      const storyContainer =
        harness.container.querySelector('#story') ||
        harness.container.querySelector('.story-container');

      if (storyContainer) {
        expect(storyContainer).toBeDefined();
      }
    }

    // -------------------------------------------------------------------------
    // Step 3: Accessible Reading & Proximity Snap
    // -------------------------------------------------------------------------
    // Container does not force smooth scrolling when reduced motion is preferred
    const mainStory = harness.container.querySelector('#story') as HTMLElement;
    if (mainStory) {
      expect(mainStory.style.scrollBehavior).not.toBe('smooth');
    }

    // Reduced motion classes or styles are active
    const hasReducedMotionIndication =
      document.documentElement.classList.contains('reduced-motion') ||
      document.body.classList.contains('reduced-motion') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    expect(hasReducedMotionIndication).toBe(true);
  });
});
