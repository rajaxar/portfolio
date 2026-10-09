/**
 * A static server, for the build step and for generating the share cards.
 *
 * Two jobs, one implementation:
 *
 *  - `prerender.js` serves `build/` under the site's base path (/portfolio) so
 *    the routed HTML and the absolute asset URLs resolve exactly as they will
 *    on GitHub Pages.
 *  - `scripts/og-cards.html` is served from the repo root so its local font
 *    files load — @font-face over file:// is blocked as a cross-origin request,
 *    which would silently render the cards in a fallback face.
 *
 * No dependencies. Everything unknown falls through to index.html, which is what
 * the Pages host does for a single-page app.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.csv': 'text/csv; charset=utf-8',
  '.mp4': 'video/mp4',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function startServer({ root, base = '', port = 3456 }) {
  const basePath = base.replace(/\/+$/, '');
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let rel = url;

    if (basePath && rel.startsWith(basePath)) rel = rel.slice(basePath.length);
    rel = rel.replace(/^\/+/, '');

    let file = path.join(root, rel);

    // A directory or a route with no extension: serve its index.html, and if
    // there is none, fall back to the root one (single-page app behaviour).
    if (!rel || rel.endsWith('/') || !path.extname(rel)) {
      const asDir = path.join(root, rel, 'index.html');
      if (fs.existsSync(asDir) && fs.statSync(asDir).isFile()) file = asDir;
      else if (rel && !rel.endsWith('/')) {
        const asFile = path.join(root, rel);
        if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) file = asFile;
        else file = path.join(root, 'index.html');
      } else {
        file = path.join(root, 'index.html');
      }
    }

    // Never serve outside the root.
    if (!path.resolve(file).startsWith(path.resolve(root))) {
      res.writeHead(403).end('forbidden');
      return;
    }

    fs.readFile(file, (err, buf) => {
      if (err) {
        res.writeHead(404, { 'content-type': 'text/plain' }).end('not found: ' + rel);
        return;
      }
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(buf);
    });
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

module.exports = { startServer };

// `node scripts/serve.js <root> [base] [port]`
if (require.main === module) {
  const [root = '.', base = '', port = '3456'] = process.argv.slice(2);
  startServer({ root, base, port: Number(port) }).then(() => {
    console.log(`serving ${root} at http://127.0.0.1:${port}${base}/`);
  });
}
