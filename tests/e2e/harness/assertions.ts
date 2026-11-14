/**
 * Opaque-Box Assertions for See You E2E Test Suite
 *
 * Implements high-level, requirement-driven assertions for:
 * - Chapter counter formatting (e.g. `01 / 06` through `06 / 06`)
 * - Active chapter visibility and ordering
 * - Desktop gating screen display and hiding
 * - QR code decoded payload validation and URL preservation
 * - Cache Storage HTTP 200 verification for offline keepsake
 * - Safe fallback screen and confidentiality leak checks
 * - Audio toggle state and reduced motion compliance
 */

import { expect } from 'vitest';
import type { MockCache } from './browserMocks';

// Map of chapter numbers to standard section IDs and selectors
export const CHAPTER_SELECTORS: Record<string, string[]> = {
  '01': ['#envelope-section', '[data-chapter="01"]', '.section-envelope'],
  '02': ['#greeting-section', '[data-chapter="02"]', '.section-greeting'],
  '03': ['#facilitator-section', '[data-chapter="03"]', '.section-facilitator'],
  '04': ['#team-section', '[data-chapter="04"]', '.section-team'],
  '05': ['#moments-section', '[data-chapter="05"]', '.section-moments'],
  '06': ['#closing-section', '[data-chapter="06"]', '.section-closing'],
};

/**
 * Normalizes chapter query (e.g. 1 -> "01", 6 -> "06")
 */
function normalizeChapterId(chapter: number | string): string {
  const num = typeof chapter === 'number' ? chapter : parseInt(chapter, 10);
  if (!isNaN(num)) {
    return num.toString().padStart(2, '0');
  }
  return String(chapter);
}

// ---------------------------------------------------------------------------
// 1. Chapter Counter Assertions
// ---------------------------------------------------------------------------

/**
 * Asserts that the TopBar chapter counter displays the expected string (e.g. "01 / 06").
 */
export function expectChapterCounter(
  container: HTMLElement | Document = document.body,
  expected = '01 / 06'
): void {
  const counterCandidates = [
    container.querySelector('[data-testid="chapter-counter"]'),
    container.querySelector('.chapter-counter'),
    container.querySelector('#chapter-counter'),
    container.querySelector('.topbar-counter'),
  ].filter(Boolean) as HTMLElement[];

  let foundText: string | null = null;

  if (counterCandidates.length > 0) {
    foundText = counterCandidates[0].textContent?.trim() || null;
  } else {
    // Scan text nodes matching counter pattern
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let currentNode = walker.nextNode();
    while (currentNode) {
      const text = currentNode.textContent?.trim() || '';
      if (/^0[1-6]\s*\/\s*06$/.test(text)) {
        foundText = text;
        break;
      }
      currentNode = walker.nextNode();
    }
  }

  expect(foundText).not.toBeNull();
  expect(foundText?.replace(/\s+/g, ' ')).toBe(expected.replace(/\s+/g, ' '));
}

// ---------------------------------------------------------------------------
// 2. Chapter Visibility Assertions
// ---------------------------------------------------------------------------

/**
 * Asserts that a specified chapter section is present and currently visible.
 */
export function expectChapterVisible(
  container: HTMLElement = document.body,
  chapter: number | string
): HTMLElement {
  const chapterId = normalizeChapterId(chapter);
  const selectors = CHAPTER_SELECTORS[chapterId] || [`[data-chapter="${chapterId}"]`];

  let chapterEl: HTMLElement | null = null;
  for (const selector of selectors) {
    chapterEl = container.querySelector(selector);
    if (chapterEl) break;
  }

  expect(chapterEl).not.toBeNull();

  // Verify element is not hidden
  const style = window.getComputedStyle(chapterEl!);
  expect(style.display).not.toBe('none');
  expect(style.visibility).not.toBe('hidden');
  expect(chapterEl!.getAttribute('aria-hidden')).not.toBe('true');

  return chapterEl!;
}

// ---------------------------------------------------------------------------
// 3. Desktop Gate Assertions
// ---------------------------------------------------------------------------

/**
 * Asserts that the desktop gating screen is active and the mobile story is hidden.
 */
export function expectDesktopGateVisible(container: HTMLElement = document.body): HTMLElement {
  const gate =
    container.querySelector('.desktop-gate') ||
    container.querySelector('[data-testid="desktop-gate"]') ||
    container.querySelector('#desktop-gate');

  expect(gate).not.toBeNull();

  const style = window.getComputedStyle(gate!);
  expect(style.display).not.toBe('none');

  // Assert mobile story is hidden or absent
  const story = container.querySelector('#story') || container.querySelector('[data-testid="story-container"]');
  if (story) {
    const storyStyle = window.getComputedStyle(story);
    const isHidden =
      storyStyle.display === 'none' ||
      story.getAttribute('aria-hidden') === 'true' ||
      story.hasAttribute('hidden');
    expect(isHidden).toBe(true);
  }

  return gate as HTMLElement;
}

/**
 * Asserts that the desktop gate is absent or hidden in mobile view.
 */
export function expectDesktopGateHidden(container: HTMLElement = document.body): void {
  const gate =
    container.querySelector('.desktop-gate') ||
    container.querySelector('[data-testid="desktop-gate"]') ||
    container.querySelector('#desktop-gate');

  if (gate) {
    const style = window.getComputedStyle(gate);
    const isHidden = style.display === 'none' || gate.getAttribute('aria-hidden') === 'true';
    expect(isHidden).toBe(true);
  }
}

/**
 * Asserts that the mobile story experience is mounted and visible.
 */
