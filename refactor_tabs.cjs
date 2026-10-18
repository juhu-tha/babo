const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'src', 'modules');
const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(modulesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('activeTab')) return;

  let modified = false;

  // Match any div that contains the buttons and has flex classes
  // A simple way is to look for `<div className="flex...` right before `<button`
  
  const containerRegex = /<div className="flex[^"]*"(>| \/>)\s*<button/g;
  
  if (containerRegex.test(content)) {
    content = content.replace(containerRegex, '<div className="flex border-b border-home-grau/20 overflow-x-auto">\n        <button');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated container in ${file}`);
  }
});
