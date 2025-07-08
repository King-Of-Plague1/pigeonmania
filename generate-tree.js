const fs = require('fs');
const path = require('path');

class TreeGenerator {
  constructor(rootPath = './src', ignorePatterns = []) {
    this.rootPath = rootPath;
    this.ignorePatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.DS_Store',
      'Thumbs.db',
      ...ignorePatterns
    ];
  }

  shouldIgnore(itemName) {
    return this.ignorePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(itemName);
      }
      return itemName === pattern || itemName.includes(pattern);
    });
  }

  generateTree(dirPath = this.rootPath, prefix = '', isLast = true) {
    const items = [];
    
    try {
      const entries = fs.readdirSync(dirPath)
        .filter(item => !this.shouldIgnore(item))
        .sort((a, b) => {
          const aPath = path.join(dirPath, a);
          const bPath = path.join(dirPath, b);
          const aIsDir = fs.statSync(aPath).isDirectory();
          const bIsDir = fs.statSync(bPath).isDirectory();
          
          // Папки сначала, потом файлы
          if (aIsDir && !bIsDir) return -1;
          if (!aIsDir && bIsDir) return 1;
          return a.localeCompare(b);
        });

      entries.forEach((item, index) => {
        const itemPath = path.join(dirPath, item);
        const isLastItem = index === entries.length - 1;
        const connector = isLastItem ? '└── ' : '├── ';
        const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
        
        items.push(prefix + connector + item);
        
        try {
          const stats = fs.statSync(itemPath);
          if (stats.isDirectory()) {
            const subItems = this.generateTree(itemPath, newPrefix, isLastItem);
            items.push(...subItems);
          }
        } catch (error) {
          // Игнорируем ошибки доступа к файлам
        }
      });
    } catch (error) {
      items.push(prefix + '└── [ERROR: Cannot read directory]');
    }
    
    return items;
  }

  generate() {
    const rootName = path.basename(path.resolve(this.rootPath));
    const tree = [rootName + '/'];
    tree.push(...this.generateTree());
    return tree.join('\n');
  }

  generateMarkdown() {
    const tree = this.generate();
    return '```\n' + tree + '\n```';
  }

  saveToFile(filename = 'project-structure.md') {
    const content = `# Project Structure\n\n${this.generateMarkdown()}`;
    fs.writeFileSync(filename, content);
    console.log(`Project structure saved to ${filename}`);
  }
}

// Конфигурация для разных типов проектов
const configs = {
  react: {
    rootPath: './src',
    ignorePatterns: ['*.test.js', '*.spec.js', '__tests__', 'coverage']
  },
  full: {
    rootPath: '.',
    ignorePatterns: ['node_modules', '.git', 'dist', 'build']
  },
  assets: {
    rootPath: './src/assets',
    ignorePatterns: []
  }
};

// Главная функция
function main() {
  const args = process.argv.slice(2);
  const configName = args[0] || 'react';
  const outputFile = args[1] || 'project-structure.md';
  
  const config = configs[configName] || configs.react;
  const generator = new TreeGenerator(config.rootPath, config.ignorePatterns);
  
  console.log('Generated project structure:');
  console.log(generator.generate());
  console.log('\nMarkdown format:');
  console.log(generator.generateMarkdown());
  
  // Сохраняем в файл
  generator.saveToFile(outputFile);
}

// Экспорт для использования как модуль
module.exports = TreeGenerator;

// Запуск если файл выполняется напрямую
if (require.main === module) {
  main();
}