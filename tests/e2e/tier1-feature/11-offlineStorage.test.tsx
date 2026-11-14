/**
 * Tier 1 Feature Coverage: "Save This Memory" Offline Engine
 *
 * Test Specifications:
 * - T1-OS-01: Save Memory Button Presence in Closing Chapter
 * - T1-OS-02: Button State Transitions to Saving on Click
 * - T1-OS-03: Explicit Asset Ingestion into Cache Storage
 * - T1-OS-04: Active Cache Match Verification Phase
 * - T1-OS-05: Verified Success Confirmation Display
 *
 * Traceability: Brief §11.2, PROJECT.md #32, #33, TEST_INFRA.md Area 11
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import { resetBrowserMocks } from '../harness/browserMocks';
import { RECIPIENT_NADYA } from '../harness/recipientFixtures';

describe('Feature Area 11: "Save This Memory" Offline Engine [Tier 1]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
    vi.restoreAllMocks();
  });

  it('T1-OS-01: Save Memory Button Presence in Closing Chapter is rendered with clear label', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const saveBtn =
      harness.container.querySelector('#save-memory') ||
      harness.container.querySelector('.btn-save-memory') ||
      harness.container.querySelector('[data-testid="save-memory"]');

    expect(saveBtn).not.toBeNull();
    const text = saveBtn!.textContent || '';
    expect(/save|simpan|offline/i.test(text)).toBe(true);
  });

  it('T1-OS-02: Button State Transitions to Saving on Click updates button state', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const saveBtn = harness.saveMemory();
    expect(saveBtn).toBeDefined();

    // Button should be in saving or disabled state
    const isSaving =
      saveBtn.hasAttribute('disabled') ||
      saveBtn.getAttribute('aria-busy') === 'true' ||
      /saving|menyimpan/i.test(saveBtn.textContent || '');

    expect(isSaving).toBe(true);
  });

  it('T1-OS-03: Explicit Asset Ingestion into Cache Storage opens cache and stores assets', async () => {
    const cachesOpenSpy = vi.spyOn(window.caches, 'open');

    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    harness.saveMemory();

    // Verify cache named see-you-v1 was opened
    expect(cachesOpenSpy).toHaveBeenCalledWith(expect.stringMatching(/see-you-v/));
  });

  it('T1-OS-04: Active Cache Match Verification Phase verifies stored assets before completing', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const cache = await window.caches.open('see-you-v1');
    const matchSpy = vi.spyOn(cache, 'match');

    harness.saveMemory();

    // Allow async cache operation to trigger match verification
    await vi.waitFor(() => {
      expect(matchSpy).toHaveBeenCalled();
    });
  });

  it('T1-OS-05: Verified Success Confirmation Display shows confirmed offline badge', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const saveBtn = harness.saveMemory();

    // Wait for save and verification to complete successfully
    await vi.waitFor(() => {
      const text = saveBtn.textContent || '';
      const isSaved = /saved|tersimpan/i.test(text) || saveBtn.classList.contains('is-saved');
      expect(isSaved).toBe(true);
    });
  });
});
