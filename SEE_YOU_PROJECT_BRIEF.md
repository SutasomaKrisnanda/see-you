# SEE YOU --- Project Brief & Technical Blueprint

**Project type:** Personalized digital farewell experience\
**Audience:** Individual interns of Komnasinfo / Chronicle\
**Owner:** Krisnanda (facilitator)\
**Status:** Planning and specification; implementation has not started\
**Primary hosting target:** GitHub Pages\
**Reference source:**
`Kartu Ucapan Magang Chronicle (11_14_2026 2：55：27 PM).html`

------------------------------------------------------------------------

## 1. Project vision

**See You** is a personal digital farewell letter delivered through a
QR-code sticker attached to each intern's flower hamper. Each recipient
scans their own QR code and enters a mobile-only, interactive letter
experience.

The website should feel like opening a thoughtfully prepared physical
letter: first an envelope, then a transition into a sequence of personal
messages, shared memories, and a closing note. It should remain
accessible after the event, including offline after the recipient
explicitly saves the experience.

This is not an organizational portal or a generic greeting template. The
experience should make each recipient feel that the letter was prepared
specifically for them.

### Core experience principles

1.  Personalization is the emotional center of the project.
2.  The envelope opening is the main entrance interaction.
3.  Messages should be comfortable to read; animation must never
    obstruct reading.
4.  The initial experience must work on a weak or unstable mobile
    connection.
5.  Offline support must be real and verified, not merely a decorative
    "saved" message.
6.  Keep the application static and lightweight; a backend is not
    required for the planned feature set.

------------------------------------------------------------------------

## 2. Decisions already agreed

  -----------------------------------------------------------------------
  Area                                Decision
  ----------------------------------- -----------------------------------
  Project name                        **See You**

  Visual direction                    Follow the uploaded Chronicle HTML
                                      reference

  Offline strategy                    Hybrid: PWA + explicit "Save this
                                      memory" action

  Personalization                     Individual data and messages for
                                      every recipient

  Frontend                            React + Vite

  Hosting                             GitHub Pages

  Recipient URL                       Unique opaque token in `?q=...`

  Short URL                           s.id redirect, subject to link
                                      availability and testing

  Primary device                      Mobile

  Desktop behavior                    Show a QR code for the current URL
                                      and invite the user to scan it with
                                      a phone

  Main interaction                    Tap the Komnasinfo seal/stamp on
                                      the envelope

  Story navigation                    Vertical scroll with CSS Scroll
                                      Snap, while allowing long sections
                                      to scroll naturally

  Audio                               Optional ambient music, activated
                                      only after a user gesture

  Keepsake                            Offline website cache plus an
                                      optional downloadable copy
                                      (PDF/image)
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 3. Reference HTML reverse-engineering findings

The uploaded SingleFile capture has outer page metadata titled **"Kartu
Ucapan Magang Chronicle"**. Its embedded iframe `srcdoc` contains the
actual page implementation used for this analysis, whose document title
is **"SEE YOU --- A Little Something for You"**.

Treat the embedded page as a structural and visual reference. Do not
copy Canva wrapper code, generated class names, or unrelated Canva
framework CSS into the new application.

### 3.1 Visual system extracted from the embedded page

#### Color tokens

  Token       Hex         Intended use
  ----------- ----------- ----------------------------
  Paper       `#F7F3EA`   Main warm paper background
  Sage        `#A8B5A0`   Soft secondary accent
  Olive       `#687B61`   Accent, labels, progress
  Forest      `#29382F`   Main text and dark buttons
  Champagne   `#D9C8A5`   Small decorative highlight

Other observed colors include `#ECF0E8` (greeting section), `#F5EFE2`
(letter section), `#E8EEE5` (team section), `#F8F3E9` (memory section),
and `#DFE8DC` (closing section).

#### Typography

-   **Playfair Display:** headings, recipient name, letter salutation,
    signatures, and editorial emphasis.
-   **DM Sans:** body copy, labels, counters, and controls.

The captured page embeds a DM Sans WOFF2 font. The new app should use
optimized, licensed font files or a reliable fallback stack; do not
embed a large font payload into HTML as a base64 data URI.

#### Visual characteristics

