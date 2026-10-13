const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const files = { '/': ['index.html', 'text/html'], '/index.html': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/location-policy.js': ['location-policy.js', 'text/javascript'], '/zoo-boundary.js': ['zoo-boundary.js', 'text/javascript'], '/styles.css': ['styles.css', 'text/css'] };
http.createServer((req, res) => {
  const file = files[new URL(req.url, 'http://localhost').pathname];
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': `${file[1]}; charset=utf-8` });
  fs.createReadStream(path.join(root, file[0])).pipe(res);
}).listen(8080, '127.0.0.1', () => console.log('Preview: http://localhost:8080'));
