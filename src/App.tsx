import { useState, useEffect, useRef } from 'react';
import { detectDevice, subscribeDeviceChanges, type DeviceState } from './services/deviceDetector';
import { resolveRecipient } from './services/recipientResolver';
import type { RecipientData } from './data/types';
import DesktopQRScreen from './components/desktop/DesktopQRScreen';
import FallbackSection from './components/fallback/FallbackSection';
import Topbar from './components/navigation/Topbar';
import Envelope from './components/envelope/Envelope';
import Story from './components/story/Story';

export default function App() {
  // Register Service Worker in production only to avoid dev MIME-type and scope conflicts
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      navigator.serviceWorker.register('/see-you/sw.js', { scope: '/see-you/' }).catch(() => {});
    } catch {
      // Ignore if not supported in test/mock
    }
  }

  const [device, setDevice] = useState<DeviceState>(() => detectDevice());
  const [recipient, setRecipient] = useState<RecipientData | null>(() => resolveRecipient());
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const storyContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const unsubscribeDevice = subscribeDeviceChanges((newDevice) => {
      setDevice(newDevice);
    });

    const handleLocationChange = () => {
      setRecipient(resolveRecipient());
    };

    window.addEventListener('popstate', handleLocationChange);

    return () => {
      unsubscribeDevice();
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Lock body scroll while envelope is not yet opened
  useEffect(() => {
    if (!isEnvelopeOpened) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isEnvelopeOpened]);

  // IntersectionObserver to dynamically track chapter changes when scrolling
  useEffect(() => {
    if (!device.isMobile || !recipient || !isEnvelopeOpened) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>('.chapter[data-chapter]'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetEl = entry.target as HTMLElement;
            const chapterAttr = targetEl.getAttribute('data-chapter');
            if (chapterAttr) {
              const num = parseInt(chapterAttr, 10);
              if (!isNaN(num)) {
                setCurrentChapter(num);
              }
            }
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    sections.forEach((s) => observer.observe(s));

    return () => {
      observer.disconnect();
    };
  }, [device.isMobile, recipient, isEnvelopeOpened]);

  // Gating 1: Non-mobile / desktop viewports display Desktop QR Screen
  if (!device.isMobile) {
    return <DesktopQRScreen />;
  }

  // Gating 2: Missing or invalid token renders safe fallback screen
  if (!recipient) {
    return <FallbackSection />;
  }

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpened(true);
    setTimeout(() => {
      const greetingEl = document.querySelector('#greeting-section');
      if (greetingEl && typeof greetingEl.scrollIntoView === 'function') {
        greetingEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleNextChapter = (targetChapter: number) => {
    const chapterId = targetChapter.toString().padStart(2, '0');
    const targetEl = document.querySelector(`[data-chapter="${chapterId}"]`);
    if (targetEl && typeof targetEl.scrollIntoView === 'function') {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
    setCurrentChapter(targetChapter);
  };

  // Requirement 6: "kembalikan ke render view dengan tampilan amplop yang masih terkunci lagi"
  const handleReadAgain = () => {
    setIsEnvelopeOpened(false);
    setCurrentChapter(1);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <div className={`see-you-app ${!isEnvelopeOpened ? 'is-envelope-closed' : 'is-envelope-open'}`}>
      <div className="texture" aria-hidden="true" />

      {/* Topbar: Fixed Header with "See You" & Icon-only Audio Toggle */}
      <Topbar currentChapter={currentChapter} totalChapters={5} />

      {/* Opener Section: Separate Top-level Layer (Unscrollable until opened) */}
      <Envelope
        recipientName={recipient.recipient.name}
        isOpened={isEnvelopeOpened}
        onOpen={handleOpenEnvelope}
      />

      {/* Story Sections (Chapters 01 - 05): Single Viewport Snapping */}
      <main
        id="story"
        ref={storyContainerRef}
        data-testid="story-container"
        className={`story-main ${!isEnvelopeOpened ? 'story-locked' : 'story-active'}`}
      >
        <Story
          recipient={recipient}
          onReadAgain={handleReadAgain}
          onNextChapter={handleNextChapter}
        />
      </main>
    </div>
  );
}
