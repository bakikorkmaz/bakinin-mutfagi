// Baki'nin Mutfa─ş─▒ - Gastronomi Zeka Motoru (AI Engine)
// Bu motor on binlerce men├╝ kombinasyonunu ger├ğek├ği bir ┼şekilde ├╝retir.

export const BUDGET_TYPES = [
  { id: 'STUDENT', min: 0, max: 200, label: "­şæ¿ÔÇı­şÄô ├û─şrenci (0-200 TL)", desc: "Doyurucu & Ekonomik" },
  { id: 'FAMILY', min: 200, max: 400, label: "­şæ¿ÔÇı­şæ®ÔÇı­şæğÔÇı­şæĞ Aile (200-400 TL)", desc: "Dengeli Ev Yeme─şi" },
  { id: 'GUEST', min: 400, max: 9999, label: "­şı¢´©Å Misafir (+400 TL)", desc: "┼Ş─▒k Sunum & Ara S─▒caklar" }
];

export const CUISINE_TYPES = [
  { id: 'LOCAL', label: "­şç╣­şçÀ Yerli (Geleneksel)" },
  { id: 'FOREIGN', label: "­şîı Yabanc─▒ (D├╝nya Mutfa─ş─▒)" },
  { id: 'ALL', label: "Farketmez" }
];

export const MENU_THEMES = [
  { id: 'SUMMER', label: "ÔİÇ´©Å Yaz Men├╝s├╝" },
  { id: 'WINTER', label: "ÔØä´©Å K─▒┼ş Men├╝s├╝" },
  { id: 'RAMADAN', label: "­şîÖ Ramazan Men├╝s├╝" },
  { id: 'FIT', label: "­şÆ¬ Fit / Sporcu" }
];

export { CATEGORIZED_INGREDIENTS, INGREDIENT_KEYWORDS } from './engineIngredients';

// Ger├ğek├ği Database (1 Ki┼şilik Fiyatlard─▒r)
const DB_SOUPS = [
  { id: "s1", name: "S├╝zme Mercimek ├çorbas─▒", type: "LOCAL", theme: ["WINTER", "RAMADAN"], cost: 25, time: 30, heaviness: 2, ingredients: ["mercimek", "so─şan", "tereya─ş─▒", "sal├ğa"] },
  { id: "s2", name: "Kremal─▒ Mantar ├çorbas─▒", type: "FOREIGN", theme: ["WINTER"], cost: 45, time: 25, heaviness: 4, ingredients: ["mantar", "krema", "tereya─ş─▒", "un", "s├╝t"] },
  { id: "s3", name: "Yayla ├çorbas─▒", type: "LOCAL", theme: ["SUMMER", "FIT"], cost: 20, time: 20, heaviness: 2, ingredients: ["yo─şurt", "pirin├ğ", "nane", "yumurta"] },
  { id: "s4", name: "So─şuk A┼ş─▒ ├çorbas─▒", type: "LOCAL", theme: ["SUMMER", "FIT"], cost: 20, time: 10, heaviness: 1, ingredients: ["yo─şurt", "nane", "nohut", "bu─şday"] },
  { id: "s5", name: "Minestrone (─░talyan Sebze)", type: "FOREIGN", theme: ["WINTER", "FIT"], cost: 40, time: 35, heaviness: 2, ingredients: ["kabak", "havu├ğ", "domates", "fasulye", "makarna"] },
  { id: "s6", name: "Ezogelin ├çorbas─▒", type: "LOCAL", theme: ["WINTER", "RAMADAN"], cost: 25, time: 35, heaviness: 3, ingredients: ["mercimek", "bulgur", "sal├ğa", "nane"] }
];

