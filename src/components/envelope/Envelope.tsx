import { useState } from 'react';

interface EnvelopeProps {
  recipientName: string;
  isOpened: boolean;
  onOpen: () => void;
}

export default function Envelope({ recipientName, isOpened, onOpen }: EnvelopeProps) {
  const [openingPhase, setOpeningPhase] = useState<'idle' | 'opening' | 'expanding' | 'done'>(
    isOpened ? 'done' : 'idle'
  );

  const handleTriggerOpen = () => {
    if (openingPhase !== 'idle') return;
    setOpeningPhase('opening');

    // Phase 1: Flap flips open & letter card slides out (0 - 450ms)
    setTimeout(() => {
      // Phase 2: Letter card expands to fill the full viewport (450ms - 950ms)
      setOpeningPhase('expanding');
    }, 450);

    setTimeout(() => {
      // Phase 3: Transition complete, unlock story view
      setOpeningPhase('done');
      onOpen();
    }, 950);
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

        {/* Interactive Envelope with Idle Sway & Lift */}
        <div
          className={`envelope ${openingPhase === 'idle' ? 'is-idle' : ''} ${
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

          {/* Letter Card that slides out and expands */}
          <div
            className={`envelope-letter ${openingPhase === 'expanding' ? 'is-expanded' : ''}`}
            style={{
              transform:
                openingPhase === 'expanding'
                  ? 'scale(3.5) translateY(-50px)'
                  : openingPhase === 'opening'
                    ? 'translateY(-75px)'
                    : 'none',
              opacity: openingPhase === 'expanding' ? 0.95 : 1,
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
              src="/see-you/assets/icons/logo-komnas.svg"
              alt="Logo Komnas"
              className="seal-icon"
              onError={(e) => {
                e.currentTarget.src = '/assets/icons/logo-komnas.svg';
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

      {/* Full-screen expanding white/ivory backdrop transition */}
      {openingPhase === 'expanding' && (
        <div className="opening-transition-veil" aria-hidden="true" />
      )}
    </section>
  );
}
