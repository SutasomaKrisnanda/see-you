/**
 * Tier 1 Feature Coverage: Desktop QR URL Retention
 *
 * Test Specifications:
 * - T1-QR-01: QR Code Presence on Desktop Gate
 * - T1-QR-02: QR Code Value Encodes Exact Location Href
 * - T1-QR-03: QR Code Preserves Additional Query Parameters
 * - T1-QR-04: QR Code Retains Subpath `/see-you/`
 * - T1-QR-05: Desktop Gate UI Instructional Copy & Brand
 *
 * Traceability: Brief §8, §14, PROJECT.md #7, #12, TEST_INFRA.md Area 2
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import { expectDesktopGateVisible, expectQrCodePayload } from '../harness/assertions';
import { resetBrowserMocks } from '../harness/browserMocks';

describe('Feature Area 2: Desktop QR URL Retention [Tier 1]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T1-QR-01: QR Code Presence on Desktop Gate renders canvas or SVG QR element', async () => {
    const targetUrl = 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit';
    const { container } = await renderApp({
      viewport: { width: 1200, height: 800, pointer: 'fine' },
      initialUrl: targetUrl,
    });

    const gate = expectDesktopGateVisible(container);
    const qrElement =
      gate.querySelector('svg') ||
      gate.querySelector('canvas') ||
      gate.querySelector('[data-testid="qr-code"]') ||
      gate.querySelector('[data-testid="desktop-qr"]');

    expect(qrElement).not.toBeNull();
  });

  it('T1-QR-02: QR Code Value Encodes Exact Location Href preserving query parameter', async () => {
    const targetUrl = 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit';
    const { container } = await renderApp({
      viewport: { width: 1200, height: 800, pointer: 'fine' },
      initialUrl: targetUrl,
    });

    expectDesktopGateVisible(container);
    expectQrCodePayload(container, targetUrl);
  });

  it('T1-QR-03: QR Code Preserves Additional Query Parameters alongside recipient token', async () => {
    const targetUrl = 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit&source=hamper_qr';
    const { container } = await renderApp({
      viewport: { width: 1280, height: 800, pointer: 'fine' },
      initialUrl: targetUrl,
    });

    expectDesktopGateVisible(container);
    expectQrCodePayload(container, targetUrl);
  });

  it('T1-QR-04: QR Code Retains Subpath /see-you/ under custom hostnames', async () => {
    const targetUrl = 'https://example.com/see-you/?q=tok_128';
    const { container } = await renderApp({
      viewport: { width: 1280, height: 800, pointer: 'fine' },
      initialUrl: targetUrl,
    });

    expectDesktopGateVisible(container);
    expectQrCodePayload(container, targetUrl);
  });

  it('T1-QR-05: Desktop Gate UI Instructional Copy & Brand renders branding and guidance', async () => {
    const { container } = await renderApp({
      viewport: { width: 1280, height: 800, pointer: 'fine' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    const gate = expectDesktopGateVisible(container);
    const text = gate.textContent || '';

    // Check brand wordmark presence
    expect(text.includes('SEE') && text.includes('YOU')).toBe(true);

    // Check instructional copy advising user to scan with camera
    expect(/scan|camera|phone|buka di hp/i.test(text)).toBe(true);
  });
});
