import { useId, useState, type PointerEvent } from 'react';
import { portfolioData as d, type PreviewKind } from '../data/portfolioData';
import { useExperience } from '../hooks/Experience';
import { AudioControl } from './AudioControl';
import { Icon } from './Icon';
export function Waveform() {
  const { active } = useExperience();
  return (
    <div
      className={`waveform ${active ? 'waveform-active' : ''}`}
      aria-label={d.previews.audio.waveformLabel}
      role="img"
    >
      {Array.from({ length: 52 }, (_, i) => {
        const height = 12 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.28)) * 74;
        return (
          <i
            key={i}
            style={{ height: `${height}%`, '--delay': `${i * -0.07}s` } as React.CSSProperties}
          />
        );
      })}
      <span className="wave-centerline" />
    </div>
  );
}
export function CampaignCurve() {
  const id = useId();
  const [selected, setSelected] = useState<number | null>(null);
  const p = d.previews.marketing;
  const points = p.points.map((point, i) => ({
    ...point,
    x: 34 + i * 58,
    y: 114 - point.value * 0.9,
  }));
  const path = points.map((point, i) => `${i ? 'L' : 'M'}${point.x},${point.y}`).join(' ');
  const current = selected === null ? null : points[selected];
  const inspect = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 360;
    setSelected(Math.max(0, Math.min(points.length - 1, Math.round((x - 34) / 58))));
  };
  return (
    <figure className="campaign-chart">
      <figcaption>
        <span>{p.demo}</span>
        <span className="chart-readout" aria-live="polite">
          {current ? `${current.label} / ${current.value}` : p.axis}
        </span>
      </figcaption>
      <svg
        viewBox="0 0 360 146"
        onPointerMove={inspect}
        onPointerLeave={() => setSelected(null)}
        aria-label={p.demo}
        role="group"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="var(--chart-emerald)" stopOpacity=".14" />
            <stop offset="1" stopColor="var(--chart-emerald)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[24, 69, 114].map((y, i) => (
          <g key={y}>
            <path d={`M34 ${y}H330`} className="chart-grid" />
            <text x="22" y={y + 4} textAnchor="end">
              {100 - i * 50}
            </text>
          </g>
        ))}
        <path d={`${path} L324,114 L34,114 Z`} fill={`url(#${id})`} />
        <path
          d={path}
          fill="none"
          stroke="var(--chart-emerald)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {current && <path d={`M${current.x} 20V114`} className="chart-crosshair" />}
        {points.map((point, i) => (
          <g key={point.label}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="var(--chart-emerald)"
              stroke="var(--elevated)"
              strokeWidth="2"
            />
            <rect
              x={point.x - 14}
              y="18"
              width="28"
              height="100"
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`${point.label}: ${point.value} ${p.axis}`}
              onFocus={() => setSelected(i)}
              onBlur={() => setSelected(null)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelected(i);
                }
              }}
            />
          </g>
        ))}
        <text x="34" y="137">
          {points[0]?.label}
        </text>
        <text x="324" y="137" textAnchor="end">
          {points.at(-1)?.label}
        </text>
      </svg>
      <p className="preview-disclaimer">{p.disclaimer}</p>
      <details className="chart-data">
        <summary>{p.table}</summary>
        <table>
          <caption className="sr-only">{p.demo}</caption>
          <thead>
            <tr>
              <th scope="col">{p.pointLabel}</th>
              <th scope="col">{p.axis}</th>
            </tr>
          </thead>
          <tbody>
            {p.points.map((point) => (
              <tr key={point.label}>
                <th scope="row">{point.label}</th>
                <td>{point.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
export function PillarPreview({ kind }: { kind: PreviewKind }) {
  if (kind === 'audio')
    return (
      <div className="preview preview-audio">
        <div className="preview-top">
          <span className="preview-label">{d.previews.audio.label}</span>
          <Icon name="wave" size={18} />
        </div>
        <div className="audio-title">
          <span className="record-disc" aria-hidden="true">
            <i />
          </span>
          <div>
            <h3>{d.previews.audio.artist}</h3>
            <p>{d.previews.audio.descriptor}</p>
          </div>
        </div>
        <Waveform />
        <div className="preview-bottom">
          <span className="small-mono">{d.previews.audio.signal}</span>
          <AudioControl />
        </div>
      </div>
    );
  if (kind === 'marketing')
    return (
      <div className="preview preview-marketing">
        <div className="preview-top">
          <span className="preview-label">{d.previews.marketing.label}</span>
          <span className="signal-dot" />
        </div>
        <h3>{d.previews.marketing.title}</h3>
        <CampaignCurve />
      </div>
    );
  if (kind === 'operations')
    return (
      <div className="preview preview-operations">
        <div className="preview-top">
          <span className="preview-label">{d.previews.operations.label}</span>
          <Icon name="plus" size={18} />
        </div>
        <h3>{d.previews.operations.title}</h3>
        <div className="ledger">
          <div className="ledger-header">
            <span>{d.previews.operations.header}</span>
            <span>{d.previews.operations.state}</span>
          </div>
          {d.previews.operations.steps.map((step, i) => (
            <div className="ledger-row" key={step}>
              <span className="ledger-index">0{i + 1}</span>
              <span>{step}</span>
              <Icon name="arrow" size={14} />
            </div>
          ))}
        </div>
        <p className="preview-disclaimer">{d.previews.operations.disclaimer}</p>
      </div>
    );
  return (
    <div className="preview preview-copywriting">
      <div className="preview-top">
        <span className="preview-label">{d.previews.copywriting.label}</span>
        <Icon name="arrow" size={18} />
      </div>
      <h3>{d.previews.copywriting.title}</h3>
      <div className="copy-stages">
        {d.previews.copywriting.stages.map((stage, i) => (
          <div key={stage.word}>
            <span className="small-mono">0{i + 1}</span>
            <strong>{stage.word}</strong>
            <small>{stage.detail}</small>
          </div>
        ))}
      </div>
      <p className="preview-disclaimer">{d.previews.copywriting.disclaimer}</p>
    </div>
  );
}
