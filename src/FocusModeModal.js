import React, { useState, useEffect } from 'react';
import MarketOrderModal from './MarketOrderModal';

export default function FocusModeModal({ dish, onClose, setActiveTimerMinutes }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [wakeLockActive, setWakeLockActive] = useState(false);
    const [wakeLockObj, setWakeLockObj] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [portionCount, setPortionCount] = useState(3); // Default 3 persons
    const [showMarketModal, setShowMarketModal] = useState(false);

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
        window.speechSynthesis.cancel(); // Stop ongoing speech

        if (isSpeaking) {
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.95; // Clear natural rate
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
    const detectedMinutes = matchMin ? parseInt(matchMin[1], 10) : null;

    // REALISTIC DISHWARE & WASH CALCULATIONS
    const isFırın = /fırın|tepsi|kek|börek/i.test(dish.name || '') || /fırın/i.test(dish.recipe || '');
    const isÇorba = /çorba/i.test(dish.name || '') || /çorba/i.test(dish.recipe || '');
    const isTava = /tava|kavurma|sote|köfte/i.test(dish.name || '');

    const cookwareText = isFırın ? "🍳 1 Fırın Tepsisi, 🥣 1 Karıştırma Kabı" 
                       : isÇorba ? "🍲 1 Çorba Tenceresi, 🥣 1 Kepçe"
                       : isTava ? "🍳 1 Döküm Tava, 🥄 1 Spatula"
                       : "🍳 1 Pişirme Tenceresi, 🥣 1 Tahta Kaşık";

    // Realistic Hand Wash Minutes: Cookware (3.5 min) + Portion items (Tabak 45s + Çatal 20s + Bardak 25s = 1.5 min per person)
    const handWashMins = Math.round(4.0 + portionCount * 2.2);
    const dishwasherMins = Math.round(2.0 + portionCount * 0.5);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: '#0F172A', color: 'white', zIndex: 99999,
            display: 'flex', flexDirection: 'column', padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            {/* ÜST BAR */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                <div>
                    <span style={{fontSize: '12px', background: '#334155', padding: '4px 10px', borderRadius: '12px', fontWeight: 800, color: '#38BDF8'}}>
                        👨‍🍳 MUTFAK ODAK MODU
                    </span>
                    <h2 style={{fontSize: '18px', fontWeight: 900, margin: '6px 0 0 0', color: 'white'}}>{dish.name}</h2>
                </div>
                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    {/* ÇOK MARKET SİPARİŞ BUTONU - 4 Market Komisyon */}
                    <button 
                        onClick={() => setShowMarketModal(true)}
                        style={{
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            color: 'white', border: 'none', padding: '8px 16px',
                            borderRadius: '12px', fontSize: '12px', fontWeight: 900, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                            animation: 'pulse 2s infinite'
                        }}
                    >
                        🛒 Malzeme Sipariş Et
                    </button>

                    <button 
                        onClick={toggleWakeLock}
                        style={{
                            background: wakeLockActive ? '#059669' : '#475569',
                            color: 'white', border: 'none', padding: '8px 12px',
                            borderRadius: '12px', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                    >
                        {wakeLockActive ? '🟢 Ekran Kapanmaz' : '⚪ Ekran Kapanabilir'}
                    </button>
                    <button 
                        onClick={onClose}
                        style={{background: '#1E293B', color: '#94A3B8', border: '1px solid #334155', width: '38px', height: '38px', borderRadius: '50%', fontSize: '18px', fontWeight: 900, cursor: 'pointer'}}
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* GERÇEKÇİ BULAŞIK & YIKAMA PANELİ */}
            <div style={{
                background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', padding: '12px 15px',
                marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
            }}>
                <div>
                    <div style={{fontSize: '11px', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.05em', textTransform: 'uppercase'}}>
                        🧽 Çıkacak Bulaşık & Yıkama Analizi
                    </div>
                    <div style={{fontSize: '13px', fontWeight: 700, color: '#F8FAFC', marginTop: '3px'}}>
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
                        style={{background: '#0F172A', color: 'white', border: '1px solid #475569', borderRadius: '8px', padding: '4px 8px', fontSize: '12px', fontWeight: 800}}
                    >
                        <option value={1}>1 Kişilik</option>
                        <option value={2}>2 Kişilik</option>
                        <option value={3}>3 Kişilik</option>
                        <option value={4}>4 Kişilik</option>
                        <option value={6}>6 Kişilik</option>
                    </select>
                </div>
            </div>

            {/* ADIM SAYACI İLERLEME ÇUBUĞU */}
            <div style={{display: 'flex', gap: '4px', marginBottom: '15px'}}>
                {steps.map((_, idx) => (
                    <div 
                        key={idx} 
                        style={{
                            flex: 1, height: '6px', borderRadius: '3px',
                            background: idx === currentStepIndex ? '#10B981' : (idx < currentStepIndex ? '#059669' : '#334155'),
                            transition: '0.3s'
                        }}
                    />
                ))}
            </div>

            {/* DEVASA ADIM KARTI */}
            <div style={{
                flex: 1, background: '#1E293B', borderRadius: '24px', padding: '25px 20px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid #334155', textAlign: 'center',
                position: 'relative'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                    <span style={{fontSize: '13px', fontWeight: 900, color: '#10B981', textTransform: 'uppercase', letterSpacing: '1px'}}>
                        ADIM {currentStepIndex + 1} / {steps.length}
                    </span>
                    
                    {/* SESLİ OKU BUTTON */}
                    <button 
                        onClick={() => speakStep(currentStepText)}
                        style={{
                            background: isSpeaking ? '#EF4444' : '#8B5CF6',
                            color: 'white', border: 'none', padding: '6px 14px', borderRadius: '12px',
                            fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
                        }}
                    >
                        {isSpeaking ? '🛑 Sesli Okumayı Durdur' : '🔊 Adımı Sesli Oku'}
                    </button>
                </div>

                <div style={{
                    fontSize: '22px', fontWeight: 800, lineHeight: '1.6', color: '#F8FAFC',
                    maxWidth: '550px', margin: '0 auto'
                }}>
                    {currentStepText}
                </div>

                {detectedMinutes && (
                    <button 
                        onClick={() => setActiveTimerMinutes && setActiveTimerMinutes(detectedMinutes)}
                        style={{
                            marginTop: '20px', padding: '10px 18px', background: '#F59E0B', color: 'white',
                            border: 'none', borderRadius: '14px', fontWeight: 900, fontSize: '13px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(245,158,11,0.4)'
                        }}
                    >
                        ⏱️ {detectedMinutes} Dakikalık Sayacı Başlat
                    </button>
                )}
            </div>

            {/* ALT DOKUNMATİK BUTONLAR */}
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
                        flex: 1.5, padding: '16px', background: '#10B981',
                        color: 'white', border: 'none', borderRadius: '18px',
                        fontWeight: 900, fontSize: '15px', cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(16,185,129,0.4)'
                    }}
                >
                    {currentStepIndex === steps.length - 1 ? '🎉 Tamamla & Kapat' : 'Sonraki Adım ▶'}
                </button>
            </div>
        </div>
    );
}
