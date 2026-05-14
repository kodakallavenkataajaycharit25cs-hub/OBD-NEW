const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      // only recurse into owner dir
      if (file === 'owner') replaceInDir(p);
    } else if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(p, 'utf-8');
      const orig = content;
      
      // Replace the exact gray shades with the dark tactical shade
      content = content.replace(/backgroundColor=[\"\{]'?#18181b'?[\"\}]/g, 'backgroundColor="#120F17"');
      content = content.replace(/bg-zinc-900/g, 'bg-[#120F17]');
      
      // Also ensure clay-card is fully removed just in case
      content = content.replace(/ className=\"clay-card /g, ' className=\"');
      content = content.replace(/ className=\`clay-card /g, ' className=\`');
      content = content.replace(/ clay-card-hover /g, ' ');
      content = content.replace(/ clay-card /g, ' ');

      if (content !== orig) {
        fs.writeFileSync(p, content);
        console.log('Modified ' + file);
      }
    }
  }
}

replaceInDir('c:/Users/USER/Desktop/Internship/src/components');
