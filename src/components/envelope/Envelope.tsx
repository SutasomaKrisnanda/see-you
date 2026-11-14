import { useState, useEffect } from 'react';
import logoKomnasUrl from '@/assets/icons/Logo Komnas.svg';

interface EnvelopeProps {
  recipientName: string;
  isOpened: boolean;
  onOpen: () => void;
}

export default function Envelope({ recipientName, isOpened, onOpen }: EnvelopeProps) {
  const [openingPhase, setOpeningPhase] = useState<'idle' | 'opening' | 'expanding' | 'done'>(
    isOpened ? 'done' : 'idle'
  );

  // When reset from parent (e.g. "Baca dari Awal"), return to locked idle state
  useEffect(() => {
    if (!isOpened) {
      setOpeningPhase('idle');
    }
  }, [isOpened]);

  const handleTriggerOpen = () => {
    if (openingPhase !== 'idle') return;
    setOpeningPhase('opening');

    // Phase 1: Flap flips open & letter slides up (450ms)
    setTimeout(() => {
      // Phase 2: Letter card expands to fill the entire viewport width & height (450ms - 1050ms)
      setOpeningPhase('expanding');
    }, 450);

    setTimeout(() => {
      // Phase 3: Transition complete, unlock story view
      setOpeningPhase('done');
      onOpen();
    }, 1050);
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

        {/* Interactive Envelope with Bell Ringing & 2-Second Pause */}
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

          {/* Letter Card that slides out and expands to fill entire viewport */}
          <div
            className={`envelope-letter ${openingPhase === 'expanding' ? 'is-full-viewport' : ''}`}
            style={{
              transform:
                openingPhase === 'opening'
                  ? 'translateY(-75px)'
                  : openingPhase === 'expanding'
                    ? 'none'
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

          {/* Wax Seal with Official Komnasinfo Logo */}
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
                // If local path resolution differs, fall back to public asset
                e.currentTarget.src = '/see-you/assets/icons/logo-komnas.svg';
              }}
            />
          </button>
        </div>

        {/* Simple Warm Greeting Prompt */}
        <h1 className="opener-title">
          Seseorang ingin menyampaikan <em>sesuatu kepadamu.</em>
        </h1>
        <p className="opener-hint">
          Ketuk amplop untuk membuka surat &darr;
        </p>
      </div>

      {/* Full-screen expanding white/ivory backdrop covering full width and height */}
      {openingPhase === 'expanding' && (
        <div className="opening-transition-veil is-full-screen" aria-hidden="true">
          <div className="veil-letter-card">
            <span>See You</span>
          </div>
        </div>
      )}
    </section>
  );
}
