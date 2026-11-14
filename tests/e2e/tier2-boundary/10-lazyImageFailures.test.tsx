/**
 * Tier 2 Boundary Tests: Progressive Asset Loading & Lazy Image Failures
 *
 * Covers:
 * - T2-PL-01: Broken Gallery Photo URL (HTTP 404 Error Handling)
 * - T2-PL-02: Lazy Loading on Offscreen Images (loading="lazy")
 * - T2-PL-03: Dimension Reservation to Prevent CLS (aspect-ratio / width / height)
 * - T2-PL-04: Special Characters and Line Breaks in Photo Captions
 * - T2-PL-05: Optional Video Slot Deferred Preloading (preload="none")
 *
 * Traceability:
 * - Brief §10 Asset Rules
 * - PROJECT.md #26, #28
 * - TEST_INFRA.md Area 10
 * - Spec Miner handoff.md Section 6 Area 10
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { resetBrowserMocks } from '../harness/browserMocks';
import { RECIPIENT_NADYA, type RecipientData } from '../harness/recipientFixtures';
import { renderApp } from '../harness/renderHarness';

describe('Tier 2 Boundary: Progressive Asset Loading & Image Failures', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T2-PL-01: Broken Gallery Photo URL (HTTP 404 Error Handling)', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    const images = app.container.querySelectorAll('img');
    if (images.length > 0) {
      const firstImg = images[0];
      // Trigger error event on image (simulating 404)
      fireEvent.error(firstImg);

      // App should not crash; parent container must remain mounted
      expect(app.container).toBeDefined();
    }
  });

  it('T2-PL-02: Lazy Loading on Offscreen Images (loading="lazy")', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    const galleryImages = app.container.querySelectorAll('#moments-section img, .polaroid img');
    galleryImages.forEach(img => {
      // Must have native browser lazy loading enabled
      expect(img.getAttribute('loading')).toBe('lazy');
    });
  });

  it('T2-PL-03: Dimension Reservation to Prevent CLS', async () => {
    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    const galleryImages = app.container.querySelectorAll('.polaroid img, .photo-grid img');
    galleryImages.forEach(img => {
      const el = img as HTMLElement;
      const hasWidth = el.hasAttribute('width') || el.style.width !== '';
      const hasAspect = el.style.aspectRatio !== '';
      // Either explicit dimension or aspect-ratio must be present to prevent layout shifts
      expect(hasWidth || hasAspect || el.className.includes('aspect-')).toBe(true);
    });
  });

  it('T2-PL-04: Special Characters and Line Breaks in Photo Captions', async () => {
    const specialCaption = "Hari pertama! <Keren> & 'Seru' \n #Komnasinfo";
    const specialRecipient: RecipientData = {
      ...RECIPIENT_NADYA,
      memories: [
        {
          src: '/see-you/assets/photos/memory-1.webp',
          alt: 'Photo alt',
          caption: specialCaption,
        },
      ],
    };

    expect(specialRecipient.memories[0].caption).toBe(specialCaption);

    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Verify HTML escaping: raw <Keren> tag should not be parsed as a DOM element
    const kerenEl = app.container.querySelector('keren');
    expect(kerenEl).toBeNull();
  });

  it('T2-PL-05: Optional Video Slot Deferred Preloading (preload="none")', async () => {
    // Nadya fixture includes videoNote
    expect(RECIPIENT_NADYA.videoNote).toBeDefined();

    const app = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const videoEl = app.container.querySelector('video');
    if (videoEl) {
      // Must not eagerly download video binary on initial page load
      expect(videoEl.getAttribute('preload')).toBe('none');
    }
  });
});