-   Warm ivory/paper background.
-   Fine paper-grain texture overlay.
-   Botanical line-art ornaments positioned at section edges.
-   Editorial serif headings with selected italic words in olive.
-   Envelope built from layered CSS shapes.
-   Letter card with off-white paper, fine border, soft shadow, and a
    slight rotation.
-   Individual team-message cards with a narrow colored accent rail and
    circular initial avatar.
-   Memory gallery styled as slightly rotated polaroid/scrapbook cards.
-   Pill-shaped buttons with dark filled and olive outlined variants.
-   Fixed top wordmark, chapter counter, circular audio control, and
    thin top progress bar.

### 3.2 Layout and interaction characteristics observed

  -----------------------------------------------------------------------
  Element                             Reference implementation
  ----------------------------------- -----------------------------------
  Story container                     `#story`

  Story max width                     `640px`

  Inner content max width             `500px`

  Section class                       `.chapter`

  Section minimum height              At least one viewport
                                      (`100 * min(--vh, 1vh)`)

  Snap behavior                       `scroll-snap-type: y proximity`

  Section snap alignment              `scroll-snap-align: start`

  Chapter padding                     `96px 27px 60px`

  Small-screen adjustment             Horizontal padding reduced to
                                      `20px` below 370px

  Photo layout                        Two-column grid; first photo spans
                                      both columns

  Reduced motion                      `prefers-reduced-motion` disables
                                      most transitions/animations
  -----------------------------------------------------------------------

The reference uses `proximity`, not `mandatory`, which is a useful
choice for long content. Preserve that reading-friendly behavior unless
usability tests demonstrate a better alternative.

### 3.3 Reference section structure

1.  **The Envelope** --- recipient name, layered envelope, seal,
    "Someone has something to tell you", and Open your letter.
2.  **A Little Greeting** --- personal greeting and introductory
    message.
3.  **A Letter from Your Facilitator** --- a paper-style letter,
    personal message, and facilitator signature.
4.  **Letters from Komnasinfo** --- separate cards from the Head of
    Komnasinfo and individual members.
5.  **Moments We Shared** --- photo scrapbook/polaroid gallery and
    optional video note.
6.  **Until We Meet Again** --- closing message, sender identity,
    period, Read your letter again, and Save this memory.

### 3.4 Assets and performance lesson

The captured HTML is approximately **5.24 MB**. It contains three
embedded AVIF photographs with source dimensions around 4,000--6,000
pixels, plus embedded font and texture data. These are reference assets,
not recommended delivery sizes.

**Do not reproduce the reference's large inline/base64 asset
packaging.** Extract or replace assets into optimized external files.
Resize images for their actual display dimensions and use responsive
image sources where useful.

### 3.5 Important limitation of the captured reference

The embedded page contains buttons and UI for audio, navigation, opening
the letter, reading again, and saving memory. However, the captured
`srcdoc` contains no active JavaScript implementation, and no actual
audio/video element or playable media asset was found. Therefore, those
controls are visual references only; their behavior must be implemented
in See You.

The three embedded photographs are generic/example photos, not confirmed
real project documentation. Replace them with approved real memories
before release.

------------------------------------------------------------------------

## 4. Recipient journey

### Stage 1 --- Physical gift

Each intern receives a flower hamper with a small QR-code sticker. The
QR opens a unique shortened URL that redirects to the corresponding See
You recipient URL.

Suggested sticker copy: - "A little surprise awaits you." - "Scan to
open your letter." - "A little something, just for you."

### Stage 2 --- Resolve recipient

1.  Open the See You URL.
2.  Read the `q` query parameter.
3.  Validate token format and find the corresponding recipient record.
4.  Load the recipient's content and critical assets.
5.  If the token is invalid or missing, show a graceful generic/invalid
    page without exposing another recipient's data.

### Stage 3 --- Envelope screen

Show: - Personalized background or visual variation. - "A letter for
\[recipient name\]". - Layered envelope. - Komnasinfo logo/stamp. - Soft
lighting and restrained ambient effects. - "Someone has something to
tell you." - Music toggle in a muted-by-default state. - Clear tap
target on the stamp/open action.

The stamp is the main interaction target. Prevent repeated taps while
the opening transition is running.

### Stage 4 --- Opening transition

Proposed sequence: 1. User taps the stamp. 2. Stamp responds with a
pressed/seal animation. 3. Envelope flap opens. 4. Letter rises or moves
toward the viewer. 5. Transition expands/fades into the chosen
white/ivory transition color. 6. The letter experience is revealed. 7.
Section entrance animations run in sequence. 8. User interaction and
scrolling become available.

