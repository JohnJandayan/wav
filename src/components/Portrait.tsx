import { useState } from 'react';
import { PROFILE_IMAGE_URL, portfolioData as d } from '../data/portfolioData';
import { safeUrl } from '../lib/contact';
export function Portrait({ large = false }: { large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const source = safeUrl(PROFILE_IMAGE_URL, 'asset');
  return (
    <div
      className={`portrait ${large ? 'portrait-large' : ''}`}
      aria-busy={Boolean(source && !loaded && !failed)}
    >
      <div className="portrait-rings" aria-hidden="true" />
      {(!source || !loaded || failed) && (
        <div className="portrait-monogram" aria-label={d.identity.portraitLabel}>
          <span>{d.identity.initials}</span>
          <i>{d.identity.artist}</i>
        </div>
      )}
      {source && !failed && (
        <img
          src={source}
          alt={d.identity.portraitAlt}
          width={400}
          height={500}
          loading={large ? 'lazy' : 'eager'}
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
      {large && (
        <div className="portrait-caption">
          <span>{d.identity.name}</span>
          <small>{failed ? d.identity.portraitError : d.identity.portraitMissing}</small>
        </div>
      )}
    </div>
  );
}
