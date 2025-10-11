#!/usr/bin/env node
// Minimal static preview server that emulates GitHub Pages project path /expenses/ locally.
// Serves built assets from docs/ after production build. Rewrites /expenses/* -> /*
// SPA fallback: any /expenses/... 404 returns index.html.
const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5173;
const PROJECT_PATH = '/expenses/';
const ROOT_DIR = path.resolve(__dirname, '..', 'docs');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-cache, no-store, must-revalidate', ...headers });
  res.end(body);
}

function serveFile(res, filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) throw new Error('not file');
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    const stream = fs.createReadStream(filePath);
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
    stream.pipe(res);
  } catch (e) {
    send(res, 404, 'Not Found');
  }
}

function indexHtml() {
  return fs.readFileSync(path.join(ROOT_DIR, 'index.html'));
}

http.createServer((req, res) => {
  let urlPath = decodeURI(req.url.split('?')[0]);
  const original = urlPath;
  // Normalize project path prefix
  if (urlPath.startsWith(PROJECT_PATH)) {
    urlPath = urlPath.substring(PROJECT_PATH.length); // strip '/expenses/'
  } else if (urlPath === '/expenses') {
    urlPath = '';
  }
  // If request begins with '/expenses' but not slash terminated assets case handled above, strip again (defensive)
  if (urlPath.startsWith('/')) {
    // remove leading slash so path.join resolves relative to ROOT_DIR
    urlPath = urlPath.slice(1);
  }
  // Log mapping for debugging
  if (process.env.PREVIEW_DEBUG) {
    console.log('[preview] request:', original, '-> mapped:', urlPath);
  }
  if (urlPath === '' || urlPath === '/' ) {
    // Serve index.html
    if (process.env.PREVIEW_DEBUG) console.log('[preview] serve index.html');
    return send(res, 200, indexHtml(), { 'Content-Type': 'text/html; charset=utf-8' });
  }
  // Attempt static file
  const fsPath = path.join(ROOT_DIR, urlPath);
  if (process.env.PREVIEW_DEBUG) console.log('[preview] static attempt:', fsPath);
  if (fs.existsSync(fsPath) && fs.statSync(fsPath).isFile()) {
    return serveFile(res, fsPath);
  }
  // SPA fallback only for paths that originally had /expenses/ prefix
  return send(res, 200, indexHtml(), { 'Content-Type': 'text/html; charset=utf-8' });
}).listen(PORT, () => {
  console.log(`Preview server running at http://localhost:${PORT}/expenses/ (root: ${ROOT_DIR})`);
});
