#!/usr/bin/env node
// Adjust the <base href> in docs/index.html after production build for local preview.
// We rewrite '/expenses/' to '/' so assets resolve from server root.
const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'docs', 'index.html');
if (!fs.existsSync(file)) {
  console.error('[adjust-base] index.html not found at', file);
  process.exit(1);
}
let html = fs.readFileSync(file, 'utf8');
const originalTag = '<base href="/expenses/">';
const targetTag = '<base href="/">';
if (html.includes(originalTag)) {
  html = html.replace(originalTag, targetTag);
  fs.writeFileSync(file, html, 'utf8');
  console.log('[adjust-base] Replaced base tag for preview:', targetTag);
} else {
  console.log('[adjust-base] Original base tag not found; skipping');
}