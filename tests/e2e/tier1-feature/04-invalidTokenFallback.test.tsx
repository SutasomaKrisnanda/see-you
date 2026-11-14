/**
 * Tier 1 Feature Coverage: Missing/Invalid Token Handling
 *
 * Test Specifications:
 * - T1-TK-01: Missing Token Query String
 * - T1-TK-02: Empty Token Parameter (?q=)
 * - T1-TK-03: Unrecognized Token String
 * - T1-TK-04: Zero Information Leakage on Fallback
 * - T1-TK-05: Helpful Fallback User Guidance
 *
 * Traceability: Brief §7.3, PROJECT.md #10, TEST_INFRA.md Area 4
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import { expectSafeFallbackVisible } from '../harness/assertions';
import { resetBrowserMocks } from '../harness/browserMocks';

describe('Feature Area 4: Missing/Invalid Token Handling [Tier 1]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T1-TK-01: Missing Token Query String renders safe fallback screen', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/',
    });

    const fallback = expectSafeFallbackVisible(container);
    expect(fallback).not.toBeNull();
  });

  it('T1-TK-02: Empty Token Parameter (?q=) renders fallback screen without crashing', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=',
    });

    expectSafeFallbackVisible(container);
  });

  it('T1-TK-03: Unrecognized Token String routes to fallback screen and displays no letter content', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=random_unknown_token_value',
    });

    expectSafeFallbackVisible(container);
  });

  it('T1-TK-04: Zero Information Leakage on Fallback ensures no intern names are disclosed', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=unknown_attempt_99999',
    });

    expectSafeFallbackVisible(container);

    const fullText = container.textContent || '';
    const protectedNames = ['Nadya Putri', 'Budi Santoso', 'Siti Rahma', 'Dewi Ayu'];
    for (const name of protectedNames) {
      expect(fullText.includes(name)).toBe(false);
    }
  });

  it('T1-TK-05: Helpful Fallback User Guidance prompts user to check link or re-scan hamper QR', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=invalid_tok',
    });

    const fallback = expectSafeFallbackVisible(container);
    const instructions = fallback.textContent || '';

    // Helpful user guidance mentioning link, QR, or hamper
    expect(/link|scan|qr|hamper|bunga|periksa/i.test(instructions)).toBe(true);
  });
});
