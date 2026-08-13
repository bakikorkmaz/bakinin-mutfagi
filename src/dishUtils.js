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
    .replace(/^([A-ZÇĞİÖŞÜa-zçğıöşü\s]+)\s+(Usulü|usulü|Stili|stili|Yöresi|yöresi)\s+/gi, '')
    .replace(/\b([A-ZÇĞİÖŞÜa-zçğıöşü]+)\s+(Usulü|usulü|Stili|stili|Yöresi|yöresi)\b/gi, '')
    .replace(/Fırında Taş Güveçte\s*/gi, '')
    .replace(/Odun Ateşinde Sac Tavada\s*/gi, '')
    .replace(/Zeytinyağlı Kısık Ateşte\s*/gi, '')
    .replace(/Közde Izgara\s*/gi, '')
    .replace(/Kremalı Sarımsak Soslu\s*/gi, '')
    .replace(/Odun Ateşinde Közlenmiş\s*/gi, '')
    .replace(/Buharda Şifalı\s*/gi, '')
    .replace(/Tereyağlı Özel Sote\s*/gi, '')
    .replace(/Tepsi Buğulama\s*/gi, '')
    .replace(/Toprak Çömlek Usulü\s*/gi, '')
    .replace(/Közde Tandır Usulü\s*/gi, '')
    .replace(/Ekşi Soslu Buğulama\s*/gi, '')
    .replace(/Geleneksel Kavurma\s*/gi, '')
    .replace(/Fırın Çıtır Pane\s*/gi, '')
    .replace(/Glaze Şerbetli Buhar\s*/gi, '')
    .replace(/Tava Kızartma\s*/gi, '')
    .replace(/Düdüklü Lokum\s*/gi, '')
    .replace(/Fırın Graten\s*/gi, '')
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