Keep the transition brief and performant. Use CSS transforms/opacity for
the primary motion. Do not require a large video for this transition.

### Stage 5 --- Letter experience

The six sections appear in the order defined below. A small persistent
progress indicator may remain, provided it does not obscure content.

### Stage 6 --- Save memory

At the end, the recipient can choose **Save this memory**. The app
checks and downloads all required offline assets, verifies that they are
available locally, then confirms success. Offer a separate optional
downloadable keepsake if feasible.

------------------------------------------------------------------------

## 5. Page information architecture

### Section 01 --- The Envelope

Purpose: create anticipation and invite the recipient into the
experience.

Content: - Recipient name/nickname. - Envelope illustration. -
Komnasinfo seal/stamp. - Main invitation headline. - One short
supporting line. - Open action. - Ambient music control.

### Section 02 --- A Little Greeting

Purpose: welcome the recipient and frame the farewell.

Content: - "Hello, \[nickname\]!" - A short personal greeting. - One or
two short paragraphs. - A gentle transition cue to the next section.

### Section 03 --- A Letter from Your Facilitator

Purpose: the most personal message, written by Krisnanda as facilitator.

Content: - Personal salutation. - Individual letter body. - Personal
observations, growth, and appreciation. - Warm wishes for the
recipient's next chapter. - Facilitator signature.

This section must support long-form copy and must not force the entire
letter into a fixed-height viewport.

### Section 04 --- Letters from Komnasinfo

Purpose: let the Head of Komnasinfo and each participating Komnasinfo
member speak individually.

Content per sender: - Sender name. - Role/relationship. - Optional
avatar/photo. - Individual message. - Optional sender-specific accent
color or small visual signature.

Messages should be separate cards, not merged into one paragraph. Order:
Head of Komnasinfo first, then members in the agreed sequence.

### Section 05 --- Moments We Shared

Purpose: preserve shared memories.

Content: - Photo scrapbook/polaroid gallery. - Short captions. -
Optional video compilation, only if it adds meaningful value and can be
loaded on demand.

Use optimized responsive images. Do not preload all gallery media on
initial page load.

### Section 06 --- Until We Meet Again

Purpose: close the story with warmth and give the recipient a way to
preserve it.

Content: - Final farewell message. - Sender identity. - Internship
period/date, once confirmed. - Read your letter again action. - Save
this memory action. - Optional downloadable keepsake.

------------------------------------------------------------------------

## 6. Proposed application architecture

``` text
SEE YOU
├── app/
│   ├── bootstrap/
│   │   ├── resolveRecipient
│   │   ├── detectDevice
│   │   └── initializePWA
│   ├── components/
│   │   ├── AppHeader
│   │   ├── ProgressIndicator
│   │   ├── MusicControl
│   │   ├── Envelope
│   │   ├── KomnasinfoStamp
│   │   ├── OpeningTransition
│   │   ├── LetterCard
│   │   ├── SenderMessageCard
│   │   ├── MemoryGallery
│   │   ├── SaveMemoryControl
│   │   └── DesktopQRScreen
│   ├── sections/
│   │   ├── EnvelopeSection
│   │   ├── GreetingSection
│   │   ├── FacilitatorLetterSection
│   │   ├── TeamLettersSection
│   │   ├── MemoriesSection
│   │   └── ClosingSection
│   ├── services/
│   │   ├── recipientService
│   │   ├── assetService
│   │   ├── audioService
│   │   ├── offlineService
│   │   └── keepsakeService
│   └── data/
│       └── recipients
├── public/
│   ├── assets/
│   │   ├── envelope/
│   │   ├── botanical/
│   │   ├── photos/
│   │   ├── audio/
│   │   └── fonts/
│   ├── icons/
│   └── manifest.webmanifest
├── service-worker
└── project documentation
```

This is a suggested logical structure, not a requirement to create every
file immediately. Keep components cohesive and avoid unnecessary
abstraction.

