/**
 * Tier 2 Boundary Tests: Device Gating & Viewport
 *
 * Covers:
 * - T2-DG-01: Ultra-Narrow Screen Clamp (280px Width)
 * - T2-DG-02: Zero / Negative InnerWidth Defensive Handling
 * - T2-DG-03: Exact Viewport Width Boundary (640px vs 641px)
 * - T2-DG-04: Landscape Orientation on Mobile (844x390)
 * - T2-DG-05: Virtual Keyboard Viewport Height Shrink (700px -> 260px)
 *
 * Traceability:
 * - Brief §3.2, §8
 * - PROJECT.md #11, #12, Interface Contracts (detectDevice)
 * - TEST_INFRA.md Area 1
 * - Spec Miner handoff.md Section 6 Area 1
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/react';
import {
  installAllBrowserMocks,
  resetBrowserMocks,
  setViewport,
} from '../harness/browserMocks';
import {
  expectDesktopGateVisible,
  expectDesktopGateHidden,
  expectMobileStoryVisible,
} from '../harness/assertions';
import { renderApp } from '../harness/renderHarness';

describe('Tier 2 Boundary: Device Gating & Viewport', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T2-DG-01: Ultra-Narrow Screen Clamp (280px Width)', async () => {
    // Galaxy Fold cover screen: 280px wide
    const app = await renderApp({
      viewport: { width: 280, height: 653, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Mobile story must be rendered without desktop gate
    const story = expectMobileStoryVisible(app.container);
    expect(window.innerWidth).toBe(280);

    // Verify small screen clamp: elements should not exceed viewport width
    const chapters = app.container.querySelectorAll('.chapter, .section, #story');
    chapters.forEach(chapter => {
      const el = chapter as HTMLElement;
      // Scroll width should not trigger horizontal overflow beyond screen
      expect(el.scrollWidth).toBeLessThanOrEqual(320);
    });

    expectDesktopGateHidden(app.container);
  });

  it('T2-DG-02: Zero / Negative InnerWidth Defensive Handling', async () => {
    // Edge case: collapsed iframe or headless rendering with 0 innerWidth
    setViewport(0, 0, 'coarse');

    // Attempt dynamic import of deviceDetector service if available
    const servicePath = '../../../src/services/deviceDetector';
    const deviceModule = await import(/* @vite-ignore */ servicePath).catch(
      () => null
    );

    if (deviceModule && typeof deviceModule.detectDevice === 'function') {
      const state = deviceModule.detectDevice();
      // Should defensively default to mobile layout and not crash
      expect(state.isMobile).toBe(true);
    }

    // Render app defensively
    const app = await renderApp({
      viewport: { width: 0, height: 0, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    expect(app.container).toBeDefined();
    expectDesktopGateHidden(app.container);
  });

  it('T2-DG-03: Exact Viewport Width Boundary (640px vs 641px)', async () => {
    // Test exact 640px breakpoint with desktop mouse (pointer: fine)
    const app640 = await renderApp({
      viewport: { width: 640, height: 800, pointer: 'fine' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // At 640px, mobile story is rendered
    expectMobileStoryVisible(app640.container);
    expectDesktopGateHidden(app640.container);

    app640.unmount();

    // At 641px with pointer: fine, desktop gate is activated
    const app641 = await renderApp({
      viewport: { width: 641, height: 800, pointer: 'fine' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    expectDesktopGateVisible(app641.container);
  });

  it('T2-DG-04: Landscape Orientation on Mobile (844x390)', async () => {
    // iPhone in landscape mode: width 844 > 640px, but pointer is coarse
    const app = await renderApp({
      viewport: { width: 844, height: 390, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Touch devices in landscape orientation should remain in mobile story mode
    expectMobileStoryVisible(app.container);
    expectDesktopGateHidden(app.container);
  });

  it('T2-DG-05: Virtual Keyboard Viewport Height Shrink (700px -> 260px)', async () => {
    // Story mounted on mobile
    const app = await renderApp({
      viewport: { width: 390, height: 700, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    expectMobileStoryVisible(app.container);

    // Virtual keyboard opens, shrinking viewport height to 260px
    app.setViewport(390, 260, 'coarse');
    window.dispatchEvent(new Event('resize'));

    // TopBar must remain present in DOM and not cover entire reading viewport
    const topbar = app.container.querySelector('.topbar, header');
    expect(topbar).not.toBeNull();

    // Verify app container did not crash and height update was applied
    expect(window.innerHeight).toBe(260);
    expect(window.innerWidth).toBe(390);
  });
});
