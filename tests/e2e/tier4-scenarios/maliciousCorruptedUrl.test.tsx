/**
 * Tier 4 Scenario 4: Corrupted, Missing, or Injected URL Token
 *
 * User Profile: Visitor accesses site with no token, an expired token, or a malicious script injection.
 * Environment: Mobile or desktop viewport.
 * Test Matrix:
 * - Subcase 4A (Missing): https://sutasomakrisnanda.github.io/see-you/
 * - Subcase 4B (Corrupted): https://sutasomakrisnanda.github.io/see-you/?q=invalid-token-xyz
 * - Subcase 4C (Injected): https://sutasomakrisnanda.github.io/see-you/?q=%3Cscript%3Ealert(1)%3C/script%3E
 *
 * Workflow:
 * 1. Token Validation (resolver inspects searchParams.get('q'), checks character whitelist & static dictionary)
 * 2. Safe Fallback Presentation (App routes to FallbackSection #invalid, displays "Letter Not Found")
 * 3. Confidentiality Verification (inspect DOM tree: zero recipient records, team messages, or memories leaked; no stamp button)
 *
 * Traceability:
 * - Brief §7.1, §7.3, §18
 * - PROJECT.md #8, #9, #10
 * - TEST_INFRA.md Area 3, 4
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import { expectSafeFallbackVisible } from '../harness/assertions';
import { resetBrowserMocks } from '../harness/browserMocks';
import {
  ALL_RECIPIENT_LIST,
  MALFORMED_TOKENS,
} from '../harness/recipientFixtures';

describe('Tier 4 Scenario 4: Corrupted, Missing, or Injected URL Token', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('Subcase 4A (Missing Token): renders safe fallback screen with zero sensitive data leak', async () => {
    const missingTokenUrl = 'https://sutasomakrisnanda.github.io/see-you/';
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: missingTokenUrl,
    });

    // Safe fallback screen must be visible
    const fallback = expectSafeFallbackVisible(container);
    expect(fallback).not.toBeNull();

    // Friendly guidance shown
    expect(fallback.textContent).toMatch(/letter not found|tidak ditemukan|invalid/i);

    // No stamp / unseal button rendered
    const stampBtn = container.querySelector('.stamp-btn');
    expect(stampBtn).toBeNull();

    // Confidentiality verification: no intern names exposed
    for (const recipient of ALL_RECIPIENT_LIST) {
      expect(container.textContent?.includes(recipient.recipient.name)).toBe(false);
    }
  });

  it('Subcase 4B (Corrupted Token): intercepts unrecognized token and blocks access to letters', async () => {
    const corruptedUrl = `https://sutasomakrisnanda.github.io/see-you/?q=${MALFORMED_TOKENS.INVALID_TOKEN_999}`;
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: corruptedUrl,
    });

    const fallback = expectSafeFallbackVisible(container);
    expect(fallback).not.toBeNull();

    // Ensure envelope section is absent
    const envelopeSection = container.querySelector('#envelope-section');
    if (envelopeSection) {
      const style = window.getComputedStyle(envelopeSection);
      expect(style.display === 'none' || envelopeSection.getAttribute('aria-hidden') === 'true').toBe(true);
    }

    // Confidentiality check
    for (const recipient of ALL_RECIPIENT_LIST) {
      expect(container.textContent?.includes(recipient.recipient.name)).toBe(false);
    }
  });

  it('Subcase 4C (Injected Script Token): neutralizes XSS payload without execution or HTML injection', async () => {
    const xssUrl = `https://sutasomakrisnanda.github.io/see-you/?q=${encodeURIComponent(
      MALFORMED_TOKENS.XSS_SCRIPT_TAG
    )}`;
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: xssUrl,
    });

    // Fallback displayed safely
    expectSafeFallbackVisible(container);

    // Verify raw script tag was not injected into DOM as an executable script element
    const scriptTags = Array.from(container.querySelectorAll('script'));
    const hasInjectedScript = scriptTags.some(s => s.textContent?.includes('alert(1)'));
    expect(hasInjectedScript).toBe(false);

    // Verify zero recipient data leak
    for (const recipient of ALL_RECIPIENT_LIST) {
      expect(container.textContent?.includes(recipient.recipient.name)).toBe(false);
    }
  });
});