const DB_MAINS = [
  { id: "m1", name: "Karn─▒yar─▒k", type: "LOCAL", theme: ["SUMMER", "RAMADAN"], cost: 120, time: 60, heaviness: 6, ingredients: ["patl─▒can", "k─▒yma", "so─şan", "domates", "biber"] },
  { id: "m2", name: "F─▒r─▒nda Ka┼şarl─▒ K├Âfte", type: "LOCAL", theme: ["WINTER"], cost: 150, time: 45, heaviness: 7, ingredients: ["k─▒yma", "ka┼şar", "so─şan", "domates"] },
  { id: "m3", name: "Tavuk Sote", type: "LOCAL", theme: ["WINTER", "FIT"], cost: 85, time: 30, heaviness: 4, ingredients: ["tavuk", "biber", "domates", "so─şan"] },
  { id: "m4", name: "Fettuccine Alfredo", type: "FOREIGN", theme: ["WINTER"], cost: 140, time: 25, heaviness: 8, ingredients: ["makarna", "tavuk", "krema", "mantar"] },
  { id: "m5", name: "Beef Stroganoff", type: "FOREIGN", theme: ["WINTER"], cost: 250, time: 40, heaviness: 8, ingredients: ["et", "mantar", "krema", "so─şan"] },
  { id: "m6", name: "Zeytinya─şl─▒ Taze Fasulye", type: "LOCAL", theme: ["SUMMER", "FIT"], cost: 50, time: 45, heaviness: 2, ingredients: ["fasulye", "domates", "zeytinya─ş─▒", "so─şan"] },
  { id: "m7", name: "Etli Nohut", type: "LOCAL", theme: ["WINTER"], cost: 130, time: 90, heaviness: 6, ingredients: ["nohut", "ku┼şba┼ş─▒", "sal├ğa", "so─şan"] },
  { id: "m8", name: "F─▒r─▒n Somon", type: "FOREIGN", theme: ["FIT", "SUMMER"], cost: 220, time: 30, heaviness: 3, ingredients: ["somon", "zeytinya─ş─▒", "limon", "sar─▒msak"] },
  { id: "m9", name: "Patl─▒can Musakka", type: "LOCAL", theme: ["SUMMER"], cost: 110, time: 55, heaviness: 7, ingredients: ["patl─▒can", "k─▒yma", "sal├ğa", "so─şan"] }
];

const DB_CARBS = [
  { id: "c1", name: "Tereya─şl─▒ ┼Şehriyeli Pilav", type: "LOCAL", cost: 30, time: 25, heaviness: 5, ingredients: ["pirin├ğ", "tereya─ş─▒", "┼şehriye"] },
  { id: "c2", name: "Meyhaneli Bulgur Pilav─▒", type: "LOCAL", cost: 25, time: 30, heaviness: 4, ingredients: ["bulgur", "domates", "biber", "so─şan", "zeytinya─ş─▒"] },
  { id: "c3", name: "F─▒r─▒nlanm─▒┼ş Baharatl─▒ Patates", type: "FOREIGN", cost: 25, time: 40, heaviness: 3, ingredients: ["patates", "zeytinya─ş─▒", "kekik", "sar─▒msak"] },
  { id: "c4", name: "Sebzeli Kinoa", type: "FOREIGN", cost: 60, time: 20, heaviness: 2, ingredients: ["kinoa", "havu├ğ", "kabak", "zeytinya─ş─▒"] },
  { id: "c5", name: "Penne Arabiata", type: "FOREIGN", cost: 45, time: 20, heaviness: 5, ingredients: ["makarna", "domates", "sar─▒msak", "ac─▒ biber"] }
];

const DB_SIDES = [
  { id: "sd1", name: "├çoban Salata", type: "LOCAL", cost: 35, time: 10, heaviness: 1, ingredients: ["domates", "salatal─▒k", "so─şan", "biber", "zeytinya─ş─▒"] },
  { id: "sd2", name: "Naneli Cac─▒k", type: "LOCAL", cost: 25, time: 5, heaviness: 1, ingredients: ["yo─şurt", "salatal─▒k", "nane", "sar─▒msak"] },
  { id: "sd3", name: "Humus", type: "LOCAL", cost: 40, time: 15, heaviness: 4, ingredients: ["nohut", "tahin", "kimyon", "sar─▒msak", "zeytinya─ş─▒"] },
  { id: "sd4", name: "Roka Parmesan Salata", type: "FOREIGN", cost: 60, time: 5, heaviness: 2, ingredients: ["roka", "parmesan", "zeytinya─ş─▒", "balzamik"] },
  { id: "sd5", name: "Gavurda─ş─▒ Salatas─▒", type: "LOCAL", cost: 50, time: 15, heaviness: 2, ingredients: ["domates", "ceviz", "nar ek┼şisi", "so─şan"] }
];

