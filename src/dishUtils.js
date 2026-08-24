/**
 * Utility function to clean recipe names and extract regional/origin information.
 * Strips cluttered prefixes like "Adana Usulü Fırında Taş Güveçte..." into "Patlıcanlı Dana Kuşbaşı"
 * and extracts the origin ("Adana, Türkiye", "Mersin, Türkiye", "Napoli, İtalya", etc.)
 */
export function getCleanDishDetails(dish) {
  if (!dish) return { cleanName: 'Özel Tarif', region: 'Geleneksel Türk Mutfağı' };

  let rawName = dish.name || '';
  let region = dish.region || dish.origin || '';

  // Extract region from title if it contains "X Usulü" or "X Stili" or "X Yöresi"
  if (!region) {
    const usuluMatch = rawName.match(/^([A-ZÇĞİÖŞÜa-zçğıöşü\s]+)\s+(Usulü|Stili|Yöresi)/i);
    if (usuluMatch) {
      const location = usuluMatch[1].trim();
      if (/Napoli|Milano|Roma|Bologna/i.test(location)) region = `${location}, İtalya`;
      else if (/Teksas|New York|Chicago|California/i.test(location)) region = `${location}, ABD`;
      else if (/Tokyo|Osaka|Kyoto/i.test(location)) region = `${location}, Japonya`;
      else if (/Paris|Lyon/i.test(location)) region = `${location}, Fransa`;
      else region = `${location}, Türkiye`;
    }
  }

  // Clean dish title by removing cluttered cooking style prefixes and city "usulü" tags
  let cleanName = rawName
    .replace(/Usulü|usulü|Stili|stili|Yöresi|yöresi/gi, '')
    .replace(/Toprak Çömlek/gi, '')
    .replace(/Közde Tandır/gi, '')
    .replace(/Fırında Taş Güveçte/gi, '')
    .replace(/Odun Ateşinde Sac Tavada/gi, '')
    .replace(/Zeytinyağlı Kısık Ateşte/gi, '')
    .replace(/Közde Izgara/gi, '')
    .replace(/Kremalı Sarımsak Soslu/gi, '')
    .replace(/Odun Ateşinde Közlenmiş/gi, '')
    .replace(/Buharda Şifalı/gi, '')
    .replace(/Tereyağlı Özel Sote/gi, '')
    .replace(/Tepsi Buğulama/gi, '')
    .replace(/Ekşi Soslu Buğulama/gi, '')
    .replace(/Geleneksel Kavurma/gi, '')
    .replace(/Fırın Çıtır Pane/gi, '')
    .replace(/Glaze Şerbetli Buhar/gi, '')
    .replace(/Tava Kızartma/gi, '')
    .replace(/Düdüklü Lokum/gi, '')
    .replace(/Fırın Graten/gi, '')
    .replace(/Fırında/gi, '')
    .replace(/Güveçte/gi, '')
    .replace(/Sac Tavada/gi, '')
    .replace(/Kısık Ateşte/gi, '')
    .replace(/Odun Ateşinde/gi, '')
    .replace(/Közde/gi, '')
    .replace(/Graten/gi, '')
    .replace(/\b(Adana|Adıyaman|Afyon|Ağrı|Amasya|Ankara|Antalya|Artvin|Aydın|Balıkesir|Bilecik|Bingöl|Bitlis|Bolu|Burdur|Bursa|Çanakkale|Çankırı|Çorum|Denizli|Diyarbakır|Edirne|Elazığ|Erzincan|Erzurum|Eskişehir|Gaziantep|Antep|Giresun|Gümüşhane|Hakkari|Hatay|Isparta|Mersin|İçel|İstanbul|İzmir|Kars|Kastamonu|Kayseri|Kırklareli|Kırşehir|Kocaeli|Konya|Kütahya|Malatya|Manisa|Kahramanmaraş|Maraş|Mardin|Muğla|Muş|Nevşehir|Niğde|Ordu|Rize|Sakarya|Samsun|Siirt|Sinop|Sivas|Tekirdağ|Tokat|Trabzon|Tunceli|Şanlıurfa|Urfa|Uşak|Van|Yozgat|Zonguldak|Aksaray|Bayburt|Karaman|Kırıkkale|Batman|Şırnak|Bartın|Ardahan|Iğdır|Yalova|Karabük|Kilis|Osmaniye|Düzce|Meksika|Napoli|Teksas|Roma|Milano|Tokyo|Paris|New York)\b/gi, '')
    .replace(/Usulü|usulü|Stili|stili|Yöresi|yöresi/gi, '')
    .replace(/\bPatlıcanli\b/gi, 'Patlıcanlı')
    .replace(/\bIspanakli\b/gi, 'Ispanaklı')
    .replace(/\bBarbunyali\b/gi, 'Barbunyalı')
    .replace(/\bKuşkonmazli\b/gi, 'Kuşkonmazlı')
    .replace(/\bMantarli\b/gi, 'Mantarlı')
    .replace(/\bSarımsakli\b/gi, 'Sarımsaklı')
    .replace(/\bŞalgamli\b/gi, 'Şalgamlı')
    .replace(/\bPazıli\b/gi, 'Pazılı')
    .replace(/\bKerevizli\b/gi, 'Kerevizli')
    .replace(/\bPatatesli\b/gi, 'Patatesli')
    .replace(/\bBrokolili\b/gi, 'Brokolili')
    .replace(/\bBiberli\b/gi, 'Biberli')
    .replace(/\bTavuk Göğüsü\b/gi, 'Tavuk Göğsü')
    .replace(/\s+/g, ' ')
    .trim();

  // If cleanName became empty or too short, fallback to original rawName
  if (!cleanName || cleanName.length < 2) {
    cleanName = rawName;
  } else {
    // Capitalize first letter
    cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }

  // Fallback region lookup based on key dish terms if region still empty
  if (!region) {
    if (/Tantuni/i.test(cleanName)) region = "Mersin, Türkiye";
    else if (/Lahmacun|Kebap/i.test(cleanName)) region = "Gaziantep / Şanlıurfa, Türkiye";
    else if (/Mantı/i.test(cleanName)) region = "Kayseri, Türkiye";
    else if (/Köfte|Piyaz/i.test(cleanName)) region = "İnegöl / Tekirdağ, Türkiye";
    else if (/Pide/i.test(cleanName)) region = "Karadeniz, Türkiye";
    else if (/Fasulye|Pilav/i.test(cleanName)) region = "Rize, Türkiye";
    else if (/Pizza|Pastaroni|Spagetti|Makarna/i.test(cleanName)) region = "Napoli, İtalya";
    else if (/Taco|Burrito|Fajita/i.test(cleanName)) region = "Meksika / Teksas, ABD";
    else if (/Burger|Hotdog/i.test(cleanName)) region = "New York, ABD";
    else if (/Sushi|Ramen|Teriyaki/i.test(cleanName)) region = "Tokyo, Japonya";
    else if (/Curry|Tikka|Biryani/i.test(cleanName)) region = "Yeni Delhi, Hindistan";
    else region = "Geleneksel Türk Mutfağı";
  }

  return { cleanName, region };
}
