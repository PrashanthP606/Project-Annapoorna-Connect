// debug-require-routes.js
const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');
console.log('Scanning', routesDir);

fs.readdirSync(routesDir).forEach(file => {
  if (!file.endsWith('.js')) return;
  const full = path.join(routesDir, file);
  console.log('---', file, '---');
  try {
    const r = require(full);
    console.log('export type:', typeof r);
    if (r && typeof r === 'object') {
      console.log('keys:', Object.keys(r));
    }
  } catch (err) {
    console.error('REQUIRE ERROR for', file);
    console.error(err && err.stack ? err.stack.split('\n')[0] : err);
  }
});

