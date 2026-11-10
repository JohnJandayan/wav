import { useState } from 'react';
import { portfolioData as d, MUSIC_PORTFOLIO_URL, type Category } from '../data/portfolioData';
import { safeUrl } from '../lib/contact';
import { SectionHeading } from '../components/SectionHeading';
import { PillarPreview } from '../components/PillarPreview';
import { Tilt } from '../components/Motion';
import { Icon } from '../components/Icon';
export function Projects() {
  const [category, setCategory] = useState<Category>('All');
  const projects = d.projects.filter(
    (project) => category === 'All' || project.category === category,
  );
  const musicUrl = safeUrl(MUSIC_PORTFOLIO_URL);
  return (
    <section
      id="projects"
      className="section container"
      aria-labelledby="projects-title"
      tabIndex={-1}
    >
      <SectionHeading id="projects" />
      <div className="work-intro">
        <h3 className="editorial-heading">{d.work.headline}</h3>
        <p>{d.work.intro}</p>
      </div>
      <div className="project-filters" aria-label={d.work.filterLabel} role="group">
        {d.work.filters.map((filter) => (
          <button
            type="button"
            key={filter}
            aria-pressed={category === filter}
            onClick={() => setCategory(filter)}
          >
            {filter}
            {category === filter && <span className="filter-dot" />}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {projects.length} {d.work.resultLabel}
      </p>
      <div className="project-grid">
        {projects.map((project) => (
          <article className={`project project-${project.preview}`} key={project.id}>
            <Tilt className="project-preview">
              <PillarPreview kind={project.preview} />
            </Tilt>
            <div className="project-meta">
              <span>
                {d.work.outputLabel} {project.number}
              </span>
              <span>{project.type}</span>
            </div>
            <h3>{project.title}</h3>
            <div className="project-role">
              <span className="small-mono">{d.work.roleLabel}</span>
              <p>{project.role}</p>
            </div>
            <p className="project-scope">{project.scope}</p>
            <details className="project-details">
              <summary>
                {d.work.details}
                <Icon name="plus" size={16} />
              </summary>
              <ul>
                {project.activities.map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
            </details>
            {project.preview === 'audio' && (
              <div className="music-link">
                <a
                  href={musicUrl ?? d.identity.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  {musicUrl ? d.work.musicCta : d.work.musicFallback}
                  <Icon name="external" size={16} />
                </a>
                {!musicUrl && <p>{d.work.musicMissing}</p>}
              </div>
            )}
          </article>
        ))}
      </div>
      <p className="work-evidence">{d.work.evidence}</p>
    </section>
  );
}
