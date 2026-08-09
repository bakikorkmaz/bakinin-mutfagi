import React, { useState, useEffect, useRef } from 'react';

export default function KitchenTimer({ activeTimerMinutes, onCloseTimer }) {
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [customMins, setCustomMins] = useState(15);
    const [timerName, setTimerName] = useState('Mutfak Sayacı');
    const [hasEnded, setHasEnded] = useState(false);

    const intervalRef = useRef(null);

    // Initialize timer if activeTimerMinutes changes
    useEffect(() => {
        if (activeTimerMinutes && activeTimerMinutes > 0) {
            setTimeLeft(activeTimerMinutes * 60);
            setIsRunning(true);
            setHasEnded(false);
            setIsMinimized(false);
            setTimerName(`${activeTimerMinutes} Dk Pişirme Sayacı`);
        }
    }, [activeTimerMinutes]);

    // Timer Interval Engine
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        setHasEnded(true);
                        playAlarmSound();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning, timeLeft]);

    // Simple Web Audio API Synthesizer for Chime Alarm
    const playAlarmSound = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            
            // Play 3 pleasant chimes
            [0, 0.25, 0.5, 0.75].forEach((delay, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = idx % 2 === 0 ? 880 : 1046.5; // A5 / C6 notes
                gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + delay);
                osc.stop(ctx.currentTime + delay + 0.25);
            });
        } catch (e) {
            console.log('Audio Context notice:', e);
        }
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const startPreset = (mins, name) => {
        setTimeLeft(mins * 60);
        setIsRunning(true);
        setHasEnded(false);
        setTimerName(name || `${mins} Dk Geri Sayım`);
    };

    const togglePlay = () => {
        if (timeLeft <= 0) return;
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(0);
        setHasEnded(false);
    };

    if (isMinimized) {
        return (
            <div
                onClick={() => setIsMinimized(false)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: hasEnded ? '#EF4444' : isRunning ? 'linear-gradient(135deg, #10B981, #059669)' : '#3B82F6',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '30px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                    cursor: 'pointer',
                    zIndex: 9999,
                    fontWeight: 900,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    animation: hasEnded ? 'pulse 1s infinite' : 'none'
                }}
            >
                <span>⏱️ {hasEnded ? 'SÜRE DOLDU! 🎉' : formatTime(timeLeft)}</span>
                <span style={{ fontSize: '11px', opacity: 0.9 }}>({timerName})</span>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'white',
            borderRadius: '24px',
            padding: '20px',
            width: '320px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            border: hasEnded ? '2px solid #EF4444' : '2px solid #8B5CF6',
            zIndex: 9999,
            color: '#1E293B'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, fontSize: '14px', color: '#6D28D9' }}>
                    <span>⏱️</span>
                    <span>Akıllı Mutfak Zamanlayıcısı</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => setIsMinimized(true)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', fontWeight: 800 }}>
                        — Min
                    </button>
                    {onCloseTimer && (
                        <button onClick={onCloseTimer} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', fontWeight: 800 }}>
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Timer Display */}
            <div style={{
                background: hasEnded ? '#FEE2E2' : '#F5F3FF',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                marginBottom: '15px',
                border: hasEnded ? '1px solid #FCA5A5' : '1px solid #DDD6FE'
            }}>
                <div style={{ fontSize: '11px', color: '#6D28D9', fontWeight: 800, marginBottom: '4px' }}>{timerName}</div>
                <div style={{ fontSize: '38px', fontWeight: 900, color: hasEnded ? '#DC2626' : '#4C1D95', letterSpacing: '2px', fontFamily: 'monospace' }}>
                    {formatTime(timeLeft)}
                </div>
                {hasEnded && (
                    <div style={{ color: '#DC2626', fontWeight: 900, fontSize: '12px', marginTop: '6px', animation: 'bounce 1s infinite' }}>
                        🔔 SÜRE DOLDU! YEMEĞİNİZİ KONTROL EDİN 🎉
                    </div>
                )}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                <button
                    onClick={togglePlay}
                    disabled={timeLeft <= 0}
                    style={{
                        flex: 2,
                        padding: '10px',
                        background: isRunning ? '#F59E0B' : '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 900,
                        fontSize: '13px',
                        cursor: timeLeft > 0 ? 'pointer' : 'not-allowed',
                        opacity: timeLeft > 0 ? 1 : 0.6
                    }}
                >
                    {isRunning ? '⏸️ Duraklat' : '▶️ Başlat'}
                </button>
                <button
                    onClick={resetTimer}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: '#E2E8F0',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}
                >
                    🔄 Sıfırla
                </button>
            </div>

            {/* Quick Presets */}
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>Hızlı Süre Seçenekleri:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                <button onClick={() => startPreset(5, '5 Dk Yumurta / Çorba')} style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#4338CA', padding: '6px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>
                    5 Dk
                </button>
                <button onClick={() => startPreset(10, '10 Dk Makarna Haşlama')} style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#4338CA', padding: '6px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>
                    10 Dk
                </button>
                <button onClick={() => startPreset(15, '15 Dk Tavuk / Sebze Sote')} style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#4338CA', padding: '6px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>
                    15 Dk
                </button>
                <button onClick={() => startPreset(30, '30 Dk Fırın Yemeği')} style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#4338CA', padding: '6px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>
                    30 Dk
                </button>
            </div>
        </div>
    );
}
