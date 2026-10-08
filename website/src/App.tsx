import { content, type Block, type Content } from './content';
import {
  CONTACT_EMAIL,
  DESIGNER_EMAIL,
  DEVELOPER,
  POLICY_UPDATED,
  SOURCE_URL,
  href,
  type Lang,
  type Route,
} from './site';

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;

/** Material Symbols Rounded, subset to these glyphs (src/fonts/symbols.woff2, shared with the app). */
const glyphs = {
  alarm: '\ue855',
  bluetooth_connected: '\ue1a8',
  check_circle: '\uf0be',
  directions_car: '\ueff7',
  directions_walk: '\ue536',
  favorite: '\ue87e',
  info: '\ue88e',
  language: '\uea07',
  mail: '\ue159',
  notifications_active: '\ue7f7',
  open_in_new: '\ue89e',
  play_arrow: '\ue037',
  shield_with_heart: '\ue78f',
  smartphone: '\ue7ba',
  volume_up: '\ue050',
} as const;

function Sym({ name }: { name: keyof typeof glyphs }) {
  return (
    <span className="sym" aria-hidden="true">
      {glyphs[name]}
    </span>
  );
}

const stepIcons = [
  'directions_car',
  'bluetooth_connected',
  'notifications_active',
  'check_circle',
] as const;
const featureIcons = [
  'shield_with_heart',
  'smartphone',
  'alarm',
  'volume_up',
  'language',
  'favorite',
] as const;

export function App({ route }: { route: Route }) {
  const t = content[route.lang];
  const other: Route = { ...route, lang: route.lang === 'en' ? 'he' : 'en' };
  const home = href({ lang: route.lang, page: 'home' });

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skipToContent}
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href={home}>
            <img src={asset('icon.png')} alt="" width={36} height={36} />
            <span>{t.appName}</span>
          </a>
          <nav className="nav">
            <a className="nav-how" href={`${home}#how`}>
              {t.nav.how}
            </a>
            <a
              href={href({ lang: route.lang, page: 'privacy' })}
              aria-current={route.page === 'privacy' ? 'page' : undefined}
            >
              {t.nav.privacy}
            </a>
            <a
              className="lang-switch"
              href={href(other)}
              hrefLang={other.lang}
              lang={other.lang}
            >
              <Sym name="language" />
              {t.nav.otherLang}
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        {route.page === 'home' ? (
          <Home t={t} lang={route.lang} />
        ) : (
          <Privacy t={t} lang={route.lang} />
        )}
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <a className="brand" href={home}>
              <img src={asset('icon.png')} alt="" width={36} height={36} />
              <span>{t.appName}</span>
            </a>
            <p>{t.home.tagline}</p>
          </div>
          <nav className="footer-links">
            <a href={href({ lang: route.lang, page: 'privacy' })}>
              {t.nav.privacy}
            </a>
            <a href={SOURCE_URL}>{t.nav.source}</a>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </nav>
          <a
            className="credit"
            href={`mailto:${DESIGNER_EMAIL}?subject=${encodeURIComponent(t.appName)}`}
            aria-label={`Designed by MM. ${t.contactDesigner}`}
          >
            <span lang="en" dir="ltr">
              Designed by
            </span>
            <img src={asset('credit-mm.png')} alt="" width={56} height={34} />
          </a>
        </div>
        <div className="container footer-bottom">
          © {POLICY_UPDATED.getUTCFullYear()} {DEVELOPER}. {t.footer}
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
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="pulse-dot" aria-hidden="true" />
              {h.eyebrow}
            </p>
            <h1>{h.headline}</h1>
            <p className="lead">{h.tagline}</p>
            <p className="intro">{h.intro}</p>
            <div className="actions">
              <p className="store-badge" aria-label={h.cta}>
                <Sym name="play_arrow" />
                <span aria-hidden="true">
                  <small>{h.ctaSmall}</small>
                  <strong>Google Play</strong>
                </span>
              </p>
              <a className="button-ghost" href="#how">
                {t.nav.how}
              </a>
            </div>
            <ul className="chips">
              {h.badges.map(b => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="hero-visual">
            <div className="halo" aria-hidden="true" />
            <div className="scene">
              <img
                src={asset('hero-loop.webp')}
                alt={h.sceneAlt}
                width={720}
                height={405}
                fetchPriority="high"
              />
            </div>
            <img
              className="notif"
              src={asset(`screens/${lang}-notif.webp`)}
              alt={h.notifAlt}
              width={720}
              height={lang === 'he' ? 258 : 234}
            />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="how">
        <div className="container">
          <h2 id="how" className="section-title">
            {h.howTitle}
          </h2>
          <ol className="steps">
            {h.steps.map((s, i) => (
              <li key={s.title} className="card">
                <span className="step-icon">
                  <Sym name={stepIcons[i]} />
                </span>
                <span className="step-number" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-tint" aria-labelledby="features">
        <div className="container">
          <h2 id="features" className="section-title">
            {h.featuresTitle}
          </h2>
          <ul className="features">
            {h.features.map((f, i) => (
              <li key={f.title} className="card">
                <span className="feature-icon">
                  <Sym name={featureIcons[i]} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="screens">
        <div className="container">
          <h2 id="screens" className="section-title">
            {h.screensTitle}
          </h2>
          <ul className="screens">
            {h.screens.map(s => (
              <li key={s.image}>
                <figure>
                  <div className="phone">
                    <img
                      src={asset(`screens/${lang}-${s.image}.webp`)}
                      alt={`${h.screenAlt} ${s.caption}`}
                      width={540}
                      height={1170}
                      loading="lazy"
                    />
                  </div>
                  <figcaption>{s.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-tint" aria-labelledby="permissions">
        <div className="container narrow">
          <h2 id="permissions" className="section-title">
            {h.permissionsTitle}
          </h2>
          <dl className="permissions card">
            {t.permissions.map(p => (
              <div key={p.name}>
                <dt>{p.name}</dt>
                <dd>{p.why}</dd>
              </div>
            ))}
          </dl>
          <p className="muted note">{h.permissionsNote}</p>

          <aside className="notice" aria-labelledby="disclaimer">
            <span className="notice-icon">
              <Sym name="info" />
            </span>
            <div>
              <h2 id="disclaimer">{h.disclaimerTitle}</h2>
              <p>{h.disclaimer}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section" aria-label={`${h.sourceTitle}, ${h.contactTitle}`}>
        <div className="container duo">
          <div className="card">
            <span className="feature-icon">
              <Sym name="open_in_new" />
            </span>
            <h2>{h.sourceTitle}</h2>
            <p>{h.source}</p>
            <p>
              <a href={SOURCE_URL} dir="ltr">
                {SOURCE_URL.replace('https://', '')}
              </a>
            </p>
          </div>
          <div className="card">
            <span className="feature-icon">
              <Sym name="mail" />
            </span>
            <h2>{h.contactTitle}</h2>
            <p>{h.contact}</p>
            <p>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>
        </div>
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
    <>
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">
            <Sym name="shield_with_heart" />
            {p.subtitle}
          </p>
          <h1>{p.title}</h1>
          <p className="updated">
            {p.updated}{' '}
            <time dateTime={POLICY_UPDATED.toISOString().slice(0, 10)}>
              {updated}
            </time>
          </p>
        </div>
      </section>
      <div className="container narrow">
        <article className="policy card">
          <p className="policy-intro">{p.intro}</p>
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
      </div>
    </>
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
