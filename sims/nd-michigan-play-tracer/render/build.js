// Inlines the fonts and Three.js into src.html and writes ../index.html.
// Run from anywhere: node render/build.js (after npm install in render/).
const fs = require('fs');
const path = require('path');
const D = __dirname;
let s = fs.readFileSync(path.join(D, 'src.html'), 'utf8');
const font = w => fs.readFileSync(path.join(D, 'node_modules/@fontsource/barlow-condensed/files',
  `barlow-condensed-latin-${w}-normal.woff2`)).toString('base64');
s = s.replace('__F600__', font(600)).replace('__F700__', font(700)).replace('__F800__', font(800));
const three = fs.readFileSync(path.join(D, 'node_modules/three/build/three.min.js'), 'utf8');
s = s.split('/*__THREE__*/').join(three.replace(/<\/script/g, '<\\/script'));
fs.writeFileSync(path.join(D, '..', 'index.html'), s);
console.log('wrote', path.join(D, '..', 'index.html'), s.length, 'bytes');
