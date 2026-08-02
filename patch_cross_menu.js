const fs = require('fs');
const path = require('path');

// 1. Add Spinach recipes to hugeRecipes.js
const hugePath = path.join(__dirname, 'src', 'hugeRecipes.js');
let hugeContent = fs.readFileSync(hugePath, 'utf8');

const newSpinachRecipes = `  {
    "id": "spinach_1",
    "name": "Zeytinyağlı Ispanak",
    "ingredients": ["ıspanak", "kuru soğan", "zeytinyağı", "pirinç", "domates salçası", "limon"],
    "type": "TURKISH",
    "time": 25,
    "heaviness": 2,
    "cost": 85,
    "recipeDesc": "👨‍🍳 Mutfak Şefi Hazırlık Aşaması:\\n1. Taze ıspanakları bol suda yıkayıp doğrayın.\\n2. Soğanı zeytinyağında pembeleştirip hafif salça ve pirinç ekleyin.\\n3. Kısık ateşte kendi suyuyla pişirin, yoğurtla hafif ve diyet dostu servis edin."
  },
  {
    "id": "spinach_2",
    "name": "Ispanaklı Yumurta",
    "ingredients": ["ıspanak", "yumurta", "kuru soğan", "tereyağı", "karabiber", "tuz"],
    "type": "TURKISH",
    "time": 15,
    "heaviness": 3,
    "cost": 75,
    "recipeDesc": "👨‍🍳 Mutfak Şefi Hazırlık Aşaması:\\n1. Soğan ve ıspanakları tavada soteleyin.\\n2. Üzerine yuvalar açıp taze yumurtaları kırın.\\n3. Kapağı kapalı 3-4 dakika pişirip sıcak sporcu öğünü hazırlayın."
  },
  {
    "id": "spinach_3",
    "name": "Ispanaklı Fırın Graten",
    "ingredients": ["ıspanak", "kaşar peyniri", "süt", "un", "tereyağı", "muskat"],
    "type": "TURKISH",
    "time": 35,
    "heaviness": 6,
    "cost": 160,
    "recipeDesc": "👨‍🍳 Mutfak Şefi Hazırlık Aşaması:\\n1. Haşlanmış ıspanakları beşamel sos ile harmanlayın.\\n2. Güveç veya fırın kabına alıp üzerine bol kaşar rendesi serpin.\\n3. 200 derece fırında nar gibi kızarana kadar pişirin."
  },
  {
    "id": "spinach_4",
    "name": "Ispanaklı El Açması Börek",
    "ingredients": ["ıspanak", "yufka", "lor peyniri", "kuru soğan", "yumurta", "zeytinyağı"],
    "type": "TURKISH",
    "time": 45,
    "heaviness": 7,
    "cost": 190,
    "recipeDesc": "👨‍🍳 Mutfak Şefi Hazırlık Aşaması:\\n1. Ispanak, lor peyniri ve ince kıyılmış soğanı karıştırın.\\n2. Yufkaların arasına zeytinyağlı harç sürerek rulo sarın.\\n3. Üzerine yumurta sarısı sürüp çıtır olana kadar fırınlayın."
  },
  {
    "id": "spinach_5",
    "name": "Kremalı Ispanak Çorbası",
    "ingredients": ["ıspanak", "süt", "krema", "tereyağı", "un", "sarımsak"],
    "type": "TURKISH",
    "time": 20,
    "heaviness": 2,
    "cost": 65,
    "recipeDesc": "👨‍🍳 Mutfak Şefi Hazırlık Aşaması:\\n1. Ispanakları tereyağında sarımsakla soteleyin.\\n2. Un ve süt ekleyip pürüzsüz olana kadar blenderdan geçirin.\\n3. Sıcak ve şifalı diyet çorbanız hazır."
  },
  {
    "id": "spinach_6",
    "name": "Süzme Yoğurtlu Ispanak Borani",
    "ingredients": ["ıspanak", "süzme yoğurt", "sarımsak", "zeytinyağı", "ceviz", "pul biber"],
    "type": "TURKISH",
    "time": 15,
    "heaviness": 2,
    "cost": 90,
    "recipeDesc": "👨‍🍳 Mutfak Şefi Hazırlık Aşaması:\\n1. Ispanakları hafifçe buharda pişirip soğutun.\\n2. Sarımsaklı süzme yoğurt ile karıştırıp servis tabağına yayın.\\n3. Üzerine zeytinyağında yakılmış ceviz ve pul biber gezdirin."
  },
`;

