import React, { useState, useEffect } from 'react';
import { DB_SOUPS, DB_MAINS, DB_CARBS, DB_SIDES, DB_SALADS, DB_DESSERTS } from './realRecipes';
import { DB_MAINS_HUGE } from './hugeRecipes';
import { getCleanDishDetails } from './dishUtils';

// --- GELİŞMİŞ DİYET KONTROL MOTORU ---
const PAMPERING_TIPS = [
    "🍨 Tasarrufunuzun ₺30'u ile menünün yanına 2 top antep fıstıklı hakiki Maraş dondurması ekleyin!",
    "☕ Tasarrufunuzun ₺25'i ile yemeğin üstüne mis gibi köpüklü közde Türk kahvesi ve bitter çikolata keyfi yapın!",
    "🍋 Tasarrufunuzun ₺20'si ile taze nane yaprakları ve limonla nefis buzlu ev limonatası hazırlayın!",
    "🍓 Tasarrufunuzun ₺40'ı ile akşama hafif bisküvili taze çilekli magnolia kupları hazırlayın!",
    "🧀 Tasarrufunuzun ₺35'i ile başlangıca tereyağlı fırınlanmış kaşarlı mantar jülyen ekleyin!",
    "🥐 Tasarrufunuzun ₺45'i ile yemeğin sonuna akışkan çikolatalı ev suflesi katın!",
    "🍊 Tasarrufunuzun ₺25'i ile günün menüsüne C vitamini deposu taze portakal suyu ekleyin!",
    "🥖 Tasarrufunuzun ₺15'i ile çorbanın yanına nar gibi kızarmış sarımsaklı fırın ekmek hazırlayın!",
    "🥑 Tasarrufunuzun ₺30'u ile ana yemeğin yanına ezme avokadolu soslu çıtır nacho cips hazırlayın!",
    "🍿 Tasarrufunuzun ₺15'i ile film geceniz için tereyağlı karamelize sinema mısırı patlatın!"
];

const MEAT_KEYWORDS = ['kıyma', 'kuşbaşı', 'tavuk', 'bonfile', 'somon', 'levrek', 'et', 'sucuk', 'sosis', 'pastırma', 'köfte', 'jambon', 'bütün tavuk'];
const ANIMAL_KEYWORDS = [...MEAT_KEYWORDS, 'tereyağı', 'yoğurt', 'süt', 'krema', 'yumurta', 'kaşar', 'parmesan', 'süzme yoğurt', 'lor peyniri', 'bal'];
const GLUTEN_KEYWORDS = ['un', 'galeta unu', 'yufka', 'spagetti', 'penne', 'burgu makarna', 'erişte', 'bulgur', 'tarhana', 'arpa şehriye', 'tel şehriye', 'şehriye', 'ekmek', 'lavaş', 'baklavalık yufka', 'bisküvi', 'irmik'];
const HIGH_CARB_KEYWORDS = ['şeker', 'tatlı', 'baklava', 'künefe', 'güllaç', 'bal', 'reçel', 'şerbet', 'karamel sosu', 'bisküvi'];

export const isRecipeCompliant = (recipe, diet) => {
    if (!recipe || diet === 'ALL') return true;
    const ings = recipe.ingredients || [];
    const nameLower = (recipe.name || '').toLowerCase();
    const ingsLower = ings.map(i => (typeof i === 'string' ? i.toLowerCase() : ''));

    const containsAny = (keywords) => {
        return keywords.some(kw => nameLower.includes(kw) || ingsLower.some(i => i.includes(kw)));
    };

    if (diet === 'VEGETARIAN') {
        return !containsAny(MEAT_KEYWORDS);
    }
    if (diet === 'VEGAN') {
        return !containsAny(ANIMAL_KEYWORDS);
    }
    if (diet === 'GLUTEN_FREE') {
        return !containsAny(GLUTEN_KEYWORDS);
    }
    if (diet === 'DIABETIC') {
        return !containsAny(HIGH_CARB_KEYWORDS);
    }
    if (diet === 'CARNIVORE') {
        return containsAny(MEAT_KEYWORDS) || containsAny(['yumurta']);
    }
    return true;
};

// Gerçekçi 2026 Türkiye Pazar Fiyatlandırma Motoru (Tek Kişilik / Tarif Porsiyonu Bazlı)
const getIngredientMarketPrice = (ingName) => {
    const name = (ingName || '').toLowerCase();
    
    // Et & Şarküteri & Balık (1 Porsiyon / 200-250g Bazlı)
    if (name.includes('bonfile') || name.includes('antrikot')) return 140;
    if (name.includes('somon') || name.includes('karides')) return 110;
    if (name.includes('kuşbaşı') || name.includes('dana et') || name.includes('kavurma') || name.includes('et')) return 85;
    if (name.includes('kıyma') || name.includes('köfte')) return 75;
    if (name.includes('sucuk') || name.includes('pastırma') || name.includes('sosis')) return 45;
    if (name.includes('tavuk') || name.includes('hindi')) return 45;
    if (name.includes('ton balığı') || name.includes('levrek')) return 55;

    // Süt & Peynir & Kahvaltılık
    if (name.includes('parmesan')) return 40;
    if (name.includes('kaşar') || name.includes('mozzarella')) return 25;
    if (name.includes('tereyağı')) return 12;
    if (name.includes('krema')) return 18;
    if (name.includes('süzme yoğurt') || name.includes('labne')) return 15;
    if (name.includes('yoğurt') || name.includes('süt')) return 10;
    if (name.includes('yumurta')) return 8;

    // Bakliyat & Karbonhidrat & Çerez
    if (name.includes('kinoa') || name.includes('avokado')) return 30;
    if (name.includes('ceviz') || name.includes('fındık') || name.includes('antep fıstığı')) return 25;
    if (name.includes('kırmızı mercimek') || name.includes('yeşil mercimek') || name.includes('nohut') || name.includes('fasulye')) return 12;
    if (name.includes('pirinç') || name.includes('bulgur') || name.includes('kuskus')) return 10;
    if (name.includes('makarna') || name.includes('noodle') || name.includes('erişte') || name.includes('spagetti')) return 8;
    if (name.includes('un') || name.includes('irmik') || name.includes('galeta')) return 5;

    // Sebze & Meyve
    if (name.includes('mantar')) return 18;
    if (name.includes('patlıcan') || name.includes('kabak') || name.includes('enginar')) return 15;
    if (name.includes('patates') || name.includes('havuç')) return 6;
    if (name.includes('domates') || name.includes('biber') || name.includes('salatalık')) return 8;
    if (name.includes('soğan') || name.includes('sarımsak') || name.includes('limon')) return 4;
    if (name.includes('yeşillik') || name.includes('roka') || name.includes('marul') || name.includes('maydanoz') || name.includes('nane')) return 5;

    // Tatlı & Şeker & Soslar
    if (name.includes('çikolata') || name.includes('kakao')) return 20;
    if (name.includes('bal') || name.includes('tahin') || name.includes('pekmez')) return 18;
    if (name.includes('şeker') || name.includes('vanilya') || name.includes('kabartma')) return 5;
    if (name.includes('zeytinyağı') || name.includes('yağ')) return 12;
    if (name.includes('salça') || name.includes('sos')) return 10;
    if (name.includes('baharat') || name.includes('tuz') || name.includes('karabiber') || name.includes('kekik')) return 3;

    return 8;
};

