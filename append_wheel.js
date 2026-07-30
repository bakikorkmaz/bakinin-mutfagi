const fs = require('fs');
const newWheel = `
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
`;

fs.appendFileSync('src/engine.js', newWheel, 'utf8');
console.log('Appended wheel generator successfully!');
