const fs = require('fs');
const path = require('path');

const enginePath = path.join(__dirname, 'src', 'engine.js');
let engineContent = fs.readFileSync(enginePath, 'utf8');

// 1. Patch generateWeeklyPlan in engine.js
const oldWeeklyPlan = `export const generateWeeklyPlan = (daysCount, strategy, profile, cuisine = 'ALL', maxTime = 999, maxCost = 9999) => {
   let shuffled = [...DB_MAINS_HUGE].sort(() => 0.5 - Math.random());
   if (profile === 'KIDS') shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("jalapeno") || i.includes("acı")) && m.heaviness <= 6);
   if (profile === 'DIABETIC') shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("şeker") || i.includes("makarna") || i.includes("pirinç") || i.includes("noodle")));
   if (profile === 'ATHLETE') shuffled = shuffled.filter(m => m.ingredients.some(i => i.includes("tavuk") || i.includes("kıyma") || i.includes("bonfile")));
   if (profile === 'SINGLE') shuffled = shuffled.filter(m => m.time <= 50);

   if (maxTime < 999) shuffled = shuffled.filter(m => m.time <= maxTime);
   if (maxCost < 9999) shuffled = shuffled.filter(m => m.cost <= maxCost);

   if (cuisine !== 'ALL') {
       const T = /(kebap|köfte|karnıyarık|pide|türlü|tas kebabı)/i;
       const A = /(noodle|sushi|tatlı ekşi|wok|teriyaki)/i;
       const M = /(taco|fajita|quesadilla|jalapeno|enchilada)/i;
       const I = /(pizza|makarna|risotto|lazanya|pesto)/i;
       const F = /(krep|ratatuy|soğan çorbası|graten|cordon bleu)/i;
       const ME = /(falafel|humus|şavurma|maklube)/i;
       shuffled = shuffled.filter(m => {
          const s = m.name;
          if(cuisine==='TURKISH') return T.test(s) || m.ingredients.includes('kıyma');
          if(cuisine==='ASIAN') return A.test(s) || m.ingredients.includes('soya sosu');
          if(cuisine==='MEXICAN') return M.test(s) || m.ingredients.includes('mısır');
          if(cuisine==='ITALIAN') return I.test(s) || m.ingredients.includes('fesleğen');
          if(cuisine==='FRENCH') return F.test(s) || m.ingredients.includes('krema');
          if(cuisine==='MIDDLE_EASTERN') return ME.test(s) || m.ingredients.includes('nohut');
          return true;
       });
   }

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
};`;

