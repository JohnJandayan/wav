import { useId } from 'react';
import { portfolioData as d } from '../data/portfolioData';
import { formatAudioTime } from '../lib/audio';
import { useExperience } from '../hooks/Experience';
import { Icon } from './Icon';
export function Eq({ active = false, large = false }: { active?: boolean; large?: boolean }) {
  return (
    <span
      className={`eq ${active ? 'eq-active' : ''} ${large ? 'eq-large' : ''}`}
      aria-hidden="true"
    >
      {[12, 24, 34, 19, 28].map((height, i) => (
        <i
          key={i}
          style={{ '--bar-h': `${height}px`, '--delay': `${i * -0.17}s` } as React.CSSProperties}
        />
      ))}
    </span>
  );
}
export function AudioControl({
  compact = false,
  orb = false,
}: {
  compact?: boolean;
  orb?: boolean;
}) {
  const { active, loading, hasAudio, toggleAudio, audioMessage } = useExperience();
  const label = loading
    ? d.audio.loading
    : hasAudio
      ? active
        ? d.audio.pause
        : d.audio.play
      : active
        ? d.audio.pauseDemo
        : d.audio.startDemo;
  return (
    <div className={`audio-control ${orb ? 'audio-orb-wrap' : ''}`}>
      <button
        type="button"
        className={
          orb ? `audio-orb ${active ? 'is-active' : ''}` : compact ? 'audio-mini' : 'audio-button'
        }
        onClick={toggleAudio}
        aria-label={label}
        aria-pressed={active}
        disabled={loading}
      >
        {orb ? (
          <>
            <Eq active={active} large />
            <span>{loading ? d.ui.loading : active ? d.audio.running : d.audio.idle}</span>
            <Icon name={active ? 'pause' : 'play'} size={16} />
          </>
        ) : (
          <>
            <Eq active={active} />
            <span className={compact ? 'sr-only' : ''}>{label}</span>
            {!compact && <Icon name={active ? 'pause' : 'play'} size={14} />}
          </>
        )}
      </button>
      {orb && (
        <p className="audio-caption">
          {hasAudio ? `${d.audio.title} / ${d.identity.artist}` : d.audio.demoNote}
        </p>
      )}
      {!compact && audioMessage && (
        <p className="audio-status" role="status">
          {audioMessage}
        </p>
      )}
    </div>
  );
}

export function AudioTimeline() {
  const { hasAudio, currentTime, duration, seekAudio } = useExperience();
  const id = useId();
  if (!hasAudio) return null;
  const clock = `${formatAudioTime(currentTime)} / ${duration ? formatAudioTime(duration) : d.audio.unknownDuration}`;
  return (
    <div className="audio-timeline">
      <div className="audio-clock">
        <span>{d.audio.title}</span>
        <span>{clock}</span>
      </div>
      <label className="sr-only" htmlFor={id}>
        {d.audio.seek}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={duration || 1}
        step={0.1}
        value={Math.min(currentTime, duration || 1)}
        disabled={!duration}
        aria-valuetext={clock}
        onChange={(event) => seekAudio(Number(event.target.value))}
      />
    </div>
  );
}
