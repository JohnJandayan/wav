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
        {source && !failed ? (
          <div className="certificate-image">
            {!loaded && <p role="status">{d.vault.loading}</p>}
            <img
              src={source}
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
            <p>{d.vault.missing}</p>
          </div>
        )}
      </div>
    </dialog>
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
        {d.credentials.map((credential, i) => (
          <button
            className={`credential-card ${i === 0 ? 'credential-featured' : ''}`}
            type="button"
            key={credential.id}
            onClick={() => setSelected(credential)}
            aria-label={`${d.vault.view}: ${credential.title}`}
          >
            <div className="credential-top">
              <span className="document-glyph" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="small-mono">0{i + 1}</span>
            </div>
            <span className="credential-type">{credential.type}</span>
            <h3>{credential.shortTitle}</h3>
            <p>{credential.title}</p>
            <span className="credential-action">
              {d.vault.view}
              <Icon name="external" size={16} />
            </span>
          </button>
        ))}
      </div>
      <p className="work-evidence">{d.vault.provenance}</p>
      {selected && <CredentialDialog credential={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
