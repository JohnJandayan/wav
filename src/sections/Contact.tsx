import { useRef, useState, type FormEvent } from 'react';
import { portfolioData as d } from '../data/portfolioData';
import {
  buildDraft,
  copyText,
  validateInquiry,
  type Inquiry,
  type InquiryErrors,
} from '../lib/contact';
import { SectionHeading } from '../components/SectionHeading';
import { Icon } from '../components/Icon';
export function Contact() {
  const [value, setValue] = useState<Inquiry>({
    name: '',
    email: '',
    subject: d.contact.subjects[0] ?? '',
    message: '',
  });
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [draft, setDraft] = useState<ReturnType<typeof buildDraft> | null>(null);
  const [status, setStatus] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const toastTrigger = useRef<HTMLElement | null>(null);
  const rememberTrigger = () => {
    toastTrigger.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
  };
  const update = (field: keyof Inquiry, text: string) => {
    setValue((previous) => ({ ...previous, [field]: text }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setDraft(null);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateInquiry(value);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const field = Object.keys(nextErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
      return;
    }
    const result = buildDraft(value);
    rememberTrigger();
    setDraft(result);
    setStatus(result.tooLong ? d.contact.longDraft : d.contact.draftReady);
    if (!result.tooLong) window.location.href = result.uri;
  };
  const copyEmail = async () => {
    rememberTrigger();
    setStatus((await copyText(d.identity.email)) ? d.contact.copied : d.contact.copyFailed);
  };
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="contact-atmosphere" aria-hidden="true">
        <div className="horizon horizon-emerald" />
        <div className="horizon horizon-coral" />
      </div>
      <div className="container section">
        <SectionHeading id="contact" />
        <div className="contact-grid">
          <div className="contact-information">
            <h3 className="editorial-heading">{d.contact.headline}</h3>
            <p className="contact-intro">{d.contact.intro}</p>
            <div className="contact-channel">
              <span className="small-mono">{d.contact.emailLabel}</span>
              <a className="email-link" href={`mailto:${d.identity.email}`}>
                {d.identity.email}
              </a>
              <button
                type="button"
                className="text-link copy-email"
                onClick={() => void copyEmail()}
              >
                <Icon name="copy" size={15} />
                {d.contact.copy}
              </button>
            </div>
            <div className="contact-channel">
              <span className="small-mono">{d.contact.socialLabel}</span>
              <a
                href={d.identity.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                {d.identity.handle}
                <Icon name="external" size={16} />
              </a>
            </div>
            <div className="contact-channel">
              <span className="small-mono">{d.contact.locationLabel}</span>
              <p>
                <Icon name="location" size={16} />
                {d.identity.location}
              </p>
              <small>{d.contact.availability}</small>
            </div>
          </div>
          <form ref={formRef} className="inquiry-form" onSubmit={submit} noValidate>
            <h3>{d.contact.formTitle}</h3>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="inquiry-name">{d.contact.name}</label>
                <input
                  id="inquiry-name"
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  required
                  placeholder={d.contact.namePlaceholder}
                  value={value.name}
                  onChange={(event) => update('name', event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p className="field-error" id="name-error">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="inquiry-email">{d.contact.email}</label>
                <input
                  id="inquiry-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  placeholder={d.contact.emailPlaceholder}
                  value={value.email}
                  onChange={(event) => update('email', event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p className="field-error" id="email-error">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="inquiry-subject">{d.contact.subject}</label>
              <select
                id="inquiry-subject"
                name="subject"
                value={value.subject}
                onChange={(event) => update('subject', event.target.value)}
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
              >
                {d.contact.subjects.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
              {errors.subject && (
                <p className="field-error" id="subject-error">
                  {errors.subject}
                </p>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="inquiry-message">{d.contact.message}</label>
              <textarea
                id="inquiry-message"
                name="message"
                rows={5}
                required
                maxLength={5000}
                placeholder={d.contact.messagePlaceholder}
                value={value.message}
                onChange={(event) => update('message', event.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <p className="field-error" id="message-error">
                  {errors.message}
                </p>
              )}
            </div>
            <button className="button button-glow" type="submit">
              {d.contact.submit}
              <Icon name="arrow" size={17} />
            </button>
            <p className="form-hint">{d.contact.hint}</p>
            {draft && (
              <div className="draft-fallback">
                <label htmlFor="draft-text">{d.contact.fallbackLabel}</label>
                <p>{d.contact.fallbackHint}</p>
                <textarea id="draft-text" readOnly rows={6} value={draft.text} />
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    rememberTrigger();
                    void copyText(draft.text).then((copied) =>
                      setStatus(copied ? d.contact.draftCopied : d.contact.draftCopyFailed),
                    );
                  }}
                >
                  <Icon name="copy" size={14} />
                  {d.contact.copyDraft}
                </button>
              </div>
            )}
          </form>
        </div>
        <div
          className={`contact-status ${status ? 'status-visible' : ''}`}
          role="status"
          aria-live="polite"
        >
          <span>{status}</span>
          {status && (
            <button
              type="button"
              className="toast-close"
              aria-label={d.ui.close}
              onClick={() => {
                setStatus('');
                toastTrigger.current?.focus({ preventScroll: true });
              }}
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
