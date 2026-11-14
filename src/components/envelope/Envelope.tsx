import { useState, useEffect } from 'react';
import logoKomnasUrl from '@/assets/icons/Logo Komnas.svg';
import buketCarnation from '@/assets/images/buket carnation.webp';
import buketMatahari from '@/assets/images/buket matahari.webp';

interface EnvelopeProps {
  recipientName: string;
  isOpened: boolean;
  onOpen: () => void;
}

export default function Envelope({ recipientName, isOpened, onOpen }: EnvelopeProps) {
  const [openingPhase, setOpeningPhase] = useState<
    'idle' | 'opening' | 'expanding' | 'paused' | 'fading' | 'done'
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

    // Phase 1: Flap flips open & letter rises up gently (650ms)
    setTimeout(() => {
      // Phase 2: Letter card expands smoothly to fill full viewport (650ms - 1650ms)
      setOpeningPhase('expanding');
    }, 650);

    // Phase 3: "See You" has filled screen - 2-second breathing pause (1650ms - 3650ms)
    setTimeout(() => {
      setOpeningPhase('paused');
    }, 1650);

    // Phase 4: Gentle fade-out into Chapter 1 (3650ms - 4550ms)
    setTimeout(() => {
      setOpeningPhase('fading');
    }, 3650);

    // Phase 5: Complete transition, unlock story view (4550ms)
    setTimeout(() => {
      setOpeningPhase('done');
      onOpen();
    }, 4550);
  };

  // If already opened and dismissed, do not render to avoid interfering with scrolling
  if (openingPhase === 'done' && isOpened) {
    return null;
  }

  return (
    <section
      id="envelope-section"
      data-testid="envelope-section"
      className={`opener-layer ${openingPhase !== 'idle' ? `is-${openingPhase}` : 'is-idle'}`}
      aria-label="Sampul Surat See You"
    >
      <div className="opener-inner">
        {/* Indication of who the letter is addressed to */}
        <p className="intro-label">Surat ini ditulis khusus untuk</p>
        <div id="recipient-cover" className="recipient-name" data-testid="recipient-name">
          {recipientName}
        </div>

        {/* Envelope Stage with Natural Flower Bouquets in Background */}
        <div className="envelope-stage">
          {/* Flower Bouquet A: Carnation (Peeking top-right behind envelope) */}
          <img
            src={buketCarnation}
            alt="Buket Carnation"
            className="flower-bouquet bouquet-right"
            aria-hidden="true"
          />

          {/* Flower Bouquet B: Matahari (Peeking bottom-left behind envelope) */}
          <img
            src={buketMatahari}
            alt="Buket Matahari"
            className="flower-bouquet bouquet-left"
            aria-hidden="true"
          />

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
              className={`envelope-letter ${
                openingPhase === 'expanding' || openingPhase === 'paused' || openingPhase === 'fading'
                  ? 'is-full-viewport'
                  : ''
              }`}
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

            {/* Wax Seal with Prominent Official Komnasinfo Logo */}
            <button
              id="open-letter"
              data-testid="stamp-btn"
              type="button"
              className={`seal stamp-btn ${openingPhase !== 'idle' ? 'is-opening' : ''}`}
              aria-label="Buka surat (Open letter)"
              tabIndex={-1}
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

      {/* Full-screen expanding white/ivory backdrop covering 100vw and 100dvh with 2-second breathing pause */}
      {(openingPhase === 'expanding' || openingPhase === 'paused' || openingPhase === 'fading') && (
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
