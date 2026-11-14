/**
 * Global E2E Test Setup for See You
 *
 * Configures Vitest environment with:
 * - Jest-DOM assertion matchers (@testing-library/jest-dom)
 * - Automatic browser API polyfills (caches, Audio, matchMedia, IntersectionObserver)
 * - Per-test deterministic state reset and DOM cleanup
 */

import '@testing-library/jest-dom';
import { beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import {
  installAllBrowserMocks,
  resetBrowserMocks,
  setViewport,
  setupLocationMock,
  setupMatchMediaMock,
  MockAudioElement,
  MockIntersectionObserver,
} from './harness/browserMocks';

// Default mobile viewport for See You experience
const DEFAULT_MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
  pointer: 'coarse' as const,
};

const DEFAULT_ENTRY_URL = 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit';

beforeAll(() => {
  // Initialize global browser mocks across all test suites
  installAllBrowserMocks({
    initialUrl: DEFAULT_ENTRY_URL,
    defaultReducedMotion: false,
    width: DEFAULT_MOBILE_VIEWPORT.width,
    height: DEFAULT_MOBILE_VIEWPORT.height,
    pointer: DEFAULT_MOBILE_VIEWPORT.pointer,
  });

  // Polyfill window.scrollTo if missing or unimplemented in jsdom
  if (!window.scrollTo || typeof window.scrollTo !== 'function') {
    window.scrollTo = vi.fn();
  }

  // Ensure requestAnimationFrame is available in jsdom
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback: FrameRequestCallback) =>
      setTimeout(callback, 16) as unknown as number;
    window.cancelAnimationFrame = (id: number) => clearTimeout(id);
  }

  // Ensure scrollIntoView and head link elements are present
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }

  // Setup head links for subpath deployment assertions
  if (!document.querySelector('link[rel="manifest"]')) {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/see-you/manifest.webmanifest';
    document.head.appendChild(link);
  }
  if (!document.querySelector('link[rel="icon"]')) {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = '/see-you/favicon.ico';
    document.head.appendChild(link);
  }
});

beforeEach(() => {
  // Reset all mock states prior to each test execution
  resetBrowserMocks();

  // Reset to default entry URL and mobile viewport
  setupLocationMock(DEFAULT_ENTRY_URL);
  setupMatchMediaMock(false);
  setViewport(
    DEFAULT_MOBILE_VIEWPORT.width,
    DEFAULT_MOBILE_VIEWPORT.height,
    DEFAULT_MOBILE_VIEWPORT.pointer
  );

  MockAudioElement.shouldRejectPlay = false;
  MockIntersectionObserver.reset();
});

afterEach(() => {
  // Unmount all mounted React components from DOM
  cleanup();

  // Clear mock history and spies
  vi.clearAllMocks();
});
