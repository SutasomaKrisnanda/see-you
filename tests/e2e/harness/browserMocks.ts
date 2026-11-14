/**
 * Browser Mocks for See You E2E Test Suite
 *
 * Implements deterministic, non-invasive mocks for:
 * - Cache Storage API (window.caches)
 * - MatchMedia API (prefers-reduced-motion, pointer, viewport queries)
 * - Window Location API (search params, href retention, subpaths)
 * - HTMLAudioElement (ambient audio manager, user gesture autoplay policy)
 * - Viewport Resizing (screen dimensions, pointer capability)
 * - IntersectionObserver (chapter counter and reading progress bar)
 */

import { vi } from 'vitest';

// ---------------------------------------------------------------------------
// 1. Cache Storage Mock
// ---------------------------------------------------------------------------

export interface MockCacheEntry {
  response: Response;
  time: number;
}

export class MockCache implements Cache {
  private store = new Map<string, MockCacheEntry>();
  public shouldSimulateQuotaError = false;
  private storageRef?: MockCacheStorage;

  constructor(storageRef?: MockCacheStorage) {
    this.storageRef = storageRef;
  }

  private get isQuotaExceeded(): boolean {
    return this.shouldSimulateQuotaError || Boolean(this.storageRef?.shouldSimulateQuotaError);
  }

  private normalizeUrl(request: RequestInfo | URL): string {
    if (typeof request === 'string') return request;
    if (request instanceof URL) return request.href;
    if (typeof Request !== 'undefined' && request instanceof Request) return request.url;
    return (request as any)?.url ? String((request as any).url) : String(request);
  }

  async match(request: RequestInfo | URL): Promise<Response | undefined> {
    const url = this.normalizeUrl(request);
    const entry = this.store.get(url);
    if (!entry) {
      // Also try path-only or decoded matching if exact match fails
      for (const [storedUrl, storedEntry] of this.store.entries()) {
        if (storedUrl.endsWith(url) || url.endsWith(storedUrl)) {
          return typeof storedEntry.response.clone === 'function'
            ? storedEntry.response.clone()
            : storedEntry.response;
        }
      }
      return undefined;
    }
    return typeof entry.response.clone === 'function' ? entry.response.clone() : entry.response;
  }

  async matchAll(request?: RequestInfo | URL): Promise<Response[]> {
    if (!request) {
      return Array.from(this.store.values()).map(e =>
        typeof e.response.clone === 'function' ? e.response.clone() : e.response
      );
    }
    const match = await this.match(request);
    return match ? [match] : [];
  }

  async add(request: RequestInfo | URL): Promise<void> {
    if (this.isQuotaExceeded) {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    }
    const url = this.normalizeUrl(request);
    const response = await fetch(request);
    if (!response.ok) {
      throw new TypeError(`Request failed with status ${response.status}`);
    }
    await this.put(url, response);
  }

  async addAll(requests: Iterable<RequestInfo>): Promise<void> {
    await Promise.all(Array.from(requests).map(r => this.add(r)));
  }

  async put(request: RequestInfo | URL, response: Response): Promise<void> {
    if (this.isQuotaExceeded) {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    }
    const url = this.normalizeUrl(request);
    const cloned = typeof response.clone === 'function' ? response.clone() : response;
    this.store.set(url, { response: cloned, time: Date.now() });
  }

  async delete(request: RequestInfo | URL): Promise<boolean> {
    const url = this.normalizeUrl(request);
    return this.store.delete(url);
  }

  async keys(): Promise<Request[]> {
    return Array.from(this.store.keys()).map(url => {
      if (typeof Request !== 'undefined') {
        return new Request(url);
      }
      return { url } as unknown as Request;
    });
  }

  clear(): void {
    this.store.clear();
    this.shouldSimulateQuotaError = false;
  }

  has(url: string): boolean {
    return this.store.has(url);
  }

  get size(): number {
    return this.store.size;
  }
}

