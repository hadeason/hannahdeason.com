#!/usr/bin/env node

const sass = require('node-sass');
const path = require('path');
const fs = require('fs-extra');

sass.render({
    file: path.resolve(__dirname + '/../styles/style.scss'),
    outputStyle: 'compressed'
}, function(err, result) {
   if (err) {
       console.error(err);
   }

   fs.outputFile(path.resolve(__dirname + '/../style.css'), result.css);
});