if (!hugeContent.includes('spinach_1')) {
  hugeContent = hugeContent.replace('export const DB_MAINS_HUGE = [', 'export const DB_MAINS_HUGE = [\n' + newSpinachRecipes);
  fs.writeFileSync(hugePath, hugeContent, 'utf8');
  console.log('Spinach recipes added to hugeRecipes.js!');
}

// 2. Fix generateCrossMenu in engine.js
const enginePath = path.join(__dirname, 'src', 'engine.js');
let engineContent = fs.readFileSync(enginePath, 'utf8').replace(/\r\n/g, '\n');

const newCrossMenuFunc = `export const generateCrossMenu = (inputStr) => {
  const t = inputStr.trim().toLowerCase();
  if (!t) return null;

  function durShuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  if (!window.crossShownPairs) window.crossShownPairs = {};
  if (!window.crossLastInput) window.crossLastInput = '';
  if (window.crossLastInput !== t) {
    window.crossShownPairs[t] = [];
    window.crossLastInput = t;
  }
  const shownPairIds = window.crossShownPairs[t] || [];

  // 1. Find direct matches in name or ingredients
  let matches = DB_MAINS_HUGE.filter(m => m.name.toLowerCase().includes(t) || m.ingredients.some(i => i.toLowerCase().includes(t)));

  // 2. If fewer than 4 matches, expand with word tokens or related dishes
  if (matches.length < 4) {
    const tokens = t.split(/\\s+/).filter(w => w.length >= 3);
    const broader = DB_MAINS_HUGE.filter(m => {
      const text = (m.name + " " + m.ingredients.join(" ")).toLowerCase();
      return tokens.some(tok => text.includes(tok));
    });
    const combined = [...matches, ...broader];
    const uniqueMap = new Map();
    combined.forEach(m => uniqueMap.set(m.id, m));
    matches = Array.from(uniqueMap.values());
  }

  if (matches.length === 0) {
    matches = [...DB_MAINS_HUGE];
  }

  // 3. Filter out already shown dish IDs in current session
  let available = matches.filter(m => !shownPairIds.includes(m.id));
  if (available.length < 2) {
    window.crossShownPairs[t] = [];
    available = [...matches];
  }

  const shuffled = durShuffle(available);

  // 4. Partition dishes into Light/Diet and Heavy/Kid pools
  let dietPool = shuffled.filter(m => m.heaviness <= 4 || m.type === 'FIT' || !/(kıyma|et|kuşbaşı|bonfile|antrikot|kebap)/i.test(m.name + " " + m.ingredients.join(" ")));
  if (dietPool.length === 0) dietPool = shuffled;

  let kidPool = shuffled.filter(m => m.heaviness >= 5 || /(kıyma|et|tavuk|kaşar|köfte|fırın|graten|börek)/i.test(m.name + " " + m.ingredients.join(" ")));
  if (kidPool.length === 0) kidPool = shuffled;

  const rawDiet = dietPool[0] || shuffled[0];
  let rawKid = kidPool.find(m => m.id !== rawDiet.id) || shuffled.find(m => m.id !== rawDiet.id);

  if (!rawKid || rawKid.id === rawDiet.id) {
    rawKid = DB_MAINS_HUGE.find(m => m.id !== rawDiet.id) || DB_MAINS_HUGE[1];
  }

  window.crossShownPairs[t].push(rawDiet.id, rawKid.id);

  const dietDish = { ...rawDiet, ...getDishDetails(rawDiet) };
  const kidDish = { ...rawKid, ...getDishDetails(rawKid) };

  return {
     diet: { name: dietDish.name, desc: \`🔥 Kalori: \${dietDish.calories} - Saf, hafif ve sindirimi kolay, diyet formuna tam uygun '\${t}' alternatifi.\`, dishObj: dietDish },
     kid: { name: kidDish.name, desc: \`⏱ Süre: \${kidDish.time} dk - Yüksek enerjili, çocukların ve doyurucu lezzet sevenlerin bayılacağı format.\`, dishObj: kidDish }
  };
};`;

const oldCrossStart = engineContent.indexOf('export const generateCrossMenu =');
const oldCrossEnd = engineContent.indexOf('export const generateGroupMenu =');

if (oldCrossStart !== -1 && oldCrossEnd !== -1) {
  engineContent = engineContent.slice(0, oldCrossStart) + newCrossMenuFunc + '\n' + engineContent.slice(oldCrossEnd);
  fs.writeFileSync(enginePath, engineContent, 'utf8');
  console.log('generateCrossMenu successfully updated in engine.js!');
} else {
  console.log('Error: Could not locate generateCrossMenu boundaries in engine.js');
}
