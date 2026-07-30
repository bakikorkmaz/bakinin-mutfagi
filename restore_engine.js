const fs = require('fs');
const cp = require('child_process');

let headContent;
try {
   headContent = cp.execSync('git show HEAD:src/engine.js', { encoding: 'utf8' });
} catch(e) {
   headContent = fs.readFileSync('src/engine.js', 'utf8');
}

const firstCross = headContent.indexOf('export const generateCrossMenu');
let cleanContent = headContent;
if (firstCross !== -1) {
   const nextExp = headContent.indexOf('export const', firstCross + 10);
   if (nextExp !== -1) {
       const commentStart = headContent.lastIndexOf('//', firstCross);
       cleanContent = headContent.substring(0, commentStart > 0 ? commentStart : firstCross) + headContent.substring(nextExp);
   }
}

const injection = `
export const generateMissingShoppingList = (missingIngs) => {
  const categories = {
    "🥩 Kasap & Şarküteri": [],
    "🥗 Manav": [],
    "🛒 Bakkal & Bakliyat": []
  };
  const regexKasap = /(tavuk|kıyma|et|kuşbaşı|somon|kaşar|yoğurt|süt|krema|tereyağı|yumurta)/i;
  const regexManav = /(domates|biber|soğan|sarımsak|patlıcan|kabak|havuç|ıspanak|mantar|salatalık|nane|roka|limon)/i;
  
  let totalCost = 0;
  missingIngs.forEach(ing => {
    let c = 18;
    try { c = typeof getTrueCost === 'function' ? getTrueCost(ing) : 18; } catch(e){}
    totalCost += c; 
    if (regexKasap.test(ing)) categories["🥩 Kasap & Şarküteri"].push(ing);
    else if (regexManav.test(ing)) categories["🥗 Manav"].push(ing);
    else categories["🛒 Bakkal & Bakliyat"].push(ing);
  });
  
  return { categories, estimatedCost: totalCost };
};

export const generateWeeklyPlan = (daysCount, strategy, profile) => {
   let shuffled = [...DB_MAINS_HUGE].sort(() => 0.5 - Math.random());
   if (profile === 'KIDS') shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("jalapeno") || i.includes("acı")) && m.heaviness <= 6);
   if (profile === 'DIABETIC') shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("şeker") || i.includes("makarna") || i.includes("pirinç") || i.includes("noodle")));
   if (profile === 'ATHLETE') shuffled = shuffled.filter(m => m.ingredients.some(i => i.includes("tavuk") || i.includes("kıyma") || i.includes("bonfile")));
   if (profile === 'SINGLE') shuffled = shuffled.filter(m => m.time <= 50);

   let pool = [];
   if (strategy === 'FIT') pool = shuffled.filter(m => m.heaviness <= 4 || m.type === 'FIT');
   else if (strategy === 'BUDGET') pool = shuffled.filter(m => m.cost <= 250);
   else if (strategy === 'PREMIUM') pool = shuffled.filter(m => m.cost >= 350);
  
   else pool = shuffled;
   if (pool.length < daysCount) pool = shuffled;
   if (pool.length < daysCount) pool = [...DB_MAINS_HUGE].sort(() => 0.5 - Math.random());
   const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
   let plan = [];
   for(let i=0; i<daysCount; i++) { plan.push({ day: days[i], dish: pool[i] }); } return plan;
};

export const generateWheelItems = (filters) => {
   const currentWindow = Math.floor(Date.now() / (12 * 60 * 60 * 1000));
   const getPseudoRandom = (str, num) => {
       let hash = 0;
       const combined = str + num;
       for (let i = 0; i < combined.length; i++) {
           hash = Math.imul(31, hash) + combined.charCodeAt(i) | 0;
       }
       return Math.abs(hash) / 2147483647;
   };

   let shuffled = [...DB_MAINS_HUGE].sort((a, b) => getPseudoRandom(a.name, currentWindow) - getPseudoRandom(b.name, currentWindow));
   if (filters.includes('UNDER_45')) shuffled = shuffled.filter(m => m.time <= 45);
   if (filters.includes('UNDER_300TL')) shuffled = shuffled.filter(m => m.cost < 300);
   if (filters.includes('DIABETIC')) shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("şeker") || i.includes("makarna") || i.includes("pirinç") || i.includes("noodle")));
   if (filters.includes('HIGH_PROTEIN')) shuffled = shuffled.filter(m => m.ingredients.some(i => i.includes("tavuk") || i.includes("kıyma") || i.includes("bonfile")));
   if (filters.includes('VEGAN')) shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("tavuk") || i.includes("kıyma") || i.includes("et") || i.includes("süt") || i.includes("yumurta") || i.includes("peynir") || i.includes("kaşar") || i.includes("tereyağı")));
   if (filters.includes('GLUTEN_FREE')) shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("makarna") || i.includes("noodle") || i.includes("un") || i.includes("ekmek") || i.includes("bulgur")));
   
   if (shuffled.length < 13) shuffled = [...DB_MAINS_HUGE].sort((a, b) => getPseudoRandom(a.name, currentWindow) - getPseudoRandom(b.name, currentWindow));
   
   return shuffled.slice(0, 13).map(m => ({ ...m, ...getDishDetails(m) }));
};

export const generateCrossMenu = (inputStr) => {
  const t = inputStr.trim().toLowerCase();
  if(!t) return null;
  let matches = DB_MAINS_HUGE.filter(m => m.name.toLowerCase().includes(t) || m.ingredients.some(i => i.toLowerCase().includes(t)));
  if (matches.length === 0) return null;
  matches.sort((a, b) => a.heaviness - b.heaviness);
  if (matches.length < 2) {
      return {
         diet: { name: matches[0].name, desc: \`🔥 Kalori: \${getDishDetails(matches[0]).calories} - Diyet formuna uygun tek alternatif.\`, dishObj: matches[0] },
         kid: { name: matches[0].name + " (Çocuk/Sporcu Porsiyonu)", desc: \`⏱ Süre: \${matches[0].time} dk - Daha doyurucu soslarla ekstra porsiyonlu servis.\`, dishObj: matches[0] }
      };
  }
  const dietDish = matches[0];
  const kidDish = matches[matches.length - 1];
  return {
     diet: { name: dietDish.name, desc: \`🔥 Kalori: \${getDishDetails(dietDish).calories} - Saf, hafif ve sindirimi kolay, diyet formuna tam uygun \${t} alternatifi.\`, dishObj: dietDish },
     kid: { name: kidDish.name, desc: \`⏱ Süre: \${kidDish.time} dk - Yüksek enerjili, çocukların ve sporcuların bayılacağı doyurucu formatı.\`, dishObj: kidDish }
  };
};
`;

