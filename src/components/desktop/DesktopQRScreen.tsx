import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { DESKTOP_GATE_CONTENT } from '../../data/defaultContent';
import type { DesktopQRScreenProps } from '../../data/types';

export const DesktopQRScreen: React.FC<DesktopQRScreenProps> = ({ url, className = '' }) => {
  // Determine active URL: props.url -> window.location.href -> fallback
  const activeUrl =
    url ||
    (typeof window !== 'undefined' && window.location?.href
      ? window.location.href
      : 'https://sutasomakrisnanda.github.io/see-you/');

  return (
    <aside
      id="desktop-gate"
      data-testid="desktop-gate"
      className={`desktop-gate ${className}`.trim()}
      role="region"
      aria-label="Desktop Screen Gating"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        backgroundColor: '#F7F3EA',
        color: '#29382F',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div className="texture" aria-hidden="true" />

      {/* Card container */}
      <div
        className="desktop-gate-card"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 520,
          width: '100%',
          backgroundColor: '#fffdf7',
          border: '1px solid #e8decb',
          boxShadow: '0 24px 60px rgba(41, 56, 47, 0.08)',
          borderRadius: 6,
          padding: '48px 36px',
        }}
      >
        <header className="desktop-gate-header">
          <p className="eyebrow">{DESKTOP_GATE_CONTENT.brandTagline}</p>
          <h1 className="wordmark desktop-wordmark" style={{ fontSize: 26, margin: '8px 0' }}>
            SEE <em>YOU.</em>
          </h1>
        </header>

        <div className="divider" style={{ margin: '18px auto' }} />

        <h2
          id="desktop-title"
          className="desktop-headline"
          style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', marginBottom: 10 }}
        >
          {DESKTOP_GATE_CONTENT.headline}
        </h2>

        <p className="body-copy desktop-description" style={{ marginBottom: 24 }}>
          {DESKTOP_GATE_CONTENT.subheadline}
        </p>

        <div
          className="desktop-qr-container"
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}
        >
          <div
            className="desktop-qr-card"
            style={{
              padding: 16,
              backgroundColor: '#ffffff',
              border: '1px solid #e2ddd3',
              borderRadius: 4,
              boxShadow: '0 8px 24px rgba(41, 56, 47, 0.06)',
              display: 'inline-block',
            }}
          >
            <QRCodeSVG
              value={activeUrl}
              size={220}
              level="M"
              includeMargin={true}
              bgColor="#FFFFFF"
              fgColor="#29382F"
              className="desktop-qr-svg"
              data-testid="qr-code"
              data-value={activeUrl}
              data-url={activeUrl}
              title={activeUrl}
              aria-label={activeUrl}
            />
          </div>
        </div>

        <p
          className="desktop-instruction"
          style={{ fontSize: 14, lineHeight: 1.7, color: '#59665a', maxWidth: 420, margin: '0 auto 12px' }}
        >
          {DESKTOP_GATE_CONTENT.instruction}
        </p>

        <p className="small-copy desktop-footnote" style={{ color: '#8a9687', margin: 0 }}>
          {DESKTOP_GATE_CONTENT.footnote}
        </p>
      </div>
    </aside>
  );
};

export default DesktopQRScreen;
