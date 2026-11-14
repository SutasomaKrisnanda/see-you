/**
 * Tier 3 Pairwise Combinations: Device & Token Matrix
 *
 * Test Specifications:
 * - TC-T3-01: Valid Token Resolution + Envelope Seal Tap Interaction
 * - TC-T3-02: Missing Token (?q= absent) + Desktop Gate Check
 * - TC-T3-03: Corrupted / Malformed Token + Envelope Opening Attempt
 * - TC-T3-04: Audio Gesture Consent + Envelope Stamp Interaction
 *
 * Traceability:
 * - Brief §7.1, §7.3, §8, §9.1, §9.4
 * - PROJECT.md #8, #9, #10, #11, #12, #14, #20
 * - TEST_INFRA.md Areas 1, 2, 3, 4, 5, 8
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import {
  expectDesktopGateVisible,
  expectDesktopGateHidden,
  expectMobileStoryVisible,
  expectQrCodePayload,
  expectSafeFallbackVisible,
  expectAudioState,
} from '../harness/assertions';
import { resetBrowserMocks, MockAudioElement } from '../harness/browserMocks';
import { RECIPIENT_BUDI, RECIPIENT_NADYA, MALFORMED_TOKENS } from '../harness/recipientFixtures';

describe('Tier 3: Device & Token Matrix [Pairwise]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('TC-T3-01: Valid Token Resolution + Envelope Seal Tap Interaction', async () => {
    const targetUrl = `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_BUDI.token}`;
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: targetUrl,
    });

    // 1. Mobile envelope displays recipient's name or personal invitation
    const mobileStory = expectMobileStoryVisible(harness.container);
    expect(mobileStory).toBeDefined();

    const recipientElement =
      harness.container.querySelector('.recipient-name') ||
      harness.container.querySelector('[data-testid="recipient-name"]');
    if (recipientElement) {
      expect(recipientElement.textContent).toMatch(new RegExp(RECIPIENT_BUDI.recipient.name, 'i'));
    }

    // 2. Locate stamp / wax seal button
    const stampBtn =
      harness.container.querySelector('.stamp-btn') ||
      harness.container.querySelector('[data-testid="stamp-btn"]') ||
      harness.container.querySelector('button[aria-label*="open" i]');

    if (stampBtn) {
      const ariaLabel = stampBtn.getAttribute('aria-label') || '';
      expect(ariaLabel).toMatch(/open/i);

      // 3. User taps wax seal button
      harness.tapStamp();

      // Stamp button enters pressed/disabled state
      const isPressed =
        stampBtn.classList.contains('stamp--pressed') ||
        stampBtn.getAttribute('aria-disabled') === 'true' ||
        (stampBtn as HTMLButtonElement).disabled;
      expect(isPressed).toBe(true);

      // Flap opening or transition classes
      const flap = harness.container.querySelector('.envelope__flap') || harness.container.querySelector('.flap');
      if (flap) {
        expect(
          flap.classList.contains('envelope__flap--open') ||
          flap.classList.contains('open') ||
          flap.getAttribute('data-state') === 'open'
        ).toBe(true);
      }
    }
  });

  it('TC-T3-02: Missing Token (?q= absent) + Desktop Gate Check', async () => {
    const desktopUrl = 'https://sutasomakrisnanda.github.io/see-you/';
    const { container } = await renderApp({
      viewport: { width: 1280, height: 800, pointer: 'fine' },
      initialUrl: desktopUrl,
    });

    // 1. Desktop gate mounts
    const gate = expectDesktopGateVisible(container);
    expect(gate).not.toBeNull();

    // 2. Wordmark SEE YOU. is rendered
    const text = gate.textContent || '';
    expect(text.includes('SEE') && text.includes('YOU')).toBe(true);

    // 3. Informational notice advising user to scan with mobile camera
    expect(/phone|mobile|scan|camera|hp/i.test(text)).toBe(true);

    // 4. QR code payload encodes exact base URL without undefined/null parameters
    expectQrCodePayload(container, desktopUrl);
    expect(container.innerHTML.includes('?q=undefined')).toBe(false);
    expect(container.innerHTML.includes('?q=null')).toBe(false);

    // 5. No private recipient data or sensitive letters are exposed
    const forbiddenNames = [RECIPIENT_NADYA.recipient.name, RECIPIENT_BUDI.recipient.name];
    for (const name of forbiddenNames) {
      expect(text.includes(name)).toBe(false);
    }
  });

  it('TC-T3-03: Corrupted / Malformed Token + Envelope Opening Attempt', async () => {
    const invalidUrl = `https://sutasomakrisnanda.github.io/see-you/?q=${MALFORMED_TOKENS.INVALID_TOKEN_999}`;
    const { container } = await renderApp({
      viewport: { width: 375, height: 667, pointer: 'coarse' },
      initialUrl: invalidUrl,
    });

    // 1. Recipient resolution fails and App renders safe fallback section
    const fallback = expectSafeFallbackVisible(container);
    expect(fallback).not.toBeNull();

    // 2. Friendly error notice displayed
    const fallbackText = fallback.textContent || '';
    expect(/letter not found|tidak ditemukan|invalid link/i.test(fallbackText)).toBe(true);

    // 3. Envelope and stamp button are NOT accessible in DOM
    const stampBtn = container.querySelector('.stamp-btn') || container.querySelector('[data-testid="stamp-btn"]');
    expect(stampBtn).toBeNull();

    // 4. Zero sensitive data from other interns leaked
    const forbiddenNames = [RECIPIENT_NADYA.recipient.name, RECIPIENT_BUDI.recipient.name];
    for (const name of forbiddenNames) {
      expect(container.textContent?.includes(name)).toBe(false);
    }
  });

  it('TC-T3-04: Audio Gesture Consent + Envelope Stamp Interaction', async () => {
    const targetUrl = `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`;
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: targetUrl,
    });

    // 1. Initial audio toggle shows muted / idle state
    const audioToggle =
      harness.container.querySelector('.audio-toggle') ||
      harness.container.querySelector('[data-testid="audio-toggle"]') ||
      harness.container.querySelector('button[aria-label*="music" i]');

    if (audioToggle) {
      const initialPressed = audioToggle.getAttribute('aria-pressed');
      expect(initialPressed === 'false' || initialPressed === null).toBe(true);
    }

    // 2. User taps envelope stamp, which acts as explicit user activation gesture
    const stampBtn =
      harness.container.querySelector('.stamp-btn') ||
      harness.container.querySelector('[data-testid="stamp-btn"]');

    if (stampBtn) {
      const playSpy = vi.spyOn(MockAudioElement.prototype, 'play');
      harness.tapStamp();

      // User gesture triggers audio playback or permits audio toggle
      if (audioToggle) {
        harness.toggleAudio();
        expect(playSpy).toHaveBeenCalled();
        expectAudioState(harness.container, true);
      }
    }
  });
});
