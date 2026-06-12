const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.argv[2]) || 9234;
const DIR = path.dirname(__filename);
const WIKI_DIR = path.join(DIR, '../../wiki');

const MIME = {
    '.html': 'text/html',
    '.js':   'application/javascript',
    '.css':  'text/css',
    '.json': 'application/json',
    '.png':  'image/png',
    '.svg':  'image/svg+xml',
};

function sendJson(res, data) {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(data));
}

function sendText(res, text) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(text);
}

function sendError(res, code, msg) {
    res.writeHead(code);
    res.end(msg);
}

http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    // API: 列出包含知识图谱的 wiki 文件
    if (pathname === '/rag/wiki/graph') {
        if (!fs.existsSync(WIKI_DIR)) {
            return sendError(res, 404, 'Wiki directory not found: ' + WIKI_DIR);
        }
        fs.readdir(WIKI_DIR, (err, files) => {
            if (err) return sendError(res, 500, 'Cannot read wiki directory');
            const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'INDEX.md');
            const results = [];
            let pending = mdFiles.length;
            if (pending === 0) return sendJson(res, []);

            mdFiles.forEach(file => {
                fs.readFile(path.join(WIKI_DIR, file), 'utf8', (err, content) => {
                    if (!err && content.includes('## 知识图谱（Knowledge Graph）')) {
                        results.push(file);
                    }
                    if (--pending === 0) {
                        results.sort();
                        sendJson(res, results);
                    }
                });
            });
        });
        return;
    }

    // API: 获取 wiki 文件内容
    if (pathname === '/rag/wiki/content') {
        const file = parsed.query.file;
        if (!file || file.includes('..') || file.includes('/') || file.includes('\\')) {
            return sendError(res, 400, 'Invalid filename');
        }
        const filePath = path.join(WIKI_DIR, file);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return sendError(res, 404, 'File not found');
            sendText(res, data);
        });
        return;
    }

    // 静态文件服务
    const file = pathname === '/' ? '/index.html' : pathname;
    const filePath = path.join(DIR, file);
    const ext = path.extname(filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, {
            'Content-Type': MIME[ext] || 'text/plain',
            'Cache-Control': 'no-store'
        });
        res.end(data);
    });
}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
