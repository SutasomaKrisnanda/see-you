/**
 * Tier 2 Boundary Tests: Desktop QR URL Retention
 *
 * Covers:
 * - T2-QR-01: URI-Encoded Special Characters in Token
 * - T2-QR-02: Massive Query String Payload (512-Byte String)
 * - T2-QR-03: URL with Trailing Hash Fragment (#facilitator-section)
 * - T2-QR-04: Localhost Development Port Preservation
 * - T2-QR-05: Duplicate Query Parameters (?q=tokenA&q=tokenB)
 *
 * Traceability:
 * - Brief §8, §14
 * - PROJECT.md #12
 * - TEST_INFRA.md Area 2
 * - Spec Miner handoff.md Section 6 Area 2
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resetBrowserMocks } from '../harness/browserMocks';
import {
  expectDesktopGateVisible,
  expectQrCodePayload,
} from '../harness/assertions';
import { renderApp } from '../harness/renderHarness';

describe('Tier 2 Boundary: Desktop QR URL Retention', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T2-QR-01: URI-Encoded Special Characters in Token', async () => {
    // Encoded URL with special characters %2B (+), %2F (/), %3D (=)
    const encodedUrl = 'https://sutasomakrisnanda.github.io/see-you/?q=tok%2Bspecial%2Fkey%3D';

    const app = await renderApp({
      viewport: { width: 1200, height: 800, pointer: 'fine' },
      initialUrl: encodedUrl,
    });

    expectDesktopGateVisible(app.container);

    // QR payload must preserve encoded characters verbatim without double-encoding into %252B
    expectQrCodePayload(app.container, encodedUrl);
  });

  it('T2-QR-02: Massive Query String Payload (512-Byte String)', async () => {
    // 512-byte alphanumeric token string
    const longToken = 'tok_' + 'a'.repeat(508);
    const longUrl = `https://sutasomakrisnanda.github.io/see-you/?q=${longToken}`;

    const app = await renderApp({
      viewport: { width: 1280, height: 800, pointer: 'fine' },
      initialUrl: longUrl,
    });

    expectDesktopGateVisible(app.container);

    // QR code SVG/canvas must render without buffer overflow or throwing exception
    expectQrCodePayload(app.container, longUrl);

    // Ensure the QR code element has non-zero geometry
    const qrElement = app.container.querySelector('svg, canvas');
    expect(qrElement).not.toBeNull();
  });

  it('T2-QR-03: URL with Trailing Hash Fragment (#facilitator-section)', async () => {
    const urlWithHash = 'https://sutasomakrisnanda.github.io/see-you/?q=tok_128#facilitator-section';

    const app = await renderApp({
      viewport: { width: 1024, height: 768, pointer: 'fine' },
      initialUrl: urlWithHash,
    });

    expectDesktopGateVisible(app.container);

    // Generated QR must retain both query token and deep-link hash
    expectQrCodePayload(app.container, urlWithHash);
  });

  it('T2-QR-04: Localhost Development Port Preservation', async () => {
    // Dev server URL with port 5173
    const devUrl = 'http://localhost:5173/see-you/?q=dev_token';

    const app = await renderApp({
      viewport: { width: 1200, height: 900, pointer: 'fine' },
      initialUrl: devUrl,
    });

    expectDesktopGateVisible(app.container);

    // QR code must encode exact origin with port: http://localhost:5173/...
    expectQrCodePayload(app.container, devUrl);
  });

  it('T2-QR-05: Duplicate Query Parameters (?q=tokenA&q=tokenB)', async () => {
    const multiParamUrl = 'https://sutasomakrisnanda.github.io/see-you/?q=tokenA&q=tokenB';

    const app = await renderApp({
      viewport: { width: 1200, height: 800, pointer: 'fine' },
      initialUrl: multiParamUrl,
    });

    expectDesktopGateVisible(app.container);

    // QR generator handles duplicate keys deterministically without crashing
    expectQrCodePayload(app.container, multiParamUrl);
  });
});
