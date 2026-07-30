const fs = require('fs');

let content = fs.readFileSync('engine_head.js', 'utf8');

// 1. Delete the old CROSS_MENU Block
const crossMenuStart = content.indexOf('// -- EVİN SAĞLIK KARNESİ (ÇAPRAZ MENÜ) MOTORU --');
const crossMenuEnd = content.indexOf('// -- BU AKŞAM MİSAFİR VAR MOTORU --');
if (crossMenuStart !== -1 && crossMenuEnd !== -1) {
    content = content.substring(0, crossMenuStart) + content.substring(crossMenuEnd);
}

// 2. Overwrite generateWheelItems
const wheelOldStart = content.indexOf('export const generateWheelItems');
if(wheelOldStart !== -1) {
    const newWheel = `export const generateWheelItems = (filters) => {
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
};`;

    const nextFnEnd = content.indexOf('};', wheelOldStart) + 2;
    content = content.substring(0, wheelOldStart) + newWheel + "\\n\\n" + content.substring(nextFnEnd);
}

// 3. Append the NEW Cross Menu
const newCross = `
// -- YENİ ÇAPRAZ SAĞLIK KARNESİ MOTORU --
export const generateCrossMenu = (inputStr) => {
  const t = inputStr.trim().toLowerCase();
  if(!t) return null;
  
  let matches = DB_MAINS_HUGE.filter(m => 
      m.name.toLowerCase().includes(t) || m.ingredients.some(i => i.toLowerCase().includes(t))
  );
  
  if (matches.length === 0) return null;
  
  matches.sort((a, b) => a.heaviness - b.heaviness);
  
  if (matches.length < 2) {
      return {
         diet: { 
            name: matches[0].name, 
            desc: \`🔥 Kalori: \${getDishDetails(matches[0]).calories} - Diyet formuna uygun tek alternatif.\`,
            dishObj: matches[0]
         },
         kid: {
            name: matches[0].name + " (Çocuk/Sporcu Porsiyonu)",
            desc: \`⏱ Süre: \${matches[0].time} dk - Daha doyurucu soslarla ekstra porsiyonlu servis.\`,
            dishObj: matches[0]
         }
      };
  }
  
  const dietDish = matches[0];
  const kidDish = matches[matches.length - 1];

  return {
     diet: { 
        name: dietDish.name, 
        desc: \`🔥 Kalori: \${getDishDetails(dietDish).calories} - Saf, hafif ve sindirimi kolay, diyet formuna tam uygun \${t} alternatifi.\`,
        dishObj: dietDish
     },
     kid: {
        name: kidDish.name,
        desc: \`⏱ Süre: \${kidDish.time} dk - Yüksek enerjili, çocukların ve sporcuların bayılacağı doyurucu formatı.\`,
        dishObj: kidDish
     }
  };
};
`;

content += newCross;
fs.writeFileSync('src/engine.js', content, 'utf8');
console.log('SUCCESS!');
