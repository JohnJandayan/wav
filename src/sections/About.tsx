import { portfolioData as d } from '../data/portfolioData';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Motion';
import { Portrait } from '../components/Portrait';
export function About() {
  return (
    <section id="about" className="section container" aria-labelledby="about-title" tabIndex={-1}>
      <SectionHeading id="about" />
      <div className="about-grid">
        <Reveal className="about-narrative">
          <h3 className="editorial-heading">{d.about.headline}</h3>
          {d.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="aspirations">
            <span className="small-mono">{d.about.aspirationsLabel}</span>
            <p>{d.about.aspirations}</p>
          </div>
        </Reveal>
        <div className="about-visual">
          <Portrait large />
          <span className="portrait-margin-note">{d.about.caption}</span>
        </div>
      </div>
      <div className="philosophy">
        <div>
          <span className="small-mono">{d.about.philosophyLabel}</span>
          <blockquote>{d.about.philosophy}</blockquote>
        </div>
        <div>
          <p>{d.about.philosophyText}</p>
          <ul className="values">
            {d.about.values.map((value, i) => (
              <li key={value}>
                <span>0{i + 1}</span>
                {value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
