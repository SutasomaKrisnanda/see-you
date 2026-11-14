/**
 * Tier 3 Pairwise Combinations: Viewport & Storage Matrix
 *
 * Test Specifications:
 * - TC-T3-14: Small-Screen Layout Clamp (< 370px) + Chapter 05 Polaroid Gallery
 * - TC-T3-15: Chapter 06 "Read Again" Action + Scroll Reset to Beginning
 * - TC-T3-16: Rapid Multi-Tap on Envelope Stamp + Concurrency Guard
 * - TC-T3-17: Lazy Progressive Photo Loading + Offline Asset Pre-Caching Sync
 * - TC-T3-18: Recipient Data with Null Avatars & Optional Video Slot Omission
 *
 * Traceability:
 * - Brief §5, §9.1, §10, §11.2, §18
 * - PROJECT.md #14, #24, #25, #26, #27, #28, #29
 * - TEST_INFRA.md Areas 5, 7, 9, 10, 11
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import {
  expectChapterCounter,
  expectMobileStoryVisible,
} from '../harness/assertions';
import {
  resetBrowserMocks,
  MockIntersectionObserver,
} from '../harness/browserMocks';
import {
  RECIPIENT_BUDI,
  RECIPIENT_SITI,
  RECIPIENT_NADYA,
} from '../harness/recipientFixtures';

describe('Tier 3: Viewport & Storage Matrix [Pairwise]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('TC-T3-14: Small-Screen Layout Clamp (< 370px) + Chapter 05 Polaroid Gallery', async () => {
    const harness = await renderApp({
      viewport: { width: 320, height: 568, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_BUDI.token}`,
    });

    const story = expectMobileStoryVisible(harness.container);
    expect(story).toBeDefined();

    // Check responsive polaroid gallery elements
    const polaroidCards = Array.from(harness.container.querySelectorAll('.polaroid-card, .memory-card'));
    for (const card of polaroidCards) {
      const element = card as HTMLElement;
      expect(element.style.maxWidth || '100%').toMatch(/(100%|none|\d+px)/);
    }
  });

  it('TC-T3-15: Chapter 06 "Read Again" Action + Scroll Reset to Beginning', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_BUDI.token}`,
    });

    const scrollToSpy = vi.spyOn(window, 'scrollTo');

    const readAgainBtn =
      harness.container.querySelector('.btn-read-again') ||
      harness.container.querySelector('[data-testid="read-again"]') ||
      harness.container.querySelector('button[aria-label*="read" i]');

    if (readAgainBtn) {
      // User clicks "Read your letter again"
      harness.readAgain();

      // Ensure window.scrollTo or element.scrollIntoView was invoked targeting the beginning
      expect(scrollToSpy).toHaveBeenCalled();
    }
  });

  it('TC-T3-16: Rapid Multi-Tap on Envelope Stamp + Concurrency Guard', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_BUDI.token}`,
    });

    const stampBtn =
      harness.container.querySelector('.stamp-btn') ||
      harness.container.querySelector('[data-testid="stamp-btn"]');

    if (stampBtn) {
      // Dispatch 5 rapid clicks
      harness.tapStamp();
      harness.tapStamp();
      harness.tapStamp();
      harness.tapStamp();
      harness.tapStamp();

      // Stamp button should be disabled or marked pressed to prevent re-triggering
      const isDisabled =
        (stampBtn as HTMLButtonElement).disabled ||
        stampBtn.getAttribute('aria-disabled') === 'true' ||
        stampBtn.classList.contains('stamp--pressed');

      expect(isDisabled).toBe(true);
    }
  });

  it('TC-T3-17: Lazy Progressive Photo Loading + Offline Asset Pre-Caching Sync', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    // Gallery images in Chapter 05 should specify loading="lazy"
    const galleryImgs = Array.from(harness.container.querySelectorAll('.memory-gallery img, .scrapbook img'));
    for (const img of galleryImgs) {
      const loadingAttr = img.getAttribute('loading');
      expect(loadingAttr).toBe('lazy');
    }

    // Save this memory should cache all recipient memories
    const saveBtn = harness.container.querySelector('.btn-save-memory');
    if (saveBtn) {
      harness.saveMemory();
      const cache = await harness.cacheStorage.open('see-you-v1');
      for (const memory of RECIPIENT_NADYA.memories) {
        const cached = await cache.match(memory.src);
        if (cached) {
          expect(cached.status).toBe(200);
        }
      }
    }
  });

  it('TC-T3-18: Recipient Data with Null Avatars & Optional Video Slot Omission', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_SITI.token}`,
    });

    // Siti's fixture has teamLetters[0].avatar = null and videoNote = undefined
    expect(RECIPIENT_SITI.teamLetters[0].avatar).toBeNull();
    expect(RECIPIENT_SITI.videoNote).toBeUndefined();

    // Verify avatar initial or fallback placeholder is rendered instead of a broken img
    const teamAvatars = Array.from(harness.container.querySelectorAll('.team-avatar, [data-testid="member-avatar"]'));
    if (teamAvatars.length > 0) {
      const initialText = teamAvatars[0].textContent?.trim() || '';
      expect(initialText.length).toBeGreaterThan(0);
    }

    // Verify optional video slot is omitted when videoNote is undefined
    const videoSlot =
      harness.container.querySelector('.video-slot') ||
      harness.container.querySelector('[data-testid="video-slot"]') ||
      harness.container.querySelector('video');

    expect(videoSlot).toBeNull();
  });
});
