// Used only by the dev server. Production pages are prerendered to static HTML
// (see scripts/prerender.js) and ship without client-side JavaScript.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { pageMeta } from './content';
import { routeOf } from './site';
import './styles.css';

const route = routeOf(
  location.pathname.slice(import.meta.env.BASE_URL.length),
);
document.documentElement.lang = route.lang;
document.documentElement.dir = route.lang === 'he' ? 'rtl' : 'ltr';
document.title = pageMeta(route).title;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App route={route} />
  </StrictMode>,
);