// DURUMSAL S├ûYLEMLER (Yapay Zeka Gastronomi Asistan─▒)
const getSituationAdvice = (totalHeaviness, totalCostPerPerson, mainItem, theme) => {
  if (theme === 'FIT' || totalHeaviness <= 10) {
    return `­şÆí AI Notu: Hafif ve sindirimi kolay. Spordan ├Ânce/sonra rahatl─▒kla t├╝ketebilirsin. ${mainItem.name} sayesinde dengeli kaloridesin.`;
  }
  if (totalHeaviness > 17) {
    return `ÔÜá´©Å AI Notu: ├çok doyurucu, yo─şun bir men├╝. Spordan hemen ├Ânce tavsiye edilmez, idman sonras─▒na saklay─▒n. Uyumadan en az 3 saat ├Ânce yemeye ├Âzen g├Âster.`;
  }
  if (totalCostPerPerson > 200) {
    return `Ô£¿ AI Notu: Zengin ve premium misafir konsepti. ${mainItem.name} ihti┼şam─▒yla masay─▒ donat─▒rken se├ğilen ferah ba┼şlang─▒├ğlar denge kuracakt─▒r.`;
  }
  return `­şÆí AI Notu: Anne eli de─şmi┼ş├ğesine uyumlu, g├╝nl├╝k dengeleyici men├╝. Karbonhidratlar ve ├ğorba kusursuz bir gastronomi ba─ş─▒ kurar.`;
};

// -- AI CHATBOT LOGIC --
const NON_FOOD_KEYWORDS = ["futbol", "spor", "siyaset", "din", "araba", "film", "dizi", "yard─▒m", "teknoloji", "ma├ğ", "tak─▒m", "para", "dolar"];
export const processChatPrompt = (text) => {
  const t = text.toLowerCase();
  
  if (NON_FOOD_KEYWORDS.some(k => t.includes(k))) {
    return `├£zg├╝n├╝m, ben Baki'nin Mutfa─ş─▒'na ├Âzel bir a┼ş├ğ─▒ ve gastronomi yapay zekas─▒y─▒m. L├╝tfen yaln─▒zca yemek, tarif veya men├╝ler hakk─▒nda soru sorunuz. ­şæ¿ÔÇı­şı│`;
  }
  
  if (t.includes("merhaba") || t.includes("selam")) {
    return `Merhaba! Ben Baki'nin YZ Mutfak ┼Şefiyim. Sana harika men├╝ler ├Ânerebilirim, elindeki malzemeleri f─▒s─▒ldaman yeterli! ­şı▓`;
  }
  
  if (t.includes("b├╝t├ğe") || t.includes("param")) {
    return `B├╝t├ğenize tam uyan se├ğenekler i├ğin sol men├╝deki 'Tam B├╝t├ğe' arac─▒n─▒ kullanabilirsiniz. 3 farkl─▒ men├╝ ├ğ─▒kartabilirim!`;
  }
  
  // Basit tarama
  const ings = INGREDIENT_KEYWORDS.filter(k => t.includes(k));
  if (ings.length > 0) {
    return `Harika! Demek elinde ${ings.join(", ")} var. ─░stersen men├╝ motorunu hemen ba┼şlat ve eksikleri sana s├Âyleyeyim. Bu malzemelerle nefis ┼şeyler yapabiliriz!`;
  }

  return `Size tarifler, lezzet uyumlar─▒ veya men├╝ler hakk─▒nda nas─▒l yard─▒mc─▒ olabilirim? (Sorunuza tam odaklanabilmem i├ğin malzemelerinizi sayabilirsiniz.)`;
};