const newWeeklyPlan = `export const generateWeeklyPlan = (daysCount, strategy, profile, cuisine = 'ALL', maxTime = 999, maxCost = 9999) => {
   let shuffled = [...DB_MAINS_HUGE].sort(() => 0.5 - Math.random());

   const veganBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|balık|karides|süt|yumurta|peynir|kaşar|tereyağı|krema|kavurma|sucuk|bonfile|antrikot|köfte|kebap|tas kebabı|mayonez|şinitzel|döner|bacon|sosis|jambon|sakatat)/i;
   const vegBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|balık|karides|kavurma|sucuk|bonfile|antrikot|köfte|kebap|tas kebabı|şinitzel|döner|bacon|sosis|jambon|sakatat)/i;
   const glutenBanned = /(makarna|noodle|un|ekmek|bulgur|şehriye|pide|yufka|lavaş|krep|bazlama|galeta|erişte|irmik)/i;
   const diabeticBanned = /(şeker|makarna|pirinç|noodle|ekmek|patates|tatlı|reçel|bal|pekmez|irmik|baklava|kadayıf|pide|lavaş)/i;

   shuffled = shuffled.filter(m => {
       const fullText = (m.name || "") + " " + (m.ingredients || []).join(" ");
       if ((strategy === 'VEGAN' || profile === 'VEGAN') && veganBanned.test(fullText)) return false;
       if ((strategy === 'VEGETARIAN' || profile === 'VEGETARIAN') && vegBanned.test(fullText)) return false;
       if (profile === 'KIDS' && (/(jalapeno|acı)/i.test(fullText) || m.heaviness > 6)) return false;
       if (profile === 'DIABETIC' && diabeticBanned.test(fullText)) return false;
       if (profile === 'ATHLETE' && !/(tavuk|kıyma|et|bonfile|somon|yumurta|peynir|nohut|fasulye)/i.test(fullText)) return false;
       if (profile === 'SINGLE' && m.time > 50) return false;
       if (profile === 'GLUTEN_FREE' && glutenBanned.test(fullText)) return false;
       if (maxTime < 999 && m.time > maxTime) return false;
       if (maxCost < 9999 && m.cost > maxCost) return false;
       return true;
   });

   if (cuisine !== 'ALL') {
       const T = /(kebap|köfte|karnıyarık|pide|türlü|tas kebabı)/i;
       const A = /(noodle|sushi|tatlı ekşi|wok|teriyaki)/i;
       const M = /(taco|fajita|quesadilla|jalapeno|enchilada)/i;
       const I = /(pizza|makarna|risotto|lazanya|pesto)/i;
       const F = /(krep|ratatuy|soğan çorbası|graten|cordon bleu)/i;
       const ME = /(falafel|humus|şavurma|maklube)/i;
       shuffled = shuffled.filter(m => {
          const s = m.name + " " + m.ingredients.join(" ");
          if(cuisine==='TURKISH') return T.test(s) || s.includes('kıyma');
          if(cuisine==='ASIAN') return A.test(s) || s.includes('soya sosu');
          if(cuisine==='MEXICAN') return M.test(s) || s.includes('mısır');
          if(cuisine==='ITALIAN') return I.test(s) || s.includes('fesleğen');
          if(cuisine==='FRENCH') return F.test(s) || s.includes('krema');
          if(cuisine==='MIDDLE_EASTERN') return ME.test(s) || s.includes('nohut');
          return true;
       });
   }

   let pool = [];
   if (strategy === 'FIT') pool = shuffled.filter(m => m.heaviness <= 4 || m.type === 'FIT');
   else if (strategy === 'BUDGET') pool = shuffled.filter(m => m.cost <= 250);
   else if (strategy === 'PREMIUM') pool = shuffled.filter(m => m.cost >= 350);
   else pool = shuffled;

   if (pool.length === 0) pool = shuffled;
   if (pool.length === 0) {
      pool = DB_MAINS_HUGE.filter(m => {
         const fullText = (m.name || "") + " " + (m.ingredients || []).join(" ");
         if ((strategy === 'VEGAN' || profile === 'VEGAN') && veganBanned.test(fullText)) return false;
         if ((strategy === 'VEGETARIAN' || profile === 'VEGETARIAN') && vegBanned.test(fullText)) return false;
         if (profile === 'DIABETIC' && diabeticBanned.test(fullText)) return false;
         if (profile === 'GLUTEN_FREE' && glutenBanned.test(fullText)) return false;
         return true;
      });
   }

   const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
   let plan = [];
   for(let i=0; i<daysCount; i++) {
      const dish = pool[i % pool.length] || DB_MAINS_HUGE[0];
      plan.push({ day: days[i], dish });
   }
   return plan;
};`;

// 2. Patch generateWheelItems
const oldWheelItems = `export const generateWheelItems = (filters) => {
   let shuffled = [...DB_MAINS_HUGE].sort(() => 0.5 - Math.random());
   if (filters.includes('UNDER_45')) shuffled = shuffled.filter(m => m.time <= 45);
   if (filters.includes('UNDER_300TL')) shuffled = shuffled.filter(m => m.cost < 300);
   if (filters.includes('DIABETIC')) shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("şeker") || i.includes("makarna") || i.includes("pirinç") || i.includes("noodle")));
   if (filters.includes('HIGH_PROTEIN')) shuffled = shuffled.filter(m => m.ingredients.some(i => i.includes("tavuk") || i.includes("kıyma") || i.includes("bonfile")));
   if (filters.includes('VEGAN')) shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("tavuk") || i.includes("kıyma") || i.includes("et") || i.includes("süt") || i.includes("yumurta") || i.includes("peynir") || i.includes("kaşar") || i.includes("tereyağı")));
   if (filters.includes('GLUTEN_FREE')) shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("makarna") || i.includes("noodle") || i.includes("un") || i.includes("ekmek") || i.includes("bulgur")));
   
   if (shuffled.length < 13) shuffled = [...DB_MAINS_HUGE].sort(() => 0.5 - Math.random());
   
   return shuffled.slice(0, 13).map(m => ({ ...m, ...getDishDetails(m) }));
};`;

