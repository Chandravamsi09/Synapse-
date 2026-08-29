const fs = require('fs');
const path = require('path');
const targetExts = ['.js', '.ts', '.tsx', '.jsx', '.go', '.py', '.sql', '.prisma'];
const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', 'tests'];

let prodLines = 0;
let fileCount = 0;
let byExtension = {};

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(f)) scan(full);
    } else {
      const ext = path.extname(f);
      if (targetExts.includes(ext)) {
        const lines = fs.readFileSync(full, 'utf-8').split('\n').length;
        prodLines += lines;
        fileCount++;
        byExtension[ext] = (byExtension[ext] || 0) + lines;
      }
    }
  }
}
scan(path.resolve(__dirname, '..'));
console.log('PROD ONLY LINES OF CODE (Excluding tests & JSON):', prodLines);
console.log('By extension:', byExtension);