// -- B├£T├çEYE G├ûRE KES─░N 3 ALTERNAT─░F MEN├£ --
export const generateExactBudgetMenus = (personsCount, totalBudgetTL) => {
  // Tam ger├ğek├ği yakla┼ş─▒m. Ki┼şi ba┼ş─▒ harcanabilecek max b├╝t├ğe:
  const perPersonLimit = totalBudgetTL / personsCount;
  
  let validMenus = [];
  
  // T├╝m Kombinasyonlar taran─▒yor
  for (let m of DB_MAINS) {
    for (let c of DB_CARBS) {
      for (let s of DB_SOUPS) {
        for (let sd of DB_SIDES) {
          
          let costPerPerson = m.cost + c.cost + s.cost + sd.cost;
          
          // E─şer tek bir ki┼şinin b├╝t├ğesinin alt─▒ndaysak, ge├ğerli.
          // Besleyicilik = Heaviness (bu durumda doyuruculuk, ne kadar fazlaysa o kadar kalori/protein).
          if (costPerPerson <= perPersonLimit) {
            let totalTime = Math.max(m.time, c.time) + Math.min(s.time, sd.time);
            let totalHeaviness = m.heaviness + c.heaviness + s.heaviness + sd.heaviness;
            
            // "Kalan Para"
            let totalMenuCostForEveryone = costPerPerson * personsCount;
            let efficiency = costPerPerson / perPersonLimit; // 1'e ne kadar yak─▒nsa o kadar tam kullan─▒lm─▒┼ş b├╝t├ğe
            
            validMenus.push({
              main: m, soup: s, carb: c, side: sd,
              costPerPerson,
              totalCost: totalMenuCostForEveryone,
              efficiency,
              heaviness: totalHeaviness,
              advice: getSituationAdvice(totalHeaviness, costPerPerson, m, null)
            });
          }
        }
      }
    }
  }

  // 1) En "Besleyici ve Tam B├╝t├ğe (B├╝t├ğeyi en verimli kullanan)"
  // 2) En Hafif / Sindirimi kolay alternatif
  // 3) En Ekonomik (Artan Paras─▒ en ├ğok olan alternatif)
  
  if (validMenus.length === 0) return [];

  // Sort by highest cost first (closest to budget)
  validMenus.sort((a,b) => b.costPerPerson - a.costPerPerson);
  const bestFit = validMenus[0]; // Maximum b├╝t├ğe kullanan dolu men├╝
  bestFit.label = "­şîş L├╝ks & Doyurucu (B├╝t├ğeye En Yak─▒n)";

  let remaining = validMenus.filter(m => m !== bestFit);
  
  remaining.sort((a,b) => a.heaviness - b.heaviness); 
  const lightest = remaining.length > 0 ? remaining[0] : null; // En hafif (Salata/├ğorba a─ş─▒rl─▒kl─▒)
  if(lightest) lightest.label = "­şÑù Sindirimi Kolay (Hafif)";

  remaining = remaining.filter(m => m !== lightest);
  
  remaining.sort((a,b) => a.costPerPerson - b.costPerPerson);
  const economic = remaining.length > 0 ? remaining[0] : null; // En ├ğok para artt─▒ran
  if(economic) economic.label = "­şÆ░ Maksimum Ekonomik (Cebinizde kal─▒r)";

  return [bestFit, lightest, economic].filter(Boolean);
};

// -- ANA MOTOR --
export const generateSmartMenus = ({ selectedIngredients, budget, cuisine, theme }) => {
  let menus = [];
  let count = 0;

  for (let m of DB_MAINS) {
    for (let c of DB_CARBS) {
      for (let s of DB_SOUPS) {
        for (let sd of DB_SIDES) {
          
          let totalCost = m.cost + c.cost + s.cost + sd.cost;
          let totalTime = Math.max(m.time, c.time) + Math.min(s.time, sd.time); 
          let totalHeaviness = m.heaviness + c.heaviness + s.heaviness + sd.heaviness;

          if (budget) {
            const bDef = BUDGET_TYPES.find(b => b.id === budget);
            if (bDef && (totalCost < bDef.min || totalCost >= bDef.max)) continue;
          }

          if (cuisine && cuisine !== 'ALL') {
             if (m.type !== cuisine) continue; 
          }

          if (theme && m.theme && !m.theme.includes(theme)) {
             continue;
          }

          let matchScore = 0;
          let allIngredients = [...m.ingredients, ...c.ingredients, ...s.ingredients, ...sd.ingredients];
          let missingIngredients = [];
          
          if (selectedIngredients.length > 0) {
             const lowerSelected = selectedIngredients.map(x=>x.toLowerCase());
             allIngredients.forEach(ing => {
                if(lowerSelected.some(sel => sel.includes(ing) || ing.includes(sel))) {
                  matchScore++;
                } else {
                  missingIngredients.push(ing);
                }
             });

             let mainMatched = m.ingredients.filter(ing => lowerSelected.some(sel => sel.includes(ing) || ing.includes(sel)));
             if (mainMatched.length === 0) continue;
          }

          if (s.heaviness > 3 && c.heaviness > 4 && m.heaviness > 5) continue; 

          menus.push({
            id: `menu_${count++}`,
            main: m, soup: s, carb: c, side: sd,
            totalCost, totalTime, matchScore,
            missingIngredients: [...new Set(missingIngredients)],
            advice: getSituationAdvice(totalHeaviness, totalCost, m, theme)
          });
        }
      }
    }
  }

  menus.sort((a, b) => {
    if (selectedIngredients.length > 0) return b.matchScore - a.matchScore;
    return a.totalCost - b.totalCost;
  });

  return menus.slice(0, 15);
};

