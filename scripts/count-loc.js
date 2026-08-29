const fs = require('fs');
const path = require('path');

const targetExts = ['.js', '.ts', '.tsx', '.jsx', '.json', '.yaml', '.yml', '.py', '.go', '.md', '.sql', '.prisma', '.css', '.html'];
const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.nyc_output'];

let totalLines = 0;
let fileCount = 0;
let byExtension = {};

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(f)) {
        scan(full);
      }
    } else {
      const ext = path.extname(f);
      if (targetExts.includes(ext)) {
        const content = fs.readFileSync(full, 'utf-8');
        const lines = content.split('\n').length;
        totalLines += lines;
        fileCount++;
        byExtension[ext] = (byExtension[ext] || { count: 0, lines: 0 });
        byExtension[ext].count++;
        byExtension[ext].lines += lines;
      }
    }
  }
}

const root = path.resolve(__dirname, '..');
scan(root);

console.log('====================================================');
console.log('            SYNAPSE CODEBASE METRICS                ');
console.log('====================================================');
console.log(`Total Files Analyzed: ${fileCount}`);
console.log(`Total Lines of Code:  ${totalLines.toLocaleString()} LOC`);
console.log('----------------------------------------------------');
console.log('By Extension:');
for (const [ext, data] of Object.entries(byExtension).sort((a, b) => b[1].lines - a[1].lines)) {
  console.log(`  ${ext.padEnd(10)}: ${data.lines.toLocaleString().padStart(8)} lines across ${data.count.toString().padStart(4)} files`);
}
console.log('====================================================');
