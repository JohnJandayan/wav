import { portfolioData as d } from '../data/portfolioData';
import { SectionHeading } from '../components/SectionHeading';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Motion';
export function Skills() {
  return (
    <section id="skills" className="section container" aria-labelledby="skills-title" tabIndex={-1}>
      <SectionHeading id="skills" intro={d.skills.intro} />
      <div className="skills-grid">
        {d.skills.domains.map((domain) => (
          <Reveal key={domain.id} className={`skill-panel skill-${domain.accent}`}>
            <div className="skill-top">
              <span className="small-mono">{domain.number}</span>
              <Icon name={domain.id === 'audio' ? 'wave' : 'plus'} size={20} />
            </div>
            <h3>{domain.title}</h3>
            <p>{domain.detail}</p>
            <details open>
              <summary>
                {d.skills.explore}
                <Icon name="plus" size={16} />
              </summary>
              <ul>
                {domain.skills.map((skill) => (
                  <li key={skill}>
                    <span className="skill-bullet" />
                    {skill}
                  </li>
                ))}
              </ul>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
