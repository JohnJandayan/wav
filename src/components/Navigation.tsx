import { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { portfolioData as d } from '../data/portfolioData';
import { useActiveSection } from '../hooks/useActiveSection';
import { useExperience } from '../hooks/Experience';
import { Icon } from './Icon';
import { AudioControl } from './AudioControl';
export function Navigation() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const { motionOff } = useExperience();
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main">
        {d.nav.skip}
      </a>
      <header className="nav-shell">
        <div className="nav-bar">
          <a
            href="#home"
            className="brand"
            aria-label={d.nav.homeLabel}
            onClick={() => setOpen(false)}
          >
            <Icon name="wave" size={24} />
            <span>
              <strong>{d.identity.name}</strong>
              <small>{d.identity.artist}</small>
            </span>
          </a>
          <nav
            id="main-navigation"
            aria-label={d.nav.label}
            className={`nav-links ${open ? 'nav-open' : ''}`}
          >
            {d.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={active === section.id ? 'location' : undefined}
                onClick={() => {
                  setOpen(false);
                  if (open)
                    requestAnimationFrame(() => {
                      const target = document.getElementById(section.id);
                      target?.focus({ preventScroll: true });
                    });
                }}
              >
                {section.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <AudioControl compact />
            <a className="nav-cta" href="#contact">
              {d.nav.collaborate}
              <Icon name="arrow" size={15} />
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              aria-label={open ? d.nav.closeMenu : d.nav.menu}
              aria-expanded={open}
              aria-controls="main-navigation"
              onClick={() => setOpen((value) => !value)}
            >
              <Icon name={open ? 'close' : 'menu'} />
            </button>
          </div>
          <motion.div
            className="nav-progress"
            style={{ scaleX: scrollYProgress, transition: motionOff ? 'none' : undefined }}
          />
        </div>
      </header>
    </>
  );
}
