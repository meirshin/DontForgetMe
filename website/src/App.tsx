import { content, type Block, type Content } from './content';
import {
  CONTACT_EMAIL,
  DEVELOPER,
  PLAY_URL,
  POLICY_UPDATED,
  href,
  type Lang,
  type Route,
} from './site';

const icon = `${import.meta.env.BASE_URL}icon.png`;

export function App({ route }: { route: Route }) {
  const t = content[route.lang];
  const other: Route = { ...route, lang: route.lang === 'en' ? 'he' : 'en' };

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skipToContent}
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href={href({ lang: route.lang, page: 'home' })}>
            <img src={icon} alt="" width={32} height={32} />
            <span>{t.appName}</span>
          </a>
          <nav className="nav">
            <a
              href={href({ lang: route.lang, page: 'privacy' })}
              aria-current={route.page === 'privacy' ? 'page' : undefined}
            >
              {t.nav.privacy}
            </a>
            <a href={href(other)} hrefLang={other.lang} lang={other.lang}>
              {t.nav.otherLang}
            </a>
          </nav>
        </div>
      </header>

      <main id="main" className="container">
        {route.page === 'home' ? (
          <Home t={t} lang={route.lang} />
        ) : (
          <Privacy t={t} lang={route.lang} />
        )}
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>
            © {POLICY_UPDATED.getUTCFullYear()} {DEVELOPER}. {t.footer}
          </span>
          <a href={href({ lang: route.lang, page: 'privacy' })}>
            {t.nav.privacy}
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </footer>
    </>
  );
}

interface PageProps {
  t: Content;
  lang: Lang;
}

function Home({ t, lang }: PageProps) {
  const h = t.home;
  return (
    <>
      <section className="hero">
        <img src={icon} alt="" width={112} height={112} />
        <h1>{t.appName}</h1>
        <p className="tagline">{h.tagline}</p>
        <p>{h.intro}</p>
        <a className="button" href={`${PLAY_URL}&hl=${lang}`} rel="noopener">
          {h.cta}
        </a>
        <p className="muted">{h.badges}</p>
      </section>

      <section aria-labelledby="how">
        <h2 id="how">{h.howTitle}</h2>
        <ol className="steps">
          {h.steps.map(s => (
            <li key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="features">
        <h2 id="features">{h.featuresTitle}</h2>
        <ul className="cards">
          {h.features.map(f => (
            <li key={f.title} className="card">
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="permissions">
        <h2 id="permissions">{h.permissionsTitle}</h2>
        <dl className="permissions">
          {t.permissions.map(p => (
            <div key={p.name}>
              <dt>{p.name}</dt>
              <dd>{p.why}</dd>
            </div>
          ))}
        </dl>
        <p className="muted">{h.permissionsNote}</p>
      </section>

      <section className="notice" aria-labelledby="disclaimer">
        <h2 id="disclaimer">{h.disclaimerTitle}</h2>
        <p>{h.disclaimer}</p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact">{h.contactTitle}</h2>
        <p>
          {h.contact} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </section>
    </>
  );
}

function Privacy({ t, lang }: PageProps) {
  const p = t.privacy;
  const updated = new Intl.DateTimeFormat(lang === 'he' ? 'he-IL' : 'en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(POLICY_UPDATED);

  return (
    <article className="policy">
      <h1>{p.title}</h1>
      <p className="muted">
        {p.subtitle}
        <br />
        {p.updated}{' '}
        <time dateTime={POLICY_UPDATED.toISOString().slice(0, 10)}>
          {updated}
        </time>
      </p>
      <p>{p.intro}</p>
      {p.sections.map(s => (
        <section key={s.title}>
          <h2>{s.title}</h2>
          {s.blocks.map(renderBlock)}
        </section>
      ))}
      <section>
        <h2>{p.contactTitle}</h2>
        <p>
          {p.contact} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </section>
    </article>
  );
}

function renderBlock(block: Block, i: number) {
  return typeof block === 'string' ? (
    <p key={i}>{block}</p>
  ) : (
    <ul key={i}>
      {block.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
