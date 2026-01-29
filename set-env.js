const fs = require('fs');
const path = require('path');

// 這是 environment.ts 的目標路徑
const targetPath = path.join(__dirname, './src/environments/environment.ts');

// 這裡抓取你在 Netlify 設定的環境變數名稱，假設叫 GEMINI_API_KEY
const envConfigFile = `
export const environment = {
  production: true,
  apiKey: '${process.env.API_KEY || ""}'
};
`;

console.log('正在嘗試將環境變數寫入: ' + targetPath);

fs.writeFile(targetPath, envConfigFile, function (err: any) {
  if (err) {
    console.error('寫入失敗：', err);
  } else {
    console.log('環境變數寫入成功！');
  }
});