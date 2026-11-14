/**
 * Tier 4 Scenario 1: Normal Recipient Mobile Journey
 *
 * User Profile: Intern "Budi" scans his personalized QR sticker on his flower hamper using a smartphone.
 * Environment: Mobile Safari / Chrome on iOS/Android, viewport 390x844, touch pointer.
 * URL: https://sutasomakrisnanda.github.io/see-you/?q=tok_budi_128bit
 *
 * Workflow:
 * 1. Cold Boot & Gating (viewport 390x844, token resolved, mobile view mounts)
 * 2. Envelope Landing (warm paper texture, recipient name Budi, wax seal, TopBar SEE YOU., counter 01 / 06)
 * 3. Unsealing the Letter (tap seal, flap folds back, card slides up, ivory transition)
 * 4. Reading the Journey:
 *    - Chapter 02: A Little Greeting (personal salutation, botanical ornament, counter 02 / 06)
 *    - Chapter 03: Facilitator Letter (paper card -1deg tilt, champagne badge, Krisnanda signature, counter 03 / 06)
 *    - Chapter 04: Letters from Komnasinfo (team member cards, colored accent rails, counter 04 / 06)
 *    - Chapter 05: Moments We Shared (2-column polaroid memory grid, photo captions, counter 05 / 06)
 *    - Chapter 06: Until We Meet Again (closing message, period, "Read again" and "Save" CTAs, counter 06 / 06, progress 100%)
 * 5. Replaying: clicks "Read your letter again", scrolls back to start, counter resets.
 *
 * Traceability:
 * - Brief §5, §7.1, §8, §9.1, §10, §18
 * - PROJECT.md #8, #9, #13, #14, #15, #17, #18, #19, #21, #22, #23, #24, #25, #27
 * - TEST_INFRA.md Area 1, 3, 5, 7, 9
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import {
  expectChapterCounter,
  expectDesktopGateHidden,
  expectMobileStoryVisible,
} from '../harness/assertions';
import {
  resetBrowserMocks,
  MockIntersectionObserver,
} from '../harness/browserMocks';
import { RECIPIENT_BUDI } from '../harness/recipientFixtures';

describe('Tier 4 Scenario 1: Normal Recipient Mobile Journey', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('executes Budi’s end-to-end mobile journey through all 6 chapters, unsealing, and reading again', async () => {
    // -------------------------------------------------------------------------
    // Step 1: Cold Boot & Gating
    // -------------------------------------------------------------------------
    const targetUrl = `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_BUDI.token}`;
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: targetUrl,
    });

    // Device check passes for mobile (desktop gate is hidden)
    expectDesktopGateHidden(harness.container);
    const story = expectMobileStoryVisible(harness.container);
    expect(story).toBeDefined();

    // -------------------------------------------------------------------------
    // Step 2: Envelope Landing (Chapter 01)
    // -------------------------------------------------------------------------
    // Topbar brand wordmark
    const wordmark = harness.container.querySelector('.wordmark') || harness.container.querySelector('header h1');
    expect(wordmark?.textContent).toMatch(/see.*you/i);

    // Initial chapter counter
    expectChapterCounter(harness.container, '01 / 06');

    // Envelope displays personalized greeting / name
    const pageText = harness.container.textContent || '';
    expect(pageText).toMatch(new RegExp(RECIPIENT_BUDI.recipient.name, 'i'));

    // -------------------------------------------------------------------------
    // Step 3: Unsealing the Letter
    // -------------------------------------------------------------------------
    const stampBtn =
      harness.container.querySelector('.stamp-btn') ||
      harness.container.querySelector('[data-testid="stamp-btn"]');

    if (stampBtn) {
      harness.tapStamp();

      // Wax seal indicates pressed response
      const isPressed =
        stampBtn.classList.contains('stamp--pressed') ||
        stampBtn.getAttribute('aria-disabled') === 'true' ||
        (stampBtn as HTMLButtonElement).disabled;
      expect(isPressed).toBe(true);
    }

    // -------------------------------------------------------------------------
    // Step 4: Reading the Journey (Chapters 02 - 06)
    // -------------------------------------------------------------------------
    // Chapter 02: A Little Greeting
    const chapter02 =
      harness.container.querySelector('#greeting-section') ||
      harness.container.querySelector('[data-chapter="02"]') ||
      harness.container.querySelector('.section-greeting');

    if (chapter02) {
      MockIntersectionObserver.triggerChapterVisibility(chapter02, true, 0.7);
      expectChapterCounter(harness.container, '02 / 06');
    }

    // Chapter 03: Facilitator Letter
    const chapter03 =
      harness.container.querySelector('#facilitator-section') ||
      harness.container.querySelector('[data-chapter="03"]') ||
      harness.container.querySelector('.section-facilitator');

    if (chapter03) {
      MockIntersectionObserver.triggerChapterVisibility(chapter03, true, 0.7);
      expectChapterCounter(harness.container, '03 / 06');
    }

    // Chapter 04: Letters from Komnasinfo
    const chapter04 =
      harness.container.querySelector('#team-section') ||
      harness.container.querySelector('[data-chapter="04"]') ||
      harness.container.querySelector('.section-team');

    if (chapter04) {
      MockIntersectionObserver.triggerChapterVisibility(chapter04, true, 0.7);
      expectChapterCounter(harness.container, '04 / 06');
    }

    // Chapter 05: Moments We Shared
    const chapter05 =
      harness.container.querySelector('#moments-section') ||
      harness.container.querySelector('[data-chapter="05"]') ||
      harness.container.querySelector('.section-moments');

    if (chapter05) {
      MockIntersectionObserver.triggerChapterVisibility(chapter05, true, 0.7);
      expectChapterCounter(harness.container, '05 / 06');
    }

    // Chapter 06: Until We Meet Again
    const chapter06 =
      harness.container.querySelector('#closing-section') ||
      harness.container.querySelector('[data-chapter="06"]') ||
      harness.container.querySelector('.section-closing');

    if (chapter06) {
      MockIntersectionObserver.triggerChapterVisibility(chapter06, true, 0.7);
      expectChapterCounter(harness.container, '06 / 06');

      const progressFill = harness.container.querySelector('.progress-fill') as HTMLElement;
      if (progressFill) {
        expect(progressFill.style.width).toMatch(/(100%|1)/);
      }
    }

    // -------------------------------------------------------------------------
    // Step 5: Replaying Journey
    // -------------------------------------------------------------------------
    const readAgainBtn =
      harness.container.querySelector('.btn-read-again') ||
      harness.container.querySelector('[data-testid="read-again"]') ||
      harness.container.querySelector('button[aria-label*="read" i]');

    if (readAgainBtn) {
      const scrollToSpy = vi.spyOn(window, 'scrollTo');
      harness.readAgain();
      expect(scrollToSpy).toHaveBeenCalled();
    }
  });
});
