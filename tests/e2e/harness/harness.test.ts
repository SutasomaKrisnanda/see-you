/**
 * Self-Verification Test Suite for See You E2E Harness
 *
 * Verifies that all mock implementations, fixtures, and assertions
 * function strictly according to specification.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as React from 'react';
import {
  MockCache,
  MockCacheStorage,
  setupMatchMediaMock,
  setupLocationMock,
  MockAudioElement,
  setViewport,
  MockIntersectionObserver,
  installAllBrowserMocks,
} from './browserMocks';
import {
  RECIPIENT_NADYA,
  RECIPIENT_BUDI,
  RECIPIENT_SITI,
  RECIPIENT_DEWI,
  VALID_RECIPIENTS,
  MALFORMED_TOKENS,
  isValidTokenFormat,
  mockResolveRecipient,
} from './recipientFixtures';
import {
  expectChapterCounter,
  expectDesktopGateVisible,
  expectDesktopGateHidden,
  expectMobileStoryVisible,
  expectCacheEntry,
  expectAllAssetsCached,
  expectSafeFallbackVisible,
  expectAudioState,
} from './assertions';
import { renderWithHarness, renderApp } from './renderHarness';

describe('E2E Harness: Browser Mocks', () => {
  describe('MockCache & MockCacheStorage', () => {
    let cacheStorage: MockCacheStorage;

    beforeEach(() => {
      cacheStorage = new MockCacheStorage();
    });

    it('should open, put, match, and delete cache entries', async () => {
      const cache = await cacheStorage.open('see-you-v1');
      const testUrl = 'https://sutasomakrisnanda.github.io/see-you/assets/botanical/flower-a.svg';
      const mockResponse = new Response('<svg></svg>', {
        status: 200,
        headers: { 'Content-Type': 'image/svg+xml' },
      });

      await cache.put(testUrl, mockResponse);

      const matched = await cache.match(testUrl);
      expect(matched).toBeDefined();
      expect(matched?.status).toBe(200);

      const keys = await cache.keys();
      expect(keys.length).toBe(1);
      expect(keys[0].url).toBe(testUrl);

      const deleted = await cache.delete(testUrl);
      expect(deleted).toBe(true);

      const afterDelete = await cache.match(testUrl);
      expect(afterDelete).toBeUndefined();
    });

    it('should throw QuotaExceededError when shouldSimulateQuotaError is true', async () => {
      cacheStorage.shouldSimulateQuotaError = true;

      await expect(cacheStorage.open('see-you-v1')).rejects.toThrowError(
        expect.objectContaining({ name: 'QuotaExceededError' })
      );
    });

    it('should throw QuotaExceededError in put() and add() when shouldSimulateQuotaError is true', async () => {
      const cache = await cacheStorage.open('see-you-v1');
      cacheStorage.shouldSimulateQuotaError = true;

      await expect(cache.put('/test', new Response('data'))).rejects.toThrowError(
        expect.objectContaining({ name: 'QuotaExceededError' })
      );
    });
  });

  describe('setupMatchMediaMock', () => {
    it('should match prefers-reduced-motion according to configuration', () => {
      const controller = setupMatchMediaMock(true);
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      expect(mql.matches).toBe(true);

      let listenerFired = false;
      mql.addEventListener('change', (e: any) => {
        listenerFired = true;
        expect(e.matches).toBe(false);
      });

      controller.setReducedMotion(false);
      expect(listenerFired).toBe(true);
    });

    it('should dynamically update mql.matches on existing instances and differentiate no-preference', () => {
      const controller = setupMatchMediaMock(false);
      const reduceMql = window.matchMedia('(prefers-reduced-motion: reduce)');
      const noPrefMql = window.matchMedia('(prefers-reduced-motion: no-preference)');

      expect(reduceMql.matches).toBe(false);
      expect(noPrefMql.matches).toBe(true);

      controller.setReducedMotion(true);

      // Existing references must dynamically evaluate updated matches
      expect(reduceMql.matches).toBe(true);
      expect(noPrefMql.matches).toBe(false);
    });

    it('should respond to viewport breakpoint queries', () => {
      const controller = setupMatchMediaMock(false);
      setViewport(375, 667, 'coarse');

      const mobileMql = window.matchMedia('(max-width: 640px)');
      expect(mobileMql.matches).toBe(true);

      const desktopMql = window.matchMedia('(min-width: 641px)');
      expect(desktopMql.matches).toBe(false);

      setViewport(1280, 800, 'fine');
      controller.setViewportMatch(1280, 'fine');

      expect(window.matchMedia('(max-width: 640px)').matches).toBe(false);
      expect(window.matchMedia('(min-width: 641px)').matches).toBe(true);
    });
  });

  describe('setupLocationMock', () => {
    it('should accurately parse href, search, and pathname', () => {
      const controller = setupLocationMock('https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit');

      expect(window.location.pathname).toBe('/see-you/');
      expect(window.location.search).toBe('?q=tok_nadya_128bit');
      expect(window.location.href).toBe('https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit');

      controller.setUrl('https://sutasomakrisnanda.github.io/see-you/?q=tok_budi_128bit');
      expect(window.location.search).toBe('?q=tok_budi_128bit');
    });

    it('should preserve /see-you/ subpath when relative URL or hash is set', () => {
      const controller = setupLocationMock('https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit');

      controller.setUrl('?q=tok_dewi_128bit');
      expect(window.location.pathname).toBe('/see-you/');
      expect(window.location.search).toBe('?q=tok_dewi_128bit');
      expect(window.location.href).toBe('https://sutasomakrisnanda.github.io/see-you/?q=tok_dewi_128bit');

      controller.setUrl('#invalid');
      expect(window.location.pathname).toBe('/see-you/');
      expect(window.location.hash).toBe('#invalid');
    });
  });

  describe('MockAudioElement', () => {
    beforeEach(() => {
      MockAudioElement.reset();
      MockAudioElement.install();
    });

    it('should transition paused state and dispatch play/pause events', async () => {
      const audio = new MockAudioElement('ambient.mp3');
      expect(audio.paused).toBe(true);

      let playFired = false;
      audio.addEventListener('play', () => {
        playFired = true;
      });

      await audio.play();
      expect(audio.paused).toBe(false);
      expect(playFired).toBe(true);

      let pauseFired = false;
      audio.addEventListener('pause', () => {
        pauseFired = true;
      });

      audio.pause();
      expect(audio.paused).toBe(true);
      expect(pauseFired).toBe(true);
    });

    it('should reject play() with NotAllowedError when shouldRejectPlay is true', async () => {
      MockAudioElement.shouldRejectPlay = true;
      const audio = new MockAudioElement('ambient.mp3');

      let errorFired = false;
      audio.addEventListener('error', () => {
        errorFired = true;
      });

      await expect(audio.play()).rejects.toThrowError(
        expect.objectContaining({ name: 'NotAllowedError' })
      );
      expect(errorFired).toBe(true);
    });
  });

  describe('MockIntersectionObserver', () => {
    beforeEach(() => {
      MockIntersectionObserver.reset();
      MockIntersectionObserver.install();
    });

    it('should observe elements and trigger intersection callback on visibility trigger', () => {
      let triggered = false;
      const target = document.createElement('div');
      document.body.appendChild(target);

      const observer = new MockIntersectionObserver((entries) => {
        expect(entries.length).toBe(1);
        expect(entries[0].target).toBe(target);
        expect(entries[0].isIntersecting).toBe(true);
        triggered = true;
      });

      observer.observe(target);
      MockIntersectionObserver.triggerChapterVisibility(target);

      expect(triggered).toBe(true);
      document.body.removeChild(target);
    });
  });
});

describe('E2E Harness: Recipient Fixtures', () => {
  it('should provide complete valid fixture for Nadya Putri', () => {
    expect(RECIPIENT_NADYA.token).toBe('tok_nadya_128bit');
    expect(RECIPIENT_NADYA.recipient.name).toBe('Nadya Putri');
    expect(RECIPIENT_NADYA.facilitatorLetter.signature).toBe('Krisnanda');
    expect(RECIPIENT_NADYA.teamLetters.length).toBeGreaterThan(0);
    expect(RECIPIENT_NADYA.memories.length).toBeGreaterThan(0);
    expect(RECIPIENT_NADYA.videoNote).toBeDefined();
  });

  it('should provide complete valid fixture for Budi Santoso', () => {
    expect(RECIPIENT_BUDI.token).toBe('tok_budi_128bit');
    expect(RECIPIENT_BUDI.recipient.name).toBe('Budi Santoso');
  });

  it('should support edge case fixture with null avatars and undefined videoNote (Siti Rahma)', () => {
    expect(RECIPIENT_SITI.token).toBe('tok_siti_128bit');
    expect(RECIPIENT_SITI.teamLetters[0].avatar).toBeNull();
    expect(RECIPIENT_SITI.videoNote).toBeUndefined();
  });

  it('should support edge case fixture with unicode/emojis (Dewi Ayu)', () => {
    expect(RECIPIENT_DEWI.token).toBe('tok_dewi_128bit');
    expect(RECIPIENT_DEWI.recipient.name).toContain('🌸');
    expect(RECIPIENT_DEWI.greeting.quote).toContain('🌿');
  });

  it('should correctly validate token format and reject malformed/attack tokens', () => {
    expect(isValidTokenFormat(RECIPIENT_NADYA.token)).toBe(true);
    expect(isValidTokenFormat(MALFORMED_TOKENS.INVALID_TOKEN_999)).toBe(true); // Valid format, non-existent
    expect(isValidTokenFormat(MALFORMED_TOKENS.XSS_SCRIPT_TAG)).toBe(false);
    expect(isValidTokenFormat(MALFORMED_TOKENS.SQL_INJECTION)).toBe(false);
    expect(isValidTokenFormat(MALFORMED_TOKENS.EMPTY_STRING)).toBe(false);
  });

  it('should resolve only matching valid tokens and return null for invalid ones', () => {
    expect(mockResolveRecipient(RECIPIENT_NADYA.token)?.recipient.name).toBe('Nadya Putri');
    expect(mockResolveRecipient('INVALID_TOKEN_999')).toBeNull();
    expect(mockResolveRecipient('<script>alert(1)</script>')).toBeNull();
    expect(mockResolveRecipient(null)).toBeNull();
  });
});

describe('E2E Harness: Assertions', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('expectChapterCounter should assert matching text format', () => {
    const counter = document.createElement('div');
    counter.className = 'chapter-counter';
    counter.textContent = '01 / 06';
    document.body.appendChild(counter);

    expect(() => expectChapterCounter(document.body, '01 / 06')).not.toThrow();
    expect(() => expectChapterCounter(document.body, '02 / 06')).toThrow();
  });

  it('expectDesktopGateVisible and Hidden should assert correct gate states', () => {
    const gate = document.createElement('div');
    gate.className = 'desktop-gate';
    document.body.appendChild(gate);

    expect(() => expectDesktopGateVisible(document.body)).not.toThrow();

    gate.style.display = 'none';
    expect(() => expectDesktopGateHidden(document.body)).not.toThrow();
  });

  it('expectCacheEntry and expectAllAssetsCached should verify cache responses', async () => {
    const cache = new MockCache();
    const url1 = '/see-you/index.html';
    const url2 = '/see-you/assets/botanical/flower-a.svg';

    await cache.put(url1, new Response('html', { status: 200 }));
    await cache.put(url2, new Response('svg', { status: 200 }));

    await expect(expectCacheEntry(cache, url1, 200)).resolves.toBeDefined();
    await expect(expectAllAssetsCached(cache, [url1, url2])).resolves.toBeUndefined();
  });

  it('expectSafeFallbackVisible should verify fallback section and guard confidentiality', () => {
    const fallback = document.createElement('div');
    fallback.id = 'invalid';
    fallback.innerHTML = '<h2>Letter Not Found</h2><p>Please check your link.</p>';
    document.body.appendChild(fallback);

    expect(() => expectSafeFallbackVisible(document.body)).not.toThrow();

    // If sensitive name is leaked, assertion should fail
    fallback.innerHTML += '<p>Nadya Putri</p>';
    expect(() => expectSafeFallbackVisible(document.body)).toThrow();
  });
});

describe('E2E Harness: renderWithHarness', () => {
  it('should render React UI and provide interaction helpers', () => {
    let stampClicked = false;
    let audioClicked = false;

    const TestComponent = () => {
      return React.createElement(
        'div',
        null,
        React.createElement('div', { id: 'story' }, 'Mobile Story Content'),
        React.createElement(
          'button',
          {
            className: 'stamp-btn',
            'aria-label': 'Open your letter',
            onClick: () => {
              stampClicked = true;
            },
          },
          '✳'
        ),
        React.createElement(
          'button',
          {
            className: 'audio-toggle',
            'aria-label': 'Enable ambient music',
            onClick: () => {
              audioClicked = true;
            },
          },
          'Sound'
        )
      );
    };

    const harness = renderWithHarness(React.createElement(TestComponent), {
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
      viewport: { width: 390, height: 844, pointer: 'coarse' },
    });

    expect(window.location.search).toBe('?q=tok_nadya_128bit');
    expect(window.innerWidth).toBe(390);

    harness.tapStamp();
    expect(stampClicked).toBe(true);

    harness.toggleAudio();
    expect(audioClicked).toBe(true);

    harness.setViewport(1280, 800, 'fine');
    expect(window.innerWidth).toBe(1280);
  });

  it('renderApp should mount root App and provide full harness utilities', async () => {
    const appHarness = await renderApp({
      initialUrl: 'https://sutasomakrisnanda.github.io/see-you/?q=tok_nadya_128bit',
      viewport: { width: 390, height: 844, pointer: 'coarse' },
    });

    expect(appHarness.container).toBeDefined();
    expect(window.location.search).toBe('?q=tok_nadya_128bit');
    expect(window.innerWidth).toBe(390);
  });
});
