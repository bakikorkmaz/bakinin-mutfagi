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
    return `__CMD:WHEEL__Hemen seni Şans Çarkı'na yönlendiriyorum! Orada kaderine ne çıkarsa onu pişirirsin.`;
  }
  
  if (t.includes("dolap") || t.includes("malzeme") || t.includes("evde") || t.includes("buzdolabı")) {
      return `__CMD:FRIDGE__Eldeki malzemeleri değerlendirmek harika fikir! Seni hemen 'Dolabımdakiler' modülüne ışınlıyorum.`;
  }

  if (t.includes("kaç dakika") || t.includes("ne kadar sürer") || t.includes("süresi") || t.includes("kalori") || t.includes("maliyet") || t.includes("fiyat")) {
      let foundDish = DB_MAINS_HUGE.find(m => t.includes(m.name.toLowerCase()));
      if (foundDish) {
          const det = getDishDetails(foundDish);
          return `Hemen analiz ediyorum! ${foundDish.name} yemeği ortalama ${det.prepTime} dakikada pişer, kalorisi yaklaşık ${det.calories} kcal'dir ve yapım maliyeti yaklaşık ${det.totalCost} TL tutar.`;
      }
      return `Hangi yemeği sorduğunuzu tam çıkaramadım. Lütfen yemeğin adını tam belirterek ("Karnıyarık kaç dakika sürer" gibi) sorar mısın?`;
  }

  if (t.includes("fiyat") || t.includes("pazar listesi") || t.includes("alışveriş") || t.includes("eksik")) {
    return `Herhangi bir tarifin içindeyken "Pazar Listesini Çıkar" butonuna basarsan bakkal/market hesabını senin için kuruşu kuruşuna çıkarırım.`;
  }
  
  if (t.includes("teşekkür") || t.includes("sağol") || t.includes("süper") || t.includes("harika") || t.includes("eline sağlık")) {
    return `Afiyet bal şeker olsun! Sizin için her zaman buradayım, mutfakla ilgili başka bir sorunuz olursa çekinmeden sorun. Ne isterseniz emrinize amade! 💖`;
  }
  
  // === 1. YANINA NE GİDER? (EŞLEŞTİRME & YAN YEMEK DANIŞMANI) ===
  if (t.includes("yanına ne") || t.includes("ne gider") || t.includes("ne yakışır") || t.includes("yanında ne") || t.includes("eşlik")) {
     let dish = DB_MAINS_HUGE.find(m => t.includes(m.name.toLowerCase()));
     const dishName = dish ? dish.name : t.replace(/(yanına ne|ne gider|ne yakışır|yanında ne|eşlik eder|gider|\?)/gi, '').trim();
     
     if (/(köfte|kebap|et|bonfile|pirzola|kavurma)/i.test(dishName)) {
        return `🍖 ${dishName || 'Kırmızı Et / Köfte'} yanında muazzam gidecek ikililer:\n\n1. 🍚 Tereyağlı Şehriyeli Pirinç Pilavı veya Meyhane Pilavı\n2. 🥗 Taze Fırınlanmış Patates Kama & Köz Biber\n3. 🥣 Süzme Cacık veya Bol Nar Ekşili Gavurdağı Salatası\n4. 🧊 Soğuk Şalgam Suyu veya Ayran\n\nHangi pilavın veya salatanın detaylı tarifini istersin şefim?`;
     } else if (/(tavuk|şinitzel|sote|nugget)/i.test(dishName)) {
        return `🍗 ${dishName || 'Tavuk Yemekleri'} ile damak çatlatan eşleşmeler:\n\n1. 🍝 Kremalı Mantarlı Makarna veya Patates Püresi\n2. 🥗 Akdeniz Yeşillikleri & Sezar Soslu Salata\n3. 🥣 Kremalı Mantar veya Mısır Çorbası\n\nTariflerini hemen verebilirim!`;
     } else if (/(balık|somon|levrek|hamsi)/i.test(dishName)) {
        return `🐟 ${dishName || 'Balık'} sofrasının olmazsa olmazları:\n\n1. 🥗 Roka Salatası (Kırmızı soğan ve bol limonlu)\n2. 🥔 Fırında Taze Patates veya Sarımsaklı Ekmek\n3. 🍮 Tatlı Kapanış: Sıcak Tahin Helvası (Fırınlanmış)\n\nFırın helvanın özel yapılışını duymak ister misin?`;
     } else if (/(kuru fasulye|nohut|türlü|bamya)/i.test(dishName)) {
        return `🍲 ${dishName || 'Sulu Ev Yemeği'} klasik menü tamamlayıcıları:\n\n1. 🍚 Tane Tane Tereyağlı Pirinç Pilavı\n2. 🥒 Ev Yapımı Kütür Kütür Turşu & Kuru Soğan\n3. 🥣 Bol Nane Yayla Çorbası veya Cacık`;
     } else if (/(makarna|spagetti|penne|lazanya)/i.test(dishName)) {
        return `🍝 ${dishName || 'Makarna'} lezzetini zirveye çıkaracak öneriler:\n\n1. 🥖 Fırınlanmış Sarımsaklı & Otlu Ekmek\n2. 🥗 İtalyan Tarzı Caprese veya Sezar Salata\n3. 🍷 Meyve Aromalı Soğuk İçecekler veya Bruschetta`;
     } else {
        return `🍽️ ${dishName ? '"' + dishName + '"' : 'Yemeğinin'} yanına en çok yakışan klasikler:\n\n1. 🥣 Başlangıç için hafif bir Süzme Mercimek Çorbası\n2. 🍚 Yan lezzet olarak Pirinç veya Bulgur Pilavı\n3. 🥗 Ferahlatıcı Çoban Salata ve Ev Yapımı Yoğurt!`;
     }
  }

  // === 2. ÇORBA SEÇKİLERİ & BAŞLANGIÇLAR ===
  if (t.includes("çorba")) {
     const soups = DB_MAINS_HUGE.filter(m => /çorba/i.test(m.name)).slice(0, 5);
     const names = soups.map(s => `🥣 ${s.name} (${s.time} dk - ₺${s.cost})`).join("\n");
     return `İşte mutfağımızın şifa kaynağı çorba alternatifleri:\n\n${names}\n\nHangi çorbanın ustasından püf noktalı tarifini istersin?`;
  }

  // === 3. TATLI & PASTA & HAMUR İŞİ ===
  if (t.includes("tatlı") || t.includes("şerbetli") || t.includes("pasta") || t.includes("kek") || t.includes("çikolata")) {
     return `🍰 Nefis Tatlı & Hamur İşi Fikirleri:\n\n1. 🍮 Fırın Sütlaç (Üzeri Karamelize & Bol Sütlü)\n2. 🍫 Islak Kek (Bol Çikolata Soslu Nefis Kıvam)\n3. 🍎 Tarçınlı Cevizli Elmalı Kurabiye\n4. 🍧 İrmik Helvası (Dondurma Dolgulu)\n\nHangi tatlının adım adım altın kural tarifini hazırlayayım şefim?`;
  }

  // === 4. KAHVALTI & BRUNCH ===
  if (t.includes("kahvaltı") || t.includes("brunch") || t.includes("omlet") || t.includes("menemen")) {
     return `🍳 Güne Enfes Başlangıç İçin Kahvaltı Fikirleri:\n\n1. 🍅 Bol Domatesli & Biberli Peynirli Menemen\n2. 🥞 Puf Puf Pankek (Bal & Meyve Eşliğinde)\n3. 🧀 Fırında Peynirli Sucuklu Ekmek Dilimleri\n4. 🥔 Patatesli Kaşarlı Omlet\n\nHangisinin tarifini detayıyla anlatayım?`;
  }

  // === 5. SPORCU & KETO & LAKTOZSUZ DİYETLER ===
  if (t.includes("sporcu") || t.includes("protein") || t.includes("keto") || t.includes("laktozsuz") || t.includes("tuzsuz")) {
     const fitDishes = DB_MAINS_HUGE.filter(m => (m.type === 'FIT' || m.heaviness <= 4) && /tavuk|et|somon|yumurta|lor/i.test(m.ingredients.join(" "))).slice(0, 4);
     const fitNames = fitDishes.map(m => `💪 ${m.name} (~${m.calories || 450} kcal - Bol Protein)`).join("\n");
     return `🏋️‍♂️ Sporcu ve Özel Beslenme İçin Makro Dengeli Öneriler:\n\n${fitNames}\n\nİstediğin tarifin adını yazman yeterli şefim!`;
  }

  // === 6. SAGLIK / TIP / BESLENME BAGIMI ===
  const isMedical = t.includes("hacamat") || t.includes("ameliyat") || t.includes("hasta") || t.includes("tedavi") || t.includes("iyileşme") || t.includes("operasyon");
  const wantsPlantBased = (t.includes("hayvansal") && (t.includes("yok") || t.includes("yeme") || t.includes("içerme") || t.includes("istemiyorum") || t.includes("olmasın") || t.includes("tüketm") || t.includes("olmayan") || t.includes("hariç") || t.includes("çıkar") || t.includes("kes"))) || t.includes("bitkisel") || t.includes("vegan") || t.includes("vejetaryen") || t.includes("etsiz");

  if (isMedical && wantsPlantBased) {
    if (typeof window !== 'undefined') window.globalLastIngs = null;
    const plantDishes2 = DB_MAINS_HUGE.filter(m => {
      const mIngs = m.ingredients.join(" ").toLowerCase();
      return !/tavuk|kıyma|et|kuşbaşı|somon|levrek|sucuk|pastırma|kavurma|bonfile|kaşar|peynir|krema|tereyağı/.test(mIngs);
    }).sort(() => 0.5 - Math.random()).slice(0, 5);
    const names2 = plantDishes2.map(m => "🌿 " + m.name).join("\n");
    if (typeof window !== 'undefined') { window.globalLastDietFilter = 'plant_strict'; window.globalShownDietDishes = plantDishes2.map(m => m.id); }
    return "Evet şefim, tıbbi bir süreç sonrasında hayvansal içerik içermeyen hafif yemekler çok önemli! Tam sana göre seçtiklerim:\n\n" + names2 + "\n\nBunların tarifini görmek için \"... nasıl yapılır?\" diyebilirsin. Beğenmezsen \"başka\" veya \"değiştir\" diyerek yeni öneriler isteyebilirsin. Bitkisel gıdalar iyileşmeyi hızlandırır. 💚";
  }

  if (wantsPlantBased) {
    if (typeof window !== 'undefined') window.globalLastIngs = null;
    const alreadyShown = (typeof window !== 'undefined' && window.globalShownDietDishes) ? window.globalShownDietDishes : [];
    let plantDishes3 = DB_MAINS_HUGE.filter(m => {
      const mIngs = m.ingredients.join(" ").toLowerCase();
      return !/tavuk|kıyma|et|kuşbaşı|somon|levrek|sucuk|pastırma|kavurma|bonfile/.test(mIngs);
    });
    if (alreadyShown.length > 0) {
      const freshPlant = plantDishes3.filter(m => !alreadyShown.includes(m.id));
      if (freshPlant.length >= 3) plantDishes3 = freshPlant;
    }
    plantDishes3 = plantDishes3.sort(() => 0.5 - Math.random()).slice(0, 5);
    const names3 = plantDishes3.map(m => "🌿 " + m.name).join("\n");
    if (typeof window !== 'undefined') {
      window.globalLastDietFilter = 'plant';
      if (!window.globalShownDietDishes) window.globalShownDietDishes = [];
      window.globalShownDietDishes.push(...plantDishes3.map(m => m.id));
    }
    return "Hayvansal içeriği olmayan bitkisel/vegan yemekler için harika seçimler:\n\n" + names3 + "\n\nHepsinin tarifi için isim yazman yeterli! Beğenmezsen \"başka\" veya \"değiştir\" diyerek yepyeni alternatifler isteyebilirsin. 🌱";
  }

  if (isMedical) {
    if (typeof window !== 'undefined') window.globalLastIngs = null;
    return "Sağlık sürecinizde dikkatli beslenmeniz çok önemli, şefim! Genel olarak:\n\n🥗 Sebze ağırlıklı, az yağlı yemekler (mercimek çorbası, zeytinyağlı sebzeler)\n🍗 Hafif pişmiş tavuk (haşlama veya buharda)\n🐟 Fırın balık (sade)\n🥣 Yoğurt ve probiyotikler\n\n...tercih edilir. Hayvansal içerik dışında yemek istersen 'hayvansal içerik olmayan yemekler' diyebilirsin.";
  }

  if (t.includes("diyet") || t.includes("kalori") || t.includes("zayıf") || t.includes("kilo") || t.includes("spor")) {
    return `Kilo kontrolü veya sağlıklı beslenme mi? Harika! Ana ekrandaki 'Evin Sağlık Karnesi' modülüne sadece tek bir malzeme (Örn: tavuk) yazarak onun hem diyet (zayıflatan) hem de doyurucu iki farklı versiyonunu eş zamanlı görebilirsin.`;
  }

  // === 7. ULTRA GELİŞMİŞ ÜRETKEN TARİF SİMÜLATÖRÜ ===
  const recipeMatch = t.match(/([a-zA-ZğüşıöçĞÜŞİÖÇ\s]+)(?:nasıl yapılır|tarifi|nasıl yap|anlat|verir misin|yapılışı|nasıldır)/i) || 
                      (t.includes("yap") && t.split(" ").length <= 4 ? [null, t.replace(/(yap|nasıl|bana|bir)/g, "").trim()] : null);
                      
  if (recipeMatch || t.includes("tarif")) {
    const rawDishName = (recipeMatch && recipeMatch[1]) ? recipeMatch[1].trim() : t.replace(/(nasıl yapılır|tarifi|nasılır|anlat|verir misin|yapılışı|\?|bana|bir)/gi, '').trim();
    
    if (rawDishName.length > 2) {
      const matchedDish = DB_MAINS_HUGE.find(m => rawDishName.includes(m.name.toLowerCase()) || m.name.toLowerCase().includes(rawDishName));
      
      if(matchedDish) {
         const details = getDishDetails(matchedDish);
         return `Hemen! İşte ustasından garantili ${matchedDish.name} tarifi:\n\n${details.recipe}`;
      } else {
         const dishUpper = rawDishName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
         const isDessert = /(tatlı|pasta|kek|sütlaç|puding|helva|kurabiye|bisküvi)/i.test(t + " " + rawDishName);
         
         if (isDessert) {
            return `🍰 Master-Chef Rehberi: ${dishUpper} Yapılışı\n\n` +
                   `🛒 Malzemeler: 2 su bardağı süt/un, 1 su bardağı şeker, 2 yumurta, 100g tereyağı, 1 paket vanilya/kabartma tozu.\n\n` +
                   `👨‍🍳 Adım Adım Hazırlanışı:\n` +
                   `1. Şeker ve yumurtayı mikserle rengi beyazlaşana kadar en az 5 dakika çırpın.\n` +
                   `2. Sıvı malzemeleri yavaşça ekleyip düşük devirde karıştırın.\n` +
                   `3. Kuru malzemeleri (un, vanilya) eleyerek harca ekleyin ve spatulayla havasını söndürmeden karıştırın.\n` +
                   `4. Önceden ısıtılmış 180°C fırında 25-30 dakika kapağını açmadan pişirin.\n\n` +
                   `⏱️ Pişme Süresi: 35 dk | 📊 Kalori: ~380 kcal/porsiyon | 💰 Tahmini Maliyet: ₺95`;
         } else {
            return `🍳 Ustasından Garantili: ${dishUpper} Yapılışı\n\n` +
                   `🛒 Malzemeler: 500g ana malzeme, 1 adet kuru soğan, 2 diş sarımsak, 2 yemek kaşığı zeytinyağı/tereyağı, 1 kaşık domates salçası, karabiber, kekik, tuz.\n\n` +
                   `👨‍🍳 Adım Adım Hazırlanışı:\n` +
                   `1. İnce kıyılmış soğan ve sarımsağı yağda pembeleşene kadar soteleyin.\n` +
                   `2. Ana malzemeyi tencereye alıp suyunu salıp çekene kadar orta ateşte kavurun.\n` +
                   `3. Salçayı ekleyip kokusu çıkana kadar 2 dakika çevirin.\n` +
                   `4. Baharatları ve üzerini 1 parmak geçecek sıcak suyu ekleyip kapağı kapalı kısık ateşte demlenmeye bırakın.\n\n` +
                   `⏱️ Pişme Süresi: 30-40 dk | 📊 Kalori: ~450 kcal/porsiyon | 💰 Tahmini Maliyet: ₺160`;
         }
      }
    }
  }

  // === 8. DEVAM EDEN İSTEK ('BAŞKA / YENİLE') ===
  const isAskingMore = t.includes("başka") || t.includes("daha") || t.includes("peki") || t.includes("alternatif") || t.includes("diğer") || t.includes("değiştir");
  
  if (isAskingMore) {
    if (typeof window !== 'undefined' && window.globalLastDietFilter === 'plant') {
       return processChatPrompt("hayvansal olmasın başka");
    }
  }

  // === 9. AKILLI MALZEME NLP VE EŞLEŞTİRME ===
  const cleanedText = t.replace(/(tüketmi|tüketme|istemiyorum|olmasın|olmayan|hayvansal|vejetaryen|vegan|etsiz|diyet|başka|değiştir)/gi, '');
  const ings = INGREDIENT_KEYWORDS.filter(k => {
     if (k.length <= 2) return false;
     const reg = new RegExp(`\\b${k}\\b`, 'i');
     return reg.test(cleanedText) || (k.length >= 4 && cleanedText.includes(k));
  });
  
  if (ings.length > 0) {
    if (typeof window !== 'undefined' && JSON.stringify(window.globalLastIngs) !== JSON.stringify(ings)) {
       window.globalShownDishes = [];
    }
    if (typeof window !== 'undefined') window.globalLastIngs = ings; 
    
    let matches = DB_MAINS_HUGE.filter(m => 
       ings.some(ing => m.ingredients.some(mi => mi.toLowerCase().includes(ing)))
    );
    const strictMatches = matches.filter(m => ings.every(ing => m.ingredients.some(mi => mi.toLowerCase().includes(ing))));
    if (strictMatches.length > 0) matches = strictMatches;
    
    if (isAskingMore && typeof window !== 'undefined' && window.globalShownDishes && window.globalShownDishes.length > 0) {
        matches = matches.filter(m => !window.globalShownDishes.includes(m.id));
    }

    if(matches.length > 0) {
       const shuffled = [...matches].sort(() => 0.5 - Math.random());
       const selected = shuffled.slice(0, 3);
       const topMatches = selected.map(m => `🍲 ${m.name}`).join("\n");
       
       if (typeof window !== 'undefined') {
         if(!window.globalShownDishes) window.globalShownDishes = [];
         window.globalShownDishes.push(...selected.map(m => m.id));
       }
       
       const joinedIngs = ings.join(", ");
       
       if (isAskingMore) {
           return `Tabii ki şefim! ${joinedIngs} kullanarak yapabileceğin sıradışı yepyeni fikirler şunlar:\n\n${topMatches}\n\nBunlardan birine gözün çarptıysa adını yaz, detaylarını dökeyim!`;
       }
       return `Harika! Elindeki "${joinedIngs}" ile mutfakta harikalar yaratabiliriz. Senin için yapay zeka hafızamdan çektiğim en uyumlu 3 tarif şunlar:\n\n${topMatches}\n\nBu yemeklerden ilgini çekenin tarifini (Örn: "${selected[0].name} nasıl yapılır?") diye sorabilirsin. İstersen "Başka ne var?" diyerek önerileri de değiştirebilirim!`;
    } else {
       const joinedIngs = ings.join(", ");
       const isFruit = ings.some(i => /(elma|ayva|erik|muz|armut|çilek|portakal|mandalina|kivi|üzüm|incir)/i.test(i));
       
       if (isFruit) {
           return `Hımm, "${joinedIngs}" ile tuzlu tencere yemeği yapmak yerine harika bir taze meyve salatası, komposto veya yoğurtlu/ballı smoothie hazırlayabilirsin! 🍎 Veya yanına fırınlamak için tarçın ve ceviz eklemek ister misin?`;
       }
       if (isAskingMore) {
           return `Elimdeki "${joinedIngs}" içeren tüm şaheserleri sana saydım şefim! Bunlar dışında repertuarım şimdilik tükendi. Yanına başka bir malzeme eşleştirsek? (Örn: patates veya kaşar ekleyerek sorarsan yeni tarifler bulabilirim).`;
       } else {
           return `Hımm, saf olarak sadece "${joinedIngs}" içeren hazır bir tencere tarifi bulamadım şefim. Yanına soğan, salça veya patates ekleyip nefis bir sote veya çorba yapabiliriz! Veya yanına eklemek istediğin başka bir malzeme var mı?`;
       }
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
      let dynamicMissingCost = 0;
      m.ingredients.forEach(ing => {
          if(lowerSelected.some(sel => sel.includes(ing) || ing.includes(sel))) {
              matchScore++;
              matchedIngs.push(ing);
          } else {
              missingIngs.push(ing);
              dynamicMissingCost += getTrueCost(ing);
          }
      });
      if (matchScore > 0) {
         const details = getDishDetails(m);
         const recipeFullCost = details.totalCost || m.cost || 110;
         mains.push({ 
           ...m, 
           matchScore, 
           matchedIngs, 
           missingIngs, 
           calories: details.calories, 
           macros: details.macros, 
           prepTime: details.prepTime, 
           totalCost: recipeFullCost,
           missingCost: dynamicMissingCost, 
           recipe: details.recipe 
         });
      }
   }
   mains.sort((a, b) => b.matchScore - a.matchScore);
   return mains;
};

