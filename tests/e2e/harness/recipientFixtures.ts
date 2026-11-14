/**
 * Recipient Fixtures for See You E2E Test Suite
 *
 * Conforms strictly to PROJECT.md § Interface Contracts.
 * Provides realistic static data for:
 * 1. Nadya Putri (`tok_nadya_128bit`) - Standard complete recipient with video note
 * 2. Budi Santoso (`tok_budi_128bit`) - Alternative complete recipient
 * 3. Siti Rahma (`tok_siti_128bit`) - Edge case: null avatars and undefined video note
 * 4. Dewi Ayu 🌸 (`tok_dewi_128bit`) - Edge case: unicode and emojis in all text fields
 * 5. Attack & Malformed tokens (XSS, SQLi, percent-encoding errors, oversized tokens)
 */

export interface RecipientProfile {
  name: string;
  nickname: string;
}

export interface FacilitatorLetter {
  sender: string;
  role: string;
  salutation: string;
  paragraphs: string[];
  signature: string;
}

export interface TeamMemberMessage {
  sender: string;
  role: string;
  avatar: string | null;
  accent: string;
  message: string;
}

export interface MemoryPhoto {
  src: string;
  alt: string;
  caption: string;
}

export interface RecipientData {
  token: string;
  recipient: RecipientProfile;
  theme: {
    background: string;
    accent: string;
  };
  flower?: 'matahari' | 'carnation' | ('matahari' | 'carnation')[];
  greeting: {
    headline: string;
    quote: string;
    message: string;
  };
  facilitatorLetter: FacilitatorLetter;
  teamLetters: TeamMemberMessage[];
  memories: MemoryPhoto[];
  videoNote?: {
    src?: string;
    poster?: string;
    note: string;
  };
  closing: {
    headline: string;
    message: string;
    sender: string;
    period: string;
  };
}

// ---------------------------------------------------------------------------
// 1. Nadya Putri (Standard Valid Recipient with Video Note)
// ---------------------------------------------------------------------------

export const RECIPIENT_NADYA: RecipientData = {
  token: 'tok_nadya_128bit',
  recipient: {
    name: 'Nadya Putri',
    nickname: 'Nadya',
  },
  theme: {
    background: '#F7F3EA',
    accent: '#687B61',
  },
  greeting: {
    headline: 'A letter for Nadya',
    quote: 'Every beginning comes from some other beginning’s end.',
    message:
      'Hello, Nadya! Thank you for the wonderful energy and dedication you brought to Komnasinfo during your internship. Here is a keepsake letter from all of us.',
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Facilitator & Lead',
    salutation: 'Dear Nadya,',
    paragraphs: [
      'Looking back at your first week, what stood out was your curiosity and quiet confidence. You approached every design challenge with a thoughtful perspective and genuine care for the team.',
      'Through tight deadlines and iterative brainstorms, your resilience kept our project grounded. You showed not just technical skill, but the rare empathy that makes great teams thrive.',
      'As you step forward into your next chapter, remember that your contributions here have left a lasting imprint on Komnasinfo. We are deeply grateful and excited to see the heights you will reach.',
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: 'Bambang Wijaya',
      role: 'Head of Komnasinfo',
      avatar: '/see-you/assets/photos/bambang.webp',
      accent: '#29382F',
      message:
        'Nadya, your dedication was exemplary. Komnasinfo was richer with you on the team. Best of luck in all your future endeavors!',
    },
    {
      sender: 'Fajar Nugraha',
      role: 'Senior Designer',
      avatar: '/see-you/assets/photos/fajar.webp',
      accent: '#687B61',
      message:
        'It was such a joy collaborating with you. Keep creating with that wonderful passion and keen eye for detail!',
    },
    {
      sender: 'Ayu Lestari',
      role: 'Project Coordinator',
      avatar: '/see-you/assets/photos/ayu.webp',
      accent: '#D9C8A5',
      message:
        'Thank you for your warmth and teamwork, Nadya. You made coordination seamless and fun. Until we meet again!',
    },
  ],
  memories: [
    {
      src: '/see-you/assets/photos/memory-1.webp',
      alt: 'Team sprint retrospective in studio',
      caption: 'The first sprint retrospective in the studio',
    },
    {
      src: '/see-you/assets/photos/memory-2.webp',
      alt: 'Coffee break conversations',
      caption: 'Afternoon coffee conversations and laughter',
    },
    {
      src: '/see-you/assets/photos/memory-3.webp',
      alt: 'Demo day celebration',
      caption: 'Celebrating demo day success together',
    },
  ],
  videoNote: {
    src: '/see-you/assets/videos/farewell-nadya.mp4',
    poster: '/see-you/assets/photos/video-poster-nadya.webp',
    note: 'A quick compilation of farewell messages from the team.',
  },
  closing: {
    headline: 'Until We Meet Again',
    message: 'May your journey ahead be filled with purpose, joy, and inspiring milestones.',
    sender: 'Komnasinfo & Chronicle',
    period: 'Internship Period: August - December 2026',
  },
};

