const fs = require('fs');
const path = require('path');

// 1. 確保目錄存在 (如果沒有 environments 資料夾就建立它)
const dir = './src/environments';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// 2. 定義目標路徑
const targetPath = path.join(__dirname, './src/environments/environment.ts');

// 3. 讀取 Netlify 上的變數 (確保 Key 名稱跟 Netlify 後台一模一樣)
// 如果你後台設定的是 API_KEY，這裡就要改用 process.env.API_KEY
const apiKey = process.env.API_KEY || '';

const envConfigFile = `
export const environment = {
  production: true,
  apiKey: '${apiKey}'
};
`;

console.log('正在注入環境變數到: ' + targetPath);

try {
  fs.writeFileSync(targetPath, envConfigFile, 'utf8');
  console.log('環境變數寫入成功！內容長度：' + envConfigFile.length);
} catch (err) {
  console.error('寫入失敗：', err);
  process.exit(1); // 失敗時強制停止，避免後續 build 錯誤
}