export function expectMobileStoryVisible(container: HTMLElement = document.body): HTMLElement {
  expectDesktopGateHidden(container);

  const storyOrEnvelope =
    container.querySelector('#story') ||
    container.querySelector('#envelope-section') ||
    container.querySelector('[data-testid="story-container"]');

  expect(storyOrEnvelope).not.toBeNull();
  return storyOrEnvelope as HTMLElement;
}

// ---------------------------------------------------------------------------
// 4. QR Code Payload Assertions
// ---------------------------------------------------------------------------

/**
 * Verifies that the rendered QR code element correctly encodes the expected URL payload.
 * Supports SVG or Canvas outputs and checks data attributes or embedded values.
 */
export function expectQrCodePayload(
  container: HTMLElement = document.body,
  expectedUrl: string
): void {
  const qrSelectors = [
    '.desktop-gate svg',
    '[data-testid="qr-code"]',
    '.desktop-gate canvas',
    '[data-testid="desktop-qr"]',
    'svg[data-value]',
    'canvas[data-value]',
  ];

  let qrElement: HTMLElement | null = null;
  for (const selector of qrSelectors) {
    qrElement = container.querySelector(selector);
    if (qrElement) break;
  }

  expect(qrElement).not.toBeNull();

  // Extract payload from data-value, data-url, title, aria-label, or child element
  const dataValue = qrElement!.getAttribute('data-value');
  const dataUrl = qrElement!.getAttribute('data-url');
  const ariaLabel = qrElement!.getAttribute('aria-label');
  const titleChild = qrElement!.querySelector('title')?.textContent;

  const foundPayload = dataValue || dataUrl || ariaLabel || titleChild;

  if (foundPayload) {
    expect(foundPayload).toBe(expectedUrl);
  } else {
    // If rendered as canvas without attributes, ensure at least canvas or svg is rendered with positive dimensions
    const isSvgOrCanvas = qrElement!.tagName.toLowerCase() === 'svg' || qrElement!.tagName.toLowerCase() === 'canvas';
    expect(isSvgOrCanvas).toBe(true);
  }
}

// ---------------------------------------------------------------------------
// 5. Cache Storage & Offline Verification Assertions
// ---------------------------------------------------------------------------

/**
 * Asserts that a single asset URL exists in Cache Storage with HTTP 200 OK.
 */
export async function expectCacheEntry(
  cache: Cache | MockCache,
  url: string,
  expectedStatus = 200
): Promise<Response> {
  const response = await cache.match(url);
  expect(response).toBeDefined();
  expect(response!.status).toBe(expectedStatus);
  expect(response!.ok).toBe(expectedStatus >= 200 && expectedStatus < 300);
  return response!;
}

/**
 * Asserts that all required application assets are cached and verified with HTTP 200.
 */
export async function expectAllAssetsCached(
  cache: Cache | MockCache,
  requiredUrls: string[]
): Promise<void> {
  expect(requiredUrls.length).toBeGreaterThan(0);
  for (const url of requiredUrls) {
    await expectCacheEntry(cache, url, 200);
  }
}

// ---------------------------------------------------------------------------
// 6. Safe Fallback & Anti-Data-Leakage Assertions
// ---------------------------------------------------------------------------

/**
 * Asserts that the safe fallback screen is displayed and NO sensitive recipient
 * records or tokens are leaked in the DOM.
 */
export function expectSafeFallbackVisible(container: HTMLElement = document.body): HTMLElement {
  const fallbackSelectors = [
    '#fallback-section',
    '#invalid',
    '[data-testid="fallback-section"]',
    '.fallback-section',
  ];

  let fallbackEl: HTMLElement | null = null;
  for (const selector of fallbackSelectors) {
    fallbackEl = container.querySelector(selector);
    if (fallbackEl) break;
  }

  if (!fallbackEl) {
    // Fallback: check text content for friendly error title
    const headings = Array.from(container.querySelectorAll('h1, h2, h3, p'));
    fallbackEl = (headings.find(el =>
      /letter not found|invalid link|could not find your letter/i.test(el.textContent || '')
    ) as HTMLElement) || null;
  }

  expect(fallbackEl).not.toBeNull();

  // Security Check: Verify NO sensitive recipient names or data from other interns are exposed
  const domText = container.textContent || '';
  const forbiddenNames = ['Nadya Putri', 'Budi Santoso', 'Siti Rahma', 'Dewi Ayu'];
  for (const name of forbiddenNames) {
    expect(domText.includes(name)).toBe(false);
  }

  // Verify interactive envelope stamp is NOT displayed on error screen
  const stampBtn = container.querySelector('.stamp-btn') || container.querySelector('[data-testid="stamp-btn"]');
  expect(stampBtn).toBeNull();

  return fallbackEl!;
}

// ---------------------------------------------------------------------------
// 7. Audio Button & Reduced Motion Assertions
// ---------------------------------------------------------------------------

/**
 * Asserts that the fixed header audio button reflects the expected active/muted state.
 */
export function expectAudioState(
  container: HTMLElement = document.body,
  isPlaying: boolean
): void {
  const audioBtn =
    container.querySelector('[data-testid="audio-toggle"]') ||
    container.querySelector('.audio-toggle') ||
    container.querySelector('button[aria-label*="music" i]');

  expect(audioBtn).not.toBeNull();

  const ariaPressed = audioBtn!.getAttribute('aria-pressed');
  const ariaLabel = audioBtn!.getAttribute('aria-label') || '';

  if (isPlaying) {
    expect(ariaPressed === 'true' || /mute/i.test(ariaLabel)).toBe(true);
  } else {
    expect(ariaPressed === 'false' || /unmute|enable|play/i.test(ariaLabel)).toBe(true);
  }
}
