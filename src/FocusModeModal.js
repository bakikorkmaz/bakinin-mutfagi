import React, { useState, useEffect } from 'react';
import MarketOrderModal from './MarketOrderModal';
import { getCleanDishDetails } from './dishUtils';

export default function FocusModeModal({ dish, onClose, setActiveTimerMinutes }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [wakeLockActive, setWakeLockActive] = useState(false);
    const [wakeLockObj, setWakeLockObj] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [portionCount, setPortionCount] = useState(3);
    const [showMarketModal, setShowMarketModal] = useState(false);

    const dishDetails = React.useMemo(() => getCleanDishDetails(dish), [dish]);

    // Extract steps list from recipe
    const steps = React.useMemo(() => {
        if (!dish) return [];
        if (Array.isArray(dish.instructions)) return dish.instructions;
        if (typeof dish.instructions === 'string') {
            return dish.instructions.split('\n').filter(s => s.trim().length > 0);
        }
        if (dish.recipe) {
            return dish.recipe.split('\n').filter(s => s.trim().length > 0);
        }
        return ['Malzemeleri hazırlayın ve tarife başlayın.'];
    }, [dish]);

    // Screen Wake Lock API handler
    useEffect(() => {
        let sentinel = null;
        async function requestWakeLock() {
            if ('wakeLock' in navigator) {
                try {
                    sentinel = await navigator.wakeLock.request('screen');
                    setWakeLockObj(sentinel);
                    setWakeLockActive(true);
                } catch (err) {
                    console.warn('Wake Lock error:', err);
                    setWakeLockActive(false);
                }
            }
        }
        requestWakeLock();

        return () => {
            if (sentinel) {
                sentinel.release().catch(() => {});
            }
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Text-to-Speech (TTS) handler
    const speakStep = (text) => {
        if (!('speechSynthesis' in window)) {
            alert("Üzgünüz, cihazınız sesli okumayı desteklemiyor.");
            return;
        }
        window.speechSynthesis.cancel();

        if (isSpeaking) {
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    const toggleWakeLock = async () => {
        if (wakeLockActive && wakeLockObj) {
            await wakeLockObj.release().catch(() => {});
            setWakeLockObj(null);
            setWakeLockActive(false);
        } else if ('wakeLock' in navigator) {
            try {
                const s = await navigator.wakeLock.request('screen');
                setWakeLockObj(s);
                setWakeLockActive(true);
            } catch (e) {
                console.warn(e);
            }
        }
    };

    if (!dish) return null;

    // Market Modal Render
    if (showMarketModal) {
        return <MarketOrderModal dish={dish} onClose={() => setShowMarketModal(false)} />;
    }

    const currentStepText = steps[currentStepIndex] || '';

    // Check if current step contains minute mention
    const matchMin = currentStepText.match(/(\d+)\s*(dakika|dk)/i);
    const detectedMinutes = matchMin ? parseInt(matchMin[1], 10) : (dish.prepTime ? parseInt(dish.prepTime) : 30);

    // Realistic Dishware & Wash Calculations
    const isFırın = /fırın|tepsi|kek|börek/i.test(dish.name || '') || /fırın/i.test(dish.recipe || '');
    const isÇorba = /çorba/i.test(dish.name || '') || /çorba/i.test(dish.recipe || '');
    const isTava = /tava|kavurma|sote|köfte|tantuni/i.test(dish.name || '');

    const cookwareText = isFırın ? "🍳 1 Fırın Tepsisi, 🥣 1 Karıştırma Kabı" 
                       : isÇorba ? "🍲 1 Çorba Tenceresi, 🥣 1 Kepçe"
                       : isTava ? "🍳 1 Döküm Tava / Sac, 🥄 1 Spatula"
                       : "🍳 1 Pişirme Tenceresi, 🥣 1 Tahta Kaşık";

    const handWashMins = Math.round(4.0 + portionCount * 2.2);
    const dishwasherMins = Math.round(2.0 + portionCount * 0.5);

    const prepTimeDisplay = dish.prepTime ? (dish.prepTime.toString().includes('dk') ? dish.prepTime : dish.prepTime + ' Dk') : "30 Dk";
    const costDisplay = dish.totalCost || dish.cost ? `₺${dish.totalCost || dish.cost}` : null;
    const calorieDisplay = dish.calories ? `${dish.calories} kcal` : null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white', zIndex: 99999,
            display: 'flex', flexDirection: 'column', padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            overflowY: 'auto'
        }}>
            {/* ÜST MİMARİ BAR */}
            <div style={{
                background: 'rgba(30, 41, 59, 0.85)', backdropFilter: 'blur(12px)',
                border: '1px solid #334155', borderRadius: '20px', padding: '16px 20px',
                marginBottom: '15px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px'
            }}>
                <div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
                        <span style={{fontSize: '11px', background: '#0284C7', padding: '4px 12px', borderRadius: '20px', fontWeight: 900, color: 'white', letterSpacing: '0.5px'}}>
                            👨‍🍳 MUTFAK ODAK MODU
                        </span>
                        <span style={{fontSize: '12px', background: '#38BDF822', border: '1px solid #38BDF844', color: '#38BDF8', padding: '3px 10px', borderRadius: '12px', fontWeight: 800}}>
                            📍 Ait Olduğu Yöre: {dishDetails.region}
                        </span>
                    </div>
                    <h1 style={{fontSize: '22px', fontWeight: 900, margin: '8px 0 4px 0', color: '#F8FAFC', letterSpacing: '-0.5px'}}>
                        {dishDetails.cleanName}
                    </h1>
                    <div style={{display: 'flex', gap: '15px', fontSize: '13px', fontWeight: 700, color: '#94A3B8', flexWrap: 'wrap'}}>
                        <span>⏱️ Yemeğin Hazırlanma Süresi: <strong style={{color: '#F59E0B'}}>{prepTimeDisplay}</strong></span>
                        {costDisplay && <span>🏷️ Gramaj Maliyeti: <strong style={{color: '#10B981'}}>{costDisplay}</strong></span>}
                        {calorieDisplay && <span>🔥 Hesaplanan Kalori: <strong style={{color: '#8B5CF6'}}>{calorieDisplay}</strong></span>}
                    </div>
                </div>

                <div style={{display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap'}}>
                    <button 
                        onClick={() => setShowMarketModal(true)}
                        style={{
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            color: 'white', border: 'none', padding: '10px 18px',
                            borderRadius: '14px', fontSize: '13px', fontWeight: 900, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
                        }}
                    >
                        🛒 Malzeme Sipariş Et
                    </button>

                    <button 
                        onClick={toggleWakeLock}
                        style={{
                            background: wakeLockActive ? '#059669' : '#334155',
                            color: 'white', border: wakeLockActive ? '1px solid #10B981' : '1px solid #475569',
                            padding: '10px 14px', borderRadius: '14px', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                    >
                        {wakeLockActive ? '🟢 Ekran Kapanmaz' : '⚪ Ekran Kapanabilir'}
                    </button>
                    
                    <button 
                        onClick={onClose}
                        style={{background: '#1E293B', color: '#94A3B8', border: '1px solid #475569', width: '40px', height: '40px', borderRadius: '50%', fontSize: '18px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* BULAŞIK & EKİPMAN ANALİZİ BAR */}
            <div style={{
                background: 'rgba(30, 41, 59, 0.7)', border: '1px solid #334155', borderRadius: '16px', padding: '12px 18px',
                marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
            }}>
                <div>
                    <div style={{fontSize: '11px', fontWeight: 900, color: '#F59E0B', letterSpacing: '0.05em', textTransform: 'uppercase'}}>
                        🧽 Çıkacak Bulaşık & Yıkama Analizi
                    </div>
                    <div style={{fontSize: '13px', fontWeight: 700, color: '#CBD5E1', marginTop: '3px'}}>
                        {cookwareText}, 🍽️ {portionCount} Tabak, 🍴 {portionCount} Çatal/Kaşık, 🥤 {portionCount} Bardak
                    </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{textAlign: 'right'}}>
                        <div style={{fontSize: '12px', fontWeight: 900, color: '#10B981'}}>
                            🧼 Elde: ~{handWashMins} Dk | 🍽️ Makine: ~{dishwasherMins} Dk
                        </div>
                    </div>
                    <select 
                        value={portionCount} 
                        onChange={e => setPortionCount(parseInt(e.target.value))}
                        style={{background: '#0F172A', color: 'white', border: '1px solid #475569', borderRadius: '10px', padding: '6px 10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer'}}
                    >
                        <option value={1}>1 Kişilik Porsiyon</option>
                        <option value={2}>2 Kişilik Porsiyon</option>
                        <option value={3}>3 Kişilik Porsiyon</option>
                        <option value={4}>4 Kişilik Porsiyon</option>
                        <option value={6}>6 Kişilik Porsiyon</option>
                    </select>
                </div>
            </div>

            {/* İLERLEME ÇUBUĞU */}
            <div style={{display: 'flex', gap: '6px', marginBottom: '15px'}}>
                {steps.map((_, idx) => (
                    <div 
                        key={idx} 
                        style={{
                            flex: 1, height: '8px', borderRadius: '4px',
                            background: idx === currentStepIndex ? '#10B981' : (idx < currentStepIndex ? '#059669' : '#334155'),
                            transition: '0.3s'
                        }}
                    />
                ))}
            </div>

            {/* ADIM KARTI */}
            <div style={{
                flex: 1, background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(16px)',
                borderRadius: '24px', padding: '30px 24px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)', border: '1px solid #475569', textAlign: 'center',
                minHeight: '220px'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', flexWrap: 'wrap', justifyContent: 'center'}}>
                    <span style={{fontSize: '13px', fontWeight: 900, color: '#10B981', textTransform: 'uppercase', letterSpacing: '1px', background: '#10B98122', padding: '4px 12px', borderRadius: '10px', border: '1px solid #10B98144'}}>
                        ADIM {currentStepIndex + 1} / {steps.length}
                    </span>
                    
                    <button 
                        onClick={() => speakStep(currentStepText)}
                        style={{
                            background: isSpeaking ? '#EF4444' : '#8B5CF6',
                            color: 'white', border: 'none', padding: '8px 16px', borderRadius: '12px',
                            fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)'
                        }}
                    >
                        {isSpeaking ? '🛑 Sesli Okumayı Durdur' : '🔊 Adımı Sesli Oku'}
                    </button>
                </div>

                <div style={{
                    fontSize: '22px', fontWeight: 800, lineHeight: '1.7', color: '#F8FAFC',
                    maxWidth: '650px', margin: '0 auto'
                }}>
                    {currentStepText}
                </div>

                {detectedMinutes > 0 && (
                    <button 
                        onClick={() => setActiveTimerMinutes && setActiveTimerMinutes(detectedMinutes)}
                        style={{
                            marginTop: '25px', padding: '12px 22px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: 'white',
                            border: 'none', borderRadius: '16px', fontWeight: 900, fontSize: '14px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 18px rgba(245,158,11,0.45)'
                        }}
                    >
                        ⏱️ Yemeğin Hazırlanma Süresi Sayacını Başlat ({detectedMinutes} Dk)
                    </button>
                )}
            </div>

            {/* ALT NAVİGASYON BUTONLARI */}
            <div style={{display: 'flex', gap: '15px', marginTop: '15px'}}>
                <button 
                    disabled={currentStepIndex === 0}
                    onClick={() => {
                        const newIdx = Math.max(0, currentStepIndex - 1);
                        setCurrentStepIndex(newIdx);
                        if (isSpeaking) speakStep(steps[newIdx]);
                    }}
                    style={{
                        flex: 1, padding: '16px', background: currentStepIndex === 0 ? '#334155' : '#3B82F6',
                        color: currentStepIndex === 0 ? '#64748B' : 'white', border: 'none', borderRadius: '18px',
                        fontWeight: 900, fontSize: '15px', cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    ⏮ Önceki Adım
                </button>
                
                <button 
                    onClick={() => {
                        if (currentStepIndex < steps.length - 1) {
                            const newIdx = currentStepIndex + 1;
                            setCurrentStepIndex(newIdx);
                            if (isSpeaking) speakStep(steps[newIdx]);
                        } else {
                            alert("🎉 Tebrikler! Tarifin tüm adımlarını başarıyla tamamladınız. Afiyet olsun!");
                            onClose();
                        }
                    }}
                    style={{
                        flex: 1.5, padding: '16px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white', border: 'none', borderRadius: '18px',
                        fontWeight: 900, fontSize: '15px', cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(16,185,129,0.45)'
                    }}
                >
                    {currentStepIndex === steps.length - 1 ? '🎉 Tamamla & Kapat' : 'Sonraki Adım ▶'}
                </button>
            </div>
        </div>
    );
}
