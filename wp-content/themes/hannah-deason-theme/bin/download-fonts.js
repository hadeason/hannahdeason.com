#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const http = require('https');

const fontsToDownload = [
    'Lulo-Clean-W01-One-Bold',
    'Avenir-LT-W01_85-Heavy1475544',
    'Helvetica-W01-Light',
    'Marzo-W00-Regular'
];

const download = (url, dest, cb) => {
    const file = fs.createWriteStream(dest);
    http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);  // close() is async, call cb after close completes.
        });
    }).on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
};

fs.readFile('/Users/JoshSchroeder/languages.css', 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    const matches = data.match(/@font-face\s*\{[^}]*}/gi);

    for (let i = 0; i < matches.length; i++) {
        const fontFace = matches[i];

        const familyMatch = fontFace.match(/font-family\s*:\s*('|")([^'"]+)\1\s*/i);

        if (!familyMatch) {
            throw new Error('Family not matched here ' + fontFace);
        }
        const family = familyMatch[2];

        if (fontsToDownload.includes(family)) {
            const downloaded = [];
            const urlRegex = /url\s*\(\s*(\'|")([^\'"\?]*)[^\'"]*\1\s*\)/ig;
            // Get urls
            const urls = fontFace.match(urlRegex);
            for (let k = 0; k < urls.length; k++) {
                // console.log(urls[k]);
                const url = urls[k];
                const urlMatch = url.match(/url\s*\(\s*(\'|")([^\'"\?]*)[^\'"]*\1\s*\)/i);

                if (!urlMatch) {
                    throw new Error('url failed to match ' + url);
                }

                const fontUrl = urlMatch[2].split('#')[0];



                if (!downloaded.includes(fontUrl)) {
                    const targetFile = path.resolve(__dirname + '/../fonts/' + family + path.extname(fontUrl));

                    if (!fs.existsSync(targetFile)) {
                        download('https:' + fontUrl, targetFile, () => {
                            console.log('Saved to file %s', targetFile);
                        });
                    }
                }
            }
        }

    }
});
