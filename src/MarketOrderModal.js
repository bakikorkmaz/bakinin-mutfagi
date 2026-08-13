import React from 'react';

// ============================================================
// BAKI KORKMAZ - RESMİ MARKET İŞ ORTAKLARI YAPILANDIRMASI
// ============================================================
const ALL_MARKETS = [
    {
        id: 'hepsiburada',
        name: 'Hepsiburada Market',
        emoji: '🟡',
        color: '#FF6000',
        gradient: 'linear-gradient(135deg, #FF6000, #E65100)',
        description: 'Hızlı kapıya teslimat · Geniş ürün yelpazesi',
        badge: 'RESMİ İŞ ORTAĞI',
        badgeColor: '#10B981',
        defaultUrl: 'https://app.hb.biz/hbZ0aBIEnSXu',
    },
    {
        id: 'trendyol',
        name: 'Trendyol Market',
        emoji: '🔴',
        color: '#F27A1A',
        gradient: 'linear-gradient(135deg, #F27A1A, #c0440a)',
        description: 'Hızlı sipariş · Anında kapında',
        badge: 'HIZLI TESLİMAT',
        badgeColor: '#3B82F6',
        defaultUrl: 'https://www.trendyol.com/trendyol-market',
    },
    {
        id: 'migros',
        name: 'Migros Sanal Market',
        emoji: '🟢',
        color: '#00A650',
        gradient: 'linear-gradient(135deg, #00A650, #007a3b)',
        description: 'Taze ve kaliteli ürünler · Özel indirimler',
        badge: 'ONAYLI MARKET',
        badgeColor: '#10B981',
        defaultUrl: 'https://www.migros.com.tr/market',
    },
    {
        id: 'getir',
        name: 'Getir Market',
        emoji: '🟣',
        color: '#5C3EC2',
        gradient: 'linear-gradient(135deg, #5C3EC2, #3d2885)',
        description: 'Dakikalar içinde teslimat · 7/24 hizmet',
        badge: 'DAKİKASINDA KAPINDA',
        badgeColor: '#8B5CF6',
        defaultUrl: 'https://getir.com/market/',
    },
    {
        id: 'yemeksepeti',
        name: 'Yemeksepeti Market',
        emoji: '🔴',
        color: '#EA004B',
        gradient: 'linear-gradient(135deg, #EA004B, #b3003b)',
        description: 'Hızlı teslimat · Geniş market ağı',
        badge: 'HIZLI SİPARİŞ',
        badgeColor: '#EC4899',
        defaultUrl: 'https://www.yemeksepeti.com/market',
    },
    {
        id: 'carrefour',
        name: 'CarrefourSA',
        emoji: '🔵',
        color: '#004A99',
        gradient: 'linear-gradient(135deg, #004A99, #003366)',
        description: 'Uygun fiyatlı taze market ürünleri',
        badge: 'GÜVENLİ ALIŞVERİŞ',
        badgeColor: '#0284C7',
        defaultUrl: 'https://www.carrefoursa.com',
    },
    {
        id: 'sok',
        name: 'ŞOK Cepte',
        emoji: '🟡',
        color: '#ED1C24',
        gradient: 'linear-gradient(135deg, #ED1C24, #b30000)',
        description: 'Uygun fiyat · Hızlı market teslimatı',
        badge: 'AVANTAJLI FİYAT',
        badgeColor: '#F59E0B',
        defaultUrl: 'https://www.ceptesok.com',
    },
    {
        id: 'a101',
        name: 'A101 Kapıda',
        emoji: '💙',
        color: '#00A3E0',
        gradient: 'linear-gradient(135deg, #00A3E0, #0077a3)',
        description: 'En uygun market fiyatları kapında',
        badge: 'EKONOMİK SEÇİM',
        badgeColor: '#06B6D4',
        defaultUrl: 'https://www.a101.com.tr',
    }
];