const newWheelItems = `export const generateWheelItems = (filters = []) => {
   let shuffled = [...DB_MAINS_HUGE].sort(() => 0.5 - Math.random());

   const veganBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|balık|karides|süt|yumurta|peynir|kaşar|tereyağı|krema|kavurma|sucuk|bonfile|antrikot|köfte|kebap|tas kebabı|mayonez|şinitzel|döner|bacon|sosis|jambon|sakatat)/i;
   const vegBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|balık|karides|kavurma|sucuk|bonfile|antrikot|köfte|kebap|tas kebabı|şinitzel|döner|bacon|sosis|jambon|sakatat)/i;
   const glutenBanned = /(makarna|noodle|un|ekmek|bulgur|şehriye|pide|yufka|lavaş|krep|bazlama|galeta|erişte|irmik)/i;
   const diabeticBanned = /(şeker|makarna|pirinç|noodle|ekmek|patates|tatlı|reçel|bal|pekmez|irmik|baklava|kadayıf|pide|lavaş)/i;

   if (filters.includes('UNDER_45')) shuffled = shuffled.filter(m => m.time <= 45);
   if (filters.includes('UNDER_300TL')) shuffled = shuffled.filter(m => m.cost < 300);
   if (filters.includes('DIABETIC')) shuffled = shuffled.filter(m => !diabeticBanned.test(m.name + " " + m.ingredients.join(" ")));
   if (filters.includes('HIGH_PROTEIN')) shuffled = shuffled.filter(m => /(tavuk|kıyma|et|bonfile|somon|yumurta|peynir|nohut|fasulye)/i.test(m.name + " " + m.ingredients.join(" ")));
   if (filters.includes('VEGAN')) shuffled = shuffled.filter(m => !veganBanned.test(m.name + " " + m.ingredients.join(" ")));
   if (filters.includes('VEGETARIAN')) shuffled = shuffled.filter(m => !vegBanned.test(m.name + " " + m.ingredients.join(" ")));
   if (filters.includes('GLUTEN_FREE')) shuffled = shuffled.filter(m => !glutenBanned.test(m.name + " " + m.ingredients.join(" ")));
   
   if (shuffled.length === 0) {
       shuffled = DB_MAINS_HUGE.filter(m => {
           const fullText = m.name + " " + m.ingredients.join(" ");
           if (filters.includes('VEGAN') && veganBanned.test(fullText)) return false;
           if (filters.includes('VEGETARIAN') && vegBanned.test(fullText)) return false;
           if (filters.includes('GLUTEN_FREE') && glutenBanned.test(fullText)) return false;
           if (filters.includes('DIABETIC') && diabeticBanned.test(fullText)) return false;
           return true;
       });
   }
   
   let result = [];
   for (let i = 0; i < 13; i++) {
      result.push(shuffled[i % shuffled.length] || DB_MAINS_HUGE[0]);
   }
   return result.map(m => ({ ...m, ...getDishDetails(m) }));
};`;

// 3. Patch generateGuestMenu
const oldGuestMenu = `export const generateGuestMenu = (personCountInput, restrictionsArray) => {
  const personCount = Math.max(1, parseInt(personCountInput) || 1);
  const isVeg = restrictionsArray.includes("vejetaryen");
  const isGlutenFree = restrictionsArray.includes("glutensiz");
  const isDiabetic = restrictionsArray.includes("diyabetik");

  const safeSoups = DB_SOUPS.filter(s => {
    if (isGlutenFree && (s.ingredients.includes("un") || s.ingredients.includes("şehriye") || s.ingredients.includes("buğday"))) return false;
    return true;
  });

  const safeMains = DB_MAINS.filter(m => {
    if (isVeg && (m.ingredients.includes("kıyma") || m.ingredients.includes("tavuk") || m.ingredients.includes("et") || m.ingredients.includes("kuşbaşı") || m.ingredients.includes("somon"))) return false;
    if (isGlutenFree && (m.ingredients.includes("makarna") || m.ingredients.includes("bulgur"))) return false;
    return true;
  });

  const safeCarbs = DB_CARBS.filter(c => {
    if (isGlutenFree && (c.ingredients.includes("makarna") || c.ingredients.includes("bulgur") || c.ingredients.includes("şehriye"))) return false;
    return true;
  });

  const safeDesserts = DB_DESSERTS_GUEST.filter(d => {
    if (isDiabetic && !d.strictMatch.includes("diyabetik")) return false;
    return true;
  });`;

