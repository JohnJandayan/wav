import { portfolioData as d } from '../data/portfolioData';
export interface Inquiry {
  name: string;
  email: string;
  subject: string;
  message: string;
}
export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;
export function validateInquiry(value: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!value.name.trim() || value.name.length > 100 || /[\r\n]/.test(value.name))
    errors.name = d.contact.errors.name;
  if (value.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email))
    errors.email = d.contact.errors.email;
  if (!d.contact.subjects.includes(value.subject)) errors.subject = d.contact.errors.subject;
  if (!value.message.trim() || value.message.length > 5000)
    errors.message = d.contact.errors.message;
  return errors;
}
export function buildDraft(value: Inquiry): { uri: string; text: string; tooLong: boolean } {
  const body = `${d.contact.draftIntro} ${value.name.trim()}\n${d.contact.email}: ${value.email.trim()}\n\n${value.message.trim()}`;
  const text = `${d.contact.subject}: ${value.subject}\n\n${body}`;
  const uri = `mailto:${d.identity.email}?subject=${encodeURIComponent(value.subject)}&body=${encodeURIComponent(body)}`;
  return { uri, text, tooLong: uri.length > 1900 };
}
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
export function safeUrl(
  value: string | null,
  kind: 'asset' | 'external' = 'external',
): string | null {
  if (
    !value ||
    value.includes('\\') ||
    Array.from(value).some((character) => character.charCodeAt(0) < 32)
  )
    return null;
  if (kind === 'asset' && value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? value : null;
  } catch {
    return null;
  }
}
