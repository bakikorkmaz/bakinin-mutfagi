const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.js');
let content = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

const oldStrategy = `                      {[
                        {id: 'BALANCED', label: '🥗 Dengeli'},
                        {id: 'FIT', label: '💪 Fit & Zinde'},
                        {id: 'BUDGET', label: '💰 Bütçe Dostu'},
                        {id: 'PREMIUM', label: '💎 Bol Etli (Premium)'}
                      ].map(st => (`;

const newStrategy = `                      {[
                        {id: 'BALANCED', label: '🥗 Dengeli'},
                        {id: 'VEGETARIAN', label: '🥦 Vejetaryen (Etsiz)'},
                        {id: 'VEGAN', label: '🌱 Vegan (Sıfır Hayvansal)'},
                        {id: 'FIT', label: '💪 Fit & Zinde'},
                        {id: 'BUDGET', label: '💰 Bütçe Dostu'},
                        {id: 'PREMIUM', label: '💎 Bol Etli (Premium)'}
                      ].map(st => (`;

const oldProfile = `                      {[
                        {id: 'SINGLE', label: '🤵 Bekar (Hızlı & Pratik)'},
                        {id: 'KIDS', label: '👨‍👩‍👧 Çocuklu (Acısız & Sevilen)'},
                        {id: 'DIABETIC', label: '💉 Diyabet (Düşük Karb)'},
                        {id: 'ATHLETE', label: '🏋️‍♂️ Sporcu (Bol Protein)'}
                      ].map(st => (`;

const newProfile = `                      {[
                        {id: 'SINGLE', label: '🤵 Bekar (Hızlı & Pratik)'},
                        {id: 'VEGETARIAN', label: '🥦 Vejetaryen'},
                        {id: 'VEGAN', label: '🌱 Vegan'},
                        {id: 'GLUTEN_FREE', label: '🌾 Glutensiz'},
                        {id: 'KIDS', label: '👨‍👩‍👧 Çocuklu (Acısız & Sevilen)'},
                        {id: 'DIABETIC', label: '💉 Diyabet (Düşük Karb)'},
                        {id: 'ATHLETE', label: '🏋️‍♂️ Sporcu (Bol Protein)'}
                      ].map(st => (`;

content = content.replace(oldStrategy, newStrategy);
content = content.replace(oldProfile, newProfile);

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.js patched successfully!');
