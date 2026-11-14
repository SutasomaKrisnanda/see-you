/**
 * Tier 1 Feature Coverage: Progressive Asset Loading
 *
 * Test Specifications:
 * - T1-PL-01: Lazy Loading on Gallery Images
 * - T1-PL-02: Dimension Reservation to Prevent CLS
 * - T1-PL-03: No Massive Inline Base64 Media in Initial DOM
 * - T1-PL-04: Video Slot Deferred Preloading
 * - T1-PL-05: Critical Font Loading Strategy
 *
 * Traceability: Brief §3.1, §3.4, §10, PROJECT.md #4, #26, #28, ORIGINAL_REQUEST R3, TEST_INFRA.md Area 10
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import { resetBrowserMocks } from '../harness/browserMocks';
import { RECIPIENT_NADYA } from '../harness/recipientFixtures';

describe('Feature Area 10: Progressive Asset Loading [Tier 1]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T1-PL-01: Lazy Loading on Gallery Images ensures loading="lazy" is set on all photos', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const moments =
      container.querySelector('#moments-section') ||
      container.querySelector('[data-chapter="05"]') ||
      container;

    const galleryImages = Array.from(moments.querySelectorAll('img')).filter(img =>
      img.getAttribute('src')?.includes('photo') || img.closest('.photo-card, .polaroid')
    );

    if (galleryImages.length > 0) {
      galleryImages.forEach(img => {
        expect(img.getAttribute('loading')).toBe('lazy');
      });
    } else {
      // If moments section renders images lazily, ensure any rendered photo has lazy attribute
      const allPhotos = container.querySelectorAll('.photo-card img, [data-testid="moment-photo"]');
      allPhotos.forEach(img => {
        expect(img.getAttribute('loading')).toBe('lazy');
      });
    }
  });

  it('T1-PL-02: Dimension Reservation to Prevent CLS defines aspect-ratio or explicit dimensions', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const images = Array.from(container.querySelectorAll('img'));
    images.forEach(img => {
      const hasDimensions =
        (img.hasAttribute('width') && img.hasAttribute('height')) ||
        img.style.aspectRatio !== '' ||
        img.className.includes('aspect-') ||
        img.parentElement?.style.aspectRatio !== '';

      expect(hasDimensions).toBe(true);
    });
  });

  it('T1-PL-03: No Massive Inline Base64 Media in Initial DOM avoids bloat > 50KB', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const allElements = container.querySelectorAll('*');
    allElements.forEach(el => {
      const src = el.getAttribute('src') || '';
      const style = el.getAttribute('style') || '';

      if (src.startsWith('data:')) {
        // Base64 URI should not exceed 50KB (51200 chars)
        expect(src.length).toBeLessThan(51200);
      }
      if (style.includes('data:')) {
        expect(style.length).toBeLessThan(51200);
      }
    });
  });

  it('T1-PL-04: Video Slot Deferred Preloading uses preload="none" with poster thumbnail', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const videoEl = container.querySelector('video');
    if (videoEl) {
      expect(videoEl.getAttribute('preload')).toBe('none');
      expect(videoEl.getAttribute('poster')).toBeTruthy();
    }
  });

  it('T1-PL-05: Critical Font Loading Strategy declares font-display: swap in styling or font links', async () => {
    let hasFontDisplaySwap = false;
    const fontLinks = Array.from(document.querySelectorAll('link[href*="fonts"]'));
    if (fontLinks.some(link => link.getAttribute('href')?.includes('display=swap'))) {
      hasFontDisplaySwap = true;
    } else {
      // In jsdom test environment, verify index.html font link declaration directly
      const fs = await import('node:fs');
      const path = await import('node:path');
      const indexPath = path.resolve(process.cwd(), 'index.html');
      if (fs.existsSync(indexPath)) {
        const indexHtml = fs.readFileSync(indexPath, 'utf-8');
        hasFontDisplaySwap = /display=swap/i.test(indexHtml);
      }
    }

    expect(hasFontDisplaySwap).toBe(true);
  });
});
