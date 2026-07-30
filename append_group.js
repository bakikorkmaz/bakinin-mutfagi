const fs = require('fs');
let code = fs.readFileSync('src/engine.js', 'utf8');

const newFn = `
export const generateGroupMenu = (members) => {
   if (!members || members.length === 0) return [];
   
   // Parse constraints
   const rules = members.map(m => m.rule);
   
   const isVegan = rules.includes('VEGAN');
   const isGlutenFree = rules.includes('GLUTEN_FREE');
   const isLactoseFree = rules.includes('LACTOSE_FREE');
   const isDiabetic = rules.includes('DIABETIC');
   const isSeafoodAllergy = rules.includes('SEAFOOD_ALLERGY');
   const wantsWeightLoss = rules.includes('WEIGHT_LOSS');
   const wantsWeightGain = rules.includes('WEIGHT_GAIN');
   const wantsProtein = rules.includes('HIGH_PROTEIN');
   
   const veganBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|süt|yumurta|peynir|kaşar|tereyağı|krema|kavurma)/i;
   const glutenBanned = /(makarna|noodle|un|ekmek|bulgur|şehriye)/i;
   const lactoseBanned = /(süt|krema|peynir|kaşar|tereyağı)/i;
   const diabeticBanned = /(şeker|makarna|pirinç|noodle|ekmek|patates)/i;
   const seafoodBanned = /(somon|levrek|karides|balık)/i;
   const proteinBoost = /(tavuk|kıyma|et|somon|kaşar|yumurta|nohut|fasulye|mercimek|peynir)/i;

   let validDishes = [];

   DB_MAINS_HUGE.forEach(dish => {
       const ings = dish.ingredients.join(" ").toLowerCase() + " " + dish.name.toLowerCase();
       
       if (isVegan && veganBanned.test(ings)) return;
       if (isGlutenFree && glutenBanned.test(ings)) return;
       if (isLactoseFree && lactoseBanned.test(ings)) return;
       if (isDiabetic && diabeticBanned.test(ings)) return;
       if (isSeafoodAllergy && seafoodBanned.test(ings)) return;
       if (wantsWeightLoss && dish.heaviness > 5) return;
       if (wantsWeightGain && dish.heaviness < 4) return;
       
       let score = 0;
       if (wantsProtein && proteinBoost.test(ings)) score += 5;
       if (wantsWeightLoss && dish.heaviness <= 3) score += 3;
       if (wantsWeightGain && dish.heaviness >= 7) score += 3;
       
       validDishes.push({ ...dish, score });
   });

   if (validDishes.length === 0) {
      return []; // Could not find any intersection
   }

   validDishes.sort((a,b) => b.score - a.score);
   
   // Take top 3
   const results = validDishes.slice(0, 3).map(dish => {
       const details = getDishDetails(dish);
       let logicExp = "Bu yemek tüm grubun seçtiği katı sağlık standartlarını karşılıyor. ";
       
       members.forEach(m => {
           if (m.rule === 'VEGAN') logicExp += \`\${m.name} için tamamen hayvansız. \`;
           if (m.rule === 'GLUTEN_FREE') logicExp += \`\${m.name} için un veya hamur barındırmıyor. \`;
           if (m.rule === 'DIABETIC') logicExp += \`\${m.name} için şeker veya zararlı karbonhidrat sıfır. \`;
           if (m.rule === 'LACTOSE_FREE') logicExp += \`\${m.name} için içerisinde hiç süt ürünü yok. \`;
           if (m.rule === 'SEAFOOD_ALLERGY') logicExp += \`\${m.name} deniz ürünleri hassasiyetini güvenceye alıyor. \`;
           if (m.rule === 'HIGH_PROTEIN') logicExp += \`\${m.name} için kasları besleyen yapıda. \`;
           if (m.rule === 'WEIGHT_LOSS') logicExp += \`\${m.name} kilosuna pürüzsüz uyumlu hafiflikte. \`;
           if (m.rule === 'WEIGHT_GAIN') logicExp += \`\${m.name} için yüksek enerjili ve doyurucu bir tabak. \`;
       });
       
       return { ...dish, ...details, logicExplanation: logicExp.trim() };
   });

   return results;
};
`;

if (!code.includes('export const generateGroupMenu')) {
    code += "\\n" + newFn;
    fs.writeFileSync('src/engine.js', code, 'utf8');
    console.log("Group Menu injected into engine.js");
} else {
    console.log("generateGroupMenu already exists!");
}
