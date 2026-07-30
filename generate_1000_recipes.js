const fs = require('fs');

// We will dynamically combine realistic foods to form exactly 1000 distinct main dishes.
const cuisines = ["TURKISH", "ASIAN", "MEXICAN", "ITALIAN", "FRENCH", "MIDDLE_EASTERN"];

let dbCounter = 0;
const generatedMains = [];

const pickRand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const roll = (prob) => Math.random() < prob;

// Temel malzemelerin maliyet listesi (Yaklaşık 2026 TL)
const INGREDIENT_COST = {
  "kıyma": 60, "kuşbaşı": 70, "antrikot": 90, "bonfile": 100, "tavuk göğsü": 25, "bütün tavuk": 45,
  "somon": 90, "levrek": 70, "domates": 5, "biber": 4, "kuru soğan": 2, "patlıcan": 6, "kabak": 5,
  "havuç": 4, "patates": 4, "kuru fasulye": 15, "nohut": 15, "makarna": 10, "pirinç": 12, "bulgur": 10,
  "kültür mantarı": 12, "krema": 15, "tereyağı": 10, "zeytinyağı": 10, "kaşar": 20, "parmesan": 35,
  "soya sosu": 15, "noodle": 20, "jalapeno": 10, "tortilla": 15, "sarımsak": 2, "köri": 5
};

const getCostFor = (ings) => {
   let total = 25; // Temel tüp/baharat tabanı
   ings.forEach(i => {
       const mapped = Object.keys(INGREDIENT_COST).find(k => i.includes(k));
       if (mapped) total += Math.round(INGREDIENT_COST[mapped] * 1.3); // porsiyon firesiyle
       else total += 6; 
   });
   return total;
};

// 1. TURKISH (Tencere Yemekleri, Kebaplar)
const turkMeats = ["kıyma", "kuşbaşı", "tavuk göğsü"];
const turkVeggies = [["patlıcan", "domates", "biber"], ["patates", "havuç", "kuru soğan"], ["kuru fasulye", "kuru soğan", "domates salçası"], ["nohut", "kuru soğan", "biber salçası"], ["kabak", "dereotu", "domates"]];
const turkExtras = ["sarımsak", "zeytinyağı", "tereyağı", "pul biber"];

// 2. ASIAN (Wok, Soya, Noodle)
const asianMeats = ["tavuk göğsü", "somon", "bonfile", "kıyma"];
const asianVeggies = [["kabak", "havuç", "kuru soğan"], ["kültür mantarı", "taze soğan", "sarımsak"], ["brokoli", "havuç", "biber"], ["lahana", "soya fasulyesi", "havuç"]];
const asianCarbs = ["noodle", "pirinç"];

// 3. MEXICAN (Acı, Tortilla, Peynir)
const mexMeats = ["kıyma", "tavuk göğsü", "antrikot"];
const mexVeggies = [["kırmızı biber", "sıvıyağ", "mısır"], ["fasulye", "kuru soğan", "domates", "acı biber"], ["jalapeno", "domates", "kırmızı soğan"]];

// 4. ITALIAN (Pasta, Parmesan, Fesleğen)
const itaMeats = ["kıyma", "tavuk göğsü", "somon", null]; // null = vejetaryen
const itaCarbs = ["spagetti", "penne", "burgu makarna"];
const itaSauces = [["domates", "sarımsak", "zeytinyağı"], ["krema", "kültür mantarı", "tereyağı"], ["fesleğen", "parmesan", "zeytinyağı"]];

// 5. FRENCH (Krema, Et, Somon, Şarap Mimarisi)
const freMeats = ["bonfile", "antrikot", "somon", "bütün tavuk"];
const freVeggies = [["patates", "sarımsak", "tereyağı"], ["kuşkonmaz", "havuç", "zeytinyağı"], ["kültür mantarı", "krema", "kuru soğan"]];

// 6. MIDDLE_EASTERN (Araplar/Lübnan - Baharat, Nohut, Et)
const midMeats = ["kıyma", "kuşbaşı", "baget"];
const midVeggies = [["nohut", "tahin", "kimyon"], ["patlıcan", "yoğurt", "sarımsak"], ["bulgur", "domates", "biber salçası"]];

const titleGen = (type, meat, vegStr, isVeg) => {
   const mName = meat ? meat.charAt(0).toUpperCase() + meat.slice(1) : "";
   if (type === "TURKISH") return isVeg ? `Zeytinyağlı ${vegStr.charAt(0).toUpperCase() + vegStr.slice(1)} Yemeği` : `Geleneksel ${mName}lı ${vegStr} Yahnisi`;
   if (type === "ASIAN") return isVeg ? `Vegan Asya Usulü Soya Soslu ${vegStr}` : `Teriyaki Soslu ${mName} ve Wok Sebze`;
   if (type === "MEXICAN") return isVeg ? `Vegano Acılı ${vegStr} Taco` : `Meksika Usulü ${mName} Fajita`;
   if (type === "ITALIAN") return isVeg ? `Geleneksel İtalyan ${vegStr} Soslu Makarna` : `Özel Şef Soslu ${mName}lı İtalyan Pasta`;
   if (type === "FRENCH") return `Paris Usulü Mühürlenmiş ${mName} ve Aromatik Sebzeler`;
   if (type === "MIDDLE_EASTERN") return isVeg ? `Lübnan Usulü ${vegStr} Ezmesi` : `Gurme Ortadoğu Baharatlı ${mName} Kavurma`;
};

