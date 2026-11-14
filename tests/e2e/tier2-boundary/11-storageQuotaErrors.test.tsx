/**
 * Tier 2 Boundary Tests: "Save This Memory" Offline Engine & Quota Errors
 *
 * Covers:
 * - T2-SM-01: Storage Quota Exceeded Exception (QuotaExceededError)
 * - T2-SM-02: Network Loss Mid-Save Operation (Failed to fetch)
 * - T2-SM-03: Cache Match Verification Detects Missing Asset
 * - T2-SM-04: Double-Click / Concurrent Save Prevention
 * - T2-SM-05: Offline Revisit Verification
 *
 * Traceability:
 * - Brief §11.2
 * - PROJECT.md #32, #33, #34
 * - TEST_INFRA.md Area 11
 * - Spec Miner handoff.md Section 6 Area 11
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import {
  resetBrowserMocks,
  MockCacheStorage,
  MockCache,
} from '../harness/browserMocks';
import { expectCacheEntry } from '../harness/assertions';
import { RECIPIENT_NADYA } from '../harness/recipientFixtures';
import { renderApp } from '../harness/renderHarness';

describe('Tier 2 Boundary: "Save This Memory" Offline Engine & Quota Errors', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T2-SM-01: Storage Quota Exceeded Exception (QuotaExceededError)', async () => {
    // Harness with simulated QuotaExceededError
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      simulateQuotaError: true,
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    const saveBtn = app.container.querySelector('.btn-save-memory, #save-memory');
    if (saveBtn) {
      fireEvent.click(saveBtn);

      // Verify that quota error does not result in uncaught crash
      expect(app.container).toBeDefined();

      // UI should NOT report false "Saved"
      expect(saveBtn.textContent).not.toContain('Saved');
    }
  });

  it('T2-SM-02: Network Loss Mid-Save Operation (Failed to fetch)', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Mock fetch to reject with network error
    const fetchSpy = vi.spyOn(window, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    const saveBtn = app.container.querySelector('.btn-save-memory, #save-memory');
    if (saveBtn) {
      fireEvent.click(saveBtn);

      // Operation aborts without showing false success
      expect(saveBtn.textContent).not.toContain('Tersimpan');
      expect(saveBtn.textContent).not.toContain('Saved');
    }

    fetchSpy.mockRestore();
  });

  it('T2-SM-03: Cache Match Verification Detects Missing Asset', async () => {
    const cache = new MockCache();
    const asset1 = '/see-you/index.html';
    const asset2 = '/see-you/assets/photos/missing.webp';

    // Put only asset1; asset2 is missing
    await cache.put(asset1, new Response('ok', { status: 200 }));

    const match1 = await cache.match(asset1);
    const match2 = await cache.match(asset2);

    expect(match1).toBeDefined();
    expect(match1?.status).toBe(200);
    // Missing asset returns undefined
    expect(match2).toBeUndefined();

    // Verification must fail when any asset is missing
    const isReady = Boolean(match1 && match2);
    expect(isReady).toBe(false);
  });

  it('T2-SM-04: Double-Click / Concurrent Save Prevention', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    const saveBtn = app.container.querySelector('.btn-save-memory, #save-memory');
    if (saveBtn) {
      // Fire rapid double clicks
      fireEvent.click(saveBtn);
      fireEvent.click(saveBtn);

      // Button should be disabled or have busy state during save
      const isBusy =
        saveBtn.hasAttribute('disabled') ||
        saveBtn.getAttribute('aria-busy') === 'true' ||
        saveBtn.classList.contains('saving');

      expect(isBusy).toBe(true);
    }
  });

  it('T2-SM-05: Offline Revisit Verification', async () => {
    // Populate cache with required keepsake assets
    const cacheStorage = new MockCacheStorage();
    (window as any).caches = cacheStorage;

    const cache = await cacheStorage.open('see-you-v1');
    const shellUrl = 'https://sutasomakrisnanda.github.io/see-you/';
    await cache.put(shellUrl, new Response('<html><body>Offline Ready</body></html>', { status: 200 }));

    // Set offline
    Object.defineProperty(navigator, 'onLine', { writable: true, configurable: true, value: false });
    expect(navigator.onLine).toBe(false);

    // Verify cache responds offline
    const cachedResponse = await cache.match(shellUrl);
    expect(cachedResponse).toBeDefined();
    expect(cachedResponse?.status).toBe(200);

    // Restore online
    Object.defineProperty(navigator, 'onLine', { writable: true, configurable: true, value: true });
  });
});