// ---------------------------------------------------------------------------
// 2. Budi Santoso (Second Valid Recipient)
// ---------------------------------------------------------------------------

export const RECIPIENT_BUDI: RecipientData = {
  token: 'tok_budi_128bit',
  recipient: {
    name: 'Budi Santoso',
    nickname: 'Budi',
  },
  theme: {
    background: '#F7F3EA',
    accent: '#29382F',
  },
  greeting: {
    headline: 'A letter for Budi',
    quote: 'What we take with us is defined by who we walked alongside.',
    message:
      'Hello, Budi! As your internship comes to a close, we wanted to take a moment to reflect on everything we built and shared together.',
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Facilitator & Lead',
    salutation: 'Dear Budi,',
    paragraphs: [
      'From day one, you brought steady determination and a sharp analytical mind to every task. You never settled for the easiest solution, but pushed for the right one.',
      'Watching you solve complex frontend edge cases and support your peers was one of the highlights of this internship cycle. Your patience and focus set an example for everyone around you.',
      'Thank you for your craftsmanship and companionship, Budi. I have no doubt you will continue to build remarkable things wherever your path leads.',
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: 'Bambang Wijaya',
      role: 'Head of Komnasinfo',
      avatar: '/see-you/assets/photos/bambang.webp',
      accent: '#29382F',
      message:
        'Budi, your technical diligence and positive attitude will be deeply missed. Outstanding work throughout your term!',
    },
    {
      sender: 'Fajar Nugraha',
      role: 'Senior Designer',
      avatar: '/see-you/assets/photos/fajar.webp',
      accent: '#687B61',
      message:
        'Working with you was effortless and inspiring. Never lose your passion for solid, thoughtful implementation!',
    },
    {
      sender: 'Ayu Lestari',
      role: 'Project Coordinator',
      avatar: '/see-you/assets/photos/ayu.webp',
      accent: '#D9C8A5',
      message:
        'Thanks for always being so reliable and calm under pressure. Best wishes for your graduation!',
    },
  ],
  memories: [
    {
      src: '/see-you/assets/photos/memory-budi-1.webp',
      alt: 'Late night debugging sprint',
      caption: 'Hunting down the final release bug together',
    },
    {
      src: '/see-you/assets/photos/memory-budi-2.webp',
      alt: 'Team lunch break',
      caption: 'Warung lunch breaks that went way too long',
    },
    {
      src: '/see-you/assets/photos/memory-budi-3.webp',
      alt: 'Project showcase demo',
      caption: 'Final presentation day triumph',
    },
  ],
  videoNote: {
    src: '/see-you/assets/videos/farewell-budi.mp4',
    poster: '/see-you/assets/photos/video-poster-budi.webp',
    note: 'Team memories recorded during the final sprint.',
  },
  closing: {
    headline: 'Until We Meet Again',
    message: 'Thank you for being an indispensable part of Komnasinfo. Go do great things, Budi!',
    sender: 'Komnasinfo & Chronicle',
    period: 'Internship Period: August - December 2026',
  },
};

// ---------------------------------------------------------------------------
// 3. Siti Rahma (Edge Case: Null Avatars & Missing VideoNote)
// ---------------------------------------------------------------------------

export const RECIPIENT_SITI: RecipientData = {
  token: 'tok_siti_128bit',
  recipient: {
    name: 'Siti Rahma',
    nickname: 'Siti',
  },
  theme: {
    background: '#F7F3EA',
    accent: '#A8B5A0',
  },
  greeting: {
    headline: 'A letter for Siti',
    quote: 'Kindness and diligence leave the quietest yet deepest footprints.',
    message:
      'Hello, Siti! We are so grateful for your heart and hard work throughout your time at Komnasinfo.',
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Facilitator & Lead',
    salutation: 'Dear Siti,',
    paragraphs: [
      'Your thoughtful contributions and calm perspective brought balance to every team discussion.',
      'Thank you for your tireless support and dedication. You made Komnasinfo a warmer, better place.',
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: 'Bambang Wijaya',
      role: 'Head of Komnasinfo',
      avatar: null, // Null avatar to test fallback initial generation
      accent: '#29382F',
      message: 'Siti, your commitment and diligence were invaluable to the team.',
    },
    {
      sender: 'Fajar Nugraha',
      role: 'Senior Designer',
      avatar: null, // Null avatar to test fallback initial generation
      accent: '#687B61',
      message: 'Thank you for your brilliant support and warmth throughout the project!',
    },
  ],
  memories: [
    {
      src: '/see-you/assets/photos/memory-siti-1.webp',
      alt: 'Studio brainstorming session',
      caption: 'Brainstorming in the studio',
    },
  ],
  // videoNote intentionally omitted / undefined
  videoNote: undefined,
  closing: {
    headline: 'Until We Meet Again',
    message: 'Wishing you peace and success on your continued journey, Siti.',
    sender: 'Komnasinfo & Chronicle',
    period: 'Internship Period: August - December 2026',
  },
};

// ---------------------------------------------------------------------------
// 4. Dewi Ayu (Edge Case: Unicode & Emojis across all fields)
// ---------------------------------------------------------------------------