const descGen = (type, ings) => {
   let step1, step2, step3;
   const str = ings.join(", ");
   if (type === "TURKISH") {
       step1 = `Tencerenize yağı alıp doğranmış kuruları ekleyin ve kavurun.`;
       step2 = `Ana malzemeleri (${str}) ekleyip kendi suyunu salana kadar harmanlayın.`;
       step3 = `Sıcak su ve baharat ekleyip kısık ateşte 40 dakika demlenmeye bırakın.`;
   } else if (type === "ASIAN") {
       step1 = `Wok tavasını yüksek ateşte duman tütene kadar ısıtın.`;
       step2 = `Malzemeleri (${str}) hızlıca woklayıp soya sosunu ve zencefili bağlayın.`;
       step3 = `Sadece 8-10 dakika içinde çıtır kalarak pişmiş olan yemeğinizi susamla servis edin.`;
   } else if (type === "MEXICAN") {
       step1 = `Tavaya sıvıyağı alıp jalapeno veya acı biberi soteleyerek aromayı yağa çıkarın.`;
       step2 = `Malzemeleri (${str}) taco baharatlarıyla kavurup yoğun ateşte çevirin.`;
       step3 = `Lavaşa (tortilla) sarmadan önce içine peynir ekleyip sıcağıyla eritin.`;
   } else if (type === "ITALIAN") {
       step1 = `Derin bir tencerede deniz tuzu eklenmiş bol suda makarnaları Al Dente (dişe gelir) haşlayın.`;
       step2 = `Ayrı koca bir tavada (${str}) malzemelerini zeytinyağında soteleyip İtalyan sosunu bağlayın.`;
       step3 = `Sosla makarnayı tavada 2 dakika pişirerek bütünleştirin, üstüne parmesanla taçlandırın.`;
   } else if (type === "FRENCH") {
       step1 = `Eti veya balığı tereyağıyla döküm tavada mühürleyip sularını içine hapsedin.`;
       step2 = `Aromatik malzemeleri (${str}) tavadaki lezzetli yağa atarak deglaze edin ve kremamsı doku verin.`;
       step3 = `Hafif yoğun ateşte sosu çektirin ve zarif tabaklama ile servis edin.`;
   } else {
       step1 = `Geniş bir tepsiye veya toprak güvece tüm otantik baharatları ve yağı yayın.`;
       step2 = `Tüm içeriği (${str}) ekleyip hafif köz ateşinde veya fırında ağır ağır pişirin.`;
       step3 = `Sumak ve yoğurt gibi ferahlatıcı elementleri kenarına koyup ortadoğu usulü sıcak servis edin.`;
   }
   return `1. Mutfak hazırlığı: Bıçaklarınızı bileyin ve temiz bir tahtada çalışın.\n2. ${step1}\n3. ${step2}\n4. ${step3}`;
};

// Üretici Döngüsü
while(generatedMains.length < 1050) {
   for (let c of cuisines) {
      let meat = null, veg = [], carb = null, extra = [];
      let nameObj = "";
      
      const isVeganOption = roll(0.15); // %15 vegan
      const isKidFriendly = roll(0.2); 
      
      if (c === "TURKISH") {
          meat = isVeganOption ? null : pickRand(turkMeats);
          veg = pickRand(turkVeggies);
          extra = [pickRand(turkExtras)];
          nameObj = veg[0];
      } else if (c === "ASIAN") {
          meat = isVeganOption ? null : pickRand(asianMeats);
          veg = pickRand(asianVeggies);
          carb = pickRand(asianCarbs);
          extra = ["soya sosu", "sarımsak"];
          nameObj = veg[0];
      } else if (c === "MEXICAN") {
          meat = isVeganOption ? null : pickRand(mexMeats);
          veg = pickRand(mexVeggies);
          extra = ["tortilla", "acı biber"];
          nameObj = (meat) ? meat : veg[0];
      } else if (c === "ITALIAN") {
          meat = isVeganOption ? null : pickRand(itaMeats);
          carb = pickRand(itaCarbs);
          veg = pickRand(itaSauces);
          nameObj = veg[0];
      } else if (c === "FRENCH") {
          meat = isVeganOption ? null : pickRand(freMeats);
          if(!meat) meat = "kültür mantarı"; 
          veg = pickRand(freVeggies);
          nameObj = veg[1] || veg[0];
      } else if (c === "MIDDLE_EASTERN") {
          meat = isVeganOption ? null : pickRand(midMeats);
          veg = pickRand(midVeggies);
          extra = ["kimyon", "tuz"];
          nameObj = veg[0];
      }
      
      let allIngs = [...veg, ...extra];
      if (meat) allIngs.push(meat);
      if (carb) allIngs.push(carb);
      
      // Remove nulls
      allIngs = allIngs.filter(Boolean);
      
      // Determine themes
      let themes = [];
      if (isVeganOption) themes.push("VEGAN");
      if (isKidFriendly) themes.push("KID");
      if (roll(0.1)) themes.push("DIABETIC");
      if (roll(0.3)) themes.push("WINTER");
      if (roll(0.2)) themes.push("SUMMER");
      
      let time = 30 + Math.floor(Math.random()*40); // 30 ile 70 dk arası
      let baseCost = getCostFor(allIngs);

      let finalName = titleGen(c, meat, nameObj, isVeganOption) + (roll(0.3) ? ` (${Math.floor(Math.random()*99)})` : ``);
      let desc = descGen(c, allIngs);

      generatedMains.push({
          id: "huge_" + dbCounter++,
          name: finalName,
          type: c,
          theme: themes,
          cost: baseCost,
          time: time,
          heaviness: Math.floor(Math.random() * 8) + 2,
          ingredients: allIngs,
          recipeDesc: desc
      });
   }
}

const fileContent = "export const DB_MAINS_HUGE = " + JSON.stringify(generatedMains, null, 2) + ";\n";
fs.writeFileSync('src/hugeRecipes.js', fileContent);
console.log('Successfully generated ' + generatedMains.length + ' recipes!');
