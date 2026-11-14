# Project: See You — Digital Farewell Letter Experience

## Architecture
See You is a mobile-first, personalized digital farewell-letter experience for interns of Komnasinfo / Chronicle, deployed to GitHub Pages under `/see-you/`.
- **Framework & Bundler:** React 18/19 + Vite + TypeScript
- **Package Manager:** `pnpm.cmd` (v12.4.1) using `.cmd` extensions in Windows PowerShell
- **Styling & Design System:** Tailwind CSS / CSS variables with approved palette (`--paper: #F7F3EA`, `--sage: #A8B5A0`, `--olive: #687B61`, `--forest: #29382F`, `--champagne: #D9C8A5`), botanical SVGs (`flower-a`, `flower-b`), and custom typography (`Playfair Display` + `DM Sans`)
- **State & Routing:** Single-page scroll-snap story (`#story`, max 640px, `scroll-snap-type: y proximity`) with client-side recipient resolution via `?q=` opaque 128-bit token
- **Device Gating:** Desktop gate screen rendering a dynamic QR code (`qrcode.react`) of current URL (`window.location.href` preserving `?q=...`)
- **Keepsake & Offline:** PWA Service Worker + Web App Manifest + two-phase active Cache Storage verification for "Save This Memory"
- **Audio:** User-gesture ambient music manager with mute/unmute toggle in fixed header
- **Testing:** Automated Vitest unit and component tests with `@testing-library/react` and `jsdom`

## Code Layout
```text
see-you/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deploy to GitHub Pages
├── public/
│   ├── favicon.ico
│   ├── manifest.webmanifest        # PWA Web App Manifest
│   ├── sw.js                       # Service Worker for offline caching
│   └── assets/
│       ├── botanical/              # flower-a.svg, flower-b.svg
│       ├── textures/               # paper-grain texture
│       ├── photos/                 # sample memory photos (WebP/AVIF <80KB)
│       ├── fonts/                  # DM Sans & Playfair Display WOFF2
│       └── audio/                  # ambient loop audio
├── src/
│   ├── main.tsx                    # React entry point
│   ├── App.tsx                     # Top-level state machine & layout
│   ├── index.css                   # Design tokens, typography, scroll-snap
│   ├── data/
│   │   ├── recipients.ts           # Type-safe static recipient dataset
│   │   ├── defaultContent.ts       # Fallback text, copy & placeholders
│   │   └── types.ts                # TypeScript interfaces
│   ├── services/
│   │   ├── recipientResolver.ts    # Parse & validate ?q= token
│   │   ├── deviceDetector.ts       # Viewport & pointer capability check
│   │   ├── audioService.ts         # User-gesture ambient audio player
│   │   └── offlineService.ts       # Cache Storage download & verification
│   ├── components/
│   │   ├── common/
│   │   │   ├── TopBar.tsx          # Wordmark, chapter counter, audio toggle
│   │   │   ├── ProgressBar.tsx     # 3px top reading progress fill
│   │   │   ├── TextureOverlay.tsx  # Paper grain overlay
│   │   │   └── BotanicalFlower.tsx # Inline botanical line art
│   │   ├── desktop/
│   │   │   └── DesktopQRScreen.tsx # Desktop gate with live QR code
│   │   ├── envelope/
│   │   │   ├── Envelope.tsx        # Layered CSS envelope with flap & pocket
│   │   │   └── StampButton.tsx     # Komnasinfo wax seal (✳)
│   │   ├── story/
│   │   │   ├── PaperCard.tsx       # Facilitator letter card (-1deg tilt)
│   │   │   ├── TeamCard.tsx        # Member card with accent rail
│   │   │   ├── MemoryGallery.tsx   # Polaroid photo stack & video slot
│   │   │   └── SaveMemoryButton.tsx# Offline cache button with status hint
│   │   └── fallback/
│   │       └── FallbackSection.tsx # Invalid or missing token view
│   ├── sections/
│   │   ├── EnvelopeSection.tsx     # Chapter 01: The Envelope
│   │   ├── GreetingSection.tsx     # Chapter 02: A Little Greeting
│   │   ├── FacilitatorSection.tsx  # Chapter 03: Facilitator Letter
│   │   ├── TeamSection.tsx         # Chapter 04: Letters from Komnasinfo
│   │   ├── MomentsSection.tsx      # Chapter 05: Moments We Shared
│   │   └── ClosingSection.tsx      # Chapter 06: Until We Meet Again
│   └── test/                       # Automated Vitest unit & component tests
├── index.html                      # HTML template with mobile viewport
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts                  # base: '/see-you/', plugins, vitest config
└── PROJECT.md
```

