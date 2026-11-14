/**
 * Recipient Resolver Service for See You
 *
 * Provides pure client-side, prototype-safe recipient resolution against
 * precompiled static data without network or backend dependencies.
 *
 * Conforms to PROJECT.md § Interface Contracts.
 */

import type { RecipientData } from '../data/types';
import { RECIPIENTS_BY_TOKEN } from '../data/recipients';

// Whitelist pattern: 128-bit opaque tokens (12 to 128 alphanumeric, hyphen, underscore characters)
// Defends against prototype keys (__proto__ = 9, constructor = 11), XSS, SQLi, and oversized inputs
const TOKEN_REGEX = /^[a-zA-Z0-9_-]{12,128}$/;

/**
 * Validates whether a token adheres strictly to expected 128-bit opaque format.
 * Rejects whitespace, XSS characters, prototype keys, and oversized inputs.
 */
export function isValidTokenFormat(token: unknown): token is string {
  if (typeof token !== 'string') return false;
  return TOKEN_REGEX.test(token);
}

/**
 * Safely resolves recipient data from a URL search query or browser location.
 *
 * Guarantees:
 * - O(1) constant time lookup via ES6 Map with zero prototype pollution risk.
 * - Defensive try/catch against malformed percent encodings (URIError).
 * - Strict case-sensitive matching.
 * - Zero data leakage: returns strictly RecipientData or null.
 */
export function resolveRecipient(searchQuery?: string): RecipientData | null {
  try {
    let rawQuery = searchQuery;
    if (typeof rawQuery === 'undefined') {
      if (typeof window === 'undefined') return null;
      rawQuery = window.location.search;
    }

    if (!rawQuery) return null;

    if (rawQuery.includes('?')) {
      rawQuery = rawQuery.slice(rawQuery.indexOf('?') + 1);
    }

    const params = new URLSearchParams(rawQuery);
    let token = params.get('q');

    // Handle case where caller passes the raw token string directly
    if (!token && !rawQuery.includes('=') && !rawQuery.includes('&') && isValidTokenFormat(rawQuery)) {
      token = rawQuery;
    }

    if (!token || !isValidTokenFormat(token)) {
      return null;
    }

    return RECIPIENTS_BY_TOKEN.get(token) ?? null;
  } catch {
    // Malformed URI encoding or parsing error safely returns null
    return null;
  }
}
