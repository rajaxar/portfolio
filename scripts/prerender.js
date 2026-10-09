/**
 * Bake each route's HTML at build time.
 *
 * The site is a single-page app, so until now every address served the same
 * 981-byte shell: one title, one CRA-default description, and a body whose only
 * text was "You need to enable JavaScript to run this app." Googlebot renders
 * JS, but it sees one page with one title, and the link scrapers behind every
 * share card do not render JS at all — which is why shared links showed the
 * React logo: there was no og:image to find, so they fell back to the icon.
 *
 * This step serves the built site, loads each address in a real browser, lets
 * React write its head (src/lib/seo.js) and its copy, and writes the resulting
 * HTML back over the shell. The result is still the same app — it loads, hydrates
 * and behaves exactly as before — but the words, the title, the canonical and
 * the share card are in the file a crawler is handed.
 *
 * Runs as `postbuild`, so `npm run build` and `npm run deploy` both get it.
 * Addresses come from public/sitemap.xml, which is the list of what exists.
 *
 * Chrome: puppeteer-core drives a browser you already have. If none is found
 * the step skips loudly rather than failing the build.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { startServer } = require('./serve');

const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const PORT = 3457;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
].filter(Boolean);

function findChrome() {
  return CHROME_CANDIDATES.find((p) => fs.existsSync(p));
}

/** Every address in the sitemap, as a path and the file it should be written to. */
function routes() {
  const xml = fs.readFileSync(path.join(ROOT, 'public', 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  return locs.map((loc) => {
    const url = new URL(loc);
    const p = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
    const rel = p.replace(/^\/+/, '');
    return { path: p, file: rel ? path.join(rel, 'index.html') : 'index.html', loc };
  });
}

async function main() {
  if (!fs.existsSync(path.join(BUILD, 'index.html'))) {
    console.error('prerender: no build/ — run `npm run build` first (postbuild does this for you)');
    process.exit(1);
  }

  const chrome = findChrome();
  if (!chrome) {
    console.warn('\n⚠  PRERENDER SKIPPED: no Chrome found (set CHROME_PATH).');
    console.warn('   The site will still work, but every address will be served the');
    console.warn('   empty shell — no per-page title, description, canonical or share card.\n');
    return;
  }

  const list = routes();
  const server = await startServer({ root: BUILD, base: '', port: PORT });
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--mute-audio'],
  });

  const written = [];
  try {
    for (const route of list) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(`http://127.0.0.1:${PORT}${route.path}`, { waitUntil: 'networkidle0', timeout: 60000 });

      // React has to have rendered the surface (so the story copy is in the DOM)
      // and written its head before the document is worth serialising.
      await page.waitForFunction(
        () => document.querySelector('#root') && document.querySelector('#root').children.length > 0,
        { timeout: 30000 }
      );
      await page.waitForFunction(() => !!document.querySelector('title')?.textContent, { timeout: 15000 });
      await new Promise((r) => setTimeout(r, 500)); // fonts settle; no layout thrash after this

      let html = await page.content();
      if (!/^\s*<!DOCTYPE/i.test(html)) html = '<!DOCTYPE html>\n' + html;

      const out = path.join(BUILD, route.file);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, html);

      const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '(none)';
      const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/i) || [])[1] || '(none)';
      const ogImage = /property="og:image"/.test(html);
      // A crude word count of the served body, script/style stripped — the thing
      // that was one sentence before this step existed.
      const body = (html.split(/<body[^>]*>/i)[1] || '')
        .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      written.push({
        path: route.path,
        file: path.relative(BUILD, out),
        bytes: html.length,
        words: body.split(' ').filter(Boolean).length,
        title,
        canonical,
        ogImage,
        ok: canonical === route.loc && ogImage,
      });

      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  // Unknown addresses on a static host land on 404.html; give them the app
  // rather than the host's default page.
  const home = path.join(BUILD, 'index.html');
  fs.copyFileSync(home, path.join(BUILD, '404.html'));

  console.log('\nprerendered:');
  for (const w of written) {
    console.log(
      `  ${w.ok ? '✓' : '✗'} ${w.path.padEnd(20)} ${String(w.bytes).padStart(6)}b  ${String(w.words).padStart(4)} words  "${w.title}"`
    );
  }
  console.log(`  404.html = copy of the front sheet\n`);
  if (written.some((w) => !w.ok)) {
    console.warn('⚠  some routes lost their canonical or share card — check src/lib/seo.js\n');
  }
}

main().catch((err) => {
  console.error('prerender failed:', err && err.message);
  process.exit(1);
});
