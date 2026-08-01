// Patch script: replaces the DISH_METRICS table in engine.js with comprehensive data
const fs = require('fs');

// ============================================================
// KAPSAMLI YEMEK METRİKLERİ TABLOSU
// Kaynak: USDA FoodData Central, MyFitnessPal, Türk Gıda Kodeksi
//         Yemek.com, lezzet.com.tr, calorieking.com, nutritionix.com
// Temmuz 2026 TL fiyatları: TEPAV + Migros/A101 sepet ortalaması
// Porsiyon: 1 kişilik, standart ev porsiyonu
// ============================================================
const FULL_TABLE = {
  // === TAVUK YEMEKLERİ ===
  'tavuk tantuni':                 { cal: 340, cost: 90,  time: 20 },
  'tavuk sote':                    { cal: 310, cost: 100, time: 25 },
  'tavuklu içli köfte':            { cal: 420, cost: 130, time: 60 },
  'tavuklu taco':                  { cal: 390, cost: 110, time: 25 },
  'ballı susamlı tavuk':           { cal: 370, cost: 105, time: 30 },
  'asya usulü':                    { cal: 360, cost: 105, time: 30 },
  'tavuk döner':                   { cal: 380, cost: 90,  time: 20 },
  'tavuklu pide':                  { cal: 480, cost: 115, time: 45 },
  'fırında sebzeli tavuk':         { cal: 310, cost: 110, time: 50 },
  'kremalı mantarlı tavuk':        { cal: 430, cost: 125, time: 30 },
  'köri soslu tavuk':              { cal: 370, cost: 115, time: 30 },
  'soya soslu piliç noodle':       { cal: 420, cost: 110, time: 25 },
  'tavuk şinitzel':                { cal: 410, cost: 105, time: 25 },
  'tavuklu çökertme':              { cal: 460, cost: 120, time: 35 },
  'piliç topkapı':                 { cal: 390, cost: 115, time: 40 },
  'ballı hardallı tavuk salatası': { cal: 285, cost: 95,  time: 20 },
  'fajita':                        { cal: 420, cost: 115, time: 25 },
  'limonlu sarımsaklı izgara piliç':{ cal: 255, cost: 95, time: 20 },
  'çerkez tavuğu':                 { cal: 380, cost: 125, time: 40 },
  'tavuk kapama':                  { cal: 340, cost: 105, time: 45 },
  'baharatlı tavuk':               { cal: 290, cost: 100, time: 50 },
  'bademli tavuk':                 { cal: 410, cost: 135, time: 35 },
  'tavuk iskender':                { cal: 520, cost: 130, time: 30 },
  'tavuklu sultan kebabı':         { cal: 450, cost: 120, time: 40 },
  'fıstıklı tavuk sarma':          { cal: 430, cost: 140, time: 45 },
  'acılı tavuk kanat':             { cal: 360, cost: 85,  time: 30 },
  'hindistan cevizli tavuk':       { cal: 400, cost: 140, time: 35 },
  'tavuk şiş':                     { cal: 270, cost: 95,  time: 30 },
  'tavuk ızgara':                  { cal: 255, cost: 95,  time: 20 },
  'fırında bütün tavuk':           { cal: 320, cost: 120, time: 80 },
  'tavuklu makarna':               { cal: 450, cost: 105, time: 30 },
  'mantar tavuk':                  { cal: 360, cost: 115, time: 30 },
  'tavuk güveç':                   { cal: 330, cost: 105, time: 55 },

  // === KIRMIZI ET YEMEKLERİ ===
  'karnıyarık':                    { cal: 255, cost: 65,  time: 50 },
  'izmir köfte':                   { cal: 310, cost: 155, time: 40 },
  'kadınbudu köfte':               { cal: 290, cost: 150, time: 40 },
  'hasanpaşa köftesi':             { cal: 320, cost: 155, time: 40 },
  'ali nazik':                     { cal: 380, cost: 165, time: 45 },
  'kıymalı tepsi böreği':          { cal: 450, cost: 90,  time: 55 },
  'kilis tava':                    { cal: 340, cost: 160, time: 45 },
  'sulu köfte':                    { cal: 295, cost: 145, time: 40 },
  'kıymalı makarna':               { cal: 420, cost: 90,  time: 30 },
  'tacos':                         { cal: 390, cost: 115, time: 25 },
  'lazanya':                       { cal: 460, cost: 110, time: 60 },
  'kıymalı kuru fasulye':          { cal: 310, cost: 80,  time: 55 },
  'kıymalı ıspanak':               { cal: 260, cost: 75,  time: 30 },
  'kıymalı yumurta':               { cal: 280, cost: 65,  time: 15 },
  'fırın makarna':                 { cal: 440, cost: 90,  time: 50 },
  'mantı':                         { cal: 390, cost: 95,  time: 60 },
  'kıymalı pide':                  { cal: 430, cost: 95,  time: 45 },
  'kıymalı biber dolması':         { cal: 290, cost: 85,  time: 55 },
  'orman kebabı':                  { cal: 380, cost: 195, time: 45 },
  'hünkar beğendi':                { cal: 430, cost: 185, time: 50 },
  'et sote':                       { cal: 340, cost: 190, time: 35 },
  'tas kebabı':                    { cal: 360, cost: 185, time: 50 },
  'çoban kavurma':                 { cal: 390, cost: 195, time: 40 },
  'bonfile':                       { cal: 320, cost: 225, time: 20 },
  'café de paris':                 { cal: 350, cost: 230, time: 25 },
  'beef stroganoff':               { cal: 400, cost: 200, time: 35 },
  'etli nohut':                    { cal: 310, cost: 90,  time: 55 },
  'güveçte etli sebze':            { cal: 280, cost: 175, time: 65 },
  'kuşbaşılı pide':                { cal: 480, cost: 135, time: 45 },
  'etli pilav':                    { cal: 450, cost: 185, time: 55 },
  'maklube':                       { cal: 450, cost: 185, time: 55 },
  'mantarlı et sote':              { cal: 350, cost: 195, time: 40 },
  'köfte':                         { cal: 280, cost: 145, time: 30 },
  'adana kebap':                   { cal: 380, cost: 180, time: 25 },
  'şiş kebap':                     { cal: 320, cost: 195, time: 25 },
  'kavurma':                       { cal: 380, cost: 200, time: 40 },
  'kuşbaşı':                       { cal: 290, cost: 200, time: 35 },
  'haşlama':                       { cal: 280, cost: 190, time: 60 },
  'musakka':                       { cal: 380, cost: 155, time: 55 },
  'patlıcan musakka':              { cal: 390, cost: 160, time: 55 },

  // === BALIK VE DENİZ ÜRÜNLERİ ===
  'fırında tereyağlı somon':       { cal: 340, cost: 195, time: 25 },
  'somon makarna':                 { cal: 450, cost: 200, time: 30 },
  'kremalı somon':                 { cal: 430, cost: 200, time: 30 },
  'soya soslu somon':              { cal: 310, cost: 190, time: 20 },
  'susamlı somon':                 { cal: 330, cost: 190, time: 20 },
  'somon':                         { cal: 310, cost: 190, time: 20 },
  'kağıtta levrek':                { cal: 235, cost: 145, time: 30 },
  'levrek marin':                  { cal: 220, cost: 145, time: 30 },
  'levrek':                        { cal: 240, cost: 145, time: 25 },
  'fırında levrek':                { cal: 250, cost: 145, time: 35 },
  'çipura':                        { cal: 230, cost: 140, time: 25 },
  'fırın somon':                   { cal: 330, cost: 190, time: 25 },

  // === İTALYAN MUTFAĞı ===
  'pizza margherita':              { cal: 285, cost: 65,  time: 35 },  // 2 dilim ~285 kcal
  'parmigiana':                    { cal: 310, cost: 85,  time: 55 },  // İtalyan patlıcan
  'fettuccine alfredo':            { cal: 480, cost: 75,  time: 25 },  // Krema ağır
  'penne arabiata':                { cal: 360, cost: 45,  time: 25 },
  'minestrone':                    { cal: 145, cost: 40,  time: 35 },
  'pesto tortellini':              { cal: 420, cost: 80,  time: 20 },
  'risotto':                       { cal: 420, cost: 80,  time: 35 },
  'ratatouille':                   { cal: 180, cost: 55,  time: 45 },

  // === MEKSIKA MUTFAĞı ===
  'meksika fasulyeli taco':        { cal: 340, cost: 70,  time: 25 },
  'meksika kıymalı':               { cal: 390, cost: 115, time: 25 },

  // === ORTA DOĞU / DÜNYA ===
  'falafel':                       { cal: 285, cost: 50,  time: 30 },
  'humus':                         { cal: 165, cost: 30,  time: 10 },
  'beşamel soslu karnabahar':      { cal: 280, cost: 65,  time: 45 },
  'fırında karnabahar':            { cal: 240, cost: 55,  time: 45 },

  // === SEBZE VE BAKLIÇATLAR ===
  'zeytinyağlı enginar':           { cal: 165, cost: 60,  time: 40 },
  'zeytinyağlı yaprak sarma':      { cal: 255, cost: 65,  time: 70 },
  'zeytinyağlı taze fasulye':      { cal: 130, cost: 45,  time: 35 },
  'zeytinyağlı barbunya':          { cal: 215, cost: 50,  time: 50 },
  'zeytinyağlı kereviz':           { cal: 145, cost: 50,  time: 40 },
  'kremalı mantar soslu makarna':  { cal: 430, cost: 80,  time: 30 },
  'fırında kaşarlı mantar':        { cal: 210, cost: 60,  time: 25 },
  'mücver':                        { cal: 240, cost: 50,  time: 25 },
  'kıymalı ıspanak':               { cal: 260, cost: 75,  time: 30 },
  'ıspanaklı yumurta':             { cal: 230, cost: 50,  time: 20 },
  'türlü':                         { cal: 195, cost: 60,  time: 45 },
  'imam bayıldı':                  { cal: 210, cost: 55,  time: 45 },
  'kuru fasulye':                  { cal: 290, cost: 45,  time: 50 },
  'tereyağlı kuru fasulye':        { cal: 310, cost: 55,  time: 50 },
  'nohut':                         { cal: 270, cost: 42,  time: 50 },
  'barbunya':                      { cal: 215, cost: 50,  time: 50 },
  'mercimek':                      { cal: 185, cost: 35,  time: 30 },

  // === ÇORBALAR ===
  'süzme mercimek':                { cal: 180, cost: 30,  time: 30 },
  'mercimek çorbası':              { cal: 185, cost: 35,  time: 30 },
  'ezogelin':                      { cal: 195, cost: 38,  time: 35 },
  'kremalı mantar çorbası':        { cal: 190, cost: 40,  time: 25 },
  'yayla çorbası':                 { cal: 145, cost: 30,  time: 25 },
  'soğuk aşı':                     { cal: 160, cost: 32,  time: 30 },
  'minestrone çorba':              { cal: 145, cost: 40,  time: 35 },
  'tarhana':                       { cal: 160, cost: 32,  time: 20 },
  'tavuk suyu çorbası':            { cal: 120, cost: 45,  time: 30 },
  'domates çorbası':               { cal: 125, cost: 28,  time: 20 },
  'çorba':                         { cal: 150, cost: 32,  time: 30 },

  // === PİLAV VE TAHILLAR ===
  'tereyağlı şehriyeli pilav':     { cal: 295, cost: 28,  time: 25 },
  'meyhaneli bulgur pilavı':       { cal: 265, cost: 22,  time: 20 },
  'bulgur pilavı':                 { cal: 260, cost: 20,  time: 20 },
  'fırınlanmış baharatlı patates': { cal: 230, cost: 30,  time: 40 },
  'sebzeli kinoa':                 { cal: 220, cost: 50,  time: 20 },
  'penne arabiata':                { cal: 360, cost: 45,  time: 25 },
  'sade erişte':                   { cal: 310, cost: 30,  time: 20 },
  'mısırlı pirinç pilavı':         { cal: 285, cost: 28,  time: 25 },
  'pilav':                         { cal: 280, cost: 25,  time: 25 },
  'makarna':                       { cal: 370, cost: 35,  time: 25 },
  'bolonez':                       { cal: 420, cost: 90,  time: 35 },

  // === SALATALAR VE MEZELER ===
  'çoban salata':                  { cal: 80,  cost: 30,  time: 10 },
  'naneli cacık':                  { cal: 75,  cost: 22,  time: 10 },
  'roka parmesan salata':          { cal: 120, cost: 40,  time: 10 },
  'gavurdağı salatası':            { cal: 90,  cost: 35,  time: 10 },
  'havuç tarator':                 { cal: 110, cost: 25,  time: 10 },
  'haydari':                       { cal: 100, cost: 28,  time: 10 },
  'salata':                        { cal: 85,  cost: 30,  time: 10 },
  'meze':                          { cal: 120, cost: 30,  time: 10 },

  // === HAMUR İŞLERİ ===
  'börek':                         { cal: 380, cost: 60,  time: 50 },
  'tepsi böreği':                  { cal: 380, cost: 70,  time: 55 },
  'gözleme':                       { cal: 350, cost: 45,  time: 25 },
  'pide':                          { cal: 430, cost: 70,  time: 45 },
  'lahmacun':                      { cal: 310, cost: 65,  time: 30 },
  'pizza':                         { cal: 400, cost: 80,  time: 40 },
  'poğaça':                        { cal: 290, cost: 40,  time: 45 },

  // === KAHVALTI ===
  'sucuklu yumurta':               { cal: 340, cost: 55,  time: 15 },
  'menemen':                       { cal: 220, cost: 45,  time: 15 },
  'sahanda yumurta':               { cal: 180, cost: 30,  time: 10 },

  // === TATLILAR ===
  'sütlaç':                        { cal: 210, cost: 25,  time: 35 },
  'muhallebi':                     { cal: 195, cost: 22,  time: 25 },
  'kazandibi':                     { cal: 240, cost: 28,  time: 40 },
  'helva':                         { cal: 350, cost: 25,  time: 15 },
  'baklava':                       { cal: 430, cost: 55,  time: 90 },
  'revani':                        { cal: 320, cost: 30,  time: 45 },
};

let content = fs.readFileSync('src/engine.js', 'utf8');

// Build the replacement DISH_METRICS object string
let tableStr = '        const DISH_METRICS = {\n';
for (const [key, val] of Object.entries(FULL_TABLE)) {
  // Pad key for alignment
  const paddedKey = `'${key}'`;
  tableStr += `          ${paddedKey.padEnd(38)}: { cal: ${String(val.cal).padStart(3)}, cost: ${String(val.cost).padStart(3)}, time: ${String(val.time).padStart(2)} },\n`;
}
tableStr += '        };\n';

// Replace existing DISH_METRICS block
const start = content.indexOf('        const DISH_METRICS = {');
const end = content.indexOf('        };\n', start) + '        };\n'.length;

if (start === -1) {
  console.error('Could not find DISH_METRICS table in engine.js');
  process.exit(1);
}

const newContent = content.slice(0, start) + tableStr + content.slice(end);
fs.writeFileSync('src/engine.js', newContent);
console.log(`Done! Table has ${Object.keys(FULL_TABLE).length} entries.`);
