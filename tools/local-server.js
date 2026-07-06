const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || process.argv[2] || 8788);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

/**
 * Safely resolves a request path inside the project root.
 *
 * @param {string} requestUrl Incoming request URL.
 * @returns {string} Absolute file path.
 * @throws {Error} When the resolved path escapes the project root.
 */
function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://127.0.0.1:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(root, requested);
  if (!filePath.startsWith(root)) {
    throw new Error('Invalid path');
  }
  return filePath;
}

/**
 * Sends a static file response.
 *
 * @param {http.ServerResponse} res HTTP response object.
 * @param {string} filePath Absolute file path to stream.
 */
function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  try {
    const filePath = resolveRequestPath(req.url || '/');
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    sendFile(res, filePath);
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(error.message || 'Bad request');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`R&E booking system running at http://127.0.0.1:${port}/?localData=1`);
});