const parseCaloriesNumber = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const num = parseInt(String(val).replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 0 : num;
};

// Gerçekçi Gramaj & Kalori & Malzeme Fiyat Hesaplayıcı
const getNutritionalDetails = (recipe) => {
    const time = recipe.time || 25;
    const heaviness = recipe.heaviness || 3;
    const calories = parseCaloriesNumber(recipe.calories) || Math.round(heaviness * 65 + 100);

    let calculatedCost = 0;

    const ingsFormatted = (recipe.ingredients || []).map(ing => {
        const ingName = typeof ing === 'string' ? ing : (ing.name || '');
        let qty = "100g";
        if (ingName.includes('yağ') || ingName.includes('tereyağı') || ingName.includes('zeytinyağı')) qty = "2 yemek kaşığı (30ml)";
        else if (ingName.includes('tuz') || ingName.includes('karabiber') || ingName.includes('kekik') || ingName.includes('nane') || ingName.includes('kimyon')) qty = "1 çay kaşığı (5g)";
        else if (ingName.includes('soğan') || ingName.includes('domates') || ingName.includes('patates') || ingName.includes('havuç') || ingName.includes('limon')) qty = "1 adet (orta boy)";
        else if (ingName.includes('kıyma') || ingName.includes('kuşbaşı') || ingName.includes('tavuk') || ingName.includes('somon')) qty = "250g (kişi başı)";
        else if (ingName.includes('yoğurt') || ingName.includes('süt') || ingName.includes('krema')) qty = "1 su bardağı (200ml)";
        else if (ingName.includes('pirinç') || ingName.includes('bulgur') || ingName.includes('makarna') || ingName.includes('irmik')) qty = "1 çay bardağı (80g)";
        else if (ingName.includes('ceviz') || ingName.includes('antep fıstığı') || ingName.includes('fındık')) qty = "1 avuç (30g)";

        const price = getIngredientMarketPrice(ingName);
        calculatedCost += price;

        return { name: ingName, qty, price };
    });

    const cost = recipe.cost ? Math.max(recipe.cost, calculatedCost) : calculatedCost;

    return { cost: Number(cost) || 0, time: Number(time) || 25, calories: Number(calories) || 300, ingsFormatted };
};

