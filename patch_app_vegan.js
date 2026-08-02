const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.js');
let content = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Add VEGAN and VEGETARIAN to weeklyStrategy options
const oldStrategyBlock = `                      {[
                        {id: 'BALANCED', label: '🥗 Dengeli'},
                        {id: 'FIT', label: '💪 Fit & Zinde'},
                        {id: 'BUDGET', label: '💰 Bütçe Dostu'},
                        {id: 'PREMIUM', label: '💎 Bol Etli (Premium)'}
                      ].map(st => (`;

const newStrategyBlock = `                      {[
                        {id: 'BALANCED', label: '🥗 Dengeli'},
                        {id: 'VEGAN', label: '🌱 Vegan (Sıfır Hayvansal)'},
                        {id: 'VEGETARIAN', label: '🥦 Vejetaryen (Etsiz)'},
                        {id: 'FIT', label: '💪 Fit & Zinde'},
                        {id: 'BUDGET', label: '💰 Bütçe Dostu'},
                        {id: 'PREMIUM', label: '💎 Bol Etli (Premium)'}
                      ].map(st => (`;

// 2. Add VEGAN and VEGETARIAN to weeklyProfile options
const oldProfileBlock = `                      {[
                        {id: 'SINGLE', label: '🤵 Bekar (Hızlı & Pratik)'},
                        {id: 'KIDS', label: '👨‍👩‍👧 Çocuklu (Acısız & Sevilen)'},
                        {id: 'DIABETIC', label: '💉 Diyabet (Düşük Karb)'},
                        {id: 'ATHLETE', label: '🏋️‍♂️ Sporcu (Bol Protein)'}
                      ].map(st => (`;

const newProfileBlock = `                      {[
                        {id: 'SINGLE', label: '🤵 Bekar (Hızlı & Pratik)'},
                        {id: 'VEGAN', label: '🌱 Vegan Beslenme'},
                        {id: 'VEGETARIAN', label: '🥦 Vejetaryen Beslenme'},
                        {id: 'KIDS', label: '👨‍👩‍👧 Çocuklu (Acısız & Sevilen)'},
                        {id: 'DIABETIC', label: '💉 Diyabet (Düşük Karb)'},
                        {id: 'ATHLETE', label: '🏋️‍♂️ Sporcu (Bol Protein)'}
                      ].map(st => (`;

content = content.replace(oldStrategyBlock, newStrategyBlock);
content = content.replace(oldProfileBlock, newProfileBlock);

fs.writeFileSync(appPath, content, 'utf8');
console.log('src/App.js successfully patched with Vegan & Vegetarian options!');
