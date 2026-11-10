import { portfolioData as d } from '../data/portfolioData';
import { SectionHeading } from '../components/SectionHeading';
import { Icon } from '../components/Icon';
export function Education() {
  return (
    <section
      id="education"
      className="section container"
      aria-labelledby="education-title"
      tabIndex={-1}
    >
      <SectionHeading id="education" intro={d.education.intro} />
      <div className="education-grid">
        <div className="timeline">
          {d.education.timeline.map((entry) => (
            <details
              className={`timeline-entry ${entry.current ? 'timeline-current' : ''}`}
              key={entry.id}
              open={entry.current}
            >
              <summary>
                <span className="timeline-dot" />
                <span className="timeline-date">{entry.date}</span>
                <span className="timeline-title">
                  {entry.title}
                  <small>{entry.qualification}</small>
                </span>
                <Icon name="plus" size={18} />
              </summary>
              <div className="timeline-detail">
                <p>{entry.description}</p>
                <span className="small-mono">{entry.abbreviation}</span>
              </div>
            </details>
          ))}
        </div>
        <aside className="milestones">
          <p className="small-mono">{d.education.milestoneLabel}</p>
          {d.education.achievements.map((item) => (
            <div className="milestone" key={item.title}>
              <span className="milestone-marker">{item.marker}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <small>{item.date}</small>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
