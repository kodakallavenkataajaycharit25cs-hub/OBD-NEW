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
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace standard bg-[color]-500/20 or /30 borders
  const regex = /bg-(red|blue|green|yellow|purple|orange|emerald)-50[0-9]\/[23]0 border border-\1-50[0-9]\/50/g;
  content = content.replace(regex, 'bg-white/5 border border-white/10 dark:bg-white/5 dark:border-white/10');
  
  // Dynamic ones
  const dynRegex = /bg-\$\{severityColor\}-500\/20 border border-\$\{severityColor\}-500\/50/g;
  content = content.replace(dynRegex, 'bg-white/5 border border-white/10');

  // Specific inline ones where border matches bg color
  content = content.replace(/bg-(red|green|blue|yellow|purple|orange)-500\/30 border border-\1-500\/50/g, 'bg-white/5 border border-white/10');

  // Live Alerts cards
  content = content.replace(/className=\{\`bg-\$\{severityColor\}-500\/20 border border-\$\{severityColor\}-500\/50 rounded-lg p-4\`\}/g, 
                            'className={`bg-white/5 border border-white/10 rounded-lg p-4`}');

  // TripAssignment specific ones
  content = content.replace(/bg-red-500\/20 text-red-400 border border-red-500\/30/g, 'bg-white/5 text-red-400 border border-white/10');
  content = content.replace(/bg-red-500\/20 text-red-400 border-red-500\/50/g, 'bg-white/5 text-red-400 border border-white/10');
  content = content.replace(/bg-green-500\/20 text-green-400 border-green-500\/50/g, 'bg-white/5 text-green-400 border border-white/10');

  if (content !== original) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log('Updated', file);
  }
});

console.log('Total files changed:', changedFiles);
