// Run this with: node assets/generate-icons.js
// Generates simple placeholder icons for the admin app.
// Replace with real icons before publishing.

const fs = require('fs');
const path = require('path');

function createPNG(size, r, g, b) {
  // Minimal valid PNG: a solid-color square with a simple flower-like center
  const width = size, height = size;
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = chunk('IHDR', ihdrData);

  // IDAT chunk - raw pixel data
  const raw = [];
  for (let y = 0; y < height; y++) {
    raw.push(0); // filter byte
    for (let x = 0; x < width; x++) {
      const cx = x / width, cy = y / height;
      const dist = Math.hypot(cx - 0.5, cy - 0.5) * 2;
      const angle = Math.atan2(cy - 0.5, cx - 0.5);
      // Petal pattern
      const petal = Math.abs(Math.cos(angle * 4)) * 0.4 + 0.2;
      const isPetal = dist > 0.15 && dist < petal;
      const isCenter = dist < 0.2;
      let pr, pg, pb;
      if (isCenter) {
        pr = 232; pg = 213; pb = 176; // gold center
      } else if (isPetal) {
        const t = (dist - 0.15) / (petal - 0.15);
        pr = Math.round(212 - t * 20);
        pg = Math.round(137 + t * 10);
        pb = Math.round(122 - t * 10);
      } else {
        pr = r; pg = g; pb = b; // background
      }
      raw.push(pr, pg, pb);
    }
  }
  const rawData = Buffer.from(raw);
  const deflated = require('zlib').deflateSync(rawData);
  const idat = chunk('IDAT', deflated);

  // IEND chunk
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeB = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeB, data]);
  const crc = crc32(crcData);
  const crcB = Buffer.alloc(4);
  crcB.writeUInt32BE(crc);
  return Buffer.concat([len, typeB, data, crcB]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

const dir = __dirname;
const bg = { r: 248, g: 242, b: 233 };

fs.writeFileSync(path.join(dir, 'icon.png'), createPNG(512, bg.r, bg.g, bg.b));
fs.writeFileSync(path.join(dir, 'adaptive-icon.png'), createPNG(1024, bg.r, bg.g, bg.b));
fs.writeFileSync(path.join(dir, 'splash.png'), createPNG(1242, bg.r, bg.g, bg.b));
fs.writeFileSync(path.join(dir, 'favicon.png'), createPNG(48, bg.r, bg.g, bg.b));

console.log('Icons generated in assets/');
