import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { generateSmartMenus, generateExactBudgetMenus, processChatPrompt, processLeftovers, generateCrossMenu, getDishDetails, generateShoppingList, generateFridgeMains, CATEGORIZED_INGREDIENTS, generateMissingShoppingList, generateWeeklyPlan, generateWheelItems, generateGroupMenu, getSimilarDishes } from './engine';
import { DB_MAINS_HUGE } from './hugeRecipes';
import { auth, googleProvider, db, storage } from './firebase';
import { signInWithPopup, signInAnonymously } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, onSnapshot, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SocialFlow from './SocialFlow';
const TRANSLATIONS = {
  tr: { nav_social: "Eğlence Serüveni", nav_smart: "Akıllı Menü", nav_chat: "YZ Sohbet", nav_recycle: "Dönüşüm", nav_settings: "Ayarlar", hub_welcome: "Hoş Geldin", hub_desc: "Gurme Yapay Zeka Kapınızda", fridge: "Dolabımdakiler", wheel: "Şans Çarkı (Ne Yesek?)", health: "Evin Sağlık Karnesi", weekly: "Haftalık Zeki Program", theme: "Tema ve Görünüm", dark_mode: "Karanlık Moda Geç", lang: "Arayüz Dili", favs: "Favorilerim", logout: "Oturumu Kapat" },
  en: { nav_social: "Adventure", nav_smart: "Smart Menu", nav_chat: "AI Chat", nav_recycle: "Recycle", nav_settings: "Settings", hub_welcome: "Welcome", hub_desc: "Gourmet AI at your Doorstep", fridge: "In My Fridge", wheel: "Lucky Wheel", health: "Family Health", weekly: "Smart Weekly", theme: "Theme & Display", dark_mode: "Enable Dark Mode", lang: "Interface Language", favs: "My Favorites", logout: "Sign Out" },
  de: { nav_social: "Abenteuer", nav_smart: "Smart-Menü", nav_chat: "KI-Chat", nav_recycle: "Recyceln", nav_settings: "Einstellungen", hub_welcome: "Willkommen", hub_desc: "Gourmet-KI vor der Tür", fridge: "In Meinem Kühlschrank", wheel: "Glücksrad", health: "Familiengesundheit", weekly: "Intelligente Woche", theme: "Thema", dark_mode: "Dunkelmodus", lang: "Sprache", favs: "Meine Favoriten", logout: "Abmelden" },
  fr: { nav_social: "Aventure", nav_smart: "Menu Intel", nav_chat: "Chat IA", nav_recycle: "Recyclage", nav_settings: "Paramètres", hub_welcome: "Bienvenue", hub_desc: "L'IA Gourmet à Domicile", fridge: "Dans Mon Frigo", wheel: "Roue de la Chance", health: "Santé Familiale", weekly: "Plan Hebdo", theme: "Thème", dark_mode: "Mode Sombre", lang: "Langue", favs: "Mes Favoris", logout: "Déconnexion" },
  it: { nav_social: "Avventura", nav_smart: "Menu Smart", nav_chat: "Chat IA", nav_recycle: "Ricicla", nav_settings: "Impostazioni", hub_welcome: "Benvenuto", hub_desc: "L'IA Gourmet a Domicilio", fridge: "Nel Mio Frigo", wheel: "Ruota della Fortuna", health: "Salute in Famiglia", weekly: "Piano Settimanale", theme: "Tema", dark_mode: "Modalità Scura", lang: "Lingua", favs: "I Miei Preferiti", logout: "Esci" }
};

const trackGenerations = () => {
   let c = parseInt(localStorage.getItem('baki_metrics_menus_produced') || '0');
   localStorage.setItem('baki_metrics_menus_produced', c + 1);
};

