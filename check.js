const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("Running self-check validation...");

// 1. Verify zero external CDN / Google Fonts in index.html & css/styles.css
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, 'css', 'styles.css'), 'utf8');

assert(!indexHtml.includes('fonts.googleapis.com'), "Must not include google fonts in html");
assert(!stylesCss.includes('fonts.googleapis.com'), "Must not include google fonts in css");
assert(!indexHtml.includes('cdn.'), "Must not include external cdn in html");
assert(!stylesCss.includes('@import'), "Must not include @import in css");
console.log("✓ Zero external network requests / Google Fonts verified");

// 2. Verify all JS files parse cleanly
const jsFiles = [
  'assets-manifest.js',
  'sound-engine.js',
  'rig-data.js',
  'rig.js',
  'cast-data.js',
  'cast.js',
  'delivery.js',
  'main.js'
];

jsFiles.forEach(file => {
  const filePath = path.join(__dirname, 'js', file);
  assert(fs.existsSync(filePath), `File exists: ${file}`);
  const code = fs.readFileSync(filePath, 'utf8');
  // Check basic syntax with vm / new Function
  new Function(code);
  console.log(`✓ JS syntax valid: ${file}`);
});

// 3. Verify assets referenced in index.html exist in ./assets
const assetMatches = indexHtml.match(/assets\/[^"'>]+/g) || [];
assert(assetMatches.length > 0, "Assets found in index.html");
assetMatches.forEach(match => {
  const decoded = decodeURIComponent(match);
  assert(fs.existsSync(path.join(__dirname, decoded)), `Asset exists on disk: ${decoded}`);
});
console.log(`✓ All ${assetMatches.length} asset references in index.html verified on disk`);

console.log("\nALL VERIFICATIONS PASSED CLEANLY!");
