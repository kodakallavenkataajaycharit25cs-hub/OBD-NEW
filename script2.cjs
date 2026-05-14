const fs = require('fs');
const path = require('path');

const targetFiles = [
  'c:/Users/USER/Desktop/Internship/src/components/SpotBooking.tsx',
  'c:/Users/USER/Desktop/Internship/src/components/BookingPage.tsx',
  'c:/Users/USER/Desktop/Internship/src/components/ExpenseClassifier.tsx'
];

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
