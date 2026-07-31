// Baki'nin Mutfağı - Gastronomi Zeka Motoru (AI Engine)
// Bu motor on binlerce menü kombinasyonunu gerçekçi bir şekilde üretir.

export const BUDGET_TYPES = [
  { id: 'STUDENT', min: 0, max: 600, label: "👨‍🎓 Öğrenci (0-600 TL)", desc: "Doyurucu & Ekonomik" },
  { id: 'FAMILY', min: 600, max: 1500, label: "👨‍👩‍👧‍👦 Aile (600-1500 TL)", desc: "Dengeli Ev Yemeği" },
  { id: 'GUEST', min: 1500, max: 9999, label: "🍽️ Misafir (+1500 TL)", desc: "Şık Sunum & Ara Sıcaklar" }
];

export const CUISINE_TYPES = [
  { id: 'LOCAL', label: "🇹🇷 Yerli (Geleneksel)" },
  { id: 'FOREIGN', label: "🌍 Yabancı (Dünya Mutfağı)" },
  { id: 'ALL', label: "Farketmez" }
];

export const MENU_THEMES = [
  { id: 'SUMMER', label: "☀️ Yaz Menüsü" },
  { id: 'WINTER', label: "❄️ Kış Menüsü" },
  { id: 'RAMADAN', label: "🌙 Ramazan Menüsü" },
  { id: 'FIT', label: "💪 Fit / Sporcu" }
];

import { CATEGORIZED_INGREDIENTS } from './engineIngredients';
export { CATEGORIZED_INGREDIENTS } from './engineIngredients';
export const INGREDIENT_KEYWORDS = Object.values(CATEGORIZED_INGREDIENTS).flat().map(i => i.toLowerCase());
import { DB_MAINS_HUGE } from './hugeRecipes';

// Gerçekçi Database (1 Kişilik Fiyatlardır)
const DB_SOUPS = [
  { id: "s1", name: "Süzme Mercimek Çorbası", type: "LOCAL", theme: ["WINTER", "RAMADAN"], cost: 25, time: 30, heaviness: 2, ingredients: ["mercimek", "soğan", "tereyağı", "salça"] },
  { id: "s2", name: "Kremalı Mantar Çorbası", type: "FOREIGN", theme: ["WINTER"], cost: 45, time: 25, heaviness: 4, ingredients: ["mantar", "krema", "tereyağı", "un", "süt"] },
  { id: "s3", name: "Yayla Çorbası", type: "LOCAL", theme: ["SUMMER", "FIT"], cost: 20, time: 20, heaviness: 2, ingredients: ["yoğurt", "pirinç", "nane", "yumurta"] },
  { id: "s4", name: "Soğuk Aşı Çorbası", type: "LOCAL", theme: ["SUMMER", "FIT"], cost: 20, time: 10, heaviness: 1, ingredients: ["yoğurt", "nane", "nohut", "buğday"] },
  { id: "s5", name: "Minestrone (İtalyan Sebze)", type: "FOREIGN", theme: ["WINTER", "FIT"], cost: 40, time: 35, heaviness: 2, ingredients: ["kabak", "havuç", "domates", "fasulye", "makarna"] },
  { id: "s6", name: "Ezogelin Çorbası", type: "LOCAL", theme: ["WINTER", "RAMADAN"], cost: 25, time: 35, heaviness: 3, ingredients: ["mercimek", "bulgur", "salça", "nane"] }
];

const DB_MAINS = [
  { id: "m1", name: "Karnıyarık", type: "LOCAL", theme: ["SUMMER", "RAMADAN"], cost: 120, time: 60, heaviness: 6, ingredients: ["patlıcan", "kıyma", "soğan", "domates", "biber"] },
  { id: "m2", name: "Fırında Kaşarlı Köfte", type: "LOCAL", theme: ["WINTER"], cost: 150, time: 45, heaviness: 7, ingredients: ["kıyma", "kaşar", "soğan", "domates"] },
  { id: "m3", name: "Tavuk Sote", type: "LOCAL", theme: ["WINTER", "FIT"], cost: 85, time: 30, heaviness: 4, ingredients: ["tavuk", "biber", "domates", "soğan"] },
  { id: "m4", name: "Fettuccine Alfredo", type: "FOREIGN", theme: ["WINTER"], cost: 140, time: 25, heaviness: 8, ingredients: ["makarna", "tavuk", "krema", "mantar"] },
  { id: "m5", name: "Beef Stroganoff", type: "FOREIGN", theme: ["WINTER"], cost: 250, time: 40, heaviness: 8, ingredients: ["et", "mantar", "krema", "soğan"] },
  { id: "m6", name: "Zeytinyağlı Taze Fasulye", type: "LOCAL", theme: ["SUMMER", "FIT"], cost: 50, time: 45, heaviness: 2, ingredients: ["fasulye", "domates", "zeytinyağı", "soğan"] },
  { id: "m7", name: "Etli Nohut", type: "LOCAL", theme: ["WINTER"], cost: 130, time: 90, heaviness: 6, ingredients: ["nohut", "kuşbaşı", "salça", "soğan"] },
  { id: "m8", name: "Fırın Somon", type: "FOREIGN", theme: ["FIT", "SUMMER"], cost: 220, time: 30, heaviness: 3, ingredients: ["somon", "zeytinyağı", "limon", "sarımsak"] },
  { id: "m9", name: "Patlıcan Musakka", type: "LOCAL", theme: ["SUMMER"], cost: 110, time: 55, heaviness: 7, ingredients: ["patlıcan", "kıyma", "salça", "soğan"] }
];

const DB_CARBS = [
  { id: "c1", name: "Tereyağlı Şehriyeli Pilav", type: "LOCAL", cost: 30, time: 25, heaviness: 5, ingredients: ["pirinç", "tereyağı", "şehriye"] },
  { id: "c2", name: "Meyhaneli Bulgur Pilavı", type: "LOCAL", cost: 25, time: 30, heaviness: 4, ingredients: ["bulgur", "domates", "biber", "soğan", "zeytinyağı"] },
  { id: "c3", name: "Fırınlanmış Baharatlı Patates", type: "FOREIGN", cost: 25, time: 40, heaviness: 3, ingredients: ["patates", "zeytinyağı", "kekik", "sarımsak"] },
  { id: "c4", name: "Sebzeli Kinoa", type: "FOREIGN", cost: 60, time: 20, heaviness: 2, ingredients: ["kinoa", "havuç", "kabak", "zeytinyağı"] },
  { id: "c5", name: "Penne Arabiata", type: "FOREIGN", cost: 45, time: 20, heaviness: 5, ingredients: ["makarna", "domates", "sarımsak", "acı biber"] }
];

const DB_SIDES = [
  { id: "sd1", name: "Çoban Salata", type: "LOCAL", cost: 35, time: 10, heaviness: 1, ingredients: ["domates", "salatalık", "soğan", "biber", "zeytinyağı"] },
  { id: "sd2", name: "Naneli Cacık", type: "LOCAL", cost: 25, time: 5, heaviness: 1, ingredients: ["yoğurt", "salatalık", "nane", "sarımsak"] },
  { id: "sd3", name: "Humus", type: "LOCAL", cost: 40, time: 15, heaviness: 4, ingredients: ["nohut", "tahin", "kimyon", "sarımsak", "zeytinyağı"] },
  { id: "sd4", name: "Roka Parmesan Salata", type: "FOREIGN", cost: 60, time: 5, heaviness: 2, ingredients: ["roka", "parmesan", "zeytinyağı", "balzamik"] },
  { id: "sd5", name: "Gavurdağı Salatası", type: "LOCAL", cost: 50, time: 15, heaviness: 2, ingredients: ["domates", "ceviz", "nar ekşisi", "soğan"] }
];

