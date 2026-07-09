import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const playgroundRoot = path.dirname(currentFile);
const packageRoot = path.resolve(playgroundRoot, '..');
const repoRoot = path.resolve(packageRoot, '../..');
const port = Number(process.env.PORT) || 4173;

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8']
]);

function resolveRequestPath(url) {
  const requestPath = decodeURIComponent(new URL(url, `http://127.0.0.1:${port}`).pathname);
  const relativePath = requestPath.endsWith('/')
    ? `${requestPath.replace(/^\/+/, '')}index.html`
    : requestPath.replace(/^\/+/, '');
  const baseRoot = relativePath.startsWith('packages/core/') ? repoRoot : packageRoot;
  const filePath = path.resolve(baseRoot, relativePath);

  if (!filePath.startsWith(baseRoot)) {
    return null;
  }

  return filePath;
}

const server = http.createServer(async (request, response) => {
  if ((request.url || '/') === '/') {
    response.writeHead(302, { Location: '/playground/' });
    response.end();
    return;
  }

  const filePath = resolveRequestPath(request.url || '/');

  if (!filePath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    response.writeHead(200, {
      'Content-Type': mimeTypes.get(path.extname(filePath)) || 'application/octet-stream'
    });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`SO web-components playground: http://127.0.0.1:${port}/`);
});
