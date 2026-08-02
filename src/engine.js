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
  
  if (t.includes("dolap") || t.includes("evde") || t.includes("buzdolabı")) {
      return `__CMD:FRIDGE__Eldeki malzemeleri değerlendirmek harika fikir! Seni hemen 'Dolabımdakiler' modülüne ışınlıyorum.`;
  }

  if (t.includes("kaç dakika") || t.includes("ne kadar sürer") || t.includes("süresi")) {
      let foundDish = DB_MAINS_HUGE.find(m => t.includes(m.name.toLowerCase()));
      if (foundDish) {
          const det = getDishDetails(foundDish);
          return `Hemen analiz ediyorum! ${foundDish.name} yemeği ortalama ${det.prepTime} dakikada pişer, kalorisi yaklaşık ${det.calories}'dir ve yapım maliyeti yaklaşık ₺${det.totalCost} tutar.`;
      }
      return `Hangi yemeği sorduğunuzu tam çıkaramadım. Lütfen yemeğin adını tam belirterek ("Karnıyarık kaç dakika sürer" gibi) sorar mısın?`;
  }

  if (t.includes("fiyat") || t.includes("pazar listesi") || t.includes("alışveriş") || t.includes("eksik")) {
    return `Herhangi bir tarifin içindeyken "Pazar Listesini Çıkar" butonuna basarsan bakkal/market hesabını senin için kuruşu kuruşuna çıkarırım.`;
  }
  
  if (t.includes("teşekkür") || t.includes("sağol") || t.includes("süper") || t.includes("harika") || t.includes("eline sağlık")) {
    return `Afiyet bal şeker olsun! Sizin için her zaman buradayım, mutfakla ilgili başka bir sorunuz olursa çekinmeden sorun. 💖`;
  }

  // === SAĞLIK / TIP / DİYET BAĞLAMI (Hacamat, Ameliyat, Hasta vb.) ===
  const isMedical = t.includes("hacamat") || t.includes("ameliyat") || t.includes("hasta") || t.includes("tedavi") || t.includes("ilaç") || t.includes("doktor") || t.includes("iyileşme") || t.includes("operasyon");
  const wantsPlantBased = t.includes("hayvansal") && (t.includes("yok") || t.includes("yeme") || t.includes("içermeyen") || t.includes("istemiyorum") || t.includes("olmayan") || t.includes("hariç") || t.includes("değil")) || t.includes("bitkisel") || t.includes("vegan") || t.includes("vejetaryen") || t.includes("sebzeli") || t.includes("etsiz");
  const wantsMeat = t.includes("etli") || t.includes("etobur") || t.includes("karnivor") || (t.includes("et") && !t.includes("etsiz") && !t.includes("et içerme"));

  if (isMedical && wantsPlantBased) {
    const plantDishes = DB_MAINS_HUGE.filter(m => {
      const ings = m.ingredients.join(" ").toLowerCase();
      return !/tavuk|kıyma|et|kuşbaşı|somon|levrek|sucuk|pastırma|kavurma|bonfile|yumurta|süt|peynir|kaşar|krema|tereyağı/.test(ings);
    }).sort(() => 0.5 - Math.random()).slice(0, 5);
    const names = plantDishes.map(m => `🌿 ${m.name}`).join("\n");
    return `Evet şefim, hacamat veya tıbbi bir süreç sonrasında hayvansal içeriklerm(et, süt, yumurta) içermeyen hafif ve şifalı yemekler çok önemli! İşte tam sana göre seçtiklerim:\n\n${names}\n\nBunların tarifini görmek için "... nasıl yapılır?" diyebilirsin. Bitkisel gıdaların sindirim sisteminizi rahatlatıp iyileşmeyi hızlandırdığını bilimsel olarak da biliyoruz. 💚`;
  }

  if (wantsPlantBased) {
    const plantDishes = DB_MAINS_HUGE.filter(m => {
      const ings = m.ingredients.join(" ").toLowerCase();
      return !/tavuk|kıyma|et|kuşbaşı|somon|levrek|sucuk|pastırma|kavurma|bonfile/.test(ings);
    }).sort(() => 0.5 - Math.random()).slice(0, 5);
    const names = plantDishes.map(m => `🌿 ${m.name}`).join("\n");
    return `Hayvansal içeriği olmayan bitkisel yemekler için harika seçimler şunlar:\n\n${names}\n\nHepsinin tarifi için isim yazman yeterli! Vegan veya vejetaryen beslenme için daha fazla öneri istersen "Başka ne var?" diyebilirsin. 🌱`;
  }

  if (isMedical && !wantsPlantBased) {
    return `Sağlık sürecinizde dikkatli bir şekilde beslenmeniz çok önemli, şefim! Genel olarak:\n\n🥗 Sebze ağırlıklı, az yağlı yemekler (mercimek çorbası, zeytinyağlı sebzeler)\n🍗 Hafif pişmiş tavuk (buharda veya haşlama)\n🐟 Fırın balık (fazla baharat olmadan)\n🥣 Yoğurt ve probiyotikler\n\n...tercih edilir. Daha spesifik bir yemek adı yazarsan tarifi detaylı anlatayım!`;
  }
  
  // === KALORİ / DİYET ===
  if (t.includes("diyet") || t.includes("zayıf") || t.includes("kilo")) {
    return `Kilo kontrolü veya sağlıklı beslenme mi? Harika! Ana ekrandaki 'Evin Sağlık Karnesi' modülüne sadece tek bir malzeme (Örn: tavuk) yazarak onun hem diyet (zayıflatan) hem de doyurucu iki farklı versiyonunu eş zamanlı görebilirsin.`;
  }
  
  // 1. Doğrudan Tarif İsteklerini Çok Daha Akıllı Yakalama (Genişletilmiş Regex)
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

    // Bitkisel filtre uygula (eğer kullanıcı etsiz istiyorsa)
    if (wantsPlantBased) {
      matches = matches.filter(m => {
        const allIngs = m.ingredients.join(" ").toLowerCase();
        return !/tavuk|kıyma|et|kuşbaşı|somon|levrek|sucuk|kavurma|bonfile/.test(allIngs);
      });
    }

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
           return `Tabii ki şefim! ${joinedIngs} kullanarak yapabileceğin yepyeni fikirler:\n\n${topMatches}\n\nBunlardan birine gözün çarptıysa adını yaz, detaylarını dökeyim!`;
       }
       return `Harika! Elindeki "${joinedIngs}" ile mutfakta harikalar yaratabiliriz. Senin için en uyumlu 3 tarif:\n\n${topMatches}\n\nBu yemeklerden ilgini çekenin tarifini sorucan zaman (Örn: "${selected[0].name} nasıl yapılır?") diye sorabilirsin. İstersen "Başka ne var?" diyerek önerileri de değiştirebilirim!`;
    } else {
       if (isAskingMore) {
           return `Elimdeki "${ings.join(", ")}" içeren tüm şaheserleri sana saydım şefim! Bunlar dışında repertuarım şimdilik tükendi. Yanına başka bir malzeme eşleştirsek?`;
       } else {
           return `Hımm, saf olarak sadece "${ings.join(", ")}" içeren hazır bir tarif bulamadım. Ancak bunları tavada biraz zeytinyağı ve baharatla soteleyip enfes bir hızlı lezzet yaratabilirsin! Veya yanına bir malzeme daha söyle?`;
       }
    }
  }

  // 3. Devam Eden Konteksti Yakalama
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
};

// -- BÜTÇEYE GÖRE KESİN 3 ALTERNATİF MENÜ --