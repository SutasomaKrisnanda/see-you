import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { RecipientData, TeamMemberMessage, MemoryPhoto } from '../../data/types';
import { saveMemoryOffline } from '../../services/offlineKeepsake';

interface StoryProps {
  recipient: RecipientData;
  onReadAgain: () => void;
  onNextChapter: (targetChapter: number) => void;
}

export default function Story({ recipient, onReadAgain, onNextChapter }: StoryProps) {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSaveMemory = () => {
    if (saveState === 'saving') return;
    setSaveState('saving');
    saveMemoryOffline(recipient)
      .then((result) => {
        if (result.success) {
          setSaveState('saved');
        } else {
          setSaveState('error');
        }
      })
      .catch(() => {
        setSaveState('error');
      });
  };

  return (
    <>
      {/* Chapter 01: Salam Pembuka (Greeting) */}
      <section
        id="greeting-section"
        data-chapter="01"
        className="chapter section-greeting greeting-chapter"
        aria-label="Salam Pembuka"
      >
        <div className="chapter-inner">
          <p className="eyebrow">Salam Pembuka</p>
          <h2 id="greeting-title">
            Halo, <em>{recipient.recipient.nickname}!</em>
          </h2>
          <p className="large-quote">"{recipient.greeting.quote}"</p>
          <div className="divider" />
          <p className="body-copy">{recipient.greeting.message}</p>
          <div className="chapter-action-wrap">
            <button
              type="button"
              className="btn btn-dark chapter-next"
              data-next="2"
              onClick={() => onNextChapter(2)}
            >
              Lanjut Membaca &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Chapter 02: Surat dari Fasilitator (Facilitator Letter) */}
      <section
        id="facilitator-section"
        data-chapter="02"
        className="chapter section-facilitator letter-chapter"
        aria-label="Surat dari Fasilitator"
      >
        <div className="chapter-inner">
          <p className="eyebrow">Surat dari Fasilitator</p>
          <div className="paper-card" data-testid="paper-card">
            <p className="salutation" style={{ fontWeight: 600, marginBottom: '10px' }}>
              {recipient.facilitatorLetter.salutation}
            </p>
            <div className="paper-paragraphs">
              {recipient.facilitatorLetter.paragraphs.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="signature" data-testid="signature">
              {recipient.facilitatorLetter.signature}
            </div>
            <div className="person-role">{recipient.facilitatorLetter.role}</div>
          </div>
          <div className="chapter-action-wrap">
            <button
              type="button"
              className="btn btn-dark chapter-next"
              data-next="3"
              onClick={() => onNextChapter(3)}
            >
              Baca Pesan Tim &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Chapter 03: Pesan dari Tim Komnasinfo (Team Letters) */}
      <section
        id="team-section"
        data-chapter="03"
        className="chapter section-team team-chapter"
        aria-label="Pesan dari Rekan"
      >
        <div className="chapter-inner">
          <p className="eyebrow">Pesan dari Rekan</p>
          <h2>
            Dari <em>Komnasinfo</em>
          </h2>

          {/* Horizontal swipe card slider to guarantee single viewport height */}
          <div className="team-carousel" role="region" aria-label="Daftar pesan tim">
            {recipient.teamLetters.map((msg: TeamMemberMessage, index: number) => (
              <div
                key={index}
                className="team-card"
                data-testid="team-card"
                style={{ '--accent': msg.accent } as CSSProperties}
              >
                <div className="person-row">
                  <div className="avatar">{msg.sender.charAt(0)}</div>
                  <div>
                    <h3 className="person-name">{msg.sender}</h3>
                    <p className="person-role">{msg.role}</p>
                  </div>
                </div>
                <p className="body-copy team-message-text">{msg.message}</p>
              </div>
            ))}
          </div>

          <p className="carousel-hint">&larr; Geser untuk melihat pesan lainnya &rarr;</p>

          <div className="chapter-action-wrap">
            <button
              type="button"
              className="btn btn-dark chapter-next"
              data-next="4"
              onClick={() => onNextChapter(4)}
            >
              Lihat Kenangan &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Chapter 04: Kenangan Bersama (Scrapbook Memories) */}
      <section
        id="moments-section"
        data-chapter="04"
        className="chapter section-moments moments-chapter"
        aria-label="Kenangan Bersama"
      >
        <div className="chapter-inner">
          <p className="eyebrow">Kenangan Bersama</p>
          <h2>
            Momen <em>Berharga</em>
          </h2>

          {/* Horizontal swipe photo gallery to prevent vertical overflow */}
          <div className="photo-carousel" role="region" aria-label="Galeri foto kenangan">
            {recipient.memories.map((photo: MemoryPhoto, index: number) => (
              <figure key={index} className="photo-card" data-testid="photo-card">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="300"
                />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>

          {recipient.videoNote && (
            <div className="video-note">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{recipient.videoNote.note}</span>
            </div>
          )}

          <div className="chapter-action-wrap">
            <button
              type="button"
              className="btn btn-dark chapter-next"
              data-next="5"
              onClick={() => onNextChapter(5)}
            >
              Baca Penutup &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Chapter 05: Sampai Jumpa (Closing) */}
      <section
        id="closing-section"
        data-chapter="05"
        className="chapter section-closing closing-chapter"
        aria-label="Sampai Jumpa"
      >
        <div className="chapter-inner">
          <p className="eyebrow">Sampai Jumpa</p>
          <h2>
            See You, <em>{recipient.recipient.nickname}.</em>
          </h2>
          <p className="body-copy">{recipient.closing.message}</p>
          <div className="closing-meta">
            <div>{recipient.closing.sender}</div>
            <div>{recipient.closing.period}</div>
          </div>
          <div className="button-stack">
            <button
              id="save-memory"
              data-testid="save-memory"
              type="button"
              className={`btn btn-dark btn-save-memory ${saveState === 'saved' ? 'is-saved' : ''}`}
              onClick={handleSaveMemory}
              disabled={saveState === 'saving' || saveState === 'saved'}
              aria-busy={saveState === 'saving'}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {saveState === 'saving' && 'Menyimpan...'}
              {saveState === 'saved' && 'Tersimpan untuk Offline'}
              {saveState === 'idle' && 'Simpan Kenangan Ini'}
              {saveState === 'error' && 'Coba Simpan Lagi'}
            </button>
            <button
              id="read-again"
              data-testid="read-again"
              type="button"
              className="btn btn-outline btn-read-again"
              onClick={onReadAgain}
            >
              Baca dari Awal
            </button>
          </div>
          <p className="ending-mark" aria-hidden="true">✳</p>
        </div>
      </section>
    </>
  );
}