export class MockCacheStorage implements CacheStorage {
  private caches = new Map<string, MockCache>();
  public shouldSimulateQuotaError = false;

  async open(cacheName: string): Promise<Cache> {
    if (this.shouldSimulateQuotaError) {
      const err = new DOMException('Quota exceeded', 'QuotaExceededError');
      throw err;
    }
    if (!this.caches.has(cacheName)) {
      this.caches.set(cacheName, new MockCache(this));
    }
    const cache = this.caches.get(cacheName)!;
    if (this.shouldSimulateQuotaError) {
      cache.shouldSimulateQuotaError = true;
    }
    return cache;
  }

  async has(cacheName: string): Promise<boolean> {
    return this.caches.has(cacheName);
  }

  async delete(cacheName: string): Promise<boolean> {
    return this.caches.delete(cacheName);
  }

  async keys(): Promise<string[]> {
    return Array.from(this.caches.keys());
  }

  async match(request: RequestInfo | URL): Promise<Response | undefined> {
    for (const cache of this.caches.values()) {
      const match = await cache.match(request);
      if (match) return match;
    }
    return undefined;
  }

  clear(): void {
    this.caches.clear();
    this.shouldSimulateQuotaError = false;
  }

  getCache(cacheName: string): MockCache | undefined {
    return this.caches.get(cacheName);
  }
}

// ---------------------------------------------------------------------------
// 2. MatchMedia Mock
// ---------------------------------------------------------------------------

export interface MatchMediaController {
  setQueryMatch(query: string, matches: boolean): void;
  setReducedMotion(enabled: boolean): void;
  setViewportMatch(width: number, pointer?: 'fine' | 'coarse'): void;
  reset(): void;
}

let activeMatchMediaController: MatchMediaController | null = null;
const currentViewportState = {
  width: 390,
  height: 844,
  pointer: 'coarse' as 'fine' | 'coarse',
};

