import { motion } from 'framer-motion';
import { portfolioData as d, type PreviewKind } from '../data/portfolioData';
import { useExperience } from '../hooks/Experience';
import { AudioControl } from '../components/AudioControl';
import { Portrait } from '../components/Portrait';
import { PillarPreview } from '../components/PillarPreview';
import { MagneticLink, Tilt } from '../components/Motion';
import { Icon } from '../components/Icon';
export function Home() {
  const { motionOff } = useExperience();
  const reveal = (delay: number) => ({
    initial: motionOff ? (false as const) : { opacity: 0, y: 24, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 20,
      delay: motionOff ? 0 : delay,
    },
  });
  return (
    <section id="home" aria-labelledby="home-title" className="hero" tabIndex={-1}>
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="horizon horizon-emerald" />
        <div className="horizon horizon-coral" />
        <div className="horizon-line" />
        <div className="hero-frequency-lines" />
      </div>
      <div className="hero-topline container">
        <span className="small-mono">01 // 07 — {d.sections[0]?.eyebrow}</span>
        <span className="small-mono">{d.nav.signature}</span>
      </div>
      <div className="hero-content container">
        <h1 id="home-title">
          <motion.span {...reveal(0.08)}>{d.hero.lineOne}</motion.span>
          <motion.span className="headline-second" {...reveal(0.15)}>
            {d.hero.lineTwo} <em>{d.hero.lineThree}</em>
          </motion.span>
        </h1>
        <motion.p className="hero-intro" {...reveal(0.25)}>
          {d.hero.intro}
        </motion.p>
        <motion.div className="hero-identity" {...reveal(0.32)}>
          <Portrait />
          <div>
            <span>{d.identity.name}</span>
            <small>{d.identity.location}</small>
          </div>
        </motion.div>
        <motion.div className="resonance-center" {...reveal(0.4)}>
          <AudioControl orb />
        </motion.div>
        <motion.div className="hero-actions" {...reveal(0.45)}>
          <MagneticLink href="#about" className="button button-light">
            {d.hero.explore}
            <Icon name="arrow" size={17} />
          </MagneticLink>
          <a href="#contact" className="text-link">
            {d.nav.collaborate}
            <Icon name="external" size={15} />
          </a>
        </motion.div>
      </div>
      <div className="hero-metrics container" aria-label={d.hero.metricNote}>
        {d.hero.metrics.map((metric, i) => (
          <motion.div
            key={metric.value}
            className={`metric metric-${i + 1}`}
            {...reveal(0.5 + i * 0.06)}
          >
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
            <small>{metric.note}</small>
          </motion.div>
        ))}
      </div>
      <div className="hero-dock container">
        <div className="dock-heading">
          <span>
            <span className="signal-dot" />
            {d.hero.dockLabel}
          </span>
          <a href="#projects">
            {d.hero.scroll}
            <Icon name="arrow" size={14} />
          </a>
        </div>
        <div className="dock-grid">
          {(['audio', 'marketing', 'operations'] as PreviewKind[]).map((kind, i) => (
            <div className={`dock-angle dock-angle-${i}`} key={kind}>
              <Tilt className={`dock-card dock-${kind}`}>
                <PillarPreview kind={kind} />
                <a
                  className="dock-link"
                  href="#projects"
                  aria-label={`${d.previews.explore}: ${d.previews[kind].label}`}
                >
                  {d.previews.explore}
                  <Icon name="arrow" size={16} />
                </a>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