### Recommended technical choices

  -----------------------------------------------------------------------
  Concern                             Recommendation
  ----------------------------------- -----------------------------------
  UI                                  React

  Build                               Vite

  Styling                             CSS modules or organized
                                      global/component CSS; Tailwind is
                                      optional

  Motion                              CSS transitions/animations first;
                                      Motion library only if complexity
                                      justifies it

  Scroll detection                    Intersection Observer

  Audio                               HTMLAudioElement / Audio API

  Recipient data                      Static JSON or generated static
                                      data module

  Offline                             Service Worker + Cache Storage

  PWA                                 Web App Manifest + Service Worker

  Image formats                       AVIF/WebP with fallbacks where
                                      needed

  Hosting                             GitHub Pages
  -----------------------------------------------------------------------

No Laravel, database, or backend API is needed for the planned static
experience.

------------------------------------------------------------------------

## 7. Recipient identity and data model

### 7.1 Use an opaque random token, not reversible encryption

The `q` value should be a cryptographically random, opaque token with at
least 128 bits of entropy. It is an identifier/lookup key, not a
password and not an encryption scheme.

Example URL shape:

``` text
https://sutasomakrisnanda.github.io/see-you/?q=<opaque-token>
```

The short s.id URL may redirect to this destination. Keep a private
mapping list for QR generation and test every redirect before printing.

Because GitHub Pages serves static files, recipient data included in the
deployment is publicly inspectable by technically capable visitors. The
token does not make static JSON confidential. Do not place sensitive or
confidential information in recipient records. The token merely makes
URLs hard to guess casually.

### 7.2 Data model proposal

``` json
{
  "token": "REPLACE_WITH_RANDOM_TOKEN",
  "recipient": {
    "name": "Recipient Full Name",
    "nickname": "Preferred Name"
  },
  "theme": {
    "background": "default",
    "accent": "#A8B5A0"
  },
  "greeting": {
    "headline": "Someone has something to tell you.",
    "message": "Personal opening message."
  },
  "facilitatorLetter": {
    "sender": "Krisnanda",
    "role": "Your Facilitator",
    "salutation": "Dear [nickname],",
    "paragraphs": [
      "Personal paragraph one.",
      "Personal paragraph two."
    ],
    "signature": "Krisnanda"
  },
  "teamLetters": [
    {
      "sender": "Name",
      "role": "Head of Komnasinfo",
      "avatar": "/assets/avatars/head.webp",
      "accent": "#A8B5A0",
      "message": "Individual message."
    },
    {
      "sender": "Name",
      "role": "Komnasinfo",
      "avatar": null,
      "accent": "#D9C8A5",
      "message": "Individual message."
    }
  ],
  "memories": [
    {
      "src": "/assets/photos/memory-01.webp",
      "alt": "Accessible description of the moment.",
      "caption": "Short memory caption."
    }
  ],
  "closing": {
    "message": "Until we meet again.",
    "sender": "Komnasinfo",
    "period": "Internship period"
  }
}
```

The final schema can be refined during implementation. Keep content
separate from presentation. All recipient-specific messages must be
authored/approved before deployment.

### 7.3 Token lookup strategy

Recommended flow: 1. Read `q` from `URLSearchParams`. 2. Validate
allowed token characters and expected length. 3. Resolve token against a
recipient index. 4. Load only the corresponding recipient data. 5.
Render a safe fallback if no match exists.

Do not attempt to "decrypt" the token. Do not put personal names or
sequential IDs in the URL.

------------------------------------------------------------------------

## 8. Mobile-only and desktop QR behavior

### Mobile

The primary experience is designed for phone screens and touch
interaction. Use `100dvh` with a sensible fallback, safe-area insets,
and responsive typography. Avoid assuming every phone has the same
viewport height.

### Desktop

When the viewport is clearly desktop-sized, show a deliberate QR landing
screen rather than the letter itself: - See You wordmark. - Short
explanation: "This letter is meant to be opened on your phone." - QR
code encoding the exact current URL, including `q`. - Instruction to
scan with a phone camera.

Generate the QR from `window.location.href` or an equivalent canonical
current URL. Never use a generic URL that drops the recipient token.

Device classification should not rely solely on user-agent strings. Use
viewport and input capabilities as pragmatic signals, with a clear
fallback for tablets and resized browser windows. The desktop QR screen
is a product choice, not a security boundary.

------------------------------------------------------------------------

## 9. Animation and scroll behavior

### 9.1 Envelope opening

The stamp/seal is the primary action. On activation: - Disable duplicate
activation. - Animate seal press/response. - Animate envelope flap and
letter movement. - Fade/expand into the transition color. - Reveal the
story. - Enable scroll and other interactions.

