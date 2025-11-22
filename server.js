const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '0.0.0.0';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  console.log(`Запрос: ${req.url}`);
  
  let filePath = req.url.split('?')[0];
  
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  filePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  
  if (filePath === '') {
    filePath = 'index.html';
  }
  
  const fullPath = path.join(__dirname, filePath);
  const ext = path.extname(fullPath).toLowerCase();
  const contentType = mimeTypes[ext] || 'text/plain';

  console.log(`Пытаемся открыть: ${fullPath}`);
  
  fs.readFile(fullPath, (err, content) => {
    if (err) {
      console.log(`Файл не найден: ${filePath}, ошибка: ${err.message}`);
      
      const spaPath = path.join(__dirname, 'index.html');
      fs.readFile(spaPath, (err, content) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body>
                <h1>404 - File not found</h1>
                <p>Не удалось найти ${filePath} и index.html</p>
              </body>
            </html>
          `);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📦 Docker: http://0.0.0.0:${PORT} (внутренний)`);
});