export default function DailyMenuFlow({ onBack, openShopping, acceptMenuAction, openFocusMode }) {
    const [dietFilter, setDietFilter] = useState('ALL');
    const [budgetFilter, setBudgetFilter] = useState('ALL');
    const [cuisineFilter, setCuisineFilter] = useState('ALL');
    const [maxTimeFilter, setMaxTimeFilter] = useState('ALL');
    const [calorieTarget, setCalorieTarget] = useState('ALL');
    const [moodFilter, setMoodFilter] = useState('ALL'); // ALL, FAST_15, ONE_POT, SUPER_LIGHT
    const [currentMenu, setCurrentMenu] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [menuHistory, setMenuHistory] = useState([]);
    
    // Favori ve Modal Yönetimi
    const [favorites, setFavorites] = useState([]);
    const [selectedRecipeModal, setSelectedRecipeModal] = useState(null);
    const [shoppingListModalOpen, setShoppingListModalOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [savingReportModal, setSavingReportModal] = useState(null);
    const [pamperingIndex, setPamperingIndex] = useState(0);
    const [isRotating, setIsRotating] = useState(false);
    const nextPamperingTip = () => {
        setIsRotating(true);
        setPamperingIndex(prev => (prev + 1) % PAMPERING_TIPS.length);
        setTimeout(() => setIsRotating(false), 400);
    };
    const [userPantry, setUserPantry] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('baki_user_pantry') || '{}');
        } catch(e) { return {}; }
    });

    const togglePantryItem = (ingName) => {
        const updated = { ...userPantry, [ingName]: !userPantry[ingName] };
        setUserPantry(updated);
        localStorage.setItem('baki_user_pantry', JSON.stringify(updated));
    };

    const favKey = 'baki_favs';

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('baki_daily_menu_history') || '[]');
        setMenuHistory(savedHistory);

        const savedFavs = JSON.parse(localStorage.getItem(favKey) || '[]');
        setFavorites(savedFavs);

        generateDailyMenu(dietFilter, budgetFilter, cuisineFilter, calorieTarget, maxTimeFilter, moodFilter, savedHistory);
    }, []);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(""), 3000);
    };

    const toggleFavorite = (recipe) => {
        let currentFavs = JSON.parse(localStorage.getItem(favKey) || '[]');
        const exists = currentFavs.some(f => f.name === recipe.name || f.id === recipe.id);

        let updatedFavs;
        if (exists) {
            updatedFavs = currentFavs.filter(f => f.name !== recipe.name && f.id !== recipe.id);
            showToast(`💔 "${recipe.name}" favorilerden çıkarıldı.`);
        } else {
            updatedFavs = [...currentFavs, recipe];
            showToast(`❤️ "${recipe.name}" favorilerinize başarıyla eklendi!`);
        }

        setFavorites(updatedFavs);
        localStorage.setItem(favKey, JSON.stringify(updatedFavs));
    };

    const isFav = (recipe) => {
        return favorites.some(f => f.name === recipe.name || f.id === recipe.id);
    };

    const isOnePotRecipe = (recipe) => {
        if (!recipe) return false;
        const name = (recipe.name || '').toLowerCase();
        const desc = (recipe.recipeDesc || '').toLowerCase();
        return name.includes('tava') || name.includes('tencere') || name.includes('sote') || name.includes('fırın') || name.includes('sulu') || name.includes('çorba') || desc.includes('tek tencere') || desc.includes('tek tava');
    };

    const generateDailyMenu = (diet = dietFilter, budget = budgetFilter, cuisine = cuisineFilter, calTarget = calorieTarget, timeCap = maxTimeFilter, mood = moodFilter, historyList = menuHistory) => {
        setIsGenerating(true);

        setTimeout(() => {
            const allMains = [...DB_MAINS, ...DB_MAINS_HUGE];

            // FAILSAFE RELAXATION ENGINE (Asla Boş Ekran Göstermeyen Akıllı Gevşetme Motoru)
            let isRelaxed = false;
            let relaxedReason = "";

            let soups = DB_SOUPS.filter(r => isRecipeCompliant(r, diet));
            let mains = allMains.filter(r => isRecipeCompliant(r, diet));
            let carbs = DB_CARBS.filter(r => isRecipeCompliant(r, diet));
            let salads = DB_SALADS.filter(r => isRecipeCompliant(r, diet));
            let desserts = DB_DESSERTS.filter(r => isRecipeCompliant(r, diet));

            // Mutfak Filtresi
            if (cuisine === 'TURKISH') {
                const sFilter = (r) => r.type === 'LOCAL' || r.type === 'TURKISH';
                if (soups.some(sFilter)) soups = soups.filter(sFilter);
                if (mains.some(sFilter)) mains = mains.filter(sFilter);
                if (carbs.some(sFilter)) carbs = carbs.filter(sFilter);
            } else if (cuisine === 'WORLD') {
                const sFilter = (r) => r.type === 'FOREIGN';
                if (soups.some(sFilter)) soups = soups.filter(sFilter);
                if (mains.some(sFilter)) mains = mains.filter(sFilter);
                if (carbs.some(sFilter)) carbs = carbs.filter(sFilter);
            }

            // Ruh Hali / Enerji Filtresi
            if (mood === 'FAST_15') {
                const s15 = (r) => (r.time || 20) <= 20;
                const m15 = (r) => (r.time || 25) <= 25;
                if (soups.some(s15)) soups = soups.filter(s15);
                if (mains.some(m15)) mains = mains.filter(m15);
                if (carbs.some(s15)) carbs = carbs.filter(s15);
            } else if (mood === 'ONE_POT') {
                const onePotMains = mains.filter(r => isOnePotRecipe(r));
                if (onePotMains.length > 0) mains = onePotMains;
            } else if (mood === 'SUPER_LIGHT') {
                const sLight = (r) => parseCaloriesNumber(r.calories) <= 250;
                const mLight = (r) => parseCaloriesNumber(r.calories) <= 450;
                if (soups.some(sLight)) soups = soups.filter(sLight);
                if (mains.some(mLight)) mains = mains.filter(mLight);
            }

            // Fallback listeleri (Sıfır yemek riski ortadan kaldırıldı)
            if (soups.length === 0) { soups = DB_SOUPS; isRelaxed = true; }
            if (mains.length === 0) { mains = allMains; isRelaxed = true; }
            if (carbs.length === 0) { carbs = DB_CARBS; isRelaxed = true; }
            if (salads.length === 0) { salads = DB_SALADS; isRelaxed = true; }
            if (desserts.length === 0) { desserts = DB_DESSERTS; isRelaxed = true; }

            if (isRelaxed) {
                relaxedReason = "✨ Seçtiğiniz kombinasyon çok kısıtlayıcı olduğu için lezzet dengesi korunarak en yakın 5 kaplık alternatif menü oluşturuldu.";
            }

            // KENDİNİ TEKRAR ETMEYEN RASTGELE VEYA BÜTÇE ODAKLI 5'Lİ MENÜ SEÇİMİ
            let selectedMenu = null;
            let attempts = 0;
            const maxAttempts = 100;

            // Bütçe Dostu (En Ekonomik) Mod seçildiyse ucuzdan pahalıya sırala
            if (budget === 'BUDGET_MIN') {
                soups.sort((a, b) => getNutritionalDetails(a).cost - getNutritionalDetails(b).cost);
                mains.sort((a, b) => getNutritionalDetails(a).cost - getNutritionalDetails(b).cost);
                carbs.sort((a, b) => getNutritionalDetails(a).cost - getNutritionalDetails(b).cost);
                salads.sort((a, b) => getNutritionalDetails(a).cost - getNutritionalDetails(b).cost);
                desserts.sort((a, b) => getNutritionalDetails(a).cost - getNutritionalDetails(b).cost);
            }

            while (attempts < maxAttempts) {
                // Rastgele seçerken son geçmiştekileri ele
                const s = budget === 'BUDGET_MIN' ? soups[attempts % soups.length] : soups[Math.floor(Math.random() * soups.length)];
                const m = budget === 'BUDGET_MIN' ? mains[attempts % mains.length] : mains[Math.floor(Math.random() * mains.length)];
                const c = budget === 'BUDGET_MIN' ? carbs[attempts % carbs.length] : carbs[Math.floor(Math.random() * carbs.length)];
                const sal = budget === 'BUDGET_MIN' ? salads[attempts % salads.length] : salads[Math.floor(Math.random() * salads.length)];
                const des = budget === 'BUDGET_MIN' ? desserts[attempts % desserts.length] : desserts[Math.floor(Math.random() * desserts.length)];

                const menuId = `${s.id}_${m.id}_${c.id}_${sal.id}_${des.id}`;

                const sDetails = getNutritionalDetails(s);
                const mDetails = getNutritionalDetails(m);
                const cDetails = getNutritionalDetails(c);
                const salDetails = getNutritionalDetails(sal);
                const desDetails = getNutritionalDetails(des);

                const totalCost = Number(sDetails.cost) + Number(mDetails.cost) + Number(cDetails.cost) + Number(salDetails.cost) + Number(desDetails.cost);
                const totalCalories = Number(sDetails.calories) + Number(mDetails.calories) + Number(cDetails.calories) + Number(salDetails.calories) + Number(desDetails.calories);
                const totalTime = Math.max(sDetails.time, mDetails.time, cDetails.time, salDetails.time, desDetails.time) + 15;

                let budgetMatch = true;
                if (budget === 'BUDGET' && totalCost > 240) budgetMatch = false;
                if (budget === 'MEDIUM' && (totalCost < 240 || totalCost > 450)) budgetMatch = false;
                if (budget === 'FEAST' && totalCost < 450) budgetMatch = false;

                let calMatch = true;
                let timeMatch = true;
                if (timeCap === 'FAST' && totalTime > 40) timeMatch = false;
                if (calTarget === 'LIGHT' && totalCalories > 850) calMatch = false;
                if (calTarget === 'BALANCED' && (totalCalories < 850 || totalCalories > 1300)) calMatch = false;
                if (calTarget === 'HEAVY' && totalCalories < 1300) calMatch = false;

                if (!historyList.includes(menuId) && budgetMatch && calMatch && timeMatch) {
                    selectedMenu = {
                        id: menuId,
                        soup: { ...s, details: sDetails },
                        main: { ...m, details: mDetails },
                        carb: { ...c, details: cDetails },
                        salad: { ...sal, details: salDetails },
                        dessert: { ...des, details: desDetails },
                        totalCost,
                        totalCalories,
                        totalTime
                    };
                    break;
                }
                attempts++;
            }

            if (!selectedMenu) {
                // Rastgeleliği korumak için listeden rastgele indeks seç
                const sIndex = Math.floor(Math.random() * soups.length);
                const mIndex = Math.floor(Math.random() * mains.length);
                const cIndex = Math.floor(Math.random() * carbs.length);
                const salIndex = Math.floor(Math.random() * salads.length);
                const desIndex = Math.floor(Math.random() * desserts.length);

                const s = soups[sIndex] || DB_SOUPS[0];
                const m = mains[mIndex] || DB_MAINS[0];
                const c = carbs[cIndex] || DB_CARBS[0];
                const sal = salads[salIndex] || DB_SALADS[0];
                const des = desserts[desIndex] || DB_DESSERTS[0];
                const sDetails = getNutritionalDetails(s);
                const mDetails = getNutritionalDetails(m);
                const cDetails = getNutritionalDetails(c);
                const salDetails = getNutritionalDetails(sal);
                const desDetails = getNutritionalDetails(des);
                selectedMenu = {
                    id: `${s.id}_${m.id}_${c.id}_${sal.id}_${des.id}_${Date.now()}`,
                    soup: { ...s, details: sDetails },
                    main: { ...m, details: mDetails },
                    carb: { ...c, details: cDetails },
                    salad: { ...sal, details: salDetails },
                    dessert: { ...des, details: desDetails },
                    totalCost: Number(sDetails.cost) + Number(mDetails.cost) + Number(cDetails.cost) + Number(salDetails.cost) + Number(desDetails.cost),
                    totalCalories: Number(sDetails.calories) + Number(mDetails.calories) + Number(cDetails.calories) + Number(salDetails.calories) + Number(desDetails.calories),
                    totalTime: Math.max(sDetails.time, mDetails.time, cDetails.time) + 15
                };
            }

            const updatedHistory = [selectedMenu.id, ...historyList].slice(0, 50);
            setMenuHistory(updatedHistory);
            localStorage.setItem('baki_daily_menu_history', JSON.stringify(updatedHistory));

            setCurrentMenu(selectedMenu);
            setIsGenerating(false);
        }, 300);
    };

    const handleFilterChange = (newDiet, newBudget, newCuisine, newCal, newTime = maxTimeFilter, newMood = moodFilter) => {
        setDietFilter(newDiet);
        setBudgetFilter(newBudget);
        setCuisineFilter(newCuisine);
        setCalorieTarget(newCal);
        setMaxTimeFilter(newTime);
        setMoodFilter(newMood);
        generateDailyMenu(newDiet, newBudget, newCuisine, newCal, newTime, newMood);
    };

    // Tüm 5 kap yemeğin malzemelerini birleştirme
    const getCombinedShoppingList = () => {
        if (!currentMenu) return [];
        const items = [currentMenu.soup, currentMenu.main, currentMenu.carb, currentMenu.salad, currentMenu.dessert];
        const combinedMap = {};

        items.forEach(item => {
            item.details.ingsFormatted.forEach(ing => {
                if (!combinedMap[ing.name]) {
                    combinedMap[ing.name] = ing.qty;
                }
            });
        });

        return Object.keys(combinedMap).map(name => ({ name, qty: combinedMap[name] }));
    };

    return (
        <div style={{ padding: '15px 0', maxWidth: '850px', margin: '0 auto' }}>
            {/* TOAST BİLDİRİMİ */}
            {toastMsg && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, background: '#1E293B', color: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {toastMsg}
                </div>
            )}

            {/* ÜST GERİ BUTONU & BAŞLIK */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button onClick={onBack} style={{ background: '#10B981', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 900, color: 'white', fontSize: '13px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                    ✅ Menüyü Onayla ve Kapat (Hub'a Dön)
                </button>
                <div style={{ fontSize: '12px', background: '#FEF3C7', color: '#D97706', padding: '6px 14px', borderRadius: '20px', fontWeight: 900 }}>
                    ✨ 5 Kaplık Tam Menü Motoru
                </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: 'white', padding: '26px', borderRadius: '26px', marginBottom: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🍱 Günün Yemek Menüsü (5 Kap)
                </h2>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: '1.6' }}>
                    Çorba, Ana Yemek, Karbonhidrat, Taze Salata ve Nefis Tatlıdan oluşan eksiksiz 5 kaplık menü kombinasyonu.
                </p>
            </div>

            {/* FİLTRELEME SEÇENEKLERİ PANELİ (ULTRA MODERN & ŞIK) */}
            <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)', padding: '24px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', marginBottom: '25px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                    <div>
                        <h3 style={{ fontSize: '17px', color: '#0F172A', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🎯 Menü Kişiselleştirme & Filtreleme
                        </h3>
                        <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>Damak tadınıza, diyetinize ve bütçenize tam uyan 5 kaplık menünüzü şekillendirin.</p>
                    </div>
                    <button 
                        onClick={() => handleFilterChange('ALL', 'ALL', 'ALL', 'ALL', 'ALL')} 
                        style={{ background: '#F1F5F9', border: 'none', color: '#64748B', padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        🔄 Sıfırla
                    </button>
                </div>

                {/* RUH HALİ & ENERJİ MODLARI (YENİ SÜPER PRATİK FİLTRELER) */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        ⚡ RUH HALİ & ENERJİ MODU
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                        {[
                            { code: 'ALL', label: '😊 Standart Mod', desc: 'Tüm pratik lezzetler' },
                            { code: 'FAST_15', label: '⚡ 15-20 Dk Hazır', desc: 'Çok açım, hızlıca dolsun' },
                            { code: 'ONE_POT', label: '🍳 Tek Tava / Az Bulaşık', desc: 'Yorgunum, bulaşık olmasın' },
                            { code: 'SUPER_LIGHT', label: '🍃 Hafif & Fit', desc: 'Mideyi yormayan tarifler' }
                        ].map(m => {
                            const active = moodFilter === m.code;
                            return (
                                <button
                                    key={m.code}
                                    onClick={() => handleFilterChange(dietFilter, budgetFilter, cuisineFilter, calorieTarget, maxTimeFilter, m.code)}
                                    style={{
                                        padding: '10px 12px', borderRadius: '14px', textAlign: 'left', cursor: 'pointer',
                                        border: active ? '2px solid #8B5CF6' : '1px solid #E2E8F0',
                                        background: active ? '#F5F3FF' : 'white',
                                        boxShadow: active ? '0 4px 12px rgba(139,92,246,0.15)' : 'none',
                                        transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', gap: '2px'
                                    }}
                                >
                                    <span style={{ fontSize: '12px', fontWeight: 900, color: active ? '#6D28D9' : '#1E293B' }}>{m.label}</span>
                                    <span style={{ fontSize: '10px', color: active ? '#7C3AED' : '#94A3B8' }}>{m.desc}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* DİYET TERCİHİ KARTLARI */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        🌱 DİYET & BESLENME TARZI
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                        {[
                            { code: 'ALL', label: '🌟 Standart / Tümü', desc: 'Sınırsız lezzetler' },
                            { code: 'VEGETARIAN', label: '🥗 Vejetaryen', desc: 'Et içermez' },
                            { code: 'VEGAN', label: '🌱 Vegan', desc: 'Bitkisel bazlı' },
                            { code: 'GLUTEN_FREE', label: '🌾 Glutensiz', desc: 'Un & Şehriyesiz' },
                            { code: 'DIABETIC', label: '🩺 Şekersiz / Fit', desc: 'Düşük glisemik' },
                            { code: 'CARNIVORE', label: '🥩 Etobur / Keto', desc: 'Protein ağırlıklı' }
                        ].map(f => {
                            const active = dietFilter === f.code;
                            return (
                                <button
                                    key={f.code}
                                    onClick={() => handleFilterChange(f.code, budgetFilter, cuisineFilter, calorieTarget, maxTimeFilter, moodFilter)}
                                    style={{
                                        padding: '10px 12px', borderRadius: '14px', textAlign: 'left', cursor: 'pointer',
                                        border: active ? '2px solid #10B981' : '1px solid #E2E8F0',
                                        background: active ? '#ECFDF5' : 'white',
                                        boxShadow: active ? '0 4px 12px rgba(16,185,129,0.15)' : 'none',
                                        transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', gap: '2px'
                                    }}
                                >
                                    <span style={{ fontSize: '12px', fontWeight: 900, color: active ? '#047857' : '#1E293B' }}>{f.label}</span>
                                    <span style={{ fontSize: '10px', color: active ? '#059669' : '#94A3B8' }}>{f.desc}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* DETAYLI İKİLİ FİLTRE GRUBU (BÜTÇE & KALORİ & SÜRE & MUTFAK) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    
                    {/* BÜTÇE */}
                    <div style={{ background: 'white', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                        <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '6px' }}>💰 BÜTÇE ARALIĞI</label>
                        <select
                            value={budgetFilter}
                            onChange={e => handleFilterChange(dietFilter, e.target.value, cuisineFilter, calorieTarget, maxTimeFilter, moodFilter)}
                            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontWeight: 800, fontSize: '12px', color: '#0F172A', outline: 'none' }}
                        >
                            <option value="ALL">💚 Tümü (Fark Etmez)</option>
                            <option value="BUDGET_MIN">💸 Bütçe Dostu (En Ucuz 5 Kap)</option>
                            <option value="BUDGET">🏷️ Ekonomik (0 - 240 TL)</option>
                            <option value="MEDIUM">⚖️ Dengeli (240 - 450 TL)</option>
                            <option value="FEAST">👑 Ziyafet (450+ TL)</option>
                        </select>
                    </div>

                    {/* KALORİ */}
                    <div style={{ background: 'white', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                        <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '6px' }}>🔥 KALORİ HEDEFİ</label>
                        <select
                            value={calorieTarget}
                            onChange={e => handleFilterChange(dietFilter, budgetFilter, cuisineFilter, e.target.value, maxTimeFilter, moodFilter)}
                            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontWeight: 800, fontSize: '12px', color: '#0F172A', outline: 'none' }}
                        >
                            <option value="ALL">🌟 Tümü (Fark Etmez)</option>
                            <option value="LIGHT">🍃 Hafif (&lt; 850 kcal)</option>
                            <option value="BALANCED">⚖️ Formda (850 - 1300 kcal)</option>
                            <option value="HEAVY">⚡ Enerjik (&gt; 1300 kcal)</option>
                        </select>
                    </div>

                    {/* MUTFAK */}
                    <div style={{ background: 'white', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                        <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '6px' }}>🌍 MUTFAK KÜLTÜRÜ</label>
                        <select
                            value={cuisineFilter}
                            onChange={e => handleFilterChange(dietFilter, budgetFilter, e.target.value, calorieTarget, maxTimeFilter)}
                            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontWeight: 800, fontSize: '12px', color: '#0F172A', outline: 'none' }}
                        >
                            <option value="ALL">✨ Tüm Mutfaklar</option>
                            <option value="TURKISH">🇹🇷 Türk & Yöresel Ev</option>
                            <option value="WORLD">🌎 Dünya Mutfağı</option>
                        </select>
                    </div>

                    {/* PRATİKLİK / SÜRE */}
                    <div style={{ background: 'white', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                        <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '6px' }}>⏱️ HIZ & PRATİKLİK</label>
                        <select
                            value={maxTimeFilter}
                            onChange={e => handleFilterChange(dietFilter, budgetFilter, cuisineFilter, calorieTarget, e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontWeight: 800, fontSize: '12px', color: '#0F172A', outline: 'none' }}
                        >
                            <option value="ALL">👨‍🍳 Fark Etmez (Tüm Süreler)</option>
                            <option value="FAST">⚡ Hızlı & Pratik (≤ 35 Dk)</option>
                        </select>
                    </div>

                </div>
            </div>

            {/* YENİLE / RASTGELE MENÜ ÖNER & PAZAR LİSTESİ BUTONLARI */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '25px' }}>
                <button
                    onClick={() => generateDailyMenu()}
                    disabled={isGenerating}
                    style={{
                        background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: 'white', border: 'none',
                        padding: '14px 24px', borderRadius: '30px', fontWeight: 900, fontSize: '14px', cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(59,130,246,0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    {isGenerating ? '⏳ Menü Hazırlanıyor...' : '🎲 Başka Bir Günün Menüsünü Öner'}
                </button>

                {currentMenu && (
                    <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                        <button
                            onClick={() => {
                                if (currentMenu) {
                                    const cost = currentMenu.totalCost || 450;
                                    if (acceptMenuAction) acceptMenuAction(cost);
                                    const saving = Math.round(cost * 0.3);
                                    setSavingReportModal({
                                        title: '🎉 5 Kaplık Günün Menüsü Pişiriliyor!',
                                        cost: cost,
                                        saving: saving,
                                        outCost: Math.round(cost * 1.3)
                                    });
                                }
                            }}
                            style={{
                                background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', border: 'none',
                                padding: '14px 24px', borderRadius: '30px', fontWeight: 900, fontSize: '14px', cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(245,158,11,0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            🍳 Bu Menüyü Yapmaya Karar Verdim! (Tasarruf Hesapla)
                        </button>

                        <button
                            onClick={() => {
                                if (openShopping && currentMenu) {
                                    openShopping({
                                        soup: currentMenu.soup,
                                        main: currentMenu.main,
                                        carb: currentMenu.carb,
                                        salad: currentMenu.salad,
                                        dessert: currentMenu.dessert
                                    });
                                }
                            }}
                            style={{
                                background: 'linear-gradient(135deg, #10B981, #047857)', color: 'white', border: 'none',
                                padding: '14px 24px', borderRadius: '30px', fontWeight: 900, fontSize: '14px', cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(16,185,129,0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            🛒 5 Kaplık Toplu Pazar Listesi & Market Siparişi
                        </button>
                    </div>
                )}
            </div>

            {/* GÜNÜN MENÜSÜ KARTLARI */}
            {currentMenu && (
                <div>
                    {/* ÖZET İSTATİSTİK BAR */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ background: '#ECFDF5', padding: '15px', borderRadius: '16px', border: '1px solid #A7F3D0', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: '#047857', fontWeight: 800 }}>TAHMİNİ MALİYET</div>
                            <div style={{ fontSize: '20px', color: '#065F46', fontWeight: 900, marginTop: '2px' }}>₺{currentMenu.totalCost}</div>
                        </div>
                        <div style={{ background: '#FFFBEB', padding: '15px', borderRadius: '16px', border: '1px solid #FDE68A', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: '#B45309', fontWeight: 800 }}>TOPLAM KALORİ</div>
                            <div style={{ fontSize: '20px', color: '#92400E', fontWeight: 900, marginTop: '2px' }}>{currentMenu.totalCalories} kcal</div>
                        </div>
                        <div style={{ background: '#EFF6FF', padding: '15px', borderRadius: '16px', border: '1px solid #BFDBFE', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: '#1D4ED8', fontWeight: 800 }}>HAZIRLIK SÜRESİ</div>
                            <div style={{ fontSize: '20px', color: '#1E40AF', fontWeight: 900, marginTop: '2px' }}>{currentMenu.totalTime} dk</div>
                        </div>
                    </div>

                    {/* 5 PARÇALI YEMEK KARTLARI */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                        {[
                            { title: '🍲 1. Başlangıç: Çorba', item: currentMenu.soup },
                            { title: '🥩 2. Ana Yemek', item: currentMenu.main },
                            { title: '🍚 3. Karbonhidrat / Yan Yemek', item: currentMenu.carb },
                            { title: '🥗 4. Taze Salata & Meze', item: currentMenu.salad },
                            { title: '🍰 5. Nefis Tatlı', item: currentMenu.dessert }
                        ].map((mItem, idx) => (
                            <div key={idx} style={{ background: 'white', borderRadius: '22px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                
                                {/* FAVORİ BUTONU */}
                                <button
                                    onClick={() => toggleFavorite(mItem.item)}
                                    style={{
                                        position: 'absolute', top: '16px', right: '16px', background: isFav(mItem.item) ? '#FFF1F2' : '#F8FAFC',
                                        border: isFav(mItem.item) ? '1px solid #FECDD3' : '1px solid #E2E8F0',
                                        borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', fontSize: '16px', transition: '0.2s'
                                    }}
                                    title="Favorilere Ekle / Çıkar"
                                >
                                    {isFav(mItem.item) ? '❤️' : '🤍'}
                                </button>

                                <div style={{ fontSize: '11px', fontWeight: 900, color: '#3B82F6', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {mItem.title}
                                </div>

                                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', marginBottom: '8px', paddingRight: '40px' }}>
                                    {mItem.item.name}
                                </h3>

                                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748B', marginBottom: '14px', fontWeight: 700 }}>
                                    <span>⏱️ {mItem.item.details.time} dk</span>
                                    <span>🔥 {mItem.item.details.calories} kcal</span>
                                    <span>💰 ₺{mItem.item.details.cost}</span>
                                </div>

                                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #F1F5F9' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>🛒 Malzemeler:</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {mItem.item.details.ingsFormatted.map((ing, i) => (
                                            <span key={i} style={{ background: 'white', border: '1px solid #CBD5E1', padding: '4px 9px', borderRadius: '10px', fontSize: '11px', color: '#334155', fontWeight: 700 }}>
                                                {ing.name} <span style={{color: '#64748B', fontWeight: 500}}>({ing.qty})</span> • <strong style={{color: '#059669'}}>₺{ing.price}</strong>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* TARİFİ NET GÖR MODAL AÇMA BUTONU */}
                                <button
                                    onClick={() => setSelectedRecipeModal(mItem.item)}
                                    style={{
                                        width: '100%', padding: '10px', background: '#F1F5F9', border: '1px solid #CBD5E1',
                                        borderRadius: '12px', fontWeight: 800, color: '#1E293B', fontSize: '13px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: 'auto'
                                    }}
                                >
                                    <span>📖 Tarifi & Adımları Detaylı Gör</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- 📖 DETAYLI TARİF MODALI --- */}
            {selectedRecipeModal && (() => {
                const dishDetails = getCleanDishDetails(selectedRecipeModal);
                return (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '28px', maxWidth: '550px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}>
                        <button
                            onClick={() => setSelectedRecipeModal(null)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800, fontSize: '16px' }}
                        >
                            ✕
                        </button>

                        <div style={{ fontSize: '12px', background: '#EEF2FF', color: '#4F46E5', padding: '4px 12px', borderRadius: '12px', fontWeight: 800, display: 'inline-block', marginBottom: '8px' }}>
                            DETAYLI REÇETE
                        </div>

                        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>
                            {dishDetails.cleanName}
                        </h2>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: '#F8FAFC', padding: '12px', borderRadius: '14px', marginBottom: '20px', fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                            <span style={{background: '#F1F5F9', padding: '6px 12px', borderRadius: '8px'}}>⏱️ Süre: {selectedRecipeModal.details?.time || 30} Dk</span>
                            <span style={{background: '#EEF2FF', color: '#4338CA', padding: '6px 12px', borderRadius: '8px'}}>🔥 Kalori: {selectedRecipeModal.details?.calories || 300} kcal</span>
                            <span style={{background: '#FEF3C7', color: '#B45309', padding: '6px 12px', borderRadius: '8px'}}>💰 Maliyet: ₺{selectedRecipeModal.details?.cost || 50}</span>
                        </div>

                        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>🛒 Ölçülü Malzemeler:</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                            {selectedRecipeModal.details?.ingsFormatted?.map((ing, i) => (
                                <span key={i} style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', color: '#065F46', fontWeight: 700 }}>
                                    {ing.name} ({ing.qty}) - <span style={{color: '#047857', fontWeight: 900}}>₺{ing.price}</span>
                                </span>
                            ))}
                        </div>

                        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>👨‍🍳 Adım Adım Hazırlanışı:</h4>
                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', fontSize: '13px', lineHeight: '1.7', color: '#334155', whiteSpace: 'pre-line', borderLeft: '4px solid #3B82F6' }}>
                            {selectedRecipeModal.recipeDesc || "1. Malzemeleri taze şekilde hazırlayın ve yıkayın.\n2. Tencerede uygun ısıda soteleyerek pişirme adımlarını tamamlayın.\n3. Sıcak olarak taze baharatlarla servis edin."}
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {openFocusMode && (
                                <button
                                    onClick={() => {
                                        const recipeForFocus = {
                                            name: dishDetails.cleanName,
                                            region: dishDetails.region,
                                            prepTime: selectedRecipeModal.details?.time || 30,
                                            calories: selectedRecipeModal.details?.calories || 300,
                                            cost: selectedRecipeModal.details?.cost || 50,
                                            recipe: selectedRecipeModal.recipeDesc || "1. Malzemeleri taze şekilde hazırlayın ve yıkayın.\n2. Tencerede uygun ısıda soteleyerek pişirme adımlarını tamamlayın.\n3. Sıcak olarak taze baharatlarla servis edin."
                                        };
                                        setSelectedRecipeModal(null);
                                        openFocusMode(recipeForFocus);
                                    }}
                                    style={{
                                        width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                                        background: '#10B981', color: 'white', fontWeight: 900, fontSize: '14px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                                    }}
                                >
                                    👁️ Mutfak Odak Modu (Ekran Kapanmaz)
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    const cost = selectedRecipeModal.details?.cost || 80;
                                    if (acceptMenuAction) acceptMenuAction(cost);
                                    const saving = Math.round(cost * 0.3);
                                    setSelectedRecipeModal(null);
                                    setSavingReportModal({
                                        title: '🎉 ' + dishDetails.cleanName + ' Pişiriliyor!',
                                        cost: cost,
                                        saving: saving,
                                        outCost: Math.round(cost * 1.3)
                                    });
                                }}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                                    background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', fontWeight: 900, fontSize: '14px', cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
                                }}
                            >
                                🍳 Bu Yemeği Yapmaya Karar Verdim! ({Math.round((selectedRecipeModal.details?.cost || 80) * 0.3)} TL Tasarruf Et)
                            </button>
                            
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button
                                    onClick={() => setSelectedRecipeModal(null)}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '14px', border: 'none',
                                        background: '#475569', color: 'white', fontWeight: 800, fontSize: '13px', cursor: 'pointer'
                                    }}
                                >
                                    ✅ Kapat
                                </button>
                                <button
                                    onClick={() => toggleFavorite(selectedRecipeModal)}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '14px', border: 'none',
                                        background: isFav(selectedRecipeModal) ? '#EF4444' : '#3B82F6',
                                        color: 'white', fontWeight: 800, fontSize: '13px', cursor: 'pointer'
                                    }}
                                >
                                    {isFav(selectedRecipeModal) ? '💔 Favorilerden Çıkar' : '❤️ Favorilerime Ekle'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                );
            })()}

            
            {/* --- 💰 TASARRUF RAPORU POPUP MODALI --- */}
            {savingReportModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001, padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '28px', padding: '32px', maxWidth: '500px', width: '100%', position: 'relative', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
                        
                        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>
                            {savingReportModal.title}
                        </h2>
                        
                        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
                            Harika bir seçim! Evde Baki'nin Mutfağı ile pişirerek bütçenizi korudunuz.
                        </p>

                        <div style={{ background: '#ECFDF5', border: '2px solid #A7F3D0', borderRadius: '20px', padding: '20px', marginBottom: '24px' }}>
                            <div style={{ fontSize: '12px', color: '#047857', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>NET CEBİNİZDE KALAN KAZANÇ</div>
                            <div style={{ fontSize: '36px', fontWeight: 900, color: '#059669', margin: '6px 0' }}>₺{savingReportModal.saving}</div>
                            <div style={{ fontSize: '12px', color: '#065F46', fontWeight: 700 }}>Baki'nin Mutfağı Ev Tasarruf Bonusu 🚀</div>
                        </div>

                        {/* --- 👨‍🍳 ŞEFİN ŞIMARTMA TAVSİYESİ (DÖNEN OKLAR İLE) --- */}
                        <div style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', border: '2px solid #F59E0B', borderRadius: '20px', padding: '16px', marginBottom: '20px', textAlign: 'left', position: 'relative', boxShadow: '0 4px 12px rgba(245,158,11,0.15)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 900, color: '#92400E', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                    👨‍🍳 Şef Demet'ten Şımartma Tavsiyesi <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.25)', color: '#78350F', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>Alternatif {pamperingIndex + 1}/{PAMPERING_TIPS.length}</span>
                                </div>
                                <button 
                                    onClick={nextPamperingTip} 
                                    title="Farklı Bir Şımartma Tavsiyesi Değiştir"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', border: 'none', 
                                        borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', 
                                        justifyContent: 'center', cursor: 'pointer', fontSize: '20px', boxShadow: '0 3px 8px rgba(245,158,11,0.4)',
                                        transform: isRotating ? 'rotate(360deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.4s ease-in-out'
                                    }}
                                >
                                    🔄
                                </button>
                            </div>
                            <div style={{ fontSize: '13px', color: '#78350F', fontWeight: 700, lineHeight: '1.5' }}>
                                {PAMPERING_TIPS[pamperingIndex]}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '25px', textTransform: 'none' }}>
                            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Dışarıda / Restoranda</div>
                                <div style={{ fontSize: '18px', fontWeight: 900, color: '#EF4444', marginTop: '4px' }}>₺{savingReportModal.outCost}</div>
                            </div>
                            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Evde Hazırlama</div>
                                <div style={{ fontSize: '18px', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>₺{savingReportModal.cost}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSavingReportModal(null)}
                            style={{
                                width: '100%', padding: '15px', borderRadius: '16px', border: 'none',
                                background: 'linear-gradient(135deg, #10B981, #047857)', color: 'white',
                                fontWeight: 900, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)'
                            }}
                        >
                            ✅ Harika! Raporu Kapat ve Pişirmeye Başla
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}