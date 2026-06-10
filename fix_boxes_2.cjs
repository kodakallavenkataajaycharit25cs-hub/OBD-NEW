const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src/components');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/bg-white\/5 border border-white\/10 dark:bg-white\/5 dark:border-white\/10/g, 'bg-[#120F17] border border-white/5');
  content = content.replace(/bg-white\/5 border border-white\/10/g, 'bg-[#120F17] border border-white/5');

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
