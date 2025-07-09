const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');
const mysql = require('mysql2');

const publicDir = path.join(__dirname, 'public');
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'glowup_icecream'
});

db.connect((err) => {
  if(err){
    console.log("koneksi database gagal:");
    process.exit();
  }

  console.log("database terhubung!");
});

const server = http.createServer((req, res) => {
  if(req.method === 'GET'){
    const filePath = req.url === '/' ? '/index.html' : req.url;
    const fullPath = path.join(publicDir, filePath);
    fs.readFile(fullPath, (err, content) => {
      const ext = path.extname(fullPath);
      const contentType = ext === '.css' ? 'text/css':
                          ext === '.js' ? 'text/javascript':
                          ext === '.html' ? 'text/html' : 'text/plain';

      res.writeHead(200, { 'content-type': contentType});
      res.end(content);
    });
  }else if(req.method === 'POST' && req.url === '/contacts'){
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      //proses di sini!
      const parsed = parse(body);
      const {name, email, message} = parsed;

      const sql = 'insert into contacts (name, email, message) values(?, ?, ?)';
      db.query(sql, [name, email, message], (err) => {
        if(err){
          console.log("gagal simpan ke db");
          res.writeHead(500, {'content-type': 'text/plain'});
          return res.end("gagal simpan ke db");
        }

        res.writeHead(200, {'content-type': 'text/plain'});
        return res.end('berhasil simpan ke db');
      });
    });
  }
});

server.listen(port, () => console.log(`Server running at http://localhost:${port}`));