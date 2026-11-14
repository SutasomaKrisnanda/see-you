/**
 * Tier 1 Feature Coverage: Audio Toggle & Gesture Playback
 *
 * Test Specifications:
 * - T1-AU-01: Default Muted Initial State
 * - T1-AU-02: Presence of Fixed Header Audio Control
 * - T1-AU-03: User Gesture Starts Audio Playback
 * - T1-AU-04: Secondary Gesture Pauses Audio
 * - T1-AU-05: Non-Blocking Behavior on Audio Failure
 *
 * Traceability: Brief §3.1, §9.4, §13, PROJECT.md #20, TEST_INFRA.md Area 8
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import { expectAudioState } from '../harness/assertions';
import { resetBrowserMocks, MockAudioElement } from '../harness/browserMocks';
import { RECIPIENT_NADYA } from '../harness/recipientFixtures';

describe('Feature Area 8: Audio Toggle & Gesture Playback [Tier 1]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T1-AU-01: Default Muted Initial State ensures audio is paused and button indicates muted', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    expectAudioState(container, false);
  });

  it('T1-AU-02: Presence of Fixed Header Audio Control is present and accessible', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const audioBtn =
      container.querySelector('[data-testid="audio-toggle"]') ||
      container.querySelector('.audio-toggle') ||
      container.querySelector('button[aria-label*="music" i]');

    expect(audioBtn).not.toBeNull();
    const label = audioBtn!.getAttribute('aria-label') || '';
    expect(/music|audio|suara|lagu/i.test(label)).toBe(true);
  });

  it('T1-AU-03: User Gesture Starts Audio Playback calls play() and updates UI to active', async () => {
    const playSpy = vi.spyOn(HTMLAudioElement.prototype, 'play');

    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    harness.toggleAudio();

    expect(playSpy).toHaveBeenCalled();
    expectAudioState(harness.container, true);
  });

  it('T1-AU-04: Secondary Gesture Pauses Audio calls pause() and returns to muted state', async () => {
    const pauseSpy = vi.spyOn(HTMLAudioElement.prototype, 'pause');

    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    // First click: plays audio
    harness.toggleAudio();
    expectAudioState(harness.container, true);

    // Second click: pauses audio
    harness.toggleAudio();
    expect(pauseSpy).toHaveBeenCalled();
    expectAudioState(harness.container, false);
  });

  it('T1-AU-05: Non-Blocking Behavior on Audio Failure handles NotAllowedError gracefully', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
      shouldRejectAudioPlay: true,
    });

    // Clicking audio when play will be rejected by browser policy
    expect(() => harness.toggleAudio()).not.toThrow();

    // App continues operating and audio remains in safe muted state
    expectAudioState(harness.container, false);
  });
});
