#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const http = require('https');

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

fs.readFile(__dirname + '/images.txt', 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    const matches = data.match(/https:\/\/.*\.jpg/gi);
    const downloaded = [];

    for (let i = 0; i < matches.length; i++) {
        const imageUrl = matches[i];

        if (!downloaded.includes(imageUrl)) {
            const targetFile = path.resolve(__dirname + '/../images/' + path.basename(imageUrl));

            if (!fs.existsSync(targetFile)) {
                download(imageUrl, targetFile, () => {
                    console.log('Saved to file %s', targetFile);
                });
            }
        }
    }
});
