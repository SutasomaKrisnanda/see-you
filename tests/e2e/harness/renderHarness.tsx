/**
 * Render Harness for See You E2E Test Suite
 *
 * Provides an opaque-box mounting wrapper for testing components or the entire application
 * under deterministic mock conditions:
 * - Configurable URL and query parameters (?q=...)
 * - Configurable viewport dimensions and pointer capabilities (desktop vs mobile)
 * - Configurable prefers-reduced-motion accessibility state
 * - Configurable storage quota and autoplay policy errors
 * - Quick-action helpers for user gestures (tapStamp, saveMemory, toggleAudio, triggerChapter)
 */

import * as React from 'react';
import type { ReactElement } from 'react';
import { render, type RenderResult, fireEvent } from '@testing-library/react';
import {
  installAllBrowserMocks,
  resetBrowserMocks,
  setViewport as setBrowserViewport,
  MockAudioElement,
  MockIntersectionObserver,
  type MockCacheStorage,
  type MatchMediaController,
  type LocationController,
} from './browserMocks';
import { CHAPTER_SELECTORS } from './assertions';

export interface RenderHarnessOptions {
  initialUrl?: string;
  viewport?: {
    width: number;
    height: number;
    pointer?: 'fine' | 'coarse';
  };
  reducedMotion?: boolean;
  simulateQuotaError?: boolean;
  shouldRejectAudioPlay?: boolean;
}

export interface RenderHarnessResult extends RenderResult {
  locationController: LocationController;
  matchMediaController: MatchMediaController;
  cacheStorage: MockCacheStorage;
  audioMock: typeof MockAudioElement;
  intersectionObserver: typeof MockIntersectionObserver;
  setViewport: (width: number, height: number, pointer?: 'fine' | 'coarse') => void;
  setReducedMotion: (enabled: boolean) => void;
  triggerChapter: (chapter: number | string | Element) => void;
  tapStamp: () => HTMLElement;
  saveMemory: () => HTMLElement;
  toggleAudio: () => HTMLElement;
  readAgain: () => HTMLElement;
  findButton: (pattern: RegExp | string) => HTMLElement | null;
}

/**
 * Mounts any React UI tree within the standardized See You test harness.
 */
