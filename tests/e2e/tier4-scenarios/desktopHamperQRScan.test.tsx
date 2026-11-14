/**
 * Tier 4 Scenario 3: Desktop User Scans Hamper QR
 *
 * User Profile: Recipient opens the URL on their MacBook/PC instead of their smartphone.
 * Environment: Chrome Desktop, viewport 1440x900, fine mouse pointer.
 * URL: https://sutasomakrisnanda.github.io/see-you/?q=tok_budi_128bit
 *
 * Workflow:
 * 1. Desktop Viewport Detection (viewport 1440px > 768px, fine pointer -> desktop gate)
 * 2. QR Screen Presentation (DesktopQRScreen renders, brand header SEE YOU., scan guidance)
 * 3. QR Content Verification (payload extracted from SVG/canvas exactly matches URL with ?q= preserved)
 * 4. Responsive Window Resize (user shrinks window to 375px -> auto transitions to mobile EnvelopeSection)
 *
 * Traceability:
 * - Brief §8, §14
 * - PROJECT.md #9, #11, #12
 * - TEST_INFRA.md Area 1, 2, 3
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import {
  expectDesktopGateVisible,
  expectDesktopGateHidden,
  expectMobileStoryVisible,
  expectQrCodePayload,
} from '../harness/assertions';
import { resetBrowserMocks } from '../harness/browserMocks';
import { RECIPIENT_BUDI } from '../harness/recipientFixtures';

describe('Tier 4 Scenario 3: Desktop User Scans Hamper QR', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('detects desktop screen, renders dynamic QR code with exact URL & token, and handles responsive resize', async () => {
    // -------------------------------------------------------------------------
    // Step 1 & 2: Desktop Viewport Detection & QR Presentation
    // -------------------------------------------------------------------------
    const targetUrl = `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_BUDI.token}`;
    const harness = await renderApp({
      viewport: { width: 1440, height: 900, pointer: 'fine' },
      initialUrl: targetUrl,
    });

    // Desktop gate mounts and mobile story is hidden
    const gate = expectDesktopGateVisible(harness.container);
    expect(gate).not.toBeNull();

    // Instructional copy guidance is present
    const gateText = gate.textContent || '';
    expect(gateText.includes('SEE') && gateText.includes('YOU')).toBe(true);
    expect(/phone|mobile|scan|camera|hp/i.test(gateText)).toBe(true);

    // -------------------------------------------------------------------------
    // Step 3: QR Content Verification
    // -------------------------------------------------------------------------
    // Assert QR code payload matches exact target URL preserving ?q= parameter
    expectQrCodePayload(harness.container, targetUrl);

    // Ensure the token wasn't dropped
    expect(targetUrl.includes(RECIPIENT_BUDI.token)).toBe(true);

    // -------------------------------------------------------------------------
    // Step 4: Responsive Window Resize
    // -------------------------------------------------------------------------
    // User shrinks browser window to 375px mobile dimension
    harness.setViewport(375, 667, 'coarse');

    // Desktop gate unmounts/hides and mobile envelope/story appears
    expectDesktopGateHidden(harness.container);
    const mobileStory = expectMobileStoryVisible(harness.container);
    expect(mobileStory).toBeDefined();

    // The query parameter is still present
    expect(window.location.search).toBe(`?q=${RECIPIENT_BUDI.token}`);
  });
});
