import React from 'react';

// ============================================================
// BAKI KORKMAZ - MARKET AFFILIATE COMMISSION CONFIG
// Linkler geldiğinde sadece bu bölümü güncellemek yeterli!
// ============================================================
const MARKET_CONFIG = [
    {
        id: 'hepsiburada',
        name: 'Hepsiburada Market',
        emoji: '🟡',
        color: '#FF6000',
        gradient: 'linear-gradient(135deg, #FF6000, #E65100)',
        description: 'Hızlı teslimat · Geniş ürün yelpazesi',
        badge: 'KOMİSYONLU',
        badgeColor: '#10B981',
        // ✅ AKTİF - Baki Korkmaz resmi LinkGelir affiliate linki
        url: 'https://app.hb.biz/hbZ0aBIEnSXu',
    },
    {
        id: 'trendyol',
        name: 'Trendyol Market',
        emoji: '🔴',
        color: '#F27A1A',
        gradient: 'linear-gradient(135deg, #F27A1A, #c0440a)',
        description: 'Hızlı market · Kapıya teslimat',
        badge: 'KOMİSYONLU',
        badgeColor: '#10B981',
        // ✅ AKTİF - Trendyol Market doğrudan market sayfası
        url: 'https://www.trendyol.com/trendyol-market',
    },
    {
        id: 'migros',
        name: 'Migros Sanal Market',
        emoji: '🟢',
        color: '#00A650',
        gradient: 'linear-gradient(135deg, #00A650, #007a3b)',
        description: 'Taze ürünler · Geniş market çeşidi',
        badge: 'KOMİSYONLU',
        badgeColor: '#10B981',
        // ✅ AKTİF - Migros Sanal Market ana sayfası
        url: 'https://www.migros.com.tr/market',
    },
    {
        id: 'getir',
        name: 'Getir Market',
        emoji: '🟣',
        color: '#5C3EC2',
        gradient: 'linear-gradient(135deg, #5C3EC2, #3d2885)',
        description: '10 dakikada teslimat · 7/24 açık',
        badge: 'KOMİSYONLU',
        badgeColor: '#10B981',
        // ✅ AKTİF - Getir ana market sayfası
        url: 'https://getir.com/market/',
    },
];

export default function MarketOrderModal({ dish, onClose }) {
    if (!dish) return null;

    const handleMarketClick = (market) => {
        window.open(market.url, '_blank');
    };

    return (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.85)', zIndex: 99999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)', padding: '20px',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#0F172A', border: '1px solid #1E293B', borderRadius: '28px',
                    padding: '28px 24px', maxWidth: '460px', width: '100%',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* BAŞLIK */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛒</div>
                    <h2 style={{
                        fontSize: '18px', fontWeight: 900, color: 'white', margin: '0 0 6px 0'
                    }}>
                        Malzemeleri Sipariş Et
                    </h2>
                    <p style={{
                        fontSize: '13px', color: '#94A3B8', margin: 0, fontWeight: 600
                    }}>
                        📌 <strong style={{color: '#F8FAFC'}}>{dish.name}</strong> için alışveriş yapın
                    </p>
                </div>

                {/* MARKET LİSTESİ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {MARKET_CONFIG.map(market => (
                        <button
                            key={market.id}
                            onClick={() => handleMarketClick(market)}
                            style={{
                                background: '#1E293B',
                                border: '1px solid #334155',
                                borderRadius: '16px',
                                padding: '14px 16px',
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
                                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = '#1E293B';
                                e.currentTarget.style.borderColor = '#334155';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* LOGO YERİ */}
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '14px',
                                background: market.gradient,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '22px', flexShrink: 0,
                                boxShadow: `0 4px 12px ${market.color}40`
                            }}>
                                {market.emoji}
                            </div>

                            {/* MARKET BİLGİSİ */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>
                                    {market.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, marginTop: '2px' }}>
                                    {market.description}
                                </div>
                            </div>

                            {/* KOMİSYON BADGE */}
                            <div style={{
                                background: `${market.badgeColor}20`, color: market.badgeColor,
                                border: `1px solid ${market.badgeColor}40`,
                                borderRadius: '8px', padding: '3px 8px',
                                fontSize: '10px', fontWeight: 900, letterSpacing: '0.05em',
                                flexShrink: 0
                            }}>
                                ✓ {market.badge}
                            </div>

                            {/* OK */}
                            <div style={{ color: '#475569', fontSize: '16px', flexShrink: 0 }}>
                                ›
                            </div>
                        </button>
                    ))}
                </div>

                {/* ALT NOT */}
                <div style={{
                    marginTop: '16px', textAlign: 'center',
                    fontSize: '11px', color: '#475569', fontWeight: 600
                }}>
                    💡 İstediğiniz marketi seçin ve alışverişinizi tamamlayın
                </div>

                {/* KAPAT */}
                <button
                    onClick={onClose}
                    style={{
                        width: '100%', marginTop: '14px', padding: '12px',
                        background: '#1E293B', color: '#94A3B8',
                        border: '1px solid #334155', borderRadius: '14px',
                        fontWeight: 800, fontSize: '14px', cursor: 'pointer',
                    }}
                >
                    Vazgeç
                </button>
            </div>
        </div>
    );
}
