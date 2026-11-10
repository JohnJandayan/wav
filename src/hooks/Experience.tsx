import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';
import { AUDIO_REEL_URL, portfolioData as d } from '../data/portfolioData';
import { safeUrl } from '../lib/contact';
interface ExperienceState {
  motionOff: boolean;
  paused: boolean;
  reduced: boolean;
  toggleMotion: () => void;
  active: boolean;
  loading: boolean;
  audioMessage: string;
  hasAudio: boolean;
  toggleAudio: () => void;
}
const ExperienceContext = createContext<ExperienceState | null>(null);
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const reduced = Boolean(useReducedMotion());
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioMessage, setAudioMessage] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const source = safeUrl(AUDIO_REEL_URL, 'asset');
  const hasAudio = Boolean(source);
  const motionOff = reduced || paused;
  useEffect(() => {
    document.documentElement.dataset.motion = motionOff ? 'off' : 'on';
  }, [motionOff]);
  const toggleAudio = () => {
    if (!hasAudio) {
      setActive((value) => !value);
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    setLoading(true);
    setAudioMessage('');
    void audio.play().catch(() => {
      setLoading(false);
      setActive(false);
      setAudioMessage(d.audio.failed);
    });
  };
  return (
    <ExperienceContext.Provider
      value={{
        motionOff,
        paused,
        reduced,
        toggleMotion: () => setPaused((value) => !value),
        active,
        loading,
        audioMessage,
        hasAudio,
        toggleAudio,
      }}
    >
      {children}
      {source && (
        <audio
          ref={audioRef}
          src={source}
          preload="none"
          onPlaying={() => {
            setActive(true);
            setLoading(false);
          }}
          onPause={() => setActive(false)}
          onEnded={() => {
            setActive(false);
            setAudioMessage(d.audio.ended);
          }}
          onError={() => {
            setActive(false);
            setLoading(false);
            setAudioMessage(d.audio.failed);
          }}
        />
      )}
    </ExperienceContext.Provider>
  );
}
export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) throw new Error('ExperienceProvider is required');
  return context;
}
