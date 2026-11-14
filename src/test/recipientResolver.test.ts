import { describe, it, expect } from 'vitest';
import { resolveRecipient, isValidTokenFormat } from '../services/recipientResolver';
import {
  RECIPIENT_NADYA,
  RECIPIENT_BUDI,
  RECIPIENT_SITI,
  RECIPIENT_DEWI,
  RECIPIENT_AYA,
} from '../data/recipients';

describe('Recipient Resolver Service (Milestone 2)', () => {
  describe('isValidTokenFormat', () => {
    it('validates genuine 128-bit opaque tokens between 12 and 128 characters', () => {
      expect(isValidTokenFormat('tok_nadya_128bit')).toBe(true);
      expect(isValidTokenFormat('tok_budi_128bit')).toBe(true);
      expect(isValidTokenFormat('tok_siti_128bit')).toBe(true);
      expect(isValidTokenFormat('tok_dewi_128bit')).toBe(true);
      expect(isValidTokenFormat('tok_aya_128bit')).toBe(true);
      expect(isValidTokenFormat('1234567890abcdef')).toBe(true);
      expect(isValidTokenFormat('a'.repeat(64))).toBe(true);
      expect(isValidTokenFormat('a'.repeat(128))).toBe(true);
    });

    it('rejects tokens shorter than 12 characters', () => {
      expect(isValidTokenFormat('short_tok')).toBe(false);
      expect(isValidTokenFormat('12345678901')).toBe(false);
      expect(isValidTokenFormat('')).toBe(false);
    });

    it('rejects tokens longer than 128 characters', () => {
      expect(isValidTokenFormat('a'.repeat(129))).toBe(false);
      expect(isValidTokenFormat('tok_' + 'x'.repeat(200))).toBe(false);
    });

    it('rejects tokens with invalid characters or whitespace', () => {
      expect(isValidTokenFormat('tok with space!!')).toBe(false);
      expect(isValidTokenFormat('<script>alert(1)</script>')).toBe(false);
      expect(isValidTokenFormat('tok_nadya;drop table;')).toBe(false);
      expect(isValidTokenFormat('tok+encoded%2Fkey')).toBe(false);
    });

    it('rejects non-string inputs safely', () => {
      expect(isValidTokenFormat(null)).toBe(false);
      expect(isValidTokenFormat(undefined)).toBe(false);
      expect(isValidTokenFormat(1234567890123456)).toBe(false);
      expect(isValidTokenFormat({})).toBe(false);
    });
  });

  describe('resolveRecipient', () => {
    it('resolves standard valid recipient (Nadya Putri) from search query', () => {
      const recipient = resolveRecipient(`?q=${RECIPIENT_NADYA.token}`);
      expect(recipient).not.toBeNull();
      expect(recipient?.recipient.name).toBe('Nadya Putri');
      expect(recipient?.recipient.nickname).toBe('Nadya');
      expect(recipient?.token).toBe(RECIPIENT_NADYA.token);
      expect(recipient?.videoNote).toBeDefined();
    });

    it('resolves second recipient (Budi Santoso) from full URL', () => {
      const recipient = resolveRecipient(
        `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_BUDI.token}&source=qr_sticker`
      );
      expect(recipient).not.toBeNull();
      expect(recipient?.recipient.name).toBe('Budi Santoso');
      expect(recipient?.theme.accent).toBe('#29382F');
    });

    it('resolves edge-case recipient (Siti Rahma) with null avatar and undefined videoNote', () => {
      const recipient = resolveRecipient(`?q=${RECIPIENT_SITI.token}`);
      expect(recipient).not.toBeNull();
      expect(recipient?.recipient.name).toBe('Siti Rahma');
      expect(recipient?.teamLetters[0].avatar).toBeNull();
      expect(recipient?.videoNote).toBeUndefined();
    });

    it('resolves edge-case recipient (Dewi Ayu) with Unicode and emojis preserved', () => {
      const recipient = resolveRecipient(`?q=${RECIPIENT_DEWI.token}`);
      expect(recipient).not.toBeNull();
      expect(recipient?.recipient.name).toContain('🌸');
      expect(recipient?.greeting.quote).toContain('🌿');
      expect(recipient?.closing.headline).toContain('🌿');
    });

    it('resolves reference intern (Aya)', () => {
      const recipient = resolveRecipient(`?q=${RECIPIENT_AYA.token}`);
      expect(recipient).not.toBeNull();
      expect(recipient?.recipient.name).toBe('Aya');
      expect(recipient?.facilitatorLetter.signature).toBe('Kak Rani');
    });

    it('resolves reference intern via alias token', () => {
      const recipient = resolveRecipient('?q=tok_aya_chronicle');
      expect(recipient).not.toBeNull();
      expect(recipient?.recipient.name).toBe('Aya');
    });

    it('resolves recipient when bare token is passed directly', () => {
      const recipient = resolveRecipient(RECIPIENT_NADYA.token);
      expect(recipient).not.toBeNull();
      expect(recipient?.recipient.name).toBe('Nadya Putri');
    });

    it('is strictly case-sensitive: uppercase token returns null', () => {
      const recipient = resolveRecipient(`?q=${RECIPIENT_NADYA.token.toUpperCase()}`);
      expect(recipient).toBeNull();
    });

    it('returns null for missing query string, empty string, or undefined', () => {
      expect(resolveRecipient('')).toBeNull();
      expect(resolveRecipient('?q=')).toBeNull();
      expect(resolveRecipient('https://example.com/see-you/')).toBeNull();
    });

    it('returns null for whitespace-only query parameter', () => {
      expect(resolveRecipient('?q=%20%20%20')).toBeNull();
      expect(resolveRecipient('?q=               ')).toBeNull();
    });

    it('safely handles malformed percent-encoding (%E0%A4%A) without throwing URIError', () => {
      expect(() => resolveRecipient('?q=%E0%A4%A')).not.toThrow();
      expect(resolveRecipient('?q=%E0%A4%A')).toBeNull();
    });

    it('neutralizes prototype pollution keys (__proto__, constructor, toString) safely', () => {
      const protoKeys = ['__proto__', 'constructor', 'prototype', 'toString', 'valueOf'];
      for (const key of protoKeys) {
        expect(resolveRecipient(`?q=${key}`)).toBeNull();
        expect(resolveRecipient(key)).toBeNull();
      }
      expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('neutralizes XSS injection payloads safely', () => {
      expect(resolveRecipient('?q=<script>alert(1)</script>')).toBeNull();
      expect(resolveRecipient('?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E')).toBeNull();
    });

    it('neutralizes SQL injection payloads safely', () => {
      expect(resolveRecipient("?q=tok_nadya'; DROP TABLE recipients; --")).toBeNull();
    });

    it('neutralizes oversized tokens safely', () => {
      const oversized = 'tok_' + 'a'.repeat(500);
      expect(resolveRecipient(`?q=${oversized}`)).toBeNull();
    });

    it('zero data leakage: returns null for unregistered token', () => {
      const unknownToken = 'unknown_token_1234567890';
      const result = resolveRecipient(`?q=${unknownToken}`);
      expect(result).toBeNull();
    });
  });
});