// DURUMSAL SÖYLEMLER (Yapay Zeka Gastronomi Asistanı)
const getSituationAdvice = (totalHeaviness, totalCostPerPerson, mainItem, theme) => {
  if (theme === 'FIT' || totalHeaviness <= 10) {
    return `💡 AI Notu: Hafif ve sindirimi kolay. Spordan önce/sonra rahatlıkla tüketebilirsin. ${mainItem.name} sayesinde dengeli kaloridesin.`;
  }
  if (totalHeaviness > 17) {
    return `⚠️ AI Notu: Çok doyurucu, yoğun bir menü. Spordan hemen önce tavsiye edilmez, idman sonrasına saklayın. Uyumadan en az 3 saat önce yemeye özen göster.`;
  }
  if (totalCostPerPerson > 200) {
    return `✨ AI Notu: Zengin ve premium misafir konsepti. ${mainItem.name} ihtişamıyla masayı donatırken seçilen ferah başlangıçlar denge kuracaktır.`;
  }
  return `💡 AI Notu: Anne eli değmişçesine uyumlu, günlük dengeleyici menü. Karbonhidratlar ve çorba kusursuz bir gastronomi bağı kurar.`;
};

// -- AI CHATBOT LOGIC --
const NON_FOOD_KEYWORDS = ["futbol", "spor", "siyaset", "din", "araba", "film", "dizi", "teknoloji", "maç", "takım", "para", "savaş", "ekonomi"];
export const processChatPrompt = (text) => {
  const t = text.toLowerCase().trim();
  
  if (NON_FOOD_KEYWORDS.some(k => t.includes(k))) {
    return `Üzgünüm, ben Baki'nin Mutfağı'na özel bir aşçı robotu Demet Şef'im. Lütfen yalnızca yemek, tarif veya menüler hakkında soru sorunuz. 👨‍🍳`;
  }
  
  if (t === "merhaba" || t.includes("selam") || t.includes("naber") || t === "hey" || t.includes("günaydın")) {
    return `Merhaba! Ben Demet Şef. 👩‍🍳 Mutfakla ilgili her şeyde sana yardımcı olabilirim. Bana elindeki malzemeleri söyleyebilir ("evde tavuk ve patates var"), belirli bir tarif sorabilir ("Karnıyarık nasıl yapılır?") ya da sadece ne pişireceğine karar vermemi isteyebilirsin ("akşama ne yapsam?"). Seni dinliyorum!`;
  }
  
  if (t.includes("bütçe") || t.includes("param") || t.includes("ucuz") || t.includes("fakir")) {
    return `Bütçene tam uyan seçenekler arıyorsan ana menüdeki 'Haftalık Zeki Program' modülü tam sana göre! Oradan bütçe sınırını (Örn: 200 TL) seç, sana hafta boyunca yiyebileceğin en kral menüleri dizeyim.`;
  }

  if (t.includes("zaman") || t.includes("hızlı") || t.includes("acele") || t.includes("kolay") || t.includes("çabuk") || t.includes("vaktim yok") || t.includes("pratik")) {
    return `Eğer vaktin darsa, 'Dolabımdakiler' kısmından Maksimum Süre limitini '30 dk' seçerek şipşak pişen yemekleri süzebilirsin. Ya da pratik tarifler listemden "Tavuk Sote" ve "Fettuccine Alfredo" gibi klasikleri hemen deneyebilirsin!`;
  }

  if (t.includes("çark") || t.includes("ne yesem") || t.includes("kararsız") || t.includes("ne pişirsem") || t.includes("akşama ne") || t.includes("bugün ne") || t.includes("canım ne istiyor")) {
    const randomMain = DB_MAINS_HUGE ? DB_MAINS_HUGE[Math.floor(Math.random() * DB_MAINS_HUGE.length)].name : "Harika bir Fırın Somon";
    return `Kararsız kaldıysan 'Şans Çarkı' modülü seni büyük bir dertten kurtarır! Tüm filtrelerini seçip topu şansa bırakabilirsin. Ya da şahsi tavsiyemi istersen, bugün bence kesinlikle nefis bir ${randomMain} yapmalısın. Tarifini istersen bana doğrudan adını yaz!`;
  }

  if (t.includes("fiyat") || t.includes("pazar listesi") || t.includes("alışveriş") || t.includes("eksik")) {
    return `Herhangi bir tarifin içindeyken "Pazar Listesini Çıkar" butonuna basarsan bakkal/market hesabını senin için kuruşu kuruşuna çıkarırım.`;
  }
  
  if (t.includes("teşekkür") || t.includes("sağol") || t.includes("süper") || t.includes("harika") || t.includes("eline sağlık")) {
    return `Afiyet bal şeker olsun! Sizin için her zaman buradayım, mutfakla ilgili başka bir sorunuz olursa çekinmeden sorun. Ne isterseniz emrinize amade! 💖`;
  }
  
  if (t.includes("diyet") || t.includes("kalori") || t.includes("zayıf") || t.includes("kilo") || t.includes("spor")) {
    return `Kilo kontrolü veya sağlıklı beslenme mi? Harika! Ana ekrandaki 'Evin Sağlık Karnesi' modülüne sadece tek bir malzeme (Örn: tavuk) yazarak onun hem diyet (zayıflatan) hem de doyurucu iki farklı versiyonunu eş zamanlı görebilirsin.`;
  }
  
  // 1. Doğrudan Tarif İsteklerini Çok Daha Akıllı Yakalama (Genişletilmiş Regex)
  const recipeMatch = t.match(/([a-zA-ZğüşıöçĞÜŞİÖÇ\s]+)(?:nasıl yapılır|tarifi|nasıl yap|anlat|verir misin|yapılışı|nasıldır)/i) || 
                      (t.includes("yap") && t.split(" ").length <= 4 ? [null, t.replace(/(yap|nasıl|bana|bir)/g, "").trim()] : null);
                      
  if (recipeMatch || t.includes("tarif")) {
    const rawDishName = (recipeMatch && recipeMatch[1]) ? recipeMatch[1].trim() : t.replace(/(nasıl yapılır|tarifi|nasılır|anlat|verir misin|yapılışı|\?|bana|bir)/gi, '').trim();
    
    if (rawDishName.length > 2) {
      // Veritabanında tam eşleşme ara
      const matchedDish = DB_MAINS_HUGE.find(m => rawDishName.includes(m.name.toLowerCase()) || m.name.toLowerCase().includes(rawDishName));
      
      if(matchedDish) {
         const details = getDishDetails(matchedDish);
         return `Hemen! İşte ustasından garantili ${matchedDish.name} tarifi:\n\n${details.recipe}`;
      } else {
         // YZ ÜRETKEN MODEL (Dinamik Tarif Simülasyonu)
         // Rastgele baharatlar ve dinamik format
         const dishUpper = rawDishName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
         const randomSpices = ["karabiber", "kimyon", "tuz", "pul biber", "kekik", "nane", "sumak", "biberiye"];
         const s1 = randomSpices[Math.floor(Math.random() * randomSpices.length)];
         const s2 = randomSpices[Math.floor(Math.random() * randomSpices.length)];
         
         const isDessert = t.includes("tatlı") || t.includes("pasta") || t.includes("kek");
         
         if (isDessert) {
            return `Ooo harika bir seçim! ${dishUpper} yapmak için püf noktalar şunlar: 👨‍🍳\n\n1. Her şeyden önce yumurta ve şeker ikilisini köpük köpük olup rengi açılana kadar (en az 5 dakika) mikserle çırpın.\n2. Ardından sığ sıvıları (süt, yağ) ekleyin ve hafifçe sıvı harcı karıştırın.\n3. Un, kabartma tozu ve vanilyayı "eleyerek" sıvı harcın üzerine eklemek en büyük sırdır! Spatulayla alttan üste söndürmeden yedirin.\n4. Önceden ısıtılmış 180 derece fırında ilk 20 dakika kapağı ASLA açmadan pişirin.\n\nEğer daha özel, kalori ve malzeme bazlı hesaplanmış bir ana listeye dönmek istersen 'Dolabımdakiler' modülünü kullanabilirsin!`;
         } else {
            return `Efsane bir ${dishUpper} yapmak için adım adım rehberin burada! 👨‍🍳\n\n1. Öncelikle biraz zeytinyağı veya tereyağında soğan ve sarımsak ikilisini güzelce soteleyerek işe başla (Lezzetin temeli budur).\n2. Ardından ${dishUpper.toLowerCase()} için tüm ana malzemelerini tencereye ekleyip sularını çekene kadar, aromalar birbirine geçene dek kavur.\n3. Renk ve derinlik için bir yemek kaşığı salçayı orta ateşte kokusu çıkana kadar tencere tabanında çevir.\n4. İşin sırrı baharatlarda gizli: Doğru oranda ${s1} ve ${s2} eklemeyi sakın unutma.\n5. Tencerenin kapağını kapatıp, kısık ateşte yemeği yavaşça kendi demlenmesine bırakarak tam kıvamını bulmasını sağla. Afiyet olsun!`;
         }
      }
    }
  }

  // 2. Malzeme Beyanı ve NLP (Evde şu var ne yapayım?)
  const ings = INGREDIENT_KEYWORDS.filter(k => t.includes(k));
  
  if (ings.length > 0) {
    if (typeof window.globalLastIngs !== 'undefined' && JSON.stringify(window.globalLastIngs) !== JSON.stringify(ings)) {
       window.globalShownDishes = [];
    }
    window.globalLastIngs = ings; 
    
    let matches = DB_MAINS_HUGE.filter(m => 
       ings.some(ing => m.ingredients.some(mi => mi.toLowerCase().includes(ing)))
    );
    // Strict Matcher (Hepsini içerenleri üste al)
    const strictMatches = matches.filter(m => ings.every(ing => m.ingredients.some(mi => mi.toLowerCase().includes(ing))));
    if (strictMatches.length > 0) matches = strictMatches;
    
    const isAskingMore = t.includes("başka") || t.includes("daha") || t.includes("peki") || t.includes("alternatif") || t.includes("diğer");

    if (isAskingMore && window.globalShownDishes && window.globalShownDishes.length > 0) {
        matches = matches.filter(m => !window.globalShownDishes.includes(m.id));
    }

    if(matches.length > 0) {
       const shuffled = [...matches].sort(() => 0.5 - Math.random());
       const selected = shuffled.slice(0, 3);
       const topMatches = selected.map(m => `🍲 ${m.name}`).join("\n");
       
       if(!window.globalShownDishes) window.globalShownDishes = [];
       window.globalShownDishes.push(...selected.map(m => m.id));
       
       const joinedIngs = ings.join(", ");
       
       if (isAskingMore) {
           return `Tabii ki şefim! ${joinedIngs} kullanarak yapabileceğin sıradışı yepyeni fikirler şunlar:\n\n${topMatches}\n\nBunlardan birine gözün çarptıysa adını yaz, detaylarını dökeyim!`;
       }
       return `Harika! Elindeki "${joinedIngs}" ile mutfakta harikalar yaratabiliriz. Senin için yapay zeka hafızamdan çektiğim en uyumlu 3 tarif şunlar:\n\n${topMatches}\n\nBu yemeklerden ilgini çekenin tarifini (Örn: "${selected[0].name} nasıl yapılır?") diye sorabilirsin. İstersen "Başka ne var?" diyerek önerileri de değiştirebilirim!`;
    } else {
       if (isAskingMore) {
           return `Elimdeki "${ings.join(", ")}" içeren tüm şaheserleri sana saydım şefim! Bunlar dışında repertuarım şimdilik tükendi. Yanına başka bir malzeme eşleştirsek? (Örn: patates veya kaşar ekleyerek sorarsan yeni tarifler bulabilirim).`;
       } else {
           return `Hımm, itiraf etmeliyim ki saf olarak sadece "${ings.join(", ")}" içeren hazır bir tarif bulamadım. Ancak bunları tavada biraz zeytinyağı ve baharatla soteleyip enfes bir hızlı lezzet yaratabilirsin! Veya yanına bir malzeme daha söyle?`;
       }
    }
  }

  // 3. Devam Eden Konteksti Yakalama (Sadece 'başka ne yapılır' deyince)
  if (t.includes("başka") || t.includes("peki") || t.includes("daha") || t.includes("alternatif")) {
     if (typeof window.globalLastIngs !== 'undefined' && window.globalLastIngs.length > 0) {
         return processChatPrompt(window.globalLastIngs.join(" ") + " başka");
     } else if (typeof window.globalShownDishes !== 'undefined' && window.globalShownDishes.length > 0) {
         return `Tam olarak hangi malzemenin alternatifini aradığını anlayamadım. (Örn: 'Kabak ile başka neler yapılır?' dersen harika olur)`;
     }
  }

  if (t === "tamam" || t === "peki" || t === "anladım" || t === "olur" || t.includes("görüşürüz")) {
      return "Süper! Mutfakta işler karışırsa veya yepyeni fikirler ararsan ben hep buradayım. Önlüğünü tak ve sihire başla! 🚀";
  }

  // Akıllı Fallback
  return `Tam olarak ne demek istediğini anlayamadım şefim. Zekamı sınırlarına kadar zorlamam için bana elindeki malzemeleri ver (Örn: 'dolapta tavuk ve krema var'), veya doğrudan aklındaki bir yemeğin tarifini sor. Unutma, ben Baki'nin Mutfağı'ndaki kişisel gurmenim!`;
};