Prefer transforms and opacity because they are generally cheaper to
animate than layout-affecting properties.

### 9.2 Section reveals

Use Intersection Observer or an equivalent visibility mechanism to
trigger each section's entrance once or according to a deliberate replay
rule.

Possible effects: - Fade and slight upward movement for text. - Gentle
paper/card reveal. - Small stagger between heading, body, and
signature. - Polaroid/photo reveal in the memory gallery. - Restrained
botanical ambient movement.

Avoid animating every text character by default. The content must remain
readable and accessible.

### 9.3 Snap scrolling

Use `scroll-snap-type: y proximity` as the starting point, inspired by
the reference. Use `scroll-snap-align: start` on sections.

Important: - Do not force long letters into exactly one viewport. - Let
sections grow naturally when content is longer. - Test small phones and
large text settings. - Avoid scroll locking that prevents natural
reading. - Respect `prefers-reduced-motion`.

### 9.4 Audio

-   Start muted.
-   Only start playback after explicit user interaction.
-   Provide a clear mute/unmute control.
-   Do not block the letter experience if audio fails or is unavailable.
-   Do not preload a large audio file during initial load unless it is
    essential.

------------------------------------------------------------------------

## 10. Performance and asset-loading strategy

Do not hold the whole website behind a loader that waits for every
photo/video. Use progressive loading.

### Priority 1 --- Critical path

Load first: - HTML entry and CSS. - Application JavaScript. - Small font
subset/required font weights. - Recipient data. - Envelope artwork and
critical background. - Minimal icons.

### Priority 2 --- Near-term experience

Load next: - Greeting section assets. - Facilitator letter decoration. -
First relevant memory image if it is likely to be seen soon.

### Priority 3 --- Deferred content

Load lazily: - Remaining team-card avatars. - Gallery photographs below
the fold. - Optional video. - Nonessential decorative assets.

### Asset rules

1.  Resize images to actual display requirements; do not ship original
    camera-resolution files.
2.  Prefer AVIF or WebP for photography.
3.  Use SVG for simple botanical line art and logos when suitable.
4.  Use CSS for the envelope and simple effects.
5.  Avoid large base64 images/fonts in HTML/CSS.
6.  Lazy-load below-the-fold photographs.
7.  Use `srcset`/`sizes` where multiple image sizes are worthwhile.
8.  Video should not autoplay or preload the full file; show a poster
    and load on user intent or near-viewport.
9.  Avoid adding a heavy animation library if CSS is enough.
10. Provide image dimensions/aspect ratios to reduce layout shift.

### Initial performance goals

Treat these as targets to measure, not guarantees: - Initial transfer
target: preferably under 500 KB--1 MB on a cold load, depending on
required critical artwork and fonts. - First meaningful envelope view
should appear without waiting for gallery assets. - Avoid long
main-thread work. - Keep the initial JavaScript bundle small. - Test on
throttled mobile network and a mid-range phone.

------------------------------------------------------------------------

## 11. Hybrid PWA + Save This Memory

### 11.1 PWA baseline

Implement: - Web App Manifest. - Service Worker. - Versioned cache
names. - App-shell caching. - Safe runtime caching for recipient data
and local assets. - Offline fallback. - Cache update and old-cache
cleanup.

### 11.2 Explicit Save This Memory action

The button should perform a real operation: 1. Determine the current
recipient's required offline asset list. 2. Check which assets are
already cached. 3. Download missing required assets. 4. Cache the app
shell, recipient content, personal images, required fonts, and optional
audio if the user chooses to include it. 5. Verify cache entries and
response status. 6. Show progress based on actual completed work. 7.
Confirm "Saved for offline" only after verification succeeds. 8. Show a
useful failure/retry state if storage is unavailable or quota is
exceeded.

Do not claim all content is offline-ready merely because the service
worker is installed.

### 11.3 Downloadable keepsake

Separate from PWA caching, offer an optional static keepsake: - PDF of
the recipient's letter and selected photos, or - Long image/card export
if it remains legible.

The PDF/image export is an additional archive, not a substitute for
offline PWA functionality. If PDF generation is too expensive or complex
for the first release, defer it without blocking PWA delivery.

### 11.4 Offline limitations to explain

