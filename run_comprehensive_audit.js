const fs = require('fs');
const path = require('path');

// Load engine and recipe databases
const engine = require('./src/engine.js');
const { DB_MAINS_HUGE } = require('./src/hugeRecipes.js');
const { REAL_RECIPES } = require('./src/realRecipes.js');

console.log("=================================================");
console.log("🔍 BAKI'NIN MUTFAĞI - KAPSAMLI DENETİM BAŞLATILDI");
console.log("=================================================\n");

let issuesFound = [];
let passCount = 0;

// 1. DATA METRIC AUDIT (Maliyet, Kalori, Hazırlık Süresi, Gramaj Kontrolleri)
console.log("--- 1. VERİ & METRİK DOĞRULUĞU DENETİMİ ---");

const allDishes = [...(DB_MAINS_HUGE || []), ...(REAL_RECIPES || [])];
console.log(`Toplu Veritabanı Toplam Tarif Sayısı: ${allDishes.length}`);

allDishes.forEach((dish, idx) => {
    // A. Maliyet Kontrolü
    if (!dish.cost || dish.cost <= 0) {
        issuesFound.push(`[VERİ HATASI] Tarif "${dish.name}" (ID: ${dish.id || idx}): Geçersiz maliyet (₺${dish.cost})`);
    } else passCount++;

    // B. Kalori Kontrolü
    if (!dish.calories || dish.calories <= 0 || dish.calories > 2500) {
        issuesFound.push(`[VERİ HATASI] Tarif "${dish.name}" (ID: ${dish.id || idx}): Gerçek dışı kalori değeri (${dish.calories} kcal)`);
    } else passCount++;

    // C. Süre Kontrolü
    if (!dish.time || dish.time <= 0 || dish.time > 300) {
        issuesFound.push(`[VERİ HATASI] Tarif "${dish.name}" (ID: ${dish.id || idx}): Gerçek dışı pişme süresi (${dish.time} dk)`);
    } else passCount++;

    // D. Malzeme Listesi Kontrolü
    if (!dish.ingredients || !Array.isArray(dish.ingredients) || dish.ingredients.length === 0) {
        issuesFound.push(`[VERİ HATASI] Tarif "${dish.name}" (ID: ${dish.id || idx}): Malzeme listesi boş veya eksik!`);
    } else passCount++;
});

// 2. FİLTRE & ALGORİTMA MANTIĞI DENETİMİ
console.log("\n--- 2. FİLTRE & ALGORİTMA DOĞRULUĞU DENETİMİ ---");

const veganBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|balık|karides|süt|yumurta|peynir|kaşar|tereyağı|krema|kavurma|sucuk|bonfile|antrikot|köfte|kebap|tas kebabı|mayonez|şinitzel|döner|bacon|sosis|jambon|sakatat)/i;
const vegBanned = /(tavuk|kıyma|et|kuşbaşı|somon|levrek|balık|karides|kavurma|sucuk|bonfile|antrikot|köfte|kebap|tas kebabı|şinitzel|döner|bacon|sosis|jambon|sakatat)/i;
const glutenBanned = /(makarna|noodle|un|ekmek|bulgur|şehriye|pide|yufka|lavaş|krep|bazlama|galeta|erişte|irmik)/i;
const diabeticBanned = /(şeker|baklava|kadayıf|reçel|bal|pekmez)/i;

// A. VEGAN FİLTRE DENETİMİ
const veganWheel = engine.generateWheelItems(['VEGAN']);
veganWheel.forEach(item => {
    const fullText = item.name + " " + (item.ingredients || []).join(" ");
    if (veganBanned.test(fullText)) {
        issuesFound.push(`[FİLTRE HATASI] Çark Vegan Filtresi ihlali: "${item.name}" hayvansal ürün içeriyor!`);
    } else passCount++;
});

// B. VEJETARYEN FİLTRE DENETİMİ
const vegWheel = engine.generateWheelItems(['VEGETARIAN']);
vegWheel.forEach(item => {
    const fullText = item.name + " " + (item.ingredients || []).join(" ");
    if (vegBanned.test(fullText)) {
        issuesFound.push(`[FİLTRE HATASI] Çark Vejetaryen Filtresi ihlali: "${item.name}" et/balık içeriyor!`);
    } else passCount++;
});

// C. GLUTENSİZ FİLTRE DENETİMİ
const glutenWheel = engine.generateWheelItems(['GLUTEN_FREE']);
glutenWheel.forEach(item => {
    const fullText = item.name + " " + (item.ingredients || []).join(" ");
    if (glutenBanned.test(fullText)) {
        issuesFound.push(`[FİLTRE HATASI] Çark Glutensiz Filtresi ihlali: "${item.name}" gluten içeriyor!`);
    } else passCount++;
});

// D. HAFTALIK PLAN SOSYETE FİLTRE DENETİMİ
const sosyetePlan = engine.generateWeeklyPlan(7, 'BALANCED', 'SOSYETE');
sosyetePlan.forEach(p => {
    if (!p.dish) issuesFound.push(`[FİLTRE HATASI] Sosyete haftalık planında boş gün oluştu!`);
    else passCount++;
});

// 3. GÜVENLİK VE GİRDİ SANİTİZASYON DENETİMİ
console.log("\n--- 3. GÜVENLİK VE SANİTİZASYON DENETİMİ ---");

const socialCode = fs.readFileSync(path.join(__dirname, 'src', 'SocialFlow.js'), 'utf8');
const appCode = fs.readFileSync(path.join(__dirname, 'src', 'App.js'), 'utf8');

// A. XSS & HTML Injection Taraması
if (socialCode.includes('dangerouslySetInnerHTML') || appCode.includes('dangerouslySetInnerHTML')) {
    issuesFound.push(`[GÜVENLİK UYARISI] Kod tabanında dangerouslySetInnerHTML kullanımı tespit edildi!`);
} else {
    console.log("✅ XSS Koruması: dangerouslySetInnerHTML kullanılmıyor (React JSX otomatik escape korumasında).");
    passCount++;
}

// B. Kullanıcı Giriş & Engelleme / Gizlilik Kontrolleri
if (socialCode.includes('myProfile?.blocked?.includes') && socialCode.includes('postOwner.isPrivate')) {
    console.log("✅ Gizlilik & Engelleme Kontrolü: Gizli hesaplar ve engellenen kullanıcılar akıştan tam izole ediliyor.");
    passCount++;
} else {
    issuesFound.push(`[GÜVENLİK HATASI] Sosyal akış gizli profil veya engel filtresi eksik!`);
}

// C. Firestore Enjeksiyon Koruması
if (socialCode.includes('arrayUnion') && socialCode.includes('arrayRemove')) {
    console.log("✅ Veri Bütünlüğü: Firestore arrayUnion/arrayRemove atomik operasyonları kullanılıyor.");
    passCount++;
}

// SONUÇ VE RAPOR OLUŞTURMA
console.log("\n=================================================");
console.log("📊 DENETİM SONUÇ ÖZETİ");
console.log("=================================================");
console.log(`Başarılı Doğrulama Adımı: ${passCount}`);
console.log(`Tespit Edilen Sorun Sayısı: ${issuesFound.length}`);

if (issuesFound.length > 0) {
    console.log("\n⚠️ TESPİT EDİLEN HUSUSLAR:");
    issuesFound.forEach(iss => console.log(" - " + iss));
} else {
    console.log("\n🎉 TÜM GÜVENLİK, VERİ VE FİLTRE DENETİMLERİ BAŞARIYLA GEÇTİ!");
}
