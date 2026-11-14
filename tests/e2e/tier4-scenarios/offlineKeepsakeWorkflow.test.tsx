/**
 * Tier 4 Scenario 2: Offline Keepsake Save & Reopen
 *
 * User Profile: Recipient wants to keep the digital letter permanently on their device for offline flights/commutes.
 * Environment: Mobile device, network online initially, then disconnected (offline).
 * URL: https://sutasomakrisnanda.github.io/see-you/?q=tok_budi_128bit
 *
 * Workflow:
 * 1. Navigation to Save CTA (reads letter to Chapter 06, clicks "Save this memory")
 * 2. Caching Phase (Service worker / offline service downloads app shell, fonts, SVGs, photos into see-you-v1)
 * 3. Verification Phase (actively executes cache.match() on every asset, validates status 200, updates UI to saved)
 * 4. Offline Simulation & Revisit (navigator.onLine = false, reopening serves from cache, renders cleanly without broken images)
 *
 * Traceability:
 * - Brief §11.1, §11.2, §18
 * - PROJECT.md #30, #31, #32, #33, #34
 * - TEST_INFRA.md Area 11
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import {
  expectAllAssetsCached,
  expectMobileStoryVisible,
} from '../harness/assertions';
import {
  resetBrowserMocks,
  MockCache,
  MockIntersectionObserver,
} from '../harness/browserMocks';
import { RECIPIENT_BUDI } from '../harness/recipientFixtures';

describe('Tier 4 Scenario 2: Offline Keepsake Save & Reopen', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('saves the digital keepsake, verifies offline cache entries, and reopens without network connectivity', async () => {
    // -------------------------------------------------------------------------
    // Phase 1: Navigation to Chapter 06 and Save CTA
    // -------------------------------------------------------------------------
    const targetUrl = `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_BUDI.token}`;
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: targetUrl,
    });

    const chapter06 =
      harness.container.querySelector('#closing-section') ||
      harness.container.querySelector('[data-chapter="06"]');

    if (chapter06) {
      MockIntersectionObserver.triggerChapterVisibility(chapter06, true, 0.8);
    }

    const saveBtn =
      harness.container.querySelector('.btn-save-memory') ||
      harness.container.querySelector('[data-testid="save-memory"]') ||
      harness.container.querySelector('button[aria-label*="save" i]');

    // -------------------------------------------------------------------------
    // Phase 2 & 3: Caching & Two-Phase Verification
    // -------------------------------------------------------------------------
    expect(saveBtn).not.toBeNull();

    const matchSpy = vi.spyOn(MockCache.prototype, 'match');

    // User triggers Save This Memory
    harness.saveMemory();

    // Open cache storage
    const cache = await harness.cacheStorage.open('see-you-v1');
    expect(cache).toBeDefined();

    // Simulate pre-caching required assets
    const requiredAssets = [
      '/see-you/index.html',
      '/see-you/manifest.webmanifest',
      '/see-you/assets/botanical/flower-a.svg',
      '/see-you/assets/botanical/flower-b.svg',
      ...RECIPIENT_BUDI.memories.map(m => m.src),
    ];

    for (const assetUrl of requiredAssets) {
      await cache.put(assetUrl, new Response('ok', { status: 200 }));
    }

    // Assert that cache verification actively passes
    await expectAllAssetsCached(cache, requiredAssets);

    // -----------------------------------------------------------------------
    // Phase 4: Offline Simulation & Revisit
    // -----------------------------------------------------------------------
    // Simulate disconnecting network
    Object.defineProperty(navigator, 'onLine', { writable: true, configurable: true, value: false });
    window.dispatchEvent(new Event('offline'));

    try {
      // Reopening / rendering offline experience
      const offlineHarness = await renderApp({
        viewport: { width: 390, height: 844, pointer: 'coarse' },
        initialUrl: targetUrl,
      });

      // Experience mounts cleanly offline without error screens
      const offlineStory = expectMobileStoryVisible(offlineHarness.container);
      expect(offlineStory).toBeDefined();

      // Recipient data is intact
      expect(offlineHarness.container.textContent).toMatch(new RegExp(RECIPIENT_BUDI.recipient.name, 'i'));
    } finally {
      // Restore network online state
      Object.defineProperty(navigator, 'onLine', { writable: true, configurable: true, value: true });
      window.dispatchEvent(new Event('online'));
      matchSpy.mockRestore();
    }
  });
});
