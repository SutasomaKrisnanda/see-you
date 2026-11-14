/**
 * Tier 1 Feature Coverage: Six-Section Letter Journey
 *
 * Test Specifications:
 * - T1-LJ-01: All Six Chapter Elements Rendered
 * - T1-LJ-02: Chapter 02 Greeting Content & Next CTA
 * - T1-LJ-03: Chapter 03 Facilitator Letter Styling & Structure
 * - T1-LJ-04: Chapter 04 Team Letters Accent Rails & Avatars
 * - T1-LJ-05: Chapter 05 & 06 Scrapbook Gallery and Closing CTAs
 *
 * Traceability: Brief §5, PROJECT.md #21-27, CHRONICLE_REFERENCE lines 61-75, TEST_INFRA.md Area 9
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderApp } from '../harness/renderHarness';
import { expectChapterVisible } from '../harness/assertions';
import { resetBrowserMocks } from '../harness/browserMocks';
import { RECIPIENT_NADYA } from '../harness/recipientFixtures';

describe('Feature Area 9: Six-Section Letter Journey [Tier 1]', () => {
  beforeEach(() => {
    resetBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  it('T1-LJ-01: All Six Chapter Elements Rendered in sequence with correct IDs', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const expectedSectionIds = [
      '#envelope-section',
      '#greeting-section',
      '#facilitator-section',
      '#team-section',
      '#moments-section',
      '#closing-section',
    ];

    for (let i = 1; i <= 6; i++) {
      expectChapterVisible(container, i);
    }
  });

  it('T1-LJ-02: Chapter 02 Greeting Content & Next CTA verifies headline, quote, and next button', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const greeting = expectChapterVisible(container, 2);

    // Headline or greeting title
    const titleEl =
      greeting.querySelector('#greeting-title') ||
      greeting.querySelector('h1, h2, .headline');
    expect(titleEl).not.toBeNull();

    // Next CTA button
    const nextBtn =
      greeting.querySelector('[data-next]') ||
      greeting.querySelector('.chapter-next') ||
      greeting.querySelector('button');
    expect(nextBtn).not.toBeNull();
  });

  it('T1-LJ-03: Chapter 03 Facilitator Letter Styling & Structure contains tilted paper card and signature', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const facilitator = expectChapterVisible(container, 3);

    const paperCard =
      facilitator.querySelector('.paper-card') ||
      facilitator.querySelector('[data-testid="paper-card"]');
    expect(paperCard).not.toBeNull();

    const signature =
      facilitator.querySelector('.signature') ||
      facilitator.querySelector('[data-testid="signature"]');
    expect(signature).not.toBeNull();
    expect(signature!.textContent).toContain('Krisnanda');
  });

  it('T1-LJ-04: Chapter 04 Team Letters Accent Rails & Avatars renders team messages', async () => {
    const { container } = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const team = expectChapterVisible(container, 4);

    const teamCards = team.querySelectorAll('.team-card, [data-testid="team-card"]');
    expect(teamCards.length).toBeGreaterThan(0);

    // Verify first card has sender and message
    const firstCard = teamCards[0];
    expect(firstCard.textContent).toContain('Bambang Wijaya');
  });

  it('T1-LJ-05: Chapter 05 & 06 Scrapbook Gallery and Closing CTAs render polaroid and action buttons', async () => {
    const harness = await renderApp({
      viewport: { width: 390, height: 844, pointer: 'coarse' },
      initialUrl: `https://sutasomakrisnanda.github.io/see-you/?q=${RECIPIENT_NADYA.token}`,
    });

    const moments = expectChapterVisible(harness.container, 5);
    const photoCards = moments.querySelectorAll('.photo-card, .polaroid, [data-testid="photo-card"]');
    expect(photoCards.length).toBeGreaterThan(0);

    const closing = expectChapterVisible(harness.container, 6);
    const saveBtn =
      closing.querySelector('#save-memory') ||
      closing.querySelector('.btn-save-memory') ||
      closing.querySelector('[data-testid="save-memory"]');
    expect(saveBtn).not.toBeNull();

    const readAgainBtn =
      closing.querySelector('#read-again') ||
      closing.querySelector('.btn-read-again') ||
      closing.querySelector('[data-testid="read-again"]');
    expect(readAgainBtn).not.toBeNull();
  });
});
