const fs = require('fs');
let code = fs.readFileSync('src/engine.js', 'utf8');

// 1. Inject missing Appended functions
const missingFns = `
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
    // If getTrueCost exists we use it, else 18
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
`;

code += "\\n" + missingFns;

// 2. Overwrite getDishDetails with macro logic
const dishDetailsStart = code.indexOf('export const getDishDetails');
const dishDetailsEnd = code.indexOf('};', dishDetailsStart) + 2;

if(dishDetailsStart !== -1) {
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
  code = code.substring(0, dishDetailsStart) + ultraDishDetails + code.substring(dishDetailsEnd);
}

fs.writeFileSync('src/engine.js', code, 'utf8');
console.log('Fixed missing fns & macros.');