// -- BÜTÇEYE GÖRE KESİN 3 ALTERNATİF MENÜ --
export const generateExactBudgetMenus = (personsCount, totalBudgetTL) => {
  // Tam gerçekçi yaklaşım. Kişi başı harcanabilecek max bütçe:
  const perPersonLimit = totalBudgetTL / personsCount;
  
  let validMenus = [];
  
  // Tüm Kombinasyonlar taranıyor
  for (let m of DB_MAINS) {
    for (let c of DB_CARBS) {
      for (let s of DB_SOUPS) {
        for (let sd of DB_SIDES) {
          
          let dCostM = 0; m.ingredients.forEach(i => dCostM += getTrueCost(i));
          let dCostC = 0; c.ingredients.forEach(i => dCostC += getTrueCost(i));
          let dCostS = 0; s.ingredients.forEach(i => dCostS += getTrueCost(i));
          let dCostSd = 0; sd.ingredients.forEach(i => dCostSd += getTrueCost(i));
          let costPerPerson = dCostM + dCostC + dCostS + dCostSd;
          
          // Eğer tek bir kişinin bütçesinin altındaysak, geçerli.
          // Besleyicilik = Heaviness (bu durumda doyuruculuk, ne kadar fazlaysa o kadar kalori/protein).
          if (costPerPerson <= perPersonLimit) {
            let totalTime = Math.max(m.time, c.time) + Math.min(s.time, sd.time);
            let totalHeaviness = m.heaviness + c.heaviness + s.heaviness + sd.heaviness;
            
            // "Kalan Para"
            let totalMenuCostForEveryone = costPerPerson * personsCount;
            let efficiency = costPerPerson / perPersonLimit; // 1'e ne kadar yakınsa o kadar tam kullanılmış bütçe
            
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

  // 1) En "Besleyici ve Tam Bütçe (Bütçeyi en verimli kullanan)"
  // 2) En Hafif / Sindirimi kolay alternatif
  // 3) En Ekonomik (Artan Parası en çok olan alternatif)
  
  if (validMenus.length === 0) return [];

  // Sort by highest cost first (closest to budget)
  validMenus.sort((a,b) => b.costPerPerson - a.costPerPerson);
  const bestFit = validMenus[0]; // Maximum bütçe kullanan dolu menü
  bestFit.label = "🌟 Lüks & Doyurucu (Bütçeye En Yakın)";

  let remaining = validMenus.filter(m => m !== bestFit);
  
  remaining.sort((a,b) => a.heaviness - b.heaviness); 
  const lightest = remaining.length > 0 ? remaining[0] : null; // En hafif (Salata/çorba ağırlıklı)
  if(lightest) lightest.label = "🥗 Sindirimi Kolay (Hafif)";

  remaining = remaining.filter(m => m !== lightest);
  
  remaining.sort((a,b) => a.costPerPerson - b.costPerPerson);
  const economic = remaining.length > 0 ? remaining[0] : null; // En çok para arttıran
  if(economic) economic.label = "💰 Maksimum Ekonomik (Cebinizde kalır)";

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
          
          let dCostM = 0; m.ingredients.forEach(i => dCostM += getTrueCost(i));
          let dCostC = 0; c.ingredients.forEach(i => dCostC += getTrueCost(i));
          let dCostS = 0; s.ingredients.forEach(i => dCostS += getTrueCost(i));
          let dCostSd = 0; sd.ingredients.forEach(i => dCostSd += getTrueCost(i));
          let totalCost = dCostM + dCostC + dCostS + dCostSd;
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

export const generateFridgeMains = (selectedIngredients, filter = 'ALL', maxTime = 999, maxCost = 9999) => {
   let mains = [];
   const lowerSelected = selectedIngredients.map(x=>x.toLowerCase());
   for (let m of DB_MAINS_HUGE) {
      if (m.time > maxTime) continue;
      if (m.cost > maxCost) continue;

      if (filter !== 'ALL') {
          const s = m.name;
          const T = /(kebap|köfte|karnıyarık|pide|türlü|tas kebabı)/i;
          const A = /(noodle|sushi|tatlı ekşi|wok|teriyaki)/i;
          const M = /(taco|fajita|quesadilla|jalapeno|enchilada)/i;
          const I = /(pizza|makarna|risotto|lazanya|pesto)/i;
          const F = /(krep|ratatuy|soğan çorbası|graten|cordon bleu)/i;
          const ME = /(falafel|humus|şavurma|maklube)/i;
          
          let pass = false;
          if(filter==='TURKISH' && (T.test(s) || m.ingredients.includes('kıyma'))) pass = true;
          else if(filter==='ASIAN' && (A.test(s) || m.ingredients.includes('soya sosu'))) pass = true;
          else if(filter==='MEXICAN' && (M.test(s) || m.ingredients.includes('mısır'))) pass = true;
          else if(filter==='ITALIAN' && (I.test(s) || m.ingredients.includes('fesleğen'))) pass = true;
          else if(filter==='FRENCH' && (F.test(s) || m.ingredients.includes('krema'))) pass = true;
          else if(filter==='MIDDLE_EASTERN' && (ME.test(s) || m.ingredients.includes('nohut'))) pass = true;
          
          if(!pass) continue;
      }

      let matchScore = 0;
      let matchedIngs = [];
      let missingIngs = [];
      m.ingredients.forEach(ing => {
          if(lowerSelected.some(sel => sel.includes(ing) || ing.includes(sel))) {
              matchScore++;
              matchedIngs.push(ing);
          } else {
              missingIngs.push(ing);
          }
      });
      if (matchScore > 0) {
         const details = getDishDetails(m);
         mains.push({ ...m, matchScore, matchedIngs, missingIngs, calories: details.calories, macros: details.macros, prepTime: details.prepTime, totalCost: details.totalCost, recipe: details.recipe });
      }
   }
   mains.sort((a, b) => b.matchScore - a.matchScore);
   return mains;
};

export const getWasteWarnings = (selectedIngredients) => {
  let warnings = [];
  const lowerSelected = selectedIngredients.map(x=>x.toLowerCase());
  if (lowerSelected.includes("soğan") || lowerSelected.includes("sarımsak")) {
      warnings.push("Soğan ve Sarımsakların filizlenmeye yatkın; serin/gölge yerde değilse max 3-5 günde çürüyebilir. Öncelikle bunlarla kavurmacı/soteli tarifleri seçmelisin.");
  }
  if (lowerSelected.includes("patlıcan")) {
      warnings.push("Patlıcan çabuk büzüşür, 4 gün içinde karnıyarık veya musakka yaparak israfı önleyebilirsin.");
  }
  if (lowerSelected.includes("domates")) {
      warnings.push("Yumuşayan domatesleri dondurucuya atmayacaksan bugün, menüde salça yerine bol taze domates kullanmalısın.");
  }
  return warnings;
};

// -- ARTAN YEMEK (LEFTOVER) MOTORU --
export const LEFTOVER_DB = [
  { keywords: ["tavuk", "haşlanmış tavuk", "baget"], recipes: [{ name: "Tavuklu Tel Şehriye Çorbası", desc: "Tavuk parçalarını didikleyip şehriyeli tavuk suyuna çorba yapabilirsiniz." }, { name: "Tavuklu Sezar Salata", desc: "Soğuk tavuk parçalarını marul ve kruton ekmekle salataya dönüştürün." }, { name: "Tavuklu Sandviç / Dürüm", desc: "Tavuğu didikleyip mayonez ve kornişon turşu ile harmanlayarak harika bir soğuk sandviç içi elde edebilirsiniz." }, { name: "Tavuklu Fırın Graten", desc: "Didiklenmiş tavuğu sebzelerle fırına verip beşamel sos ve kaşarla graten yapın." }, { name: "Tavuk Sote", desc: "Kalan tavuğu soğan ve biberle soteleyerek canlandırın." }] },
  { keywords: ["makarna"], recipes: [{ name: "Fırın Makarna", desc: "Kalan makarnayı beşamel sos ve kaşarla fırınlayarak yepyeni bir yemeğe çevirin." }, { name: "Makarna Salatası", desc: "Soğuk makarnayı yoğurt, mayonez ve garnitür ile karıştırarak pratik bir salata yapın." }, { name: "Yumurtalı Makarna", desc: "Makarnayı tavada az yağ ile çevirip yumurta kırarak doyurucu bir kahvaltı / öğle öğünü yapın." }, { name: "Sosyete Mantısı (Makarnadan)", desc: "Kalan sade makarnayı sarımsaklı yoğurt ve salçalı sosla mantı gibi servis edin." }, { name: "Kavrulmuş Makarna", desc: "Makarnayı salçayla kavurarak ısıtıp yepyeni bir aroma katın." }] },
  { keywords: ["ekmek", "bayat ekmek", "pide"], recipes: [{ name: "Ekmek Pizzası", desc: "Bayat ekmek dilimlerinin üzerine sos ve kaşar ekleyip fırınlayarak pratik atıştırmalıklar yapabilirsiniz." }, { name: "Yumurtalı Ekmek", desc: "Ekmekleri çırpılmış yumurtaya bulayıp kızartarak harika bir kahvaltı hazırlayın." }, { name: "Bayat Ekmek Köftesi", desc: "Ekmek içlerini ıslatıp baharat ve soğanla harmanlayarak etsiz (veya kıymalı) köfte yapabilirsiniz." }, { name: "Papara", desc: "Bayat ekmekleri doğrayın ve üzerine et suyu döküp yoğurtla servis edin." }, { name: "Fırın Kruton", desc: "Çorbaların üstü için ekmekleri zeytinyağı ve baharat ile küp küp fırınlayıp çıtırlaştırın." }] },
  { keywords: ["patates", "haşlanmış patates", "patates püresi", "kızartma"], recipes: [{ name: "Patates Kroket", desc: "Püre şeklindeki (veya ezilmiş) patatesleri top yapıp galeta ununa bulayarak kızartın." }, { name: "Patatesli Omlet / Frittata", desc: "Artan patatesleri küp küp doğrayarak sabah kahvaltısında bol yumurtayla tavada değerlendirin." }, { name: "Patates Kavurması", desc: "Soğanları kavurup kalan patatesi salçayla çevirin, ev yemeğine dönsün." }, { name: "Yoğurtlu Patates Salatası", desc: "Ezilmiş patatesi süzme yoğurt ve nane ile birleştirip muhteşem bir meze yapın." }] },
  { keywords: ["kıyma", "kavrulmuş kıyma", "köfte"], recipes: [{ name: "Kıymalı Yumurta", desc: "Artan kavrulmuş kıymayı ısıtıp üzerine yumurta kırarak hızlı ve protein dolu bir öğün yapın." }, { name: "Kıymalı Makarna (Bolonez)", desc: "Kıymayı salça ile hafif sulandırarak makarnanın üzerine nefis bir bolonez sos haline getirin." }, { name: "Kıymalı Tost / Dürüm", desc: "Kıymayı ekmek veya lavaş arasına koyup kaşarla tost makinesinde basın." }, { name: "Ali Nazik (Hızlı Versiyon)", desc: "Hazır köz patlıcan veya püreniz varsa kıymayı üstüne çekerek anında ali nazik yapın." }] },
  { keywords: ["pilav", "pirinç", "pirinç pilavı"], recipes: [{ name: "Kadınbudu Köfte", desc: "Artan pilavı kıyma ile yoğurarak yumurtaya bulayıp kızartarak harika bir köfte yapabilirsiniz." }, { name: "Pirinç Çorbası (Yayla)", desc: "Kalan pilavı yoğurt, nane ve sıcak suyla karıştırarak hızlı bir yayla çorbası hazırlayabilirsiniz." }, { name: "Sütlaç", desc: "Şekersiz pişmiş sade pirinç pilavınız kaldıysa, süt ve şekerle kaynatarak çok hızlı bir sütlaç yapabilirsiniz." }, { name: "Tavuklu Çakma Risotto", desc: "Kalan pirinci tavuk suyu ile biraz daha açarak kremamsı bir pilava dönüştürün." }] },
  { keywords: ["bulgur", "bulgur pilavı"], recipes: [{ name: "Ezogelin / Tarhana Çorbası Destekleyicisi", desc: "Bulgur pilavınızı çorbaların içine katarak yoğunluğunu ve doyuruculuğunu artırabilirsiniz." }, { name: "Kısır Formatında Salata", desc: "Soğuk turşu, yeşillik ve nar ekşisiyle ezerek zeytinyağlı kısır benzeri bir atıştırmalık yapın." }, { name: "Bulgurlu Köfte", desc: "Kalan bulguru sıcak suyla şişirip domates salçasıyla yoğurarak yassı veya fellah köftesi yapın." }] },
  { keywords: ["nohut", "kalan nohut", "haşlanmış nohut"], recipes: [{ name: "Ev Yapımı Humus", desc: "Nohutları ezip tahin, sarımsak, limon ve zeytinyağı ile karıştırıp harika bir meze elde edebilirsiniz." }, { name: "Fırınlanmış Çıtır Nohut (Atıştırmalık)", desc: "Kalan nohutları süzüp, zeytinyağı, tuz ve kırmızı toz biberle fırına verin. Cips yerine harika sağlıklı bir atıştırmalıktır." }, { name: "Nohutlu Ispanak", desc: "Yeşil sebze yemeğinize ekleyerek protein değerini hızla katlayın." }] },
  { keywords: ["fasulye", "kuru fasulye"], recipes: [{ name: "Piyazlık Fasulye Salatası", desc: "Kalan fasulyeleri süzüp soğan, maydanoz, sirkeli sosla salataya çevirin." }, { name: "Fasulye Ezmesi Meze", desc: "Meksika usulü baharatlandırıp robotta çekerek dip sos hazırayın." }, { name: "Yumurtalı Kuru Fasulye", desc: "Kış kahvaltılarında kalan kuru fasulyeye soğan ve iki yumurta kırın." }] },
  { keywords: ["et", "haşlama", "kavurma", "kuşbaşı"], recipes: [{ name: "Etli Pilav / Etli Şehriye", desc: "Kalan eti didikleyip sade pilavın veya makarnanın üzerine entegre ederek harika bir akşam yemeği yaratın." }, { name: "Et Sote Sandviç", desc: "Sıcak eti biraz soğan ve taze biberle tavada canlandırın, lavaş veya somun ekmek arası yapın." }, { name: "Etli Patates Güveç", desc: "Etleri küp veya elma dilim patateslerle küçük güveçte kaşarlayıp fırınlayın." }, { name: "Pratik Hünkar Beğendi", desc: "Etinizi salçayla ısıtıp kavanoz patlıcan ezmesine dökerek hızlı asil menü çıkartın." }] }
];

export const processLeftovers = (promptText) => {
  const t = promptText.toLowerCase();
  let suggestions = [];
  
  LEFTOVER_DB.forEach(item => {
    if (item.keywords.some(k => t.includes(k))) {
      const shuffled = [...item.recipes].sort(() => 0.5 - Math.random());
      suggestions.push({
        ingredient: item.keywords[0],
        recipes: shuffled.slice(0, 3)
      });
    }
  });

  return suggestions;
};

export const generateGuestMenu = (personCountInput, restrictionsArray) => {
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
    advice: `🌟 Şefin Notu: Girdiğiniz hassasiyetlere %100 uyan risksiz, gösterişli ve premium misafir menüsüdür. (${personCount} Kişilik)`
  };
};

const getIngredientWithQuantityAndGrams = (ingName) => {
   const lower = ingName.toLowerCase();
   if (lower.includes("et") || lower.includes("kuşbaşı") || lower.includes("bonfile") || lower.includes("antrikot") || lower.includes("şavurma")) return { text: `300g ${ingName}`, grams: 300 };
   if (lower.includes("tavuk")) return { text: `400g ${ingName}`, grams: 400 };
   if (lower.includes("kıyma")) return { text: `250g ${ingName}`, grams: 250 };
   if (lower.includes("somon") || lower.includes("levrek")) return { text: `450g ${ingName}`, grams: 450 };
   if (lower.includes("soğan") || lower.includes("sarımsak") || lower.includes("havuç")) return { text: `2 adet ${ingName}`, grams: 100 };
   if (lower.includes("domates") || lower.includes("patates") || lower.includes("patlıcan") || lower.includes("kabak") || lower.includes("biber")) return { text: `3 adet ${ingName}`, grams: 250 };
   if (lower.includes("makarna") || lower.includes("pirinç") || lower.includes("bulgur") || lower.includes("noodle") || lower.includes("mercimek") || lower.includes("nohut") || lower.includes("fasulye")) return { text: `1.5 su bardağı ${ingName} (yaklaşık 300g)`, grams: 300 };
   if (lower.includes("süt") || lower.includes("krema") || lower.includes("su")) return { text: `200ml ${ingName}`, grams: 200 };
   if (lower.includes("kaşar") || lower.includes("peynir")) return { text: `150g ${ingName}`, grams: 150 };
   if (lower.includes("yumurta")) return { text: `2-3 adet ${ingName}`, grams: 120 };
   if (lower.includes("salça") || lower.includes("tereyağı")) return { text: `2 yemek kaşığı ${ingName}`, grams: 40 };
   if (lower.includes("nane") || lower.includes("roka") || lower.includes("fesleğen")) return { text: `1 tutam ${ingName}`, grams: 10 };
   return { text: `Bir miktar ${ingName}`, grams: 50 };
};

export const getDishDetails = (dish) => {
  if (!dish) return null;
  const ingInfoList = dish.ingredients ? dish.ingredients.map(getIngredientWithQuantityAndGrams) : [];
  let totalGrams = 0;
  ingInfoList.forEach(info => totalGrams += info.grams);
  if(totalGrams === 0) totalGrams = 350;
  const calculatedPersonCount = Math.max(1, Math.round(totalGrams / 350));
  
  const ingsList = ingInfoList.length ? ingInfoList.map(info => info.text) : ["Özel (sır) malzemeler"];
  const ingsInline = dish.ingredients ? dish.ingredients.join(", ") : "";
  const ingsBullet = ingsList.map(item => `• ${item}`).join('\n');
  const portion = dish.personCount ? `${dish.personCount} Kişilik` : `Toplam ${totalGrams}g malzeme ile, yaklaşık ${calculatedPersonCount} Kişilik`;
  
  const dynamicRecipe = `👨‍🍳 Adım Adım Ev Şefi Rehberi (Hiç Bilmeyenler İçin):\n\n` +
  `🍽️ Porsiyon: ${portion}\n` +
  `🛒 Gerekli Malzemeler:\n${ingsBullet}\n\n` +
  `1️⃣ Ön Hazırlık: Öncelikle tezgaha ${ingsInline} dizin. Yemek yapmaya başlamadan önce, sebzeleri yıkayıp minik minik doğrayarak (eğer tarifte çiğ et/tavuk varsa onları da doğrayarak) her şeyi elinizin altında hazır bulundurun.\n\n` +
  `2️⃣ Soteleme & Lezzet Tabanı: Orta ateşte tencerenizi / tavanızı 2-3 kaşık sıvıyağ ile hafifçe ısıtın. Tarifte soğan, sarımsak, et veya tavuk varsa ASLA BİRDEN HEPSİNİ ATMAYIN. Önce soğanları pembeleşene kadar (yaklaşık 2-3 dakika) karıştırarak kavurun, sonra et grubunu ekleyip renkleri dönene kadar hafif hafif soteleyin (kavurun).\n\n` +
  `3️⃣ Birleştirme: Kavrulan malzemelerin üzerine (varsa) salçanızı ekleyip 2 dakika daha kavurun (çiğ salça kokusunun gitmesi yemeğin asıl sırrıdır). Sonra ana malzemeleri ve sevdiğiniz baharatları ilave edip tüm malzemenin homojen şekilde bütünleştiğinden emin olun.\n\n` +
  `4️⃣ Son Rötuş ve Servis: Yemeğiniz sulu bir yemekse üstünü hafif geçecek kadar sıcak su ekleyin. Tencerenin kapağını MUTLAKA KAPANMIŞ halde yemeği kısık ateşte pişmeye bırakın. İdeal pişme süresinin son 5 dakikasında kontrol edin (Malzemelere çatal rahatlıkla batıyorsa yemeğiniz lokum gibi pişmiş demektir). Ocağı kapatın ve 10 dk dinlendirip sıcak servis yapın. Afiyet olsun!`;
  
  const regexMeat = /(kıyma|kuşbaşı|antrikot|bonfile|tavuk|somon|levrek|kaşar|peynir|yumurta|süt|krema)/i;
  const regexCarb = /(makarna|noodle|pirinç|bulgur|şehriye|patates|tortilla|ekmek)/i;
  
  let tCal = 0, pPro = 0, cCarb = 0, fFat = 0;
  let dynamicCost = 0;
  if(dish.ingredients) {
     dish.ingredients.forEach(ing => {
        dynamicCost += getTrueCost(ing);
        if(regexMeat.test(ing)) { tCal+=180; pPro+=20; fFat+=8; }
        else if(regexCarb.test(ing)) { tCal+=150; cCarb+=30; pPro+=3; fFat+=1; }
        else { tCal+=45; cCarb+=8; fFat+=1; } 
     });
  } else {
     tCal = ((dish.heaviness || 5) * 85);
     pPro = 15; cCarb = 20; fFat = 10;
     dynamicCost = dish.cost || 0;
  }
  if(tCal < 150) tCal += 100;
  
  return {
    prepTime: (dish.time || 30),
    totalCost: (dish.cost || dynamicCost),
    calories: dish.calories || (Math.round(tCal) + " kcal"),
    macros: dish.macros || `Protein: ${pPro}g | Karbonhidrat: ${cCarb}g | Yağ: ${fFat}g`,
    recipe: dynamicRecipe
  };
};

export const generateShoppingList = (menuObj) => {
  let allIngredients = [];
  if (menuObj.soup && menuObj.soup.ingredients) allIngredients.push(...menuObj.soup.ingredients);
  if (menuObj.main && menuObj.main.ingredients) allIngredients.push(...menuObj.main.ingredients);
  if (menuObj.carb && menuObj.carb.ingredients) allIngredients.push(...menuObj.carb.ingredients);
  if (menuObj.side && menuObj.side.ingredients) allIngredients.push(...menuObj.side.ingredients);
  
  if (menuObj.originalDish && menuObj.originalDish.ingredients) allIngredients.push(...menuObj.originalDish.ingredients);
  if (menuObj.ingredients && !menuObj.main) allIngredients.push(...menuObj.ingredients);

  allIngredients = [...new Set(allIngredients)]; // Remove duplicates

  const categories = {
    "🥩 Kasap & Şarküteri": [],
    "🥗 Manav": [],
    "🛒 Bakkal & Bakliyat": []
  };

  const regexKasap = /(tavuk|kıyma|et|kuşbaşı|somon|kaşar|yoğurt|süt|krema|tereyağı|yumurta)/i;
  const regexManav = /(domates|biber|soğan|sarımsak|patlıcan|kabak|havuç|ıspanak|mantar|salatalık|nane|roka|limon)/i;

  let totalCost = 0;

  allIngredients.forEach(ing => {
    totalCost += (typeof getTrueCost === "function" ? getTrueCost(ing) : 18); 
    if (regexKasap.test(ing)) categories["🥩 Kasap & Şarküteri"].push(ing);
    else if (regexManav.test(ing)) categories["🥗 Manav"].push(ing);
    else categories["🛒 Bakkal & Bakliyat"].push(ing);
  });

  const finalCost = menuObj.totalCost || ((menuObj.main?.cost || 0) + (menuObj.carb?.cost || 0) + (menuObj.soup?.cost || 0)) || totalCost;

  return { categories, estimatedCost: finalCost };
};


export function getTrueCost(ing) {
   let partnerCode = 'BAKI_DEFAULT';
   if (typeof window !== 'undefined' && window.localStorage) {
       partnerCode = localStorage.getItem('GLOBAL_MARKET_PARTNER') || 'BAKI_DEFAULT';
   }
   
   let m = 1.0;
   if (partnerCode === 'MIGROS') m = 1.10;
   else if (partnerCode === 'GETIR') m = 1.25;
   else if (partnerCode === 'TRENDYOL') m = 1.12;
   else if (partnerCode === 'YEMEKSEPETI') m = 1.15;
   else if (partnerCode === 'SOK') m = 0.90;
   else if (partnerCode === 'A101') m = 0.85;
   else if (partnerCode === 'ISTEGELSIN') m = 1.05;

   const tokens = ing.toLowerCase().split(' ');
   const hasWord = (word) => tokens.some(t => t === word);
   const hasAny = (words) => words.some(w => hasWord(w));

   let base = 30; // Default
   if (hasAny(["et", "kuşbaşı", "bonfile", "antrikot", "somon", "levrek", "kavurma", "sucuk", "pastırma"])) base = 450;
   else if (hasAny(["kıyma"])) base = 380;
   else if (hasAny(["tavuk", "piliç", "baget"])) base = 180;
   else if (hasAny(["kaşar", "peynir", "tereyağı"])) base = 150;
   else if (hasAny(["noodle", "sushi", "soya", "teriyaki"])) base = 85;
   else if (hasAny(["domates", "biber", "soğan", "patates", "havuç", "patlıcan", "kabak", "sarımsak"])) base = 35;
   else if (hasAny(["makarna", "pirinç", "bulgur", "un", "mercimek", "nohut", "fasulye", "galeta"])) base = 45;
   else if (hasAny(["salça", "krema", "süt", "yumurta", "yoğurt"])) base = 55;
   
   return Math.round(base * m);
};

// --- OTOMATİK MALİYET, SÜRE VE KALORİ SENKRONİZASYONU ---
// Veritabanındaki "hardcoded" rastgele süreyi, kaloriyi ve maliyetleri ezer.
// Gerçekçi aşçılık fiziği kullanarak malzeme bazlı süre uzatımı ve besin değeri biçer.
[DB_MAINS_HUGE, DB_MAINS, DB_CARBS, DB_SIDES, DB_SOUPS].forEach(database => {
    database.forEach(dish => {
        let dynamicCost = 0;
        let tCal = 150; // Base sauce & prep calories
        let pPro = 5; let cCarb = 10; let fFat = 5;
        let pTime = 15; // Base chopping time (15 mins)
        
        let hasMeat = false; let hasChicken = false; let hasLegume = false; let hasOven = false;

        const nameLower = dish.name.toLowerCase();
        if (nameLower.includes("fırın") || nameLower.includes("graten") || nameLower.includes("güveç") || nameLower.includes("kebab") || nameLower.includes("şinitzel")) {
            hasOven = true;
        }

        dish.ingredients.forEach(ing => {
            const rawIng = Object.prototype.toString.call(ing) === '[object String]' ? ing : "";
            dynamicCost += getTrueCost(rawIng);
            
            const lower = rawIng.toLowerCase();
            const tokens = lower.split(' ');
            const has = (w) => tokens.some(t => t === w) || nameLower.includes(w);

            // Macros & Physics processing
            if (has("et") || has("kuşbaşı") || has("kavurma") || lower.includes("kebab") || has("antrikot") || has("bonfile") || has("somon")) {
                tCal += 250; pPro += 20; fFat += 10;
                hasMeat = true;
            } else if (has("tavuk") || has("piliç") || has("baget")) {
                tCal += 200; pPro += 22; fFat += 5;
                hasChicken = true;
            } else if (has("kıyma") || has("köfte")) {
                tCal += 220; pPro += 15; fFat += 12;
                pTime += 15; // Yoğurma vb
            } else if (has("nohut") || has("fasulye") || has("mercimek")) {
                tCal += 180; cCarb += 25; pPro += 8;
                hasLegume = true;
            } else if (has("makarna") || has("pirinç") || has("bulgur") || has("noodle") || has("yulaf")) {
                tCal += 200; cCarb += 40; pPro += 4;
                pTime += 15; // Haşlama
            } else if (has("patates") || has("patlıcan")) {
                tCal += 100; cCarb += 15; fFat += 5;
                pTime += 15; // Soyma / kızartma payı
            } else if (has("kaşar") || has("tereyağı") || has("krema") || has("peynir")) {
                tCal += 150; fFat += 12;
            } else if (has("yumurta")) {
                tCal += 70; pPro += 6; fFat += 5;
            } else if (has("un") || has("galeta")) {
                tCal += 80; cCarb += 15;
            } else {
                tCal += 15; cCarb += 3; // Standart sebze/baharat
            }
        });

        // Resolve Final Times
        if (hasMeat) pTime += 45; // Kırmızı et pişme payı
        if (hasChicken) pTime += 25; // Beyaz et
        if (hasLegume && !nameLower.includes("çorba")) pTime += 35; // Bakliyat
        if (hasOven) pTime += 20; // Fırınlama

        // Prevent absurd times (e.g. basic side salad getting 60 mins etc)
        if (pTime > 120) pTime = 120;
        if (pTime < 15) pTime = 15;
        if (nameLower.includes("salata") && !hasMeat && !hasChicken) pTime = 15;
        if (nameLower.includes("çorba") && pTime > 45) pTime = 40;

        // Force Sync Standard Object Nodes
        dish.cost = dynamicCost;
        dish.time = pTime;
        dish.calories = Math.round(tCal) + " kcal";
        dish.macros = `Protein: ${Math.round(pPro)}g | Karb: ${Math.round(cCarb)}g | Yağ: ${Math.round(fFat)}g`;
    });
});

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
    let c = getTrueCost(ing);
    totalCost += c; 
    if (regexKasap.test(ing)) categories["🥩 Kasap & Şarküteri"].push(ing);
    else if (regexManav.test(ing)) categories["🥗 Manav"].push(ing);
    else categories["🛒 Bakkal & Bakliyat"].push(ing);
  });
  
  return { categories, estimatedCost: totalCost };
};

export const generateWeeklyPlan = (daysCount, strategy, profile, cuisine = 'ALL', maxTime = 999, maxCost = 9999) => {
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
      const single = { ...matches[0], ...getDishDetails(matches[0]) };
      return {
         diet: { name: single.name, desc: `🔥 Kalori: ${single.calories} - Diyet formuna uygun tek alternatif.`, dishObj: single },
         kid: { name: single.name + " (Çocuk/Sporcu Porsiyonu)", desc: `⏱ Süre: ${single.time} dk - Daha doyurucu soslarla ekstra porsiyonlu servis.`, dishObj: single }
      };
  }
  
  // Lighest items pool (First 30%)
  const lightLimit = Math.max(1, Math.floor(matches.length * 0.4));
  const lightPool = matches.slice(0, lightLimit).sort(() => 0.5 - Math.random());
  
  // Heaviest items pool (Last 30%)
  const heavyStart = Math.max(lightLimit, matches.length - Math.floor(matches.length * 0.4));
  const heavyPool = matches.slice(heavyStart).sort(() => 0.5 - Math.random());
  
  const rawDiet = lightPool[0] || matches[0];
  const rawKid = heavyPool[0] || matches[matches.length - 1];

  const dietDish = { ...rawDiet, ...getDishDetails(rawDiet) };
  const kidDish = { ...rawKid, ...getDishDetails(rawKid) };

  return {
     diet: { name: dietDish.name, desc: `🔥 Kalori: ${dietDish.calories} - Saf, hafif ve sindirimi kolay, diyet formuna tam uygun '${t}' alternatifi.`, dishObj: dietDish },
     kid: { name: kidDish.name, desc: `⏱ Süre: ${kidDish.time} dk - Yüksek enerjili, çocukların ve sporcuların bayılacağı tam doyurucu formatı.`, dishObj: kidDish }
  };
};

export const generateGroupMenu = (members) => {
   if (!members || members.length === 0) return [];
   
   const rules = members.map(m => m.rule);
   const isVegan = rules.includes('VEGAN');
   const isGlutenFree = rules.includes('GLUTEN_FREE');
   const isLactoseFree = rules.includes('LACTOSE_FREE');
   const isDiabetic = rules.includes('DIABETIC');
   const isSeafoodAllergy = rules.includes('SEAFOOD_ALLERGY');
   const wantsWeightLoss = rules.includes('WEIGHT_LOSS');
   const wantsWeightGain = rules.includes('WEIGHT_GAIN');
   const wantsProtein = rules.includes('HIGH_PROTEIN');
   const hasConflictingDiets = isVegan && (wantsProtein || wantsWeightGain);

   const veganBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|süt|yumurta|peynir|kaşar|tereyağı|krema|kavurma)/i;
   const glutenBanned = /(makarna|noodle|un|ekmek|bulgur|şehriye)/i;
   const lactoseBanned = /(süt|krema|peynir|kaşar|tereyağı)/i;
   const diabeticBanned = /(şeker|makarna|pirinç|noodle|ekmek|patates)/i;
   const seafoodBanned = /(somon|levrek|karides|balık)/i;
   const proteinBoost = /(tavuk|kıyma|et|somon|kaşar|yumurta|nohut|fasulye|mercimek|peynir)/i;

   let validDishes = [];

   DB_MAINS_HUGE.forEach(dish => {
       const ings = dish.ingredients.join(" ").toLowerCase() + " " + dish.name.toLowerCase();
       let isBanned = false;
       if (isVegan && veganBanned.test(ings)) isBanned = true;
       if (isGlutenFree && glutenBanned.test(ings)) isBanned = true;
       if (isLactoseFree && lactoseBanned.test(ings)) isBanned = true;
       if (isDiabetic && diabeticBanned.test(ings)) isBanned = true;
       if (isSeafoodAllergy && seafoodBanned.test(ings)) isBanned = true;
       if (wantsWeightLoss && dish.heaviness > 5) isBanned = true;
       
       if (!isBanned) {
           let score = 0;
           if (wantsProtein && proteinBoost.test(ings)) score += 5;
           if (wantsWeightLoss && dish.heaviness <= 3) score += 3;
           if (wantsWeightGain && dish.heaviness >= 7) score += 3;
           validDishes.push({ ...dish, score });
       }
   });

   // Dinamik Split Tarifler Dizisi
   const splitRecipes = [
      {
         name: "Ayrıştırılabilir Soslu Makarna (Etli ve Vegan/Sebzeli)",
         time: 30, cost: 250, type: "MIXED", heaviness: 5, ingredients: ["makarna", "kıyma", "domates", "zeytinyağı", "fesleğen"],
         logicExplanation: "Grubunuzda hem et yiyen hem yemeyen (vegan/diyet) biri var. Sade makarnayı haşlayıp ikiye ayırın! Bir kısmına kıymalı/etli bolonez sos eklerken, diğerine domatesli zeytinyağlı enfes vegan sosunuzu ekleyin. Herkes mutlu!"
      },
      {
         name: "Kişiselleştirilebilir Meksika Tacosu / Burrito",
         time: 35, cost: 350, type: "MIXED", heaviness: 6, ingredients: ["lavaş", "kıyma", "meksika fasulyesi", "mısır", "avokado", "kırmızı biber"],
         logicExplanation: "Kişiselleştirilebilir mükemmel aile matrisi! Sosları (guacamole, salsa) ve Meksika fasulyesini veganlar/hassas diyetliler için ortak masaya dizin. Et sevenler için ise tavada hızla harmanlanan kıymayı ekstra olarak dürümün içine ekleyin."
      },
      {
         name: "Ayrıştırılmış Sulu Yemek (Örn: Etli/Etsiz Nohut veya Fasulye)",
         time: 50, cost: 200, type: "MIXED", heaviness: 4, ingredients: ["kuru fasulye", "kuşbaşı et", "soğan", "salça", "zeytinyağı"],
         logicExplanation: "Yemeğin tabanını zeytinyağı ile tamamen etsiz (vegan/sade) pişirin. Yemeğin %50'si piştikten sonra vegan/diyet olan şefimiz için porsiyonu tencereden ayırın. Ardından tencerede kalan yemeğe daha önceden jülyen sotelediğiniz etleri ekleyip 10 dk daha özdeşleştirin."
      }
   ];

   let finalSuggestions = [];
   
   // Randomize outputs for the Refresh button mechanic
   const shuffledSplits = [...splitRecipes].sort(() => 0.5 - Math.random());
   if (members.length > 1) {
       // Grubun farklı tercihleri var, 1 adet özel split mutlaka ekle
       finalSuggestions.push(shuffledSplits[0]);
   }

   // Diğerleri ortak yemeklerden (Eğer tamamen boş değilse)
   if (validDishes.length > 0) {
       validDishes.sort(() => 0.5 - Math.random()); // Karıştır (Reroll destekli)
       // Score bazlı ama randomize edilmiş havuz (en iyi %50 içinden rastgele)
       validDishes.sort((a,b) => b.score - a.score);
       const topHalf = validDishes.slice(0, Math.max(3, Math.floor(validDishes.length / 2)));
       const mixedTopHalf = topHalf.sort(() => 0.5 - Math.random());
       
       mixedTopHalf.slice(0, members.length > 1 ? 2 : 3).forEach(dish => {
           let logicExp = "Grupun sağlık standartının '%100 TAM ORTAK KESİŞİM' noktasıdır. ";
           members.forEach(m => {
               if (m.rule === 'VEGAN') logicExp += `${m.name} için tamamen bitkisel. `;
               if (m.rule === 'GLUTEN_FREE') logicExp += `${m.name} için tamamen unsuz. `;
               if (m.rule === 'DIABETIC') logicExp += `${m.name} için sıfır tatlandırıcı şekersiz. `;
               if (m.rule === 'HIGH_PROTEIN') logicExp += `${m.name} kaslarını besler. `;
           });
           finalSuggestions.push({ ...dish, logicExplanation: logicExp.trim() });
       });
   } else if (members.length > 1) {
       // Hiçbir ortak kesişim yoksa, kalan SPLIT yemeği ver. (Örn 1 Vegan + 1 Carnivore = Ortak kesişim genelde 0)
       finalSuggestions.push(shuffledSplits[1]);
   }

   return finalSuggestions.sort(() => 0.5 - Math.random()).map(dish => {
       const details = getDishDetails(dish);
       return { ...dish, ...details };
   });
};

