import { useState, useEffect } from 'react';
import logoKomnasUrl from '@/assets/icons/Logo Komnas.svg';
import buketCarnation from '@/assets/images/buket carnation.webp';
import buketMatahari from '@/assets/images/buket matahari.webp';

import type { FlowerType } from '@/data/types';

interface EnvelopeProps {
  recipientName: string;
  isOpened: boolean;
  onOpen: () => void;
  flower?: FlowerType | FlowerType[];
}

export default function Envelope({ recipientName, isOpened, onOpen, flower }: EnvelopeProps) {
  const flowers = Array.isArray(flower) ? flower : flower ? [flower] : [];
  const hasCarnation = flowers.includes('carnation');
  const hasMatahari = flowers.includes('matahari');

  const [openingPhase, setOpeningPhase] = useState<
    'idle' | 'opening' | 'expanding' | 'fading' | 'done'
  >(isOpened ? 'done' : 'idle');

  // When reset from parent (e.g. "Baca dari Awal"), return to locked idle state
  useEffect(() => {
    if (!isOpened) {
      setOpeningPhase('idle');
    }
  }, [isOpened]);

  const handleTriggerOpen = () => {
    if (openingPhase !== 'idle') return;
    setOpeningPhase('opening');

    // Phase 1: Flap flips open & letter rises up gently (500ms)
    setTimeout(() => {
      // Phase 2: Letter card expands to full viewport with "See You".
      // Simultaneously unmount/remove all envelope elements and unlock story view
      setOpeningPhase('expanding');
      onOpen();
    }, 500);

    // Phase 3: Display "See You" for exactly 1 second (500ms + 1000ms = 1500ms)
    setTimeout(() => {
      setOpeningPhase('fading');
    }, 1500);

    // Phase 4: Complete transition after veil fades out (1500ms + 700ms = 2200ms)
    setTimeout(() => {
      setOpeningPhase('done');
    }, 2200);
  };

  // If already opened and dismissed, do not render to avoid interfering with scrolling
  if (openingPhase === 'done' && isOpened) {
    return null;
  }

  // When "See You" veil appears, all previous envelope elements are immediately removed
  const showEnvelopeElements = openingPhase === 'idle' || openingPhase === 'opening';

  return (
    <section
      id="envelope-section"
      data-testid="envelope-section"
      className={`opener-layer ${openingPhase !== 'idle' ? `is-${openingPhase}` : 'is-idle'}`}
      aria-label="Sampul Surat See You"
    >
      {showEnvelopeElements && (
        <div className="opener-inner">
          {/* Indication of who the letter is addressed to */}
          <p className="intro-label">Surat ini ditulis khusus untuk</p>
          <div id="recipient-cover" className="recipient-name" data-testid="recipient-name">
            {recipientName}
          </div>

          {/* Envelope Stage with Natural Flower Bouquets in Background */}
          <div className="envelope-stage">
            {/* Flower Bouquet A: Carnation (Peeking top-right behind envelope) */}
            {hasCarnation && (
              <img
                src={buketCarnation}
                alt="Buket Carnation"
                className="flower-bouquet bouquet-right"
                aria-hidden="true"
              />
            )}

            {/* Flower Bouquet B: Matahari (Peeking bottom-left behind envelope) */}
            {hasMatahari && (
              <img
                src={buketMatahari}
                alt="Buket Matahari"
                className="flower-bouquet bouquet-left"
                aria-hidden="true"
              />
            )}

            {/* Interactive Envelope with Smoother Bell Ringing */}
            <div
              className={`envelope ${openingPhase === 'idle' ? 'is-bell-ringing' : ''} ${
                openingPhase !== 'idle' ? 'is-opening' : ''
              }`}
              data-state={openingPhase}
              role="button"
              tabIndex={0}
              aria-label="Ketuk amplop untuk membuka surat"
              onClick={handleTriggerOpen}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTriggerOpen();
                }
              }}
            >
              <div className="envelope-back" />

              {/* Letter Card that slides out */}
              <div
                className="envelope-letter"
                style={{
                  transform:
                    openingPhase === 'opening'
                      ? 'translateY(-85px)'
                      : 'none',
                }}
              >
                <span>See You</span>
              </div>

              <div className="envelope-front" />

              {/* Envelope Flap */}
              <div
                className="envelope-flap"
                style={{
                  transform: openingPhase !== 'idle' ? 'rotateX(180deg)' : 'none',
                }}
              />

              {/* Wax Seal with Prominent Official Komnasinfo Logo filling full button */}
              <button
                id="open-letter"
                data-testid="stamp-btn"
                type="button"
                className={`seal stamp-btn ${openingPhase !== 'idle' ? 'is-opening' : ''}`}
                aria-label="Buka surat (Open letter)"
                disabled={openingPhase !== 'idle'}
              >
                <img
                  src={logoKomnasUrl}
                  alt="Logo Komnas"
                  className="seal-icon"
                  onError={(e) => {
                    e.currentTarget.src = '/see-you/assets/icons/logo-komnas.svg';
                  }}
                />
              </button>
            </div>
          </div>

          {/* Simple Warm Greeting Prompt */}
          <h1 className="opener-title">
            Seseorang ingin menyampaikan <em>sesuatu kepadamu.</em>
          </h1>

          {/* Upward arrow pointing directly towards the envelope */}
          <p className="opener-hint">
            &uarr; Ketuk amplop untuk membuka surat
          </p>
        </div>
      )}

      {/* Full-screen expanding white/ivory backdrop covering 100vw and 100dvh with 1-second duration */}
      {(openingPhase === 'expanding' || openingPhase === 'fading') && (
        <div
          className={`opening-transition-veil is-full-screen ${
            openingPhase === 'fading' ? 'is-fading' : 'is-visible'
          }`}
          aria-hidden="true"
        >
          <div className="veil-letter-card">
            <span>See You</span>
          </div>
        </div>
      )}
    </section>
  );
}
