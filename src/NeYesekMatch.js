import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { DB_MAINS } from './realRecipes';
import { DB_MAINS_HUGE } from './hugeRecipes';

const ALL_MATCH_RECIPES = [...DB_MAINS, ...DB_MAINS_HUGE];

const SWEET_MATCH_DESCRIPTIONS = [
    "Günün tüm kararsızlığını bitirecek, sofranıza lezzet ve mutluluk katacak harika bir sofra seçeneği! 💕✨",
    "İkinizin de ilk lokmada bayılacağı, hem doyurucu hem de tam kıvamında enfes bir lezzet! 🍽️❤️",
    "Akşam sofranızı bir şölene dönüştürecek, damak çatlatan mükemmel bir yemek önerisi! 🥗✨",
    "Mutfakta harikalar yaratıp baş başa lezzetin tadını çıkarabileceğiniz tam bir lezzet klasiği! 🍷✨",
    "Eşiniz ve sevdiklerinizle aynı sofrada buluşup 'İyi ki bu yemeği seçmişiz' diyeceğiniz enfes bir tat! 💖🍽️",
    "Hazırlaması keyifli, tadı damağınızda kalacak ve günün yorgunluğunu unutturacak harika bir ana yemek! ✨🍲"
];

function getBulasikText(level) {
    const l = level || 2;
    if (l === 1) return { label: '🧽 1 Tencere (Sıfır Bulaşık)', color: '#10B981', bg: '#DCFCE7' };
    if (l === 2) return { label: '🧼🧽 Az Bulaşık (Çok Pratik)', color: '#059669', bg: '#D1FAE5' };
    if (l === 3) return { label: '🧼🧼🧽 Orta Bulaşık', color: '#D97706', bg: '#FEF3C7' };
    if (l === 4) return { label: '🧼🧼🧼 Yoğun Bulaşık', color: '#EA580C', bg: '#FFEDD5' };
    return { label: '🧼🧼🧼🧼 Detaylı / Çok Bulaşık', color: '#DC2626', bg: '#FEE2E2' };
}