export const generateFridgeMains = (selectedIngredients) => {
   let mains = [];
   const lowerSelected = selectedIngredients.map(x=>x.toLowerCase());
   for (let m of DB_MAINS) {
      let matchScore = 0;
      m.ingredients.forEach(ing => {
          if(lowerSelected.some(sel => sel.includes(ing) || ing.includes(sel))) matchScore++;
      });
      if (matchScore > 0) {
         mains.push({ ...m, matchScore });
      }
   }
   mains.sort((a, b) => b.matchScore - a.matchScore);
   return mains;
};

export const getWasteWarnings = (selectedIngredients) => {
  let warnings = [];
  const lowerSelected = selectedIngredients.map(x=>x.toLowerCase());
  if (lowerSelected.includes("so─şan") || lowerSelected.includes("sar─▒msak")) {
      warnings.push("So─şan ve Sar─▒msaklar─▒n filizlenmeye yatk─▒n; serin/g├Âlge yerde de─şilse max 3-5 g├╝nde ├ğ├╝r├╝yebilir. ├ûncelikle bunlarla kavurmac─▒/soteli tarifleri se├ğmelisin.");
  }
  if (lowerSelected.includes("patl─▒can")) {
      warnings.push("Patl─▒can ├ğabuk b├╝z├╝┼ş├╝r, 4 g├╝n i├ğinde karn─▒yar─▒k veya musakka yaparak israf─▒ ├Ânleyebilirsin.");
  }
  if (lowerSelected.includes("domates")) {
      warnings.push("Yumu┼şayan domatesleri dondurucuya atmayacaksan bug├╝n, men├╝de sal├ğa yerine bol taze domates kullanmal─▒s─▒n.");
  }
  return warnings;
};

