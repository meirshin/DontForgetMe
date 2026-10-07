export const SITE_URL = 'https://ym987.github.io/DontForgetMe';
export const PLAY_URL =
  'https://play.google.com/store/apps/details?id=io.github.ym987.dontforgetme';
export const DEVELOPER = 'ymark987';
export const CONTACT_EMAIL = 'ymark987@gmail.com';
export const POLICY_UPDATED = new Date('2026-10-07T00:00:00Z');

export type Lang = 'en' | 'he';
export type Page = 'home' | 'privacy';
export interface Route {
  lang: Lang;
  page: Page;
}

export const routes: Route[] = [
  { lang: 'en', page: 'home' },
  { lang: 'en', page: 'privacy' },
  { lang: 'he', page: 'home' },
  { lang: 'he', page: 'privacy' },
];

/** Path relative to the site base, e.g. "he/privacy/". English is the default (root). */
export function pathOf({ lang, page }: Route) {
  return (lang === 'en' ? '' : `${lang}/`) + (page === 'home' ? '' : `${page}/`);
}

export function routeOf(path: string): Route {
  const parts = path.split('/').filter(Boolean);
  const lang: Lang = parts[0] === 'he' ? 'he' : 'en';
  const page = lang === 'en' ? parts[0] : parts[1];
  return { lang, page: page === 'privacy' ? 'privacy' : 'home' };
}

export const href = (route: Route) => import.meta.env.BASE_URL + pathOf(route);
export const absoluteUrl = (route: Route) => `${SITE_URL}/${pathOf(route)}`;