export function setupMatchMediaMock(defaultReducedMotion = false): MatchMediaController {
  const queryMap = new Map<string, { matches: boolean; listeners: Set<(e: MediaQueryListEvent) => void> }>();

  window.matchMedia = vi.fn().mockImplementation((query: string): MediaQueryList => {
    let initialMatch = false;

    if (query.includes('prefers-reduced-motion: no-preference')) {
      initialMatch = !defaultReducedMotion;
    } else if (query.includes('prefers-reduced-motion')) {
      initialMatch = defaultReducedMotion;
    } else if (query.includes('max-width: 640px') || query.includes('max-width: 768px')) {
      const maxWidth = query.includes('640px') ? 640 : 768;
      initialMatch = window.innerWidth <= maxWidth;
    } else if (query.includes('min-width: 641px') || query.includes('min-width: 769px')) {
      const minWidth = query.includes('641px') ? 641 : 769;
      initialMatch = window.innerWidth >= minWidth;
    } else if (query.includes('pointer: coarse')) {
      initialMatch = currentViewportState.pointer === 'coarse';
    } else if (query.includes('pointer: fine')) {
      initialMatch = currentViewportState.pointer === 'fine';
    }

    if (!queryMap.has(query)) {
      queryMap.set(query, { matches: initialMatch, listeners: new Set() });
    }
    const state = queryMap.get(query)!;

    const mql: MediaQueryList = {
      media: query,
      get matches() {
        return state.matches;
      },
      onchange: null,
      addListener: (fn: (e: MediaQueryListEvent) => void) => state.listeners.add(fn),
      removeListener: (fn: (e: MediaQueryListEvent) => void) => state.listeners.delete(fn),
      addEventListener: (type: string, fn: EventListenerOrEventListenerObject) => {
        if (type === 'change' && typeof fn === 'function') {
          state.listeners.add(fn as (e: MediaQueryListEvent) => void);
        }
      },
      removeEventListener: (type: string, fn: EventListenerOrEventListenerObject) => {
        if (type === 'change' && typeof fn === 'function') {
          state.listeners.delete(fn as (e: MediaQueryListEvent) => void);
        }
      },
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;

    return mql;
  });

  const controller: MatchMediaController = {
    setQueryMatch(query: string, matches: boolean) {
      const state = queryMap.get(query);
      if (state) {
        state.matches = matches;
        const event = { matches, media: query } as MediaQueryListEvent;
        state.listeners.forEach(fn => {
          try {
            fn(event);
          } catch (e) {
            console.error(e);
          }
        });
      }
    },

    setReducedMotion(enabled: boolean) {
      for (const [q, state] of queryMap.entries()) {
        if (q.includes('prefers-reduced-motion: no-preference')) {
          state.matches = !enabled;
          const event = { matches: !enabled, media: q } as MediaQueryListEvent;
          state.listeners.forEach(fn => fn(event));
        } else if (q.includes('prefers-reduced-motion')) {
          state.matches = enabled;
          const event = { matches: enabled, media: q } as MediaQueryListEvent;
          state.listeners.forEach(fn => fn(event));
        }
      }
    },

    setViewportMatch(width: number, pointer: 'fine' | 'coarse' = 'coarse') {
      for (const [q, state] of queryMap.entries()) {
        let newMatch = state.matches;
        if (q.includes('max-width: 640px')) newMatch = width <= 640;
        else if (q.includes('max-width: 768px')) newMatch = width <= 768;
        else if (q.includes('min-width: 641px')) newMatch = width >= 641;
        else if (q.includes('min-width: 769px')) newMatch = width >= 769;
        else if (q.includes('pointer: coarse')) newMatch = pointer === 'coarse';
        else if (q.includes('pointer: fine')) newMatch = pointer === 'fine';

        if (newMatch !== state.matches) {
          state.matches = newMatch;
          const event = { matches: newMatch, media: q } as MediaQueryListEvent;
          state.listeners.forEach(fn => fn(event));
        }
      }
    },

    reset() {
      queryMap.clear();
      activeMatchMediaController = null;
    },
  };

  activeMatchMediaController = controller;
  return controller;
}

// ---------------------------------------------------------------------------
// 3. Location / URL Mock
// ---------------------------------------------------------------------------

export interface LocationController {
  setUrl(newUrl: string): void;
  location: Location;
  restore(): void;
}

export function setupLocationMock(
  initialUrl = 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit'
): LocationController {
  const originalLocation = window.location;
  let controller: LocationController;

  const createMockLocation = (urlString: string): Location => {
    const base = controller?.location?.href || 'https://sutasomakrisnanda.github.io/see-you/';
    const parsed = new URL(urlString, base);

    const mockLoc = {
      href: parsed.href,
      origin: parsed.origin,
      protocol: parsed.protocol,
      host: parsed.host,
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      assign: vi.fn((newUrl: string) => controller.setUrl(newUrl)),
      replace: vi.fn((newUrl: string) => controller.setUrl(newUrl)),
      reload: vi.fn(),
      toString() {
        return this.href;
      },
    } as unknown as Location;

    return mockLoc;
  };

  controller = {
    location: createMockLocation(initialUrl),

    setUrl(newUrl: string) {
      const updated = createMockLocation(newUrl);
      controller.location = updated;
      try {
        Object.defineProperty(window, 'location', {
          writable: true,
          configurable: true,
          value: updated,
        });
      } catch {
        // Fallback for environments where window.location is strictly non-configurable
        (window as any).location = updated;
      }
    },

    restore() {
      try {
        Object.defineProperty(window, 'location', {
          writable: true,
          configurable: true,
          value: originalLocation,
        });
      } catch {
        (window as any).location = originalLocation;
      }
    },
  };

  controller.setUrl(initialUrl);
  return controller;
}

// ---------------------------------------------------------------------------
// 4. Audio Mock
// ---------------------------------------------------------------------------

export class MockAudioElement {
  public src = '';
  public muted = false;
  public volume = 1.0;
  public paused = true;
  public currentTime = 0;
  public duration = 180;
  public loop = true;
  private listeners = new Map<string, Set<EventListener>>();
  public static shouldRejectPlay = false;
  public static instances: MockAudioElement[] = [];

  constructor(src?: string) {
    if (src) this.src = src;
    MockAudioElement.instances.push(this);
  }

  async play(): Promise<void> {
    if (HTMLAudioElement.prototype.play) {
      await HTMLAudioElement.prototype.play.call(this as unknown as HTMLAudioElement);
    }
    if (MockAudioElement.shouldRejectPlay) {
      const err = new DOMException(
        'The play method is not allowed by user agent permissions.',
        'NotAllowedError'
      );
      this.dispatchEvent(new Event('error'));
      throw err;
    }
    this.paused = false;
    this.dispatchEvent(new Event('play'));
    this.dispatchEvent(new Event('playing'));
    return Promise.resolve();
  }

  pause(): void {
    if (HTMLAudioElement.prototype.pause) {
      HTMLAudioElement.prototype.pause.call(this as unknown as HTMLAudioElement);
    }
    this.paused = true;
    this.dispatchEvent(new Event('pause'));
  }

  load(): void {
    this.dispatchEvent(new Event('load'));
  }

  addEventListener(type: string, listener: EventListener): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
  }

  removeEventListener(type: string, listener: EventListener): void {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event: Event): boolean {
    const handlers = this.listeners.get(event.type);
    if (handlers) {
      handlers.forEach(fn => {
        try {
          fn(event);
        } catch (e) {
          console.error(e);
        }
      });
    }
    return true;
  }

  static reset(): void {
    MockAudioElement.shouldRejectPlay = false;
    MockAudioElement.instances = [];
  }

  static install(): void {
    class MockAudioClass extends MockAudioElement {}
    // Inherit from HTMLAudioElement.prototype so spies on HTMLAudioElement.prototype work
    Object.setPrototypeOf(MockAudioClass.prototype, HTMLAudioElement.prototype);
    (window as any).Audio = MockAudioClass;

    if (typeof HTMLAudioElement !== 'undefined') {
      HTMLAudioElement.prototype.play = vi.fn().mockImplementation(function (this: HTMLAudioElement) {
        if (MockAudioElement.shouldRejectPlay) {
          const err = new DOMException(
            'The play method is not allowed by user agent permissions.',
            'NotAllowedError'
          );
          this.dispatchEvent(new Event('error'));
          return Promise.reject(err);
        }
        this.dispatchEvent(new Event('play'));
        return Promise.resolve();
      });
      HTMLAudioElement.prototype.pause = vi.fn().mockImplementation(function (this: HTMLAudioElement) {
        this.dispatchEvent(new Event('pause'));
      });
      HTMLAudioElement.prototype.load = vi.fn();
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Viewport and Pointer Capabilities
// ---------------------------------------------------------------------------

export function setViewport(
  width: number,
  height: number,
  pointer: 'fine' | 'coarse' = 'coarse'
): void {
  currentViewportState.width = width;
  currentViewportState.height = height;
  currentViewportState.pointer = pointer;

  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  Object.defineProperty(window, 'outerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'outerHeight', { writable: true, configurable: true, value: height });

  // Update screen object if present
  if (window.screen) {
    Object.defineProperty(window.screen, 'width', { writable: true, configurable: true, value: width });
    Object.defineProperty(window.screen, 'height', { writable: true, configurable: true, value: height });
  }

  activeMatchMediaController?.setViewportMatch(width, pointer);
  window.dispatchEvent(new Event('resize'));
}

// ---------------------------------------------------------------------------
// 6. IntersectionObserver Mock
// ---------------------------------------------------------------------------

type ObserverCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;

export class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  private callback: ObserverCallback;
  private elements = new Set<Element>();
  public static instances: MockIntersectionObserver[] = [];

  constructor(callback: ObserverCallback, _options?: IntersectionObserverInit) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.elements.add(target);
  }

  unobserve(target: Element): void {
    this.elements.delete(target);
  }

  disconnect(): void {
    this.elements.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  simulateIntersection(
    target: Element,
    isIntersecting: boolean,
    ratio = isIntersecting ? 1.0 : 0.0
  ): void {
    // If elements is empty or doesn't have target, check if any observed element contains or matches target
    let matchedTarget: Element | null = null;
    if (this.elements.has(target)) {
      matchedTarget = target;
    } else {
      for (const el of this.elements) {
        if (el === target || el.contains(target) || target.contains(el)) {
          matchedTarget = el;
          break;
        }
      }
    }

    if (!matchedTarget) return;

    const rect = matchedTarget.getBoundingClientRect?.() || {
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };

    const entry: IntersectionObserverEntry = {
      time: Date.now(),
      target: matchedTarget,
      isIntersecting,
      intersectionRatio: ratio,
      boundingClientRect: rect,
      intersectionRect: isIntersecting
        ? rect
        : { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) },
      rootBounds: null,
    };

    this.callback([entry], this);
  }

  static triggerChapterVisibility(
    chapterElement: Element,
    isIntersecting = true,
    ratio = 0.6
  ): void {
    for (const instance of MockIntersectionObserver.instances) {
      instance.simulateIntersection(chapterElement, isIntersecting, ratio);
    }
  }

  static reset(): void {
    MockIntersectionObserver.instances = [];
  }

  static install(): void {
    (window as any).IntersectionObserver = MockIntersectionObserver;
  }
}

// ---------------------------------------------------------------------------
// 7. Global Harness Installation & Teardown Helper
// ---------------------------------------------------------------------------

export interface InstalledMocks {
  cacheStorage: MockCacheStorage;
  matchMediaController: MatchMediaController;
  locationController: LocationController;
  audioMock: typeof MockAudioElement;
  intersectionObserver: typeof MockIntersectionObserver;
  setViewport: typeof setViewport;
}

export function installAllBrowserMocks(options?: {
  initialUrl?: string;
  defaultReducedMotion?: boolean;
  width?: number;
  height?: number;
  pointer?: 'fine' | 'coarse';
}): InstalledMocks {
  const cacheStorage = new MockCacheStorage();
  (window as any).caches = cacheStorage;

  if (typeof navigator !== 'undefined' && !navigator.serviceWorker) {
    (navigator as any).serviceWorker = {
      register: vi.fn().mockImplementation((path: string, opts?: any) => {
        return Promise.resolve({
          scope: opts?.scope || '/see-you/',
          installing: null,
          waiting: null,
          active: null,
        });
      }),
    };
  }

  const matchMediaController = setupMatchMediaMock(options?.defaultReducedMotion ?? false);
  const locationController = setupLocationMock(
    options?.initialUrl ?? 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit'
  );

  MockAudioElement.install();
  MockIntersectionObserver.install();

  // Polyfill window.scrollTo and rAF if not present
  if (!window.scrollTo) {
    window.scrollTo = vi.fn();
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (fn: FrameRequestCallback) => setTimeout(fn, 16) as any;
    window.cancelAnimationFrame = (id: number) => clearTimeout(id);
  }

  setViewport(options?.width ?? 390, options?.height ?? 844, options?.pointer ?? 'coarse');

  return {
    cacheStorage,
    matchMediaController,
    locationController,
    audioMock: MockAudioElement,
    intersectionObserver: MockIntersectionObserver,
    setViewport,
  };
}

export function resetBrowserMocks(): void {
  MockAudioElement.reset();
  MockIntersectionObserver.reset();
  if ((window as any).caches?.clear) {
    (window as any).caches.clear();
  }
}