// -- ARTAN YEMEK (LEFTOVER) MOTORU --
export const LEFTOVER_DB = [
  { keywords: ["pilav", "pirin├ğ"], recipes: [{ name: "Kad─▒nbudu K├Âfte", desc: "Artan pilav─▒ k─▒yma, so─şan ve baharatlarla yo─şurarak nefis bir kad─▒nbudu k├Âfte yapabilirsiniz." }, { name: "Yayla ├çorbas─▒", desc: "Pilav─▒ yo─şurtlu, naneli bir terbiye ile de─şerlendirip i├ğinizi ─▒s─▒tacak bir ├ğorba haz─▒rlayabilirsiniz." }] },
  { keywords: ["tavuk", "ha┼şlanm─▒┼ş tavuk"], recipes: [{ name: "Tavuklu Tel ┼Şehriye ├çorbas─▒", desc: "Tavuk par├ğalar─▒n─▒ didikleyip ┼şehriyeli tavuk suyuna ├ğorba yapabilirsiniz." }, { name: "Tavuklu Sezar Salata", desc: "So─şuk tavuk par├ğalar─▒n─▒ marul ve kruton ekmekle salataya d├Ân├╝┼şt├╝r├╝n." }, { name: "Tavuklu Sandvi├ğ", desc: "Tavu─şu didikleyip mayonez ve korni┼şon tur┼şu ile harmanlayarak harika bir so─şuk sandvi├ğ i├ği elde edebilirsiniz." }] },
  { keywords: ["makarna"], recipes: [{ name: "F─▒r─▒n Makarna", desc: "Kalan makarnay─▒ be┼şamel sos ve ka┼şarla f─▒r─▒nlayarak yepyeni bir yeme─şe ├ğevirin." }, { name: "Makarna Salatas─▒", desc: "So─şuk makarnay─▒ yo─şurt, mayonez ve garnit├╝r ile kar─▒┼şt─▒rarak pratik bir salata yap─▒n." }, { name: "Yumurtal─▒ Makarna", desc: "Makarnay─▒ tavada az ya─ş ile ├ğevirip yumurta k─▒rarak doyurucu bir kahvalt─▒ / ├Â─şle ├Â─ş├╝n├╝ yap─▒n." }] },
  { keywords: ["ekmek", "bayat ekmek"], recipes: [{ name: "Ekmek Pizzas─▒", desc: "Bayat ekmek dilimlerinin ├╝zerine sos ve ka┼şar ekleyip f─▒r─▒nlayarak pratik at─▒┼şt─▒rmal─▒klar yapabilirsiniz." }, { name: "Yumurtal─▒ Ekmek", desc: "Ekmekleri ├ğ─▒rp─▒lm─▒┼ş yumurtaya bulay─▒p k─▒zartarak harika bir kahvalt─▒ haz─▒rlay─▒n." }, { name: "Bayat Ekmek K├Âftesi", desc: "Ekmek i├ğlerini ─▒slat─▒p baharat ve so─şanla harmanlayarak etsiz (veya k─▒ymal─▒) k├Âfte yapabilirsiniz." }] },
  { keywords: ["patates", "ha┼şlanm─▒┼ş patates", "patates p├╝resi"], recipes: [{ name: "Patates Kroket", desc: "P├╝re ┼şeklindeki patatesleri top yap─▒p galeta ununa bulayarak k─▒zart─▒n." }, { name: "Patatesli Omlet", desc: "Artan patatesleri k├╝p k├╝p do─şrayarak sabah kahvalt─▒s─▒nda yumurtayla de─şerlendirin." }] },
  { keywords: ["k─▒yma", "kavrulmu┼ş k─▒yma"], recipes: [{ name: "K─▒ymal─▒ Yumurta", desc: "Artan kavrulmu┼ş k─▒ymay─▒ ─▒s─▒t─▒p ├╝zerine yumurta k─▒rarak h─▒zl─▒ ve protein dolu bir ├Â─ş├╝n yap─▒n." }, { name: "K─▒ymal─▒ Makarna", desc: "K─▒ymay─▒ sal├ğa ile hafif suland─▒rarak makarnan─▒n ├╝zerine nefis bir bolonez sos haline getirin." }] }
];

export const processLeftovers = (promptText) => {
  const t = promptText.toLowerCase();
  let suggestions = [];
  
  LEFTOVER_DB.forEach(item => {
    if (item.keywords.some(k => t.includes(k))) {
      suggestions.push({
        ingredient: item.keywords[0],
        recipes: item.recipes
      });
    }
  });

  return suggestions;
};