cleanContent += "\n" + injection;

const dishDetailsStart = cleanContent.indexOf('export const getDishDetails');
if(dishDetailsStart !== -1) {
  const dishDetailsEnd = cleanContent.indexOf('};', dishDetailsStart) + 2;
  const ultraDishDetails = `export const getDishDetails = (dish) => {
  if (!dish) return null;
  const ings = dish.ingredients ? dish.ingredients.join(", ") : "Özel malzemeler";
  const dynamicRecipe = dish.recipeDesc || \`1. Ön hazırlıklarınızı yapın ve gerekli ekipmanları çıkarın.\\n2. Listedeki ana malzemeleri (\${ings}) sırasıyla işleyin.\\n3. İdeal pişme süresinin son 5 dakikasında kontrol edip sıcak servis yapın.\`;
  
  const regexMeat = /(kıyma|kuşbaşı|antrikot|bonfile|tavuk|somon|levrek|kaşar|peynir|yumurta|süt|krema)/i;
  const regexCarb = /(makarna|noodle|pirinç|bulgur|şehriye|patates|tortilla|ekmek)/i;
  
  let tCal = 0, pPro = 0, cCarb = 0, fFat = 0;
  if(dish.ingredients) {
     dish.ingredients.forEach(ing => {
        if(regexMeat.test(ing)) { tCal+=180; pPro+=20; fFat+=8; }
        else if(regexCarb.test(ing)) { tCal+=150; cCarb+=30; pPro+=3; fFat+=1; }
        else { tCal+=45; cCarb+=8; fFat+=1; } 
     });
  } else {
     tCal = ((dish.heaviness || 5) * 85);
     pPro = 15; cCarb = 20; fFat = 10;
  }
  if(tCal < 150) tCal += 100;
  
  return {
    prepTime: (dish.time || 30),
    totalCost: dish.cost || 0,
    calories: Math.round(tCal) + " kcal",
    macros: \`Protein: \${pPro}g | Karbonhidrat: \${cCarb}g | Yağ: \${fFat}g\`,
    recipe: dynamicRecipe
  };
};`;
  cleanContent = cleanContent.substring(0, dishDetailsStart) + ultraDishDetails + cleanContent.substring(dishDetailsEnd);
}

cleanContent = cleanContent.replace('totalCost += 18;', 'totalCost += (typeof getTrueCost === "function" ? getTrueCost(ing) : 18);');
fs.writeFileSync('src/engine.js', cleanContent, 'utf8');
console.log('ENGINE FULLY RESTORED AND SAVED.');
