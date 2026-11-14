/**
 * Core Type Definitions for See You — Digital Farewell Letter Experience
 * Strictly adheres to PROJECT.md § Interface Contracts.
 */

export interface RecipientProfile {
  name: string;
  nickname: string;
}

export interface FacilitatorLetter {
  sender: string;
  role: string;
  salutation: string;
  paragraphs: string[];
  signature: string;
}

export interface TeamMemberMessage {
  sender: string;
  role: string;
  avatar: string | null;
  accent: string;
  message: string;
}

export interface MemoryPhoto {
  src: string;
  alt: string;
  caption: string;
}

export interface VideoNote {
  src?: string;
  poster?: string;
  note: string;
}

export interface RecipientTheme {
  background: string;
  accent: string;
}

export interface RecipientGreeting {
  headline: string;
  quote: string;
  message: string;
}

export interface RecipientClosing {
  headline: string;
  message: string;
  sender: string;
  period: string;
}

export interface RecipientData {
  token: string;
  recipient: RecipientProfile;
  theme: RecipientTheme;
  greeting: RecipientGreeting;
  facilitatorLetter: FacilitatorLetter;
  teamLetters: TeamMemberMessage[];
  memories: MemoryPhoto[];
  videoNote?: VideoNote;
  closing: RecipientClosing;
}

export interface DeviceState {
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

export interface DesktopQRScreenProps {
  url?: string;
  className?: string;
}

export interface FallbackContent {
  title: string;
  subtitle: string;
  message: string;
  instruction: string;
}
