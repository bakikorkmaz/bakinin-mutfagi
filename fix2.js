const fs = require('fs');
let lines = fs.readFileSync('src/engine.js', 'utf8').split('\n');
// We know lines 0 through 486 are perfectly fine!
let newLines = lines.slice(0, 487);
newLines.push("   else pool = shuffled;");
newLines.push("   if (pool.length < daysCount) pool = shuffled;");
newLines.push("   if (pool.length < daysCount) pool = [...DB_MAINS_HUGE].sort(() => 0.5 - Math.random());");
newLines.push('   const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];');
newLines.push("   let plan = [];");
newLines.push("   for(let i=0; i<daysCount; i++) { plan.push({ day: days[i], dish: pool[i] }); } return plan;");
newLines.push("};");
newLines.push("");
const wheelStr = `
export const generateWheelItems = (filter) => {
   let shuffled = [...DB_MAINS_HUGE].sort(() => 0.5 - Math.random());
   if (filter === 'UNDER_45') shuffled = shuffled.filter(m => m.time <= 45);
   if (filter === 'UNDER_300TL') shuffled = shuffled.filter(m => m.cost < 300);
   if (filter === 'DIABETIC') shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("şeker") || i.includes("makarna") || i.includes("pirinç") || i.includes("noodle")));
   if (filter === 'HIGH_PROTEIN') shuffled = shuffled.filter(m => m.ingredients.some(i => i.includes("tavuk") || i.includes("kıyma") || i.includes("bonfile")));
   if (filter === 'VEGAN') shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("tavuk") || i.includes("kıyma") || i.includes("et") || i.includes("süt") || i.includes("yumurta") || i.includes("peynir") || i.includes("kaşar") || i.includes("tereyağı")));
   if (filter === 'GLUTEN_FREE') shuffled = shuffled.filter(m => !m.ingredients.some(i => i.includes("makarna") || i.includes("noodle") || i.includes("un") || i.includes("ekmek") || i.includes("bulgur")));
   if (shuffled.length < 13) shuffled = [...DB_MAINS_HUGE].sort(() => 0.5 - Math.random());
   return shuffled.slice(0, 13).map(m => ({ ...m, ...getDishDetails(m) }));
};
`;
newLines.push(wheelStr);
fs.writeFileSync('src/engine.js', newLines.join('\n'));
console.log('SURGERY DONE');
