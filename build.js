/**
 * AI Pass 构建脚本
 * 从background.js中读取AI_SITES数组，自动更新manifest.json文件
 */
const fs = require('fs');
const path = require('path');

// 读取background.js文件
const backgroundPath = path.join(__dirname, 'background.js');
const backgroundContent = fs.readFileSync(backgroundPath, 'utf8');

// 提取AI_SITES数组
const sitesRegex = /const\s+AI_SITES\s*=\s*\[([\s\S]*?)\];/;
const match = backgroundContent.match(sitesRegex);

if (!match || !match[1]) {
  console.error('无法从background.js中提取AI_SITES数组');
  process.exit(1);
}

// 解析URL列表
const urlsText = match[1].trim();
const urls = urlsText
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && line.startsWith('"') && line.includes('//'))
  .map(line => {
    // 移除末尾的逗号
    if (line.endsWith(',')) {
      return line.slice(0, -1);
    }
    return line;
  });

// 读取manifest.json
const manifestPath = path.join(__dirname, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// 更新content_scripts.matches
if (manifest.content_scripts && manifest.content_scripts.length > 0) {
  manifest.content_scripts[0].matches = JSON.parse(`[${urls.join(',')}]`);
}

// 更新host_permissions
manifest.host_permissions = JSON.parse(`[${urls.join(',')}]`);

// 更新web_accessible_resources.matches
if (manifest.web_accessible_resources && manifest.web_accessible_resources.length > 0) {
  manifest.web_accessible_resources[0].matches = JSON.parse(`[${urls.join(',')}]`);
}

// 写回manifest.json
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log('✅ manifest.json已更新，所有URL已从AI_SITES同步');
