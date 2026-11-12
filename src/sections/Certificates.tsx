import { useEffect, useRef, useState } from 'react';
import { portfolioData as d, type Credential } from '../data/portfolioData';
import { safeUrl } from '../lib/contact';
import { SectionHeading } from '../components/SectionHeading';
import { Icon } from '../components/Icon';
function CredentialDialog({
  credential,
  onClose,
}: {
  credential: Credential;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const source = safeUrl(credential.image, 'asset');
  const documentUrl = safeUrl(credential.document, 'asset');
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    closeRef.current?.focus();
    return () => {
      dialog?.close();
      trigger?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="credential-dialog"
      aria-labelledby="credential-title"
      aria-describedby="credential-description"
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const items = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button, a[href], input, select, textarea, [tabindex="0"]',
          ),
        ).filter((item) => !item.hasAttribute('disabled'));
        const first = items[0];
        const last = items.at(-1);
        if (
          items.length === 1 ||
          (event.shiftKey && document.activeElement === first) ||
          (!event.shiftKey && document.activeElement === last)
        ) {
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-content">
        <div className="dialog-top">
          <span className="small-mono">{d.vault.document}</span>
          <button
            type="button"
            ref={closeRef}
            className="icon-button"
            onClick={onClose}
            aria-label={d.vault.close}
          >
            <Icon name="close" />
          </button>
        </div>
        <h3 id="credential-title">{credential.title}</h3>
        <p id="credential-description">{credential.summary}</p>
        {credential.details && (
          <dl className="certificate-details">
            <div>
              <dt>{d.vault.issued}</dt>
              <dd>{credential.details.issued}</dd>
            </div>
            <div>
              <dt>{d.vault.training}</dt>
              <dd>{credential.details.training}</dd>
            </div>
            <div>
              <dt>{d.vault.credentialId}</dt>
              <dd>{credential.details.credentialId}</dd>
            </div>
          </dl>
        )}
        {source && !failed ? (
          <div className="certificate-image">
            {!loaded && <p role="status">{d.vault.loading}</p>}
            <img
              src={source}
              width={1684}
              height={1191}
              alt={`${d.vault.imageAlt} ${credential.title}`}
              onError={() => setFailed(true)}
              onLoad={() => setLoaded(true)}
            />
          </div>
        ) : (
          <div className="certificate-empty">
            <span className="document-glyph" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <strong>{failed ? d.vault.failed : d.vault.missingTitle}</strong>
            <p>{documentUrl ? d.vault.pdfFallback : d.vault.missing}</p>
          </div>
        )}
        {documentUrl && (
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link certificate-pdf-link"
          >
            {d.vault.openPdf}
            <Icon name="external" size={16} />
          </a>
        )}
      </div>
    </dialog>
  );
}
function CredentialCard({
  credential,
  index,
  onSelect,
}: {
  credential: Credential;
  index: number;
  onSelect: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const source = safeUrl(credential.image, 'asset');
  return (
    <button
      className={`credential-card ${index === 0 ? 'credential-featured' : ''} ${source ? 'credential-with-image' : ''}`}
      type="button"
      onClick={onSelect}
      aria-label={`${d.vault.view}: ${credential.title}`}
    >
      <div className="credential-top">
        {source ? (
          <span className="credential-attached">{d.vault.attached}</span>
        ) : (
          <span className="document-glyph" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
        <span className="small-mono">0{index + 1}</span>
      </div>
      {source && !failed && (
        <img
          className="credential-thumbnail"
          src={source}
          alt=""
          width={1684}
          height={1191}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      <span className="credential-type">{credential.type}</span>
      <h3>{credential.shortTitle}</h3>
      <p>{credential.title}</p>
      <span className="credential-action">
        {d.vault.view}
        <Icon name="external" size={16} />
      </span>
    </button>
  );
}
export function Certificates() {
  const [selected, setSelected] = useState<Credential | null>(null);
  return (
    <section
      id="certificates"
      className="section container"
      aria-labelledby="certificates-title"
      tabIndex={-1}
    >
      <SectionHeading id="certificates" intro={d.vault.intro} />
      <div className="credential-grid">
        {d.credentials.map((credential, index) => (
          <CredentialCard
            key={credential.id}
            credential={credential}
            index={index}
            onSelect={() => setSelected(credential)}
          />
        ))}
      </div>
      <p className="work-evidence">{d.vault.provenance}</p>
      {selected && <CredentialDialog credential={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
