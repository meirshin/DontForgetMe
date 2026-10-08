import { renderToStaticMarkup } from 'react-dom/server';
import { App } from './App';
import { pageMeta } from './content';
import { SITE_URL, absoluteUrl, type Lang, type Route } from './site';

export { routes, pathOf } from './site';

const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const langs: Lang[] = ['en', 'he'];
const locales: Record<Lang, string> = { en: 'en_US', he: 'he_IL' };

function renderHead(route: Route) {
  const { title, description } = pageMeta(route);
  const url = absoluteUrl(route);
  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...langs.map(
      lang =>
        `<link rel="alternate" hreflang="${lang}" href="${absoluteUrl({ ...route, lang })}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${absoluteUrl({ ...route, lang: 'en' })}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/og-${route.lang}.png" />`,
    `<meta property="og:image:width" content="1024" />`,
    `<meta property="og:image:height" content="500" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta property="og:locale" content="${locales[route.lang]}" />`,
  ].join('\n    ');
}

export function render(route: Route) {
  return {
    html: renderToStaticMarkup(<App route={route} />),
    head: renderHead(route),
    lang: route.lang,
    dir: route.lang === 'he' ? 'rtl' : 'ltr',
  };
}
