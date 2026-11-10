import { portfolioData as d } from '../data/portfolioData';
import { useExperience } from '../hooks/Experience';
import { Icon } from './Icon';
export function Footer() {
  const { reduced, paused, toggleMotion } = useExperience();
  return (
    <footer className="footer container">
      <div className="footer-main">
        <a href="#home" className="footer-brand">
          <Icon name="wave" size={27} />
          <span>{d.identity.artist}</span>
        </a>
        <p>{d.footer.note}</p>
        <a href="#home" className="text-link">
          {d.footer.back}
          <Icon name="arrow" size={16} style={{ transform: 'rotate(-90deg)' }} />
        </a>
      </div>
      <div className="footer-bottom">
        <small>{d.footer.copyright}</small>
        <button
          type="button"
          className="motion-toggle"
          onClick={toggleMotion}
          disabled={reduced}
          aria-pressed={paused || reduced}
        >
          <Icon name={paused || reduced ? 'play' : 'pause'} size={13} />
          {reduced ? d.ui.motionReduced : paused ? d.ui.resumeMotion : d.ui.pauseMotion}
        </button>
        <details className="academic">
          <summary>
            {d.footer.academicToggle}
            <Icon name="plus" size={13} />
          </summary>
          <dl>
            {d.footer.academic.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </footer>
  );
}
