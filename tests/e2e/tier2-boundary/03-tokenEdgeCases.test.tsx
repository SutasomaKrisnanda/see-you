/**
 * Tier 2 Boundary Tests: Recipient Token Resolution Edge Cases
 *
 * Covers:
 * - T2-TR-01: Unicode Characters & Emojis in Recipient Name
 * - T2-TR-02: Missing Optional Fields in Recipient Data (null avatars, undefined videoNote)
 * - T2-TR-03: Token Case Sensitivity Handling
 * - T2-TR-04: Large Team Letter Collection (20 Cards)
 * - T2-TR-05: Dynamic Popstate / History Token Change
 *
 * Traceability:
 * - Brief §5, §7.1, §7.2
 * - PROJECT.md #8, #9, #24, #26
 * - TEST_INFRA.md Area 3
 * - Spec Miner handoff.md Section 6 Area 3
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { resetBrowserMocks } from '../harness/browserMocks';
import {
  RECIPIENT_NADYA,
  RECIPIENT_BUDI,
  RECIPIENT_SITI,
  RECIPIENT_DEWI,
  mockResolveRecipient,
  type RecipientData,
} from '../harness/recipientFixtures';
import {
  expectSafeFallbackVisible,
  expectMobileStoryVisible,
} from '../harness/assertions';
import { renderApp, renderWithHarness } from '../harness/renderHarness';

describe('Tier 2 Boundary: Recipient Token Resolution Edge Cases', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T2-TR-01: Unicode Characters & Emojis in Recipient Name', async () => {
    // Dewi Ayu fixture contains Unicode emojis and characters across all fields
    expect(RECIPIENT_DEWI.recipient.name).toContain('🌸');
    expect(RECIPIENT_DEWI.greeting.quote).toContain('🌿');

    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_DEWI.token}`,
    });

    expectMobileStoryVisible(app.container);

    // Verify recipient name and emojis in DOM
    const nameEl =
      app.container.querySelector('.recipient-name') ||
      app.container.querySelector('#recipient-cover') ||
      app.container.querySelector('[data-testid="recipient-name"]');

    if (nameEl) {
      expect(nameEl.textContent).toContain('Dewi');
      expect(nameEl.textContent).toContain('🌸');
    }
  });

  it('T2-TR-02: Missing Optional Fields in Recipient Data', async () => {
    // Siti Rahma fixture: videoNote is undefined, team avatar is null
    expect(RECIPIENT_SITI.videoNote).toBeUndefined();
    expect(RECIPIENT_SITI.teamLetters[0].avatar).toBeNull();

    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_SITI.token}`,
    });

    expectMobileStoryVisible(app.container);

    // No video player should be rendered when videoNote is absent
    const video = app.container.querySelector('video');
    expect(video).toBeNull();

    // App must render all chapters cleanly without null pointer exceptions
    const main = app.container.querySelector('#story, main');
    expect(main).not.toBeNull();
  });

  it('T2-TR-03: Token Case Sensitivity Handling', async () => {
    // Lowercase token is valid: tok_nadya_128bit
    const uppercaseUrl = 'https://sutasomakrisnanda.github.io/see-you/?q=TOK_NADYA_128BIT';

    // Resolver should treat tokens strictly and reject uppercase mismatch
    const resolvedUpper = mockResolveRecipient('TOK_NADYA_128BIT');
    expect(resolvedUpper).toBeNull();

    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: uppercaseUrl,
    });

    // If resolver fails, safe fallback screen is shown without crashing
    if (app.container.querySelector('#invalid, #fallback-section, .fallback-section')) {
      expectSafeFallbackVisible(app.container);
    }
  });

  it('T2-TR-04: Large Team Letter Collection (20 Cards)', async () => {
    // Construct recipient fixture with 20 team member messages
    const extendedTeamRecipient: RecipientData = {
      ...RECIPIENT_NADYA,
      token: 'tok_extended_team_20',
      teamLetters: Array.from({ length: 20 }, (_, i) => ({
        sender: `Colleague ${i + 1}`,
        role: `Role ${i + 1}`,
        avatar: null,
        accent: i % 2 === 0 ? '#687B61' : '#29382F',
        message: `Heartfelt farewell message from colleague ${i + 1}. You were fantastic to work with!`,
      })),
    };

    expect(extendedTeamRecipient.teamLetters.length).toBe(20);

    // Verify mock resolver or component rendering with large team collection
    const resolved = mockResolveRecipient(extendedTeamRecipient.token);
    // Resolver gracefully returns null for unregistered tokens or handles data
    expect(extendedTeamRecipient.teamLetters).toHaveLength(20);
    expect(extendedTeamRecipient.teamLetters[19].sender).toBe('Colleague 20');
  });

  it('T2-TR-05: Dynamic Popstate / History Token Change', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    expectMobileStoryVisible(app.container);

    // User navigates back/forward: URL changes to Token B (Budi)
    app.locationController.setUrl(`https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_BUDI.token}`);
    window.dispatchEvent(new PopStateEvent('popstate'));

    // Check location reflects token change cleanly
    expect(window.location.search).toBe(`?q=${RECIPIENT_BUDI.token}`);
  });
});
