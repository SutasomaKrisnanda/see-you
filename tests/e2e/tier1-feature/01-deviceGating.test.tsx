/**
 * Tier 1 Feature Coverage: Device Gating & Viewport
 *
 * Test Specifications:
 * - T1-DG-01: Standard Mobile Viewport Rendering
 * - T1-DG-02: Large Mobile Viewport Rendering (iPhone 14 Pro Max)
 * - T1-DG-03: Desktop Viewport Gate Activation
 * - T1-DG-04: Tablet Touch Viewport Accommodation
 * - T1-DG-05: Dynamic Viewport Resize from Desktop to Mobile
 *
 * Traceability: Brief §8, PROJECT.md #11, #12, TEST_INFRA.md Area 1
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import {
  expectDesktopGateVisible,
  expectDesktopGateHidden,
  expectMobileStoryVisible,
} from '../harness/assertions';
import { resetBrowserMocks } from '../harness/browserMocks';

describe('Feature Area 1: Device Gating & Viewport [Tier 1]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T1-DG-01: Standard Mobile Viewport Rendering displays mobile story and hides desktop gate', async () => {
    const { container } = await renderApp({
      viewport: { width: 375, height: 667, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Story container must be present and visible
    const story = expectMobileStoryVisible(container);
    expect(story).not.toBeNull();

    // Desktop gate must be absent or hidden
    expectDesktopGateHidden(container);
  });

  it('T1-DG-02: Large Mobile Viewport Rendering (iPhone 14 Pro Max) renders mobile experience', async () => {
    const { container } = await renderApp({
      viewport: { width: 430, height: 932, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Mobile envelope or story should be rendered without desktop gate
    expectDesktopGateHidden(container);
    const story = expectMobileStoryVisible(container);
    expect(story).toBeDefined();
  });

  it('T1-DG-03: Desktop Viewport Gate Activation renders desktop gate and hides mobile story', async () => {
    const { container } = await renderApp({
      viewport: { width: 1280, height: 800, pointer: 'fine' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Desktop gate must be visible with instructional copy
    const gate = expectDesktopGateVisible(container);
    expect(gate).not.toBeNull();
    const gateText = gate.textContent || '';
    expect(/phone|scan|mobile|open/i.test(gateText)).toBe(true);
  });

  it('T1-DG-04: Tablet Touch Viewport Accommodation does not block coarse pointer tablet users', async () => {
    const { container } = await renderApp({
      viewport: { width: 768, height: 1024, pointer: 'coarse' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Touch users on tablet should see the mobile letter journey, not the desktop barrier
    expectDesktopGateHidden(container);
    const story = expectMobileStoryVisible(container);
    expect(story).not.toBeNull();
  });

  it('T1-DG-05: Dynamic Viewport Resize from Desktop to Mobile switches gate state reactively', async () => {
    const harness = await renderApp({
      viewport: { width: 1024, height: 768, pointer: 'fine' },
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    });

    // Initially in desktop gate mode
    expectDesktopGateVisible(harness.container);

    // User resizes viewport down to phone size with coarse pointer
    harness.setViewport(390, 844, 'coarse');

    // Desktop gate should now be hidden and mobile story visible
    expectDesktopGateHidden(harness.container);
    expectMobileStoryVisible(harness.container);
  });
});
