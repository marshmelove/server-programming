const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Функція створення файлу
async function createFileFunc() {
    const filePath = path.join(__dirname, 'files', 'fresh.txt');
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        console.log('CREATE operation failed: File already exists');
    } catch (error) {
        try {
            await fs.promises.writeFile(filePath, 'Свіжий і бадьорий');
            console.log('File created successfully');
        } catch (error) {
            console.log('CREATE operation failed:', error.message);
        }
    }
}

// Функція копіювання папки
async function copyFilesFunc() {
    const sourcePath = path.join(__dirname, 'files');
    const destinationPath = path.join(__dirname, 'files_copy');
    try {
        await fs.promises.access(sourcePath, fs.constants.F_OK);
        await fs.promises.access(destinationPath, fs.constants.F_OK);
        console.log('COPY operation failed: Destination directory already exists');
    } catch (error) {
        try {
            await fs.promises.mkdir(destinationPath);
            await fs.promises.copyFile(path.join(sourcePath), path.join(destinationPath));
            console.log('Directory copied successfully');
        } catch (error) {
            console.log('COPY operation failed:', error.message);
        }
    }
}

// Функція перейменування файлу
async function renameFileFunc() {
    const oldPath = path.join(__dirname, 'files', 'wrongFilename.txt');
    const newPath = path.join(__dirname, 'files', 'properFilename.md');
    try {
        await fs.promises.access(oldPath, fs.constants.F_OK);
        await fs.promises.access(newPath, fs.constants.F_OK);
        console.log('RENAME operation failed: New filename already exists');
    } catch (error) {
        try {
            await fs.promises.rename(oldPath, newPath);
            console.log('File renamed successfully');
        } catch (error) {
            console.log('RENAME operation failed:', error.message);
        }
    }
}

// Функція видалення файлу
async function deleteFileFunc() {
    const filePath = path.join(__dirname, 'files', 'fileToRemove.txt');
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        await fs.promises.unlink(filePath);
        console.log('File deleted successfully');
    } catch (error) {
        console.log('DELETE operation failed:', error.message);
    }
}

// Функція виведення списку файлів у папці
async function listFilesFunc() {
    const folderPath = path.join(__dirname, 'files');
    try {
        const files = await fs.promises.readdir(folderPath);
        console.log('List of files:');
        files.forEach(file => console.log(file));
    } catch (error) {
        console.log('LIST operation failed:', error.message);
    }
}

// Функція читання файлу
async function readFileFunc() {
    const filePath = path.join(__dirname, 'files', 'fileToRead.txt');
    try {
        const content = await fs.promises.readFile(filePath, 'utf8');
        console.log('File content:', content);
    } catch (error) {
        console.log('READ operation failed:', error.message);
    }
}

// Функція читання файлу через потік
function readStreamFunc() {
    const filePath = path.join(__dirname, 'files', 'fileToRead.txt');
    const readStream = fs.createReadStream(filePath, 'utf8');
    readStream.on('data', chunk => {
        console.log('File content:', chunk);
    });
    readStream.on('error', error => {
        console.log('READ STREAM operation failed:', error.message);
    });
}

// Функція запису в файл через потік
function writeStreamFunc(data) {
    const filePath = path.join(__dirname, 'files', 'fileToWrite.txt');
    const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
    writeStream.write(data, 'utf8');
    writeStream.end();
    writeStream.on('finish', () => {
        console.log('Data written to file successfully');
    });
    writeStream.on('error', error => {
        console.log('WRITE STREAM operation failed:', error.message);
    });
}

// Функція стиснення файлу
async function compressFunc() {
    const sourceFilePath = path.join(__dirname, 'files', 'fileToCompress.txt');
    const destinationFilePath = path.join(__dirname, 'archives', 'archive.gz');
    try {
        await fs.promises.access(sourceFilePath, fs.constants.F_OK);
        await fs.promises.access(destinationFilePath, fs.constants.F_OK);
        console.log('COMPRESS operation failed: Archive already exists');
    } catch (error) {
        try {
            const gzip = zlib.createGzip();
            const sourceStream = fs.createReadStream(sourceFilePath);
            const destinationStream = fs.createWriteStream(destinationFilePath);
            sourceStream.pipe(gzip).pipe(destinationStream);
            console.log('File compressed successfully');
        } catch (error) {
            console.log('COMPRESS operation failed:', error.message);
        }
    }
}

// Функція розпакування архіву
async function decompressFunc() {
    const sourceFilePath = path.join(__dirname, 'archives', 'archive.gz');
    const destinationFilePath = path.join(__dirname, 'files', 'decompressedFile.txt');
    try {
        await fs.promises.access(sourceFilePath, fs.constants.F_OK);
        await fs.promises.access(destinationFilePath, fs.constants.F_OK);
        console.log('DECOMPRESS operation failed: Decompressed file already exists');
    } catch (error) {
        try {
            const gunzip = zlib.createGunzip();
            const sourceStream = fs.createReadStream(sourceFilePath);
            const destinationStream = fs.createWriteStream(destinationFilePath);
            sourceStream.pipe(gunzip).pipe(destinationStream);
            console.log('Archive decompressed successfully');
        } catch (error) {
            console.log('DECOMPRESS operation failed:', error.message);
        }
    }
}

// Демонстрація роботи функцій
async function demonstrate() {
    await createFileFunc();
    await copyFilesFunc();
    await renameFileFunc();
    await deleteFileFunc();
    await listFilesFunc();
    await readFileFunc();
    readStreamFunc();
    writeStreamFunc('Sample data to write to file\n');
    await compressFunc();
    await decompressFunc();
}

demonstrate();