## Feature Inventory
Every feature assigned to a milestone (none unassigned).

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Scaffolding & Config | Vite + React + TypeScript setup with `base: '/see-you/'` | M1 | Survey & Brief §14 |
| 2 | Testing Setup | Vitest + React Testing Library + jsdom configuration | M1 | ORIGINAL_REQUEST R4 |
| 3 | Design Tokens & Global CSS | CSS variables for palette (`--paper`, `--sage`, `--olive`, `--forest`, `--champagne`) | M1 | CHRONICLE_REFERENCE line 24 |
| 4 | Typography Delivery | WOFF2 font loading (`Playfair Display` + `DM Sans`) with `font-display: swap` | M1 | CHRONICLE_REFERENCE & Brief §10 |
| 5 | Botanical Asset Extraction | Vector SVG line art (`flower-a`, `flower-b`) and `✳` seal mark | M1 | CHRONICLE_REFERENCE lines 42-43 |
| 6 | Texture Overlay | Paper grain texture overlay (`.texture`) | M1 | CHRONICLE_REFERENCE line 89 |
| 7 | GitHub Actions CI/CD | GitHub Pages deployment workflow targeting `/see-you/` | M1 | ORIGINAL_REQUEST R1, R4 |
| 8 | Static Recipient Data Model | TypeScript interfaces & dataset for recipients with 128-bit tokens | M2 | Brief §7.2, §18 |
| 9 | Token Ingestion & Validation | Extract `q` query param, validate format, lookup in static index | M2 | Brief §7.1 |
| 10 | Invalid/Missing Token Fallback | Safe `#invalid` fallback screen without leaking other records | M2 | Brief §7.3 |
| 11 | Device Gating Check | Detection of mobile vs desktop/fine-pointer viewports | M2 | Brief §8 |
| 12 | Desktop QR Screen | Dynamic QR generator preserving exact URL and `?q=<token>` | M2 | Brief §8 |
| 13 | Layered CSS Envelope | Pure CSS envelope with back, letter insert, front pocket, and flap | M3 | CHRONICLE_REFERENCE lines 35-45 |
| 14 | Stamp / Seal Interaction | Interactive wax seal (`✳`) initiating opening choreography | M3 | Brief §9.1 |
| 15 | Opening Animation Choreography | Seal press -> flap folds back -> letter lifts -> ivory transition | M3 | Brief §9.1 |
| 16 | Reduced Motion Compliance | Immediate transitions under `prefers-reduced-motion: reduce` | M3 | Brief §9.3 |
| 17 | Fixed Brand Wordmark | Header `SEE YOU.` with olive italic `YOU.` | M3 | CHRONICLE_REFERENCE line 13 |
| 18 | Dynamic Chapter Counter | Header text counter updating `01 / 06` based on visible chapter | M3 | CHRONICLE_REFERENCE line 18 |
| 19 | Reading Progress Bar | 3px top progress bar fill transitioning from 16.6% to 100% | M3 | CHRONICLE_REFERENCE line 10 |
| 20 | Ambient Audio Manager | User-gesture triggered ambient audio with toggle icon button | M3 | Brief §9.4 |
| 21 | Chapter 01: The Envelope | Cover recipient name, invitation headline, and "Open your letter" CTA | M4 | Brief §5 |
| 22 | Chapter 02: A Little Greeting | Warm opening quote, botanical ornament `flower-b`, and next CTA | M4 | Brief §5 |
| 23 | Chapter 03: Facilitator Letter | Paper card rotated -1deg, champagne `✳` badge, salutation, signature | M4 | Brief §5 |
| 24 | Chapter 04: Letters from Komnasinfo | Sender cards with 4px colored accent rails, initial avatars, and notes | M4 | Brief §5 |
| 25 | Chapter 05: Moments We Shared | 2-column polaroid scrapbook grid with alternating tilts and captions | M4 | Brief §5 |
| 26 | Chapter 05: Video Slot | Optional dashed media slot with video poster and note | M4 | Brief §10 |
| 27 | Chapter 06: Until We Meet Again | Closing message, internship period meta, "Read again" & "Save" CTAs | M4 | Brief §5 |
| 28 | Progressive Photo Loading | Lazy loading (`loading="lazy"`) and aspect-ratio reservation | M4 | Brief §10 |
| 29 | Small Screen Layout Clamp | Padding and photo size reduction for viewports < 370px | M4 | CHRONICLE_REFERENCE line 94 |
| 30 | Web App Manifest | Standalone PWA manifest scoped to `/see-you/` | M5 | Brief §11.1 |
| 31 | Service Worker Offline Caching | SW caching app shell, fonts, SVGs, and data for `/see-you/` | M5 | Brief §11.1 |
| 32 | "Save This Memory" Engine | Explicit asset download into Cache Storage (`see-you-v1`) | M5 | Brief §11.2 |
| 33 | Active Offline Verification | Read verification via `cache.match()` ensuring HTTP 200 before success | M5 | Brief §11.2 |
| 34 | Offline Revisit Capability | Full experience loads and displays cleanly without internet connection | M5 | Brief §11.2 |
| 35 | Downloadable Keepsake Print CSS | Print-friendly layout for saving as clean PDF | M5 | Brief §11.3 |
| 36 | 100% E2E Test Suite Pass | Pass all E2E test cases across Tiers 1-4 | M6 | ORIGINAL_REQUEST R4 |
| 37 | Adversarial Hardening | Tier 5 adversarial stress testing and coverage validation | M6 | Project Pattern §Dual Track |

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Scaffolding & Foundations | Vite + React + TS setup, Vitest config, design tokens, asset extraction, CI/CD | none | DONE |
| M2 | Recipient Resolution & Desktop QR | Data schema, `recipientResolver`, fallback screen, `DesktopQRScreen`, QR URL retention | M1 | PLANNED |
| M3 | Envelope & Navigation Chrome | CSS envelope, seal interaction, opening animation, `TopBar`, audio toggle, progress | M1, M2 | PLANNED |
| M4 | Six-Section Letter Journey | Chapters 01–06, paper card, team cards, polaroid scrapbook, smooth navigation | M2, M3 | PLANNED |
| M5 | PWA & Verified Offline Keepsake | Manifest, Service Worker, "Save This Memory" engine, active Cache Storage verification | M1, M4 | PLANNED |
| M6 | Final Verification & Hardening | Pass 100% of E2E tests (Tiers 1-4), Tier 5 adversarial hardening | M1–M5, TEST_READY.md | PLANNED |

