import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { DB_MAINS } from './realRecipes';
import { DB_MAINS_HUGE } from './hugeRecipes';

const ALL_MATCH_RECIPES = [...DB_MAINS, ...DB_MAINS_HUGE];

function getRandomMatchPool(count = 15) {
    const shuffled = [...ALL_MATCH_RECIPES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((r, idx) => ({
        id: r.id || `match_r_${idx}_${Date.now()}`,
        name: r.name,
        time: r.prepTime || r.time || 30,
        calories: r.calories || 450,
        cost: r.totalCost || r.cost || 90,
        ingredients: r.ingredients || [],
        recipeDesc: r.recipeDesc || "Nefis ve pratik ev yemeği habercisi."
    }));
}

export default function NeYesekMatch({ activeUser, onBack, openShopping }) {
    const [roomCode, setRoomCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [roomData, setRoomData] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matchWinner, setMatchWinner] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState('');
    const [showGuide, setShowGuide] = useState(true);
    
    // Single-device mode state
    const [singleDeviceMode, setSingleDeviceMode] = useState(false);
    const [singleUserTurn, setSingleUserTurn] = useState(1); // 1 or 2
    const [p1Votes, setP1Votes] = useState({});
    const [p2Votes, setP2Votes] = useState({});

    const userName = activeUser?.name || activeUser?.username || 'Şef 1';
    const userUid = activeUser?.uid || `anon_${Date.now()}`;

    // Listen to active Firebase room or fallback local room
    useEffect(() => {
        if (!roomCode || singleDeviceMode) return;

        let unsubscribe = () => {};
        
        try {
            const roomRef = doc(db, 'matches', roomCode.toUpperCase());
            unsubscribe = onSnapshot(roomRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setRoomData(data);

                    const hostVotes = data.hostVotes || {};
                    const guestVotes = data.guestVotes || {};

                    for (const recipeId in hostVotes) {
                        if (hostVotes[recipeId] === true && guestVotes[recipeId] === true) {
                            const matched = (data.pool || []).find(r => r.id === recipeId);
                            if (matched && (!matchWinner || matchWinner.id !== matched.id)) {
                                setMatchWinner(matched);
                                setShowConfetti(true);
                            }
                        }
                    }
                } else {
                    // Try fallback room from localStorage if offline
                    const localRoom = localStorage.getItem('LOCAL_MATCH_ROOM_' + roomCode);
                    if (localRoom) {
                        setRoomData(JSON.parse(localRoom));
                    } else {
                        setLoadingMsg('Oda aranıyor...');
                    }
                }
            }, () => {
                // Firebase error fallback to local storage
                const localRoom = localStorage.getItem('LOCAL_MATCH_ROOM_' + roomCode);
                if (localRoom) setRoomData(JSON.parse(localRoom));
            });
        } catch (e) {
            const localRoom = localStorage.getItem('LOCAL_MATCH_ROOM_' + roomCode);
            if (localRoom) setRoomData(JSON.parse(localRoom));
        }

        return () => unsubscribe();
    }, [roomCode, singleDeviceMode, matchWinner]);

    // Create Room (Firebase + Fallback)
    const handleCreateRoom = async () => {
        const generatedCode = 'BAKI-' + Math.floor(1000 + Math.random() * 9000);
        setLoadingMsg('Oda oluşturuluyor...');

        const newPool = getRandomMatchPool(15);
        const roomPayload = {
            code: generatedCode,
            hostUid: userUid,
            hostName: userName,
            guestUid: '',
            guestName: '',
            status: 'WAITING',
            pool: newPool,
            hostVotes: {},
            guestVotes: {},
            createdAt: new Date().toISOString()
        };

        // Always save to localStorage for offline fallback
        localStorage.setItem('LOCAL_MATCH_ROOM_' + generatedCode, JSON.stringify(roomPayload));

        try {
            await setDoc(doc(db, 'matches', generatedCode), roomPayload);
        } catch (e) {
            console.warn('Firebase çevrimdışı, yerel oda modu aktif:', e);
        }

        setIsHost(true);
        setRoomCode(generatedCode);
        setRoomData(roomPayload);
        setLoadingMsg('');
    };

    // Join Room (Firebase + Fallback)
    const handleJoinRoom = async () => {
        const clean = inputCode.trim().toUpperCase();
        if (!clean) return alert('Lütfen 4 haneli oda kodunu girin (Örn: BAKI-1234).');

        setLoadingMsg('Odaya bağlanılıyor...');
        let data = null;

        try {
            const roomRef = doc(db, 'matches', clean);
            const docSnap = await getDoc(roomRef);

            if (docSnap.exists()) {
                data = docSnap.data();
                if (data.hostUid === userUid) {
                    setIsHost(true);
                } else {
                    setIsHost(false);
                    data.guestUid = userUid;
                    data.guestName = userName;
                    data.status = 'ACTIVE';
                    await updateDoc(roomRef, {
                        guestUid: userUid,
                        guestName: userName,
                        status: 'ACTIVE'
                    });
                }
            }
        } catch (e) {
            console.warn('Firebase bağlantı hatası, yerel oda kontrol ediliyor...');
        }

        // Try local storage if firebase was unreachable or not found
        if (!data) {
            const localRoomStr = localStorage.getItem('LOCAL_MATCH_ROOM_' + clean);
            if (localRoomStr) {
                data = JSON.parse(localRoomStr);
                setIsHost(false);
                data.guestUid = userUid;
                data.guestName = userName || 'Eş';
                data.status = 'ACTIVE';
                localStorage.setItem('LOCAL_MATCH_ROOM_' + clean, JSON.stringify(data));
            }
        }

        if (!data) {
            setLoadingMsg('');
            return alert('Oda bulunamadı! Lütfen oda oluşturan kişinin verdiği kodu (Örn: BAKI-4892) doğru yazdığınızdan emin olun.');
        }

        setRoomCode(clean);
        setRoomData(data);
        setLoadingMsg('');
    };

    // Start Single-Device Mode
    const startSingleDeviceMode = () => {
        const newPool = getRandomMatchPool(15);
        setSingleDeviceMode(true);
        setSingleUserTurn(1);
        setP1Votes({});
        setP2Votes({});
        setCurrentIndex(0);
        setRoomCode('LOCAL_SINGLE');
        setRoomData({
            code: 'TEK-CİHAZ',
            hostName: '1. Kişi',
            guestName: '2. Kişi',
            pool: newPool
        });
    };

    // Vote on Current Recipe Card
    const handleVote = async (voteValue) => {
        if (!roomData) return;
        const currentRecipe = (roomData.pool || [])[currentIndex];
        if (!currentRecipe) return;

        if (singleDeviceMode) {
            if (singleUserTurn === 1) {
                const updatedP1 = { ...p1Votes, [currentRecipe.id]: voteValue };
                setP1Votes(updatedP1);
                if (currentIndex < roomData.pool.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    // Turn 1 finished, pass phone to 2nd person
                    setSingleUserTurn(2);
                    setCurrentIndex(0);
                    alert("📱 1. Kişi oylamasını tamamladı! Şimdi telefonu 2. kişiye verin.");
                }
            } else {
                const updatedP2 = { ...p2Votes, [currentRecipe.id]: voteValue };
                setP2Votes(updatedP2);

                // Check match with P1
                if (p1Votes[currentRecipe.id] === true && voteValue === true) {
                    setMatchWinner(currentRecipe);
                    setShowConfetti(true);
                    return;
                }

                if (currentIndex < roomData.pool.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    alert("🏁 Oylama bitti! Ortak eşleşen bir yemek bulunamadıysa tekrar deneyebilirsiniz.");
                }
            }
            return;
        }

        // Online Multi-Device Vote
        const voteKey = isHost ? `hostVotes.${currentRecipe.id}` : `guestVotes.${currentRecipe.id}`;

        try {
            await updateDoc(doc(db, 'matches', roomCode), {
                [voteKey]: voteValue
            });
        } catch (e) {
            // Local storage fallback vote update
            const localStr = localStorage.getItem('LOCAL_MATCH_ROOM_' + roomCode);
            if (localStr) {
                const localData = JSON.parse(localStr);
                if (isHost) localData.hostVotes[currentRecipe.id] = voteValue;
                else localData.guestVotes[currentRecipe.id] = voteValue;
                
                // Check local match
                if (localData.hostVotes[currentRecipe.id] && localData.guestVotes[currentRecipe.id]) {
                    setMatchWinner(currentRecipe);
                    setShowConfetti(true);
                }
                localStorage.setItem('LOCAL_MATCH_ROOM_' + roomCode, JSON.stringify(localData));
                setRoomData(localData);
            }
        }

        if (currentIndex < (roomData.pool.length - 1)) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const currentCard = roomData?.pool ? roomData.pool[currentIndex] : null;

    return (
        <div style={{ maxWidth: '650px', margin: '0 auto', padding: '15px', color: '#1E293B' }}>
            
            {/* Confetti Celebration */}
            {showConfetti && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 9999 }}>
                    {[...Array(40)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: `-10px`,
                            width: `${Math.random() * 10 + 6}px`,
                            height: `${Math.random() * 16 + 10}px`,
                            background: ['#10B981', '#F59E0B', '#EC4899', '#3B82F6', '#8B5CF6'][i % 5],
                            borderRadius: '3px',
                            animation: `fall ${Math.random() * 2 + 2}s linear infinite`,
                            animationDelay: `${Math.random() * 0.5}s`
                        }} />
                    ))}
                    <style>{`
                        @keyframes fall {
                            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                        }
                    `}</style>
                </div>
            )}

            {/* Header Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                <button onClick={onBack} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '10px 18px', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', fontSize: '13px', color: '#475569' }}>
                    ← Geri Dön
                </button>
                <div style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: 900, fontSize: '12px' }}>
                    🍽️ Ne Yesek Match (Çiftler & Arkadaşlar)
                </div>
            </div>

            {/* 1. LOBBY VIEW (CREATE / JOIN / GUIDE) */}
            {!roomCode && (
                <div style={{ background: 'white', borderRadius: '26px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ fontSize: '44px', marginBottom: '8px' }}>❤️🍽️</div>
                        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', marginBottom: '6px' }}>
                            "Ne Yesek?" Kararsızlığına Ortak Çözüm!
                        </h2>
                        <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                            Eşiniz veya arkadaşınızla yemek seçerken anlaşamıyor musunuz? Kartları oylayın, iki tarafın da beğendiği ortak yemeği anında keşfedin!
                        </p>
                    </div>

                    {/* USAGE GUIDE BOX */}
                    <div style={{ background: '#F8FAFC', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowGuide(!showGuide)}>
                            <span style={{ fontWeight: 800, color: '#4338CA', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ❓ Ne Yesek Match Nasıl Kullanılır? (4 Adımda İşleyiş)
                            </span>
                            <span style={{ fontSize: '14px', color: '#6366F1' }}>{showGuide ? '▲' : '▼'}</span>
                        </div>

                        {showGuide && (
                            <div style={{ marginTop: '12px', fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                                <div style={{ marginBottom: '6px' }}><b>1. Adım (Oda Oluşturma):</b> Biriniz <b>"👑 Oda Oluştur"</b> butonuna basarak 4 haneli oda kodunu alır (Örn: BAKI-4892).</div>
                                <div style={{ marginBottom: '6px' }}><b>2. Adım (Odaya Katılma):</b> Diğer kişi kendi telefonundan oda kodunu kutuya yazıp <b>"🔗 Odaya Katıl"</b>a basar.</div>
                                <div style={{ marginBottom: '6px' }}><b>3. Adım (Kart Oylama):</b> Ekrana gelen lezzetli yemek kartlarına <b>"💚 Evet"</b> veya <b>"❌ Pas"</b> verirsiniz.</div>
                                <div><b>4. Adım (Mükemmel Eşleşme):</b> İkiniz de aynı yemeği beğendiğiniz anda ekranda kutlama ile ortak yemek açılır! 🎉</div>
                            </div>
                        )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                        <button
                            onClick={handleCreateRoom}
                            style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: 'white', border: 'none', padding: '16px', borderRadius: '18px', fontWeight: 900, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(139,92,246,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                        >
                            <span style={{ fontSize: '20px' }}>👑</span>
                            <span>Oda Oluştur (Host)</span>
                        </button>
                        <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '18px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Kodu Gir (Örn: BAKI-1234)"
                                value={inputCode}
                                onChange={e => setInputCode(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', textAlign: 'center', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase' }}
                            />
                            <button
                                onClick={handleJoinRoom}
                                style={{ width: '100%', background: '#EC4899', color: 'white', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
                            >
                                🔗 Odaya Katıl
                            </button>
                        </div>
                    </div>

                    {/* SINGLE DEVICE DEMO BUTTON */}
                    <button
                        onClick={startSingleDeviceMode}
                        style={{ width: '100%', padding: '14px', background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E', borderRadius: '16px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <span>📱 Tek Telefondan Yan Yana Oyna (Sırayla Oy Ver)</span>
                    </button>

                    {loadingMsg && (
                        <div style={{ color: '#8B5CF6', fontWeight: 800, fontSize: '13px', marginTop: '15px', textAlign: 'center' }}>{loadingMsg}</div>
                    )}
                </div>
            )}

            {/* 2. MATCH WINNER MODAL */}
            {matchWinner && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '28px', padding: '32px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                        <div style={{ fontSize: '54px', marginBottom: '10px' }}>🎉❤️</div>
                        <div style={{ background: '#FCE7F3', color: '#DB2777', padding: '6px 16px', borderRadius: '20px', fontWeight: 900, fontSize: '12px', display: 'inline-block', marginBottom: '12px' }}>
                            MÜKEMMEL EŞLEŞME YAKALANDI!
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>
                            {matchWinner.name}
                        </h2>
                        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
                            İkiniz de bu yemeğe "Evet" dediniz! Akşam sofra menünüz hazır. 🥳
                        </p>

                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '18px', border: '1px solid #E2E8F0', marginBottom: '20px', display: 'flex', justifyContent: 'space-around', fontSize: '13px', fontWeight: 800, color: '#475569' }}>
                            <span>⏱️ {matchWinner.time} Dk</span>
                            <span>🔥 {matchWinner.calories} Kcal</span>
                            <span>💰 ₺{matchWinner.cost}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    if (openShopping) openShopping({ main: matchWinner });
                                }}
                                style={{ background: 'linear-gradient(135deg, #10B981, #047857)', color: 'white', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: 900, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}
                            >
                                🛒 Malzemeleri Market Siparişine Ekle
                            </button>
                            <button
                                onClick={() => {
                                    setRoomCode('');
                                    setMatchWinner(null);
                                    setShowConfetti(false);
                                    setSingleDeviceMode(false);
                                }}
                                style={{ background: '#F1F5F9', color: '#475569', border: 'none', padding: '12px', borderRadius: '16px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
                            >
                                🔄 Yeni Oyun Başlat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. GAMEPLAY ROOM VIEW */}
            {roomCode && !matchWinner && roomData && (
                <div style={{ background: 'white', borderRadius: '26px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
                    
                    {/* Room Info Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '12px 18px', borderRadius: '18px', marginBottom: '15px', border: '1px solid #E2E8F0' }}>
                        <div>
                            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 800 }}>ODA KODU</div>
                            <div style={{ fontSize: '16px', color: '#8B5CF6', fontWeight: 900, letterSpacing: '1px', cursor: 'pointer' }} onClick={() => { navigator.clipboard?.writeText(roomData.code); alert('Oda kodu kopyalandı: ' + roomData.code); }}>
                                {roomData.code} 📋
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 800 }}>
                                {singleDeviceMode ? `SIKRA: ${singleUserTurn}. KİŞİDE` : 'EŞLEŞEN KİŞİLER'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#0F172A', fontWeight: 800 }}>
                                👑 {roomData.hostName} {roomData.guestName ? `& 💖 ${roomData.guestName}` : '(Eş Bekleniyor...)'}
                            </div>
                        </div>
                    </div>

                    {/* Waiting Banner if multi-device alone */}
                    {!singleDeviceMode && !roomData.guestName && (
                        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#D97706', padding: '12px', borderRadius: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 800, marginBottom: '20px' }}>
                            ⏳ Eşinizin odaya girmesi bekleniyor! Oda Kodunu (<strong>{roomData.code}</strong>) eşinize söyleyin.
                        </div>
                    )}

                    {/* Single Device Turn Notice Banner */}
                    {singleDeviceMode && (
                        <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#4338CA', padding: '10px 14px', borderRadius: '14px', textAlign: 'center', fontSize: '12px', fontWeight: 800, marginBottom: '15px' }}>
                            📱 Tek Telefon Modu: Şuan <strong>{singleUserTurn}. Kişi</strong> oy veriyor!
                        </div>
                    )}

                    {/* RECIPE SWIPE CARD */}
                    {currentCard ? (
                        <div style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)', borderRadius: '24px', padding: '24px', border: '2px solid #EEF2FF', boxShadow: '0 8px 25px rgba(0,0,0,0.04)', textAlign: 'center', position: 'relative' }}>
                            <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 900, textTransform: 'uppercase', marginBottom: '6px' }}>
                                YEMEK TARİFİ {currentIndex + 1} / {roomData.pool.length}
                            </div>

                            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', marginBottom: '12px' }}>
                                {currentCard.name}
                            </h3>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '13px', fontWeight: 800, color: '#64748B', marginBottom: '18px' }}>
                                <span>⏱️ {currentCard.time} Dk</span>
                                <span>🔥 {currentCard.calories} Kcal</span>
                                <span>💰 ₺{currentCard.cost}</span>
                            </div>

                            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', background: 'white', padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '25px' }}>
                                {currentCard.recipeDesc}
                            </p>

                            {/* VOTING BUTTONS */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <button
                                    onClick={() => handleVote(false)}
                                    style={{ background: '#FEE2E2', color: '#DC2626', border: '2px solid #FECACA', padding: '16px', borderRadius: '20px', fontWeight: 900, fontSize: '15px', cursor: 'pointer', transition: '0.2s' }}
                                >
                                    ❌ Pas Geç
                                </button>
                                <button
                                    onClick={() => handleVote(true)}
                                    style={{ background: '#DCFCE7', color: '#16A34A', border: '2px solid #BBF7D0', padding: '16px', borderRadius: '20px', fontWeight: 900, fontSize: '15px', cursor: 'pointer', transition: '0.2s' }}
                                >
                                    💚 Evet, Yerim! 👍
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px' }}>
                            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🏁</div>
                            <h3 style={{ fontSize: '18px', fontWeight: 900 }}>Tüm Kartlar Oylandı!</h3>
                            <p style={{ fontSize: '13px', color: '#64748B' }}>Ortak eşleşme sağlanamadıysa yeni bir tur başlatabilirsiniz.</p>
                            <button
                                onClick={handleCreateRoom}
                                style={{ background: '#8B5CF6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '16px', fontWeight: 900, marginTop: '15px', cursor: 'pointer' }}
                            >
                                🔄 Yeniden Karıştır & Oyna
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