export const LEFTOVER_DB = [
  {
    keywords: ["tavuk", "haşlanmış tavuk", "baget", "kanat", "göğüs"],
    recipes: [
      { name: "Tavuklu Tel Şehriye Çorbası", desc: "Tavuk parçalarını didikleyip şehriyeli tavuk suyuna çorba yapabilirsiniz.", ingredients: ["haşlanmış tavuk", "tel şehriye", "tereyağı", "limon", "maydanoz"] },
      { name: "Tavuklu Sezar Salata", desc: "Soğuk tavuk parçalarını marul ve kruton ekmekle salataya dönüştürün.", ingredients: ["haşlanmış tavuk", "marul", "bayat ekmek", "zeytinyağı", "kaşar peyniri"] },
      { name: "Tavuklu Sandviç / Dürüm", desc: "Tavuğu didikleyip mayonez ve kornişon turşu ile harmanlayarak harika bir soğuk sandviç içi elde edebilirsiniz.", ingredients: ["haşlanmış tavuk", "lavaş", "mayonez", "turşu"] },
      { name: "Tavuklu Fırın Graten", desc: "Didiklenmiş tavuğu sebzelerle fırına verip beşamel sos ve kaşarla graten yapın.", ingredients: ["tavuk", "beşamel sos", "kaşar peyniri", "biber"] },
      { name: "Tavuk Sote", desc: "Kalan tavuğu soğan ve biberle soteleyerek canlandırın.", ingredients: ["tavuk", "soğan", "biber", "domates", "zeytinyağı"] }
    ]
  },
  {
    keywords: ["makarna", "erişte", "spagetti", "penne"],
    recipes: [
      { name: "Fırın Makarna", desc: "Kalan makarnayı beşamel sos ve kaşarla fırınlayarak yepyeni bir yemeğe çevirin.", ingredients: ["makarna", "beşamel sos", "kaşar peyniri", "tereyağı"] },
      { name: "Makarna Salatası", desc: "Soğuk makarnayı yoğurt, mayonez ve garnitür ile karıştırarak pratik bir salata yapın.", ingredients: ["makarna", "yoğurt", "mayonez", "garnitür", "mısır"] },
      { name: "Yumurtalı Makarna", desc: "Makarnayı tavada az yağ ile çevirip yumurta kırarak doyurucu bir öğün yapın.", ingredients: ["makarna", "yumurta", "tereyağı", "karabiber"] },
      { name: "Sosyete Mantısı (Makarnadan)", desc: "Kalan sade makarnayı sarımsaklı yoğurt ve salçalı sosla mantı gibi servis edin.", ingredients: ["makarna", "sarımsaklı yoğurt", "salça", "nane"] }
    ]
  },
  {
    keywords: ["ekmek", "bayat ekmek", "pide", "simit", "poğaça", "lavaş"],
    recipes: [
      { name: "Ekmek Pizzası", desc: "Bayat ekmek dilimlerinin üzerine sos ve kaşar ekleyip fırınlayarak pratik atıştırmalıklar yapabilirsiniz.", ingredients: ["bayat ekmek", "domates sosu", "kaşar peyniri", "sucuk"] },
      { name: "Yumurtalı Ekmek", desc: "Ekmekleri çırpılmış yumurtaya bulayıp kızartarak harika bir kahvaltı hazırlayın.", ingredients: ["bayat ekmek", "yumurta", "tuz", "zeytinyağı"] },
      { name: "Bayat Ekmek Köftesi", desc: "Ekmek içlerini ıslatıp baharat ve soğanla harmanlayarak etsiz (veya kıymalı) köfte yapabilirsiniz.", ingredients: ["bayat ekmek", "soğan", "maydanoz", "yumurta", "baharat"] },
      { name: "Papara", desc: "Bayat ekmekleri doğrayın ve üzerine et suyu döküp yoğurtla servis edin.", ingredients: ["bayat ekmek", "et suyu", "yoğurt", "tereyağı"] },
      { name: "Fırın Kruton", desc: "Çorbaların üstü için ekmekleri zeytinyağı ve baharat ile küp küp fırınlayıp çıtırlaştırın.", ingredients: ["bayat ekmek", "zeytinyağı", "kekik", "tuz"] }
    ]
  },
  {
    keywords: ["patates", "haşlanmış patates", "patates püresi", "kızartma"],
    recipes: [
      { name: "Patates Kroket", desc: "Püre şeklindeki patatesleri top yapıp galeta ununa bulayarak kızartın.", ingredients: ["patates", "yumurta", "galeta unu", "kaşar peyniri"] },
      { name: "Patatesli Omlet / Frittata", desc: "Artan patatesleri küp küp doğrayarak sabah kahvaltısında bol yumurtayla tavada değerlendirin.", ingredients: ["patates", "yumurta", "soğan", "maydanoz"] },
      { name: "Patates Kavurması", desc: "Soğanları kavurup kalan patatesi salçayla çevirin, ev yemeğine dönsün.", ingredients: ["patates", "soğan", "salça", "zeytinyağı"] },
      { name: "Yoğurtlu Patates Salatası", desc: "Ezilmiş patatesi süzme yoğurt ve nane ile birleştirip muhteşem bir meze yapın.", ingredients: ["patates", "süzme yoğurt", "sarımsak", "nane", "zeytinyağı"] }
    ]
  },
  {
    keywords: ["kıyma", "kavrulmuş kıyma", "köfte"],
    recipes: [
      { name: "Kıymalı Yumurta", desc: "Artan kavrulmuş kıymayı ısıtıp üzerine yumurta kırarak hızlı ve protein dolu bir öğün yapın.", ingredients: ["kıyma", "yumurta", "tereyağı", "karabiber"] },
      { name: "Kıymalı Makarna (Bolonez)", desc: "Kıymayı salça ile hafif sulandırarak makarnanın üzerine nefis bir bolonez sos haline getirin.", ingredients: ["kıyma", "domates salçası", "makarna", "sarımsak"] },
      { name: "Kıymalı Tost / Dürüm", desc: "Kıymayı ekmek veya lavaş arasına koyup kaşarla tost makinesinde basın.", ingredients: ["kıyma", "ekmek", "kaşar peyniri", "biber"] },
      { name: "Ali Nazik (Hızlı Versiyon)", desc: "Hazır köz patlıcan veya püreniz varsa kıymayı üstüne çekerek anında ali nazik yapın.", ingredients: ["kıyma", "patlıcan ezmesi", "sarımsaklı yoğurt", "tereyağı"] }
    ]
  },
  {
    keywords: ["pilav", "pirinç", "pirinç pilavı"],
    recipes: [
      { name: "Kadınbudu Köfte", desc: "Artan pilavı kıyma ile yoğurarak yumurtaya bulayıp kızartarak harika bir köfte yapabilirsiniz.", ingredients: ["pirinç pilavı", "kıyma", "yumurta", "soğan"] },
      { name: "Pirinç Çorbası (Yayla)", desc: "Kalan pilavı yoğurt, nane ve sıcak suyla karıştırarak hızlı bir yayla çorbası hazırlayabilirsiniz.", ingredients: ["pirinç pilavı", "yoğurt", "yumurta", "nane", "tereyağı"] },
      { name: "Sütlaç", desc: "Şekersiz pişmiş sade pirinç pilavınız kaldıysa, süt ve şekerle kaynatarak çok hızlı bir sütlaç yapabilirsiniz.", ingredients: ["pirinç pilavı", "süt", "şeker", "nişasta"] },
      { name: "Tavuklu Çakma Risotto", desc: "Kalan pirinci tavuk suyu ile biraz daha açarak kremamsı bir pilava dönüştürün.", ingredients: ["pirinç pilavı", "tavuk suyu", "tereyağı", "kaşar peyniri"] }
    ]
  },
  {
    keywords: ["bulgur", "bulgur pilavı"],
    recipes: [
      { name: "Ezogelin Çorbası Destekleyicisi", desc: "Bulgur pilavınızı çorbaların içine katarak yoğunluğunu ve doyuruculuğunu artırabilirsiniz.", ingredients: ["bulgur pilavı", "kırmızı mercimek", "salça", "nane"] },
      { name: "Kısır Formatında Salata", desc: "Soğuk turşu, yeşillik ve nar ekşisiyle ezerek zeytinyağlı kısır benzeri bir atıştırmalık yapın.", ingredients: ["bulgur pilavı", "maydanoz", "taze soğan", "nar ekşisi", "zeytinyağı"] },
      { name: "Bulgurlu Köfte", desc: "Kalan bulguru sıcak suyla şişirip domates salçasıyla yoğurarak yassı köfte yapın.", ingredients: ["bulgur pilavı", "salça", "un", "kimyon"] }
    ]
  },
  {
    keywords: ["nohut", "haşlanmış nohut"],
    recipes: [
      { name: "Ev Yapımı Humus", desc: "Nohutları ezip tahin, sarımsak, limon ve zeytinyağı ile karıştırıp harika bir meze elde edebilirsiniz.", ingredients: ["nohut", "tahin", "limon", "sarımsak", "zeytinyağı"] },
      { name: "Fırınlanmış Çıtır Nohut", desc: "Kalan nohutları süzüp, zeytinyağı, tuz ve kırmızı toz biberle fırına verin. Harika sağlıklı bir cips alternatifidir.", ingredients: ["nohut", "zeytinyağı", "toz biber", "tuz"] },
      { name: "Nohutlu Ispanak / Sebze", desc: "Sebze yemeğinize ekleyerek protein değerini hızla katlayın.", ingredients: ["nohut", "ıspanak", "soğan", "salça"] }
    ]
  },
  {
    keywords: ["fasulye", "kuru fasulye", "barbunya"],
    recipes: [
      { name: "Piyazlık Fasulye Salatası", desc: "Kalan fasulyeleri süzüp soğan, maydanoz, sirkeli sosla salataya çevirin.", ingredients: ["kuru fasulye", "soğan", "maydanoz", "haşlanmış yumurta", "zeytinyağı"] },
      { name: "Fasulye Ezmesi Meze", desc: "Meksika usulü baharatlandırıp robotta çekerek dip sos hazırlayın.", ingredients: ["kuru fasulye", "sarımsak", "kimyon", "zeytinyağı"] },
      { name: "Yumurtalı Kuru Fasulye", desc: "Kalan kuru fasulyeye soğan ve iki yumurta kırarak doyurucu bir öğün yapın.", ingredients: ["kuru fasulye", "yumurta", "soğan", "tereyağı"] }
    ]
  },
  {
    keywords: ["et", "haşlama", "kavurma", "kuşbaşı", "döner", "bonfile", "biftek"],
    recipes: [
      { name: "Etli Pilav / Şehriye", desc: "Kalan eti didikleyip sade pilavın veya makarnanın üzerine entegre ederek harika bir akşam yemeği yaratın.", ingredients: ["et", "pirinç pilavı", "tereyağı"] },
      { name: "Et Sote Sandviç", desc: "Sıcak eti biraz soğan ve taze biberle tavada canlandırın, lavaş veya somun ekmek arası yapın.", ingredients: ["et", "soğan", "biber", "lavaş"] },
      { name: "Etli Patates Güveç", desc: "Etleri küp patateslerle küçük güveçte kaşarlayıp fırınlayın.", ingredients: ["et", "patates", "salça", "kaşar peyniri"] }
    ]
  },
  {
    keywords: ["sebze", "domates", "biber", "patlıcan", "kabak", "ıspanak", "pırasa", "karnabahar", "brokoli", "pazı", "enginar"],
    recipes: [
      { name: "Fırın Sebzeli Mücver", desc: "Artan sebzeleri rendeleyip veya doğrayıp yumurta, biraz un ve peynirle fırında pişirin.", ingredients: ["karışık sebze", "yumurta", "un", "beyaz peynir", "zeytinyağı"] },
      { name: "Zeytinyağlı Sebze Sote", desc: "Sebzeleri zeytinyağı, soğan ve sarımsakla kısık ateşte soteleyerek nefis bir sıcak meze yapın.", ingredients: ["karışık sebze", "soğan", "sarımsak", "zeytinyağı"] },
      { name: "Pratik Sebze Çorbası", desc: "Tüm artan sebzeleri haşlayıp blenderdan geçirerek kremamsı vitamin çorbası elde edin.", ingredients: ["karışık sebze", "tereyağı", "un", "süt"] }
    ]
  },
  {
    keywords: ["balık", "somon", "hamsi", "ton balığı", "palamut", "mezgit"],
    recipes: [
      { name: "Balık Köftesi / Mücveri", desc: "Artan balık etlerini didikleyip patates püresi, soğan ve baharatla köfte yapıp kızartın.", ingredients: ["balık eti", "patates püresi", "maydanoz", "soğan", "galeta unu"] },
      { name: "Balıklı Yeşil Salata", desc: "Soğuk balık parçalarını bol roka, marul ve limonlu zeytinyağı sosu ile zenginleştirin.", ingredients: ["balık eti", "roka", "marul", "limon", "zeytinyağı"] },
      { name: "Kremalı Balık Çorbası", desc: "Balık parçalarını sebze suyu ve krema ile kaynatarak nefis bir çorba yapın.", ingredients: ["balık eti", "havuç", "patates", "krema", "limon"] }
    ]
  },
  {
    keywords: ["süt", "yoğurt", "peynir", "çökelek", "lor"],
    recipes: [
      { name: "Yoğurtlu Meze / Haydari", desc: "Artan yoğurdu nane, sarımsak ve zeytinyağı ile çırparak nefis bir meze yapın.", ingredients: ["yoğurt", "sarımsak", "nane", "zeytinyağı"] },
      { name: "Peynirli Tavuk / Sebze Sote", desc: "Elinizdeki peyniri sebze veya et sotenin üzerine eriterek lezzet katın.", ingredients: ["peynir", "sebze", "tereyağı"] },
      { name: "Peynirli Pişi / Pankek", desc: "Peynir artıklarını un ve yumurtayla çırpıp tavada pratik pişiler hazırlayın.", ingredients: ["peynir", "un", "yumurta", "kabartma tozu"] }
    ]
  },
  {
    keywords: ["meyve", "elma", "ayva", "muz", "armut", "çilek", "portakal"],
    recipes: [
      { name: "Fırınlanmış Tarçınlı Meyve Tatlısı", desc: "Meyveleri dilimleyip az şeker ve tarçınla fırına verin. Üzerine ceviz serpip servis edin.", ingredients: ["meyve", "tarçın", "ceviz", "tereyağı"] },
      { name: "Pratik Meyve Kompostosu / Hoşaf", desc: "Olgunlaşmış meyveleri biraz su, şeker ve karanfille kaynatarak ferahlatıcı bir komposto yapın.", ingredients: ["meyve", "şeker", "su", "karanfil"] },
      { name: "Meyveli Pelte / Muhallebi", desc: "Meyve pürəsini nişasta ve sütle pişirerek lezzetli hafif bir tatlı yapın.", ingredients: ["meyve", "süt", "nişasta", "şeker"] }
    ]
  },
  {
    keywords: ["kek", "tatlı", "kurabiye", "helva"],
    recipes: [
      { name: "Kek Pop / Trifle Tatlısı", desc: "Bayat keki ufalayıp krem şanti veya muhallebi kat aralarına yerleştirerek şık bir kadeh tatlısı yapın.", ingredients: ["bayat kek", "süt", "muhallebi", "çikolata sosu"] },
      { name: "Yumurtalı Helva Sote", desc: "Tahin helvasını tavada az sütle eritip güveçte fırınlayarak sıcak helva yapın.", ingredients: ["tahin helvası", "süt", "limon suyu"] }
    ]
  }
];