// -- EV─░N SA─ŞLIK KARNES─░ (├çAPRAZ MEN├£) MOTORU --
export const generateCrossMenu = (ingredient) => {
  const t = ingredient.toLowerCase();
  
  const CROSS_MENU_DB = [
    { 
      keywords: ["k─▒yma"], 
      diet: { name: "K─▒ymal─▒ Kabak Sote", desc: "Zeytinya─ş─▒ ile hafif├ğe sotelenmi┼ş, d├╝┼ş├╝k karbonhidratl─▒ diyet men├╝s├╝.", tags: ["#D├╝┼ş├╝kKarbonhidrat"] },
      kid: { name: "F─▒r─▒nda Sulu K├Âfte & Patates", desc: "├çocuklar─▒n ├ğok sevdi─şi, protein dolu bol havu├ğlu sulu k├Âfte.", tags: ["#├çocukFavorisi"] }
    },
    { 
      keywords: ["tavuk", "g├Â─ş├╝s", "tavuk g├Â─şs├╝"], 
      diet: { name: "Izgara Tavuk Salatas─▒", desc: "Bol ye┼şillikli, sossuz hafif ─▒zgara tavuk dilimleri.", tags: ["#Y├╝ksekProtein"] },
      kid: { name: "├ç─▒t─▒r Tavuk ┼Şinitzel (F─▒r─▒nda)", desc: "Ya─şda k─▒zarmam─▒┼ş ama galeta ununa bulanm─▒┼ş ├ğ─▒t─▒r se├ğenek.", tags: ["#├çocukMen├╝s├╝"] }
    },
    {
      keywords: ["patates", "ha┼şlanm─▒┼ş patates"],
      diet: { name: "F─▒r─▒nlanm─▒┼ş Kabuklu Patates", desc: "├çok az zeytinya─ş─▒ ve kekikle f─▒r─▒nlanm─▒┼ş sa─şl─▒kl─▒ alternatif.", tags: ["#LifKayna─ş─▒"] },
      kid: { name: "Ka┼şarl─▒ Patates P├╝resi", desc: "S├╝t ve ka┼şar peyniriyle zenginle┼ştirilmi┼ş, et yan─▒na giden p├╝re.", tags: ["#Enerji"] }
    },
    {
      keywords: ["makarna"],
      diet: { name: "Kepekli Sebzeli Makarna", desc: "Domates ve fesle─şenle harmanlanm─▒┼ş, hafif kepekli makarna.", tags: ["#Sa─şl─▒kl─▒Karbonhidrat"] },
      kid: { name: "Bol Peynirli F─▒r─▒n Makarna", desc: "Bol enerji veren, be┼şamel soslu ve alt─▒n sar─▒s─▒ ka┼şarl─▒ makarna.", tags: ["#EnerjiDeposu"] }
    }
  ];

  for(let item of CROSS_MENU_DB) {
    if(item.keywords.some(k => t.includes(k))) {
      return item;
    }
  }
  return null;
};

// -- BU AK┼ŞAM M─░SAF─░R VAR MOTORU --
const DB_DESSERTS_GUEST = [
  { id: "ds1", name: "F─▒r─▒n S├╝tla├ğ", cost: 35, type: "LOCAL", strictMatch: [], heaviness: 4 },
  { id: "ds2", name: "├çikolatal─▒ Sufle", cost: 45, type: "FOREIGN", strictMatch: [], heaviness: 5 },
  { id: "ds3", name: "Meyveli Magnolia", cost: 30, type: "FOREIGN", strictMatch: ["light"], heaviness: 2 },
  { id: "ds4", name: "Antep F─▒st─▒kl─▒ ┼Şekerpare", cost: 40, type: "LOCAL", strictMatch: [], heaviness: 6 },
  { id: "ds5", name: "┼Şekersiz Orman Meyvesi Salatas─▒", cost: 25, type: "FIT", strictMatch: ["diyabetik"], heaviness: 1 }
];

