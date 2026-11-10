import { describe, expect, it, vi } from 'vitest';
import { buildDraft, copyText, safeUrl, validateInquiry, type Inquiry } from './contact';
import { portfolioData as d } from '../data/portfolioData';
const valid: Inquiry = {
  name: 'Thad & Team',
  email: 'team@example.com',
  subject: d.contact.subjects[0] ?? '',
  message: 'Let’s collaborate & build #culture?\nA second line.',
};
describe('inquiry contract', () => {
  it('accepts valid values', () => expect(validateInquiry(valid)).toEqual({}));
  it('rejects empty fields and unlisted subjects', () =>
    expect(
      Object.keys(validateInquiry({ name: '', email: 'bad', subject: 'Other', message: ' ' })),
    ).toEqual(['name', 'email', 'subject', 'message']));
  it('bounds fields and blocks newline names', () => {
    expect(
      validateInquiry({ ...valid, name: 'a'.repeat(101), message: 'a'.repeat(5001) }),
    ).toHaveProperty('name');
    expect(validateInquiry({ ...valid, name: 'Name\nBcc: x' })).toHaveProperty('name');
  });
  it('encodes subject and body without recipient injection', () => {
    const draft = buildDraft(valid);
    expect(draft.uri.startsWith(`mailto:${d.identity.email}?subject=`)).toBe(true);
    const parameters = new URLSearchParams(draft.uri.split('?')[1]);
    expect(parameters.get('subject')).toBe(valid.subject);
    expect(parameters.get('body')).toContain(valid.message);
    expect(parameters.get('body')).toContain(valid.name);
    expect(draft.uri).not.toContain('&build');
  });
  it('marks long drafts for the manual fallback', () =>
    expect(buildDraft({ ...valid, message: 'A'.repeat(3000) }).tooLong).toBe(true));
  it('trims draft fields', () =>
    expect(buildDraft({ ...valid, name: ' Person ', message: ' Message ' }).text).toContain(
      'Person\n',
    ));
});
describe('safe optional links', () => {
  it.each([
    null,
    '',
    '#',
    'javascript:alert(1)',
    'data:image/svg+xml,a',
    '//evil.example',
    'http://example.com',
  ])('rejects %s', (value) => expect(safeUrl(value)).toBeNull());
  it('accepts HTTPS external links', () =>
    expect(safeUrl(d.identity.instagram)).toBe(d.identity.instagram));
  it('allows local asset paths only for assets', () => {
    expect(safeUrl('/portrait.webp', 'asset')).toBe('/portrait.webp');
    expect(safeUrl('/portrait.webp')).toBeNull();
  });
});
describe('clipboard feedback', () => {
  it('returns success only after a write', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    expect(await copyText('email')).toBe(true);
    expect(writeText).toHaveBeenCalledWith('email');
  });
  it('handles clipboard denial', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('Denied')) },
    });
    expect(await copyText('email')).toBe(false);
  });
  it('handles missing clipboard', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    expect(await copyText('email')).toBe(false);
  });
});

describe('asset origin safety', () => {
  it('rejects backslash and control-character URL normalization', () => {
    expect(
      safeUrl('/' + String.fromCharCode(92) + 'external.example/image.webp', 'asset'),
    ).toBeNull();
    expect(safeUrl('/\n/external.example/image.webp', 'asset')).toBeNull();
  });
});
