# Manual QA & Production Verification Checklist for See You

This document establishes the structured manual verification protocol for **See You** across mobile devices, desktop views, offline caching (PWA), and subpath GitHub Pages deployment (`/see-you/`).

---

## 1. Environment & Setup Verification
- [x] **Subpath Build Scoping**: `npm run build` succeeds cleanly, emitting assets with `/see-you/` prefix in `dist/`.
- [x] **Dev Server with Polling**: `npm run dev` starts without `EISDIR` crashes on Windows mapped drives using Vite's polling configuration.
- [x] **Unit Test Suite**: `npm test` passes 100% of tests (52/52 passing).

---

## 2. Recipient Resolution & Safe Fallback
- [ ] **Valid Token in Query String**:
  - Open URL: `https://<host>/see-you/?q=tok_nadya_128bit`
  - Expected: Displays Nadya Putri's personalized envelope cover, greeting, facilitator letter, team messages, memories, and closing.
- [ ] **Second Valid Token**:
  - Open URL: `https://<host>/see-you/?q=tok_budi_128bit`
  - Expected: Displays Budi Santoso's personalized letter experience.
- [ ] **Missing Token (?q= absent)**:
  - Open URL: `https://<host>/see-you/`
  - Expected: Displays safe fallback screen (`#fallback-section`), title indicating letter not found, and instruction to check the link.
  - Security check: No sensitive recipient data or names from other interns are leaked into DOM.
- [ ] **Corrupted / Invalid Token**:
  - Open URL: `https://<host>/see-you/?q=invalid_or_manipulated_token`
  - Expected: Safe fallback screen displayed, no envelope stamp button rendered.

---

## 3. Desktop Gating & Dynamic QR Code
- [ ] **Desktop Viewport (> 768px, fine pointer / mouse)**:
  - Expected: Displays `DesktopQRScreen` with warm paper background, mobile card frame, and high-contrast QR code.
  - Mobile story (`#story`) is excluded/hidden.
- [ ] **Exact URL Preservation in QR Code**:
  - Inspect generated QR SVG/Canvas payload: Contains the exact current page URL including query string `?q=tok_nadya_128bit`.
- [ ] **Responsive Window Resize**:
  - Resize desktop window down to mobile width (< 640px) or simulate touch emulation in Chrome DevTools:
  - Expected: Dynamically switches from QR screen to the mobile letter experience.

---

## 4. Mobile Letter Experience & Section Journey
- [ ] **Envelope & Wax Seal Tap**:
  - Stamp button (`.stamp-btn`) is focusable and has accessible label (`aria-label`).
  - Tapping seal triggers flap lift (`rotateX(180deg)`), letter emergence (`translateY(-60px)`), and debounces repeat taps.
- [ ] **Six-Section Letter Story**:
  - **Chapter 01 (Envelope)**: Warm ivory paper, recipient name cover, seal.
  - **Chapter 02 (Greeting)**: Headline, large editorial quote in Playfair Display, body message, Next CTA button.
  - **Chapter 03 (Facilitator Letter)**: Tilted warm paper card with botanical ✳ mark, salutation, body paragraphs, signature by Krisnanda.
  - **Chapter 04 (Team Messages)**: Colored vertical accent rails, avatar initials, names and heartfelt farewell messages.
  - **Chapter 05 (Scrapbook Gallery)**: Tilted polaroids with captions, lazy image loading (`loading="lazy"`), aspect ratios set to prevent CLS, optional video note.
  - **Chapter 06 (Closing)**: Farewell headline, period meta, "Save This Memory" button, "Read from Beginning" button.
- [ ] **TopBar Navigation & Chapter Counter**:
  - Wordmark `SEE YOU.` with italicized emphasis.
  - Chapter counter (`01 / 06` through `06 / 06`) updates smoothly during scrolling.
  - Progress bar track expands progressively from 16.6% to 100%.

---

## 5. Audio Playback Controls
- [ ] **Default State**: Initial load is completely silent and audio toggle indicates muted state.
- [ ] **User Gesture Play**: Tapping the topbar audio toggle starts ambient playback.
- [ ] **Second Tap Pause**: Tapping again pauses audio playback without breaking user position.
- [ ] **Autoplay Rejection**: Browser autoplay blocks fail gracefully without blocking the letter flow.

---

## 6. PWA Offline Caching & "Save This Memory"
- [ ] **Web App Manifest**: Valid `manifest.webmanifest` scoped to `/see-you/` with standalone display mode.
- [ ] **Service Worker**: `sw.js` registered under `/see-you/` scope.
- [ ] **"Save This Memory" Flow**:
  - Click "Save This Memory" button in Chapter 06.
  - Button state transitions to "Saving..." (`aria-busy="true"`).
  - Caches critical application shell and recipient-specific memory photos into `see-you-v1`.
  - Performs active HTTP 200 cache match verification before updating UI.
  - Updates to confirmed state ("Saved for Offline").
- [ ] **Offline Revisit**:
  - Disconnect network (airplane mode / DevTools Offline).
  - Refresh or reopen page: entire letter, fonts, textures, and memories render completely offline.