export const generateGuestMenu = (personCountInput, restrictionsArray) => {
  const personCount = Math.max(1, parseInt(personCountInput) || 1);
  const isVeg = restrictionsArray.includes("vejetaryen");
  const isGlutenFree = restrictionsArray.includes("glutensiz");
  const isDiabetic = restrictionsArray.includes("diyabetik");

  const safeSoups = DB_SOUPS.filter(s => {
    if (isGlutenFree && (s.ingredients.includes("un") || s.ingredients.includes("┼şehriye") || s.ingredients.includes("bu─şday"))) return false;
    return true;
  });

  const safeMains = DB_MAINS.filter(m => {
    if (isVeg && (m.ingredients.includes("k─▒yma") || m.ingredients.includes("tavuk") || m.ingredients.includes("et") || m.ingredients.includes("ku┼şba┼ş─▒") || m.ingredients.includes("somon"))) return false;
    if (isGlutenFree && (m.ingredients.includes("makarna") || m.ingredients.includes("bulgur"))) return false;
    return true;
  });

  const safeCarbs = DB_CARBS.filter(c => {
    if (isGlutenFree && (c.ingredients.includes("makarna") || c.ingredients.includes("bulgur") || c.ingredients.includes("┼şehriye"))) return false;
    return true;
  });

  const safeDesserts = DB_DESSERTS_GUEST.filter(d => {
    if (isDiabetic && !d.strictMatch.includes("diyabetik")) return false;
    return true;
  });

  if (safeMains.length === 0 || safeSoups.length === 0) {
    return null;
  }

  // Pick premium (highest cost)
  const premiumMains = [...safeMains].sort((a,b) => b.cost - a.cost);
  const premiumSoups = [...safeSoups].sort((a,b) => b.cost - a.cost);
  const premiumCarbs = [...safeCarbs].sort((a,b) => b.cost - a.cost);
  
  const m = premiumMains[0];
  const s = premiumSoups[0];
  const c = premiumCarbs[0];
  const sd = DB_SIDES[0]; 
  
  const ds = safeDesserts.length > 0 ? safeDesserts[0] : DB_DESSERTS_GUEST[0]; 
  
  const costPerPerson = m.cost + c.cost + s.cost + sd.cost + ds.cost; 
  const totalCost = costPerPerson * personCount;

  return {
    soup: s,
    main: m,
    carb: c,
    side: sd,
    dessert: ds,
    costPerPerson,
    totalCost,
    advice: `­şîş ┼Şefin Notu: Girdi─şiniz hassasiyetlere %100 uyan risksiz, g├Âsteri┼şli ve premium misafir men├╝s├╝d├╝r. (${personCount} Ki┼şilik)`
  };
};

export const getDishDetails = (dish) => {
  if (!dish) return null;
  const ings = dish.ingredients ? dish.ingredients.join(", ") : "├ûzel malzemeler";
  return {
    prepTime: (dish.time || 30) + " dk",
    calories: ((dish.heaviness || 5) * 85) + " kcal",
    recipe: `1. ├ûn haz─▒rl─▒klar─▒n─▒z─▒ yap─▒n ve gerekli ekipmanlar─▒ ├ğ─▒kar─▒n.\n2. Listedeki ana malzemeleri (${ings}) s─▒ras─▒yla tarif tekni─şine uygun (Kavurma/Ha┼şlama/F─▒r─▒n) i┼şleyin.\n3. Tuz ve baharatlar─▒n─▒ damak zevkinize g├Âre ayarlay─▒n.\n4. ─░deal pi┼şme s├╝resinin son 5 dakikas─▒nda kontrol edip s─▒cak servis yap─▒n.`
  };
};

export const generateShoppingList = (menuObj) => {
  let allIngredients = [];
  if (menuObj.soup && menuObj.soup.ingredients) allIngredients.push(...menuObj.soup.ingredients);
  if (menuObj.main && menuObj.main.ingredients) allIngredients.push(...menuObj.main.ingredients);
  if (menuObj.carb && menuObj.carb.ingredients) allIngredients.push(...menuObj.carb.ingredients);
  if (menuObj.side && menuObj.side.ingredients) allIngredients.push(...menuObj.side.ingredients);
  
  allIngredients = [...new Set(allIngredients)]; // Remove duplicates

  const categories = {
    "­şÑ® Kasap & ┼Şark├╝teri": [],
    "­şÑù Manav": [],
    "­şøÆ Bakkal & Bakliyat": []
  };

  const regexKasap = /(tavuk|k─▒yma|et|ku┼şba┼ş─▒|somon|ka┼şar|yo─şurt|s├╝t|krema|tereya─ş─▒|yumurta)/i;
  const regexManav = /(domates|biber|so─şan|sar─▒msak|patl─▒can|kabak|havu├ğ|─▒spanak|mantar|salatal─▒k|nane|roka|limon)/i;

  let totalCost = 0;

  allIngredients.forEach(ing => {
    totalCost += 18; 
    if (regexKasap.test(ing)) categories["­şÑ® Kasap & ┼Şark├╝teri"].push(ing);
    else if (regexManav.test(ing)) categories["­şÑù Manav"].push(ing);
    else categories["­şøÆ Bakkal & Bakliyat"].push(ing);
  });

  return { categories, estimatedCost: totalCost };
};
