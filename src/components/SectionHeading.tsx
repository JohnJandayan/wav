import { getSection, type SectionId } from '../data/portfolioData';
export function SectionHeading({ id, intro }: { id: SectionId; intro?: string }) {
  const section = getSection(id);
  return (
    <div className="section-heading">
      <p className="section-index">
        <span>{section.index} // 07</span>
        <span className="index-line" />
        <span>{section.eyebrow}</span>
      </p>
      <div className="heading-row">
        <h2 id={`${id}-title`}>{section.title}</h2>
        {intro && <p>{intro}</p>}
      </div>
    </div>
  );
}