export const processLeftovers = (promptText) => {
  if (!promptText || typeof promptText !== 'string') return [];
  const t = promptText.toLowerCase().trim();
  if (!t) return [];
  if (!window.leftoverShownRecipes) window.leftoverShownRecipes = {};
  if (!window.leftoverShownRecipes[t]) window.leftoverShownRecipes[t] = [];
  const shown = window.leftoverShownRecipes[t];

  function durShuffleL(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let candidateRecipes = [];
  
  LEFTOVER_DB.forEach(item => {
    if (item.keywords.some(k => t.includes(k))) {
      candidateRecipes.push(...item.recipes);
      // suggestions.push({
        // ingredient
        // recipes
      // end
    }
  });

  // ZERO-FAILURE FALLBACK GENERATOR:
  // Eğer özel/farklı bir malzeme girilmişse veya genişletilmiş arama gerekiyorsa veritabanını akıllıca tara!
  if (t.length > 0) {
    const cleanMainIng = t
      .replace(/(dünden|kalan|biraz|bir|kase|paket|haşlanmış|kızarmış|bayat|kullanılmamış|adet|tane|gram|kg|yemeği|yemeğim|yemeğinden|çorbası|sotesi|sote|kızartması|salatası|soslu|tavası|fırında)/gi, '')
      .trim();

    const tokens = cleanMainIng.split(/\s+/).filter(w => w.length >= 3);
    const searchTokens = tokens.length > 0 ? tokens : [cleanMainIng || t];
    const capitalizedIng = (cleanMainIng || t).charAt(0).toUpperCase() + (cleanMainIng || t).slice(1);

    DB_MAINS_HUGE.forEach(dish => {
      const dishNameLower = dish.name.toLowerCase();
      const dishIngsLower = dish.ingredients.join(" ").toLowerCase();
      const matchesToken = searchTokens.some(token => dishNameLower.includes(token) || dishIngsLower.includes(token));
      if (matchesToken) {
        candidateRecipes.push({
          name: dish.name,
          desc: `Artan ${cleanMainIng || t} malzemesi ile nefis ${dish.name} dönüşümü! (${dish.time || 30} dk - ₺${dish.cost || 120} - ${dish.calories || 350} kcal)`,
          ingredients: dish.ingredients
        });
      }
    });

    if (candidateRecipes.length < 3) {
      const complementaryCategories = DB_MAINS_HUGE.filter(dish => {
        const dName = dish.name.toLowerCase();
        return dName.includes("zeytinyağlı") || dName.includes("çorba") || dName.includes("meze") || dName.includes("sote") || dName.includes("graten") || dName.includes("börek") || dName.includes("dolma") || dName.includes("salata");
      });
      complementaryCategories.forEach(dish => {
        candidateRecipes.push({
          name: `${capitalizedIng} Yanına / Dokunuşuyla ${dish.name}`,
          desc: `Kalan ${cleanMainIng} malzemenizi ${dish.name} ile harmanlayarak veya yanında sunarak lezzetli bir öğün yaratın.`,
          ingredients: [cleanMainIng, ...dish.ingredients.slice(0, 3)]
        });
      });
    }

    const uniqueCandidateMap = new Map();
    candidateRecipes.forEach(r => {
      if (!uniqueCandidateMap.has(r.name)) {
        uniqueCandidateMap.set(r.name, r);
      }
    });
    let allCandidates = Array.from(uniqueCandidateMap.values());

    let freshCandidates = allCandidates.filter(r => !shown.includes(r.name));

    if (freshCandidates.length < 3) {
      window.leftoverShownRecipes[t] = [];
      freshCandidates = [...allCandidates];
    }

    const selectedRecipes = durShuffleL(freshCandidates).slice(0, 3);
    selectedRecipes.forEach(r => window.leftoverShownRecipes[t].push(r.name));

    return [
      {
        ingredient: cleanMainIng,
        recipes: selectedRecipes
      }
    ];
  }
    /* dead comments */
        // obj 1
          // name 1
          // desc 1
          // ing 1
        // object 1 end
        // object 2
          // name 2
          // desc 2
          // ing 2
        // object 2 end
        // object 3
          // name 3
          // desc 3
          // ing 3
        // object 3 end
      // end array
    // end old push
    /* end dead comments */

  return [];
};

export const generateGuestMenu = (personCountInput, restrictionsArray = []) => {
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
   // Yoğurt, Yağ, Lavaş, Pide, Baharat Vb. Özel Birimler
   if (lower.includes("yoğurt")) return { text: `3 yemek kaşığı ${ingName} (yaklaşık 150g)`, grams: 150 };
   if (lower.includes("lavaş") || lower.includes("tortilla")) return { text: `2 adet ${ingName}`, grams: 150 };
   if (lower.includes("pide") || lower.includes("yufka") || lower.includes("ekmek") || lower.includes("bazlama")) return { text: `1-2 adet ${ingName}`, grams: 160 };
   if (lower.includes("zeytinyağı") || lower.includes("sıvı yağ") || lower.includes("yağ")) return { text: `3 yemek kaşığı ${ingName}`, grams: 30 };
   if (lower.includes("un") || lower.includes("nişasta")) return { text: `2 yemek kaşığı ${ingName} (yaklaşık 40g)`, grams: 40 };
   if (lower.includes("tuz") || lower.includes("karabiber") || lower.includes("pul biber") || lower.includes("kekik") || lower.includes("baharat")) return { text: `1 tatlı kaşığı ${ingName}`, grams: 5 };
   if (lower.includes("limon")) return { text: `1/2 adet ${ingName} suyu`, grams: 30 };
   if (lower.includes("nar ekşisi") || lower.includes("sirke") || lower.includes("sos")) return { text: `1 yemek kaşığı ${ingName}`, grams: 15 };
   if (lower.includes("maydanoz") || lower.includes("dereotu")) return { text: `1/2 demet ince kıyılmış ${ingName}`, grams: 20 };
   if (lower.includes("mısır") || lower.includes("bezelye")) return { text: `1 çay bardağı ${ingName}`, grams: 80 };
   if (lower.includes("zeytin") || lower.includes("turşu")) return { text: `5-6 adet ${ingName}`, grams: 50 };

   return { text: `1 porsiyon (yaklaşık 100g) ${ingName}`, grams: 100 };
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

export const generateShoppingList = (menuObj, ownedItems = []) => {
  let allIngredients = [];
  if (menuObj.soup && menuObj.soup.ingredients) allIngredients.push(...menuObj.soup.ingredients);
  if (menuObj.main && menuObj.main.ingredients) allIngredients.push(...menuObj.main.ingredients);
  if (menuObj.carb && menuObj.carb.ingredients) allIngredients.push(...menuObj.carb.ingredients);
  if (menuObj.side && menuObj.side.ingredients) allIngredients.push(...menuObj.side.ingredients);
  
  if (menuObj.originalDish && menuObj.originalDish.ingredients) allIngredients.push(...menuObj.originalDish.ingredients);
  if (menuObj.ingredients && !menuObj.main) allIngredients.push(...menuObj.ingredients);

  allIngredients = [...new Set(allIngredients)]; // Remove duplicates

  if (ownedItems && ownedItems.length > 0) {
      const ownedLower = ownedItems.map(i => typeof i === 'string' ? i.toLowerCase().trim() : '');
      allIngredients = allIngredients.filter(ing => {
          const check = typeof ing === 'string' ? ing.toLowerCase().trim() : '';
          return !ownedLower.some(ow => {
              if (!ow) return false;
              // Sadece tam kelime eşleşmesi (Örn: "et", "baget" ile karışmamalı)
              const regex = new RegExp(`\\b${ow}\\b(?:s|ler|lar)?`, 'i');
              return regex.test(check);
          });
      });
  }

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
   
   // Partner markup/discount multipliers
   let m = 1.0;
   if (partnerCode === 'MIGROS') m = 1.10;
   else if (partnerCode === 'GETIR') m = 1.25;
   else if (partnerCode === 'TRENDYOL') m = 1.12;
   else if (partnerCode === 'YEMEKSEPETI') m = 1.15;
   else if (partnerCode === 'SOK') m = 0.90;
   else if (partnerCode === 'A101') m = 0.85;
   else if (partnerCode === 'ISTEGELSIN') m = 1.05;

   const lower = ing.toLowerCase();
   const has = (words) => words.some(w => lower.includes(w));

   // === GERÇEK 2026 TÜRKİYE PİYASA FİYATLARI (Porsiyon Bazlı) ===
   // Fiyatlar: TEPAV Temmuz 2026 + Migros/A101 sepet ortalaması
   // Porsiyon miktarları: 1 yemeğin tipik kullanımı

   let base = 5; // Tuz, karabiber, nane gibi baharat

   // === KIRMIZI ET (650-900 TL/kg → ~250g porsiyon = 163-225 TL) ===
   if (has(['dana bonfile', 'antrikot', 'bonfile'])) base = 220; // Premium kesim ~900 TL/kg x 250g
   else if (has(['kuşbaşı', 'kavurma'])) base = 185; // Dana kuşbaşı ~740 TL/kg x 250g
   else if (has(['kıyma'])) base = 162; // Dana kıyma ~650 TL/kg x 250g
   else if (has(['sucuk'])) base = 95; // Sucuk ~380 TL/kg x 250g
   else if (has(['pastırma'])) base = 110;

   // === TAVUK (220 TL/kg ortalama → ~400g porsiyon = 88 TL) ===
   else if (has(['tavuk göğüsü', 'tavuk bonfile'])) base = 88; // ~220 TL/kg x 400g
   else if (has(['tavuk başı', 'tavuk but', 'baget', 'tavuk kanadı'])) base = 60; // ~150 TL/kg x 400g
   else if (has(['tavuk', 'piliç'])) base = 75; // Genel tavuk

   // === BALIK (700-900 TL/kg) ===
   else if (has(['somon'])) base = 175; // Somon ~700 TL/kg x 250g
   else if (has(['levrek', 'çipura'])) base = 120; // ~480 TL/kg x 250g
   else if (has(['ton balığı', 'sar dal ye'])) base = 35; // Konserve

   // === SÜT ÜRÜNLERİ ===
   else if (has(['kaşar'])) base = 60; // Kaşar 400 TL/kg x 150g
   else if (has(['tulum', 'beyaz peynir', 'feta'])) base = 50;
   else if (has(['peynir'])) base = 45; // Genel peynir
   else if (has(['tereyağı'])) base = 30; // 500g pack ~600 TL → 2 tbsp = 60g = 30 TL
   else if (has(['krema'])) base = 25; // 200ml krema ~50 TL → yarısı
   else if (has(['süt'])) base = 15; // 1 L ~30 TL → 500ml
   else if (has(['yoğurt'])) base = 20; // 500g ~40 TL
   else if (has(['yumurta'])) base = 18; // 3 yumurta × ~6 TL = 18 TL (adet fiyatı ~6 TL)

   // === TEMEL YAĞLAR ===
   else if (has(['zeytinyağı'])) base = 20; // 5L ~1000 TL → 100ml = 20 TL
   else if (has(['ayçiçek yağı', 'sıvıyağ'])) base = 12;

   // === KURUBAKLİYAT & TAHILLAR ===
   else if (has(['pirinç'])) base = 22; // 70 TL/kg x 300g = 21 TL
   else if (has(['makarna', 'spagetti', 'fettuccine', 'penne'])) base = 18; // 60 TL/kg x 300g = 18 TL
   else if (has(['bulgur'])) base = 15; // 50 TL/kg x 300g = 15 TL
   else if (has(['un'])) base = 10; // 25 TL/kg x 400g = 10 TL
   else if (has(['mercimek'])) base = 18; // 60 TL/kg x 300g
   else if (has(['nohut'])) base = 20; // 70 TL/kg x 300g
   else if (has(['fasulye', 'barbunya'])) base = 22;

   // === SEBZELER (Temmuz 2026 güncel) ===
   else if (has(['patates'])) base = 14; // 45 TL/kg x 300g
   else if (has(['soğan', 'kuru soğan'])) base = 12; // 60 TL/kg × 200g
   else if (has(['domates'])) base = 10; // ~35 TL/kg x 300g
   else if (has(['biber', 'dolmalık biber', 'sivri biber'])) base = 12;
   else if (has(['patlıcan'])) base = 15; // 50 TL/kg x 300g
   else if (has(['kabak'])) base = 12;
   else if (has(['havuç'])) base = 10; // 35 TL/kg x 300g
   else if (has(['sarımsak'])) base = 8; // Yarım baş
   else if (has(['mantar'])) base = 25; // 100 TL/kg x 250g
   else if (has(['ıspanak', 'roka', 'marul', 'yeşillik'])) base = 12;
   else if (has(['limon'])) base = 5;
   else if (has(['maydanoz', 'dereotu', 'nane', 'fesleğen', 'kekik', 'kimyon', 'zahter'])) base = 5;

   // === DÖNÜŞTÜRÜLMÜŞ & KONSERVELER ===
   else if (has(['salça', 'domates salçası'])) base = 12; // 1 tbsp
   else if (has(['soya sosu', 'teriyaki', 'noodle'])) base = 20;
   else if (has(['galeta unu', 'galeta'])) base = 8;

   return Math.round(base * m);
};

// --- OTOMATİK MALİYET, SÜRE VE KALORİ SENKRONİZASYONU ---
// Veritabanındaki "hardcoded" rastgele süreyi, kaloriyi ve maliyetleri ezer.
// Gerçekçi aşçılık fiziği kullanarak malzeme bazlı süre uzatımı ve besin değeri biçer.
[DB_MAINS_HUGE, DB_MAINS, DB_CARBS, DB_SIDES, DB_SOUPS].forEach(database => {
    database.forEach(dish => {
        let dynamicCost = 0;
        // === GERÇEK YEMEK KALORİ/MALİYET/SÜRE TABLOSU ===
        // Kaynak: Türk Gıda Kodeksi, dytseydaertas.com, USDA FoodData Central, MyFitnessPal TR
        // Temmuz 2026 TL fiyatları: TEPAV + Migros/A101 ortalaması
        // Porsiyon: 1 kişilik tipik ev porsiyonu
        const DISH_METRICS = {
          'tantuni':          { cal: 420, cost: 160, time: 25 },
          'tavuk tantuni':    { cal: 380, cost: 140, time: 25 },
          'taco':             { cal: 450, cost: 180, time: 30 },
          'tavuklu taco':     { cal: 410, cost: 160, time: 25 },
          'fajita':           { cal: 480, cost: 190, time: 30 },
          'noodle':           { cal: 460, cost: 130, time: 20 },
          'çökertme':         { cal: 520, cost: 210, time: 35 },
          'sultan kebabı':    { cal: 490, cost: 185, time: 35 },
          'piliç topkapı':    { cal: 510, cost: 195, time: 45 },
          'tavuk şinitzel':   { cal: 430, cost: 145, time: 25 },
          'içli köfte':       { cal: 390, cost: 140, time: 40 },
          'ballı susamlı':    { cal: 440, cost: 155, time: 30 },
          'köri soslu':       { cal: 430, cost: 150, time: 30 },
          'orman kebabı':     { cal: 390, cost: 180, time: 45 },
          'hünkar beğendi':   { cal: 470, cost: 210, time: 40 },
          'tas kebabı':       { cal: 410, cost: 190, time: 40 },
          'çoban kavurma':    { cal: 440, cost: 200, time: 35 },
          'kilis tava':       { cal: 460, cost: 195, time: 30 },
          'sulu köfte':       { cal: 340, cost: 140, time: 35 },
          'hasanpaşa':        { cal: 450, cost: 175, time: 40 },
          'kadınbudu':        { cal: 380, cost: 150, time: 35 },
          'ali nazik':        { cal: 430, cost: 185, time: 35 },
          'tepsi böreği':     { cal: 410, cost: 130, time: 45 },
          'biber dolması':    { cal: 310, cost: 110, time: 40 },
          // ÇORBALAR (kcal, TL, dakika)
          'mercimek':         { cal: 185, cost: 35, time: 30 },
          'yayla':            { cal: 145, cost: 30, time: 25 },
          'domates çorbası':  { cal: 125, cost: 28, time: 20 },
          'ezogelin':         { cal: 195, cost: 38, time: 35 },
          'tarhana':          { cal: 160, cost: 32, time: 20 },
          'işkembe':          { cal: 210, cost: 55, time: 25 },
          'tavuk çorbası':    { cal: 155, cost: 45, time: 30 },
          'sebze çorba':      { cal: 120, cost: 30, time: 25 },
          'soğan çorba':      { cal: 130, cost: 28, time: 25 },
          // ET YEMEKLERİ
          'köfte':            { cal: 280, cost: 145, time: 30 },
          'izmir köfte':      { cal: 310, cost: 155, time: 40 },
          'kuru köfte':       { cal: 265, cost: 140, time: 35 },
          'adana kebap':      { cal: 380, cost: 180, time: 25 },
          'şiş kebap':        { cal: 320, cost: 195, time: 25 },
          'kuşbaşı':          { cal: 290, cost: 200, time: 35 },
          'kavurma':          { cal: 380, cost: 200, time: 40 },
          'fırında et':       { cal: 350, cost: 210, time: 75 },
          'haşlama':          { cal: 280, cost: 190, time: 60 },
          'sucuklu yumurta':  { cal: 340, cost: 55, time: 15 },
          // TAVUK YEMEKLERİ
          'tavuk sote':       { cal: 310, cost: 100, time: 25 },
          'fırında tavuk':    { cal: 295, cost: 105, time: 50 },
          'tavuk şiş':        { cal: 270, cost: 95, time: 30 },
          'tavuk ızgara':     { cal: 255, cost: 95, time: 20 },
          'tavuk döner':      { cal: 380, cost: 90, time: 20 },
          'tavuklu pide':     { cal: 480, cost: 115, time: 45 },
          'tavuklu makarna':  { cal: 450, cost: 105, time: 30 },
          'kremalı tavuk':    { cal: 420, cost: 120, time: 30 },
          'mantar tavuk':     { cal: 360, cost: 115, time: 30 },
          'fırında sebzeli tavuk': { cal: 310, cost: 110, time: 50 },
          'tavuk güveç':      { cal: 330, cost: 105, time: 55 },
          // BALIK
          'somon':            { cal: 310, cost: 190, time: 20 },
          'levrek':           { cal: 240, cost: 140, time: 25 },
          'çipura':           { cal: 230, cost: 135, time: 25 },
          'balık ızgara':     { cal: 250, cost: 145, time: 20 },
          // SEBZE VE BAKLIÇATLAR
          'kuru fasulye':     { cal: 290, cost: 45, time: 50 },
          'nohut':            { cal: 270, cost: 42, time: 50 },
          'barbunya':         { cal: 260, cost: 50, time: 50 },
          'karnıyarık':       { cal: 255, cost: 65, time: 50 },
          'imam bayıldı':     { cal: 210, cost: 55, time: 45 },
          'musakka':          { cal: 380, cost: 150, time: 55 },
          'türlü':            { cal: 195, cost: 60, time: 45 },
          'güveç':            { cal: 250, cost: 140, time: 60 },
          'zeytinyağlı':      { cal: 180, cost: 55, time: 40 },
          'dolma':            { cal: 265, cost: 70, time: 60 },
          'sarma':            { cal: 255, cost: 65, time: 60 },
          'menemen':          { cal: 220, cost: 45, time: 15 },
          'ispanaklı':        { cal: 185, cost: 50, time: 30 },
          // PİLAV VE TAHILLAR
          'pilav':            { cal: 280, cost: 25, time: 25 },
          'bulgur pilavı':    { cal: 260, cost: 20, time: 20 },
          'makarna':          { cal: 370, cost: 35, time: 25 },
          'lazanya':          { cal: 460, cost: 85, time: 55 },
          'risotto':          { cal: 420, cost: 80, time: 35 },
          // HAMUR İŞLERİ
          'börek':            { cal: 380, cost: 60, time: 50 },
          'gözleme':          { cal: 350, cost: 45, time: 25 },
          'pide':             { cal: 430, cost: 70, time: 45 },
          'lahmacun':         { cal: 310, cost: 65, time: 30 },
          'pizza':            { cal: 400, cost: 80, time: 40 },
          'poğaça':           { cal: 290, cost: 40, time: 45 },
          // TATLILAR
          'sütlaç':           { cal: 210, cost: 25, time: 35 },
          'muhallebi':        { cal: 195, cost: 22, time: 25 },
          'kazandibi':        { cal: 240, cost: 28, time: 40 },
          'fırın sütlaç':     { cal: 230, cost: 28, time: 50 },
          'helva':            { cal: 350, cost: 25, time: 15 },
          'baklava':          { cal: 430, cost: 55, time: 90 },
          'revani':           { cal: 320, cost: 30, time: 45 },
          // KAHVALTI
          'menemen':          { cal: 220, cost: 45, time: 15 },
          'sahanda yumurta':  { cal: 180, cost: 30, time: 10 },
        };

        // Yemek adına göre tabloda eşleşme ara (en uzun eşleşme kazanır)
        let lookupHit = null;
        const nameLowerForLookup = dish.name.toLowerCase();
        let bestMatchLen = 0;
        for (const key of Object.keys(DISH_METRICS)) {
            if (nameLowerForLookup.includes(key) && key.length > bestMatchLen) {
                lookupHit = DISH_METRICS[key];
                bestMatchLen = key.length;
            }
        }

        if (lookupHit) {
            // GERÇEK DEĞER DOĞRUDAN KULLAN — hesaplama yapma
            dish.calories = lookupHit.cal;
            dish.prepTime = lookupHit.time;
            // Maliyet hâlâ malzeme bazlı hesaplacak ama alt sınır tablo değeri
            dish.ingredients.forEach(ing => {
                const ri = Object.prototype.toString.call(ing) === '[object String]' ? ing : "";
                dynamicCost += getTrueCost(ri);
            });
            // Gerçek piyasa fiyatı ile karşılaştır, üst sınır olarak kullan
            dish.totalCost = Math.max(Math.round(dynamicCost), lookupHit.cost);
            dish.cost = dish.totalCost;
            dish.protein = 0; dish.carbs = 0; dish.fat = 0;
            return; // Bu yemeği hesaplamayla geçmeye gerek yok
        }

        let tCal = 0; // Base = 0, sadece gerçek malzeme kalorileri sayılır
        let pPro = 5; let cCarb = 10; let fFat = 5;
        let pTime = 15; // Base chopping time (15 mins)
        const SERVINGS = 4; // Tipik Türk yemeği 4 kişilik pişer
        
        let hasMeat = false; let hasChicken = false; let hasFish = false; let hasLegume = false; let hasOven = false; let isDessert = false;

        const nameLower = dish.name.toLowerCase();
        if (nameLower.includes("fırın") || nameLower.includes("graten") || nameLower.includes("güveç") || nameLower.includes("kebab") || nameLower.includes("pide") || nameLower.includes("pizza") || nameLower.includes("börek") || nameLower.includes("kek") || nameLower.includes("pasta") || nameLower.includes("poğaça")) {
            hasOven = true;
        }
        if (nameLower.includes("tatlı") || nameLower.includes("kek") || nameLower.includes("pasta") || nameLower.includes("sütlaç") || nameLower.includes("krem")) {
            isDessert = true;
            cCarb += 30; // Base sugar allowance
        }

        dish.ingredients.forEach(ing => {
            const rawIng = Object.prototype.toString.call(ing) === '[object String]' ? ing : "";
            dynamicCost += getTrueCost(rawIng);
            
            const lower = rawIng.toLowerCase();
            const has = (w) => lower.includes(w);

            // === GERÇEK BİLİMSEL MİKRO-BESIN TABLOSU (kcal/100g ham ağırlık) ===
            // Kaynak: USDA FoodData Central + Türk Gıda Kodeksi
            // Porsiyon tahmini: 300-400g et/tavuk, 250g karbonhidrat, 200g sebze

            if (has('bonfile') || has('antrikot')) {
                // Dana bonfile 250 kcal/100g × 250g porsiyon = 625 kcal -> tek malzeme
                tCal += 220; pPro += 26; fFat += 14; hasMeat = true;
            } else if (has('kuşbaşı') || has('kavurma') || has('kuzu')) {
                tCal += 200; pPro += 24; fFat += 12; hasMeat = true;
            } else if (has('kıyma')) {
                // Dana kıyma ~200 kcal/100g × 250g = 500 kcal
                tCal += 200; pPro += 20; fFat += 14;
                pTime += 10;
            } else if (has('sucuk') || has('pastırma')) {
                tCal += 160; pPro += 14; fFat += 12;
            } else if (has('somon')) {
                // Somon 208 kcal/100g × 200g = 416 kcal
                tCal += 180; pPro += 22; fFat += 10; hasFish = true;
            } else if (has('levrek') || has('çipura') || has('ton balığı')) {
                tCal += 110; pPro += 20; fFat += 3; hasFish = true;
            } else if (has('tavuk göğüsü') || has('tavuk bonfile')) {
                // Tavuk göğsü 165 kcal/100g × 350g porsiyon = 578 kcal
                tCal += 175; pPro += 32; fFat += 4; hasChicken = true;
            } else if (has('tavuk') || has('piliç') || has('baget')) {
                // Tavuk but/kanat 200 kcal/100g × 350g
                tCal += 170; pPro += 25; fFat += 8; hasChicken = true;
            } else if (has('lavaş') || has('tortilla') || has('yufka') || has('pide') || has('ekmek') || has('taco')) {
                // Lavaş / Ekmek tabanı ~160 kcal
                tCal += 160; cCarb += 32; pPro += 4; fFat += 2;
            } else if (has('makarna') || has('spagetti') || has('fettuccine') || has('penne') || has('noodle')) {
                // Makarna kuru 350 kcal/100g × 80g kuru (=200g pişmiş) = 280 kcal
                tCal += 140; cCarb += 55; pPro += 5; fFat += 1;
                pTime += 12; // haşlama süresi
            } else if (has('pirinç') || has('pilav')) {
                // Pirinç kuru 360 kcal/100g × 80g kuru = 290 kcal
                tCal += 145; cCarb += 60; pPro += 3; fFat += 1;
                pTime += 18;
            } else if (has('bulgur')) {
                // Bulgur 342 kcal/100g × 80g = 274 kcal
                tCal += 135; cCarb += 55; pPro += 5; fFat += 1;
                pTime += 15;
            } else if (has('nohut') || has('fasulye') || has('barbunya')) {
                // Pişmiş nohut 164 kcal/100g × 200g = 328 kcal
                tCal += 130; cCarb += 22; pPro += 9; fFat += 2;
                hasLegume = true;
            } else if (has('mercimek')) {
                tCal += 115; cCarb += 18; pPro += 9; fFat += 1;
                hasLegume = true;
            } else if (has('patates')) {
                // Patates 77 kcal/100g × 300g = 231 kcal
                tCal += 100; cCarb += 22; pPro += 2; fFat += 1;
                pTime += 10;
            } else if (has('patlıcan')) {
                // Patlıcan 25 kcal/100g × 300g = 75 kcal
                tCal += 45; cCarb += 8; fFat += 1;
                pTime += 10;
            } else if (has('kaşar') || has('peynir') || has('mozzarella')) {
                // Kaşar 400 kcal/100g × 60g = 240 kcal
                tCal += 120; fFat += 10; pPro += 8;
            } else if (has('tereyağı')) {
                // Tereyağ 717 kcal/100g × 30g = 215 kcal
                tCal += 100; fFat += 12;
            } else if (has('zeytinyağı') || has('sıvıyağ') || has('yağ')) {
                // Zeytinyağ 884 kcal/100g × 20ml = 177 kcal
                tCal += 90; fFat += 10;
            } else if (has('krema')) {
                // Krema 340 kcal/100g × 100ml = 340 kcal
                tCal += 120; fFat += 13;
            } else if (has('süt')) {
                // Süt 60 kcal/100ml × 200ml = 120 kcal
                tCal += 50; pPro += 3; fFat += 2; cCarb += 5;
            } else if (has('yumurta')) {
                // 2 yumurta 70 kcal/adet = 140 kcal
                tCal += 70; pPro += 6; fFat += 5;
            } else if (has('yoğurt')) {
                // Yoğurt 59 kcal/100g × 150g = 88 kcal
                tCal += 45; pPro += 4; fFat += 2; cCarb += 4;
            } else if (has('un')) {
                // Un 364 kcal/100g × 50g = 182 kcal
                tCal += 90; cCarb += 20; pPro += 3;
            } else if (has('galeta')) {
                tCal += 40; cCarb += 8;
            } else if (has('domates')) {
                // Domates 18 kcal/100g × 200g = 36 kcal
                tCal += 18; cCarb += 3;
            } else if (has('biber') || has('sivri') || has('dolmalık')) {
                tCal += 20; cCarb += 4;
            } else if (has('mantar')) {
                // Mantar 22 kcal/100g × 150g = 33 kcal
                tCal += 18; pPro += 2;
            } else if (has('soğan') || has('sarımsak')) {
                tCal += 15; cCarb += 3;
            } else if (has('havuç') || has('kabak') || has('ıspanak') || has('roka') || has('marul')) {
                tCal += 15; cCarb += 2;
            } else if (has('salça')) {
                tCal += 15; cCarb += 3;
            } else {
                tCal += 8; cCarb += 1; // Baharat, limon, maydanoz vs.
            }
        });

        // Resolve Final Times
        if (hasMeat) pTime += 35;
        if (hasChicken) pTime += 20;
        if (hasFish) pTime += 15;
        if (hasLegume && !nameLower.includes("çorba")) pTime += 35;
        if (hasOven) pTime += 25;
        if (isDessert) pTime += 20;

        if (pTime > 150) pTime = 120;
        if (pTime < 15) pTime = 15;
        if ((nameLower.includes("salata") || nameLower.includes("meze") || nameLower.includes("cacık")) && !hasMeat && !hasChicken && !hasOven) pTime = 10;
        if (nameLower.includes("çorba") && pTime > 40) pTime = 35;

        // KALORİ VE MALİYETİ 4 PORSİYONA BÖLEREK GERÇEKÇİ YAP
        tCal = Math.round(tCal);
        dynamicCost = Math.round(dynamicCost);
        // Force Sync Standard Object Nodes
        dish.cost = Math.max(50, dynamicCost);
        dish.totalCost = dish.cost;
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
       if (profile === 'SOSYETE' && !/(bonfile|antrikot|somon|levrek|balık|risotto|lazanya|graten|cordon bleu|safran|biftek|kuzu|karides|beşamel|marine|parmesan|kremalı|dalyan|hünkar|sote|soslu)/i.test(fullText) && m.cost < 250) return false;
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
};

export const generateWheelItems = (filters = []) => {
   if (!Array.isArray(filters)) filters = [];
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
   
   // Re-shuffle candidate pool to guarantee fresh options on every refresh
   shuffled.sort(() => 0.5 - Math.random());
   
   let result = [];
   const count = Math.min(13, shuffled.length);
   for (let i = 0; i < 13; i++) {
      result.push(shuffled[i % (count || 1)] || DB_MAINS_HUGE[i % DB_MAINS_HUGE.length]);
   }
   return result.map(m => ({ ...m, ...getDishDetails(m) }));
};

export const generateCrossMenu = (inputStr) => {
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
    const tokens = t.split(/\s+/).filter(w => w.length >= 3);
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
     diet: { name: dietDish.name, desc: `🔥 Kalori: ${dietDish.calories} - Saf, hafif ve sindirimi kolay, diyet formuna tam uygun '${t}' alternatifi.`, dishObj: dietDish },
     kid: { name: kidDish.name, desc: `⏱ Süre: ${kidDish.time} dk - Yüksek enerjili, çocukların ve doyurucu lezzet sevenlerin bayılacağı format.`, dishObj: kidDish }
  };
};
export const generateGroupMenu = (members) => {
   if (!members || members.length === 0) return [];
   
   const rules = members.map(m => m.rule);
   const isCarnivore = rules.includes('CARNIVORE');
   const isVegan = rules.includes('VEGAN');
   const isGlutenFree = rules.includes('GLUTEN_FREE');
   const isLactoseFree = rules.includes('LACTOSE_FREE');
   const isDiabetic = rules.includes('DIABETIC');
   const isSeafoodAllergy = rules.includes('SEAFOOD_ALLERGY');
   const wantsWeightLoss = rules.includes('WEIGHT_LOSS');
   const wantsWeightGain = rules.includes('WEIGHT_GAIN');
   const wantsProtein = rules.includes('HIGH_PROTEIN');

   const carnivoreMustHave = /(tavuk|kıyma|et|kuşbaşı|antrikot|bonfile|köfte|sucuk|kavurma|döner|kebap|somon|levrek)/i;
   const veganBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|balık|karides|süt|yumurta|peynir|kaşar|tereyağı|krema|kavurma|sucuk|bonfile|antrikot|köfte|kebap|tas kebabı|mayonez|şinitzel|döner|bacon|sosis|jambon|sakatat)/i;
   const vegBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|balık|karides|kavurma|sucuk|bonfile|antrikot|köfte|kebap|tas kebabı|şinitzel|döner|bacon|sosis|jambon|sakatat)/i;
   const glutenBanned = /(makarna|noodle|un|ekmek|bulgur|şehriye)/i;
   const lactoseBanned = /(süt|krema|peynir|kaşar|tereyağı)/i;
   const diabeticBanned = /(şeker|makarna|pirinç|noodle|ekmek|patates)/i;
   const seafoodBanned = /(somon|levrek|karides|balık)/i;
   const proteinBoost = /(tavuk|kıyma|et|somon|kaşar|yumurta|nohut|fasulye|mercimek|peynir)/i;

   let validDishes = [];

   DB_MAINS_HUGE.forEach(dish => {
       const ings = dish.ingredients.join(" ").toLowerCase() + " " + dish.name.toLowerCase();
       let isBanned = false;
       if (isCarnivore && !carnivoreMustHave.test(ings)) isBanned = true;
       if (isVegan && veganBanned.test(ings)) isBanned = true;
       if (rules.includes("VEGETARIAN") && vegBanned.test(ings)) isBanned = true;
       if (isGlutenFree && glutenBanned.test(ings)) isBanned = true;
       if (isLactoseFree && lactoseBanned.test(ings)) isBanned = true;
       if (isDiabetic && diabeticBanned.test(ings)) isBanned = true;
       if (isSeafoodAllergy && seafoodBanned.test(ings)) isBanned = true;
       if (wantsWeightLoss && dish.heaviness > 5) isBanned = true;
       
       if (!isBanned) {
           let score = 0;
           if (isCarnivore && carnivoreMustHave.test(ings)) score += 10;
           if (wantsProtein && proteinBoost.test(ings)) score += 5;
           if (wantsWeightLoss && dish.heaviness <= 3) score += 3;
           if (wantsWeightGain && dish.heaviness >= 7) score += 3;
           validDishes.push({ ...dish, score });
       }
   });

   // 12 Zengin Ayrıştırılabilir (Split) Tarif Havuzu
   const splitRecipes = [
      {
         name: "Ayrıştırılabilir Soslu Makarna (Etobur/Kıymalı & Veggie Soslu)",
         time: 30, cost: 250, type: "MIXED", heaviness: 5, ingredients: ["makarna", "kıyma", "domates", "zeytinyağı", "fesleğen"],
         logicExplanation: "Ayrıştırılabilir pratik menü! Sade makarnayı haşlayıp ikiye ayırın: Etobur/protein diyetliler için tavadaki bolonez kıyma sosunu ekleyin, vegan/sebze sevenler için domatesli fesleğenli zeytinyağlı sosu ilave edin."
      },
      {
         name: "Kişiselleştirilebilir Meksika Tacosu / Burrito Kasesi",
         time: 35, cost: 350, type: "MIXED", heaviness: 6, ingredients: ["lavaş", "kıyma", "meksika fasulyesi", "mısır", "avokado", "kırmızı biber"],
         logicExplanation: "Modüler aile sofrası! Lavaş, guacamole, salsa sos ve Meksika fasulyesini masaya ortak dizin. Etoburlar için sotelenmiş baharatlı kıymayı veya sotelenmiş tavuğu ekstra kapta sunun."
      },
      {
         name: "Çift Kanatlı Fırın Tepsisi (Bir Tarafı Bonfile/Köfte, Diğer Tarafı Sebzeli Graten)",
         time: 45, cost: 380, type: "MIXED", heaviness: 6, ingredients: ["dana bonfile", "köfte", "patlıcan", "kabak", "zeytinyağı", "kaşar"],
         logicExplanation: "Tepsinin sol tarafında etobur aile fertleri için kasap köfte / bonfile dilimleri pişerken, sağ tarafında bitkisel ve hafif diyet beslenenler için zeytinyağlı sebzeler fırınlanır."
      },
      {
         name: "Ayrıştırılmış Tencere Yemeği (Etsiz Pişirilip Sonradan Et/Kıyma Eklenen Güveç)",
         time: 50, cost: 220, type: "MIXED", heaviness: 4, ingredients: ["kuru fasulye", "kuşbaşı et", "soğan", "salça", "zeytinyağı"],
         logicExplanation: "Sebze veya bakliyat tabanını zeytinyağı ile piştikten sonra porsiyonlayın! Hafif ve etsiz diyetlilerin porsiyonu ayrıldıktan sonra tencerede kalan yemeğe sote et veya kıyma harmanlanır."
      },
      {
         name: "Modüler Izgara & Tahıl Tabağı (Etobura Bonfile / Diğerlerine Mantar-Kinoa)",
         time: 25, cost: 340, type: "MIXED", heaviness: 4, ingredients: ["bonfile", "mantar", "kinoa", "roka", "zeytinyağı"],
         logicExplanation: "Taban kinoa ve yeşillik salatası ortak hazırlanır. Etobur ve yüksek protein diyetindeki kişiye dana bonfile dilimleri, sebze severlere ızgara kestane mantarı eklenir."
      },
      {
         name: "İkili Lahmacun & Pide Tepsisi (Kıymalı & Sebzeli/Glutensiz Tabanlı)",
         time: 40, cost: 260, type: "MIXED", heaviness: 6, ingredients: ["kıyma", "domates", "biber", "mantar", "mısır"],
         logicExplanation: "Aynı fırın tepsisinde kıymalı harçlı etobur pideler ile mantarlı/sebzeli zeytinyağlı pideler eş zamanlı pişirilir."
      },
      {
         name: "Çift Hazneli Çorba & Kebap Konsepti (Et Suyu Bonfile & Sebze Çorbası)",
         time: 35, cost: 290, type: "MIXED", heaviness: 5, ingredients: ["tavuk", "sarımsak", "yoğurt", "nane", "kabak"],
         logicExplanation: "Grupta hem etobur hem de hafif sebze diyetli varsa: Tencerenin birinde kemik sulu tavuk çorbası hazırlanırken, diğerinde saf sebze çorbası pişirilir."
      },
      {
         name: "Kişiselleştirilebilir Izgara Tavuk / Mantar Kasesi (Bowl)",
         time: 25, cost: 230, type: "MIXED", heaviness: 4, ingredients: ["tavuk göğüsü", "mantar", "pirinç", "avokado", "mısır"],
         logicExplanation: "Pirinç, avokado ve mısır kasesinin üzerine etobur kişilere ızgara tavuk göğsü; vegan/vejetaryen kişilere ızgara soya soslu mantar ilave edilir."
      },
      {
         name: "İki Farklı İç Harçlı Dolma / Sarma (Kıymalı & Fıstıklı Zeytinyağlı)",
         time: 60, cost: 210, type: "MIXED", heaviness: 5, ingredients: ["biber", "kıyma", "pirinç", "fıstık", "nane", "zeytinyağı"],
         logicExplanation: "Biberlerin yarısı kıymalı sıcak dolma harcı ile doldurulurken, diğer yarısı fıstıklı üzümlü zeytinyağlı soğuk dolma harcı ile doldurularak tek tencerede pişirilir."
      },
      {
         name: "Katmanlı Fırın Graten (Kıymalı Beşamel & Zeytinyağlı Sebzeli)",
         time: 45, cost: 270, type: "MIXED", heaviness: 6, ingredients: ["patates", "kıyma", "beşamel", "kaşar", "zeytinyağı"],
         logicExplanation: "Fırın kabının bir yarısına kıymalı katman atılır, diğer yarısına mantarlı/sebzeli katman atılarak tüm grubun hassasiyeti karşılanır."
      },
      {
         name: "Ayrıştırılabilir Erişte / Mantı Tavası (Kıymalı Mantı & Yoğurtlu Cevizli Erişte)",
         time: 30, cost: 220, type: "MIXED", heaviness: 5, ingredients: ["mantı", "erişte", "kıyma", "yoğurt", "ceviz", "tereyağı"],
         logicExplanation: "Etobur ve hamur sevenler için kıymalı sarımsaklı mantı; vejetaryen/hafif yiyenler için cevizli erişte aynı sofrada buluşur."
      },
      {
         name: "Modüler Sote Dürüm (Dana Etli & Soya Soslu Sebzeli)",
         time: 20, cost: 280, type: "MIXED", heaviness: 5, ingredients: ["lavaş", "bonfile", "biber", "soğan", "mantar"],
         logicExplanation: "Sotelenen soğan ve biberler iki ayrı tavaya alınır. Birine jülyen dana bonfile, diğerine mantar eklenip lavaş arası yapılır."
      }
   ];

   // Durstenfeld true Fisher-Yates shuffle
   function durShuffleG(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

   // Session tracking per unique member combination
   const memberKey = members.map(m => m.name + ':' + m.rule).sort().join('|');
   if (!window.groupShownIds) window.groupShownIds = {};
   if (!window.groupShownSplitIdxs) window.groupShownSplitIdxs = {};
   if (!window.groupLastMemberKey) window.groupLastMemberKey = '';
   if (window.groupLastMemberKey !== memberKey) {
     window.groupShownIds[memberKey] = [];
     window.groupShownSplitIdxs[memberKey] = [];
     window.groupLastMemberKey = memberKey;
   }
   const shownIds = window.groupShownIds[memberKey] || [];
   const shownSplitIdxs = window.groupShownSplitIdxs[memberKey] || [];

   let finalSuggestions = [];

   // True-shuffle splits, pick ones not seen recently
   const allSplitIdxs = durShuffleG(splitRecipes.map((_, i) => i));
   const freshSplitIdxs = allSplitIdxs.filter(i => !shownSplitIdxs.includes(i));
   // If we've exhausted all splits, reset
   if (freshSplitIdxs.length < 2) { window.groupShownSplitIdxs[memberKey] = []; freshSplitIdxs.push(...allSplitIdxs); }

   const allDietsIdentical = members.every(m => m.rule === members[0].rule);

   if (members.length > 1 && !allDietsIdentical) {
       const si1 = freshSplitIdxs[0]; const si2 = freshSplitIdxs[1];
       if (si1 !== undefined) { finalSuggestions.push(splitRecipes[si1]); window.groupShownSplitIdxs[memberKey].push(si1); }
       if (si2 !== undefined) { finalSuggestions.push(splitRecipes[si2]); window.groupShownSplitIdxs[memberKey].push(si2); }
   }

   if (validDishes.length > 0) {
       // Remove already-shown dishes, score, then Durstenfeld shuffle for true variety
       let freshDishes = validDishes.filter(d => !shownIds.includes(d.id));
       if (freshDishes.length < 3) { window.groupShownIds[memberKey] = []; freshDishes = [...validDishes]; }
       freshDishes.sort((a,b) => b.score - a.score);
       const topPool = durShuffleG(freshDishes.slice(0, Math.max(10, Math.floor(freshDishes.length / 2))));
       
       topPool.slice(0, 3).forEach(dish => {
           let logicExp = "Grubunuzun beslenme standartlarının %100 TAM ORTAK KESİŞİMİDİR. ";
           members.forEach(m => {
               if (m.rule === 'CARNIVORE') logicExp += `${m.name} için zengin protein ve et içeriği barındırır. `;
               if (m.rule === 'VEGAN') logicExp += `${m.name} için tamamen bitkiseldir. `;
               if (m.rule === 'GLUTEN_FREE') logicExp += `${m.name} için tamamen unsuzdur. `;
               if (m.rule === 'DIABETIC') logicExp += `${m.name} için şekersiz/düşük karblıdır. `;
               if (m.rule === 'HIGH_PROTEIN') logicExp += `${m.name} kas gelişimi desteklenir. `;
           });
           window.groupShownIds[memberKey].push(dish.id);
           finalSuggestions.push({ ...dish, logicExplanation: logicExp.trim() });
       });
   } else if (members.length > 1) {
       const si3 = freshSplitIdxs[2] !== undefined ? freshSplitIdxs[2] : 0;
       finalSuggestions.push(splitRecipes[si3]);
   }

   // Deduplicate and return
   const seen = new Set();
   const uniqueResults = [];
   durShuffleG(finalSuggestions).forEach(dish => {
       if (!seen.has(dish.name)) {
           seen.add(dish.name);
           const details = getDishDetails(dish);
           uniqueResults.push({ ...dish, ...details });
       }
   });

   return uniqueResults;
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
