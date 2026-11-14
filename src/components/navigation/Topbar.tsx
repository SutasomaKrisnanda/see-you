import { useRef, useState, useEffect } from 'react';
import monokromSong from '@/assets/songs/Monokrom.mp3';

interface TopbarProps {
  currentChapter?: number;
  totalChapters?: number;
  isPlaying?: boolean;
  onToggleAudio?: () => void;
}

export default function Topbar({
  isPlaying: externalIsPlaying,
  onToggleAudio: externalOnToggleAudio,
}: TopbarProps) {
  const [internalPlaying, setInternalPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalPlaying;

  const toggleAudio = async () => {
    if (externalOnToggleAudio) {
      externalOnToggleAudio();
      return;
    }

    try {
      if (!audioRef.current) {
        const audio = new Audio(monokromSong || '/see-you/assets/songs/monokrom.mp3');
        audio.loop = true;
        audio.preload = 'auto';
        audioRef.current = audio;
      }

      if (isPlaying) {
        audioRef.current.pause();
        setInternalPlaying(false);
      } else {
        // Optimistically set playing so the speaker icon responds immediately
        setInternalPlaying(true);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      }
    } catch {
      // If play failed, ensure state aligns
      setInternalPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <header className="topbar">
      <h1 className="wordmark">
        SEE <em>YOU.</em>
      </h1>
      <div className="top-actions">
        {/* Audio Toggle Button - Pure icon only, speaker muted vs speaker waves */}
        <button
          type="button"
          className={`icon-button btn-audio-toggle ${isPlaying ? 'is-playing' : 'is-muted'}`}
          data-testid="audio-toggle"
          aria-label={isPlaying ? 'Heningkan musik' : 'Putar musik'}
          aria-pressed={isPlaying}
          onClick={toggleAudio}
        >
          {isPlaying ? (
            /* Active Sound Waves Speaker Icon */
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              className="audio-icon audio-icon-playing"
              aria-hidden="true"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          ) : (
            /* Muted Slash Speaker Icon */
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              className="audio-icon audio-icon-muted"
              aria-hidden="true"
            >
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
