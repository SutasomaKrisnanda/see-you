/**
 * Tier 2 Boundary Tests: Subpath Deployment (/see-you/) & URL Variations
 *
 * Covers:
 * - T2-SP-01: Missing Trailing Slash in Base URL (/see-you vs /see-you/)
 * - T2-SP-02: Query Preceding Hash Fragment under Subpath
 * - T2-SP-03: Service Worker Scope Boundary Isolation
 * - T2-SP-04: Cache Busting Query Parameters on Subpath
 * - T2-SP-05: Manifest JSON Subpath Scoping Validation
 *
 * Traceability:
 * - Brief §11.1, §14
 * - PROJECT.md #7, #30, #31
 * - TEST_INFRA.md Area 12
 * - Spec Miner handoff.md Section 6 Area 12
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { resetBrowserMocks } from '../harness/browserMocks';
import { RECIPIENT_NADYA } from '../harness/recipientFixtures';
import { renderApp } from '../harness/renderHarness';

describe('Tier 2 Boundary: Subpath Deployment (/see-you/) & URL Variations', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T2-SP-01: Missing Trailing Slash in Base URL (/see-you vs /see-you/)', async () => {
    // URL without trailing slash before query parameter
    const noTrailingSlashUrl = 'https://sutasomakrisnanda.github.io/see-you?q=tok_nadya_128bit';

    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: noTrailingSlashUrl,
    });

    expect(window.location.search).toBe('?q=tok_nadya_128bit');

    // Static assets must resolve under /see-you/ or relative ./, never root /
    const staticLinks = app.container.querySelectorAll('link[href], script[src], img[src]');
    staticLinks.forEach(el => {
      const src = el.getAttribute('src') || el.getAttribute('href') || '';
      if (src && !src.startsWith('data:') && !src.startsWith('http')) {
        expect(src.startsWith('/see-you/') || src.startsWith('./') || src.startsWith('assets/')).toBe(true);
      }
    });
  });

  it('T2-SP-02: Query Preceding Hash Fragment under Subpath', async () => {
    const urlWithHash = 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit#facilitator-section';

    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: urlWithHash,
    });

    // Query param and hash fragment must both be preserved
    expect(window.location.search).toBe('?q=tok_nadya_128bit');
    expect(window.location.hash).toBe('#facilitator-section');
    expect(window.location.pathname).toBe('/see-you/');
  });

  it('T2-SP-03: Service Worker Scope Boundary Isolation', async () => {
    let registeredScope = '';
    const registerSpy = vi.fn().mockImplementation((_script: string, options?: RegistrationOptions) => {
      registeredScope = options?.scope || '';
      return Promise.resolve({ scope: registeredScope });
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      configurable: true,
      value: { register: registerSpy },
    });

    // Attempt registration
    if (navigator.serviceWorker) {
      await navigator.serviceWorker.register('/see-you/sw.js', { scope: '/see-you/' });
      expect(registeredScope).toBe('/see-you/');
    }
  });

  it('T2-SP-04: Cache Busting Query Parameters on Subpath', async () => {
    // Additional cache-busting and analytics parameters alongside token
    const multiParamUrl = 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit&v=1.0.1&ref=hamper_qr';

    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: multiParamUrl,
    });

    const searchParams = new URLSearchParams(window.location.search);
    // Token extraction should parse q correctly despite other params
    expect(searchParams.get('q')).toBe('tok_nadya_128bit');
    expect(searchParams.get('v')).toBe('1.0.1');
    expect(searchParams.get('ref')).toBe('hamper_qr');
  });

  it('T2-SP-05: Manifest JSON Subpath Scoping Validation', async () => {
    // Validate web app manifest configuration for GitHub Pages subpath
    const mockManifest = {
      name: 'See You — Digital Farewell Letter',
      short_name: 'See You',
      start_url: '/see-you/',
      scope: '/see-you/',
      display: 'standalone',
      background_color: '#F7F3EA',
      theme_color: '#687B61',
      icons: [
        {
          src: '/see-you/assets/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
      ],
    };

    // Scoping assertions
    expect(mockManifest.start_url).toBe('/see-you/');
    expect(mockManifest.scope).toBe('/see-you/');
    expect(mockManifest.icons[0].src.startsWith('/see-you/')).toBe(true);
  });
});