## Interface Contracts

### Recipient Resolution Contract (`src/services/recipientResolver.ts`)
```typescript
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
  theme: { background: string; accent: string; };
  greeting: { headline: string; quote: string; message: string; };
  facilitatorLetter: FacilitatorLetter;
  teamLetters: TeamMemberMessage[];
  memories: MemoryPhoto[];
  videoNote?: { src?: string; poster?: string; note: string; };
  closing: { headline: string; message: string; sender: string; period: string; };
}

export function resolveRecipient(searchQuery: string): RecipientData | null;
```

### Device Detector Contract (`src/services/deviceDetector.ts`)
```typescript
export interface DeviceState {
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

export function detectDevice(): DeviceState;
export function subscribeDeviceChanges(callback: (state: DeviceState) => void): () => void;
```

### Audio Service Contract (`src/services/audioService.ts`)
```typescript
export interface AudioService {
  toggle(): Promise<boolean>;
  isPlaying(): boolean;
  setMuted(muted: boolean): void;
  subscribe(callback: (playing: boolean) => void): () => void;
}
```

### Offline Service Contract (`src/services/offlineService.ts`)
```typescript
export interface OfflineSaveProgress {
  status: 'idle' | 'saving' | 'verifying' | 'saved' | 'error';
  progress: number; // 0 - 100
  errorMessage?: string;
}

export function saveMemoryForOffline(
  recipient: RecipientData,
  onProgress?: (progress: OfflineSaveProgress) => void
): Promise<boolean>;

export function verifyOfflineReadiness(recipient: RecipientData): Promise<boolean>;
```