const Confetti = () => {
  const colors = ['#FF5A5F', '#00A699', '#F4A261', '#4F46E5', '#10B981'];
  return (
    <div className="confetti-container">
      {[...Array(50)].map((_, i) => (
        <div key={i} className="confetti-piece" style={{
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            width: `${Math.random() * 8 + 5}px`, height: `${Math.random() * 15 + 10}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0'
          }} />
      ))}
    </div>
  );
};

function App() {
  const [activeUser, setActiveUser] = useState(() => {
     try {
         const saved = localStorage.getItem('baki_active_user');
         return saved ? JSON.parse(saved) : null;
     } catch (e) { return null; }
  });
  const [view, setView] = useState(() => {
      // Yalnızca kullanıcı adı varsa doğrudan APP'ye gir
      return (activeUser && activeUser.username) ? 'APP' : (activeUser ? 'USERNAME_SETUP' : 'AUTH');
  }); // AUTH, APP, USERNAME_SETUP, ADMIN
  const [activeTab, setActiveTab] = useState('APP'); 
  const [darkMode, setDarkMode] = useState(localStorage.getItem('baki_theme') === 'dark');
  const [appLang, setAppLang] = useState(localStorage.getItem('baki_lang') || 'tr');
  const [staples, setStaples] = useState(() => {
     try {
       const saved = localStorage.getItem('baki_staples');
       return saved ? JSON.parse(saved) : ['tuz', 'karabiber', 'sıvı yağ', 'zeytinyağı'];
     } catch (e) { return ['tuz', 'karabiber', 'sıvı yağ', 'zeytinyağı']; }
  });
  const t = (key) => TRANSLATIONS[appLang] ? (TRANSLATIONS[appLang][key] || TRANSLATIONS['tr'][key]) : TRANSLATIONS['tr'][key];

  useEffect(() => {
     if(darkMode) document.body.classList.add('dark-mode');
     else document.body.classList.remove('dark-mode');
     localStorage.setItem('baki_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const [globalAd, setGlobalAd] = useState("");
  const [globalAdImg, setGlobalAdImg] = useState("");
  useEffect(() => {
     const adSub = onSnapshot(doc(db, 'system', 'adConfig'), (d) => {
         if(d.exists()) {
             setGlobalAd(d.data().text || "");
             setGlobalAdImg(d.data().image || "");
         }
     });
     return () => adSub();
  }, []);

  // BAN SHIELD
  useEffect(() => {
     if (activeUser?.uid) {
         const uns = onSnapshot(doc(db, 'users', activeUser.uid), (dsnap) => {
             if (dsnap.exists()) {
                 const data = dsnap.data();
                 if (data.isBanned) {
                     alert("Sistem Bildirimi: Hesabınız sistem yöneticisi tarafından platformdan kalıcı olarak uzaklaştırılmıştır.");
                     localStorage.removeItem('baki_active_user');
                     setActiveUser(null);
                     setView('AUTH');
                     try { auth.signOut(); } catch(e){}
                 }
             }
         });
         return () => uns();
     }
  }, [activeUser?.uid]);
  
  // SESSION TRACKER (Heartbeat)
  useEffect(() => {
     if (!activeUser?.uid) return;
     let sessionStartTime = Date.now();
     
     const updateHeartbeat = async () => {
         try {
             const durationMins = Math.floor((Date.now() - sessionStartTime) / 60000);
             if (durationMins >= 0) {
                 await updateDoc(doc(db, 'users', activeUser.uid), {
                    lastLogin: sessionStartTime,
                    lastActive: Date.now(),
                    lastSessionDuration: durationMins
                 });
             }
         } catch(e) {}
     };

     const interval = setInterval(updateHeartbeat, 60000);
     updateHeartbeat();
     
     return () => {
         updateHeartbeat();
         clearInterval(interval);
     };
  }, [activeUser?.uid]);
  
  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [setupUsername, setSetupUsername] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleAuth = async () => {
     if (!email.includes("@")) {
        alert("Lütfen geçerli bir e-posta (örn: isim@mail.com) girin.");
        return;
     }
     if (password.length < 6) {
        alert("Güvenliğiniz için şifre en az 6 karakter olmalıdır.");
        return;
     }
     if (!isLoginMode && !fullName.trim()) {
        alert("Lütfen adınızı ve soyadınızı girin.");
        return;
     }
     
     const dbUsers = JSON.parse(localStorage.getItem('baki_users_db') || "[]");
     
     if (isLoginMode) {
         // Giriş
         const found = dbUsers.find(u => u.email === email);
         if(!found) return alert("Sistemde böyle bir kullanıcı bulunamadı! Lütfen önce 'Kayıt Ol' paneline geçin.");
         if(found.password !== password) return alert("Hatalı şifre girdiniz! Tekrar deneyin.");
         
         // Onaylandı
         if (!found.uid) {
             const newUid = "local_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
             found.uid = newUid;
             localStorage.setItem('baki_users_db', JSON.stringify(dbUsers));
             try {
                 await setDoc(doc(db, 'users', newUid), {
                     uid: newUid, name: found.fullName, email: found.email, photoURL: "",
                     createdAt: new Date().toISOString(), follows: [], followers: []
                 });
             } catch(e) {}
         }
         
         // Google ile girilmediği halde kurallara yakalanmamak için Firebase anonim token'ı al
         try { await signInAnonymously(auth); } catch(e) { console.log("Anonim oturum hatası:", e); }
         
         // Persistent Session kaydı
         localStorage.setItem('baki_active_user', JSON.stringify(found));
         setActiveUser(found);
         if (!found.username) {
             setView('USERNAME_SETUP');
         } else {
             setView('APP');
         }
     } else {
         // Kayıt
         const found = dbUsers.find(u => u.email === email);
         if(found) return alert("Bu adres zaten kullanımda! Giriş yap sekmesine geçin.");
         
         const newUid = "local_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
         const newUser = { uid: newUid, email, password, fullName, photoURL: "" };
         
         dbUsers.push(newUser);
         localStorage.setItem('baki_users_db', JSON.stringify(dbUsers));
         
         try {
             await setDoc(doc(db, 'users', newUid), {
                 uid: newUid,
                 name: fullName,
                 email: email,
                 photoURL: "",
                 createdAt: new Date().toISOString(),
                 follows: [],
                 followers: []
             });
         } catch(e) { console.error("Firestore'a local user eklenemedi:", e); }

         alert("Hesabınız yaratıldı! Şimdi başarıyla giriş yapabilirsiniz.");
         setIsLoginMode(true);
         setPassword("");
     }
  };

  // -- ADMIN SECRET LOGIC --
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  // Gerçek zamanlı etkileşim ve seans takibi (Admin paneli için)
  useEffect(() => {
     let sess = parseInt(localStorage.getItem('baki_sessions') || '0');
     if(sess === 0) {
        localStorage.setItem('baki_sessions', 1);
     } else if (!sessionStorage.getItem('baki_curr_session')) {
        localStorage.setItem('baki_sessions', sess + 1);
        sessionStorage.setItem('baki_curr_session', 'true');
     }
     
     const clickHandler = () => {
        let clicks = parseInt(localStorage.getItem('baki_metrics_clicks') || '0');
        localStorage.setItem('baki_metrics_clicks', clicks + 1);
     };
     window.addEventListener('click', clickHandler);
     return () => window.removeEventListener('click', clickHandler);
  }, []);

  const handleTitleClick = () => {
    tapCount.current += 1;
    if (tapCount.current === 3) {
      const pswd = prompt("Admin Şifresi:");
      if (pswd === "Ysf.") {
        setView('ADMIN');
      } else {
        alert("Hatalı Parola!");
      }
      tapCount.current = 0;
    }
    
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 1500); // 1.5 sn içinde art arda 3 kez tıklanmalı
  };

  const handleSocialLogin = async (provider, providerName) => {
     try {
         const result = await signInWithPopup(auth, provider);
         const user = result.user;
         
         try {
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);
            
            if (!docSnap.exists()) {
               await setDoc(userRef, {
                  uid: user.uid,
                  name: user.displayName || "Şef",
                  email: user.email || "isimsiz",
                  photoURL: user.photoURL || "",
                  createdAt: new Date().toISOString(),
                  follows: [],
                  followers: []
               });
               setActiveUser({ uid: user.uid, name: user.displayName || "Şef", email: user.email || "", photoURL: user.photoURL || "" });
               setView('USERNAME_SETUP');
            } else {
               const dbUser = docSnap.data();
               setActiveUser({ uid: user.uid, name: dbUser.name || user.displayName, email: user.email, photoURL: dbUser.photoURL || user.photoURL, username: dbUser.username });
               
               if (!dbUser.username) {
                   localStorage.setItem('baki_active_user', JSON.stringify({ uid: user.uid, name: dbUser.name || user.displayName, email: user.email, photoURL: dbUser.photoURL || user.photoURL, username: "" }));
                   setView('USERNAME_SETUP');
               } else {
                   localStorage.setItem('baki_active_user', JSON.stringify({ uid: user.uid, name: dbUser.name || user.displayName, email: user.email, photoURL: dbUser.photoURL || user.photoURL, username: dbUser.username }));
                   setView('APP');
               }
            }
         } catch (dbError) {
            console.log("Firestore veritabanına erişim başarısız:", dbError.message);
            setActiveUser({ uid: user.uid, name: user.displayName, email: user.email, photoURL: user.photoURL });
            setView('APP');
         }
      } catch(e) {
         alert(`${providerName} girişi başarısız. Hata: ${e.message}\n\nFirebase Console -> Authentication sekmesinden ${providerName} sağlayıcısını aktif edip kodlarını girdiğinizden emin olun.`);
      }
  };

  // --- VIEWS ---

  if (view === 'AUTH') {
    return (
      <div className="App">
        <div className="auth-container">
          <h1 className="auth-logo">Baki'nin Mutfağı</h1>
          <p className="auth-sub" style={{color: '#10B981', fontWeight: 600}}>SaaS v2.0 - Kimlik Doğrulama</p>

          <div style={{display: 'flex', gap: '10px', marginBottom: '15px', width: '100%', maxWidth: '300px'}}>
             <button style={{flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: isLoginMode ? '#1E293B' : '#E2E8F0', color: isLoginMode ? 'white' : '#64748B', fontWeight: 800, cursor: 'pointer', transition: '0.3s'}} onClick={() => setIsLoginMode(true)}>GİRİŞ YAP</button>
             <button style={{flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: !isLoginMode ? '#10B981' : '#E2E8F0', color: !isLoginMode ? 'white' : '#64748B', fontWeight: 800, cursor: 'pointer', transition: '0.3s'}} onClick={() => setIsLoginMode(false)}>KAYDOL</button>
          </div>

          <div className="auth-form" style={{width: '100%', maxWidth: '300px'}}>
            {!isLoginMode && (
              <input type="text" placeholder="İsim Soyisim" className="auth-input" value={fullName} onChange={e=>setFullName(e.target.value)} />
            )}
            <input type="email" placeholder="E-posta Adresiniz" className="auth-input" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder="Şifreniz" className="auth-input" value={password} onChange={e=>setPassword(e.target.value)} />
            <button className="auth-btn" onClick={handleAuth}>{isLoginMode ? 'Giriş Yap' : 'Yeni Hesap Aç'}</button>
          </div>

          <div className="auth-divider">VEYA SOSYAL GİRİŞ (Firebase Aktif)</div>

          <div className="social-btns">
            <button className="social-btn google" onClick={() => handleSocialLogin(googleProvider, "Google")}>
              G Google ile Devam Et
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'USERNAME_SETUP') {
     const handleUsernameSetup = async () => {
         const clean = setupUsername.toLowerCase().trim().replace(/[^a-z0-9_.]/g, '');
         if (clean.length < 3) return alert("Kullanıcı adı en az 3 karakter olmalıdır. Türkçe karakter yerine ingilizce harfler kullanın.");
         
         const BAD_WORDS = ['amk', 'sik', 'yarrak', 'orospu', 'piç', 'göt', 'bok', 'mal', 'kahpe', 'am', 'meme', 'yavsak', 'surtuk', 'koyayim'];
         if (BAD_WORDS.some(w => clean.includes(w))) {
             return alert("Kullanıcı adınız sistem standartlarına aykırı kelimeler içeriyor. Sistem tarafından reddedildi.");
         }

         try {
             // Benzersizlik Kontrolü
             const q = query(collection(db, "users"), where("username", "==", clean));
             const querySnapshot = await getDocs(q);
             
             if (!querySnapshot.empty) {
                 return alert("⚠️ Bu kullanıcı adı şu anda kullanımda! Lütfen bambaşka bir kullanıcı adı seçin.");
             }
             
             // Firestore ve Local Storage Kaydı
             if (activeUser.uid) {
                 await updateDoc(doc(db, 'users', activeUser.uid), { username: clean });
             } 
             
             // Eğer bu bir local auth hesabıysa, locale de username işle ki girişte sorun yaşamasın.
             if (activeUser.uid && activeUser.uid.startsWith("local_")) {
                 const dbUsers = JSON.parse(localStorage.getItem('baki_users_db') || "[]");
                 const usr = dbUsers.find(u => u.email === activeUser.email);
                 if (usr) {
                     usr.username = clean;
                     localStorage.setItem('baki_users_db', JSON.stringify(dbUsers));
                 }
             }

             const newActiveUser = {...activeUser, username: clean};
             localStorage.setItem('baki_active_user', JSON.stringify(newActiveUser));
             setActiveUser(newActiveUser);
             setView('APP');
         } catch (err) {
             alert("Bağlantı hatası: " + err.message);
         }
     };

     return (
       <div className="App">
         <div className="auth-container">
           <h1 className="auth-logo">🧑‍🍳 Şef Kimliğiniz</h1>
           <p className="auth-sub" style={{color: '#64748B', fontSize: '13px', marginBottom: '15px', lineHeight: '1.4'}}>Uygulama içindeki güvenlik kalkanı gereği mailiniz tamamen gizlenecektir. Sizi temsil edecek kalıcı adınızı seçin.</p>
           
           <div className="auth-form" style={{width: '100%', maxWidth: '300px'}}>
             <div style={{display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', padding: '10px', marginBottom: '15px', border: '2px solid #E2E8F0'}}>
                <span style={{color: '#94A3B8', fontWeight: 800, marginRight: '5px'}}>@</span>
                <input type="text" placeholder="kullanici_adiniz" style={{border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: 600, color: '#1E293B'}} value={setupUsername} onChange={e => setSetupUsername(e.target.value)} />
             </div>
             
             <button className="auth-btn" onClick={handleUsernameSetup} style={{background: '#8B5CF6'}}>Gurme Olarak Katıl 🚀</button>
           </div>
         </div>
       </div>
     );
  }

  if (view === 'ADMIN') {
    return <AdminDashboard setView={setView} activeUser={activeUser} />;
  }

  return (
    <div className="App">
      {(globalAd || globalAdImg) && view !== 'ADMIN' && (
         <div style={{background: 'linear-gradient(90deg, #F59E0B, #EF4444)', padding: '12px 20px', color: 'white', fontWeight: 800, textAlign: 'center', fontSize: '14px', zIndex: 50, position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center'}}>
            {globalAd && (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
                   <span style={{background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px'}}>SPONSOR</span>
                   {globalAd}
                </div>
            )}
            {globalAdImg && <img src={globalAdImg} alt="Sponsor" style={{maxWidth: '100%', maxHeight: '120px', borderRadius: '8px', objectFit: 'contain', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'}} />}
         </div>
      )}
      
      {activeTab === 'APP' && (
        <MainAppFlow handleTitleClick={handleTitleClick} setActiveTab={setActiveTab} activeUser={activeUser} appLang={appLang} staples={staples || []} />
      )}
      
      {activeTab === 'CHAT' && (
        <ChatbotFlow handleTitleClick={handleTitleClick} />
      )}

      {activeTab === 'RECYCLE' && (
        <RecycleFlow handleTitleClick={handleTitleClick} />
      )}

      {activeTab === 'SETTINGS' && (
        <SettingsFlow setDarkMode={setDarkMode} darkMode={darkMode} appLang={appLang} setAppLang={setAppLang} activeUser={activeUser} setActiveUser={setActiveUser} staples={staples} setStaples={setStaples} />
      )}
      
      {activeTab === 'SOCIAL' && (
        <SocialFlow activeUser={activeUser} />
      )}

      {/* BOTTOM NAV */}
      <div className="tab-navbar">
        <button 
          className={`tab-btn ${activeTab === 'APP' ? 'active' : ''}`}
          onClick={() => setActiveTab('APP')}
        >
          <span className="icon">🏠</span> {t('nav_smart')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'CHAT' ? 'active' : ''}`}
          onClick={() => setActiveTab('CHAT')}
        >
          <span className="icon">🤖</span> {t('nav_chat')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'RECYCLE' ? 'active' : ''}`}
          onClick={() => setActiveTab('RECYCLE')}
        >
          <span className="icon">♻️</span> {t('nav_recycle')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'SETTINGS' ? 'active' : ''}`}
          onClick={() => setActiveTab('SETTINGS')}
        >
          <span className="icon">⚙️</span> {t('nav_settings')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'SOCIAL' ? 'active' : ''}`}
          onClick={() => setActiveTab('SOCIAL')}
        >
          <span className="icon">🎬</span> {t('nav_social')}
        </button>
      </div>

    </div>
  );
}

// ========================
// ANA UYGULAMA (DASHBOARD HUB)
// ========================
function MainAppFlow({ handleTitleClick, setActiveTab, activeUser, appLang, staples }) {
  const [dashboardView, setDashboardView] = useState('HUB'); 
  const t = (key) => TRANSLATIONS[appLang] ? (TRANSLATIONS[appLang][key] || TRANSLATIONS['tr'][key]) : TRANSLATIONS['tr'][key];
  const gamiKey = activeUser ? `baki_gamification_v5_${activeUser?.email}` : 'baki_gamification_v5';
  const favKey = activeUser ? `baki_favorites_${activeUser?.email}` : 'baki_favorites';
  const [showConfetti, setShowConfetti] = useState(false);

  // Gamification (Kısmi Büyüme)
  const [moneySaved, setMoneySaved] = useState(() => {
    return Number(localStorage.getItem(gamiKey)) || 0;
  });

  // Modal States
  const [selectedDish, setSelectedDish] = useState(null);
  const [shoppingCart, setShoppingCart] = useState(null);

  const [fridgeMains, setFridgeMains] = useState([]);
  const [fridgeFilter, setFridgeFilter] = useState('ALL');
  const [fridgeMaxTime, setFridgeMaxTime] = useState(999);
  const [fridgeMaxCost, setFridgeMaxCost] = useState(9999);

  // Dolap (Fridge) State
  const [fridgeIngs, setFridgeIngs] = useState([]);
  const [fridgeCustomStr, setFridgeCustomStr] = useState("");

  const [weeklyDays, setWeeklyDays] = useState(7);
  const [weeklyStrategy, setWeeklyStrategy] = useState('BALANCED');
  const [weeklyProfile, setWeeklyProfile] = useState('SINGLE');
  const [weeklyCuisine, setWeeklyCuisine] = useState('ALL');
  const [weeklyMaxTime, setWeeklyMaxTime] = useState(999);
  const [weeklyMaxCost, setWeeklyMaxCost] = useState(9999);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [weeklyUserChecklist, setWeeklyUserChecklist] = useState({});

  const handleCustomIngDown = (e) => {
    if (e.key === 'Enter' && fridgeCustomStr.trim()) {
      const val = fridgeCustomStr.trim().toLowerCase();
      if (!fridgeIngs.includes(val)) toggleFridgeIng(val);
      setFridgeCustomStr("");
    }
  };

  // Evin Sağlık Karnesi State
  const [crossInput, setCrossInput] = useState("");
  const [crossResult, setCrossResult] = useState(null);

  // Group Menu States
  const [groupMembers, setGroupMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRule, setNewMemberRule] = useState("VEGAN");
  const [groupResults, setGroupResults] = useState(null);

  const GROUP_RULES = [
    { id: 'VEGAN', label: 'Vegan (Hiçbir Hayvansal Gıda Yok)' },
    { id: 'GLUTEN_FREE', label: 'Glutensiz (Hamur, Un, Buğday Yasak)' },
    { id: 'LACTOSE_FREE', label: 'Laktoz İntoleransı (Süt ve Peynir Yasak)' },
    { id: 'DIABETIC', label: 'Şeker Hastası (Sıfır Şeker / Düşük Karbonhidrat)' },
    { id: 'SEAFOOD_ALLERGY', label: 'Deniz Ürünleri Alerjisi' },
    { id: 'HIGH_PROTEIN', label: 'Yüksek Protein (Sporcu / Kas Gelişimi)' },
    { id: 'WEIGHT_LOSS', label: 'Kilo Vermek Üzerine (Düşük Kalori & Hafif)' },
    { id: 'WEIGHT_GAIN', label: 'Kilo Almak Üzerine (Yüksek Kalori & Doyurucu)' }
  ];

  const handleAddMember = () => {
    if(!newMemberName.trim()) return alert('Lütfen kişi adını girin.');
    setGroupMembers([...groupMembers, { id: Date.now(), name: newMemberName, rule: newMemberRule }]);
    setNewMemberName("");
  };
  const handleRemoveMember = (id) => {
    setGroupMembers(groupMembers.filter(m => m.id !== id));
  };
  const handleGenerateGroupMenu = () => {
    if(groupMembers.length === 0) return alert('Lütfen en az bir kişi ekleyin.');
    const results = generateGroupMenu(groupMembers);
    setGroupResults(results);
    if(results.length === 0) alert('Bu grubun katı kurallarının *tümünü* aynı anda sağlayan ortak bir yemek bulunamadı. Alternatif bulmak için en zıt kısıtlamalardan birini esnetebilirsiniz.');
  };
  
  // Wheel states
  const [wheelFilters, setWheelFilters] = useState([]);
  const [wheelItems, setWheelItems] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningDish, setWinningDish] = useState(null);
  const [userChecklist, setUserChecklist] = useState({});

  const [wheelRotation, setWheelRotation] = useState(0);
  const [isDraggingWheel, setIsDraggingWheel] = useState(false);
  const [startDragAngle, setStartDragAngle] = useState(0);
  const wheelRef = useRef(null);

  const getAngle = (e, rect) => {
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI;
  };

  const handlePointerDown = (e) => {
      if (isSpinning || wheelItems.length === 0) return;
      setIsDraggingWheel(true);
      const rect = wheelRef.current.getBoundingClientRect();
      setStartDragAngle(getAngle(e, rect) - wheelRotation);
  };

  const handlePointerMove = (e) => {
      if (!isDraggingWheel || isSpinning) return;
      const rect = wheelRef.current.getBoundingClientRect();
      setWheelRotation(getAngle(e, rect) - startDragAngle);
  };

  const handlePointerUp = (e) => {
      if (!isDraggingWheel || isSpinning) return;
      setIsDraggingWheel(false);
      setIsSpinning(true);
      setWinningDish(null);
      setUserChecklist({});
      
      const N = wheelItems.length;
      if (N === 0) return;
      const winningIndex = Math.floor(Math.random() * N);
      const theta_winning = (360 / N) * winningIndex;
      const currentMod = wheelRotation % 360;
      
      const targetDeg = wheelRotation + 1800 + (360 - theta_winning) - currentMod;
      setWheelRotation(targetDeg);

      setTimeout(() => {
          setIsSpinning(false);
          const winner = wheelItems[winningIndex];
          setWinningDish(winner);
          let checks = {};
          winner.ingredients.forEach(i => checks[i] = false);
          setUserChecklist(checks);
      }, 3000);
  };

  const toggleWheelFilter = (fId) => {
      if (fId === 'NO_FILTER') { setWheelFilters([]); setWheelItems(generateWheelItems([])); setWinningDish(null); return; }
      let newF = wheelFilters.includes(fId) ? wheelFilters.filter(x=>x!==fId) : [...wheelFilters, fId];
      setWheelFilters(newF);
      setWheelItems(generateWheelItems(newF));
      setWinningDish(null);
  };

  const startWheelSpin = () => {
     if (wheelItems.length === 0) return;
     setIsSpinning(true);
     setWinningDish(null);
     setUserChecklist({});
     
     const N = wheelItems.length;
     const winningIndex = Math.floor(Math.random() * N);
     const theta_winning = (360 / N) * winningIndex;
     const currentMod = wheelRotation % 360;
     const targetDeg = wheelRotation + 1800 + (360 - theta_winning) - currentMod;
     setWheelRotation(targetDeg);

     setTimeout(() => {
         setIsSpinning(false);
         const winner = wheelItems[winningIndex];
         setWinningDish(winner);
         let checks = {};
         winner.ingredients.forEach(i => checks[i] = false);
         setUserChecklist(checks);
     }, 3000); 
  };

  const toggleFridgeIng = (ing) => {
    if (fridgeIngs.includes(ing)) setFridgeIngs(fridgeIngs.filter(x => x !== ing));
    else setFridgeIngs([...fridgeIngs, ing]);
  };

  const handleCrossMenu = () => {
     if(!crossInput.trim()) return;
     const res = generateCrossMenu(crossInput);
     if(res) {
        setCrossResult(res);
     }
     else alert("Buna uygun çapraz bir tarif bulamadım (Örn: kıyma, tavuk, makarna vb. deneyebilirsiniz).");
  };
  
  const handleGuestMenu = () => {
     trackGenerations();
     const res = generateGuestMenu(guestCount, guestRestrictions);
     if(res) setGuestResult(res);
     else alert("Kurallara (Örn: Hem vejetaryen hem glutensiz) uyan menü kombinasyonu oluşturulamadı.");
  };

  const handleFridgeGen = () => {
     trackGenerations();
     if(fridgeIngs.length === 0) return alert("Lütfen en az bir malzeme seçin!");
     
     // SÜREKLİ KİLER: Kullanıcının görünmez deponu (staples) ekle
     // Arama esnasında staples + fridgeIngs birleşir.
     const combinedIngs = [...new Set([...fridgeIngs, ...staples])];
     
     const res = generateFridgeMains(combinedIngs, fridgeFilter, fridgeMaxTime, fridgeMaxCost);
     setFridgeMains(res);
     if(res.length === 0) alert("Bu malzemeler (ve mutfak) kombinasyonuyla doğrudan bir ana yemek sınıflandırılamadı. Miktarı artırın veya Filtreyi Tümü yapın.");
  };

  const selectMainForMenu = (mainDish) => {
     const menuOptions = generateSmartMenus({ selectedIngredients: [], budget: null, cuisine: "ALL", theme: null });
     const matching = menuOptions.find(m => m.main.name === mainDish.name) || { 
         soup: {name: "Mercimek Çorbası"}, carb: {name: "Mevsim Salata"}, totalCost: mainDish.cost + 45, totalTime: mainDish.time + 30 
     };
     
     const details = getDishDetails(mainDish);
     setSelectedDish({
         isMenu: true,
         name: mainDish.name,
         items: [matching.soup?.name, mainDish.name, matching.carb?.name],
         prepTime: matching.totalTime,
         totalCost: matching.totalCost,
         recipe: details.recipe,
         calories: details.calories,
         macros: details.macros,
         originalDish: mainDish
     });
  };

  const acceptMenuAction = (cost) => {
     // Abartı silindi: Ev yemeği yapıldığında net maliyetin ortalama %30'u tasarruf edilir. 
     // Örneğin 100 TL harcadıysanız, dışarıda bu 130 TL'dir. 30 TL cebinizde kalır.
     const saving = Math.round(cost * 0.3);
     const updated = moneySaved + saving;
     setMoneySaved(updated);
     localStorage.setItem(gamiKey, updated);
     triggerConfetti();
     alert(`Tebrikler! Yemeğiniz hazır olunca cebinizde dışarı fiyatına oranla ${saving} TL net tasarruf kalacak ve panele işlendi!`);
     setSelectedDish(null);
  };

  const openRecipe = (dishObj) => {
     if(!dishObj) return;
     const details = getDishDetails(dishObj);
     setSelectedDish({ name: dishObj.name, ...details });
  };
  
  const openShopping = (menuObj) => {
     setShoppingCart(generateShoppingList(menuObj));
  };

  const renderHub = () => (
    <>
      <div className="gamification-banner">
        <div>
          {activeUser && <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
             {activeUser.photoURL ? (
                 <img src={activeUser.photoURL} alt="Profile" referrerPolicy="no-referrer" style={{width: '50px', height: '50px', borderRadius: '50%', border: '3px solid #10B981', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', objectFit: 'cover'}} />
             ) : (
                 <div style={{width: '50px', height: '50px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'}}>👤</div>
             )}
             <div>
               <div style={{fontSize: '22px', fontWeight: 800, color: 'white'}}>{t('hub_welcome')}, {activeUser.name ? activeUser.name.split(' ')[0] : "Gurme"} 👋</div>
               <div style={{fontSize: '13px', color: '#10B981', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginTop: '3px'}}>
                   @{activeUser.username || "anonim"}
               </div>
             </div>
          </div>}
          <div style={{fontSize: '14px', opacity: 0.9, marginBottom: '5px'}}>Kümülatif Tasarruf Raporunuz</div>
          {moneySaved === 0 ? (
            <span className="gami-val" style={{fontSize: '24px'}}>0 ₺ (Yemek Üretimi Bekleniyor)</span>
          ) : (
            <>
              <span className="gami-val">₺{moneySaved}</span>
              <div style={{fontSize: '13px', marginTop: '8px', opacity: 0.9}}>Aylık Dışarıdan Söyleme Masrafını Kurtardınız!</div>
            </>
          )}
        </div>
      </div>
      

      <div className="dashboard-grid-hub">
        <div className="hub-card" onClick={() => { setDashboardView('FRIDGE'); setFridgeMains([]); }}>
          <div className="hub-icon">🛒</div>
          <div className="hub-title">{t('fridge')}</div>
          <div className="hub-desc">Evinizdeki malzemeleri seçin, onlara uygun efsane menüleri dökelim. YENİ: Dünya mutfağı filtreleme eklendi.</div>
        </div>
        <div className="hub-card" onClick={() => { setDashboardView('WHEEL'); setWinningDish(null); setWheelItems(generateWheelItems('NO_FILTER')); }}>
          <div className="hub-icon">🎡</div>
          <div className="hub-title">{t('wheel')}</div>
          <div className="hub-desc">Filtreni seç, 13 yemeklik çarkı çevir! Evdeki malzemelerini listede işaretle, sisteme eksik pazar listesi ve hesabı çektir.</div>
        </div>
        <div className="hub-card" onClick={() => setDashboardView('HEALTH')}>
          <div className="hub-icon">👨‍👩‍👧‍👦</div>
          <div className="hub-title">{t('health')}</div>
          <div className="hub-desc">Aynı ana malzemeden hem diyete hem çocuklara uygun 2 farklı çapraz tarif üretir.</div>
        </div>
        <div className="hub-card" onClick={() => { setDashboardView('WEEKLY'); setWeeklyPlan(null); }}>
          <div className="hub-icon">📅</div>
          <div className="hub-title">{t('weekly')}</div>
          <div className="hub-desc">Sadece 2 soruyla, tüm hafta ne yiyeceğinizin planını yormadan otonom şekilde oluşturur.</div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <header className="app-header">
        <h1 className="app-title" onClick={handleTitleClick}>Baki'nin Mutfağı</h1>
        <p className="app-subtitle">Gurme Yapay Zeka Kapınızda</p>
      </header>

      {showConfetti && <Confetti />}

      {dashboardView === 'HUB' && renderHub()}



      {dashboardView === 'FRIDGE' && (
      <>
        <div className="module-header-nav">
          <button className="back-btn" onClick={() => setDashboardView('HUB')}>← Geri Dön</button>
        </div>
        <div className="budget-card" style={{borderLeft: '4px solid #10B981'}}>
          <h3 className="budget-title">🛒 Dolabımdaki Malzemeler</h3>
          <p style={{fontSize: '13px', color: '#8D99AE', marginBottom: '15px'}}>Kategorilerden seçin veya aklınıza gelen herhangi bir malzemeyi kutuya yazıp Enter'a basın (Sınırsız Malzeme Üretimi).</p>
          
          <input type="text" placeholder="Farklı bir malzeme yaz ve Enter'a bas..." 
             value={fridgeCustomStr} onChange={e=>setFridgeCustomStr(e.target.value)} onKeyDown={handleCustomIngDown} 
             style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', marginBottom: '20px', outline: 'none', background: '#F8FAFC'}} />
          
          <div style={{marginBottom: '20px', padding: '10px', background: '#F1F5F9', borderRadius: '12px'}}>
             <h4 style={{fontSize: '14px', color: '#10B981', marginBottom: '8px'}}>Seçili Sepetiniz:</h4>
             {fridgeIngs.length === 0 ? <span style={{fontSize: '13px', color: '#94A3B8'}}>Henüz bir malzeme seçilmedi.</span> : fridgeIngs.map(ing => (
                  <span key={ing} onClick={() => toggleFridgeIng(ing)} style={{display: 'inline-block', padding: '6px 12px', background: '#DEF7EC', color: '#046C4E', borderRadius: '20px', fontSize: '13px', marginRight: '6px', marginBottom: '6px', cursor: 'pointer', fontWeight: 600}}>
                    {ing} ✕
                  </span>
             ))}
          </div>

          <div style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '10px', marginBottom: '20px'}}>
             {Object.entries(CATEGORIZED_INGREDIENTS).map(([catName, items]) => {
               // Performans için arama boşsa 30'unu göster, doluysa filtrele.
               const searchKey = fridgeCustomStr.trim().toLowerCase();
               let filtered = searchKey ? items.filter(x => x.includes(searchKey)) : items;
               
               if (filtered.length === 0) return null;
               
               // Render'ı hızlandırmak ve telefonu çökertmemek için limitle. Ara/bul yapsın.
               const limitedItems = filtered.slice(0, 50);

               return (
                 <div key={catName} style={{marginBottom: '22px'}}>
                   <h4 style={{fontSize: '15px', color: '#334155', marginBottom: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '6px'}}>
                     {catName} {searchKey ? "(" + filtered.length + " sonuç)" : "(" + items.length + " çeşit)"}
                   </h4>
                   <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                     {limitedItems.map(ing => (
                       <button 
                          key={ing} onClick={() => toggleFridgeIng(ing)}
                          style={{
                            padding: '8px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                            border: fridgeIngs.includes(ing) ? 'none' : '1px solid #CBD5E1',
                            backgroundColor: fridgeIngs.includes(ing) ? '#10B981' : 'white',
                            color: fridgeIngs.includes(ing) ? 'white' : '#475569',
                            textTransform: 'capitalize', transition: '0.2s'
                          }}
                       >
                         {fridgeIngs.includes(ing) ? '✓ ' : '+ '}{ing}
                       </button>
                     ))}
                     {filtered.length > 50 && (
                        <span style={{fontSize: '12px', padding: '8px', color: '#94A3B8'}}>...daha fazlası için arama yapın</span>
                     )}
                   </div>
                 </div>
               );
             })}
          </div>
          <div style={{marginBottom: '20px', padding: '15px', background: '#F1F5F9', borderRadius: '12px', borderLeft: '4px solid #3B82F6'}}>
             <h4 style={{fontSize: '14px', color: '#1E293B', marginBottom: '10px'}}>🌍 Hangi Mutfak Tarzını İstiyorsunuz?</h4>
             <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                {['ALL|🌟 Tümü (Farketmez)', 'TURKISH|🇹🇷 Türkiye', 'ASIAN|⛩️ Asya', 'MEXICAN|🌮 Meksika', 'ITALIAN|🍕 İtalyan', 'FRENCH|🥐 Fransız', 'MIDDLE_EASTERN|🐪 Ortadoğu'].map(f => {
                   const code = f.split('|')[0];
                   const label = f.split('|')[1];
                   const isActive = fridgeFilter === code;
                   return (
                     <button key={code} onClick={() => setFridgeFilter(code)} style={{
                        padding: '8px 12px', borderRadius: '20px', border: isActive ? 'none' : '1px solid #CBD5E1',
                        background: isActive ? '#3B82F6' : 'white', color: isActive ? 'white' : '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                     }}>
                        {label}
                     </button>
                   );
                })}
             </div>
          </div>
          
          <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
             <div style={{flex: 1, padding: '15px', background: '#FFFBEB', borderRadius: '12px', borderLeft: '4px solid #F59E0B'}}>
                <h4 style={{fontSize: '14px', color: '#B45309', marginBottom: '10px'}}>⏱️ Maksimum Süre</h4>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                   {[
                     {label: 'Tümü', val: 999}, 
                     {label: '< 30 Dk', val: 30}, 
                     {label: '< 60 Dk', val: 60},
                     {label: '< 90 Dk', val: 90},
                     {label: '< 120 Dk', val: 120},
                     {label: '< 150 Dk', val: 150},
                     {label: '< 180 Dk', val: 180}
                   ].map(btn => (
                     <button key={btn.val} onClick={() => setFridgeMaxTime(btn.val)} style={{
                         padding: '6px 12px', borderRadius: '15px', border: fridgeMaxTime === btn.val ? 'none' : '1px solid #FCD34D',
                         background: fridgeMaxTime === btn.val ? '#F59E0B' : 'white', color: fridgeMaxTime === btn.val ? 'white' : '#92400E', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                     }}>{btn.label}</button>
                   ))}
                </div>
             </div>
             <div style={{flex: 1, padding: '15px', background: '#FEF2F2', borderRadius: '12px', borderLeft: '4px solid #EF4444'}}>
                <h4 style={{fontSize: '14px', color: '#B91C1C', marginBottom: '10px'}}>💰 Bütçe Limiti</h4>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                   {[
                     {label: 'Sınır Yok', val: 9999}, 
                     {label: '< 400 TL', val: 400}, 
                     {label: '< 800 TL', val: 800},
                     {label: '< 1500 TL', val: 1500},
                     {label: '< 2500 TL', val: 2500}
                   ].map(btn => (
                     <button key={btn.val} onClick={() => setFridgeMaxCost(btn.val)} style={{
                         padding: '6px 12px', borderRadius: '15px', border: fridgeMaxCost === btn.val ? 'none' : '1px solid #FCA5A5',
                         background: fridgeMaxCost === btn.val ? '#EF4444' : 'white', color: fridgeMaxCost === btn.val ? 'white' : '#991B1B', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                     }}>{btn.label}</button>
                   ))}
                </div>
             </div>
          </div>
          
          <button className="budget-calc-btn" style={{backgroundColor: '#10B981'}} onClick={handleFridgeGen}>Tam Uyumlu Ana Yemekleri Bul ✨</button>

          {fridgeMains.length > 0 && dashboardView === 'FRIDGE' && (
            <div className="results-container" style={{marginTop: '25px', padding: 0}}>
              <h4 style={{fontSize: '16px', color: '#10B981', marginBottom: '15px'}}>Dolabınıza Uyan Ana Yemekler:</h4>
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                  {fridgeMains.map((mainItem, idx) => (
                      <div key={idx} style={{border: '1px solid #10B981', padding: '15px', borderRadius: '12px', background: 'white', flex: '1 1 200px'}}>
                          <div style={{fontSize: '24px', marginBottom: '5px'}}>🍽️</div>
                          <div style={{fontWeight: '800', color: '#065F46', fontSize: '15px', marginBottom: '8px'}}>{mainItem.name}</div>
                          <div style={{fontSize: '12px', background: '#ECFDF5', padding: '5px 10px', display: 'inline-block', borderRadius: '8px', color: '#10B981', fontWeight: 700, marginBottom: '8px'}}>Eşleşme: {mainItem.matchScore} Malzeme</div>
                          
                          <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px'}}>
                            <span style={{background: '#EEF2FF', color: '#4338CA', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600}}>🔥 {mainItem.calories}</span>
                            <span style={{background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600}}>₺ {mainItem.totalCost}</span>
                            <span style={{background: '#F3F4F6', color: '#4B5563', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600}}>⏱ {mainItem.prepTime} dk</span>
                          </div>
                          {mainItem.matchedIngs && mainItem.matchedIngs.length > 0 && (
                            <div style={{fontSize: '11px', color: '#10B981', marginBottom: '4px'}}><strong>Evdekiler:</strong> {mainItem.matchedIngs.join(", ")}</div>
                          )}
                          {mainItem.missingIngs && mainItem.missingIngs.length > 0 && (
                            <div style={{fontSize: '11px', color: '#EF4444', marginBottom: '10px'}}><strong>Eksikler:</strong> {mainItem.missingIngs.join(", ")}</div>
                          )}

                          <div style={{display: 'flex', gap: '5px', marginTop: '10px'}}>
                            <button onClick={(e) => { e.stopPropagation(); selectMainForMenu(mainItem); }} style={{flex: 1, padding: '8px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', color: '#334155', fontWeight: 600}}>🍽️ Tarife Bak</button>
                            {mainItem.missingIngs && mainItem.missingIngs.length > 0 && (
                              <button onClick={(e) => { e.stopPropagation(); setShoppingCart(generateMissingShoppingList(mainItem.missingIngs)); }} style={{flex: 1, padding: '8px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', color: '#B91C1C', fontWeight: 600}}>🛒 Eksikleri Al</button>
                            )}
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </>
      )}

      {dashboardView === 'WEEKLY' && (
      <>
        <div className="module-header-nav">
          <button className="back-btn" onClick={() => setDashboardView('HUB')}>← Geri Dön</button>
        </div>
        <div className="budget-card" style={{borderLeft: '4px solid #8B5CF6'}}>
           <h3 className="budget-title">📅 Haftalık Zeki Beslenme Planı</h3>
           <p style={{fontSize: '13px', color: '#8D99AE', marginBottom: '15px'}}>Sizi sorulara boğmadan, haftalık vizyonunuza göre ana menü dağılımınızı tek tuşla biz yapıyoruz.</p>
           
           {!weeklyPlan ? (
             <>
                <div style={{marginBottom: '20px'}}>
                   <h4 style={{fontSize: '14px', marginBottom: '10px', color: '#334155'}}>Bu Hafta Kaç Gün Evde Yiyeceksiniz?</h4>
                   <div style={{display: 'flex', gap: '10px'}}>
                     {[3, 5, 7].map(d => (
                       <button key={d} onClick={() => setWeeklyDays(d)} style={{flex: 1, padding: '12px', borderRadius: '8px', border: weeklyDays === d ? 'none' : '1px solid #CBD5E1', background: weeklyDays === d ? '#8B5CF6' : 'white', color: weeklyDays === d ? 'white' : '#475569', fontWeight: 600, cursor: 'pointer'}}>
                          {d} Gün
                       </button>
                     ))}
                   </div>
                </div>

                <div style={{marginBottom: '25px'}}>
                   <h4 style={{fontSize: '14px', marginBottom: '10px', color: '#334155'}}>Genel Beslenme Stratejiniz Nedir?</h4>
                   <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                     {[
                       {id: 'BALANCED', label: '🥗 Dengeli'},
                       {id: 'FIT', label: '💪 Fit & Zinde'},
                       {id: 'BUDGET', label: '💰 Bütçe Dostu'},
                       {id: 'PREMIUM', label: '💎 Bol Etli (Premium)'}
                     ].map(st => (
                       <button key={st.id} onClick={() => setWeeklyStrategy(st.id)} style={{flex: '1 1 120px', padding: '12px', borderRadius: '8px', border: weeklyStrategy === st.id ? 'none' : '1px solid #CBD5E1', background: weeklyStrategy === st.id ? '#8B5CF6' : 'white', color: weeklyStrategy === st.id ? 'white' : '#475569', fontWeight: 600, cursor: 'pointer'}}>
                          {st.label}
                       </button>
                     ))}
                   </div>
                </div>

                <div style={{marginBottom: '25px'}}>
                   <h4 style={{fontSize: '14px', marginBottom: '10px', color: '#334155'}}>Yaşam Profili & Hassasiyetler</h4>
                   <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                     {[
                       {id: 'SINGLE', label: '🤵 Bekar (Hızlı & Pratik)'},
                       {id: 'KIDS', label: '👨‍👩‍👧 Çocuklu (Acısız & Sevilen)'},
                       {id: 'DIABETIC', label: '💉 Diyabet (Düşük Karb)'},
                       {id: 'ATHLETE', label: '🏋️‍♂️ Sporcu (Bol Protein)'}
                     ].map(st => (
                       <button key={st.id} onClick={() => setWeeklyProfile(st.id)} style={{flex: '1 1 120px', padding: '12px', borderRadius: '8px', border: weeklyProfile === st.id ? 'none' : '1px solid #CBD5E1', background: weeklyProfile === st.id ? '#10B981' : 'white', color: weeklyProfile === st.id ? 'white' : '#475569', fontWeight: 600, cursor: 'pointer'}}>
                          {st.label}
                       </button>
                     ))}
                   </div>
                </div>

                <div style={{marginBottom: '20px', padding: '15px', background: '#F1F5F9', borderRadius: '12px', borderLeft: '4px solid #3B82F6'}}>
                   <h4 style={{fontSize: '14px', color: '#1E293B', marginBottom: '10px'}}>🌍 Mutfak Tarzı Optimizasyonu?</h4>
                   <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                      {['ALL|🌟 Tümü (Farketmez)', 'TURKISH|🇹🇷 Türkiye', 'ASIAN|⛩️ Asya', 'MEXICAN|🌮 Meksika', 'ITALIAN|🍕 İtalyan', 'FRENCH|🥐 Fransız', 'MIDDLE_EASTERN|🐪 Ortadoğu'].map(f => {
                         const code = f.split('|')[0];
                         const label = f.split('|')[1];
                         const isActive = weeklyCuisine === code;
                         return (
                           <button key={code} onClick={() => setWeeklyCuisine(code)} style={{
                              padding: '8px 12px', borderRadius: '20px', border: isActive ? 'none' : '1px solid #CBD5E1',
                              background: isActive ? '#3B82F6' : 'white', color: isActive ? 'white' : '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                           }}>
                              {label}
                           </button>
                         );
                      })}
                   </div>
                </div>
                
                <div style={{display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap'}}>
                   <div style={{flex: 1, minWidth: '200px', padding: '15px', background: '#FFFBEB', borderRadius: '12px', borderLeft: '4px solid #F59E0B'}}>
                      <h4 style={{fontSize: '14px', color: '#B45309', marginBottom: '10px'}}>⏱️ Ortalama Süre Limiti (Max)</h4>
                      <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                         {[
                           {label: 'Tümü', val: 999}, 
                           {label: '< 30 Dk', val: 30}, 
                           {label: '< 60 Dk', val: 60},
                           {label: '< 90 Dk', val: 90}
                         ].map(btn => (
                           <button key={btn.val} onClick={() => setWeeklyMaxTime(btn.val)} style={{
                               padding: '6px 12px', borderRadius: '15px', border: weeklyMaxTime === btn.val ? 'none' : '1px solid #FCD34D',
                               background: weeklyMaxTime === btn.val ? '#F59E0B' : 'white', color: weeklyMaxTime === btn.val ? 'white' : '#92400E', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                           }}>{btn.label}</button>
                         ))}
                      </div>
                   </div>
                   <div style={{flex: 1, minWidth: '200px', padding: '15px', background: '#FEF2F2', borderRadius: '12px', borderLeft: '4px solid #EF4444'}}>
                      <h4 style={{fontSize: '14px', color: '#B91C1C', marginBottom: '10px'}}>💰 Ortalama Harcama (Max)</h4>
                      <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                         {[
                           {label: 'Sınır Yok', val: 9999}, 
                           {label: '< 600 TL (Öğrenci Kemer)', val: 600}, 
                           {label: '< 1200 TL (Orta Halli)', val: 1200},
                           {label: '< 2500 TL (Geniş Aile)', val: 2500}
                         ].map(btn => (
                           <button key={btn.val} onClick={() => setWeeklyMaxCost(btn.val)} style={{
                               padding: '6px 12px', borderRadius: '15px', border: weeklyMaxCost === btn.val ? 'none' : '1px solid #FCA5A5',
                               background: weeklyMaxCost === btn.val ? '#EF4444' : 'white', color: weeklyMaxCost === btn.val ? 'white' : '#991B1B', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                           }}>{btn.label}</button>
                         ))}
                      </div>
                   </div>
                </div>

                <button onClick={() => {
                     trackGenerations();
                     let plan = generateWeeklyPlan(weeklyDays, weeklyStrategy, weeklyProfile, weeklyCuisine, weeklyMaxTime, weeklyMaxCost);
                     setWeeklyPlan(plan);
                     let allIngs = [];
                     plan.forEach(p => { if (p.dish && p.dish.ingredients) allIngs.push(...p.dish.ingredients); });
                     let uniqueIngs = [...new Set(allIngs)];
                     let checks = {};
                     uniqueIngs.forEach(i => checks[i] = false);
                     setWeeklyUserChecklist(checks);
                }} style={{width: '100%', padding: '18px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 6px rgba(139, 92, 246, 0.2)'}}>
                   🚀 PLANI OTOMATİK OLUŞTUR
                </button>
             </>
           ) : (
             <>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px'}}>
                   {weeklyPlan.map(dayItem => (
                      <div key={dayItem.day} style={{border: '1px solid #E2E8F0', padding: '15px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', gap: '15px'}}>
                         <div style={{background: '#EDE9FE', color: '#6D28D9', padding: '10px', borderRadius: '10px', fontWeight: 800, width: '90px', textAlign: 'center'}}>{dayItem.day}</div>
                         <div style={{flex: 1}}>
                            <div style={{fontWeight: 700, fontSize: '15px', color: '#1E293B'}}>{dayItem.dish.name}</div>
                            <div style={{fontSize: '12px', color: '#64748B', marginTop: '4px'}}>₺{dayItem.dish.cost} Tahmini Maliyet</div>
                         </div>
                         <button onClick={() => openRecipe(dayItem.dish)} style={{padding: '8px 12px', border: 'none', background: '#F1F5F9', color: '#475569', borderRadius: '8px', fontWeight: 700, cursor: 'pointer'}}>İncele</button>
                      </div>
                   ))}
                </div>
                <div style={{background: 'white', padding: '15px', borderRadius: '12px', marginTop: '15px', marginBottom: '15px', textAlign: 'left', border: '1px solid #E2E8F0'}}>
                    <div style={{fontWeight: 800, color: '#334155', marginBottom: '10px', fontSize: '14px'}}>📋 Toplu Haftalık Alışveriş Listesi (Evinizde Zaten Olanları İşaretleyin):</div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px', maxHeight: '180px', overflowY: 'auto'}}>
                       {Object.keys(weeklyUserChecklist).map(ing => (
                          <label key={ing} style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#475569', cursor: 'pointer'}}>
                             <input type="checkbox" checked={weeklyUserChecklist[ing]} onChange={(e) => setWeeklyUserChecklist({...weeklyUserChecklist, [ing]: e.target.checked})} style={{width: '18px', height: '18px', accentColor: '#8B5CF6'}} />
                             {ing}
                          </label>
                       ))}
                    </div>
                    <button onClick={() => {
                        let missingList = Object.keys(weeklyUserChecklist).filter(ing => !weeklyUserChecklist[ing]);
                        if(missingList.length === 0) alert("Tüm malzemeler evinizde var, markete gitmenize gerek yok!");
                        else setShoppingCart(generateMissingShoppingList(missingList));
                    }} style={{width: '100%', padding: '12px', background: '#8B5CF6', color: 'white', borderRadius: '10px', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '14px'}}>🛒 Sadece Eksikler İçin Liste Ve Enflasyonlu Pazar Masrafı Çıkar</button>
                </div>
                <button onClick={() => setWeeklyPlan(null)} style={{width: '100%', padding: '15px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer'}}>Tazele / Farklı Plan Üret</button>
             </>
           )}
        </div>
      </>
      )}

      {dashboardView === 'HEALTH' && (
      <>
        <div className="module-header-nav">
          <button className="back-btn" onClick={() => setDashboardView('HUB')}>← Geri Dön</button>
        </div>
        
        {/* ALT MODÜL 1: DİYET VE ÇOCUK ÇAPRAZLAMASI */}
        <div className="budget-card" style={{borderLeft: '4px solid #F4A261', marginBottom: '20px'}}>
          <h3 className="budget-title">🌿 Tek Malzeme, İki Profil (Çapraz Algoritma)</h3>
          <p style={{fontSize: '13px', color: '#8D99AE', marginBottom: '15px'}}>Tek bir ana malzemenizi yazın, aynı anda hem diyete uygun hem de sporcu/çocuk gelişimine uygun iki farklı varyasyon çıkartılsın.</p>
          <div className="budget-row">
            <input 
              type="text" placeholder="Ana Malzeme (Örn: Tavuk...)" 
              value={crossInput} onChange={e=>setCrossInput(e.target.value)}
              style={{flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#F8FAFC'}}
            />
            <button className="budget-calc-btn" style={{flex: '0 0 auto', width: 'auto', backgroundColor: '#F4A261'}} onClick={handleCrossMenu}>Çapraz Planla ⚡</button>
          </div>
          <div style={{display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'5px'}}>
             <span style={{fontSize:'12px', color:'#64748B', display:'flex', alignItems:'center', fontWeight:700}}>Tıkla & Dene:</span>
             {["Tavuk", "Kıyma", "Patlıcan", "Patates", "Ispanak", "Nohut", "Mantar"].map(ex => (
                <span key={ex} onClick={() => setCrossInput(ex)} style={{fontSize:'12px', padding:'4px 10px', background:'#FFF', color:'#F4A261', borderRadius:'15px', cursor:'pointer', border:'1px solid #F4A261', fontWeight: 600}}>{ex}</span>
             ))}
          </div>
          {crossResult && (
            <div style={{marginTop: '15px', display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
              <div style={{flex: '1 1 250px', background: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column'}}>
                  <div style={{color: '#047857', fontWeight: 700, marginBottom: '5px', fontSize: '13px'}}>🥗 Diyet / Sağlıklı</div>
                  <div style={{fontWeight: 800, fontSize: '15px', marginBottom: '8px', color: '#1E293B'}}>{crossResult.diet.name}</div>
                  <div style={{fontSize: '12px', color: '#64748B', flex: 1}}>{crossResult.diet.desc}</div>
                  <button onClick={() => openRecipe(crossResult.diet.dishObj)} style={{marginTop: '12px', padding: '8px', background: '#10B981', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px', width: '100%'}}>Tarifi İncele</button>
              </div>
              <div style={{flex: '1 1 250px', background: '#FFFBEB', padding: '15px', borderRadius: '8px', border: '1px solid #FDE68A', display: 'flex', flexDirection: 'column'}}>
                  <div style={{color: '#B45309', fontWeight: 700, marginBottom: '5px', fontSize: '13px'}}>👧👦 Çocuk / Sporcu</div>
                  <div style={{fontWeight: 800, fontSize: '15px', marginBottom: '8px', color: '#1E293B'}}>{crossResult.kid.name}</div>
                  <div style={{fontSize: '12px', color: '#64748B', flex: 1}}>{crossResult.kid.desc}</div>
                  <button onClick={() => openRecipe(crossResult.kid.dishObj)} style={{marginTop: '12px', padding: '8px', background: '#F59E0B', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px', width: '100%'}}>Tarifi İncele</button>
              </div>
            </div>
          )}
        </div>

        {/* ALT MODÜL 2: MÜŞTEREK AİLE PROFİLİ (ESKİ GROUP MENÜSÜ) */}
        <div className="budget-card" style={{borderLeft: '4px solid #8B5CF6'}}>
          <h3 className="budget-title">🤝 Müşterek Grup / Aile Beslenme Karnesi</h3>
          <p style={{fontSize: '13px', color: '#8D99AE', marginBottom: '20px'}}>Evinizdeki kişileri ekleyip diyet profillerini seçin. Sistem herkesi ortak paydada mutlu edecek yemeği bulsun!</p>

          <div style={{display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap'}}>
            <input type="text" placeholder="Kişi Adı (Örn: Mehmet Burak Korkmaz)" value={newMemberName} onChange={e=>setNewMemberName(e.target.value)} style={{flex: 1, minWidth: '150px', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1'}} />
            <select value={newMemberRule} onChange={e=>setNewMemberRule(e.target.value)} style={{flex: 1.5, minWidth: '200px', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1'}}>
                {GROUP_RULES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
            <button onClick={handleAddMember} style={{padding: '12px 20px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'}}>Kişi Ekle</button>
          </div>

          {groupMembers.length > 0 && (
             <div style={{background: '#F1F5F9', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                {groupMembers.map(m => (
                    <div key={m.id} style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E2E8F0', alignItems: 'center'}}>
                        <div style={{fontWeight: 700, color: '#334155'}}><span style={{marginRight: '8px'}}>👤</span>{m.name} <span style={{fontSize: '12px', background: '#E0E7FF', padding: '3px 8px', borderRadius: '4px', color: '#4338CA', marginLeft: '10px'}}>{GROUP_RULES.find(r=>r.id===m.rule)?.label}</span></div>
                        <button onClick={()=>handleRemoveMember(m.id)} style={{background: 'none', border: 'none', color: '#EF4444', fontWeight: 800, cursor: 'pointer', fontSize: '16px'}}>✕</button>
                    </div>
                ))}
             </div>
          )}

          <button onClick={handleGenerateGroupMenu} style={{width: '100%', padding: '15px', background: '#8B5CF6', color: 'white', borderRadius: '8px', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
             <span>✨ Ailenin Kısıtlamalarına %100 Uyan Ana Yemekleri Keşfet</span>
          </button>

          {groupResults && groupResults.length > 0 && (
             <div style={{marginTop: '30px'}}>
                <h4 style={{fontSize: '15px', color: '#8B5CF6', marginBottom: '15px'}}>🎯 Grupunuza Uygun {groupResults.length} Adet Premium Öneri:</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                   {groupResults.map((dish, i) => (
                      <div key={i} style={{border: '1px solid #DDD6FE', borderRadius: '12px', padding: '15px', background: 'white', borderLeft: '5px solid #8B5CF6'}}>
                         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                            <div>
                               <div style={{fontWeight: 800, color: '#1E293B', fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                  {dish.name}
                                  <span style={{fontSize: '11px', background: '#8B5CF6', color: 'white', padding: '3px 6px', borderRadius: '4px'}}>Tam Uyum</span>
                               </div>
                               <div style={{fontSize: '12px', color: '#64748B', marginTop: '4px'}}>
                                  Türü: {dish.type === 'FIT' ? 'Sağlıklı/Fit' : 'Klasik / Yöresel'} • Bütçe Etkisi: ₺{dish.cost} • Hazırlık: {dish.time} dk
                               </div>
                            </div>
                            <button onClick={()=>openRecipe(dish)} style={{padding: '8px 15px', borderRadius: '6px', background: '#F3F4F6', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer'}}>Tarife Bak</button>
                         </div>
                         <div style={{padding: '12px', background: '#F5F3FF', borderRadius: '8px', marginTop: '10px'}}>
                            <div style={{fontSize: '12px', fontWeight: 700, color: '#6D28D9', marginBottom: '5px'}}>💡 Neden Bu Tabağı Önerdik?</div>
                            <div style={{fontSize: '13px', color: '#4C1D95', lineHeight: '1.5'}}>{dish.logicExplanation}</div>
                         </div>
                         <div style={{marginTop: '12px'}}>
                            <button onClick={()=>openShopping({ main: dish })} style={{width: '100%', padding: '10px', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'}}>🛒 Yemeğin Pazar Listesini Çıkar</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </>
      )}

      {dashboardView === 'WHEEL' && (
      <>
        <div className="module-header-nav">
          <button className="back-btn" onClick={() => setDashboardView('HUB')}>← Geri Dön</button>
        </div>
        <div className="budget-card" style={{borderLeft: '4px solid #EC4899'}}>
          <h3 className="budget-title">🎡 Ne Yesek Çarkı</h3>
          <p style={{fontSize: '13px', color: '#8D99AE', marginBottom: '15px'}}>Tıkanıklığı aşın! Şartlarınızı belirleyin ve 13 opsiyon arasından çarkın sizin yerinize karar vermesine izin verin.</p>
          
          <div style={{display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap'}}>
             {[
               {id: 'NO_FILTER', label: '🎲 Sıfırla'},
               {id: 'UNDER_45', label: '⏱ Pratik (<45dk)'},
               {id: 'UNDER_300TL', label: '💰 Ekonomik (<300₺)'},
               {id: 'DIABETIC', label: '💉 Şeker / Diyabet'},
               {id: 'HIGH_PROTEIN', label: '💪 Yüksek Protein'},
               {id: 'VEGAN', label: '🌱 Vegan (Etsiz/Sütsüz)'},
               {id: 'GLUTEN_FREE', label: '🌾 Glutensiz (Unsuz)'}
             ].map(f => (
               <button 
                  key={f.id} onClick={() => toggleWheelFilter(f.id)}
                  style={{
                    padding: '8px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    border: (wheelFilters.includes(f.id) || (f.id === 'NO_FILTER' && wheelFilters.length === 0)) ? 'none' : '1px solid #E2E8F0',
                    backgroundColor: (wheelFilters.includes(f.id) || (f.id === 'NO_FILTER' && wheelFilters.length === 0)) ? '#EC4899' : 'white',
                    color: (wheelFilters.includes(f.id) || (f.id === 'NO_FILTER' && wheelFilters.length === 0)) ? 'white' : '#64748B'
                  }}
               >
                 {(wheelFilters.includes(f.id)) ? '✓ ' : '+ '}{f.label}
               </button>
             ))}
          </div>

          {!winningDish && (
            <div style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', padding: '20px 0'}}>
                <div style={{position: 'relative', top: '15px', color: '#BE185D', fontSize: '40px', zIndex: 10, textShadow: '0 4px 6px rgba(0,0,0,0.3)'}}>⬇</div>
                <div 
                  ref={wheelRef}
                  onPointerDown={handlePointerDown} 
                  onPointerMove={handlePointerMove} 
                  onPointerUp={handlePointerUp} 
                  onPointerCancel={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  style={{
                      width: '280px', height: '280px', borderRadius: '50%', backgroundColor: '#FDF2F8',
                      border: '12px solid #EC4899', position: 'relative', overflow: 'hidden',
                      transform: `rotate(${wheelRotation}deg)`, cursor: isSpinning ? 'default' : 'grab', touchAction: 'none',
                      transition: isSpinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
                      boxShadow: '0 10px 25px rgba(236,72,153,0.3)', flexShrink: 0
                  }}
                >
                  <div style={{position:'absolute', top:'50%', left:'50%', width:'30px', height:'30px', background:'#BE185D', borderRadius:'50%', transform:'translate(-50%, -50%)', zIndex: 5, boxShadow: '0 0 10px rgba(0,0,0,0.5)'}}></div>
                  {wheelItems.map((item, i) => {
                      const angle = (360 / wheelItems.length) * i;
                      return (
                         <div key={i} style={{
                            position: 'absolute', top: '0', bottom: '50%', left: '50%', transformOrigin: 'bottom center',
                            transform: `translateX(-50%) rotate(${angle}deg)`, width: '40px', paddingTop: '10px',
                            textAlign: 'center', fontSize: '11px', fontWeight: 900, color: '#831843',
                            borderRight: '1px solid rgba(236, 72, 153, 0.2)'
                         }}>
                            {item.name.substring(0, 15)}
                         </div>
                      )
                  })}
                </div>
            </div>
          )}

          {winningDish && (
              <div style={{width: '100%', background: '#FDF2F8', padding: '20px', borderRadius: '20px', textAlign: 'center'}}>
                 <div style={{fontSize:'30px', fontWeight:900, color:'#BE185D', marginBottom: '10px'}}>🎯 {winningDish.name}</div>
                 <div style={{display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '15px'}}>
                    <span style={{background: '#EEF2FF', color: '#4338CA', padding: '5px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700}}>🔥 {winningDish.calories}</span>
                    <span style={{background: '#FEF3C7', color: '#B45309', padding: '5px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700}}>₺ {winningDish.totalCost} Bütçe</span>
                    <span style={{background: '#F3F4F6', color: '#4B5563', padding: '5px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700}}>⏱ {winningDish.prepTime} dk Pişme</span>
                 </div>
                 <button onClick={() => openRecipe(winningDish)} style={{padding: '8px 20px', background: '#BE185D', color: 'white', borderRadius: '10px', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '14px', marginBottom: '20px'}}>Yemeğin Yapılışını İncele</button>
                 
                 <div style={{background: 'white', padding: '15px', borderRadius: '12px', textAlign: 'left', border: '1px solid #FBCFE8'}}>
                     <div style={{fontWeight: 800, color: '#9D174D', marginBottom: '10px', fontSize: '14px'}}>Evde Olan Malzemeleri İşaretleyin:</div>
                     <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px', maxHeight: '150px', overflowY: 'auto'}}>
                        {winningDish.ingredients.map(ing => (
                           <label key={ing} style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', cursor: 'pointer'}}>
                              <input type="checkbox" checked={userChecklist[ing]} onChange={(e) => setUserChecklist({...userChecklist, [ing]: e.target.checked})} style={{width: '18px', height: '18px', accentColor: '#EC4899'}} />
                              {ing} Bende Var
                           </label>
                        ))}
                     </div>
                     <button onClick={() => {
                         let missingList = winningDish.ingredients.filter(ing => !userChecklist[ing]);
                         if(missingList.length === 0) alert("Eksik malzemeniz yok, yemeği hemen yapabilirsiniz!");
                         else setShoppingCart(generateMissingShoppingList(missingList));
                     }} style={{width: '100%', padding: '12px', background: '#EC4899', color: 'white', borderRadius: '10px', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '14px'}}>🛒 Sadece Eksikler İçin Liste Ve Fiyat Çıkar</button>
                 </div>
                 <button onClick={() => setWinningDish(null)} style={{marginTop: '15px', background: 'transparent', border: 'none', color: '#BE185D', fontWeight: 800, cursor: 'pointer', fontSize: '14px'}}>Tekrar Çark Çevir ↺</button>
              </div>
          )}

          {!winningDish && (
            <button disabled={isSpinning || wheelItems.length === 0} onClick={startWheelSpin} style={{width: '100%', padding: '15px', background: isSpinning ? '#CBD5E1' : '#EC4899', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 900, cursor: isSpinning ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px rgba(236, 72, 153, 0.3)'}}>
               {!isSpinning ? '🎲 ÇARKI ÇEVİR VEYA KAYDIR!' : 'ÇEVRİLİYOR...'}
            </button>
          )}
        </div>
      </>
      )}

      {/* --- MODALS --- */}
      {selectedDish && (
        <div className="modal-overlay" onClick={() => setSelectedDish(null)}>
           <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedDish(null)}>✕</button>
              <h2 className="modal-title">{selectedDish.isMenu ? selectedDish.name + " Özel Menüsü" : selectedDish.name}</h2>
              <div className="recipe-meta">
                 <div className="recipe-meta-badge">⏱ {selectedDish.prepTime ? selectedDish.prepTime + (selectedDish.prepTime.toString().includes('dk') ? '' : ' dk') : "30 dk"}</div>
                 {selectedDish.totalCost ? <div className="recipe-meta-badge" style={{background: '#FEF3C7', color: '#B45309'}}>₺ {selectedDish.totalCost} Maliyet</div> : null}
                 {selectedDish.calories && <div className="recipe-meta-badge" style={{background: '#EEF2FF', color: '#4338CA'}}>🔥 {selectedDish.calories}</div>}
                 
                 <button onClick={() => {
                     let favs = JSON.parse(localStorage.getItem(favKey) || '[]');
                     if(!favs.find(f => f.id === selectedDish.id)) {
                         favs.push(selectedDish);
                         localStorage.setItem(favKey, JSON.stringify(favs));
                         alert("Yemek başarıyla favorilerinize eklendi! Benzer yemek önerileri için Ayarlar sekmesine bakabilirsiniz.");
                     } else {
                         favs = favs.filter(f => f.id !== selectedDish.id);
                         localStorage.setItem(favKey, JSON.stringify(favs));
                         alert("Yemek favorilerinizden çıkartıldı.");
                     }
                     setSelectedDish({...selectedDish}); // Trigger re-render
                 }} style={{background: '#FFE4E6', color: '#BE185D', padding: '6px 12px', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}>
                     {JSON.parse(localStorage.getItem(favKey) || '[]').some(f => f.id === selectedDish.id) ? '💔 Favoriden Çıkar' : '❤️ Favorile'}
                 </button>
              </div>

              {selectedDish.macros && (
                 <div style={{marginTop: '10px', marginBottom: '15px', background: '#F0FDF4', color: '#166534', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, borderLeft: '4px solid #22C55E', textAlign: 'center'}}>
                    🔬 Besin Analizi: {selectedDish.macros}
                 </div>
              )}

              {selectedDish.isMenu && (
                 <div style={{background: '#F8FAFC', padding: '12px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #E2E8F0'}}>
                    <div style={{fontWeight: 700, color: '#334155', marginBottom: '8px'}}>Bu Menüdeki Tam Eküriler:</div>
                    <ul style={{margin: 0, paddingLeft: '20px', color: '#0F172A', fontWeight: 500}}>
                       {selectedDish.items.filter(Boolean).map(item => <li key={item}>{item}</li>)}
                    </ul>
                 </div>
              )}

              <div className="recipe-steps">
                 <strong style={{color: '#0F172A'}}>Mutfak Zekası Adım Adım Tarif:</strong><br/><br/>
                 {selectedDish.recipe}
              </div>

              {selectedDish.isMenu && selectedDish.totalCost && (
                 <div style={{borderTop: '2px dashed #E2E8F0', margin: '20px 0', paddingTop: '20px'}}>
                    <p style={{fontSize: '15px', color: '#1E293B', fontWeight: 800, marginBottom: '10px', textAlign: 'center'}}>Bu kusursuz yemeği yapmaya karar verdiniz mi?</p>
                    <button onClick={() => acceptMenuAction(selectedDish.totalCost)} style={{width: '100%', padding: '16px', background: '#10B981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'}}>
                       🎯 EVET, YAPMAYA KARAR VERDİM!
                    </button>
                    <p style={{textAlign: 'center', fontSize: '11px', color: '#64748B', marginTop: '10px'}}>Onayladığınızda dışarıdan sipariş yerine cebinizde kalan miktar panelinize eklenecektir.</p>
                 </div>
              )}
           </div>
        </div>
      )}

      {shoppingCart && (
        <div className="modal-overlay" onClick={() => setShoppingCart(null)}>
           <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShoppingCart(null)}>✕</button>
              <h2 className="modal-title">Akıllı Alışveriş Listesi</h2>
              <p style={{fontSize: '14px', color: '#64748B', marginBottom: '15px'}}>Yapay zeka bu menü için eksikleri departmanlara ayırdı.</p>
              
              {Object.keys(shoppingCart.categories).map(cat => {
                 if(shoppingCart.categories[cat].length === 0) return null;
                 return (
                   <div key={cat} style={{marginBottom: '15px'}}>
                     <h4 style={{background: '#F1F5F9', padding: '8px 12px', borderRadius: '8px', color: '#334155'}}>{cat}</h4>
                     <ul style={{listStyleType: 'none', padding: '10px 12px', margin: 0}}>
                        {shoppingCart.categories[cat].map((ing, i) => (
                           <li key={i} style={{marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px'}}>
                             <input type="checkbox" style={{accentColor: '#10B981', transform: 'scale(1.2)'}} /> <span style={{textTransform: 'capitalize'}}>{ing}</span>
                           </li>
                        ))}
                     </ul>
                   </div>
                 );
              })}
              <div style={{marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                 <span style={{fontWeight: 700, color: '#475569'}}>Yaklaşık Dolap Dışı Maliyet:</span>
                 <span style={{fontSize: '20px', fontWeight: 800, color: '#10B981'}}>~₺{shoppingCart.estimatedCost}</span>
              </div>
           </div>
        </div>
      )}
    </>
  );
}

// ========================
// YZ CHATBOT MODÜLÜ
// ========================
function ChatbotFlow({ handleTitleClick }) {
  const welcomeMessage1 = "Merhaba ben Baki'nin mutfağı özel şefi Demet Şef. 👩‍🍳 Burası sizin sıradan bir yemek kitabınız değil, kişiselleştirilmiş gastronomi asistanınız! Önümüzde harika özellikler var, sizin gibi mutfak tutkunları (veya sadece hızlıca doymak isteyenler) için tasarlanan özelliklerimiz şunlar:";
  const welcomeMessage2 = "🛒 Dolabımdakiler: Evdeki kısıtlı malzemelerle mucizeler yaratmak isteyen pratik aşçılar içindir.\n\n📅 Haftalık Zeki Program: Bütçesini haftalık tasarlamak isteyenler içindir.\n\n👨‍👩‍👧‍👦 Evin Sağlık Karnesi: Diyet ve çocuk menüsünü tek malzemede birleştirir.\n\n🎡 Şans Çarkı: Ne pişirsem stresinden bıkan spontane ruhlar içindir.\n\n🎬 Eğlence Serüveni: Yemek videoları kaydırabileceğiniz, kendi videolarınızı çekebileceğiniz ve diğer şeflerle takipleşip mesajlaşabileceğiniz interaktif sosyal gurme ağınızdır. (Hemen Ayarlar sekmesinden şef profil fotoğrafınızı yükleyebilirsiniz!)\n\nEğer bana doğrudan 'kıyma var ne yapayım' veya 'Karnıyarık nasıl yapılır' diye sorarsanız da tarifinizi anında dökerim. Bugün nasıl bir ruh halindesiniz? 😊";

  const [messages, setMessages] = useState([
    { text: welcomeMessage1, sender: 'bot' },
    { text: welcomeMessage2, sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef(null);

  const sendMessage = (customText) => {
    const userText = typeof customText === 'string' ? customText : input;
    if(!userText.trim()) return;
    setMessages(prev => [...prev, { text: userText, sender: 'user' }]);
    setInput("");
    
    // AI Engine Processing (Hızlandırıldı)
    setTimeout(() => {
      const response = processChatPrompt(userText);
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, 100);
  };

  const startVoice = () => {
    if (isListening && window._globalRecognition) {
       window._globalRecognition.stop();
       
       // Kullanıcı düğmeye basarak manuel durdurursa, içindeki birikmiş metni hemen gönder
       setTimeout(() => {
          document.getElementById("chatSendBtn").click();
       }, 300);
       return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SpeechRecognition) return alert("Mobil tarayıcınız maalesef sesli asistan komutlarını (Microphone) desteklemiyor.");
    
    const recognition = new SpeechRecognition();
    window._globalRecognition = recognition;
    recognition.lang = 'tr-TR';
    recognition.interimResults = true; // Konuşurken anında metni almak için
    
    let timer;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (e) => {
       let transcript = "";
       for (let i = 0; i < e.results.length; i++) {
           transcript += e.results[i][0].transcript;
       }
       setInput(transcript); // Anlık olarak input kutusuna yazılır
       
       clearTimeout(timer);
       timer = setTimeout(() => {
           recognition.stop();
           sendMessage(transcript);
       }, 2000); // 2 saniyelik boşlukta otomatik gönderir
    };
    recognition.start();
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <header className="app-header" style={{marginBottom: 0, paddingBottom: '15px'}}>
        <h1 className="app-title" onClick={handleTitleClick}>Asistan Demet Şef</h1>
        <p className="app-subtitle" style={{fontSize: '12px'}}>Baki'nin Mutfağı Özelleştirilmiş Yapay Zekası</p>
      </header>
      
      <div className="chat-container">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.sender === 'bot' ? 'chat-bot' : 'chat-user'}`}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="chat-input-area" style={{display: 'flex', gap: '5px', padding: '10px', boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'}}>
        <input 
          type="text" 
          className="chat-input" 
          placeholder="Mutfakla ilgili bir şey yazın..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{flex: 1, padding: '15px', borderRadius: '30px', border: '1px solid #E2E8F0', outline: 'none'}}
        />
        <button className="chat-send" style={{background: isListening ? '#E0484C' : '#CBD5E1', borderRadius: '50%', width: '50px', height: '50px', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={startVoice}>
          {isListening ? '⏹️' : '🎤'}
        </button>
        <button id="chatSendBtn" className="chat-send" style={{background: '#10B981', borderRadius: '50%', width: '50px', height: '50px', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer'}} onClick={sendMessage}>
          ➤
        </button>
      </div>
    </>
  );
}

// ========================
// ARTAN YEMEK (GERİ DÖNÜŞÜM) MODÜLÜ
// ========================
function RecycleFlow({ handleTitleClick }) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!input.trim()) return;
    const output = processLeftovers(input);
    setResults(output);
    setHasSearched(true);
  };

  return (
    <>
      <header className="app-header">
        <h1 className="app-title" onClick={handleTitleClick}>Artan Yemek Motoru</h1>
        <p className="app-subtitle">İsrafı Önle, Lezzet Yarat</p>
      </header>
      
      <div className="budget-card">
        <h3 className="budget-title">♻️ Dolapta Ne Kaldı?</h3>
        <p style={{fontSize: '13px', color: '#8D99AE', marginBottom: '15px'}}>Dünden kalan yemekleri veya artan malzemeleri yazın (örn: "dünden bir kase pilav ve haşlanmış tavuk kaldı"), size özel dönüşüm tarifleri sunalım.</p>
        
        <div className="budget-row" style={{flexDirection: 'column', gap: '15px'}}>
          <textarea 
            placeholder="Ne kaldı? (Örn: Bir kase pilav, yarım paket makarna...)" 
            value={input} 
            onChange={e => setInput(e.target.value)}
            style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical'}}
          />
          <div style={{display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'15px'}}>
             <span style={{fontSize:'12px', color:'#64748B', display:'flex', alignItems:'center', fontWeight:700}}>Yapay Zekaya Hızlıca Sor:</span>
             {["Bir kase pilav", "Yarım paket makarna", "Haşlanmış tavuk", "Bayat ekmek", "Kalan nohut yemeği", "Biraz kıyma", "Ezilmiş patates"].map(ex => (
                <span key={ex} onClick={() => setInput(ex)} style={{fontSize:'12px', padding:'4px 10px', background:'#FFF', color:'#10B981', borderRadius:'15px', cursor:'pointer', border:'1px solid #10B981', fontWeight: 600}}>{ex}</span>
             ))}
          </div>
          <button className="budget-calc-btn" style={{width: '100%', backgroundColor: '#10B981', color: 'white'}} onClick={handleSearch}>Dönüşüm Tariflerini Bul ✨</button>
        </div>
      </div>

      <div className="results-container">
        {hasSearched && results.length === 0 && (
           <div className="ai-advice-box" style={{backgroundColor: '#FFFBEB', color: '#B45309', borderLeft: '4px solid #F59E0B'}}>
              Buna uygun özel bir geri dönüşüm tarifi bulamadım. Ancak "Mutfak YZ Sohbet" bölümünden detaylı tarif isteyebilirsiniz! Veya "makarna", "pilav", "tavuk" gibi anahtar kelimeler girmeyi deneyin.
           </div>
        )}
        {results.map((res, idx) => (
          <div key={idx} className="menu-card">
            <div className="menu-label-badge" style={{backgroundColor: '#10B981', color: 'white'}}>
               ✨ {res.ingredient.toUpperCase()} DÖNÜŞÜMÜ
            </div>
            
            <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
              {res.recipes.map((recipe, rIdx) => (
                 <div key={rIdx} style={{padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC'}}>
                    <div style={{fontWeight: '700', color: '#1E293B', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span>🍲</span> {recipe.name}
                    </div>
                    <div style={{fontSize: '13px', color: '#64748B', lineHeight: '1.5'}}>
                      {recipe.desc}
                    </div>
                 </div>
              ))}
            </div>
            
            <div className="ai-advice-box" style={{marginTop: '15px', backgroundColor: '#ECFDF5', color: '#047857', borderLeft: '4px solid #10B981'}}>
              💡 AI Notu: Artan yiyecekleri değerlendirmek hem bütçenizi korur hem de mutfak israfını önler. Harika bir seçim!
            </div>
          </div>
        ))}
        <div style={{height: '60px'}}></div>
      </div>
    </>
  );
}

// ========================
// AYARLAR VE DİL MODÜLÜ
// ========================
function SettingsFlow({ setDarkMode, darkMode, appLang, setAppLang, activeUser, setActiveUser, staples, setStaples }) {
  const handleLogout = () => {
      localStorage.removeItem('baki_active_user');
      auth.signOut();
      window.location.reload();
  };
  const [favorites, setFavorites] = useState([]);
  const [selectedFav, setSelectedFav] = useState(null);
  const [similarDishes, setSimilarDishes] = useState([]);
  const t = (key) => TRANSLATIONS[appLang] ? (TRANSLATIONS[appLang][key] || TRANSLATIONS['tr'][key]) : TRANSLATIONS['tr'][key];
  const favKey = activeUser ? `baki_favorites_${activeUser.email}` : 'baki_favorites';

  useEffect(() => {
     setFavorites(JSON.parse(localStorage.getItem(favKey) || '[]'));
  }, [favKey]);

  const handleAvatarUpload = async (e) => {
     const file = e.target.files[0];
     if (!file) return;
     if (!activeUser || !activeUser.uid) return alert('Lütfen tam Google yetkilendirmesiyle giriş yapın.');
     
     try {
        const storageRef = ref(storage, `avatars/${activeUser.uid}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        
        await updateDoc(doc(db, 'users', activeUser.uid), { photoURL: url });
        setActiveUser({ ...activeUser, photoURL: url });
        alert('Profil resminiz 🌍 Eğlence Serüveni için başarıyla güncellendi!');
     } catch (err) {
        console.error(err);
        alert('Yükleme hatası: ' + err.message);
     }
  };

  const handleLanguageChange = (e) => {
     const lang = e.target.value;
     setAppLang(lang);
     localStorage.setItem('baki_lang', lang);
     alert("Dil tercihi arayüz katmanında değiştirildi. Menü veritabanı tam entegrasyonu ilerleyen aşamalarda sağlanacaktır.");
  };
  
  const handleFavClick = (dish) => {
     setSelectedFav(dish);
     setSimilarDishes(getSimilarDishes(dish));
  };

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">{t('nav_settings')}</h1>
        <p className="app-subtitle">{t('theme')}</p>
      </header>
      
      <div className="budget-card">
        <h3 className="budget-title">⚙️ {t('nav_settings')}</h3>
        
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #E2E8F0'}}>
           <div style={{fontWeight: 600, color: '#334155'}}>{t('theme')}</div>
           <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
              <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} style={{width: '20px', height: '20px', accentColor: '#1E293B'}} />
              <span style={{marginLeft: '10px', fontSize: '14px', color: '#64748B'}}>{t('dark_mode')}</span>
           </label>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
           <div style={{fontWeight: 600, color: '#334155'}}>{t('lang')}</div>
           <select value={appLang} onChange={handleLanguageChange} style={{padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', background: '#F8FAFC'}}>
              <option value="tr">🇹🇷 Türkçe</option>
              <option value="en">🇬🇧 English</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="it">🇮🇹 Italiano</option>
           </select>
        </div>

        <div style={{marginTop: '25px', paddingBottom: '15px', paddingTop: '15px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
           <div>
               <div style={{fontWeight: 600, color: '#334155', marginBottom: '3px'}}>Şef Kimliği (Profil & Avatar)</div>
               <div style={{fontSize: '12px', color: '#64748B'}}>Eğlence Serüveni'nde maskeniz: <span style={{fontWeight: 800, color: '#8B5CF6'}}>@{activeUser?.username || "anonim"}</span></div>
               <div style={{fontSize: '12px', color: '#64748B'}}>Buradan profil fotoğrafınızı güncelleyebilirsiniz.</div>
           </div>
           <div>
               <label style={{background: '#10B981', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600}}>
                   Yükle
                   <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleAvatarUpload} />
               </label>
           </div>
        </div>

        <div style={{marginTop: '15px', paddingBottom: '15px', paddingTop: '15px', borderTop: '1px dashed #E2E8F0'}}>
            <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <input type="checkbox" checked={activeUser?.isPrivate || false} onChange={async (e) => {
                    const isChecked = e.target.checked;
                    if (activeUser?.uid) {
                        await updateDoc(doc(db, 'users', activeUser.uid), { isPrivate: isChecked });
                        const updatedUser = {...activeUser, isPrivate: isChecked};
                        setActiveUser(updatedUser);
                        localStorage.setItem('baki_active_user', JSON.stringify(updatedUser)); // Persistent update
                    }
                }} style={{width: '24px', height: '24px', accentColor: '#8B5CF6', flexShrink: 0}} />
                <div style={{marginLeft: '15px'}}>
                   <div style={{fontWeight: 700, color: '#334155'}}>🔒 Gizli Profil (Private)</div>
                   <div style={{fontSize: '12px', color: '#64748B', marginTop: '3px'}}>Eğer açıksa videolarınızı ve profilinizi sadece onayladığınız takipçiler görebilir. Sizi takip etmek isteyenler "Bildirim" havuzuna düşer ve siz onaylayana kadar sizi takip edemezler.</div>
                </div>
            </label>
        </div>

        <div style={{marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #E2E8F0', paddingBottom: '15px'}}>
           <div style={{fontWeight: 600, color: '#334155', marginBottom: '5px'}}>Kiler (Demirbaş Hafızası)</div>
           <p style={{fontSize: '12px', color: '#64748B'}}>Evinizde sürekli bulunan temel malzemeleri işaretleyin. Yapay zeka tarif üretirken bu malzemeleri dolabınızda her zaman varmış gibi kabul eder.</p>
           <div className="staples-grid" style={{marginBottom: '15px'}}>
               {["tuz", "karabiber", "sıvı yağ", "zeytinyağı", "tereyağı", "salça", "soğan", "sarımsak", "un", "şeker"].map(item => (
                  <div key={item} 
                       className={`staple-chip ${staples.includes(item) ? 'active' : ''}`}
                       onClick={() => {
                         let newStaples = staples.includes(item) ? staples.filter(i => i !== item) : [...staples, item];
                         setStaples(newStaples);
                       }}
                   >
                     {staples.includes(item) ? '✓ ' : '+ '}{item}
                  </div>
               ))}
           </div>
           <button onClick={() => {
               localStorage.setItem('baki_staples', JSON.stringify(staples));
               alert("Mutfak kilerindeki seçili demirbaşlar hafızaya başarıyla kazındı!");
           }} style={{padding: '10px 15px', background: '#3B82F6', color: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', border: 'none', width: '100%', marginBottom: '10px'}}>
               💾 Kiler Hafızasını Kalıcı Olarak Kaydet
           </button>
           <button onClick={handleLogout} style={{padding: '12px 15px', background: '#EF4444', color: 'white', borderRadius: '8px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', border: 'none', width: '100%', boxShadow: '0 4px 6px rgba(239, 68, 68, 0.2)'}}>
               🚪 {t('logout') || "Oturumu Kapat"}
           </button>
        </div>
      </div>
      
      <div className="budget-card" style={{borderLeft: '4px solid #BE185D'}}>
         <h3 className="budget-title">❤️ {t('favs')}</h3>
         <p style={{fontSize: '13px', color: '#8D99AE', marginBottom: '15px'}}>Favorilerinize eklediğiniz 5 yıldızlı tarifler ve yapay zekanın "Buna Benzer Tarifler" algoritmasıyla sürdürülebilir önerileri.</p>
         
         {favorites.length === 0 && <div className="ai-advice-box">Henüz hiç favori eklemediniz. Yemek tariflerini incelerken "Favorile" tuşuna basarak kişisel portföyünüzü oluşturun!</div>}
         
         <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {favorites.map((fav, i) => (
                <div key={i} style={{padding: '15px', background: '#FDF2F8', border: '1px solid #FBCFE8', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                   <div style={{fontWeight: 700, color: '#BE185D', fontSize: '15px', cursor: 'pointer', flex: 1}} onClick={() => handleFavClick(fav)}>{fav.name}</div>
                   <div style={{display: 'flex', gap: '8px'}}>
                       <div onClick={() => handleFavClick(fav)} style={{fontSize: '12px', background: '#BE185D', color: 'white', padding: '6px 10px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'}}>Benzerlerini Gör</div>
                       <div onClick={(e) => {
                           e.stopPropagation();
                           let newFavs = favorites.filter(f => f.id !== fav.id);
                           localStorage.setItem(favKey, JSON.stringify(newFavs));
                           setFavorites(newFavs);
                       }} style={{fontSize: '12px', background: '#FFF1F2', color: '#E11D48', padding: '6px 10px', borderRadius: '6px', fontWeight: 600, border: '1px solid #FECDD3', cursor: 'pointer'}}>Sil</div>
                   </div>
                </div>
            ))}
         </div>
      </div>
      
      {/* FAVORITE DETAILS MODAL */}
      {selectedFav && (
        <div className="modal-overlay" onClick={() => setSelectedFav(null)}>
           <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedFav(null)}>✕</button>
              <h2 className="modal-title" style={{color: '#BE185D'}}>❤️ {selectedFav.name}</h2>
              <div style={{fontSize: '13px', color: '#64748B', marginTop: '10px', marginBottom: '20px'}}>Bu yemeği favorileriniz arasına aldınız. Sizin bu lezzet profilini sevdiğinizi fark ettik ve koca veritabanını tarayarak maliyet, malzeme ve süre açısından EN MANTIKLI BENZER üç yemeği süzdük.</div>
              
              <h4 style={{fontSize: '15px', color: '#1E293B', marginBottom: '10px'}}>🎯 YZ "Buna Benzer Diğer Yemekler" Rekomendasyonu:</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                 {similarDishes.map((sd, i) => (
                    <div key={i} style={{border: '1px solid #CBD5E1', borderRadius: '12px', padding: '15px', background: 'white'}}>
                       <div style={{fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          {sd.name} <span style={{fontSize: '11px', background: '#10B981', color: 'white', padding: '3px 6px', borderRadius: '4px'}}>{sd.score} Benzerlik Skoru</span>
                       </div>
                       <div style={{fontSize: '12px', color: '#64748B', marginTop: '5px'}}>₺{sd.cost} • {sd.time} dk</div>
                       <div style={{marginTop: '10px', padding: '10px', background: '#F8FAFC', borderRadius: '8px', fontSize: '12px', color: '#334155', borderLeft: '3px solid #3B82F6'}}>
                          {sd.logicExplanation}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
      <div style={{height: '60px'}}></div>
    </>
  );
}

function AdminDashboard({ setView, activeUser }) {
    const [usersList, setUsersList] = useState([]);
    const [adText, setAdText] = useState("");
    const [adImage, setAdImage] = useState("");
    const [globalNotif, setGlobalNotif] = useState("");

    useEffect(() => {
        const uSub = onSnapshot(query(collection(db, 'users')), (snap) => {
            const arr = [];
            snap.forEach(d => arr.push({id: d.id, ...d.data()}));
            setUsersList(arr.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        });
        
        const adSub = onSnapshot(doc(db, 'system', 'adConfig'), (d) => {
            if(d.exists()) {
                setAdText(d.data().text || "");
                setAdImage(d.data().image || "");
            }
        });
        
        return () => { uSub(); adSub(); };
    }, []);

    const toggleBan = async (uid, isCurrentlyBanned) => {
        if(uid === activeUser?.uid) return alert("Kendinizi yasaklayamazsınız!");
        if(window.confirm(isCurrentlyBanned ? "Kullanıcının engelini kaldırmak istediğinize emin misiniz?" : "Bu kullanıcıyı kalıcı olarak BAN'lamak istediğinize emin misiniz? (Anında platformdan düşecek)")) {
            await updateDoc(doc(db, 'users', uid), { isBanned: !isCurrentlyBanned });
        }
    };

    const removeAccount = async (uid) => {
        if(uid === activeUser?.uid) return alert("Kendi hesabınızı bu panelden silemezsiniz!");
        const confirmVal = window.prompt("DİKKAT: Kullanıcının tüm veritabanı kaydı SİLİNECEK. İşlemi onaylamak için büyük harflerle 'SİL' yazın:");
        if (confirmVal === 'SİL') {
            await deleteDoc(doc(db, 'users', uid));
            alert("Hesap veritabanından kalıcı olarak temizlendi.");
        }
    };
    
    const saveAd = async () => {
        await setDoc(doc(db, 'system', 'adConfig'), { text: adText, image: adImage });
        alert("Global Reklam/Duyuru anında tüm ekranlara canlı olarak yansıtıldı!");
    };
    
    const seedIrem = async () => {
        const uid = "iremdnr02_uid";
        await setDoc(doc(db, 'users', uid), { uid: uid, email: "irem0e@gmail.com", name: "İrem", username: "iremdnr02", password: "irem02", photoURL: "https://i.pravatar.cc/150?u=iremdnr02", followers: [], follows: [], createdAt: new Date().toISOString() });
        await setDoc(doc(db, 'posts', 'post_kek_1'), { userId: uid, username: "iremdnr02", userName: "İrem", userPhoto: "https://i.pravatar.cc/150?u=iremdnr02", caption: "Bugün mutfakta harikalar yarattım! Islak kekin bu kadar güzel olabileceğini düşünmemiştim 🍫✨ #ıslakkek #çikolata", images: ["/images/kek_1_1785368720998.png"], likes: [], comments: [], timestamp: Date.now() });
        await setDoc(doc(db, 'posts', 'post_pogaca_1'), { userId: uid, username: "iremdnr02", userName: "İrem", userPhoto: "https://i.pravatar.cc/150?u=iremdnr02", caption: "Sabah kahvaltısının vazgeçilmezi fırından yeni çıkmış sıcacık peynirli poğaçalarım! (Yana kaydırmalı ->) 🥐😋 #poğaça", images: ["/images/pogaca_1_1785368730596.png", "/images/pogaca_2_1785368741491.png", "/images/pogaca_3_1785368750520.png", "/images/pogaca_4_1785368761616.png"], likes: [], comments: [], timestamp: Date.now() + 1 });
        await setDoc(doc(db, 'posts', 'post_sarma_1'), { userId: uid, username: "iremdnr02", userName: "İrem", userPhoto: "https://i.pravatar.cc/150?u=iremdnr02", caption: "Anne eli değmiş gibi incecik kalem yaprak sarmalarım hazır. İnce ince sarmak biraz zahmetli ama buna değer! Limon dilimleriyle harika oldu. (Yana kaydır ->) 🍋🍃 #yapraksarma", images: ["/images/sarma_1_1785368771028.png", "/images/sarma_2_1785368779816.png", "/images/sarma_3_1785368790883.png", "/images/sarma_4_1785368802655.png", "/images/sarma_5_1785368812233.png"], likes: [], comments: [], timestamp: Date.now() + 2 });
        const dbUsers = JSON.parse(localStorage.getItem('baki_users_db') || "[]");
        if(!dbUsers.find(u => u.email === "irem0e@gmail.com")) {
            dbUsers.push({uid: uid, email: "irem0e@gmail.com", password: "irem02", fullName: "İrem"});
            localStorage.setItem('baki_users_db', JSON.stringify(dbUsers));
        }
        alert("İrem hesabı ve 3 Yana Kaydırmalı Gönderisi eklendi!");
    };
    
    const sendGlobalNotif = async () => {
        if(!globalNotif.trim()) return;
        if(window.confirm("Bu bildirim veritabanındaki her bir kullanıcıya gönderilecektir. Emin misiniz?")) {
            const promises = usersList.map(u => 
                updateDoc(doc(db, 'users', u.id), {
                    notifications: [...(u.notifications || []), { id: Date.now().toString() + Math.random(), text: "📢 " + globalNotif, type: 'SYSTEM', timestamp: Date.now() }]
                })
            );
            await Promise.all(promises);
            setGlobalNotif("");
            alert("Tüm kullanıcılara canlı sistem bildirimi gönderildi.");
        }
    };

    return (
        <div className="App admin-container" style={{overflowY: 'auto', background: '#F8FAFC', height: '100vh', display: 'block', minHeight: '100vh'}}>
            <div className="admin-header" style={{position: 'sticky', top: 0, zIndex: 10, background: '#1E293B', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2 style={{color: 'white', margin: 0, fontSize: '18px'}}>🛡️ Yetkili Kontrol Merkezi</h2>
                <button onClick={() => setView('APP')} style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800}}>Kapat</button>
            </div>
            
            <div style={{padding: '20px'}}>
                <div style={{background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px'}}>
                    <h3 style={{fontSize: '16px', color: '#1E293B', marginBottom: '10px'}}>📢 Global Reklam & Duyuru Yönetimi</h3>
                    <p style={{fontSize: '13px', color: '#64748B', marginBottom: '15px'}}>Buraya girdiğiniz görsel linki ve duyuru yazısı anında uygulamanın tepesinde (Sponsor Banner) belirecek.</p>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <input type="text" value={adText} onChange={e=>setAdText(e.target.value)} placeholder="Yazı (Örn: Masterchef Yeni Sezon Yayında!)" style={{width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none'}} />
                        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                            <input type="text" value={adImage} onChange={e=>setAdImage(e.target.value)} placeholder="Görsel Linki URL (Opsiyonel)" style={{flex: 1, minWidth: '200px', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none'}} />
                            <button onClick={saveAd} style={{padding: '12px 20px', background: '#3B82F6', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer'}}>Yayınla</button>
                        </div>
                    </div>
                </div>

                <div style={{background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px'}}>
                    <h3 style={{fontSize: '16px', color: '#1E293B', marginBottom: '10px'}}>🔔 Herkese Canlı Sistem Bildirimi</h3>
                    <p style={{fontSize: '13px', color: '#64748B', marginBottom: '15px'}}>Tüm kullanıcıların 'Bildirimler' sekmesine düşecek sistem alarm mesajı.</p>
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                        <input type="text" value={globalNotif} onChange={e=>setGlobalNotif(e.target.value)} placeholder="Örn: Gece 03:00'da bakım çalışması yapılacaktır." style={{flex: 1, minWidth: '200px', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none'}} />
                        <button onClick={sendGlobalNotif} style={{padding: '12px 20px', background: '#F59E0B', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer'}}>Sinyal Yolla</button>
                    </div>
                </div>
                
                <div style={{background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', paddingBottom: '40px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                        <h3 style={{fontSize: '18px', color: '#1E293B', margin: 0}}>👥 Platform Kullanıcıları ({usersList.length} Kişi)</h3>
                        <button onClick={seedIrem} style={{background: '#8B5CF6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800}}>🔥 İrem Demo Data Yükle</button>
                    </div>
                    <div style={{overflowX: 'auto'}}>
                        <table style={{width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left'}}>
                            <thead>
                                <tr style={{borderBottom: '2px solid #E2E8F0', color: '#64748B'}}>
                                    <th style={{padding: '12px 10px'}}>Kullanıcı</th>
                                    <th style={{padding: '12px 10px'}}>Email</th>
                                    <th style={{padding: '12px 10px'}}>Takipçi</th>
                                    <th style={{padding: '12px 10px'}}>Son Görülme (Süre)</th>
                                    <th style={{padding: '12px 10px'}}>Kimlik</th>
                                    <th style={{padding: '12px 10px'}}>Aksiyon</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map((u, i) => (
                                    <tr key={u.id || i} style={{borderBottom: '1px solid #F1F5F9', background: u.isBanned ? '#FEF2F2' : 'transparent'}}>
                                        <td style={{padding: '12px 10px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                            {u.photoURL ? <img src={u.photoURL} style={{width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover'}}/> : <div style={{width:'35px',height:'35px',borderRadius:'50%',background:'#E2E8F0',fontSize:'15px',display:'flex',justifyContent:'center',alignItems:'center'}}>👤</div>}
                                            <div>
                                                <div style={{fontWeight: 800, color: '#334155'}}>@{u.username || 'anonim_şef'}</div>
                                                <div style={{fontSize: '12px', color: '#64748B'}}>{u.name}</div>
                                            </div>
                                        </td>
                                        <td style={{padding: '12px 10px', color: '#64748B'}}>{u.email}</td>
                                        <td style={{padding: '12px 10px', fontWeight: 800}}>{u.followers?.length || 0}</td>
                                        <td style={{padding: '12px 10px'}}>
                                            {(() => {
                                                const lA = u.lastActive ? new Date(u.lastActive) : null;
                                                const diffMins = lA ? Math.floor((Date.now() - lA.getTime()) / 60000) : 99999;
                                                const statusText = !lA ? 'Bilinmiyor' : (diffMins < 5 ? '🟢 Çevrimiçi' : (diffMins < 60 ? `${diffMins} dk önce` : (diffMins < 1440 ? `${Math.floor(diffMins/60)} sa ${diffMins%60} dk önce` : `${Math.floor(diffMins/1440)} gün önce`)));
                                                return (
                                                    <div>
                                                        <div style={{fontSize: '12px', fontWeight: 700, color: diffMins < 5 ? '#10B981' : '#64748B'}}>{statusText}</div>
                                                        {u.lastSessionDuration !== undefined && <div style={{fontSize: '11px', color: '#94A3B8'}}>Son oturum: {u.lastSessionDuration} dk</div>}
                                                    </div>
                                                )
                                            })()}
                                        </td>
                                        <td style={{padding: '12px 10px'}}>
                                            {u.isBanned ? <span style={{background:'#FEE2E2',color:'#EF4444',padding:'4px 8px',borderRadius:'4px',fontWeight:700,fontSize:'11px'}}>YASAKLI</span> : <span style={{background:'#DCFCE7',color:'#10B981',padding:'4px 8px',borderRadius:'4px',fontWeight:700,fontSize:'11px'}}>GÜVENLİ</span>}
                                        </td>
                                        <td style={{padding: '12px 10px', display: 'flex', gap: '5px'}}>
                                            <button onClick={()=>toggleBan(u.id, u.isBanned)} style={{background: u.isBanned ? '#94A3B8' : '#EF4444', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                                                {u.isBanned ? 'Kaldır' : 'YASAKLA'}
                                            </button>
                                            <button onClick={()=>removeAccount(u.id)} style={{background: 'black', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                                                SİL
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;