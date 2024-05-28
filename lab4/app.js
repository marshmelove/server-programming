const express = require('express');
const fs = require('fs');
const os = require('os');
const zlib = require('zlib');

const app = express();
const port = 3000;

const fullName = "Трифонова Ксенія Олександрівна";

// Middleware для запису даних про запити
app.use((req, res, next) => {
    const requestData = {
        date: new Date().toISOString(),
        user: os.userInfo().username
    };
    fs.appendFile('request_logs.txt', JSON.stringify(requestData) + '\n', (err) => {
        if (err) console.error(err);
    });
    next();
});

// Route для /
app.get('/', (req, res) => {
    res.send(`<h1>Сервер на Express.js ${fullName}</h1>`);
});

// Route для /about.html
app.get('/about.html', (req, res) => {
    const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;
    res.send(`<h1>Про нас</h1><p>${loremIpsum}</p>`);
});

// Route для /getdata
app.get('/getdata', (req, res) => {
    const requestData = {
        date: new Date().getTime(),
        user: os.userInfo().username
    };
    res.json(requestData);
});

// Route для /myfile
app.get('/myfile', (req, res) => {
    const filePath = __dirname + '/data/file1.txt';
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(data);
    });
});

// Route для /mydownload
app.get('/mydownload', (req, res) => {
    const filePath = __dirname + '/data/file2.txt';
    res.download(filePath, 'file2.txt');
});

// Route для /myarchive
app.get('/myarchive', (req, res) => {
    const filePath = __dirname + '/data/file1.txt';
    const gzip = zlib.createGzip();
    const archiveFileName = 'file1.txt.gz';

    res.set({
        'Content-Type': 'application/gzip',
        'Content-Disposition': `attachment; filename="${archiveFileName}"`
    });

    fs.createReadStream(filePath)
        .pipe(gzip)
        .pipe(res);
});

// Route для невідомих адрес
app.use((req, res) => {
    res.status(404).send('There is no such resource');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
