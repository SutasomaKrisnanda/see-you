# E2E Test Infra: See You

## Test Philosophy
- Opaque-box, requirement-driven testing based on `ORIGINAL_REQUEST.md` and `SEE_YOU_PROJECT_BRIEF.md`.
- No reliance on internal module implementation details.
- Systematic 4-tier methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinatorial Testing + Real-World Workload Testing.

## Feature Inventory Coverage Goals
| # | Feature Area | Key Requirements | Tier 1 | Tier 2 | Tier 3 |
|---|--------------|------------------|:------:|:------:|:------:|
| 1 | Device Gating & Viewport | Desktop gate shows QR; mobile view shows letter | 5 | 5 | ✓ |
| 2 | Desktop QR URL Retention | Encodes `window.location.href` preserving `?q=<token>` | 5 | 5 | ✓ |
| 3 | Recipient Token Resolution | 128-bit opaque token lookup from static dataset | 5 | 5 | ✓ |
| 4 | Missing/Invalid Token Handling | Safe `#invalid` fallback without data exposure | 5 | 5 | ✓ |
| 5 | Envelope & Stamp Interaction | Tap seal -> flap open -> card lifts -> ivory transition | 5 | 5 | ✓ |
| 6 | Reduced Motion Accessibility | `prefers-reduced-motion` suppresses animation delay | 5 | 5 | ✓ |
| 7 | Fixed Topbar & Chapter Counter | `SEE YOU.` wordmark, `01 / 06` counter, progress bar | 5 | 5 | ✓ |
| 8 | Audio Toggle & Gesture Playback | Starts muted, toggles on gesture, fails gracefully | 5 | 5 | ✓ |
| 9 | Six-Section Letter Journey | Chapters 01 to 06 rendered in sequence with correct styling | 5 | 5 | ✓ |
| 10 | Progressive Asset Loading | No full gallery/video preload on initial load (<1MB cold) | 5 | 5 | ✓ |
| 11 | "Save This Memory" Offline Engine | Explicit asset download + active `cache.match()` verification | 5 | 5 | ✓ |
| 12 | Subpath Deployment (`/see-you/`) | All assets, routes, SW, and manifest scoped to `/see-you/` | 5 | 5 | ✓ |

## Test Architecture
- **Test Runner:** Vitest (`pnpm test` / `pnpm.cmd test:e2e`)
- **Environment:** jsdom / browser-like integration environment
- **Fixtures:** Static recipient mock database, valid/invalid query params, Cache Storage mocks
- **Pass/Fail Semantics:** Exit code 0, 100% test pass rate across all tiers

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Target Behavior |
|---|----------|--------------------|-----------------|
| 1 | Normal Recipient Mobile Journey | Token resolution, envelope open, 6-section scroll, read again | Smooth transition through all chapters to end |
| 2 | Offline Keepsake Save & Reopen | "Save this memory", cache verification, offline mode reload | Full letter and photos render offline |
| 3 | Desktop User Scans Hamper QR | Desktop gate check, dynamic QR render with `?q=`, scan simulation | Matches exact mobile entry URL |
| 4 | Corrupted or Missing URL Token | Missing `?q=`, expired token, SQLi/XSS token injection | Safe fallback screen, zero leakage |
| 5 | Reduced Motion & Throttled Connection | `prefers-reduced-motion: reduce`, 3G network simulation | Fast initial load, instant transitions |

## Coverage Thresholds
- **Tier 1 (Feature Coverage):** ≥ 60 tests (≥ 5 per feature area)
- **Tier 2 (Boundary & Corner Cases):** ≥ 60 tests (edge cases, invalid tokens, storage quotas, viewport extremes)
- **Tier 3 (Cross-Feature Combinations):** ≥ 15 pairwise interaction tests
- **Tier 4 (Real-World Application Scenarios):** ≥ 5 comprehensive end-to-end user workflows
- **Total Suite Target:** ≥ 140 automated assertions
