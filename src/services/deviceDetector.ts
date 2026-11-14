/**
 * Device Detector Service for See You
 *
 * Implements dual-signal classification (viewport dimension + pointer capabilities)
 * to distinguish smartphones and touch tablets from desktop mouse environments.
 *
 * Conforms to PROJECT.md § Interface Contracts.
 */

import type { DeviceState } from '../data/types';

export type { DeviceState };

/**
 * Evaluates current device capabilities, pointer mechanics, and viewport boundaries.
 */
export function detectDevice(): DeviceState {
  if (typeof window === 'undefined') {
    return { isMobile: true, prefersReducedMotion: false };
  }

  const width = window.innerWidth ?? 0;

  // Defensive handling for headless, collapsed iframe, or 0/negative dimensions
  if (width <= 0) {
    return { isMobile: true, prefersReducedMotion: false };
  }

  const hasMatchMedia = typeof window.matchMedia === 'function';
  const isCoarse = hasMatchMedia && window.matchMedia('(pointer: coarse)').matches;
  const isFine = hasMatchMedia && window.matchMedia('(pointer: fine)').matches;

  let isMobile: boolean;

  if (isCoarse && !isFine) {
    // Touch-only devices (smartphones, tablets, iPad 768px, landscape phones 844px)
    isMobile = true;
  } else if (isFine) {
    // Fine mouse pointer: mobile if narrow window <= 640px, otherwise desktop gate
    isMobile = width <= 640;
  } else if (isCoarse) {
    // Both coarse and fine or touch monitor: prioritize touch mobile
    isMobile = true;
  } else {
    // Fallback if environment lacks pointer media queries
    isMobile = width <= 768;
  }

  const prefersReducedMotion =
    hasMatchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    isMobile,
    prefersReducedMotion: Boolean(prefersReducedMotion),
  };
}

/**
 * Subscribes to viewport resize, orientation changes, and media query updates.
 * Returns an idempotent cleanup function.
 */
export function subscribeDeviceChanges(callback: (state: DeviceState) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleUpdate = () => {
    callback(detectDevice());
  };

  window.addEventListener('resize', handleUpdate);
  window.addEventListener('orientationchange', handleUpdate);

  const mqls: MediaQueryList[] = [];
  if (typeof window.matchMedia === 'function') {
    const queries = [
      '(pointer: coarse)',
      '(pointer: fine)',
      '(max-width: 640px)',
      '(prefers-reduced-motion: reduce)',
    ];

    for (const q of queries) {
      try {
        const mql = window.matchMedia(q);
        if (mql) {
          if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', handleUpdate);
          } else if (
            typeof (mql as unknown as { addListener?: (fn: () => void) => void }).addListener ===
            'function'
          ) {
            (mql as unknown as { addListener: (fn: () => void) => void }).addListener(
              handleUpdate
            );
          }
          mqls.push(mql);
        }
      } catch {
        // Safe no-op for unsupported media query evaluation
      }
    }
  }

  return () => {
    window.removeEventListener('resize', handleUpdate);
    window.removeEventListener('orientationchange', handleUpdate);
    for (const mql of mqls) {
      if (typeof mql.removeEventListener === 'function') {
        mql.removeEventListener('change', handleUpdate);
      } else if (
        typeof (mql as unknown as { removeListener?: (fn: () => void) => void }).removeListener ===
        'function'
      ) {
        (mql as unknown as { removeListener: (fn: () => void) => void }).removeListener(
          handleUpdate
        );
      }
    }
  };
}
