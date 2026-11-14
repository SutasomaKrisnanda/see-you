import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectDevice, subscribeDeviceChanges } from '../services/deviceDetector';

describe('Device Detector Service (Milestone 2)', () => {
  const originalInnerWidth = window.innerWidth;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    window.innerWidth = 1024;
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  function mockMatchMedia(matchesMap: Record<string, boolean>) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: Boolean(matchesMap[query]),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }

  it('defensively defaults to mobile when innerWidth is 0 or negative', () => {
    window.innerWidth = 0;
    mockMatchMedia({ '(pointer: fine)': true });
    const state = detectDevice();
    expect(state.isMobile).toBe(true);

    window.innerWidth = -100;
    expect(detectDevice().isMobile).toBe(true);
  });

  it('classifies touch devices (pointer: coarse) as mobile on phone screens', () => {
    window.innerWidth = 390;
    mockMatchMedia({ '(pointer: coarse)': true, '(pointer: fine)': false });
    const state = detectDevice();
    expect(state.isMobile).toBe(true);
  });

  it('classifies tablets (768px, pointer: coarse) as mobile without desktop barrier', () => {
    window.innerWidth = 768;
    mockMatchMedia({ '(pointer: coarse)': true, '(pointer: fine)': false });
    const state = detectDevice();
    expect(state.isMobile).toBe(true);
  });

  it('classifies landscape smartphones (844x390, pointer: coarse) as mobile', () => {
    window.innerWidth = 844;
    mockMatchMedia({ '(pointer: coarse)': true, '(pointer: fine)': false });
    const state = detectDevice();
    expect(state.isMobile).toBe(true);
  });

  it('classifies fine pointer (mouse) <= 640px as mobile (narrow browser window)', () => {
    window.innerWidth = 640;
    mockMatchMedia({ '(pointer: fine)': true, '(pointer: coarse)': false });
    const state = detectDevice();
    expect(state.isMobile).toBe(true);
  });

  it('classifies fine pointer (mouse) at 641px as desktop gate', () => {
    window.innerWidth = 641;
    mockMatchMedia({ '(pointer: fine)': true, '(pointer: coarse)': false });
    const state = detectDevice();
    expect(state.isMobile).toBe(false);
  });

  it('classifies standard desktop (1280px, pointer: fine) as desktop gate', () => {
    window.innerWidth = 1280;
    mockMatchMedia({ '(pointer: fine)': true, '(pointer: coarse)': false });
    const state = detectDevice();
    expect(state.isMobile).toBe(false);
  });

  it('detects prefersReducedMotion correctly when media query matches', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true });
    const state = detectDevice();
    expect(state.prefersReducedMotion).toBe(true);

    mockMatchMedia({ '(prefers-reduced-motion: reduce)': false });
    const stateNoReduce = detectDevice();
    expect(stateNoReduce.prefersReducedMotion).toBe(false);
  });

  it('subscribes to window resize events and invokes callback with new state', () => {
    const callback = vi.fn();
    const unsubscribe = subscribeDeviceChanges(callback);

    window.innerWidth = 375;
    mockMatchMedia({ '(pointer: coarse)': true });
    window.dispatchEvent(new Event('resize'));

    expect(callback).toHaveBeenCalled();
    const lastCallArg = callback.mock.calls[callback.mock.calls.length - 1][0];
    expect(lastCallArg.isMobile).toBe(true);

    unsubscribe();
  });

  it('unsubscribes cleanly and no longer invokes callback after cleanup', () => {
    const callback = vi.fn();
    const unsubscribe = subscribeDeviceChanges(callback);

    unsubscribe();
    callback.mockClear();

    window.dispatchEvent(new Event('resize'));
    expect(callback).not.toHaveBeenCalled();
  });
});