export const RECIPIENT_DEWI: RecipientData = {
  token: 'tok_dewi_128bit',
  recipient: {
    name: 'Dewi Ayu 🌸',
    nickname: 'Dewi 🌸',
  },
  theme: {
    background: '#F7F3EA',
    accent: '#D9C8A5',
  },
  greeting: {
    headline: 'A letter for Dewi Ayu 🌸',
    quote: 'Setiap jejak langkah adalah cerita yang tak terlupakan 🌿✨',
    message:
      'Halo Dewi! Terima kasih atas senyuman, semangat membara, dan energi positifmu di Komnasinfo 💖.',
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Facilitator & Lead',
    salutation: 'Dear Dewi 🌸,',
    paragraphs: [
      'Kehadiranmu selalu membawa keceriaan dan semangat baru dalam setiap diskusi tim. Terima kasih atas dedikasi dan kerja kerasmu.',
      'Semoga langkahmu ke depan semakin gemilang dan penuh berkah 🌟.',
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: 'Bambang Wijaya',
      role: 'Head of Komnasinfo',
      avatar: '/see-you/assets/photos/bambang.webp',
      accent: '#29382F',
      message: 'Dewi, semangatmu luar biasa! Sukses selalu di masa depan! ✨',
    },
    {
      sender: 'Ayu Lestari',
      role: 'Project Coordinator',
      avatar: null,
      accent: '#D9C8A5',
      message: 'Terima kasih banyak atas keceriaanmu, Dewi! Sampai jumpa lagi! 🌸',
    },
  ],
  memories: [
    {
      src: '/see-you/assets/photos/memory-dewi-1.webp',
      alt: 'Perayaan akhir magang 🎊',
      caption: 'Kenangan indah bersama tim Komnasinfo 📸',
    },
  ],
  videoNote: {
    src: '/see-you/assets/videos/farewell-dewi.mp4',
    poster: '/see-you/assets/photos/video-poster-dewi.webp',
    note: 'Pesan manis dari seluruh keluarga Komnasinfo 🎬',
  },
  closing: {
    headline: 'Sampai Bertemu Lagi 🌿',
    message: 'Terima kasih telah menjadi bagian berharga dari keluarga Komnasinfo! ✨',
    sender: 'Komnasinfo & Chronicle',
    period: 'Internship Period: August - December 2026',
  },
};

// ---------------------------------------------------------------------------
// 5. Fixtures Map and Lookup Utilities
// ---------------------------------------------------------------------------

export const VALID_RECIPIENTS: Record<string, RecipientData> = {
  [RECIPIENT_NADYA.token]: RECIPIENT_NADYA,
  [RECIPIENT_BUDI.token]: RECIPIENT_BUDI,
  [RECIPIENT_SITI.token]: RECIPIENT_SITI,
  [RECIPIENT_DEWI.token]: RECIPIENT_DEWI,
};

export const ALL_RECIPIENT_LIST: RecipientData[] = [
  RECIPIENT_NADYA,
  RECIPIENT_BUDI,
  RECIPIENT_SITI,
  RECIPIENT_DEWI,
];

// ---------------------------------------------------------------------------
// 6. Malformed, Corrupted, and Attack Tokens
// ---------------------------------------------------------------------------

export const MALFORMED_TOKENS = {
  INVALID_TOKEN_999: 'INVALID_TOKEN_999',
  XSS_SCRIPT_TAG: '<script>alert(1)</script>',
  XSS_IMG_ONERROR: '<img src=x onerror=alert(1)>',
  SQL_INJECTION: "' OR '1'='1",
  SQL_DROP_TABLE: "tok_nadya'; DROP TABLE recipients; --",
  ENCODED_TOKEN: 'tok%2B123%3D',
  MALFORMED_PERCENT_ENCODING: '%E0%A4%A',
  EMPTY_STRING: '',
  WHITESPACE_ONLY: '   \t\n  ',
  OVERSIZED_TOKEN: 'tok_' + 'a'.repeat(1024),
  PATH_TRAVERSAL: '../../../../etc/passwd',
  NULL_BYTE_INJECTION: 'tok_nadya\0_bypass',
  NUMERIC_ONLY: '1234567890',
  SPECIAL_CHARS: '!@#$%^&*()_+=~`{}[]|:;"<>,.?/',
} as const;

/**
 * Validates whether a token string adheres to expected 128-bit opaque format:
 * letters, numbers, hyphens, and underscores, between 12 and 128 characters.
 */
export function isValidTokenFormat(token: unknown): boolean {
  if (typeof token !== 'string') return false;
  if (!token) return false;
  // Whitelist pattern: alphanumeric + hyphen + underscore
  const tokenRegex = /^[a-zA-Z0-9_-]{12,128}$/;
  return tokenRegex.test(token);
}

/**
 * Deterministic mock resolver for testing.
 * Strictly verifies token validity and maps against static fixture dataset.
 */
export function mockResolveRecipient(token: string | null | undefined): RecipientData | null {
  if (!token) return null;
  if (!isValidTokenFormat(token)) return null;
  return VALID_RECIPIENTS[token] ?? null;
}
