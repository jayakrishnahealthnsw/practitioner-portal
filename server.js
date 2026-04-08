const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'dist/practitioner-portal/browser');
const LOGIN_ROOT = path.join('C:\\WorkspaceFigma\\user-registration-page\\dist');
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  // Strip trailing slash (except root)
  if (urlPath !== '/' && urlPath.endsWith('/')) {
    urlPath = urlPath.slice(0, -1);
  }

  // Redirect root to /dashboard
  if (urlPath === '/') {
    res.writeHead(302, { 'Location': '/dashboard' });
    res.end();
    return;
  }

  let filePath;
  let isLoginApp = false;

  // Route /login and /login/* to the separate registration dist
  if (urlPath === '/login' || urlPath.startsWith('/login/')) {
    isLoginApp = true;
    const subPath = urlPath.slice('/login'.length) || '/';
    const candidate = path.join(LOGIN_ROOT, subPath);
    filePath = path.extname(subPath) ? candidate : path.join(LOGIN_ROOT, 'index.html');
  } else {
    filePath = path.join(ROOT, urlPath);
    // SPA routing: serve index.html for all routes without a file extension
    if (!path.extname(urlPath)) {
      filePath = path.join(ROOT, 'index.html');
    }
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);

    // Rewrite asset paths in login app's HTML so absolute /assets/ refs work under /login/
    if (isLoginApp && ext === '.html') {
      const html = data.toString().replace(/(src|href)="\/assets\//g, '$1="/login/assets/');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }

    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => {
  const HOST = '10.209.32.146';
  console.log(`Serving on http://${HOST}:${PORT}`);
  console.log(`  Angular portal : http://${HOST}:${PORT}/dashboard`);
  console.log(`  Register       : http://${HOST}:${PORT}/register`);
  console.log(`  Login app      : http://${HOST}:${PORT}/login`);
  console.log(`  Localhost      : http://localhost:${PORT}`);
});
