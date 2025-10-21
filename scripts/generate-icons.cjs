#!/usr/bin/env node
// Generate PWA icons from SVG source.
// Usage: node scripts/generate-icons.cjs
// Requires: sharp (dev dependency)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcSvg = path.resolve(__dirname, '../public/icons/app-icon.svg');
const outDir = path.resolve(__dirname, '../public/icons');

if (!fs.existsSync(srcSvg)) {
  console.error('Source SVG not found:', srcSvg);
  process.exit(1);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const targets = [
  { file: 'android-chrome-192x192.png', size: 192 },
  { file: 'android-chrome-512x512.png', size: 512 },
  { file: 'maskable-192x192.png', size: 192, maskable: true },
  { file: 'maskable-512x512.png', size: 512, maskable: true }
];

function padForMaskable(svgBuf, size) {
  // Adds transparent padding to keep artwork centered for maskable icons.
  // We'll wrap original SVG in a larger viewBox with margin ~13%.
  const margin = Math.round(size * 0.13); // 13% outer safe padding
  return sharp(svgBuf)
    .resize(size - margin * 2, size - margin * 2)
    .extend({ top: margin, bottom: margin, left: margin, right: margin, background: { r: 0, g: 0, b: 0, alpha: 0 } });
}

async function run() {
  const svgBuf = fs.readFileSync(srcSvg);
  for (const t of targets) {
    const outPath = path.join(outDir, t.file);
    try {
      if (t.maskable) {
        await padForMaskable(svgBuf, t.size).png().toFile(outPath);
      } else {
        await sharp(svgBuf).resize(t.size, t.size).png().toFile(outPath);
      }
      console.log('Generated', outPath);
    } catch (e) {
      console.error('Failed generating', outPath, e);
      process.exitCode = 1;
    }
  }
}

run();