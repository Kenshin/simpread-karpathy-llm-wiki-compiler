const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.argv[2]) || 9235;
const DIR = path.dirname(__filename);
const OUTPUTS_DIR = path.join(DIR, '../../outputs');

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

function sendError(res, code, msg) {
    res.writeHead(code);
    res.end(msg);
}

http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    // API: 列出 outputs 目录下的 HTML 文件
    if (pathname === '/api/html-files') {
        if (!fs.existsSync(OUTPUTS_DIR)) {
            return sendJson(res, { error: 'outputs 目录不存在，请手动创建此文件夹。', files: [] });
        }
        fs.readdir(OUTPUTS_DIR, (err, files) => {
            if (err) return sendJson(res, { error: '无法读取 outputs 目录', files: [] });
            const htmlFiles = files
                .filter(f => f.endsWith('.html'))
                .sort((a, b) => a.localeCompare(b, 'zh'));
            sendJson(res, { error: null, files: htmlFiles });
        });
        return;
    }

    // API: 获取 outputs 下的 HTML 文件内容
    if (pathname === '/api/html-content') {
        const file = parsed.query.file;
        if (!file || file.includes('..') || file.includes('/') || file.includes('\\')) {
            return sendError(res, 400, 'Invalid filename');
        }
        const filePath = path.join(OUTPUTS_DIR, file);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return sendError(res, 404, 'File not found');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
            res.end(data);
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
