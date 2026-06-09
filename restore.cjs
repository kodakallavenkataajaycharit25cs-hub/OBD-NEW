const fs = require('fs');

const logPath = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\7c8642aa-8a67-46dc-acc0-9727048904a8\\.system_generated\\logs\\transcript.jsonl';
const data = fs.readFileSync(logPath, 'utf8');
const lines = data.split('\n');

const filesToRestore = [
  'tailwind.config.js',
  'index.html',
  'src/index.css',
  'src/components/owner/FleetOverview.tsx',
  'src/components/ThemeToggle.tsx',
  'src/components/OwnerDashboard.tsx'
];

const fileContents = {};

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const entry = JSON.parse(line);
    const contentStr = JSON.stringify(entry);
    
    for (const targetFile of filesToRestore) {
      if (contentStr.includes(targetFile.replace(/\\/g, '/')) && 
          contentStr.includes('The following code has been modified to include a line number')) {
        
        let foundOutput = "";
        const searchObj = (obj) => {
          if (typeof obj === 'string') {
            if (obj.includes('The following code has been modified to include a line number')) {
              foundOutput = obj;
            }
          } else if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
              searchObj(obj[key]);
            }
          }
        };
        
        searchObj(entry);
        
        if (foundOutput && foundOutput.includes(targetFile.replace(/\\/g, '/'))) {
          const realLines = foundOutput.split(/\r?\n/);
          let contentLines = [];
          let isCode = false;
          for (let i = 0; i < realLines.length; i++) {
            if (realLines[i].includes('The following code has been modified to include a line number')) {
              isCode = true;
              continue;
            }
            if (realLines[i].includes('The above content shows the entire, complete file contents')) {
              isCode = false;
              break;
            }
            if (isCode) {
              contentLines.push(realLines[i].replace(/^\d+:\s/, ''));
            }
          }
          if (contentLines.length > 0) {
            const absPath = 'c:\\Users\\USER\\Desktop\\Internship\\' + targetFile;
            if (!fileContents[absPath]) {
                fileContents[absPath] = contentLines.join('\n');
            }
          }
        }
      }
    }
  } catch(e) {}
}

for (const [filePath, content] of Object.entries(fileContents)) {
  console.log(`Restoring ${filePath} (${content.length} bytes)`);
  fs.writeFileSync(filePath, content, 'utf8');
}