function getRandomMatchPool(count = 15) {
    const shuffled = [...ALL_MATCH_RECIPES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((r, idx) => {
        const ingList = (r.ingredients || []).slice(0, 4).join(', ');
        const sweetBase = SWEET_MATCH_DESCRIPTIONS[idx % SWEET_MATCH_DESCRIPTIONS.length];
        const finalDesc = r.recipeDesc || (ingList ? `${sweetBase} (${ingList.charAt(0).toUpperCase() + ingList.slice(1)} malzemeleriyle hazırlanır)` : sweetBase);
        
        // Calculate clean/bulaşık level (1-5 scale) based on ingredient count and heaviness
        const ingLen = (r.ingredients || []).length;
        const bulasikLevel = Math.min(5, Math.max(1, Math.ceil(ingLen / 2.5)));

        return {
            id: r.id || `match_r_${idx}_${Date.now()}`,
            name: r.name,
            time: r.prepTime || r.time || 30,
            calories: r.calories || 450,
            cost: r.totalCost || r.cost || 90,
            ingredients: r.ingredients || [],
            recipeDesc: finalDesc,
            recipeSteps: r.recipe || r.recipeDesc || "Derin bir kapta malzemeleri harmanlayın, tam kıvamında pişirerek sıcak servis edin.",
            bulasikLevel: bulasikLevel
        };
    });
}

// Generate personalized room code (e.g. BAKI-1890, MEHMET-2740)
function generatePersonalizedCode(userName) {
    let cleanName = (userName || 'SEF')
        .replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]/g, '')
        .toUpperCase();
    
    // Turkish character map to ascii for clean code
    cleanName = cleanName
        .replace(/Ç/g, 'C').replace(/Ğ/g, 'G').replace(/İ/g, 'I')
        .replace(/Ö/g, 'O').replace(/Ş/g, 'S').replace(/Ü/g, 'U');

    if (!cleanName || cleanName.length < 2) cleanName = 'SEF';
    if (cleanName.length > 8) cleanName = cleanName.substring(0, 8);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${cleanName}-${randomNum}`;
}

export default function NeYesekMatch({ activeUser, onBack, openShopping }) {
    const [roomCode, setRoomCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [roomData, setRoomData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matchWinner, setMatchWinner] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState('');
    const [showGuide, setShowGuide] = useState(true);
    const [showRecipeModal, setShowRecipeModal] = useState(null);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [userLikedList, setUserLikedList] = useState([]);

    // Single-device mode state
    const [singleDeviceMode, setSingleDeviceMode] = useState(false);
    const [singleUserTurn, setSingleUserTurn] = useState(1);
    const [p1Votes, setP1Votes] = useState({});
    const [p2Votes, setP2Votes] = useState({});

    const userName = activeUser?.name || activeUser?.username || 'Şef';
    const userUid = activeUser?.uid || `user_${Date.now()}`;

    // Real-time listener for active room (Firebase + Fallback Engine)
    useEffect(() => {
        if (!roomCode || singleDeviceMode) return;

        let unsubscribe = () => {};

        try {
            const roomRef = doc(db, 'matches', roomCode.toUpperCase());
            unsubscribe = onSnapshot(roomRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setRoomData(data);

                    // Evaluate matches across all participants (Max 10)
                    evaluateRoomMatches(data);
                } else {
                    const localRoom = localStorage.getItem('LOCAL_MATCH_ROOM_' + roomCode);
                    if (localRoom) {
                        const parsed = JSON.parse(localRoom);
                        setRoomData(parsed);
                        evaluateRoomMatches(parsed);
                    }
                }
            }, () => {
                const localRoom = localStorage.getItem('LOCAL_MATCH_ROOM_' + roomCode);
                if (localRoom) {
                    const parsed = JSON.parse(localRoom);
                    setRoomData(parsed);
                    evaluateRoomMatches(parsed);
                }
            });
        } catch (e) {
            const localRoom = localStorage.getItem('LOCAL_MATCH_ROOM_' + roomCode);
            if (localRoom) {
                const parsed = JSON.parse(localRoom);
                setRoomData(parsed);
                evaluateRoomMatches(parsed);
            }
        }

        return () => unsubscribe();
    }, [roomCode, singleDeviceMode]);

    // Check for 100% unanimous match winner or top leaderboard dish
    const evaluateRoomMatches = (data) => {
        if (!data || !data.votes || !data.participants || data.participants.length < 2) return;

        const pool = data.pool || [];
        const participantUids = data.participants.map(p => p.uid);
        const votes = data.votes || {};

        // Find dish that has 'true' vote from ALL current participants
        for (const dish of pool) {
            const dishVotes = votes[dish.id] || {};
            const allYes = participantUids.every(uid => dishVotes[uid] === true);
            if (allYes && (!matchWinner || matchWinner.id !== dish.id)) {
                setMatchWinner(dish);
                setShowConfetti(true);
                return;
            }
        }
    };

    // Create Room with Personalized Code (e.g., MEHMET-2740)
    const handleCreateRoom = async () => {
        const generatedCode = generatePersonalizedCode(userName);
        setLoadingMsg(`Özel oda kodu üretiliyor (${generatedCode})...`);

        const newPool = getRandomMatchPool(15);
        const roomPayload = {
            code: generatedCode,
            hostUid: userUid,
            hostName: userName,
            participants: [
                { uid: userUid, name: userName, isHost: true }
            ],
            maxParticipants: 10,
            status: 'WAITING',
            pool: newPool,
            votes: {}, // { [dishId]: { [userUid]: true/false } }
            createdAt: new Date().toISOString()
        };

        // Always save to localStorage for offline resilience
        localStorage.setItem('LOCAL_MATCH_ROOM_' + generatedCode, JSON.stringify(roomPayload));

        try {
            await setDoc(doc(db, 'matches', generatedCode), roomPayload);
        } catch (e) {
            console.warn('Firebase çevrimdışı, yerel mod başlatıldı:', e);
        }

        setRoomCode(generatedCode);
        setRoomData(roomPayload);
        setUserLikedList([]);
        setMatchWinner(null);
        setShowLeaderboard(false);
        setLoadingMsg('');
    };

    // Join Room (Must enter exact code e.g. BAKI-1890)
    const handleJoinRoom = async () => {
        const clean = inputCode.trim().toUpperCase();
        if (!clean || !clean.includes('-')) {
            return alert('Lütfen tam oda kodunu girin (Örn: BAKI-1890 veya MEHMET-2740).');
        }

        setLoadingMsg('Odaya bağlanılıyor...');
        let data = null;

        try {
            const roomRef = doc(db, 'matches', clean);
            const docSnap = await getDoc(roomRef);

            if (docSnap.exists()) {
                data = docSnap.data();

                // Check participant limit (Max 10)
                const existingParticipants = data.participants || [];
                const alreadyJoined = existingParticipants.some(p => p.uid === userUid);

                if (!alreadyJoined) {
                    if (existingParticipants.length >= (data.maxParticipants || 10)) {
                        setLoadingMsg('');
                        return alert('Bu oda maksimum katılımcı sınırına (10 kişi) ulaştı!');
                    }

                    existingParticipants.push({ uid: userUid, name: userName, isHost: false });
                    data.participants = existingParticipants;
                    data.status = 'ACTIVE';

                    await updateDoc(roomRef, {
                        participants: existingParticipants,
                        status: 'ACTIVE'
                    });
                }
            }
        } catch (e) {
            console.warn('Firebase bağlantı uyarısı, yerel oda kontrol ediliyor...');
        }

        // Try local storage fallback
        if (!data) {
            const localStr = localStorage.getItem('LOCAL_MATCH_ROOM_' + clean);
            if (localStr) {
                data = JSON.parse(localStr);
                const existingParticipants = data.participants || [];
                const alreadyJoined = existingParticipants.some(p => p.uid === userUid);

                if (!alreadyJoined) {
                    existingParticipants.push({ uid: userUid, name: userName, isHost: false });
                    data.participants = existingParticipants;
                    data.status = 'ACTIVE';
                    localStorage.setItem('LOCAL_MATCH_ROOM_' + clean, JSON.stringify(data));
                }
            }
        }

        if (!data) {
            setLoadingMsg('');
            return alert(`"${clean}" kodlu oda bulunamadı! Lütfen oda oluşturan kişinin verdiği tam oda kodunu (Örn: MEHMET-2740) girdiğinizden emin olun.`);
        }

        setRoomCode(clean);
        setRoomData(data);
        setUserLikedList([]);
        setMatchWinner(null);
        setShowLeaderboard(false);
        setLoadingMsg('');
    };

    // Single-device mode setup
    const startSingleDeviceMode = () => {
        const newPool = getRandomMatchPool(15);
        setSingleDeviceMode(true);
        setSingleUserTurn(1);
        setP1Votes({});
        setP2Votes({});
        setCurrentIndex(0);
        setRoomCode('TEK-CİHAZ-MODU');
        setRoomData({
            code: 'TEK-CİHAZ',
            participants: [
                { uid: 'p1', name: '1. Kişi' },
                { uid: 'p2', name: '2. Kişi' }
            ],
            pool: newPool
        });
        setUserLikedList([]);
        setMatchWinner(null);
        setShowLeaderboard(false);
    };

    // Reshuffle 15 New Dishes Pool
    const handleReshufflePool = async () => {
        if (!roomData) return;
        const newPool = getRandomMatchPool(15);
        setLoadingMsg('Yeni 15 lezzetli yemek kartı yükleniyor...');

        if (singleDeviceMode) {
            setRoomData({ ...roomData, pool: newPool });
            setCurrentIndex(0);
            setP1Votes({});
            setP2Votes({});
            setSingleUserTurn(1);
            setLoadingMsg('');
            return;
        }

        try {
            await updateDoc(doc(db, 'matches', roomCode), {
                pool: newPool,
                votes: {}
            });
        } catch (e) {
            const localStr = localStorage.getItem('LOCAL_MATCH_ROOM_' + roomCode);
            if (localStr) {
                const localData = JSON.parse(localStr);
                localData.pool = newPool;
                localData.votes = {};
                localStorage.setItem('LOCAL_MATCH_ROOM_' + roomCode, JSON.stringify(localData));
                setRoomData(localData);
            }
        }

        setCurrentIndex(0);
        setUserLikedList([]);
        setMatchWinner(null);
        setShowLeaderboard(false);
        setLoadingMsg('');
    };

    // Vote on current dish card
    const handleVote = async (voteValue) => {
        if (!roomData) return;
        const currentRecipe = (roomData.pool || [])[currentIndex];
        if (!currentRecipe) return;

        // If liked, add to user's personal liked drawer
        if (voteValue === true) {
            if (!userLikedList.some(item => item.id === currentRecipe.id)) {
                setUserLikedList(prev => [...prev, currentRecipe]);
            }
        }

        // Single device mode logic
        if (singleDeviceMode) {
            if (singleUserTurn === 1) {
                const updatedP1 = { ...p1Votes, [currentRecipe.id]: voteValue };
                setP1Votes(updatedP1);
                if (currentIndex < roomData.pool.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    setSingleUserTurn(2);
                    setCurrentIndex(0);
                    alert("📱 1. Kişi oylamasını tamamladı! Şimdi telefonu 2. kişiye verin.");
                }
            } else {
                const updatedP2 = { ...p2Votes, [currentRecipe.id]: voteValue };
                setP2Votes(updatedP2);

                if (p1Votes[currentRecipe.id] === true && voteValue === true) {
                    setMatchWinner(currentRecipe);
                    setShowConfetti(true);
                    return;
                }

                if (currentIndex < roomData.pool.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    setShowLeaderboard(true);
                }
            }
            return;
        }

        // Online Multi-User Vote
        try {
            const votePath = `votes.${currentRecipe.id}.${userUid}`;
            await updateDoc(doc(db, 'matches', roomCode), {
                [votePath]: voteValue
            });
        } catch (e) {
            // Local fallback storage
            const localStr = localStorage.getItem('LOCAL_MATCH_ROOM_' + roomCode);
            if (localStr) {
                const localData = JSON.parse(localStr);
                if (!localData.votes[currentRecipe.id]) localData.votes[currentRecipe.id] = {};
                localData.votes[currentRecipe.id][userUid] = voteValue;

                localStorage.setItem('LOCAL_MATCH_ROOM_' + roomCode, JSON.stringify(localData));
                setRoomData(localData);
                evaluateRoomMatches(localData);
            }
        }

        if (currentIndex < (roomData.pool.length - 1)) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setShowLeaderboard(true);
        }
    };

    const currentCard = roomData?.pool ? roomData.pool[currentIndex] : null;

    // Leaderboard Data Calculation
    const getLeaderboardData = () => {
        if (!roomData || !roomData.pool) return [];
        const pool = roomData.pool;
        const participants = roomData.participants || [];
        const votes = roomData.votes || {};

        return pool.map(dish => {
            let yesCount = 0;
            const voterDetails = {};

            if (singleDeviceMode) {
                if (p1Votes[dish.id] === true) { yesCount++; voterDetails['1. Kişi'] = true; }
                if (p2Votes[dish.id] === true) { yesCount++; voterDetails['2. Kişi'] = true; }
            } else {
                const dishVotes = votes[dish.id] || {};
                participants.forEach(p => {
                    if (dishVotes[p.uid] === true) {
                        yesCount++;
                        voterDetails[p.name] = true;
                    } else if (dishVotes[p.uid] === false) {
                        voterDetails[p.name] = false;
                    }
                });
            }

            return {
                ...dish,
                yesCount,
                voterDetails,
                approvalRatio: Math.round((yesCount / Math.max(1, participants.length)) * 100)
            };
        }).sort((a, b) => b.yesCount - a.yesCount);
    };

    return (
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '15px', color: '#1E293B' }}>
            
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
                    🍽️ Ne Yesek Match (10 Katılımcılı Eşleşme)
                </div>
            </div>

            {/* 1. LOBBY VIEW (CREATE / JOIN / GUIDE) */}
            {!roomCode && (
                <div style={{ background: 'white', borderRadius: '26px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ fontSize: '44px', marginBottom: '8px' }}>👨‍👩‍👧‍👦❤️</div>
                        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', marginBottom: '6px' }}>
                            "Bugün Ne Yemek Pişirsek?" Kararsızlığına %100 Çözüm!
                        </h2>
                        <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                            Aileniz, eşiniz veya ev arkadaşlarınızla (10 kişiye kadar) odaya katılın. Herkes lezzetli yemek kartlarını oylasın, en çok sevilen yemeği anında siparişe dönüştürün!
                        </p>
                    </div>

                    {/* USAGE GUIDE BOX */}
                    <div style={{ background: '#F8FAFC', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowGuide(!showGuide)}>
                            <span style={{ fontWeight: 800, color: '#4338CA', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ❓ Gelişmiş Eşleşme Modu Nasıl Çalışır? (10 Kişi Desteği)
                            </span>
                            <span style={{ fontSize: '14px', color: '#6366F1' }}>{showGuide ? '▲' : '▼'}</span>
                        </div>

                        {showGuide && (
                            <div style={{ marginTop: '12px', fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                                <div style={{ marginBottom: '6px' }}><b>1. Kişisel Oda Kodu:</b> Biriniz <b>"👑 Özel Oda Oluştur"</b> butonuna basar ve ismine özel kodu alır (Örn: <code>BAKI-1890</code> veya <code>MEHMET-2740</code>).</div>
                                <div style={{ marginBottom: '6px' }}><b>2. Çoklu Katılım (Max 10 Kişi):</b> Diğer aile bireyleri / arkadaşlar kendi telefonlarından bu tam oda kodunu yazarak odaya katılır.</div>
                                <div style={{ marginBottom: '6px' }}><b>3. Detaylı Kart Oylama:</b> Ekrana gelen kartlarda Süre, Kalori, Bütçe ve <b>🧼 Bulaşık Düzeyi</b> bilgisiyle kartlara <b>"💚 Evet"</b> veya <b>"❌ Pas"</b> verirsiniz.</div>
                                <div><b>4. Oy Matrisi & Sonuç Tablosu:</b> Herkes oylamayı bitirdiğinde en çok oy alan yemek 1. seçilir ve tek tıkla market sepetine aktarılır! 🎉</div>
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
                            <span>Özel Oda Oluştur ({userName})</span>
                        </button>
                        <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '18px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Örn: MEHMET-2740"
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
                    <div style={{ background: 'white', borderRadius: '28px', padding: '28px', maxWidth: '520px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                        <div style={{ fontSize: '54px', marginBottom: '10px' }}>🎉🏆</div>
                        <div style={{ background: '#FCE7F3', color: '#DB2777', padding: '6px 16px', borderRadius: '20px', fontWeight: 900, fontSize: '12px', display: 'inline-block', marginBottom: '12px' }}>
                            %100 ORTAK KARAR YAKALANDI!
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>
                            {matchWinner.name}
                        </h2>
                        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '18px' }}>
                            Odadaki tüm katılımcılar bu lezzetli yemeğe "Evet" dedi! Sofra menünüz oy birliğiyle belirlendi. 🥳
                        </p>

                        <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '18px', border: '1px solid #E2E8F0', marginBottom: '18px', display: 'flex', justifyContent: 'space-around', fontSize: '12px', fontWeight: 800, color: '#475569', flexWrap: 'wrap', gap: '8px' }}>
                            <span>⏱️ {matchWinner.time} Dk</span>
                            <span>🔥 {matchWinner.calories} Kcal</span>
                            <span>💰 ₺{matchWinner.cost} Gramaj</span>
                            <span>{getBulasikText(matchWinner.bulasikLevel).label}</span>
                        </div>

                        {/* Price Transparency Reminder */}
                        <div style={{ background: '#FEF3C7', color: '#92400E', padding: '10px 14px', borderRadius: '12px', fontSize: '11px', lineHeight: '1.4', marginBottom: '18px', textAlign: 'left', borderLeft: '3px solid #F59E0B' }}>
                            💡 <b>Tarif Maliyeti (₺{matchWinner.cost}):</b> Yemekte kullanılan tam gramaj tutarıdır. Market alışverişinde tam paketler (1L Yağ, 1Kg Un vb.) satıldığı için sepet tutarı değişebilir.
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    if (openShopping) openShopping({ main: matchWinner });
                                }}
                                style={{ background: 'linear-gradient(135deg, #10B981, #047857)', color: 'white', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: 900, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}
                            >
                                🎯 EVET, YAPMAYA KARAR VERDİM! 🛒 (Market Sepeti Çıkar)
                            </button>
                            <button
                                onClick={() => setShowRecipeModal(matchWinner)}
                                style={{ background: '#F3F4F6', color: '#334155', border: 'none', padding: '12px', borderRadius: '16px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
                            >
                                📖 Adım Adım Yapılış Tarifini İncele
                            </button>
                            <button
                                onClick={() => {
                                    setRoomCode('');
                                    setMatchWinner(null);
                                    setShowConfetti(false);
                                    setSingleDeviceMode(false);
                                }}
                                style={{ background: 'transparent', color: '#64748B', border: 'none', padding: '8px', borderRadius: '16px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}
                            >
                                🔄 Yeni Oyun Başlat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. RECIPE DETAIL POPUP MODAL */}
            {showRecipeModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001, padding: '20px' }} onClick={() => setShowRecipeModal(null)}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0 }}>{showRecipeModal.name}</h3>
                            <button onClick={() => setShowRecipeModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}>✕</button>
                        </div>
                        <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6', background: '#F8FAFC', padding: '15px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '15px' }}>
                            <strong>👨‍🍳 Adım Adım Mutfak Tarifi:</strong><br/><br/>
                            {showRecipeModal.recipeSteps}
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569', marginBottom: '15px' }}>
                            <strong>📋 Gerekli Malzemeler:</strong><br/>
                            {(showRecipeModal.ingredients || []).join(', ')}
                        </div>
                        <button onClick={() => setShowRecipeModal(null)} style={{ width: '100%', padding: '12px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer' }}>Kapat</button>
                    </div>
                </div>
            )}

            {/* 4. LEADERBOARD & MATRIX MODAL */}
            {showLeaderboard && (
                <div style={{ background: 'white', borderRadius: '26px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ fontSize: '40px', marginBottom: '6px' }}>📊🏆</div>
                        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A' }}>Oylama Sonuç Tablosu ve Skor Matrisi</h2>
                        <p style={{ fontSize: '13px', color: '#64748B' }}>Odadaki tüm katılımcıların oy dağılımı ve en çok beğenilen lezzetler sıralandı.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                        {getLeaderboardData().map((dish, rank) => {
                            const isTop = rank === 0 && dish.yesCount > 0;
                            return (
                                <div key={dish.id} style={{ border: isTop ? '2px solid #10B981' : '1px solid #E2E8F0', borderRadius: '18px', padding: '16px', background: isTop ? '#ECFDF5' : '#F8FAFC' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 900, color: rank === 0 ? '#059669' : rank === 1 ? '#D97706' : '#64748B' }}>
                                                {rank === 0 ? '🥇 1.' : rank === 1 ? '🥈 2.' : rank === 2 ? '🥉 3.' : `${rank + 1}.`}
                                            </span>
                                            <span style={{ fontWeight: 900, fontSize: '16px', color: '#0F172A' }}>{dish.name}</span>
                                        </div>
                                        <span style={{ fontSize: '12px', background: isTop ? '#10B981' : '#CBD5E1', color: 'white', padding: '4px 10px', borderRadius: '12px', fontWeight: 900 }}>
                                            %{dish.approvalRatio} Uyum ({dish.yesCount} Oy)
                                        </span>
                                    </div>

                                    {/* Voters breakdown tags */}
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        {Object.keys(dish.voterDetails).map(vName => (
                                            <span key={vName} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: dish.voterDetails[vName] ? '#DCFCE7' : '#FEE2E2', color: dish.voterDetails[vName] ? '#15803D' : '#B91C1C', fontWeight: 800 }}>
                                                {dish.voterDetails[vName] ? `💚 ${vName}: Evet` : `❌ ${vName}: Pas`}
                                            </span>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => { if (openShopping) openShopping({ main: dish }); }} style={{ flex: 1, padding: '8px', background: '#10B981', color: 'white', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                                            🎯 Bu Yemeğe Karar Ver & Sipariş Et
                                        </button>
                                        <button onClick={() => setShowRecipeModal(dish)} style={{ padding: '8px 12px', background: 'white', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                            📖 Tarifi Gör
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleReshufflePool} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 900, fontSize: '13px', cursor: 'pointer' }}>
                            🔄 Yeni 15 Farklı Yemek Varyasyonu Üret
                        </button>
                        <button onClick={() => setShowLeaderboard(false)} style={{ padding: '14px 20px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>
                            Kartlara Dön
                        </button>
                    </div>
                </div>
            )}

            {/* 5. GAMEPLAY ROOM VIEW */}
            {roomCode && !matchWinner && roomData && !showLeaderboard && (
                <div style={{ background: 'white', borderRadius: '26px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
                    
                    {/* Room Info Bar */}
                    <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '20px', marginBottom: '15px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div>
                                <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 800 }}>ÖZEL ODA KODU</div>
                                <div style={{ fontSize: '18px', color: '#8B5CF6', fontWeight: 900, letterSpacing: '1px', cursor: 'pointer' }} onClick={() => { navigator.clipboard?.writeText(roomData.code); alert('Oda kodu kopyalandı: ' + roomData.code); }}>
                                    {roomData.code} 📋
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <button onClick={() => setShowLeaderboard(true)} style={{ background: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE', padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 900, cursor: 'pointer' }}>
                                    📊 Sonuç Tablosu
                                </button>
                            </div>
                        </div>

                        {/* Live Participants Badges (Up to 10 People) */}
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, marginBottom: '6px' }}>
                            ODADAKİ KATILIMCILAR ({(roomData.participants || []).length}/10 Kişi):
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {(roomData.participants || []).map(p => (
                                <span key={p.uid} style={{ background: p.isHost ? '#FCE7F3' : '#E0E7FF', color: p.isHost ? '#BE185D' : '#3730A3', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                                    {p.isHost ? '👑 ' : '👤 '}{p.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Waiting Notice if only 1 person in online room */}
                    {!singleDeviceMode && (roomData.participants || []).length < 2 && (
                        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#D97706', padding: '12px', borderRadius: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 800, marginBottom: '20px' }}>
                            ⏳ Diğer katılımcıların odaya girmesi bekleniyor! Oda Kodunu (<strong>{roomData.code}</strong>) grubunuza veya eşinize verin.
                        </div>
                    )}

                    {/* RECIPE SWIPE CARD */}
                    {currentCard ? (
                        <div style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)', borderRadius: '24px', padding: '22px', border: '2px solid #EEF2FF', boxShadow: '0 8px 25px rgba(0,0,0,0.04)', textAlign: 'center', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 900, textTransform: 'uppercase' }}>
                                    TARİF {currentIndex + 1} / {roomData.pool.length}
                                </span>
                                <button onClick={() => setShowRecipeModal(currentCard)} style={{ background: '#F1F5F9', border: 'none', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', color: '#475569', fontWeight: 800, cursor: 'pointer' }}>
                                    📖 Tarifi İncele
                                </button>
                            </div>

                            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', marginBottom: '12px' }}>
                                {currentCard.name}
                            </h3>

                            {/* Metrics Grid: Time, Calories, Cost, Bulaşık Rating */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                                <div style={{ background: '#EEF2FF', color: '#4338CA', padding: '8px', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>
                                    ⏱️ {currentCard.time} Dk Pişme
                                </div>
                                <div style={{ background: '#FEF3C7', color: '#B45309', padding: '8px', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>
                                    💰 ₺{currentCard.cost} Gramaj Bütçesi
                                </div>
                                <div style={{ background: '#FCE7F3', color: '#BE185D', padding: '8px', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>
                                    🔥 {currentCard.calories} Kcal
                                </div>
                                <div style={{ background: getBulasikText(currentCard.bulasikLevel).bg, color: getBulasikText(currentCard.bulasikLevel).color, padding: '8px', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>
                                    {getBulasikText(currentCard.bulasikLevel).label}
                                </div>
                            </div>

                            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', background: 'white', padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '22px' }}>
                                {currentCard.recipeDesc}
                            </p>

                            {/* VOTING BUTTONS */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '15px' }}>
                                <button
                                    onClick={() => handleVote(false)}
                                    style={{ background: '#FEE2E2', color: '#DC2626', border: '2px solid #FECACA', padding: '16px', borderRadius: '20px', fontWeight: 900, fontSize: '15px', cursor: 'pointer', transition: '0.2s' }}
                                >
                                    ❌ Pas Geç (İstemiyorum)
                                </button>
                                <button
                                    onClick={() => handleVote(true)}
                                    style={{ background: '#DCFCE7', color: '#16A34A', border: '2px solid #BBF7D0', padding: '16px', borderRadius: '20px', fontWeight: 900, fontSize: '15px', cursor: 'pointer', transition: '0.2s' }}
                                >
                                    💚 Evet, Yerim! 👍
                                </button>
                            </div>

                            {/* RESHUFFLE BUTTON */}
                            <button
                                onClick={handleReshufflePool}
                                style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px dashed #CBD5E1', color: '#64748B', borderRadius: '14px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}
                            >
                                🔄 Hiçbirini Beğenmedim, Yeni 15 Farklı Yemek Kartı Yükle
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px' }}>
                            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🏁</div>
                            <h3 style={{ fontSize: '18px', fontWeight: 900 }}>Tüm Yemek Kartları Oylandı!</h3>
                            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '15px' }}>Sonuç tablosunu inceleyebilir veya yeni 15 tarif yükleyebilirsiniz.</p>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button onClick={() => setShowLeaderboard(true)} style={{ background: '#10B981', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '16px', fontWeight: 900, cursor: 'pointer' }}>
                                    📊 Sonuç Tablosunu Aç
                                </button>
                                <button onClick={handleReshufflePool} style={{ background: '#8B5CF6', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '16px', fontWeight: 900, cursor: 'pointer' }}>
                                    🔄 Yeni 15 Varyasyon Üret
                                </button>
                            </div>
                        </div>
                    )}

                    {/* LIVE LIKED DISHES DRAWER */}
                    {userLikedList.length > 0 && (
                        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #CBD5E1' }}>
                            <div style={{ fontSize: '13px', fontWeight: 900, color: '#059669', marginBottom: '8px' }}>
                                💚 Sizin Beğendikleriniz ({userLikedList.length} Yemek):
                            </div>
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                                {userLikedList.map(dish => (
                                    <div key={dish.id} style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', whiteSpace: 'nowrap', fontWeight: 800, color: '#047857' }}>
                                        {dish.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
