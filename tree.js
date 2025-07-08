#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function generateTree(dir = './src', prefix = '', isRoot = true) {
  const ignore = ['node_modules', '.git', 'dist', 'build', '.DS_Store'];
  
  try {
    const items = fs.readdirSync(dir)
      .filter(item => !ignore.includes(item))
      .sort((a, b) => {
        const aIsDir = fs.statSync(path.join(dir, a)).isDirectory();
        const bIsDir = fs.statSync(path.join(dir, b)).isDirectory();
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.localeCompare(b);
      });

    let result = [];
    
    if (isRoot) {
      result.push(path.basename(path.resolve(dir)) + '/');
    }

    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const itemPath = path.join(dir, item);
      
      result.push(prefix + connector + item);
      
      if (fs.statSync(itemPath).isDirectory()) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        const subTree = generateTree(itemPath, newPrefix, false);
        result.push(...subTree);
      }
    });
    
    return result;
  } catch (error) {
    return [prefix + '└── [ERROR: Cannot read directory]'];
  }
}

// Основная функция
function main() {
  const targetDir = process.argv[2] || './src';
  const tree = generateTree(targetDir);
  
  console.log('\n📁 Project Structure:');
  console.log('```');
  console.log(tree.join('\n'));
  console.log('```\n');
  
  // Копируем в буфер обмена если возможно
  const output = tree.join('\n');
  
  // Сохраняем в файл
  const markdownContent = `# Project Structure\n\n\`\`\`\n${output}\n\`\`\`\n`;
  fs.writeFileSync('structure.md', markdownContent);
  console.log('💾 Structure saved to structure.md');
}

if (require.main === module) {
  main();
}