const newGuestMenu = `export const generateGuestMenu = (personCountInput, restrictionsArray = []) => {
  const personCount = Math.max(1, parseInt(personCountInput) || 1);
  const isVeg = restrictionsArray.includes("vejetaryen") || restrictionsArray.includes("vegan");
  const isVegan = restrictionsArray.includes("vegan");
  const isGlutenFree = restrictionsArray.includes("glutensiz");
  const isDiabetic = restrictionsArray.includes("diyabetik");

  const veganBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|balık|karides|süt|yumurta|peynir|kaşar|tereyağı|krema|kavurma|sucuk|bonfile|antrikot|köfte|kebap|tas kebabı|mayonez|şinitzel|döner|bacon|sosis|jambon|sakatat)/i;
  const vegBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|balık|karides|kavurma|sucuk|bonfile|antrikot|köfte|kebap|tas kebabı|şinitzel|döner|bacon|sosis|jambon|sakatat)/i;
  const glutenBanned = /(makarna|noodle|un|ekmek|bulgur|şehriye|pide|yufka|lavaş|krep|bazlama|galeta|erişte|irmik)/i;
  const diabeticBanned = /(şeker|makarna|pirinç|noodle|ekmek|patates|tatlı|reçel|bal|pekmez|irmik|baklava|kadayıf|pide|lavaş)/i;

  const safeSoups = DB_SOUPS.filter(s => {
    const fullText = (s.name || "") + " " + (s.ingredients || []).join(" ");
    if (isVegan && veganBanned.test(fullText)) return false;
    if (isVeg && vegBanned.test(fullText)) return false;
    if (isGlutenFree && glutenBanned.test(fullText)) return false;
    return true;
  });

  const safeMains = DB_MAINS.filter(m => {
    const fullText = (m.name || "") + " " + (m.ingredients || []).join(" ");
    if (isVegan && veganBanned.test(fullText)) return false;
    if (isVeg && vegBanned.test(fullText)) return false;
    if (isGlutenFree && glutenBanned.test(fullText)) return false;
    if (isDiabetic && diabeticBanned.test(fullText)) return false;
    return true;
  });

  const safeCarbs = DB_CARBS.filter(c => {
    const fullText = (c.name || "") + " " + (c.ingredients || []).join(" ");
    if (isVegan && veganBanned.test(fullText)) return false;
    if (isVeg && vegBanned.test(fullText)) return false;
    if (isGlutenFree && glutenBanned.test(fullText)) return false;
    if (isDiabetic && diabeticBanned.test(fullText)) return false;
    return true;
  });

  const safeDesserts = DB_DESSERTS_GUEST.filter(d => {
    const fullText = (d.name || "") + " " + (d.ingredients || []).join(" ");
    if (isVegan && veganBanned.test(fullText)) return false;
    if (isVeg && vegBanned.test(fullText)) return false;
    if (isGlutenFree && glutenBanned.test(fullText)) return false;
    if (isDiabetic && (diabeticBanned.test(fullText) || !d.strictMatch?.includes("diyabetik"))) return false;
    return true;
  });`;

// Normalize CRLF to LF for matching
let normalizedEngine = engineContent.replace(/\r\n/g, '\n');

if (!normalizedEngine.includes(oldWeeklyPlan.replace(/\r\n/g, '\n'))) {
   console.log("Warning: oldWeeklyPlan not found exact match, using regex replace");
}
normalizedEngine = normalizedEngine.replace(oldWeeklyPlan.replace(/\r\n/g, '\n'), newWeeklyPlan);
normalizedEngine = normalizedEngine.replace(oldWheelItems.replace(/\r\n/g, '\n'), newWheelItems);
normalizedEngine = normalizedEngine.replace(oldGuestMenu.replace(/\r\n/g, '\n'), newGuestMenu);

// Also patch generateGroupMenu banned lists
normalizedEngine = normalizedEngine.replace(
  'const veganBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|süt|yumurta|peynir|kaşar|tereyağı|krema|kavurma|sucuk|bonfile)/i;',
  'const veganBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|balık|karides|süt|yumurta|peynir|kaşar|tereyağı|krema|kavurma|sucuk|bonfile|antrikot|köfte|kebap|tas kebabı|mayonez|şinitzel|döner|bacon|sosis|jambon|sakatat)/i;\n   const vegBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|balık|karides|kavurma|sucuk|bonfile|antrikot|köfte|kebap|tas kebabı|şinitzel|döner|bacon|sosis|jambon|sakatat)/i;'
);
normalizedEngine = normalizedEngine.replace(
  'if (isVegan && veganBanned.test(ings)) isBanned = true;',
  'if (isVegan && veganBanned.test(ings)) isBanned = true;\n       if (rules.includes("VEGETARIAN") && vegBanned.test(ings)) isBanned = true;'
);

fs.writeFileSync(enginePath, normalizedEngine, 'utf8');
console.log('src/engine.js successfully patched!');