export default function MarketOrderModal({ dish, onClose }) {
    if (!dish) return null;

    // Read Admin panel market preferences from localStorage
    const savedMarketLinks = JSON.parse(localStorage.getItem('baki_market_links') || '{}');

    // Filter markets based on Admin selection (if configured in admin, respect enabled status)
    const activeMarkets = ALL_MARKETS.filter(m => {
        if (savedMarketLinks[m.id] !== undefined) {
            return savedMarketLinks[m.id].enabled !== false;
        }
        // Default active top partners if not explicitly disabled
        return ['hepsiburada', 'trendyol', 'migros', 'getir'].includes(m.id);
    }).map(m => {
        const customUrl = savedMarketLinks[m.id]?.customUrl;
        let finalUrl = customUrl || m.defaultUrl;
        if (finalUrl && finalUrl.includes('{QUERY}')) {
            finalUrl = finalUrl.replace('{QUERY}', encodeURIComponent(dish.name || 'market'));
        }
        return { ...m, url: finalUrl };
    });

    const displayMarkets = activeMarkets.length > 0 ? activeMarkets : ALL_MARKETS.slice(0, 4);

    const handleMarketClick = (market) => {
        window.open(market.url, '_blank');
    };

    return (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(15, 23, 42, 0.88)', zIndex: 99999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(10px)', padding: '20px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#1E293B', border: '1px solid #334155', borderRadius: '28px',
                    padding: '28px 24px', maxWidth: '480px', width: '100%',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
                    maxHeight: '90vh', overflowY: 'auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* BAŞLIK */}
                <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                    <div style={{ fontSize: '36px', marginBottom: '8px' }}>🛒</div>
                    <h2 style={{
                        fontSize: '20px', fontWeight: 900, color: '#F8FAFC', margin: '0 0 6px 0'
                    }}>
                        Malzemeleri Sipariş Et
                    </h2>
                    <p style={{
                        fontSize: '13px', color: '#94A3B8', margin: 0, fontWeight: 600
                    }}>
                        📌 <strong style={{color: '#38BDF8'}}>{dish.name}</strong> için eksik malzemelerinizi kapınıza getirtin
                    </p>
                </div>

                {/* MARKET LİSTESİ (ADMIN TARAFINDAN AKTİF EDİLENLER) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {displayMarkets.map(market => (
                        <button
                            key={market.id}
                            onClick={() => handleMarketClick(market)}
                            style={{
                                background: '#0F172A',
                                border: '1px solid #334155',
                                borderRadius: '18px',
                                padding: '16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                transition: 'all 0.2s ease',
                                textAlign: 'left',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#1E3A5F';
                                e.currentTarget.style.borderColor = market.color;
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.4)`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = '#0F172A';
                                e.currentTarget.style.borderColor = '#334155';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* LOGO EMOJI */}
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '14px',
                                background: market.gradient,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '22px', flexShrink: 0,
                                boxShadow: `0 4px 12px ${market.color}40`
                            }}>
                                {market.emoji}
                            </div>

                            {/* BİLGİ */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>
                                    {market.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, marginTop: '2px' }}>
                                    {market.description}
                                </div>
                            </div>

                            {/* ONAYLI İŞ ORTAĞI BADGE */}
                            <div style={{
                                background: `${market.badgeColor}20`, color: market.badgeColor,
                                border: `1px solid ${market.badgeColor}40`,
                                borderRadius: '8px', padding: '4px 8px',
                                fontSize: '10px', fontWeight: 900, letterSpacing: '0.05em',
                                flexShrink: 0
                            }}>
                                ✓ {market.badge}
                            </div>

                            {/* YÖNLENDİRME OKU */}
                            <div style={{ color: '#64748B', fontSize: '18px', flexShrink: 0, fontWeight: 900 }}>
                                ›
                            </div>
                        </button>
                    ))}
                </div>

                {/* BİLGİLENDİRME YAZISI */}
                <div style={{
                    marginTop: '18px', textAlign: 'center',
                    fontSize: '12px', color: '#94A3B8', fontWeight: 600,
                    background: '#0F172A', padding: '10px 14px', borderRadius: '12px',
                    border: '1px solid #334155'
                }}>
                    💡 Seçtiğiniz market uygulamasına güvenle yönlendirileceksiniz.
                </div>

                {/* TAMAM ANLADIM VE VAZGEÇ BUTONLARI */}
                <button
                    onClick={onClose}
                    style={{
                        width: '100%', marginTop: '16px', padding: '14px',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white', border: 'none', borderRadius: '16px',
                        fontWeight: 900, fontSize: '15px', cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
                    }}
                >
                    Tamam, Anladım
                </button>
            </div>
        </div>
    );
}
