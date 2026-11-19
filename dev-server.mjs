// Local dev server: serves the page and runs /api/curate like Vercel does.
//   npm install && npm run dev   ->  http://127.0.0.1:5178/
// Reads settings from .env.local (or .env) if present. Without one, the "mock" brain is used
// with passcode "demo" so the whole flow works offline for free.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
for (const f of ['.env.local', '.env']) {
  if (!existsSync(join(root, f))) continue;
  for (const line of readFileSync(join(root, f), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}
if (!process.env.BRAIN_PROVIDER && !process.env.ANTHROPIC_API_KEY) { process.env.BRAIN_PROVIDER = 'mock'; process.env.DEMO_PASSCODE ||= 'demo'; }

const { default: curate } = await import('./api/curate.js');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };
const PORT = Number(process.env.PORT || 5178);

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/curate') {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    const shim = {
      status(code) { res.statusCode = code; return shim; },
      json(obj) { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(obj)); return shim; },
    };
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { return shim.status(400).json({ error: 'Bad JSON.' }); }
    return curate(req, shim);
  }
  // static files (only from this folder, never outside it, never server code)
  let p = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  if (p === '/' || p === '') p = '/index.html';
  if (/^\/(api|lib|node_modules)\/|^\/\.|\.env|dev-server/.test(p)) { res.statusCode = 404; return res.end('Not found'); }
  try {
    const body = await readFile(join(root, p));
    res.setHeader('content-type', TYPES[extname(p)] || 'application/octet-stream');
    res.setHeader('cache-control', 'no-store'); // always serve the latest edit while developing
    res.end(body);
  } catch { res.statusCode = 404; res.end('Not found'); }
}).listen(PORT, '127.0.0.1', () => console.log(`Mastermind Music Mixer on http://127.0.0.1:${PORT}/ (brain: ${process.env.BRAIN_PROVIDER || 'anthropic'})`));
