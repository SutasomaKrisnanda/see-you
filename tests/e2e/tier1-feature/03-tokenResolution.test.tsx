/**
 * Tier 1 Feature Coverage: Recipient Token Resolution
 *
 * Test Specifications:
 * - T1-TR-01: Primary Recipient Cover Name Resolution
 * - T1-TR-02: Chapter 02 Greeting Nickname Resolution
 * - T1-TR-03: Chapter 03 Facilitator Letter Personalization
 * - T1-TR-04: Secondary Recipient Token Switch
 * - T1-TR-05: Pure Client-Side Static Resolution
 *
 * Traceability: Brief §5, §7.1, §7.2, PROJECT.md #8, #9, #22, #23, TEST_INFRA.md Area 3
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import { resetBrowserMocks } from '../harness/browserMocks';
import { RECIPIENT_NADYA, RECIPIENT_BUDI } from '../harness/recipientFixtures';

describe('Feature Area 3: Recipient Token Resolution [Tier 1]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
    vi.restoreAllMocks();
  });

  it('T1-TR-01: Primary Recipient Cover Name Resolution displays Nadya Putri on envelope cover', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const coverRecipientEl =
      container.querySelector('#recipient-cover') ||
      container.querySelector('.recipient-name') ||
      container.querySelector('[data-testid="recipient-name"]');

    expect(coverRecipientEl).not.toBeNull();
    expect(coverRecipientEl!.textContent).toContain('Nadya Putri');
  });

  it('T1-TR-02: Chapter 02 Greeting Nickname Resolution personalizes greeting section', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const greetingSection =
      container.querySelector('#greeting-section') ||
      container.querySelector('[data-chapter="02"]') ||
      container.querySelector('.section-greeting');

    expect(greetingSection).not.toBeNull();
    const greetingText = greetingSection!.textContent || '';
    expect(greetingText.includes(RECIPIENT_NADYA.recipient.nickname) || greetingText.includes('Nadya')).toBe(true);
  });

  it('T1-TR-03: Chapter 03 Facilitator Letter Personalization renders letter for recipient', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const facilitatorSection =
      container.querySelector('#facilitator-section') ||
      container.querySelector('[data-chapter="03"]') ||
      container.querySelector('.section-facilitator');

    expect(facilitatorSection).not.toBeNull();
    const facilitatorText = facilitatorSection!.textContent || '';

    // Salutation contains recipient name/nickname
    expect(facilitatorText.includes(RECIPIENT_NADYA.recipient.nickname) || facilitatorText.includes('Nadya')).toBe(true);

    // Signature matches Krisnanda
    expect(facilitatorText).toContain('Krisnanda');
  });

  it('T1-TR-04: Secondary Recipient Token Switch resolves Budi Santoso cleanly without cross-leakage', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_BUDI.token}`,
    });

    const text = container.textContent || '';

    // Contains Budi's name
    expect(text).toContain('Budi Santoso');

    // Does NOT contain Nadya's name
    expect(text.includes('Nadya Putri')).toBe(false);
  });

  it('T1-TR-05: Pure Client-Side Static Resolution requires 0 network API calls', async () => {
    const fetchSpy = vi.spyOn(window, 'fetch');
    const xhrSpy = vi.spyOn(window, 'XMLHttpRequest');

    await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    // Pure static resolution must not call backend APIs for recipient data
    const apiCalls = fetchSpy.mock.calls.filter(([req]) => {
      const url = typeof req === 'string' ? req : (req as Request).url;
      return url.includes('/api/') || url.includes('/recipients');
    });

    expect(apiCalls.length).toBe(0);
    expect(xhrSpy).not.toHaveBeenCalled();
  });
});
