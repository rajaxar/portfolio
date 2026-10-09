/**
 * The site's addresses, and the head each one prints.
 *
 * Until now the whole site was one URL with a query parameter deciding what
 * rendered: `?ref=nba_contract`, `?ref=survivor`. That is fine for a reader and
 * fatal for a crawler — search engines collapse query parameters on a single
 * page, so the two stories could never be indexed as themselves, and the
 * prerendered shells all carried the same title. Each surface now owns a real
 * path, its own title, description and share card.
 *
 * The old `?ref=` form still resolves, because every link shared before today
 * (including the ones in the resume) points at it. It is an alias, not a
 * second address: it renders the same page, and the canonical link in the head
 * still names the real path.
 *
 * SITE_URL is the one thing to change if this ever moves to a custom domain —
 * share cards and canonicals have to be absolute, so it cannot be derived from
 * the current location.
 */

export const SITE_URL = 'https://rajshah.me';

// CRA gives "/portfolio" in production and "" in development, so in-app hrefs
// are built from it rather than hardcoded.
const BASE = process.env.PUBLIC_URL || '';

export const ROUTES = {
  home: {
    path: '/',
    title: 'Raj Shah',
    description:
      'Whether NBA players really play better in their contract year, and who gets voted out on Survivor — long-form data pieces by Raj Shah.',
    image: '/og/home.png',
    kind: 'website',
  },
  nba_contract: {
    path: '/nba-contract-year/',
    title: 'Does the NBA’s contract year phenomenon exist? — Raj Shah',
    description:
      'Do NBA players really play better in the final year of their contract? RAPTOR WAR and twenty seasons of salary data, told as a scrolling story.',
    image: '/og/nba-contract-year.png',
    kind: 'article',
  },
  survivor: {
    path: '/survivor-diversity/',
    title: 'Did Survivor’s diversity mandate change who gets voted out? — Raj Shah',
    description:
      'CBS mandated a 50% BIPOC cast. A data story on forty seasons of Survivor: who gets targeted before the merge, and how the casting changed the game.',
    image: '/og/survivor-diversity.png',
    kind: 'article',
  },
};

// The addresses people already have links to.
const LEGACY_REFS = {
  home: 'home',
  nba_contract: 'nba_contract',
  survivor: 'survivor',
};

const strip = (s) => s.replace(/^\/+|\/+$/g, '');

/** Which surface should render for this location — the legacy `?ref=` first. */
export function pageFromLocation(loc = window.location) {
  // The legacy form wins when it is present. Every link shared before the paths
  // existed points at the front sheet's own path with a `?ref=`, and matching
  // the path first swallowed the ref and rendered the front sheet instead.
  const ref = new URLSearchParams(loc.search || '').get('ref');
  if (ref && LEGACY_REFS[ref]) return LEGACY_REFS[ref];

  const path = strip((loc.pathname || '').replace(BASE, ''));
  const byPath = Object.values(ROUTES).find((r) => strip(r.path) === path);
  if (byPath) return routeKey(byPath);

  return 'home';
}

function routeKey(route) {
  return Object.keys(ROUTES).find((k) => ROUTES[k] === route);
}

/** An in-app href, base-prefixed for GitHub Pages. */
export const urlFor = (key) => BASE + (ROUTES[key] || ROUTES.home).path;

/** An absolute URL — what canonicals, og:url and the sitemap need. */
export const absolute = (path) => SITE_URL + (path === '/' ? '/' : path);

export const routeList = () => Object.keys(ROUTES).map((k) => ({ key: k, ...ROUTES[k] }));

// ---------------------------------------------------------------------------
// head

const setMeta = (attr, name, content) => {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsert = (selector, make) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = make();
    document.head.appendChild(el);
  }
  return el;
};

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Raj Shah',
  url: absolute('/'),
  jobTitle: 'Data Scientist',
  sameAs: ['https://www.linkedin.com/in/raj-v-shah/'],
};

const structuredData = (r) =>
  r.kind === 'article'
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: r.title,
        description: r.description,
        image: absolute(r.image),
        url: absolute(r.path),
        author: { '@type': 'Person', name: 'Raj Shah', url: absolute('/') },
      }
    : person;

/**
 * Write this route's head. Called on every page change — including inside the
 * prerenderer, which serialises the document after React has rendered, so what
 * this writes is what a crawler is served.
 */
export function applyHead(key) {
  const r = ROUTES[key] || ROUTES.home;

  document.title = r.title;
  setMeta('name', 'description', r.description);

  setMeta('property', 'og:type', r.kind === 'article' ? 'article' : 'website');
  setMeta('property', 'og:title', r.title);
  setMeta('property', 'og:description', r.description);
  setMeta('property', 'og:url', absolute(r.path));
  setMeta('property', 'og:image', absolute(r.image));
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:site_name', 'Raj Shah');

  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', r.title);
  setMeta('name', 'twitter:description', r.description);
  setMeta('name', 'twitter:image', absolute(r.image));

  upsert('link[rel="canonical"]', () => {
    const l = document.createElement('link');
    l.setAttribute('rel', 'canonical');
    return l;
  }).setAttribute('href', absolute(r.path));

  upsert('script[data-seo="jsonld"]', () => {
    const s = document.createElement('script');
    s.setAttribute('type', 'application/ld+json');
    s.setAttribute('data-seo', 'jsonld');
    return s;
  }).textContent = JSON.stringify(structuredData(r));
}