-   The first visit still needs a network connection unless assets were
    preloaded by another mechanism.
-   Offline availability begins only after required assets have been
    cached successfully.
-   Browser storage may be cleared by the user or browser under storage
    pressure.
-   A PWA cache is not an everlasting backup; downloadable keepsake
    provides a second preservation option.

------------------------------------------------------------------------

## 12. Suggested state model

``` text
BOOT
  -> DEVICE_CHECK
      -> DESKTOP_QR
      -> RECIPIENT_RESOLUTION
          -> INVALID_RECIPIENT
          -> PRELOAD_CRITICAL
              -> ENVELOPE_READY
                  -> OPENING
                      -> STORY_READY
                          -> READING
                              -> CLOSING
                                  -> SAVE_MEMORY
                                      -> SAVING
                                          -> SAVED_OFFLINE
                                          -> SAVE_FAILED
```

Important states: - `isResolvingRecipient` - `recipient` -
`isPreloadingCriticalAssets` - `isEnvelopeReady` - `isOpening` -
`isStoryVisible` - `activeSection` - `isAudioEnabled` - `saveProgress` -
`offlineSaveStatus`

Keep the state model explicit. Prevent the opening animation from firing
more than once at the same time.

------------------------------------------------------------------------

## 13. Accessibility, resilience, and error handling

-   Use semantic sections/headings and meaningful button labels.
-   Ensure keyboard activation works for buttons, including the stamp.
-   Provide visible focus states.
-   Provide useful alt text for meaningful photographs.
-   Mark purely decorative SVGs as hidden from assistive technology.
-   Maintain sufficient text contrast.
-   Respect reduced-motion preferences.
-   Ensure the story remains readable when animation fails.
-   Ensure audio is optional.
-   Handle invalid/missing token, missing image, failed audio, offline
    network, storage quota, and service-worker update failures
    gracefully.
-   Avoid exposing another recipient's content when token resolution
    fails.

------------------------------------------------------------------------

## 14. GitHub Pages deployment considerations

The intended project URL is under the repository subpath:

``` text
https://sutasomakrisnanda.github.io/see-you/
```

Configure Vite's `base` path for `/see-you/` if the repository is
deployed as a project site. Verify asset URLs, manifest paths, icons,
and service-worker scope after deployment.

The query parameter should be preserved:

``` text
https://sutasomakrisnanda.github.io/see-you/?q=<opaque-token>
```

Do not accidentally discard `q` when generating desktop QR codes,
redirecting from s.id, refreshing the page, or building offline links.

GitHub Pages is static hosting. Do not assume server-side routing,
secret storage, private JSON, or API endpoints. Keep the solution
compatible with static hosting.

------------------------------------------------------------------------

## 15. Testing and acceptance criteria

### Recipient and routing

-   Valid token loads the correct recipient.
-   Missing/invalid token displays a safe fallback.
-   Each QR and s.id redirect resolves to the intended recipient URL.
-   Refreshing the page preserves the recipient.
-   Desktop QR encodes the full current URL and token.

### Experience

-   Envelope is visible and usable on common mobile widths.
-   Stamp opens the envelope exactly once per interaction.
-   Transition does not flash or expose an unstyled page.
-   Sections appear in the intended order.
-   Long letters remain readable and scrollable.
-   Read your letter again returns to the intended beginning.
-   Progress indicator reflects the active section.
-   Audio is muted initially and can be enabled/disabled.

### Offline

-   First online visit installs/registers the service worker correctly.
-   Save This Memory caches all required recipient-specific assets.
-   Saved content opens after closing/reopening the browser while
    offline.
-   No uncached image/font/audio is required for the saved experience.
-   Failed saves show an error and allow retry.
-   Version updates do not leave stale or mixed recipient data.

### Performance and accessibility

-   Test cold load on throttled network.
-   Gallery assets do not block the envelope.
-   Images do not cause significant layout shift.
-   Reduced-motion mode remains usable.
-   Touch targets are comfortable.
-   Test at least one iPhone Safari and one Android Chrome device if
    available.

### Release

-   All placeholder names/messages/photos are replaced.
-   All personal messages are approved.
-   Every QR is scanned and checked before printing.
-   Short links are verified.
-   Offline save is tested on the actual target devices.

------------------------------------------------------------------------

## 16. Project phases

### Phase 1 --- Content and design lock

