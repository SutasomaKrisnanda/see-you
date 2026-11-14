/**
 * Tier 1 Feature Coverage: Fixed Topbar & Chapter Counter
 *
 * Test Specifications:
 * - T1-TB-01: Fixed Header Brand Wordmark
 * - T1-TB-02: Initial Chapter Counter Display
 * - T1-TB-03: Initial Progress Bar Width
 * - T1-TB-04: Mid-Story Chapter Counter Progression
 * - T1-TB-05: Final Chapter Counter & Progress Completion
 *
 * Traceability: Brief §3.1, PROJECT.md #17, #18, #19, TEST_INFRA.md Area 7
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import { expectChapterCounter } from '../harness/assertions';
import { resetBrowserMocks } from '../harness/browserMocks';
import { RECIPIENT_NADYA } from '../harness/recipientFixtures';

describe('Feature Area 7: Fixed Topbar & Chapter Counter [Tier 1]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T1-TB-01: Fixed Header Brand Wordmark renders SEE YOU. branding with emphasis', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const wordmark =
      container.querySelector('.wordmark') ||
      container.querySelector('#story-header h1') ||
      container.querySelector('header h1');

    expect(wordmark).not.toBeNull();
    const text = wordmark!.textContent?.trim() || '';
    expect(text).toBe('SEE YOU.');

    // YOU. is italicized or emphasized
    const emphasis = wordmark!.querySelector('em, i, span');
    expect(emphasis).not.toBeNull();
    expect(emphasis!.textContent?.trim()).toBe('YOU.');
  });

  it('T1-TB-02: Initial Chapter Counter Display shows 01 / 06 at envelope chapter', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    expectChapterCounter(container, '01 / 06');
  });

  it('T1-TB-03: Initial Progress Bar Width is approximately 16.6% (1/6)', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const fill =
      container.querySelector('.progress-fill') ||
      container.querySelector('[data-testid="progress-fill"]');

    expect(fill).not.toBeNull();
    const widthStyle = fill!.getAttribute('style') || '';
    expect(/width:\s*16\.6%|calc\(100%\s*\/\s*6\)/i.test(widthStyle)).toBe(true);
  });

  it('T1-TB-04: Mid-Story Chapter Counter Progression advances to 03 / 06 and 50% width', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    // Trigger chapter 3 visibility
    harness.triggerChapter(3);

    expectChapterCounter(harness.container, '03 / 06');

    const fill =
      harness.container.querySelector('.progress-fill') ||
      harness.container.querySelector('[data-testid="progress-fill"]');

    expect(fill).not.toBeNull();
    const widthStyle = fill!.getAttribute('style') || '';
    expect(/50%/i.test(widthStyle)).toBe(true);
  });

  it('T1-TB-05: Final Chapter Counter & Progress Completion shows 06 / 06 and 100% width', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    // Trigger chapter 6 visibility
    harness.triggerChapter(6);

    expectChapterCounter(harness.container, '06 / 06');

    const fill =
      harness.container.querySelector('.progress-fill') ||
      harness.container.querySelector('[data-testid="progress-fill"]');

    expect(fill).not.toBeNull();
    const widthStyle = fill!.getAttribute('style') || '';
    expect(/100%/i.test(widthStyle)).toBe(true);
  });
});