export function renderWithHarness(
  ui: ReactElement,
  options?: RenderHarnessOptions
): RenderHarnessResult {
  // 1. Reset and initialize browser mocks
  resetBrowserMocks();

  const width = options?.viewport?.width ?? 390;
  const height = options?.viewport?.height ?? 844;
  const pointer = options?.viewport?.pointer ?? (width <= 768 ? 'coarse' : 'fine');

  const { cacheStorage, matchMediaController, locationController } = installAllBrowserMocks({
    initialUrl: options?.initialUrl ?? 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
    defaultReducedMotion: options?.reducedMotion ?? false,
    width,
    height,
    pointer,
  });

  if (options?.simulateQuotaError) {
    cacheStorage.shouldSimulateQuotaError = true;
  }

  if (options?.shouldRejectAudioPlay) {
    MockAudioElement.shouldRejectPlay = true;
  }

  // 2. Render React component
  const renderResult = render(ui);
  const container = renderResult.container;

  // 3. User action helpers
  const tapStamp = (): HTMLElement => {
    const stamp =
      container.querySelector('.stamp-btn') ||
      container.querySelector('[data-testid="stamp-btn"]') ||
      container.querySelector('#open-letter') ||
      container.querySelector('button[aria-label*="open" i]');

    if (!stamp) {
      throw new Error('Stamp / wax seal button (.stamp-btn) not found in DOM.');
    }
    fireEvent.click(stamp);
    return stamp as HTMLElement;
  };

  const saveMemory = (): HTMLElement => {
    const saveBtn =
      container.querySelector('.btn-save-memory') ||
      container.querySelector('[data-testid="save-memory"]') ||
      container.querySelector('#save-memory') ||
      container.querySelector('button[aria-label*="save" i]');

    if (!saveBtn) {
      throw new Error('Save Memory button (.btn-save-memory) not found in DOM.');
    }
    fireEvent.click(saveBtn);
    return saveBtn as HTMLElement;
  };

  const toggleAudio = (): HTMLElement => {
    const audioBtn =
      container.querySelector('[data-testid="audio-toggle"]') ||
      container.querySelector('.audio-toggle') ||
      container.querySelector('button[aria-label*="music" i]');

    if (!audioBtn) {
      throw new Error('Audio toggle button not found in DOM.');
    }
    fireEvent.click(audioBtn);
    return audioBtn as HTMLElement;
  };

  const readAgain = (): HTMLElement => {
    const readBtn =
      container.querySelector('.btn-read-again') ||
      container.querySelector('[data-testid="read-again"]') ||
      container.querySelector('#read-again') ||
      container.querySelector('button[aria-label*="read" i]');

    if (!readBtn) {
      throw new Error('Read Again button (.btn-read-again) not found in DOM.');
    }
    fireEvent.click(readBtn);
    return readBtn as HTMLElement;
  };

  const triggerChapter = (chapter: number | string | Element): void => {
    let targetEl: Element | null = null;
    if (chapter instanceof Element) {
      targetEl = chapter;
    } else {
      const num = typeof chapter === 'number' ? chapter : parseInt(chapter, 10);
      const chapterId = !isNaN(num) ? num.toString().padStart(2, '0') : String(chapter);
      const selectors = CHAPTER_SELECTORS[chapterId] || [`[data-chapter="${chapterId}"]`];

      for (const sel of selectors) {
        targetEl = container.querySelector(sel);
        if (targetEl) break;
      }
    }

    if (!targetEl) {
      throw new Error(`Target chapter element not found for chapter: ${String(chapter)}`);
    }

    MockIntersectionObserver.triggerChapterVisibility(targetEl, true, 0.6);
  };

  const findButton = (pattern: RegExp | string): HTMLElement | null => {
    const buttons = Array.from(container.querySelectorAll('button, [role="button"], a'));
    return (
      (buttons.find(btn => {
        const text = btn.textContent || '';
        const label = btn.getAttribute('aria-label') || '';
        if (typeof pattern === 'string') {
          return text.includes(pattern) || label.includes(pattern);
        }
        return pattern.test(text) || pattern.test(label);
      }) as HTMLElement) || null
    );
  };

  const setViewport = (newWidth: number, newHeight: number, newPointer: 'fine' | 'coarse' = 'coarse'): void => {
    setBrowserViewport(newWidth, newHeight, newPointer);
    matchMediaController.setViewportMatch(newWidth, newPointer);
  };

  const setReducedMotion = (enabled: boolean): void => {
    matchMediaController.setReducedMotion(enabled);
  };

  return {
    ...renderResult,
    locationController,
    matchMediaController,
    cacheStorage,
    audioMock: MockAudioElement,
    intersectionObserver: MockIntersectionObserver,
    setViewport,
    setReducedMotion,
    triggerChapter,
    tapStamp,
    saveMemory,
    toggleAudio,
    readAgain,
    findButton,
  };
}

/**
 * Dynamically renders the root App component with full harness mocks applied.
 */
export async function renderApp(options?: RenderHarnessOptions): Promise<RenderHarnessResult> {
  let AppComponent: React.ComponentType | null = null;

  try {
    // Dynamic import to support pre-scaffold and post-scaffold states
    const appPath = '../../../src/App';
    const appModule = await import(/* @vite-ignore */ appPath);
    AppComponent = appModule.default || appModule.App;
  } catch (error) {
    // If App is not yet bundled or created, throw descriptive error
    throw new Error(
      `Could not import root App component from 'src/App'. Ensure Milestone 1 scaffolding is in place. Original error: ${String(
        error
      )}`
    );
  }

  if (!AppComponent) {
    throw new Error('Default or named App component not found in src/App.');
  }

  return renderWithHarness(React.createElement(AppComponent), options);
}
