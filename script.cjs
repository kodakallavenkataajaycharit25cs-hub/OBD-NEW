const fs = require('fs');
const path = require('path');

const targetFiles = [
  'c:/Users/USER/Desktop/Internship/src/components/DriverPortal.tsx',
  'c:/Users/USER/Desktop/Internship/src/components/OwnerDashboard.tsx'
];

const ownerDir = 'c:/Users/USER/Desktop/Internship/src/components/owner';
if (fs.existsSync(ownerDir)) {
  const files = fs.readdirSync(ownerDir);
  for (const file of files) {
    if (file.endsWith('.tsx')) {
      targetFiles.push(path.join(ownerDir, file));
    }
  }
}

for (const p of targetFiles) {
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, 'utf-8');
  const originalContent = content;
  
  content = content.replace(/className=\"clay-card /g, 'className=\"');
  content = content.replace(/className=\`clay-card /g, 'className=\`');
  content = content.replace(/ clay-card-hover /g, ' ');
  content = content.replace(/ clay-card /g, ' ');
  
  if (content !== originalContent) {
    fs.writeFileSync(p, content);
    console.log('Modified ' + path.basename(p));
  }
}
