#!/usr/bin/env node
/**
 * Visual check: exports the web build, screenshots routes at three phone widths and composes one
 * downscaled contact sheet (Figma reference + 375 / 390 / 440 per route). Prints the sheet path.
 *
 *   pnpm shot [--routes=/,/cart,/product/peugeot-lr01] [--out=<dir>]
 *
 * Every run gets its own temp dir and a free port, so concurrent runs don't collide.
 * Web is only a proxy for layout; Expo Go on a device is the ground truth.
 */
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { homedir, tmpdir } from 'node:os';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHROMIUM = join(homedir(), '.cache/ms-playwright/chromium-1248/chrome-linux64/chrome');
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 440, height: 956 },
];
/** Route → Figma frame export (docs/figma), shown first in its row. */
const REFERENCES = {
  '/': 'discover.png',
  '/product/peugeot-lr01': 'detail-description.png',
  '/cart': 'cart.png',
};
const DEFAULT_ROUTES = ['/', '/product/peugeot-lr01', '/cart', '/map'];
/** Contact-sheet scale: frames are drawn at 40% so a 4-route sheet stays small. */
const SHEET_SCALE = 0.4;

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, '').split('=');
    return [key, rest.join('=')];
  }),
);
const routes = args.routes ? args.routes.split(',').filter(Boolean) : DEFAULT_ROUTES;
const runId = `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomBytes(3).toString('hex')}`;
const workDir = join(tmpdir(), `bike-shop-shot-${runId}`);
const distDir = join(workDir, 'dist');
const outDir = resolve(args.out || workDir);
mkdirSync(outDir, { recursive: true });

function run(cmd, cmdArgs) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(cmd, cmdArgs, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    let log = '';
    child.stdout.on('data', (d) => (log += d));
    child.stderr.on('data', (d) => (log += d));
    child.on('close', (code) =>
      code === 0 ? resolveRun() : reject(new Error(`${cmd} ${cmdArgs.join(' ')} failed:\n${log}`)),
    );
  });
}

/** Static server that also resolves Expo Router's dynamic pages (product/[id].html). */
function serve(dir) {
  const htmlFiles = [];
  const walk = (d) =>
    readdirSync(d).forEach((name) => {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (p.endsWith('.html')) htmlFiles.push(relative(dir, p).split(sep).join('/'));
    });
  walk(dir);
  const dynamic = htmlFiles
    .filter((f) => f.includes('['))
    .map((f) => ({
      file: f,
      pattern: new RegExp(`^/${f.replace(/\.html$/, '').replace(/\[[^\]]+\]/g, '[^/]+')}$`),
    }));
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ttf': 'font/ttf', '.json': 'application/json', '.ico': 'image/x-icon' };

  const resolveFile = (urlPath) => {
    const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\/$/, '') || '/index';
    for (const candidate of [clean, `${clean}.html`, `${clean}/index.html`]) {
      const p = join(dir, candidate);
      if (p.startsWith(dir) && existsSync(p) && statSync(p).isFile()) return p;
    }
    const match = dynamic.find(({ pattern }) => pattern.test(clean));
    return match ? join(dir, match.file) : null;
  };

  const server = createServer((req, res) => {
    const file = resolveFile(req.url ?? '/');
    if (!file) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolveServe) => server.listen(0, '127.0.0.1', () => resolveServe(server)));
}

const fileSlug = (route) => (route === '/' ? 'index' : route.replace(/^\//, '').replace(/[^\w-]+/g, '_'));

async function main() {
  console.error(`[shot] exporting web build → ${distDir}`);
  await run('npx', ['expo', 'export', '--platform', 'web', '--output-dir', distDir]);

  const server = await serve(distDir);
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    executablePath: CHROMIUM,
    headless: true,
    args: ['--use-angle=gl', '--enable-gpu', '--ignore-gpu-blocklist'],
  });

  try {
    const rows = [];
    for (const route of routes) {
      const cells = [];
      const ref = REFERENCES[route];
      if (ref) cells.push({ label: 'Figma 390', path: join(ROOT, 'docs/figma', ref), width: 390, height: 844 });
      for (const viewport of VIEWPORTS) {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
        const page = await context.newPage();
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1200); // let entry animations and springs settle
        const path = join(workDir, `${fileSlug(route)}-${viewport.width}.png`);
        await page.screenshot({ path });
        await context.close();
        cells.push({ label: `${viewport.width}×${viewport.height}`, path, ...viewport });
      }
      rows.push({ route, cells });
    }

    // Compose the sheet in the browser itself so no image library is needed.
    const toDataUrl = async (p) => `data:image/png;base64,${(await readFile(p)).toString('base64')}`;
    let html = `<body style="margin:0;padding:16px;background:#111;font:14px system-ui;color:#ddd">`;
    for (const row of rows) {
      html += `<div style="margin-bottom:6px;font-weight:600">${row.route}</div><div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:18px">`;
      for (const cell of row.cells) {
        html += `<figure style="margin:0"><img src="${await toDataUrl(cell.path)}" style="width:${Math.round(cell.width * SHEET_SCALE)}px;height:${Math.round(cell.height * SHEET_SCALE)}px;display:block;outline:1px solid #333"/><figcaption style="font-size:11px;margin-top:3px">${cell.label}</figcaption></figure>`;
      }
      html += `</div>`;
    }
    const sheetPage = await browser.newPage({ viewport: { width: 800, height: 600 }, deviceScaleFactor: 1 });
    await sheetPage.setContent(`${html}</body>`, { waitUntil: 'load' });
    const sheetPath = join(outDir, `contact-sheet-${runId}.png`);
    await sheetPage.screenshot({ path: sheetPath, fullPage: true });
    console.log(sheetPath);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
