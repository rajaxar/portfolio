#!/usr/bin/env node
/**
 * The share cards: the site itself, at the ratio link previews want.
 *
 * These used to be designed in HTML (scripts/og-cards.html, since deleted). They
 * are screenshots now, because a preview that shows the actual page tells a
 * reader more than a card about the page does — and because the designed version
 * kept drifting from the site.
 *
 * Two rules worth keeping:
 *
 *  1. 1600x838 IS 1.910:1. A viewport at that ratio means a plain screen grab
 *     already has the card's shape, so nothing is cropped by guesswork.
 *  2. THE FRONT SCREEN ONLY. Anything further down the page is animated in, and
 *     a headless browser does not finish those animations — the NBA story's
 *     many-lines step sat for 16 seconds with every path at
 *     `stroke-dashoffset: 813` (its full length) and opacity 0.1, so the card
 *     captured an empty chart frame. That is why the NBA card is the story's
 *     title art multiplied onto the story's own paper colour instead: multiply
 *     is how the site overprints, and it makes the art's white ground vanish
 *     into the ink field.
 *
 * Run: `npm run cards` (needs a Chrome; set CHROME_PATH if it is not in the
 * usual place). Writes public/og/*.jpg — commit them, they are what ships.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const puppeteer = require('puppeteer-core');
const { startServer } = require('./serve');

const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const OUT = path.join(ROOT, 'public', 'og');
const PORT = 3459;

// 1600x838 = 1.910:1, the card's shape. The grab is taken at 2x and reduced.
const FRAME = { width: 1600, height: 838 };
const CARD = { width: 1200, height: 630 };

// The NBA card's own field: the story's wrapper background (nba_contract.js)
const NBA_PAPER = '#f6eee3';

// Same search as the prerender step; kept local so neither script can break the
// other while they are being edited.
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
].filter(Boolean);

const hasSips = () => {
  try { execFileSync('sips', ['--version'], { stdio: 'ignore' }); return true; } catch { return false; }
};

/** Down to exactly 1200x630. sips ships with macOS; without it, capture at 1x. */
function reduce(raw, out) {
  if (hasSips()) {
    execFileSync('sips', ['-z', String(CARD.height), String(CARD.width), '-s', 'format', 'jpeg', '-s', 'formatOptions', '90', raw, '--out', out], { stdio: 'ignore' });
  } else {
    fs.copyFileSync(raw, out);
  }
  const kb = Math.round(fs.statSync(out).size / 1024);
  const dim = hasSips()
    ? execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', out]).toString().match(/\d+/g).slice(-2).join('x')
    : 'unknown';
  console.log(`  ${path.relative(ROOT, out).padEnd(38)} ${dim.padEnd(9)} ${kb} KB`);
  if (kb > 300) console.warn(`    ⚠ ${kb} KB — heavy for a preview; a slow image is how a link shows no card at all`);
}

async function main() {
  if (!fs.existsSync(path.join(BUILD, 'index.html'))) {
    console.error('make-cards: no build/ — run `npm run build` first');
    process.exit(1);
  }
  const chrome = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
  if (!chrome) {
    console.error('make-cards: no Chrome found (set CHROME_PATH)');
    process.exit(1);
  }

  const tmp = path.join(ROOT, 'node_modules', '.cache', 'cards');
  fs.mkdirSync(tmp, { recursive: true });
  const server = await startServer({ root: BUILD, base: '', port: PORT });
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--mute-audio'],
  });

  console.log('cards:');
  try {
    // ── the two front screens ──
    // `scroll` is part of the composition, not an afterthought: at scroll 0 the
    // survivor hero leaves a dead band under the nav and slices its three-column
    // block with the bottom edge.
    for (const { card, route, scroll } of [
      { card: 'home', route: '/', scroll: 0 },
      { card: 'survivor-diversity', route: '/survivor-diversity/', scroll: 180 },
    ]) {
      const page = await browser.newPage();
      await page.setViewport({ ...FRAME, deviceScaleFactor: 2 });
      await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.waitForFunction(() => document.querySelector('#root')?.children.length > 0, { timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      await new Promise((r) => setTimeout(r, 1200)); // let the mount animations land
      if (scroll) {
        await page.evaluate((y) => {
          const host = Array.from(document.querySelectorAll('div')).find((d) => getComputedStyle(d).overflowY === 'auto' && d.scrollHeight > d.clientHeight + 4);
          if (host) { host.style.scrollBehavior = 'auto'; host.scrollTop = y; }
        }, scroll);
        await new Promise((r) => setTimeout(r, 900));
      }
      const raw = path.join(tmp, `${card}.png`);
      await page.screenshot({ path: raw, clip: { x: 0, y: 0, width: FRAME.width, height: FRAME.height } });
      reduce(raw, path.join(OUT, `${card}.jpg`));
      await page.close();
    }

    // ── the NBA card: the story's title art, multiplied onto its paper ──
    // Composed in the browser rather than an image library, and with the same
    // blend the site itself uses.
    const art = 'http://127.0.0.1:' + PORT + '/title_nba.png';
    const page = await browser.newPage();
    await page.setViewport({ ...CARD, deviceScaleFactor: 2 });
    await page.setContent(`<!DOCTYPE html><html><body style="margin:0">
      <div style="width:${CARD.width}px;height:${CARD.height}px;background:${NBA_PAPER};display:flex;align-items:center;justify-content:center">
        <img src="${art}" style="width:${Math.round(CARD.width * 0.883)}px;mix-blend-mode:multiply" alt="">
      </div></body></html>`);
    await page.waitForFunction(() => { const i = document.querySelector('img'); return i && i.complete && i.naturalWidth > 0; }, { timeout: 20000 });
    const raw = path.join(tmp, 'nba-contract-year.png');
    await page.screenshot({ path: raw });
    reduce(raw, path.join(OUT, 'nba-contract-year.jpg'));
    await page.close();
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`\nWritten to public/og/ — commit them; the deploy copies this folder as-is.`);
}

main().catch((err) => { console.error('make-cards failed:', err && err.message); process.exit(1); });
