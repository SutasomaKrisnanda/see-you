import React from 'react';
import { FALLBACK_CONTENT } from '../../data/defaultContent';

export const FallbackSection: React.FC = () => {
  return (
    <section
      id="invalid"
      data-testid="fallback-section"
      className="chapter invalid fallback-section"
      aria-labelledby="invalid-title"
    >
      <div className="texture" aria-hidden="true" />
      <div
        className="chapter-inner"
        style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto', position: 'relative', zIndex: 10 }}
      >
        <p className="eyebrow">{FALLBACK_CONTENT.subtitle}</p>
        <h1 className="wordmark" style={{ marginBottom: 16 }}>
          SEE <em>YOU.</em>
        </h1>
        <div className="divider" style={{ margin: '16px auto' }} />
        <h2 id="invalid-title" style={{ fontSize: 'clamp(24px, 5vw, 32px)', marginBottom: 16 }}>
          {FALLBACK_CONTENT.title}
        </h2>
        <p className="body-copy" style={{ maxWidth: 420, margin: '0 auto 20px', lineHeight: 1.8 }}>
          {FALLBACK_CONTENT.message}
        </p>
        <p className="small-copy" style={{ maxWidth: 380, margin: '0 auto', color: '#687B61', lineHeight: 1.6 }}>
          {FALLBACK_CONTENT.instruction}
        </p>
        <div style={{ marginTop: 28, color: '#D9C8A5', fontSize: 24 }} aria-hidden="true">
          ✳
        </div>
      </div>
    </section>
  );
};

export default FallbackSection;
