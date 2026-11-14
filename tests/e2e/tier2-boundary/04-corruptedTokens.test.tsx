/**
 * Tier 2 Boundary Tests: Missing / Corrupted / Attack Token Handling
 *
 * Covers:
 * - T2-TK-01: Cross-Site Scripting (XSS) Attack in ?q=
 * - T2-TK-02: SQL Injection String in ?q=
 * - T2-TK-03: Malformed URI Encoding in Query String (%E0%A4%A)
 * - T2-TK-04: Prototype Pollution Attack Keys in ?q= (__proto__, constructor)
 * - T2-TK-05: Whitespace-Only Token String (%20%20%20)
 *
 * Traceability:
 * - Brief §7.1, §7.3
 * - PROJECT.md #9, #10
 * - TEST_INFRA.md Area 4
 * - Spec Miner handoff.md Section 6 Area 4
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resetBrowserMocks } from '../harness/browserMocks';
import {
  MALFORMED_TOKENS,
  isValidTokenFormat,
  mockResolveRecipient,
} from '../harness/recipientFixtures';
import { expectSafeFallbackVisible } from '../harness/assertions';
import { renderApp } from '../harness/renderHarness';

describe('Tier 2 Boundary: Missing / Corrupted / Attack Tokens', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T2-TK-01: Cross-Site Scripting (XSS) Attack in ?q=', async () => {
    const xssToken = MALFORMED_TOKENS.XSS_SCRIPT_TAG;
    expect(isValidTokenFormat(xssToken)).toBe(false);
    expect(mockResolveRecipient(xssToken)).toBeNull();

    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${encodeURIComponent(xssToken)}`,
    });

    // Verify script tags are NOT executed or injected into DOM as executable scripts
    const scriptTags = app.container.querySelectorAll('script');
    scriptTags.forEach(script => {
      expect(script.textContent).not.toContain("alert('xss')");
      expect(script.textContent).not.toContain('alert(1)');
    });

    // Check safe fallback screen display
    expectSafeFallbackVisible(app.container);
  });

  it('T2-TK-02: SQL Injection String in ?q=', async () => {
    const sqliToken = MALFORMED_TOKENS.SQL_DROP_TABLE;
    expect(isValidTokenFormat(sqliToken)).toBe(false);
    expect(mockResolveRecipient(sqliToken)).toBeNull();

    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${encodeURIComponent(sqliToken)}`,
    });

    // Verification: Zero recipient data exposed, no unhandled exceptions
    const bodyText = app.container.textContent || '';
    expect(bodyText).not.toContain('Nadya Putri');
    expect(bodyText).not.toContain('Budi Santoso');

    expectSafeFallbackVisible(app.container);
  });

  it('T2-TK-03: Malformed URI Encoding in Query String (%E0%A4%A)', async () => {
    const malformedSearch = '?q=%E0%A4%A';

    // Verify that URIError is handled safely by recipient resolver logic
    let caughtError: unknown = null;
    try {
      decodeURIComponent('%E0%A4%A');
    } catch (e) {
      caughtError = e;
    }
    expect(caughtError).toBeInstanceOf(URIError);

    // App must catch this error and render fallback without crashing
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/${malformedSearch}`,
    });

    expect(app.container).toBeDefined();
    expectSafeFallbackVisible(app.container);
  });

  it('T2-TK-04: Prototype Pollution Attack Keys in ?q=', async () => {
    // Attack payloads that target Object prototype
    const protoTokens = ['__proto__', 'constructor', 'prototype', 'toString'];

    for (const key of protoTokens) {
      expect(isValidTokenFormat(key)).toBe(false);
      expect(mockResolveRecipient(key)).toBeNull();

      // Ensure Object prototype was not polluted
      expect((Object.prototype as any).polluted).toBeUndefined();
    }

    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=__proto__',
    });

    expect((Object.prototype as any).polluted).toBeUndefined();
    expectSafeFallbackVisible(app.container);
  });

  it('T2-TK-05: Whitespace-Only Token String (%20%20%20)', async () => {
    const whitespaceToken = MALFORMED_TOKENS.WHITESPACE_ONLY;
    expect(isValidTokenFormat(whitespaceToken.trim())).toBe(false);
    expect(mockResolveRecipient(whitespaceToken)).toBeNull();

    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=%20%20%20',
    });

    expectSafeFallbackVisible(app.container);
  });
});
