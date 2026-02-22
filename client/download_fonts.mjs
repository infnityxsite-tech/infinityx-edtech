import fs from 'fs';
import https from 'https';

fs.mkdirSync('public/fonts', { recursive: true });

function download(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                return download(response.headers.location, dest).then(resolve).catch(reject);
            }
            const file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', err => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

const fonts = {
    'PlayfairDisplay-Bold.ttf': 'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/static/PlayfairDisplay-Bold.ttf',
    'Inter-Bold.ttf': 'https://github.com/google/fonts/raw/main/ofl/inter/static/Inter-Bold.ttf',
    'Inter-Medium.ttf': 'https://github.com/google/fonts/raw/main/ofl/inter/static/Inter-Medium.ttf'
};

Promise.all(Object.entries(fonts).map(([name, url]) => download(url, 'public/fonts/' + name)))
    .then(() => console.log('Fonts downloaded'))
    .catch(console.error);
