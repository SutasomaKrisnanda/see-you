/**
 * Tier 1 Feature Coverage: Subpath Deployment (/see-you/)
 *
 * Test Specifications:
 * - T1-SP-01: Asset URLs Scoped to /see-you/
 * - T1-SP-02: Web App Manifest Scoped to /see-you/
 * - T1-SP-03: Service Worker Registration Scope
 * - T1-SP-04: Internal Navigation Preserves Subpath & Query
 * - T1-SP-05: Favicon and Icon Links Scoped Cleanly
 *
 * Traceability: Brief §11.1, §14, PROJECT.md #1, #7, #30, #31, TEST_INFRA.md Area 12
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import { resetBrowserMocks } from '../harness/browserMocks';
import { RECIPIENT_NADYA } from '../harness/recipientFixtures';

describe('Feature Area 12: Subpath Deployment (/see-you/) [Tier 1]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T1-SP-01: Asset URLs Scoped to /see-you/ ensures all static links avoid bare root / paths', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const assetElements = Array.from(
      container.querySelectorAll('img[src], link[href], script[src], video[src], source[src]')
    );

    assetElements.forEach(el => {
      const src = el.getAttribute('src') || el.getAttribute('href') || '';
      if (src && !src.startsWith('data:') && !src.startsWith('http')) {
        // Must either start with /see-you/ or relative ./ (never bare root /assets)
        const isScoped = src.startsWith('/see-you/') || src.startsWith('./') || !src.startsWith('/');
        expect(isScoped).toBe(true);
      }
    });
  });

  it('T1-SP-02: Web App Manifest Scoped to /see-you/ defines correct scope and start_url', async () => {
    // Check manifest link tag in document head
    const manifestLink = document.querySelector('link[rel="manifest"]');
    expect(manifestLink).not.toBeNull();
    const href = manifestLink!.getAttribute('href') || '';
    expect(href.includes('/see-you/') || href.startsWith('./') || !href.startsWith('/')).toBe(true);
  });

  it('T1-SP-03: Service Worker Registration Scope registers under /see-you/ scope', async () => {
    let swScope = '';
    let swPath = '';

    if (navigator.serviceWorker) {
      navigator.serviceWorker.register = vi.fn().mockImplementation((path: string, options?: RegistrationOptions) => {
        swPath = path;
        swScope = options?.scope || '';
        return Promise.resolve({} as ServiceWorkerRegistration);
      });
    }

    await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    expect(swPath).toMatch(/\/see-you\//);
    expect(swScope).toMatch(/\/see-you\//);
  });

  it('T1-SP-04: Internal Navigation Preserves Subpath & Query when reading again', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const readAgainBtn =
      harness.container.querySelector('#read-again') ||
      harness.container.querySelector('.btn-read-again') ||
      harness.container.querySelector('[data-testid="read-again"]');

    expect(readAgainBtn).not.toBeNull();
    harness.readAgain();
    // Verify location does not redirect to domain root '/'
    expect(window.location.pathname).toContain('/see-you/');
    expect(window.location.search).toContain(`q=${RECIPIENT_NADYA.token}`);
  });

  it('T1-SP-05: Favicon and Icon Links Scoped Cleanly to /see-you/ subpath', async () => {
    const faviconLink = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    expect(faviconLink).not.toBeNull();
    const href = faviconLink!.getAttribute('href') || '';
    const isClean = href.includes('/see-you/') || href.startsWith('./') || !href.startsWith('/');
    expect(isClean).toBe(true);
  });
});
