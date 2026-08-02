import { collection, query, where, getDocs } from "firebase/firestore";

// Küfür, hakaret ve uygunsuz kelimeler listesi
const BAD_WORDS = [
  'amk', 'aq', 'amq', 'sik', 'sikerim', 'sikim', 'sikis', 'siktir', 'yarrak', 'yarak',
  'orospu', 'pic', 'piç', 'got', 'göt', 'bok', 'mal', 'kahpe', 'am', 'meme', 'yavsak',
  'yavşak', 'surtuk', 'sürtük', 'koyayim', 'koyayım', 'oc', 'oç', 'ibne', 'pust', 'puşt',
  'dalyarak', 'götveren', 'gotveren', 'taşak', 'tasak', 'amcık', 'amcik', 'yarag',
  'fuck', 'bitch', 'shit', 'cunt', 'asshole', 'dick', 'pussy', 'bastard', 'nigger', 'retard'
];

// Marka, şirket ve sistem tarafından korunan rezerv isimler
const RESERVED_BRANDS = [
  'baki', 'bakininmutfagi', 'baki_mutfak', 'bakimutfagi', 'bakikorkmaz',
  'admin', 'administrator', 'system', 'sistem', 'destek', 'support', 'official',
  'resmi', 'gurme_baki', 'baki_gurme', 'gurmebaki', 'bakigurme', 'moderator', 'mod',
  'instagram', 'facebook', 'google', 'apple', 'tiktok', 'youtube', 'twitter', 'x',
  'getir', 'yemeksepeti', 'trendyol', 'mcdonalds', 'burgerking', 'starbucks', 'dominos', 'kfc'
];

/**
 * Kullanıcı adını kurallara göre doğrular
 * @param {string} rawUsername - Kullanıcının girdiği ham kullanıcı adı
 * @param {string} currentUserId - Aktif kullanıcının UID'si (kendisini muaf tutmak için)
 * @param {Array} localUsersList - (Opsiyonel) Yerel kullanıcı listesi
 * @param {object} db - Firebase Firestore db referansı
 * @returns {Promise<{valid: boolean, error?: string, clean?: string}>}
 */
export async function validateUsername(rawUsername, currentUserId, localUsersList = [], db = null) {
  if (!rawUsername || !rawUsername.trim()) {
    return { valid: false, error: 'Bu kullanıcı adı kullanılamaz.' };
  }

  const clean = rawUsername.trim().toLowerCase();

  // 1. UZUNLUK VE KARAKTER KONTROLÜ (3-20 karakter, harf, rakam, alt çizgi, nokta)
  if (clean.length < 3 || clean.length > 20) {
    return { 
      valid: false, 
      error: 'Bu kullanıcı adı kullanılamaz.' 
    };
  }

  // Harf, rakam, alt çizgi ve nokta serbesttir. Hiçbir özel karakter zorunluluğu yoktur.
  const validCharRegex = /^[a-z0-9._çğışöü]+$/i;
  if (!validCharRegex.test(clean)) {
    return { 
      valid: false, 
      error: 'Bu kullanıcı adı kullanılamaz.' 
    };
  }

  // 2. KÜFÜR VE HAKARET KONTROLÜ
  for (const badWord of BAD_WORDS) {
    if (clean.includes(badWord)) {
      return { 
        valid: false, 
        error: 'Bu kullanıcı adı kullanılamaz.' 
      };
    }
  }

  // 3. MARKA VEYA REZERV İSİM KONTROLÜ
  for (const brand of RESERVED_BRANDS) {
    if (clean === brand || clean.includes(brand)) {
      return { 
        valid: false, 
        error: 'Bu kullanıcı adı kullanılamaz.' 
      };
    }
  }

  // 4. BENZERSİZLİK (UNIQUENESS) KONTROLÜ
  if (Array.isArray(localUsersList)) {
    const isTakenLocally = localUsersList.some(u => 
      (u.id !== currentUserId && u.uid !== currentUserId) && 
      (u.username || '').toLowerCase() === clean
    );
    if (isTakenLocally) {
      return { 
        valid: false, 
        error: 'Bu kullanıcı adı zaten kullanılmakta.' 
      };
    }
  }

  // Firestore sorgusu ile kontrol et (db sağlandıysa)
  if (db) {
    try {
      const q = query(collection(db, "users"), where("username", "==", clean));
      const querySnapshot = await getDocs(q);
      
      const takenByOther = querySnapshot.docs.some(doc => doc.id !== currentUserId);
      if (takenByOther) {
        return { 
          valid: false, 
          error: 'Bu kullanıcı adı zaten kullanılmakta.' 
        };
      }
    } catch (e) {
      console.warn("Firestore username check warning:", e);
    }
  }

  return { valid: true, clean };
}
