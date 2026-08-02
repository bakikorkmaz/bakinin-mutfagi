const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.js');
let content = fs.readFileSync(appPath, 'utf8');

content = content.replace(
  /\{\s*id:\s*'BALANCED',\s*label:\s*'🥗 Dengeli'\s*\},/g,
  `{id: 'BALANCED', label: '🥗 Dengeli'},\n                        {id: 'VEGETARIAN', label: '🥦 Vejetaryen (Etsiz)'},\n                        {id: 'VEGAN', label: '🌱 Vegan (Sıfır Hayvansal)'},`
);

content = content.replace(
  /\{\s*id:\s*'SINGLE',\s*label:\s*'🤵 Bekar \(Hızlı & Pratik\)'\s*\},/g,
  `{id: 'SINGLE', label: '🤵 Bekar (Hızlı & Pratik)'},\n                        {id: 'VEGETARIAN', label: '🥦 Vejetaryen'},\n                        {id: 'VEGAN', label: '🌱 Vegan'},\n                        {id: 'GLUTEN_FREE', label: '🌾 Glutensiz'},`
);

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.js force patched successfully with regex!');