-   Confirm recipients and preferred names.
-   Collect facilitator letters and every sender's individual message.
-   Select and approve photos.
-   Confirm internship period and sender signatures.
-   Finalize visual details against the reference.

### Phase 2 --- Functional core

-   Build recipient resolver.
-   Build envelope screen and stamp interaction.
-   Build opening transition.
-   Build all six sections.
-   Add snap behavior and section progress.

### Phase 3 --- Personalization

-   Finalize data schema.
-   Add individual recipient records.
-   Add recipient-specific backgrounds/accents where appropriate.
-   Generate token-to-URL and QR mapping.

### Phase 4 --- Offline and optimization

-   Implement PWA.
-   Implement Save This Memory.
-   Add verification and retry states.
-   Optimize photos/fonts/audio.
-   Test throttled connections and offline revisit.

### Phase 5 --- QA and deployment

-   Test all recipients and links.
-   Test mobile-only and desktop QR behavior.
-   Test browser/device compatibility.
-   Deploy to GitHub Pages.
-   Print and scan QR stickers.
-   Perform final gift handoff checks.

------------------------------------------------------------------------

## 17. Initial instruction prompt for Antigravity

Use the following as the first project instruction. Attach the original
Chronicle HTML reference and this project brief to the Antigravity
workspace.

> You are the lead frontend engineer for **See You**, a personalized
> mobile-only digital farewell-letter experience. First read the
> complete `SEE_YOU_PROJECT_BRIEF.md` and inspect the attached Chronicle
> SingleFile HTML reference, especially the embedded iframe `srcdoc`
> containing the six-section See You layout. Treat the reference as a
> visual and structural guide, not code to copy verbatim.
>
> Before changing files, inspect the existing repository, package
> manager, Vite configuration, GitHub Pages deployment setup, and
> current project conventions. Do not overwrite or remove existing work
> without explaining why.
>
> Build the project in deliberate phases. Start by reporting the
> existing repository structure and proposing an implementation plan
> that maps to this brief. Do not begin a large implementation until the
> plan and any important assumptions are clear.
>
> Preserve the approved visual language: warm paper/ivory, sage, olive,
> forest, champagne accents; Playfair Display + DM Sans; botanical line
> art; layered CSS envelope; paper letter card; individual sender cards;
> scrapbook memory gallery; fixed wordmark/counter/audio
> control/progress indicator.
>
> Implement the application for GitHub Pages under `/see-you/`. Resolve
> the recipient using an opaque random token in the `q` query parameter.
> Use static recipient data; do not add a backend unless a genuine
> requirement emerges. Never treat the token as encryption or as a way
> to keep deployed static data secret.
>
> The main journey is: device check -\> recipient resolution -\>
> critical asset loading -\> envelope -\> stamp interaction -\> envelope
> opening -\> white/ivory transition -\> six-section letter story -\>
> closing -\> Save This Memory. On desktop, show a QR code generated
> from the exact current URL, including its recipient query parameter.
>
> Prioritize mobile usability, reading comfort, progressive asset
> loading, CSS-based motion, reduced-motion support, and real offline
> verification. Implement the PWA and explicit Save This Memory flow so
> that success is shown only after required recipient assets are cached
> and verified. Do not preload the entire gallery or full video on
> initial load.
>
> Keep components, content data, asset management, audio, recipient
> resolution, and offline caching separated. Add tests or a documented
> manual QA checklist for valid/invalid tokens, QR URLs, opening
> animation, scroll behavior, audio, PWA cache, offline revisit, and
> GitHub Pages subpath deployment.
>
> At the end of each phase, summarize changed files, tests run, known
> limitations, and the next phase. Do not claim a feature works unless
> it has been implemented and tested.

------------------------------------------------------------------------

## 18. Open decisions --- do not invent these

These details still need to be supplied by the project owner: - Final
recipient list and preferred names. - Exact number and order of
individual senders. - Final personal letter text for each recipient. -
Approved photos and captions. - Whether a video compilation will
exist. - Ambient music file and usage rights. - Internship period/date
shown in the footer. - Whether the keepsake export is PDF, image, or
both. - Final logo/stamp artwork and any recipient-specific backgrounds.

**Do not fill these with fabricated names, messages, photographs, dates,
or signatures. Use clearly marked placeholders until the owner provides
the final content.**
