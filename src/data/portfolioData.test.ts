import { describe, expect, it } from 'vitest';
import { portfolioData as d, getSection } from './portfolioData';
describe('portfolio content contract', () => {
  it('contains all seven stable navigation targets', () => {
    expect(d.sections.map((section) => section.id)).toEqual([
      'home',
      'about',
      'skills',
      'education',
      'projects',
      'certificates',
      'contact',
    ]);
    expect(new Set(d.sections.map((section) => section.id)).size).toBe(7);
  });
  it('contains four distinct owner-described outputs and categories', () => {
    expect(d.projects).toHaveLength(4);
    expect(new Set(d.projects.map((project) => project.id)).size).toBe(4);
    for (const project of d.projects) {
      expect(d.work.filters).toContain(project.category);
      expect(project.scope.length).toBeGreaterThan(30);
      expect(project.role).toBeTruthy();
    }
  });
  it('contains four credentials and four skill domains', () => {
    expect(d.credentials).toHaveLength(4);
    expect(d.skills.domains).toHaveLength(4);
    expect(new Set(d.credentials.map((credential) => credential.id)).size).toBe(4);
  });
  it('preserves supplied chronology, milestones and contact options', () => {
    expect(d.education.timeline[1]?.date).toBe('2024 – 2025');
    expect(d.hero.metrics[1]?.value).toBe('1,000+');
    expect(d.hero.metrics[1]?.note).toContain('2026');
    expect(d.contact.subjects).toHaveLength(3);
    expect(d.identity.email).toBe('bobitasstem@gmail.com');
  });
  it('keeps demo data separate from claims', () => {
    expect(d.previews.marketing.disclaimer).toContain('not campaign results');
    expect(d.previews.operations.disclaimer).toContain('no government records');
    expect(d.audio.demoNote).toContain('Silent');
  });
  it('resolves every section', () => {
    for (const section of d.sections) expect(getSection(section.id)).toBe(section);
  });
});
