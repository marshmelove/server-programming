const http = require('http');
const url = require('url');
const fs = require('fs');
const os = require('os');
const zlib = require('zlib');

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const pathname = reqUrl.pathname;

    switch (pathname) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            const fullName = 'ПІБ'; // замініть 'ПІБ' на своє прізвище, ім'я та по-батькові
            res.end(`<h1>Сервер на Node.js ${fullName}</h1>`);
            break;
        case '/about':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
            res.end(`<h1>Про нас</h1><p>${loremIpsum}</p>`);
            break;
        case '/getdata':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const data = {
                date: new Date().getTime(),
                user: os.userInfo().username
            };
            res.end(JSON.stringify(data));
            break;
        case '/myfile':
            const file1 = fs.createReadStream('data/file1.txt');
            file1.pipe(res);
            break;
        case '/mydownload':
            const file2 = fs.createReadStream('data/file2.txt');
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename="file2.txt"');
            file2.pipe(res);
            break;
        case '/myarchive':
            const file1Contents = fs.readFileSync('data/file1.txt');
            const gzip = zlib.createGzip();
            res.writeHead(200, {
                'Content-Type': 'application/gzip',
                'Content-Disposition': 'attachment; filename="file1.txt.gz"'
            });
            gzip.pipe(res);
            gzip.end(file1Contents);
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>Сторінку не знайдено</h1>');
            break;
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