export const getSimilarDishes = (target) => {
   const targetDishObj = target.originalDish || target;
   const targetIngs = targetDishObj.ingredients || [];
   let similar = [];
   
   DB_MAINS_HUGE.forEach(dish => {
       if (dish.id === targetDishObj.id) return; 
       
       let score = 0;
       
       if (dish.type === targetDishObj.type) score += 5;
       
       let dishIngs = dish.ingredients || [];
       let intersectCount = dishIngs.filter(ing => targetIngs.includes(ing)).length;
       score += (intersectCount * 4); 

       if (Math.abs(dish.cost - targetDishObj.cost) <= 30) score += 3;
       if (Math.abs(dish.time - targetDishObj.time) <= 15) score += 2;
       if (Math.abs(dish.heaviness - targetDishObj.heaviness) <= 2) score += 2;
       
       similar.push({ ...dish, score });
   });

   similar.sort((a,b) => b.score - a.score);
   return similar.slice(0, 3).map(dish => {
       const details = getDishDetails(dish);
       const dishIngs = dish.ingredients || [];
       const intersect = dishIngs.filter(ing => targetIngs.includes(ing));
       const exp = `❤️ Favoriniz olan '${targetDishObj.name}' tarifi ile ${intersect.length > 0 ? "benzer malzemeler ("+intersect.join(", ")+") barındırıyor, " : ""}fiyat ve süre dengesi neredeyse tamamen aynı. İdeal bir alternatif!`;
       return { ...dish, ...details, logicExplanation: exp };
   });
};
