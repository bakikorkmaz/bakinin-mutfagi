import React, { useState, useEffect, useRef } from 'react';
import { db, auth, storage } from './firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc, addDoc, query, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { validateUsername } from './utils/usernameValidation';

const getHighResPhotoUrl = (url) => {
    if (!url || typeof url !== 'string') return url || '';
    if (url.includes('googleusercontent.com')) {
        return url.replace(/=s\d+(-c)?/g, '=s800');
    }
    return url;
};


// İki Parmak Yakınlaştırma (Pinch-to-Zoom) Bileşeni
function PinchZoomImage({ src, alt, style, onClick, badgeText }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const startDistRef = useRef(0);
  const startScaleRef = useRef(1);
  const touchStartPosRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      startDistRef.current = dist;
      startScaleRef.current = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      touchStartPosRef.current = {
        x: e.touches[0].pageX - position.x,
        y: e.touches[0].pageY - position.y
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && startDistRef.current > 0) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const zoomFactor = dist / startDistRef.current;
      const newScale = Math.min(Math.max(1, startScaleRef.current * zoomFactor), 4);
      setScale(newScale);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && scale > 1) {
      const newX = e.touches[0].pageX - touchStartPosRef.current.x;
      const newY = e.touches[0].pageY - touchStartPosRef.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      startDistRef.current = 0;
      if (scale < 1.05) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
      style={{
        overflow: 'hidden',
        touchAction: scale > 1 ? 'none' : 'pan-y',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      <img
        src={src}
        alt={alt}
        onClick={onClick}
        style={{
          ...style,
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: scale === 1 ? 'transform 0.2s ease-out' : 'none',
          willChange: 'transform',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      />
      {badgeText && (
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 800,
          backdropFilter: 'blur(4px)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {badgeText}
        </div>
      )}
    </div>
  );
}

import NeYesekMatch from './NeYesekMatch';

export default function SocialFlow({ activeUser, setActiveUser, onBack, openShopping }) {

   const [subTab, setSubTab] = useState('MY_PROFILE'); // FEED, MATCH, WHEEL, BADGES, CHAT, FOLLOW, UPLOAD, MY_PROFILE
   const [showFeedSearchModal, setShowFeedSearchModal] = useState(false);
   const [feedSearchQuery, setFeedSearchQuery] = useState("");
   const [userListModal, setUserListModal] = useState(null); // { title: string, userIds: string[] }
   const [model, setModel] = useState(null);
   const [isModelLoading, setIsModelLoading] = useState(true);

   // --- FOLLOW SİSTEMİ ALTYAPISI ---
   const [allUsers, setAllUsers] = useState([]);
   const [loadingUsers, setLoadingUsers] = useState(false);
   const [myProfile, setMyProfile] = useState(null);
   const [searchQuery, setSearchQuery] = useState("");
   const [feedMode, setFeedMode] = useState('WATCH');

   // --- KULLANICI ADI (USERNAME) DÜZENLEME SİSTEMİ ---
   const [isEditingUsername, setIsEditingUsername] = useState(false);
   const [newUsernameInput, setNewUsernameInput] = useState(activeUser?.username || '');
   const [usernameUpdating, setUsernameUpdating] = useState(false);

   const handleSaveUsername = async () => {
       if (!newUsernameInput) {
           return alert("Kullanıcı adı boş bırakılamaz.");
       }
       setUsernameUpdating(true);
       const result = await validateUsername(newUsernameInput, activeUser?.uid, allUsers, db);
       if (!result.valid) {
           alert(result.error);
           setUsernameUpdating(false);
           return;
       }
       try {
           const clean = result.clean;
           if (activeUser?.uid) {
               await updateDoc(doc(db, 'users', activeUser.uid), { username: clean });
           }

           if (activeUser?.uid && activeUser.uid.startsWith("local_")) {
               const dbUsers = JSON.parse(localStorage.getItem('baki_users_db') || "[]");
               const usr = dbUsers.find(u => u.email === activeUser.email);
               if (usr) {
                   usr.username = clean;
                   localStorage.setItem('baki_users_db', JSON.stringify(dbUsers));
               }
           }

           const updatedUser = { ...activeUser, username: clean };
           if (setActiveUser) setActiveUser(updatedUser);
           localStorage.setItem('baki_active_user', JSON.stringify(updatedUser));

           setIsEditingUsername(false);
           alert("🎉 Kullanıcı adınız başarıyla @" + clean + " olarak güncellendi!");
       } catch (e) {
           alert("Güncelleme hatası: " + e.message);
       } finally {
           setUsernameUpdating(false);
       }
   };

   // --- VIDEO YÜKLEME (UPLOAD) SİSTEMİ ---
   const [uploading, setUploading] = useState(false);
   const [videoDesc, setVideoDesc] = useState("");
   const [videoFile, setVideoFile] = useState(null);

   // --- VİDEO AKIŞI (FEED) SİSTEMİ ---
   const [feedPosts, setFeedPosts] = useState([]);

   // --- SOHBET (CHAT) SİSTEMİ ---
   const [selectedChatUser, setSelectedChatUser] = useState(null);
   const [selectedProfileUser, setSelectedProfileUser] = useState(null);
   const [connectionModal, setConnectionModal] = useState(null);
   const [chatMessages, setChatMessages] = useState([]);
   const [msgText, setMsgText] = useState("");

   // --- SES KAYDI & MEDYA & REAKSİYON STATE ---
   const [isRecording, setIsRecording] = useState(false);
   const [recordingTime, setRecordingTime] = useState(0);
   const mediaRecorderRef = useRef(null);
   const audioChunksRef = useRef([]);
   const recordingTimerRef = useRef(null);
   const chatEndRef = useRef(null);
   const [reactionPickerMsgId, setReactionPickerMsgId] = useState(null);

   // --- YORUM (COMMENT) SİSTEMİ ---
   const [commentModalPost, setCommentModalPost] = useState(null);
   const [commentText, setCommentText] = useState("");

   // --- RESİM BÜYÜTMA MODALI ---
   const [enlargedPhoto, setEnlargedPhoto] = useState(null);

    useEffect(() => {
        async function loadModel() {
            try {
                if (typeof window !== 'undefined' && window.mobilenet) {
                    const loadedModel = await window.mobilenet.load({version: 2, alpha: 1.0});
                    setModel(loadedModel);
                }
                setIsModelLoading(false);
            } catch(err) {
                console.error("Yapay Zeka Core yüklenemedi:", err);
                setIsModelLoading(false);
            }
        }
        loadModel();

        if (activeUser?.uid) {
            fetchUsersAndProfile();
            
            // Real-time listener for MY profile (bildirimler ve takipler için)
            const unsubscribeMe = onSnapshot(doc(db, 'users', activeUser.uid), (docSnap) => {
                if(docSnap.exists()) setMyProfile(docSnap.data());
            });
            
            // Canlı Video Akışını (Reels) Dinle
            const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const pList = [];
                snapshot.forEach(d => pList.push({ id: d.id, ...d.data() }));
                setFeedPosts(pList);
            });
            
            return () => { unsubscribe(); unsubscribeMe(); };
        }
    }, [activeUser]);

   // Sohbet Aboneliği (Fail-Safe & Local Persistence)
   useEffect(() => {
       const targetId = selectedChatUser?.id || selectedChatUser?.uid;
       const currentUid = activeUser?.uid || activeUser?.id;
       if (targetId && currentUid) {
           const chatId = [currentUid, targetId].sort().join('_');
           const localKey = 'baki_chat_' + chatId;
           
           // Fast initial render from localStorage
           try {
               const cached = JSON.parse(localStorage.getItem(localKey) || '[]');
               if (cached.length > 0) setChatMessages(cached);
           } catch(e) {}

           try {
               // Index-free collection reference to avoid Firestore index errors
               const chatRef = collection(db, 'chats', chatId, 'messages');
               const unSubChat = onSnapshot(chatRef, (snap) => {
                   const m = [];
                   snap.forEach(d => m.push({id: d.id, ...d.data()}));
                   m.sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0));
                   setChatMessages(m);
                   try { localStorage.setItem(localKey, JSON.stringify(m)); } catch(err) {}
               }, (err) => {
                   console.log("Firestore Chat Subscription Fallback:", err);
               });
               return () => unSubChat();
           } catch(e) {
               console.error("Chat init error:", e);
           }
       } else {
           setChatMessages([]);
       }
   }, [selectedChatUser, activeUser]);

   useEffect(() => {
       chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [chatMessages]);

    const fetchUsersAndProfile = async () => {
        setLoadingUsers(true);
        try {
            // Profil onSnapshot'la çekildiği için meSnap sadece Fallback gibi kalabilir
            // 2. Sistemdeki DİĞER (kendimiz olmayan) tüm master şefleri listeden çek
           const q = collection(db, 'users');
           const querySnapshot = await getDocs(q);
           const usersList = [];
           querySnapshot.forEach((docSnap) => {
               if (docSnap.id !== activeUser.uid) { // Kendimizi gizle
                   usersList.push({ id: docSnap.id, ...docSnap.data() });
               }
           });
           setAllUsers(usersList);
       } catch (err) {
           console.error("Topluluk çekilirken hata:", err);
       }
       setLoadingUsers(false);
   };

   const handleFollow = async (targetUserId, isFollowing, isPrivate, isRequested) => {
       try {
           const meRef = doc(db, 'users', activeUser.uid);
           const targetRef = doc(db, 'users', targetUserId);
           
           if (isFollowing) {
               // Takipten Çık (Unfollow)
               await updateDoc(meRef, { follows: arrayRemove(targetUserId) });
               await updateDoc(targetRef, { followers: arrayRemove(activeUser.uid) });
               setMyProfile({...myProfile, follows: (myProfile.follows || []).filter(id => id !== targetUserId)});
           } else if (isRequested) {
               // İsteği Geri Çek (Cancel Request)
               await updateDoc(targetRef, { requests: arrayRemove(activeUser.uid) });
               setAllUsers(allUsers.map(u => u.id === targetUserId ? {...u, requests: (u.requests||[]).filter(r=>r!==activeUser.uid)} : u));
           } else {
               // Takip Et veya İstek Gönder
               if (isPrivate) {
                   await updateDoc(targetRef, { requests: arrayUnion(activeUser.uid) });
                   setAllUsers(allUsers.map(u => u.id === targetUserId ? {...u, requests: [...(u.requests||[]), activeUser.uid]} : u));
               } else {
                   await updateDoc(meRef, { follows: arrayUnion(targetUserId) });
                   await updateDoc(targetRef, { followers: arrayUnion(activeUser.uid) });
                   setMyProfile({...myProfile, follows: [...(myProfile.follows || []), targetUserId]});
               }
           }
       } catch (err) {
           console.log("Takipleşme işlemi arka planda mühür takıldı: " + err.message);
       }
   };

   const handleVideoUpload = async () => {
       if (!videoFile) return alert("Lütfen kameradan veya galeriden bir dosya seçin!");
       if (!activeUser?.uid) return alert("Google girişi yapılmamış.");
       
       if (!videoDesc || videoDesc.trim().length < 10) {
           return alert("🚫 Açıklama en az 10 karakter olmalı! Boş veya çok kısa içerikler yayınlanamaz.");
       }

       if (isModelLoading) {
           console.log("Yapay Zeka güvenlik modülü arka planda yükleniyor.");
       }
       if (!model) {
           console.warn("Güvenlik Bildirimi: Yapay Zeka analiz motoru başlatılamadı. Lütfen sayfası yenileyin.");
       }

       setUploading(true);

       // SİMÜLE EDİLMİŞ YAPAY ZEKA METİN GÜVENLİK FİLTRESİ
       const toxicWords = ['şiddet', 'kan', 'ölüm', 'hack', 'kötü'];
       const isToxicDesc = toxicWords.some(w => videoDesc.toLowerCase().includes(w));
       if (isToxicDesc) {
           setUploading(false);
           return alert("🚨 YAPAY ZEKA GÜVENLİK UYARISI: Videonuz veya açıklamanız topluluk kurallarımıza (Şiddet, Kötü Söz, Uygunsuz İçerik) aykırı bulundu! İçerik engellendi.");
       }
       
       const isImage = videoFile.type.startsWith('image/');
       
       // GERÇEK YAPAY ZEKA GÖRÜNTÜ ANALİZİ (TENSORFLOW MOBILENET)
       try {
           const processMedia = async () => {
               return new Promise((resolve) => {
                   const elem = document.createElement(isImage ? 'img' : 'video');
                   const url = URL.createObjectURL(videoFile);
                   elem.src = url;
                   elem.crossOrigin = "anonymous";
                   
                   let resolved = false;
                   const finish = (preds) => {
                       if(!resolved) { resolved=true; resolve(preds); }
                   };
                   setTimeout(() => finish([]), 4000); // timeout stop
                   
                   if (isImage) {
                       elem.onload = async () => {
                           try {
                               const predictions = model ? await model.classify(elem) : [];
                               finish(predictions);
                           } catch(e) { finish([]); }
                       };
                       elem.onerror = () => finish([]);
                   } else {
                       elem.muted = true;
                       elem.playsInline = true;
                       elem.addEventListener('loadeddata', () => {
                           elem.currentTime = 0.2;
                       });
                       elem.addEventListener('seeked', async () => {
                           const canvas = document.createElement('canvas');
                           canvas.width = elem.videoWidth || 640;
                           canvas.height = elem.videoHeight || 480;
                           const ctx = canvas.getContext('2d');
                           try {
                               ctx.drawImage(elem, 0, 0, canvas.width, canvas.height);
                               const predictions = model ? await model.classify(canvas) : [];
                               finish(predictions);
                           } catch(e) { finish([]); }
                       });
                       elem.addEventListener('error', () => finish([]));
                   }
               });
           };

           const predictions = await processMedia();
           
           const FOOD_TERMS = ['food', 'plate', 'dish', 'cup', 'fruit', 'vegetable', 'meat', 'cake', 'bread', 'bowl', 'pot', 'pan', 'bottle', 'pizza', 'hamburger', 'hotdog', 'ice cream', 'strawberry', 'apple', 'banana', 'orange', 'broccoli', 'carrot', 'sandwich', 'hot pot', 'bakery', 'restaurant', 'coffee', 'espresso', 'tea', 'menu', 'soup', 'salad', 'dining table', 'wine', 'beer', 'sauce', 'cookie', 'dough', 'spoon', 'fork', 'kitchen', 'recipe', 'meal', 'drink', 'pudding', 'confectionery', 'cheese', 'grocery', 'produce', 'table', 'snack', 'sweet', 'dessert', 'pie', 'pie', 'soup', 'baklava', 'kebab', 'rice', 'chicken', 'tavuk', 'yemek', 'tarif', 'lezzet', 'sunum', 'mutfak', 'görsel', 'servis'];

           const isFoodRelated = predictions.some(p => {
               return FOOD_TERMS.some(t => p.className.toLowerCase().includes(t));
           });

           if (!isFoodRelated && predictions.length > 0) {
                console.log("Yapay Zeka Mutfak Güvenlik Algılaması:", predictions);
                const alertMsg = "⚠️ YAPAY ZEKA MUTFAK GÜVENLİK BİLDİRİMİ:\n\nYüklediğiniz görsel/video yapay zeka tarafından 'Yemek / Mutfak / Tarif' ile doğrudan ilişkilendirilemedi.\n\nBaki'nin Mutfağı topluluk kuralları gereği yalnızca nefis yemek ve tarif görselleri paylaşabilirsiniz. İçeriğinizin gerçekten yemekle ilgili olduğundan emin olun!";
                alert(alertMsg);
                const confirmBypass = window.confirm("İçeriğiniz gerçekten yemek veya tarif ile mi ilgili? Yayınlamak için Tamam'a basın.");
                if (!confirmBypass) {
                    setUploading(false);
                    return;
                }
            }
       } catch (err) {
           console.error("AI Görsel Analiz Hatası:", err);
           setUploading(false);
           return alert("Yapay Zeka görsel analizi sırasında bir hata oluştu.");
       }

       try {
           const fileExt = videoFile.name.split('.').pop() || (isImage ? 'jpg' : 'mp4');
           const storageRef = ref(storage, `posts/${activeUser.uid}_${Date.now()}.${fileExt}`);
           await uploadBytes(storageRef, videoFile);
           const url = await getDownloadURL(storageRef);
           
           // Firestore Posts tablosuna kaydet
           const postData = {
               userId: activeUser.uid,
               userName: activeUser.name || 'İsimsiz Şef',
               username: activeUser.username || '',
               userPhoto: activeUser.photoURL || '',
               caption: videoDesc.trim(),
               likes: [],
               comments: [],
               timestamp: new Date().getTime()
           };

           if (isImage) {
               postData.images = [url];
           } else {
               postData.videoURL = url;
           }

           await addDoc(collection(db, 'posts'), postData);
            
            if (myProfile?.followers && myProfile.followers.length > 0) {
                const nMsg = `${activeUser.name || activeUser.username || "Bir şef"} @${activeUser.username} yeni bir tarif paylaştı!`;
                const notifsPromises = myProfile.followers.map(followerId => {
                    const followerRef = doc(db, 'users', followerId);
                    return updateDoc(followerRef, {
                        notifications: arrayUnion({
                            id: Date.now().toString() + Math.random(),
                            text: nMsg,
                            type: 'NEW_POST',
                            fromId: activeUser.uid,
                            timestamp: Date.now()
                        })
                    });
                });
                await Promise.all(notifsPromises).catch(e=>console.log(e));
            }
            
            alert("Gönderiniz başarıyla Eğlence Serüveni'ne yüklendi!");
           setVideoFile(null);
           setVideoDesc("");
           setSubTab("FEED"); // Gönderiyi izlemek için Keşfet'e at
       } catch(err) {
           console.error("Yükleme Hatası:", err);
           alert("Video yüklenemedi: " + err.message);
       }
       setUploading(false);
   };

   const handleAvatarUpload = async (e) => {
       const file = e.target.files[0];
       if (!file || !activeUser?.uid) return;
       try {
           const storageRef = ref(storage, `avatars/${activeUser.uid}_${Date.now()}.jpg`);
           await uploadBytes(storageRef, file);
           const dl = await getDownloadURL(storageRef);
           await updateDoc(doc(db, 'users', activeUser.uid), { photoURL: dl });
           
           const updatedUser = {...activeUser, photoURL: dl};
           if (setActiveUser) setActiveUser(updatedUser);
           localStorage.setItem('baki_active_user', JSON.stringify(updatedUser)); // Persistent update
           
           const uList = JSON.parse(localStorage.getItem('baki_users_db') || "[]");
           const idx = uList.findIndex(x => x.email === activeUser.email);
           if (idx > -1) {
               uList[idx].photoURL = dl;
               localStorage.setItem('baki_users_db', JSON.stringify(uList));
           }
           alert("Profil fotoğrafı başarıyla güncellendi!");
       } catch(err) {
           alert("Yüklenemedi: " + err.message);
       }
   };

    const handleSendMessage = async () => {
        if (!msgText.trim()) return;
        const currentUid = activeUser?.uid || activeUser?.id;
        const currentEmail = activeUser?.email || '';
        const targetId = selectedChatUser?.id || selectedChatUser?.uid;
        if (!currentUid || !targetId) {
            return alert("Sohbet edebilmek için Google veya kullanıcı hesabınızla giriş yapmış olmalısınız.");
        }

        // Kural: yusufkorqmaz79@gmail.com hariç, gizlilik ve takip kuralları denetimi
        const isAdmin = currentEmail === "yusufkorqmaz79@gmail.com";
        const targetFollowsMe = (selectedChatUser?.follows || []).includes(currentUid) || (selectedChatUser?.followers || []).includes(currentUid);

        if (!isAdmin) {
            if (selectedChatUser?.isPrivate && !targetFollowsMe) {
                return alert("Bu hesap gizlidir, sizi takip etmeden mesaj atamazsınız");
            }
            if (selectedChatUser?.allowMessagesFromFollowersOnly && !(selectedChatUser?.follows || []).includes(currentUid)) {
                return alert("Bu kullanıcı yalnızca takip ettiği kişilerden mesaj kabul etmektedir.");
            }
            if (!targetFollowsMe) {
                return alert("Bu hesap gizlidir, sizi takip etmeden mesaj atamazsınız");
            }
        }

        try {
            const chatId = [currentUid, targetId].sort().join('_');
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
                senderId: activeUser.uid,
                text: msgText,
                timestamp: new Date().getTime()
            });
            
            const nMsg = `${activeUser.name || activeUser.username || "Bir şef"} adlı şef size yeni bir mesaj gönderdi.`;
            const newNotif = { id: Date.now().toString(), text: nMsg, type: 'MESSAGE', fromId: activeUser.uid, timestamp: Date.now() };
            
            await updateDoc(doc(db, 'users', selectedChatUser.id), { 
                unreadCount: arrayUnion(activeUser.uid), 
                notifications: arrayUnion(newNotif) 
            });
            setMsgText("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteChatMessage = async (msgId) => {
        const currentUid = activeUser?.uid || activeUser?.id;
        const targetId = selectedChatUser?.id || selectedChatUser?.uid;
        if (!targetId || !currentUid || !msgId) return;
        try {
            const chatId = [currentUid, targetId].sort().join('_');
            await deleteDoc(doc(db, 'chats', chatId, 'messages', msgId));
        } catch (err) {
            console.error("Mesaj silinemedi:", err);
        }
    };

    const handleToggleReaction = async (msgId, emoji) => {
        const currentUid = activeUser?.uid || activeUser?.id;
        const targetId = selectedChatUser?.id || selectedChatUser?.uid;
        if (!targetId || !currentUid || !msgId) return;
        try {
            const chatId = [currentUid, targetId].sort().join('_');
            const msgRef = doc(db, 'chats', chatId, 'messages', msgId);
            await updateDoc(msgRef, {
                [`reactions.${currentUid}`]: emoji
            });
            setReactionPickerMsgId(null);
        } catch (err) {
            console.error("Reaksiyon eklenemedi:", err);
        }
    };

    const openProfile = (userObj) => {
        setSelectedProfileUser(userObj);
        setSubTab('PROFILE');
    };

    const handleBlockUser = async (targetId, isBlocked) => {
        const meRef = doc(db, 'users', activeUser.uid);
        const targetRef = doc(db, 'users', targetId);
        if (isBlocked) {
            await updateDoc(meRef, { blocked: arrayRemove(targetId) });
        } else {
            await updateDoc(meRef, { 
                blocked: arrayUnion(targetId),
                follows: arrayRemove(targetId),
                followers: arrayRemove(targetId),
                requests: arrayRemove(targetId)
            });
            await updateDoc(targetRef, { 
                follows: arrayRemove(activeUser.uid),
                followers: arrayRemove(activeUser.uid),
                requests: arrayRemove(activeUser.uid)
            });
            setSubTab("FEED");
        }
    };

    const renderProfileScreen = () => {
        if (!selectedProfileUser) {
            return (
                <div style={{padding: '30px', textAlign: 'center', color: '#64748B'}}>
                    <p style={{fontSize: '15px', fontWeight: 600}}>Profil bulunamadı veya silinmiş.</p>
                    <button onClick={() => setSubTab('FEED')} style={{background: '#8B5CF6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, marginTop: '10px'}}>
                        ← Keşfet'e Dön
                    </button>
                </div>
            );
        }

        const targetUid = selectedProfileUser.id || selectedProfileUser.uid;
        const liveTargetUser = allUsers.find(u => u.id === targetUid || u.uid === targetUid) || selectedProfileUser;
        const isFollowing = (myProfile?.follows || []).includes(targetUid);
        const isRequested = (liveTargetUser.requests || []).includes(activeUser?.uid);
        const isBlocked = (myProfile?.blocked || []).includes(targetUid);
        const userExists = (uid) => uid === targetUid || uid === activeUser?.uid || allUsers.some(u => u.id === uid || u.uid === uid);

        const targetPosts = feedPosts.filter(p => p.userId === targetUid);
        const canViewContent = !liveTargetUser.isPrivate || isFollowing || targetUid === activeUser?.uid;

        return (
            <div style={{padding: '10px 0', paddingBottom: '80px'}}>
                {/* ÜST GERİ DÖN KARTI */}
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px'}}>
                    <button 
                        onClick={() => setSubTab('FEED')}
                        style={{background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px', fontWeight: 800, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(6px)'}}
                    >
                        ← Keşfet'e Dön
                    </button>
                    <span style={{color: '#94A3B8', fontSize: '12px', fontWeight: 700}}>👤 Şef Profili</span>
                </div>

                {/* PROFİL BAŞLIK KARTI */}
                <div style={{background: 'white', padding: '24px 20px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)', marginBottom: '20px', textAlign: 'center'}}>
                    <div style={{position: 'relative', display: 'inline-block', marginBottom: '15px'}}>
                        {liveTargetUser.photoURL ? (
                            <img 
                                src={getHighResPhotoUrl(liveTargetUser.photoURL)} 
                                alt="Avatar" 
                                style={{width: '95px', height: '95px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #E2E8F0', background: '#F8FAFC', cursor: 'zoom-in'}} 
                                onClick={() => setEnlargedPhoto(liveTargetUser.photoURL)} 
                            />
                        ) : (
                            <div style={{width: '95px', height: '95px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', border: '4px solid #E2E8F0'}}>👤</div>
                        )}
                        {liveTargetUser.isPrivate && (
                            <div style={{position: 'absolute', bottom: 0, right: 0, background: '#F59E0B', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: '2px solid white'}} title="Gizli Hesap">🔒</div>
                        )}
                    </div>

                    <h2 style={{fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 900}}>{liveTargetUser.name || liveTargetUser.userName || 'Mutfak Gurmesi'}</h2>
                    <div style={{fontSize: '14px', color: '#8B5CF6', fontWeight: 800, marginTop: '3px'}}>@{liveTargetUser.username || 'anonim'}</div>

                    {/* İSTATİSTİKLER (TAKİPÇİ / TAKİP / GÖNDERİ) */}
                    <div style={{display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px'}}>
                        <div 
                            onClick={() => setUserListModal({ title: `👥 @${liveTargetUser.username || 'Şef'} Takipçileri`, userIds: liveTargetUser.followers || [] })}
                            style={{cursor: 'pointer', background: '#F8FAFC', padding: '10px 18px', borderRadius: '16px', border: '1px solid #E2E8F0', transition: '0.2s', flex: 1, maxWidth: '110px'}}
                        >
                            <div style={{fontSize: '18px', fontWeight: 900, color: '#8B5CF6'}}>{(liveTargetUser.followers || []).filter(userExists).length}</div>
                            <div style={{fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 800}}>Takipçi ↗</div>
                        </div>

                        <div 
                            onClick={() => setUserListModal({ title: `👥 @${liveTargetUser.username || 'Şef'} Takip Ettikleri`, userIds: liveTargetUser.follows || [] })}
                            style={{cursor: 'pointer', background: '#F8FAFC', padding: '10px 18px', borderRadius: '16px', border: '1px solid #E2E8F0', transition: '0.2s', flex: 1, maxWidth: '110px'}}
                        >
                            <div style={{fontSize: '18px', fontWeight: 900, color: '#8B5CF6'}}>{(liveTargetUser.follows || []).filter(userExists).length}</div>
                            <div style={{fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 800}}>Takip ↗</div>
                        </div>

                        <div style={{background: '#F8FAFC', padding: '10px 18px', borderRadius: '16px', border: '1px solid #E2E8F0', flex: 1, maxWidth: '110px'}}>
                            <div style={{fontSize: '18px', fontWeight: 900, color: '#10B981'}}>{targetPosts.length}</div>
                            <div style={{fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 800}}>Gönderi</div>
                        </div>
                    </div>

                    {/* AKSİYON BUTONLARI (TAKİP ET + SOHBET ET) */}
                    <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                        <button 
                            onClick={() => handleFollow(targetUid, isFollowing, liveTargetUser.isPrivate, isRequested)}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '16px', border: 'none', 
                                background: isFollowing ? '#E2E8F0' : isRequested ? '#F59E0B' : '#8B5CF6', 
                                color: isFollowing ? '#475569' : 'white', fontWeight: 900, fontSize: '14px', 
                                cursor: 'pointer', boxShadow: isFollowing ? 'none' : '0 4px 12px rgba(139,92,246,0.3)', transition: '0.2s'
                            }}
                        >
                            {isFollowing ? '✓ Takipte' : isRequested ? '⏳ İstek Gönderildi' : 'Takip Et +'}
                        </button>

                        <button 
                            onClick={() => {
                                const currentEmail = activeUser?.email || '';
                                const isAdmin = currentEmail === "yusufkorqmaz79@gmail.com";
                                const targetFollowsMe = (liveTargetUser.follows || []).includes(activeUser?.uid) || (myProfile?.followers || []).includes(targetUid);
                                
                                if (!isAdmin && liveTargetUser.isPrivate && !targetFollowsMe) {
                                    return alert("Bu hesap gizlidir, sizi takip etmeden mesaj atamazsınız");
                                }
                                if (!isAdmin && liveTargetUser.allowMessagesFromFollowersOnly && !(liveTargetUser.follows || []).includes(activeUser?.uid)) {
                                    return alert("Bu kullanıcı yalnızca takip ettiği kişilerden mesaj kabul etmektedir.");
                                }
                                setSelectedChatUser({ ...liveTargetUser, id: targetUid });
                                setSubTab('CHAT');
                            }}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '16px', border: 'none', 
                                background: '#10B981', color: 'white', fontWeight: 900, fontSize: '14px', 
                                cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                            }}
                        >
                            Sohbet Et 💬
                        </button>
                    </div>

                    <div style={{marginTop: '14px', textAlign: 'right'}}>
                        <button 
                            onClick={() => handleBlockUser(targetUid, isBlocked)}
                            style={{background: 'none', border: 'none', color: '#EF4444', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline'}}
                        >
                            {isBlocked ? 'Engeli Kaldır' : '🚫 Kullanıcıyı Engelle'}
                        </button>
                    </div>
                </div>

                {/* GÖNDERİLER VEYA GİZLİ HESAP UYARISI */}
                <div style={{background: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)'}}>
                    <h3 style={{fontSize: '16px', color: '#0F172A', marginBottom: '15px', fontWeight: 900}}>📸 Şefin Gönderileri ({targetPosts.length})</h3>
                    
                    {!canViewContent ? (
                        <div style={{textAlign: 'center', padding: '40px 20px', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1'}}>
                            <div style={{fontSize: '40px', marginBottom: '10px'}}>🔒</div>
                            <h4 style={{margin: '0 0 6px 0', color: '#0F172A', fontWeight: 900}}>Bu Hesap Gizlidir</h4>
                            <p style={{margin: 0, fontSize: '13px', color: '#64748B'}}>Gönderileri ve tarif videolarını görebilmek için takip isteği gönderin.</p>
                        </div>
                    ) : targetPosts.length === 0 ? (
                        <p style={{color: '#94A3B8', fontSize: '13px', textAlign: 'center', margin: '30px 0'}}>Bu şef henüz hiç gönderi paylaşmamış.</p>
                    ) : (
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                            {targetPosts.map(p => (
                                <div key={p.id} style={{background: '#000', height: '150px', borderRadius: '14px', overflow: 'hidden', position: 'relative', cursor: 'pointer'}} onClick={() => { if(p.images?.length > 0) setEnlargedPhoto(p.images[0]); }}>
                                    {p.images?.length > 0 ? (
                                        <img src={getHighResPhotoUrl(p.images[0])} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Post"/>
                                    ) : p.videoURL ? (
                                        <video src={p.videoURL} style={{width:'100%', height:'100%', objectFit:'cover'}} muted />
                                    ) : (
                                        <div style={{width:'100%', height:'100%', background:'#94A3B8', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>Görsel</div>
                                    )}
                                    {p.images?.length > 1 && (
                                        <div style={{position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '10px', fontWeight: 900}}>
                                            📸 {p.images.length}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

   // --- EKRANLAR (RENDERERS) ---
   
   const renderMyProfileScreen = () => {
        const myPosts = feedPosts.filter(p => p.userId === activeUser.uid);
        const myLikedPosts = feedPosts.filter(p => (p.likes || []).includes(activeUser.uid));
        const userExists = (uid) => uid === activeUser?.uid || allUsers.some(u => u.id === uid);
        
        return (
            <div style={{padding: '10px 0'}}>
                <h1 style={{fontSize: '24px', color: '#1E293B', marginBottom: '20px', fontWeight: 900}}>👤 Profilim</h1>
                
                <div style={{background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)', marginBottom: '20px', textAlign: 'center'}}>
                    <div style={{position: 'relative', display: 'inline-block', marginBottom: '15px'}}>
                        <img src={activeUser.photoURL || 'https://via.placeholder.com/100'} alt="Avatar" style={{width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #E2E8F0', background: '#F8FAFC', cursor: 'zoom-in'}} onClick={() => { if(activeUser.photoURL) setEnlargedPhoto(activeUser.photoURL) }} />
                        <label style={{position: 'absolute', bottom: 0, right: 0, background: '#10B981', color: 'white', width: '30px', height: '30px', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '14px', border: '2px solid white'}}>
                            📷
                            <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleAvatarUpload} />
                        </label>
                    </div>
                    
                    <h2 style={{fontSize: '18px', margin: 0, color: '#1E293B'}}>{activeUser.name || 'İsimsiz Şef'}</h2>
                    
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px'}}>
                        <span style={{fontSize: '13px', color: '#64748B', fontWeight: 700}}>@{activeUser.username || 'anonim'}</span>
                        <button 
                           onClick={() => { setNewUsernameInput(activeUser.username || ''); setIsEditingUsername(true); }}
                           style={{background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE', padding: '3px 9px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'}}
                        >
                           ✏️ Değiştir
                        </button>
                    </div>
                    
                    <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px'}}>
                        <div 
                            onClick={() => setUserListModal({ title: '👥 Takipçilerim', userIds: myProfile?.followers || [] })}
                            style={{cursor: 'pointer', background: '#F8FAFC', padding: '10px 20px', borderRadius: '14px', border: '1px solid #E2E8F0', transition: '0.2s', textAlign: 'center'}}
                        >
                            <div style={{fontSize: '18px', fontWeight: 900, color: '#8B5CF6'}}>{(myProfile?.followers || []).filter(userExists).length}</div>
                            <div style={{fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 800}}>Takipçi ↗</div>
                        </div>
                        <div 
                            onClick={() => setUserListModal({ title: '👥 Takip Ettiklerim', userIds: myProfile?.follows || [] })}
                            style={{cursor: 'pointer', background: '#F8FAFC', padding: '10px 20px', borderRadius: '14px', border: '1px solid #E2E8F0', transition: '0.2s', textAlign: 'center'}}
                        >
                            <div style={{fontSize: '18px', fontWeight: 900, color: '#8B5CF6'}}>{(myProfile?.follows || []).filter(userExists).length}</div>
                            <div style={{fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 800}}>Takip ↗</div>
                        </div>
                    </div>
                </div>

                <div style={{background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)', marginBottom: '20px'}}>
                    <h3 style={{fontSize: '15px', color: '#1E293B', marginBottom: '15px'}}>🔒 Gizlilik Ayarları</h3>
                    <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'space-between'}}>
                        <div style={{fontSize: '14px', color: '#334155', fontWeight: 600}}>Gizli Profil (Private)</div>
                        <input type="checkbox" checked={activeUser?.isPrivate || false} onChange={async (e) => {
                            const isChecked = e.target.checked;
                            if (activeUser?.uid) {
                                await updateDoc(doc(db, 'users', activeUser.uid), { isPrivate: isChecked });
                                const updatedUser = {...activeUser, isPrivate: isChecked};
                                if(setActiveUser) setActiveUser(updatedUser);
                                localStorage.setItem('baki_active_user', JSON.stringify(updatedUser)); // Persistent update
                            }
                        }} style={{width: '24px', height: '24px', accentColor: '#8B5CF6'}} />
                    </label>
                    <p style={{fontSize: '12px', color: '#64748B', marginTop: '8px', lineHeight: 1.4}}>Profiliniz gizli olursa gönderilerinizi sadece onayladığınız takipçiler görebilir. Sizi takip etmek isteyenler "Bildirim" havuzuna istek olarak düşer.</p>

                    <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #F1F5F9'}}>
                        <div>
                            <div style={{fontSize: '14px', color: '#334155', fontWeight: 600}}>Sadece Takip Ettiğim Kişiler Mesaj Atabilsin</div>
                            <div style={{fontSize: '11px', color: '#64748B', marginTop: '2px'}}>Profiliniz açık olsa dahi sadece sizin takip ettiğiniz şefler size mesaj gönderebilir.</div>
                        </div>
                        <input type="checkbox" checked={activeUser?.allowMessagesFromFollowersOnly || false} onChange={async (e) => {
                            const isChecked = e.target.checked;
                            if (activeUser?.uid) {
                                await updateDoc(doc(db, 'users', activeUser.uid), { allowMessagesFromFollowersOnly: isChecked });
                                const updatedUser = {...activeUser, allowMessagesFromFollowersOnly: isChecked};
                                if(setActiveUser) setActiveUser(updatedUser);
                                localStorage.setItem('baki_active_user', JSON.stringify(updatedUser));
                            }
                        }} style={{width: '24px', height: '24px', accentColor: '#8B5CF6'}} />
                    </label>
                </div>

                {isEditingUsername && (
                    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100000, padding: '20px', backdropFilter: 'blur(6px)'}}>
                        <div style={{background: 'white', padding: '24px', borderRadius: '20px', width: '100%', maxWidth: '380px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)'}}>
                            <h3 style={{fontSize: '18px', color: '#1E293B', fontWeight: 900, marginBottom: '16px'}}>✏️ Kullanıcı Adını Değiştir</h3>
                            <div style={{display: 'flex', alignItems: 'center', background: '#F8FAFC', borderRadius: '12px', padding: '12px 14px', border: '2px solid #E2E8F0', marginBottom: '16px'}}>
                                <span style={{color: '#8B5CF6', fontWeight: 900, fontSize: '16px', marginRight: '6px'}}>@</span>
                                <input 
                                   type="text" 
                                   value={newUsernameInput} 
                                   onChange={(e) => setNewUsernameInput(e.target.value)} 
                                   placeholder="kullanici_adiniz" 
                                   style={{border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '15px', fontWeight: 700, color: '#1E293B'}}
                                />
                            </div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button 
                                   onClick={() => setIsEditingUsername(false)} 
                                   style={{flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#F1F5F9', color: '#475569', fontWeight: 700, cursor: 'pointer'}}
                                >
                                   Vazgeç
                                </button>
                                <button 
                                   onClick={handleSaveUsername} 
                                   disabled={usernameUpdating}
                                   style={{flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#8B5CF6', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'}}
                                >
                                   {usernameUpdating ? 'Kaydediliyor...' : 'Kaydet 💾'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                <h3 style={{fontSize: '16px', color: '#1E293B', marginBottom: '10px', fontWeight: 800}}>📸 Kendi Gönderilerim ({myPosts.length})</h3>
                {myPosts.length === 0 ? <p style={{color: '#94A3B8', fontSize: '13px', marginBottom: '20px'}}>Henüz hiç gönderi paylaşmamışsınız.</p> : (
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px'}}>
                        {myPosts.map(p => (
                           <div key={p.id} style={{background: '#E2E8F0', height: '140px', borderRadius: '12px', overflow: 'hidden', position: 'relative'}}>
                               {p.images?.length > 0 ? (
                                   <img src={p.images[0]} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Post"/>
                               ) : p.videoURL ? (
                                   <video src={p.videoURL} style={{width:'100%', height:'100%', objectFit:'cover'}} muted />
                               ) : <div style={{width:'100%', height:'100%', background:'#94A3B8'}}/>}
                           </div>
                        ))}
                    </div>
                )}
                
                <h3 style={{fontSize: '16px', color: '#1E293B', marginBottom: '10px', fontWeight: 800}}>❤️ Beğendiğim Gönderiler ({myLikedPosts.length})</h3>
                {myLikedPosts.length === 0 ? <p style={{color: '#94A3B8', fontSize: '13px', marginBottom: '20px', paddingBottom: '30px'}}>Henüz gönderi beğenmediniz.</p> : (
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '40px', paddingBottom: '30px'}}>
                        {myLikedPosts.map(p => (
                           <div key={p.id} style={{background: '#E2E8F0', height: '140px', borderRadius: '12px', overflow: 'hidden', position: 'relative'}}>
                               {p.images?.length > 0 ? (
                                   <img src={p.images[0]} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Post"/>
                               ) : p.videoURL ? (
                                   <video src={p.videoURL} style={{width:'100%', height:'100%', objectFit:'cover'}} muted />
                               ) : <div style={{width:'100%', height:'100%', background:'#94A3B8'}}/>}
                           </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

   
    const renderSearchScreen = () => {
        return (
            <div style={{padding: '10px 0'}}>
                <h2 style={{fontSize: '22px', color: '#1E293B', marginBottom: '5px', fontWeight: 900}}>🔍 Şef Bul</h2>
                <p style={{fontSize: '13px', color: '#64748B', marginBottom: '15px'}}>Dünya genelindeki tüm şefleri arayın, profillerini inceleyin ve takipleşin.</p>
                <input 
                    type="text" 
                    placeholder="👤 Şef Kullanıcı Adı veya İsim Ara..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{width: '100%', padding: '12px 15px', borderRadius: '12px', background: 'white', border: '1px solid #E2E8F0', outline: 'none', color: '#334155', marginBottom: '15px'}}
                />
                <div style={{paddingBottom: '70px'}}>
                    {allUsers.filter(u => u.id !== activeUser.uid && ((u.username||'').toLowerCase().includes(searchQuery.toLowerCase()) || (u.name||'').toLowerCase().includes(searchQuery.toLowerCase()))).map(u => {
                        if (myProfile?.blocked?.includes(u.id)) return null;
                        if (u.blocked?.includes(activeUser.uid)) return null;
                        const isFollowing = myProfile?.follows?.includes(u.id);
                        const isRequested = u.requests?.includes(activeUser.uid);
                        return (
                            <div key={u.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'white', borderRadius: '16px', marginBottom: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)'}}>
                                <div onClick={() => openProfile(u)} style={{display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer'}}>
                                    {u.photoURL ? <img src={getHighResPhotoUrl(u.photoURL)} onClick={(e) => { e.stopPropagation(); setEnlargedPhoto(u.photoURL) }} style={{width:'50px', height:'50px', borderRadius:'50%', objectFit: 'cover', cursor: 'zoom-in'}} /> : <div style={{width:'50px',height:'50px',borderRadius:'50%',background:'#F1F5F9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px'}}>👤</div>}
                                    <div>
                                       <div style={{fontWeight: 800, color: '#334155'}}>@{u.username}</div>
                                       <div style={{fontSize: '12px', color: '#64748B'}}>{u.name}</div>
                                    </div>
                                </div>
                                <button onClick={() => handleFollow(u.id, isFollowing, u.isPrivate, isRequested)} style={{background: isFollowing ? '#E2E8F0' : isRequested ? '#F59E0B' : '#8B5CF6', color: isFollowing ? '#64748B' : 'white', padding: '8px 16px', borderRadius: '20px', border: 'none', fontWeight: 800, cursor: 'pointer', transition: '0.2s'}}>
                                    {isFollowing ? 'Takibi Bırak' : isRequested ? 'İstek Gönderildi' : 'Takip Et'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

         
    const [viewMode, setViewMode] = useState('GRID'); // 'GRID' or 'REELS'
    const [selectedPostModal, setSelectedPostModal] = useState(null); // Post for Instagram Detail Modal
    const [commentDrawerPost, setCommentDrawerPost] = useState(null); // Post for Comment Drawer
    const [newCommentText, setNewCommentText] = useState('');

    const handleAddComment = async (postId) => {
        if (!newCommentText.trim() || !activeUser) return;
        const commentObj = {
            id: Date.now().toString(),
            userId: activeUser.uid,
            userName: activeUser.name || 'Gözde Şef',
            username: activeUser.username || 'anonim',
            userPhoto: activeUser.photoURL || '',
            text: newCommentText.trim(),
            timestamp: Date.now()
        };

        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            comments: arrayUnion(commentObj)
        });

        // Update local states
        const targetPost = feedPosts.find(p => p.id === postId);
        if (targetPost) {
            targetPost.comments = [...(targetPost.comments || []), commentObj];
            if (selectedPostModal?.id === postId) {
                setSelectedPostModal({...targetPost});
            }
            if (commentDrawerPost?.id === postId) {
                setCommentDrawerPost({...targetPost});
            }
        }

        // Notify post owner if different
        if (targetPost && targetPost.userId !== activeUser.uid) {
            const ownerRef = doc(db, 'users', targetPost.userId);
            await updateDoc(ownerRef, {
                notifications: arrayUnion({
                    id: Date.now().toString(),
                    type: 'COMMENT',
                    text: '@' + (activeUser.username || 'Bir şef') + ' gönderinize yorum yaptı: "' + newCommentText.trim().slice(0, 30) + '..."',
                    timestamp: Date.now()
                })
            });
        }

        setNewCommentText('');
    };

    
    const renderFeedScreen = () => {
        let visiblePosts = feedPosts.filter(p => {
            if (p.userId === activeUser.uid) return true;
            const postOwner = allUsers.find(u => u.id === p.userId);
            if (!postOwner) return true;
            if (myProfile?.blocked?.includes(postOwner.id)) return false;
            if (postOwner.blocked?.includes(activeUser.uid)) return false;
            if (postOwner.isPrivate && !(myProfile?.follows?.includes(postOwner.id))) return false;
            return true; 
        });

        return (
            <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 99999, background: '#000000', overflow: 'hidden'}}>
                {/* YUKARIDAKİ SOL GERİ DÖN VE SAĞ PROFIL ARA BUTONLARI */}
                <div style={{position: 'absolute', top: '20px', left: '20px', right: '20px', zIndex: 100000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none'}}>
                    <button 
                        onClick={() => setSubTab('MY_PROFILE')}
                        style={{
                            pointerEvents: 'auto',
                            background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)', 
                            color: 'white', border: '1px solid rgba(255, 255, 255, 0.25)', 
                            padding: '10px 18px', borderRadius: '30px', fontSize: '13px', 
                            fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', 
                            gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', transition: '0.2s'
                        }}
                    >
                        ← Eğlence Serüveni
                    </button>

                    <button 
                        onClick={() => setShowFeedSearchModal(true)}
                        style={{
                            pointerEvents: 'auto',
                            background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)', 
                            color: 'white', border: '1px solid rgba(255, 255, 255, 0.25)', 
                            padding: '10px 18px', borderRadius: '30px', fontSize: '13px', 
                            fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', 
                            gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', transition: '0.2s'
                        }}
                    >
                        🔍 Şef Ara
                    </button>
                </div>

                {/* 🔍 KEŞFET PROFİL ARAMA MODALI (INSTAGRAM STYLE) */}
                {showFeedSearchModal && (
                    <div 
                        style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 250000, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '60px', backdropFilter: 'blur(8px)', padding: '60px 15px 20px 15px'}}
                        onClick={() => setShowFeedSearchModal(false)}
                    >
                        <div 
                            style={{background: 'white', width: '100%', maxWidth: '450px', borderRadius: '24px', padding: '20px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                                <h3 style={{margin: 0, fontSize: '18px', color: '#1E293B', fontWeight: 900}}>🔍 Instagram Tarzı Şef Arama</h3>
                                <button onClick={() => setShowFeedSearchModal(false)} style={{background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748B', fontWeight: 800}}>✕</button>
                            </div>
                            
                            <input 
                                type="text"
                                autoFocus
                                placeholder="👤 @kullanici_adi veya İsim Ara..." 
                                value={feedSearchQuery} 
                                onChange={e => setFeedSearchQuery(e.target.value)}
                                style={{width: '100%', padding: '14px 16px', borderRadius: '16px', background: '#F8FAFC', border: '2px solid #E2E8F0', outline: 'none', fontSize: '14px', color: '#1E293B', fontWeight: 700, marginBottom: '15px'}}
                            />

                            <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                {allUsers.filter(u => u.id !== activeUser.uid && ((u.username||'').toLowerCase().includes(feedSearchQuery.toLowerCase()) || (u.name||'').toLowerCase().includes(feedSearchQuery.toLowerCase()))).length === 0 ? (
                                    <div style={{textAlign: 'center', color: '#94A3B8', padding: '30px 0'}}>Aramanıza uygun şef bulunamadı.</div>
                                ) : (
                                    allUsers.filter(u => u.id !== activeUser.uid && ((u.username||'').toLowerCase().includes(feedSearchQuery.toLowerCase()) || (u.name||'').toLowerCase().includes(feedSearchQuery.toLowerCase()))).map(u => {
                                        const isFollowing = myProfile?.follows?.includes(u.id);
                                        const isRequested = u.requests?.includes(activeUser.uid);
                                        return (
                                            <div key={u.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0'}}>
                                                <div onClick={() => { setShowFeedSearchModal(false); openProfile(u); }} style={{display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer', flex: 1}}>
                                                    {u.photoURL ? <img src={getHighResPhotoUrl(u.photoURL)} style={{width:'44px', height:'44px', borderRadius:'50%', objectFit: 'cover'}} /> : <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'#E2E8F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>👤</div>}
                                                    <div>
                                                       <div style={{fontWeight: 900, color: '#1E293B', fontSize: '14px'}}>@{u.username || 'anonim'}</div>
                                                       <div style={{fontSize: '12px', color: '#64748B'}}>{u.name}</div>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleFollow(u.id, isFollowing, u.isPrivate, isRequested)} style={{background: isFollowing ? '#E2E8F0' : isRequested ? '#F59E0B' : '#8B5CF6', color: isFollowing ? '#64748B' : 'white', padding: '8px 14px', borderRadius: '20px', border: 'none', fontWeight: 800, fontSize: '12px', cursor: 'pointer'}}>
                                                    {isFollowing ? 'Takipte' : isRequested ? 'İstek Gönderildi' : 'Takip Et'}
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {visiblePosts.length === 0 ? (
                    <div style={{textAlign: 'center', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw'}}>
                        Henüz hiçbir gönderi paylaşılmamış. İlk paylaşan şef sen ol!
                    </div>
                ) : (
                    /* 🎬 DIKEY AKIŞ (PURE FULL-SCREEN VERTICAL REELS) */
                    <div className="feed-scroll-container" style={{overflowY: 'scroll', scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch', width: '100vw', height: '100vh', margin: 0, padding: 0, background: '#000000'}}>
                        {visiblePosts.map(post => {
                            const isLikedByMe = post.likes?.includes(activeUser.uid);
                            return (
                                <div key={post.id} style={{scrollSnapAlign: 'start', scrollSnapStop: 'always', height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000000', margin: 0, padding: 0}}>
                                     {post.images && post.images.length > 0 ? (
                                          <div style={{display: 'flex', width: '100%', height: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory'}}>
                                              {post.images.map((imgUrl, i) => (
                                                  <div key={i} style={{minWidth: '100%', width: '100%', flexShrink: 0, height: '100%', scrollSnapAlign: 'center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                      <img src={getHighResPhotoUrl(imgUrl)} alt="post" onClick={() => setEnlargedPhoto(getHighResPhotoUrl(imgUrl))} style={{width: '100%', height: '100%', objectFit: 'cover', background: '#000000', cursor: 'zoom-in'}} />
                                                      {post.images.length > 1 && (
                                                          <div style={{position: 'absolute', top: '25px', right: '20px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '5px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 900}}>
                                                              {i + 1} / {post.images.length}
                                                          </div>
                                                      )}
                                                  </div>
                                              ))}
                                          </div>
                                      ) : (
                                          <video 
                                              src={post.videoURL} 
                                              controls 
                                              playsInline 
                                              style={{width: '100%', height: '100%', objectFit: 'cover', background: 'black'}} 
                                          />
                                      )}
                                     
                                     {/* SOL ALT: PROFİL + AÇIKLAMA */}
                                     <div style={{position: 'absolute', bottom: '30px', left: '20px', right: '80px', color: 'white', textShadow: '0 2px 5px rgba(0,0,0,0.9)', zIndex: 10000}}>
                                         <div style={{fontWeight: 900, fontSize: '17px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
                                             <div onClick={() => {
                                                  const pOwner = allUsers.find(u => u.id === post.userId) || {id: post.userId, username: post.username, name: post.userName, photoURL: post.userPhoto};
                                                  openProfile(pOwner);
                                              }} style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                                                {post.userPhoto ? <img src={getHighResPhotoUrl(post.userPhoto)} alt="p" style={{width:'40px', height:'40px', borderRadius:'50%', border: '2px solid white', objectFit: 'cover'}} /> : <span style={{fontSize:'28px'}}>👤</span>}
                                                @{post.username || (post.userName||'').replace(/\s+/g, '')}
                                             </div>
                                             
                                             {post.userId !== activeUser.uid && (
                                                 <button 
                                                     onClick={() => handleFollow(post.userId, myProfile?.follows?.includes(post.userId))}
                                                     style={{
                                                         padding: '5px 14px', borderRadius: '20px', border: '1px solid white', 
                                                         background: myProfile?.follows?.includes(post.userId) ? 'rgba(255,255,255,0.2)' : '#EC4899', 
                                                         color: 'white', fontWeight: 900, fontSize: '12px', cursor: 'pointer', transition: '0.2s', marginLeft: '5px', backdropFilter: 'blur(5px)'
                                                     }}>
                                                     {myProfile?.follows?.includes(post.userId) ? '✓ Takipte' : 'Takip Et +'}
                                                 </button>
                                             )}
                                         </div>
                                         {post.caption && <div style={{fontSize: '14px', marginTop: '10px', lineHeight: '1.4', fontWeight: 500, background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '12px', backdropFilter: 'blur(4px)', display: 'inline-block'}}>{post.caption}</div>}
                                     </div>

                                     {/* SAĞ ALT: SADECE BEĞENİ VE YORUM */}
                                     <div style={{position: 'absolute', bottom: '40px', right: '20px', display: 'flex', flexDirection: 'column', gap: '22px', alignItems: 'center', zIndex: 10000}}>
                                         {/* BEĞENİ ❤️ */}
                                         <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'}} onClick={async () => {
                                               const pRef = doc(db, 'posts', post.id);
                                               if (isLikedByMe) {
                                                   await updateDoc(pRef, { likes: arrayRemove(activeUser.uid) });
                                               } else {
                                                   await updateDoc(pRef, { likes: arrayUnion(activeUser.uid) });
                                                   if (post.userId !== activeUser.uid) {
                                                       try {
                                                           const targetUserRef = doc(db, 'users', post.userId);
                                                           const notifObj = {
                                                               id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 4),
                                                               type: 'LIKE',
                                                               text: '❤️ @' + (activeUser.username || activeUser.name || 'Bir şef') + ' lezzetli gönderinizi beğendi!',
                                                               fromId: activeUser.uid,
                                                               postId: post.id,
                                                               timestamp: Date.now()
                                                           };
                                                           await updateDoc(targetUserRef, {
                                                               notifications: arrayUnion(notifObj)
                                                           }).catch(async (e) => {
                                                               await setDoc(targetUserRef, { notifications: [notifObj] }, { merge: true });
                                                           });
                                                           console.log("Beğeni bildirimi başarıyla gönderildi!");
                                                       } catch(err) {
                                                           console.log("Beğeni bildirimi iletim hatası:", err);
                                                       }
                                                   }
                                               }
                                         }}>
                                             <div style={{width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 10px rgba(0,0,0,0.4)'}}>
                                                 <span style={{fontSize: '26px'}}>{isLikedByMe ? '❤️' : '🤍'}</span>
                                             </div>
                                             <span style={{color: 'white', fontSize: '12px', fontWeight: 900, marginTop: '4px', textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>{post.likes?.length || 0}</span>
                                         </div>

                                         {/* YORUM 💬 */}
                                         <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'}} onClick={() => setCommentDrawerPost(post)}>
                                             <div style={{width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 10px rgba(0,0,0,0.4)'}}>
                                                 <span style={{fontSize: '24px'}}>💬</span>
                                             </div>
                                             <span style={{color: 'white', fontSize: '12px', fontWeight: 900, marginTop: '4px', textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>{post.comments?.length || 0}</span>
                                         </div>
                                     </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 💬 YORUMLAR MODALI (COMMENT DRAWER) */}
                {commentDrawerPost && (
                    <div 
                        style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(8px)'}}
                        onClick={() => setCommentDrawerPost(null)}
                    >
                        <div 
                            style={{background: 'white', width: '100%', maxWidth: '500px', height: '75vh', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 -10px 30px rgba(0,0,0,0.3)'}}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Yorumlar Başlığı */}
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0'}}>
                                <h3 style={{margin: 0, fontSize: '17px', color: '#1E293B', fontWeight: 900}}>💬 Yorumlar ({commentDrawerPost.comments?.length || 0})</h3>
                                <button onClick={() => setCommentDrawerPost(null)} style={{background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748B', fontWeight: 800}}>✕</button>
                            </div>

                            {/* Yorumlar Listesi */}
                            <div style={{flex: 1, overflowY: 'auto', padding: '15px 0', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                {(!commentDrawerPost.comments || commentDrawerPost.comments.length === 0) ? (
                                    <div style={{textAlign: 'center', color: '#94A3B8', margin: '40px 0'}}>Henüz yorum yapılmamış. İlk yorumu sen ekle!</div>
                                ) : (
                                    commentDrawerPost.comments.map(c => {
                                        const cTime = c.timestamp ? new Date(c.timestamp).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'}) : '';
                                        const canDeleteComment = (c.userId === activeUser.uid) || (commentDrawerPost.userId === activeUser.uid) || (activeUser.email === "yusufkorqmaz79@gmail.com");
                                        const handleUserClick = () => {
                                            setCommentDrawerPost(null);
                                            openProfile(allUsers.find(u => u.id === c.userId || u.uid === c.userId) || {id: c.userId, username: c.username, name: c.userName, photoURL: c.userPhoto});
                                        };
                                        return (
                                            <div key={c.id || c.timestamp || Math.random()} style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                                                {c.userPhoto ? <img src={getHighResPhotoUrl(c.userPhoto)} alt="" onClick={handleUserClick} style={{width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer'}} /> : <div onClick={handleUserClick} style={{width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>👤</div>}
                                                <div style={{background: '#F8FAFC', padding: '10px 14px', borderRadius: '16px', flex: 1, border: '1px solid #F1F5F9'}}>
                                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                                                        <span onClick={handleUserClick} style={{fontWeight: 800, fontSize: '13px', color: '#1E293B', cursor: 'pointer'}}>@{c.username || c.userName}</span>
                                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                            <span style={{fontSize: '10px', color: '#94A3B8'}}>{cTime}</span>
                                                            {canDeleteComment && (
                                                                <button onClick={() => handleDeleteComment(commentDrawerPost.id, c)} style={{background: 'none', border: 'none', color: '#EF4444', fontSize: '12px', cursor: 'pointer', padding: 0}}>🗑️</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div style={{fontSize: '13px', color: '#334155', lineHeight: '1.4'}}>{c.text}</div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Yorum Yazma Alanı (Sabit En Alt) */}
                            <div style={{display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid #E2E8F0', position: 'sticky', bottom: 0, background: 'white', zIndex: 10}}>
                                <input 
                                    type="text" 
                                    placeholder="Düşüncelerini paylaş..." 
                                    value={newCommentText} 
                                    onChange={e => setNewCommentText(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddComment(commentDrawerPost.id)}
                                    style={{flex: 1, padding: '12px 15px', borderRadius: '20px', border: '1px solid #E2E8F0', outline: 'none', background: '#F8FAFC', fontSize: '13px'}}
                                />
                                <button 
                                    onClick={() => handleAddComment(commentDrawerPost.id)}
                                    style={{background: '#3B82F6', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '20px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59,130,246,0.3)'}}
                                >
                                    Gönder
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };


const renderNotificationsScreen = () => {
       const reqs = allUsers.filter(u => myProfile?.requests?.includes(u.id));
       const chatGivers = allUsers.filter(u => myProfile?.unreadCount?.includes(u.id));
       
       return (
       <div style={{padding: '10px 0'}}>
           <h2 style={{fontSize: '22px', color: '#1E293B', marginBottom: '20px', fontWeight: 900}}>🔔 Bildirimler</h2>
           
           {chatGivers.length > 0 && (
               <div style={{marginBottom: '20px'}}>
                   <h3 style={{fontSize: '16px', color: '#10B981', marginBottom: '10px'}}>💬 Yeni Mesajlarınız Var</h3>
                   {chatGivers.map(u => (
                       <div key={u.id} style={{padding: '12px', background: 'white', borderLeft: '4px solid #10B981', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                           <span style={{fontSize: '14px'}}><b>@{u.username || "anonim"}</b> size yeni bir mesaj gönderdi.</span>
                            <div style={{display: 'flex', gap: '8px'}}>
                               <button onClick={async () => { 
                                   setSubTab('CHAT'); 
                                   setSelectedChatUser(u); 
                                   await updateDoc(doc(db, 'users', activeUser.uid), { unreadCount: arrayRemove(u.id) });
                               }} style={{background: '#10B981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800}}>Oku</button>
                               <button onClick={async () => {
                                   await updateDoc(doc(db, 'users', activeUser.uid), { unreadCount: arrayRemove(u.id) });
                               }} style={{background: '#F1F5F9', color: '#64748B', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800}}>Sil</button>
                            </div>
                       </div>
                   ))}
               </div>
           )}

           <h3 style={{fontSize: '16px', color: '#F59E0B', marginBottom: '10px'}}>👥 Takip İstekleri</h3>
           {reqs.length === 0 ? <div style={{textAlign: 'center', margin: '30px 0', color: '#64748B'}}>Henüz yeni bir takip isteğiniz yok.</div> : reqs.map(u => (
               <div key={u.id} style={{padding: '15px', background: 'white', borderRadius: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                   <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                       {u.photoURL ? <img src={getHighResPhotoUrl(u.photoURL)} alt="" style={{width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover'}}/> : <div style={{width:'45px', height:'45px', borderRadius:'50%', background:'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px'}}>👤</div>}
                       <div><div style={{fontWeight: 800}}>@{u.username}</div><div style={{fontSize: '12px', color: '#64748B'}}>Sizi takip etmek istiyor</div></div>
                   </div>
                   <div style={{display: 'flex', gap: '8px'}}>
                       <button onClick={async () => {
                           const meRef = doc(db, 'users', activeUser.uid);
                           const tRef = doc(db, 'users', u.id);
                           await updateDoc(meRef, { requests: arrayRemove(u.id), followers: arrayUnion(u.id) });
                           await updateDoc(tRef, { follows: arrayUnion(activeUser.uid) });
                       }} style={{background: '#10B981', color: 'white', padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer'}}>Onayla</button>
                       <button onClick={async () => {
                           await updateDoc(doc(db, 'users', activeUser.uid), { requests: arrayRemove(u.id) });
                       }} style={{background: '#F1F5F9', color: '#64748B', padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer'}}>Sil</button>
                   </div>
               </div>
           ))}

           <h3 style={{fontSize: '16px', color: '#8B5CF6', marginBottom: '10px', marginTop: '20px'}}>🌟 Tüm Bildirimler</h3>
           {(!myProfile?.notifications || myProfile.notifications.length === 0) ? <div style={{textAlign: 'center', margin: '30px 0', color: '#64748B'}}>Henüz yeni bildiriminiz yok.</div> : 
               [...myProfile.notifications].sort((a,b)=>b.timestamp-a.timestamp).map(n => (
                   <div key={n.id} style={{padding: '12px', background: 'white', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: n.type === 'LIKE' ? '4px solid #EC4899' : '4px solid #10B981'}}>
                       <span style={{fontSize: '14px', color: '#334155'}}>{n.text}</span>
                       <button onClick={async () => {
                           await updateDoc(doc(db, 'users', activeUser.uid), {
                               notifications: myProfile.notifications.filter(x => x.id !== n.id)
                           });
                       }} style={{background: '#F1F5F9', color: '#64748B', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800}}>Kapat</button>
                   </div>
               ))
           }
       </div>
       );
   };

   const renderFollowScreen = () => {
       // SADECE GÜVENLİ AĞ (Takip ettiklerimiz veya bizi takip edenler)
       const networkUsers = allUsers.filter(u => myProfile?.follows?.includes(u.id) || myProfile?.followers?.includes(u.id));
       const filteredUsers = networkUsers.filter(u => 
           (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
           (u.name || '').toLowerCase().includes(searchQuery.toLowerCase())
       );
       
       return (
       <div style={{padding: '10px 0'}}>
           <h2 style={{fontSize: '22px', color: '#1E293B', marginBottom: '5px', fontWeight: 900}}>👥 Özel Şef Ağım</h2>
           <p style={{fontSize: '13px', color: '#64748B', marginBottom: '20px'}}>Sadece takipleştiğiniz, kendi güvenli mutfak ağınızdaki gurmeler.</p>
           
           <div style={{marginBottom: '20px'}}>
               <input 
                   type="text" 
                   placeholder="👤 Ağında Ara..." 
                   value={searchQuery} 
                   onChange={(e) => setSearchQuery(e.target.value)}
                   style={{width: '100%', padding: '12px 15px', borderRadius: '12px', background: 'white', border: '1px solid #E2E8F0', outline: 'none', color: '#334155'}}
               />
           </div>
           
           {loadingUsers ? (
               <div style={{textAlign: 'center', margin: '30px 0', color: '#10B981', fontWeight: 600}}>Gurmeler Yükleniyor...</div>
           ) : filteredUsers.length === 0 ? (
               <div style={{textAlign: 'center', margin: '30px 0', color: '#64748B'}}>{searchQuery ? "Aramanıza uygun şef bulunamadı." : "Şu an sistemde sizden başka kimse bulunmuyor."}</div>
           ) : (
               filteredUsers.map(u => {
                   const isFollowing = myProfile?.follows?.includes(u.id);
                   return (
                       <div key={u.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'white', borderRadius: '16px', marginBottom: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)'}}>
                           <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                               {u.photoURL ? (
                                    <img src={getHighResPhotoUrl(u.photoURL)} alt={u.name} style={{width:'50px', height:'50px', borderRadius:'50%', objectFit: 'cover'}} />
                               ) : (
                                    <div style={{width:'50px', height:'50px', borderRadius:'50%', background:'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px'}}>👤</div>
                               )}
                               <div>
                                   <div style={{fontWeight: '800', fontSize:'15px', color:'#334155'}}>@{u.username || 'anonim'}</div>
                               </div>
                           </div>
                           <button 
                               onClick={() => handleFollow(u.id, isFollowing)}
                               style={{padding: '8px 16px', borderRadius: '25px', border: 'none', background: isFollowing ? '#F1F5F9' : '#10B981', color: isFollowing ? '#64748B' : 'white', fontWeight: '800', cursor: 'pointer', fontSize:'13px', transition: '0.2s'}}
                           >
                               {isFollowing ? 'Takibi Bırak' : 'Takip Et'}
                           </button>
                       </div>
                   )
               })
           )}
       </div>
       );
   };

    const renderBadgesScreen = () => {
        const badges = [
            { id: 'master_chef', title: '🥇 Usta Şef', desc: '10+ Şef Tarifi Pişiren Gurme', unlocked: true, color: '#F59E0B', bg: '#FEF3C7' },
            { id: 'zero_waste', title: '🌱 İsraf Avcısı', desc: 'Artan Malzemeleri Dönüştüren Şef', unlocked: true, color: '#10B981', bg: '#DCFCE7' },
            { id: 'savings_hero', title: '💰 Tasarruf Şampiyonu', desc: 'Dışarı Fiyatına Kıyasla 1,000+ ₺ Tasarruf Eden', unlocked: true, color: '#3B82F6', bg: '#DBEAFE' },
            { id: 'social_gourmet', title: '🔥 Lezzet Gurmesi', desc: 'Eğlence Serüveninde Paylaşım Yapan', unlocked: (myPosts.length > 0), color: '#EC4899', bg: '#FCE7F3' }
        ];

        return (
            <div style={{padding: '15px 0', color: '#1E293B'}}>
                <div style={{background: 'white', borderRadius: '24px', padding: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '20px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                        <span style={{fontSize: '32px'}}>🏆</span>
                        <div>
                            <h2 style={{margin: 0, fontSize: '20px', fontWeight: 900, color: '#0F172A'}}>Gurme Rozetleri & Şef Yarışmaları</h2>
                            <p style={{margin: '2px 0 0 0', fontSize: '12px', color: '#64748B'}}>Pişirdikçe rozet kazanın, haftalık tasarruf liginde öne geçin!</p>
                        </div>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px'}}>
                        {badges.map(b => (
                            <div key={b.id} style={{
                                background: b.unlocked ? b.bg : '#F8FAFC',
                                borderRadius: '16px', padding: '16px',
                                border: b.unlocked ? `2px solid ${b.color}` : '1px dashed #CBD5E1',
                                opacity: b.unlocked ? 1 : 0.65
                            }}>
                                <div style={{fontSize: '15px', fontWeight: 900, color: b.unlocked ? b.color : '#64748B', marginBottom: '4px'}}>
                                    {b.title} {b.unlocked ? '✅' : '🔒'}
                                </div>
                                <div style={{fontSize: '11px', color: '#475569', lineHeight: '1.4'}}>{b.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{background: 'linear-gradient(135deg, #4F46E5, #3730A3)', borderRadius: '24px', padding: '20px', color: 'white', boxShadow: '0 10px 25px rgba(79,70,229,0.3)'}}>
                    <h3 style={{margin: '0 0 8px 0', fontSize: '16px', fontWeight: 900}}>🎯 Haftalık En İyi Şef Yarışması</h3>
                    <p style={{margin: 0, fontSize: '12px', opacity: 0.9, lineHeight: '1.5'}}>
                        Bu hafta en çok evde pişirip tasarruf sağlayan şefimiz <b>@{activeUser?.username || 'Siz'}</b>! Toplam tasarruf puanınız: <b>1,450 XP</b>.
                    </p>
                </div>
            </div>
        );
    };

   return (
       <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, display:'flex', flexDirection:'column', height:'100vh', width:'100vw', background: '#0F172A', overflow: 'hidden'}}>
           {/* ÜST BAŞLIK & GERİ ÇIKMA BUTONU */}
           <div style={{padding: '12px 18px', background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', flexShrink: 0}}>
               <button 
                  onClick={onBack} 
                  style={{background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 800, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(6px)'}}
               >
                  ← Geri Dön
               </button>
               <div style={{fontWeight: 900, fontSize: '17px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                  🎬 Eğlence Serüveni
               </div>
               <div style={{width: '85px'}}></div>
           </div>

           {/* İÇERİK EKRANLARI */}
           <div style={{flex:1, overflowY: (subTab === 'CHAT' && selectedChatUser) ? 'hidden' : ((subTab === 'FEED' && feedMode === 'WATCH') ? 'hidden' : 'auto'), padding: (subTab === 'CHAT' && selectedChatUser) ? '0' : ((subTab === 'FEED' && feedMode === 'WATCH') ? '0' : '0 15px'), paddingBottom: (subTab === 'CHAT' && selectedChatUser) ? '0' : ((subTab === 'FEED' && feedMode === 'WATCH') ? '0' : '70px'), display: 'flex', flexDirection: 'column'}}>
               {subTab === 'MY_PROFILE' && renderMyProfileScreen()}
               {subTab === 'FEED' && renderFeedScreen()}
                {subTab === 'SEARCH' && renderSearchScreen()}
               {subTab === 'CHAT' && (
                   <div style={{padding: '15px 0', height: '100%', display: 'flex', flexDirection: 'column'}}>
                      {!selectedChatUser ? (
                         <div style={{background: 'white', borderRadius: '24px', padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                                <div>
                                    <h2 style={{fontSize: '22px', color: '#0F172A', margin: 0, fontWeight: 900}}>💬 Gurme Sohbet Odası</h2>
                                    <p style={{fontSize: '13px', color: '#64748B', margin: '4px 0 0 0'}}>Mutfak topluluğundaki tüm şeflerle anlık mesajlaşın.</p>
                                </div>
                                <span style={{background: '#ECFDF5', color: '#047857', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800}}>● Canlı</span>
                            </div>

                            <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '5px'}}>
                                {(() => {
                                   const mutualFollowers = allUsers.filter(u => {
                                       const uId = u.id || u.uid;
                                       if (uId === activeUser?.uid) return false;
                                       const iFollowThem = (myProfile?.follows || []).includes(uId);
                                       const theyFollowMe = (u.follows || []).includes(activeUser?.uid) || (myProfile?.followers || []).includes(uId);
                                       return iFollowThem && theyFollowMe;
                                   });

                                   if (mutualFollowers.length === 0) {
                                       return (
                                           <div style={{textAlign: 'center', margin: '40px 0', color: '#64748B', padding: '20px'}}>
                                               <div style={{fontSize: '36px', marginBottom: '10px'}}>🤝</div>
                                               <strong style={{color: '#0F172A', display: 'block', marginBottom: '6px'}}>Takipleştiğiniz Şef Bulunmuyor</strong>
                                               <span style={{fontSize: '13px'}}>Sohbet edebilmek için karşılıklı takipleştiğiniz (sizin takip ettiğiniz ve sizi takip eden) bir şef olması gerekmektedir. Şef Bul sekmesinden veya arama kısmından şefleri takip edebilirsiniz!</span>
                                           </div>
                                       );
                                   }

                                   return mutualFollowers.map(u => {
                                       const uId = u.id || u.uid;
                                       return (
                                          <div 
                                             key={uId} 
                                             onClick={() => {
                                                 const currentEmail = activeUser?.email || '';
                                                 const isAdmin = currentEmail === "yusufkorqmaz79@gmail.com";
                                                 if (!isAdmin && u.isPrivate && !(u.follows || []).includes(activeUser?.uid) && !(myProfile?.followers || []).includes(uId)) {
                                                     return alert("Bu hesap gizlidir, sizi takip etmeden mesaj atamazsınız");
                                                 }
                                                 if (!isAdmin && u.allowMessagesFromFollowersOnly && !(u.follows || []).includes(activeUser?.uid)) {
                                                     return alert("Bu kullanıcı yalnızca takip ettiği kişilerden mesaj kabul etmektedir.");
                                                 }
                                                 setSelectedChatUser({ ...u, id: uId });
                                             }} 
                                             style={{
                                                 display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                 padding: '14px 16px', background: '#F8FAFC', borderRadius: '18px',
                                                 border: '1px solid #E2E8F0', cursor: 'pointer', transition: '0.2s'
                                             }}
                                          >
                                              <div style={{display: 'flex', alignItems: 'center', gap: '14px'}}>
                                                  {u.photoURL ? (
                                                      <img src={getHighResPhotoUrl(u.photoURL)} alt="p" style={{width:'46px', height:'46px', borderRadius:'50%', objectFit:'cover', border: '2px solid #10B981'}} />
                                                  ) : (
                                                      <div style={{width:'46px', height:'46px', borderRadius:'50%', background:'#E2E8F0', display:'flex', alignItems:'center', justifyContent:'center', fontSize: '22px'}}>👤</div>
                                                  )}
                                                  <div>
                                                      <div style={{fontWeight: '900', color: '#0F172A', fontSize: '15px'}}>@{u.username || u.name || 'anonim'}</div>
                                                      <div style={{fontSize: '12px', color: '#10B981', fontWeight: 600}}>
                                                          ✓ Takipleşiyorsunuz
                                                      </div>
                                                  </div>
                                              </div>
                                              
                                              <button style={{background: '#10B981', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '12px', fontWeight: 800, fontSize: '12px', cursor: 'pointer'}}>
                                                  Sohbet Et 💬
                                              </button>
                                          </div>
                                       );
                                   });
                                })()}
                             </div>
                          </div>
                       ) : (
                          <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%', position: 'relative', overflow: 'hidden', background: '#F8FAFC', borderRadius: '24px', padding: '15px'}}>
                             {/* SOHBET ÜST KART */}
                             <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', background: 'white', padding: '12px 16px', borderRadius: '16px', marginBottom: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
                                 <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                     <button onClick={() => setSelectedChatUser(null)} style={{background: '#F1F5F9', border: 'none', padding: '8px 14px', borderRadius: '20px', cursor: 'pointer', fontWeight: 800, color: '#475569', fontSize: '13px'}}>← Geri</button>
                                     <div onClick={() => openProfile(selectedChatUser)} style={{fontWeight: 900, color: '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                         {selectedChatUser.photoURL ? <img src={getHighResPhotoUrl(selectedChatUser.photoURL)} style={{width:'38px',height:'38px',borderRadius:'50%',objectFit:'cover', border: '2px solid #10B981'}}/> : <div style={{width:'38px',height:'38px',borderRadius:'50%',background:'#E2E8F0',display:'flex',alignItems:'center',justifyContent:'center'}}>👤</div>}
                                         <div>
                                             <div style={{fontSize: '15px', fontWeight: 900, color: '#0F172A'}}>@{selectedChatUser.username || selectedChatUser.name || 'anonim'}</div>
                                             <div style={{fontSize: '11px', color: '#10B981', fontWeight: 700}}>● Canlı Sohbet Odası</div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             {/* MESAJ GEÇMİŞİ */}
                             <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px'}}>
                                 {chatMessages.length === 0 && (
                                     <div style={{textAlign: 'center', color: '#64748B', marginTop: '40px', background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #E2E8F0'}}>
                                         <div style={{fontSize: '32px', marginBottom: '8px'}}>👋</div>
                                         <strong style={{color: '#0F172A'}}>Henüz mesajlaşma başlamadı.</strong><br/>
                                         <span style={{fontSize: '13px'}}>İlk mesajı yazarak veya fotoğraf göndererek iletişime geçin!</span>
                                     </div>
                                 )}
                                 {chatMessages.map(m => {
                                     const currentUid = activeUser?.uid || activeUser?.id || 'guest';
                                     const currentEmail = activeUser?.email || '';
                                     const isMe = m.senderId === currentUid;
                                     const timeString = m.timestamp ? new Date(m.timestamp).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}) : 'Anlık';
                                     const canDelete = isMe || currentEmail === "yusufkorqmaz79@gmail.com";
                                     const reactionsMap = m.reactions || {};
                                     const reactionEntries = Object.entries(reactionsMap);
                                     const isPickerOpen = reactionPickerMsgId === m.id;

                                     return (
                                         <div key={m.id || Math.random()} style={{alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '85%', display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '8px', alignItems:'flex-end', position: 'relative'}}>
                                             {!isMe && <img src={getHighResPhotoUrl(selectedChatUser?.photoURL) || ''} alt="" style={{width:'30px', height:'30px', borderRadius:'50%', objectFit: 'cover', background: '#E2E8F0'}}/>}
                                             
                                             <div style={{position: 'relative'}}>
                                                 {isPickerOpen && (
                                                     <div style={{position: 'absolute', top: '-42px', [isMe ? 'right' : 'left']: 0, background: 'white', borderRadius: '20px', padding: '4px 10px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', display: 'flex', gap: '8px', zIndex: 100, border: '1px solid #E2E8F0'}}>
                                                         {['❤️', '🔥', '👍', '😂', '😮', '👏'].map(emoji => (
                                                             <span key={emoji} onClick={() => handleToggleReaction(m.id, emoji)} style={{fontSize: '18px', cursor: 'pointer', transform: 'scale(1)', transition: '0.1s'}}>
                                                                 {emoji}
                                                             </span>
                                                         ))}
                                                     </div>
                                                 )}

                                                 <div 
                                                     onClick={() => setReactionPickerMsgId(isPickerOpen ? null : m.id)}
                                                     style={{
                                                         background: isMe ? 'linear-gradient(135deg, #10B981, #059669)' : 'white', 
                                                         color: isMe ? 'white' : '#1E293B', 
                                                         padding: '12px 16px', 
                                                         borderRadius: '20px', 
                                                         borderBottomRightRadius: isMe ? '4px' : '20px', 
                                                         borderBottomLeftRadius: isMe ? '20px' : '4px', 
                                                         boxShadow: '0 3px 8px rgba(0,0,0,0.06)', 
                                                         position: 'relative',
                                                         cursor: 'pointer',
                                                         border: isMe ? 'none' : '1px solid #E2E8F0'
                                                     }}
                                                 >
                                                     {m.text && <div style={{fontSize: '14px', lineHeight: '1.4', wordBreak: 'break-word'}}>{m.text}</div>}
                                                     
                                                     {m.imageURL && (
                                                         <img 
                                                             src={m.imageURL} 
                                                             alt="Chat Photo" 
                                                             onClick={(e) => { e.stopPropagation(); setEnlargedPhoto(m.imageURL); }} 
                                                             style={{maxWidth: '220px', maxHeight: '220px', borderRadius: '12px', objectFit: 'cover', cursor: 'pointer', display: 'block', margin: '4px 0'}} 
                                                         />
                                                     )}

                                                     {m.audioURL && (
                                                         <div style={{display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0'}}>
                                                             <audio controls src={m.audioURL} style={{maxWidth: '210px', height: '40px'}} />
                                                         </div>
                                                     )}

                                                     <div style={{display: 'flex', alignItems: 'center', justifyContent: isMe ? 'flex-end' : 'space-between', gap: '10px', marginTop: '6px'}}>
                                                         <span style={{fontSize: '10px', opacity: 0.85, fontWeight: 600}}>{timeString}</span>
                                                         {canDelete && (
                                                             <button onClick={(e) => { e.stopPropagation(); handleDeleteChatMessage(m.id); }} style={{background: 'none', border: 'none', color: isMe ? 'rgba(255,255,255,0.9)' : '#EF4444', fontSize: '12px', cursor: 'pointer', padding: 0}}>🗑️</button>
                                                         )}
                                                     </div>

                                                     {reactionEntries.length > 0 && (
                                                         <div style={{position: 'absolute', bottom: '-12px', [isMe ? 'left' : 'right']: '10px', background: 'white', borderRadius: '12px', padding: '2px 8px', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', fontSize: '11px', display: 'flex', gap: '4px', alignItems: 'center', border: '1px solid #E2E8F0', color: '#1E293B'}}>
                                                             {Array.from(new Set(reactionEntries.map(r => r[1]))).map(emoji => (
                                                                 <span key={emoji}>{emoji}</span>
                                                             ))}
                                                             <span style={{fontSize: '10px', fontWeight: 800, color: '#64748B'}}>{reactionEntries.length}</span>
                                                         </div>
                                                     )}
                                                 </div>
                                             </div>
                                         </div>
                                     );
                                 })}
                                 <div ref={chatEndRef} />
                             </div>
                             
                             {/* GİRDİ ALANI (Sadece Metin + Gönder) */}
                             <div style={{display: 'flex', gap: '8px', padding: '10px', background: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', position: 'sticky', bottom: 0, zIndex: 50, alignItems: 'center'}}>
                                 <input 
                                     type="text" 
                                     value={msgText} 
                                     onChange={e => setMsgText(e.target.value)} 
                                     onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                                     placeholder="Mesajınızı yazın..." 
                                     style={{flex: 1, padding: '12px 16px', border: 'none', outline: 'none', background: 'transparent', fontSize: '15px', color: '#0F172A'}} 
                                 />

                                 <button onClick={handleSendMessage} style={{background: '#10B981', color: 'white', border: 'none', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontWeight: 900, boxShadow: '0 4px 10px rgba(16,185,129,0.3)'}}>
                                     ➤
                                 </button>
                             </div>
                          </div>
                      )}
                   </div>
                )}
                
                {subTab === 'NOTIFY' && renderNotificationsScreen()}
                {subTab === 'FOLLOW' && renderFollowScreen()}
                {subTab === 'PROFILE' && renderProfileScreen()}
                {subTab === 'BADGES' && renderBadgesScreen()}
                {subTab === 'MATCH' && <NeYesekMatch openShopping={openShopping} />}
                
                {subTab === 'UPLOAD' && 
                   <div style={{padding: '10px 0'}}>
                      <h1 style={{fontSize: '24px', color: '#1E293B', marginBottom: '10px', fontWeight: 900}}>🎬 Mutfağınızı Paylaşın</h1>
                      <p style={{color: '#64748B', fontSize: '13px', marginBottom: '25px'}}>Harika bir tarif mi denediniz? Ya da şans çarkından çıkan çılgın bir yemeği mi yapıyorsunuz? Topluluğa ilham vermek için videonuzu yükleyin.</p>
                      
                      <div style={{background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)'}}>
                         <div style={{marginBottom: '15px'}}>
                            <label style={{fontWeight: 700, color: '#334155', fontSize: '14px', display: 'block', marginBottom: '8px'}}>Açıklama (Caption)</label>
                            <textarea 
                               placeholder="Videonuz ne hakkında? Etiketleri (#) unutmayın!" 
                               value={videoDesc} onChange={e => setVideoDesc(e.target.value)}
                               style={{width: '100%', height: '80px', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '10px', resize: 'none', outline: 'none', background: '#F8FAFC'}} 
                            />
                         </div>
                         
                         <div style={{marginBottom: '20px'}}>
                            <label style={{fontWeight: 700, color: '#334155', fontSize: '14px', display: 'block', marginBottom: '8px'}}>Medya Dosyası (Video veya Fotoğraf)</label>
                            
                            <div style={{display: 'flex', gap: '8px'}}>
                               <label style={{flex: 1, padding: '10px 5px', background: '#3B82F6', color: 'white', borderRadius: '12px', textAlign: 'center', fontWeight: 800, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '13px'}}>
                                  <span style={{fontSize: '20px'}}>📸</span>
                                  Foto Çek
                                  <input type="file" accept="image/*" capture="environment" onChange={e => setVideoFile(e.target.files[0])} style={{display: 'none'}} />
                               </label>
                               
                               <label style={{flex: 1, padding: '10px 5px', background: '#EF4444', color: 'white', borderRadius: '12px', textAlign: 'center', fontWeight: 800, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '13px'}}>
                                  <span style={{fontSize: '20px'}}>🎥</span>
                                  Video Çek
                                  <input type="file" accept="video/*" capture="environment" onChange={e => setVideoFile(e.target.files[0])} style={{display: 'none'}} />
                               </label>

                               <label style={{flex: 1, padding: '10px 5px', background: '#10B981', color: 'white', borderRadius: '12px', textAlign: 'center', fontWeight: 800, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '13px'}}>
                                  <span style={{fontSize: '20px'}}>📂</span>
                                  Galeriden
                                  <input type="file" accept="video/*,image/*" onChange={e => setVideoFile(e.target.files[0])} style={{display: 'none'}} />
                               </label>
                            </div>
                            
                            {videoFile && <div style={{fontSize: '12px', margin: '5px 0', color: '#10B981', fontWeight: 600}}>Seçilen: {videoFile.name}</div>}
                         </div>
                         
                         <button 
                            onClick={handleVideoUpload} disabled={uploading}
                            style={{width: '100%', padding: '15px', background: uploading ? '#94A3B8' : '#EC4899', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '16px', cursor: uploading ? 'not-allowed' : 'pointer', transition: '0.2s', boxShadow: '0 4px 15px rgba(236,72,153,0.3)'}}
                         >
                            {uploading ? '⏳ Yayına Hazırlanıyor...' : '🔥 Paylaş (Gönder)'}
                         </button>
                      </div>
                   </div>
                }
           </div>
                      {/* 👥 TAKİPÇİ / TAKİP LİSTESİ MODALI */}
            {userListModal && (
                <div 
                    style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', zIndex: 250000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(6px)', padding: '20px'}}
                    onClick={() => setUserListModal(null)}
                >
                    <div 
                        style={{background: 'white', width: '100%', maxWidth: '420px', borderRadius: '24px', padding: '20px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'}}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0'}}>
                            <h3 style={{margin: 0, fontSize: '18px', color: '#1E293B', fontWeight: 900}}>{userListModal.title} ({userListModal.userIds.length})</h3>
                            <button onClick={() => setUserListModal(null)} style={{background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748B', fontWeight: 800}}>✕</button>
                        </div>

                        <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            {userListModal.userIds.length === 0 ? (
                                <div style={{textAlign: 'center', color: '#94A3B8', padding: '30px 0'}}>Bu listede henüz hiç şef bulunmuyor.</div>
                            ) : (
                                userListModal.userIds.map(uid => {
                                    const targetUser = allUsers.find(u => u.id === uid) || { id: uid, username: 'anonim', name: 'Şef' };
                                    const isFollowing = myProfile?.follows?.includes(uid);
                                    const isRequested = targetUser.requests?.includes(activeUser.uid);
                                    
                                    return (
                                        <div key={uid} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0'}}>
                                            <div onClick={() => { setUserListModal(null); openProfile(targetUser); }} style={{display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer', flex: 1}}>
                                                {targetUser.photoURL ? <img src={getHighResPhotoUrl(targetUser.photoURL)} style={{width:'42px', height:'42px', borderRadius:'50%', objectFit: 'cover'}} alt="avatar"/> : <div style={{width:'42px',height:'42px',borderRadius:'50%',background:'#E2E8F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>👤</div>}
                                                <div>
                                                   <div style={{fontWeight: 900, color: '#1E293B', fontSize: '14px'}}>@{targetUser.username || 'anonim'}</div>
                                                   <div style={{fontSize: '12px', color: '#64748B'}}>{targetUser.name || 'Mutfak Gurmesi'}</div>
                                                </div>
                                            </div>
                                            <button onClick={() => handleFollow(uid, isFollowing, targetUser.isPrivate, isRequested)} style={{background: isFollowing ? '#E2E8F0' : isRequested ? '#F59E0B' : '#8B5CF6', color: isFollowing ? '#64748B' : 'white', padding: '7px 13px', borderRadius: '20px', border: 'none', fontWeight: 800, fontSize: '12px', cursor: 'pointer'}}>
                                                {isFollowing ? 'Takipten Çık' : isRequested ? 'İstek Gönderildi' : 'Takip Et +'}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* FOTOĞRAF BÜYÜTME MODALI */}
           {enlargedPhoto && (
               <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}} onClick={() => setEnlargedPhoto(null)}>
                   <div style={{position: 'relative', maxWidth: '90%', maxHeight: '90%'}}>
                       <button onClick={() => setEnlargedPhoto(null)} style={{position: 'absolute', top: '-40px', right: '0', background: 'transparent', color: 'white', fontSize: '30px', border: 'none', cursor: 'pointer', fontWeight: 800}}>✕</button>
                       <PinchZoomImage 
   src={getHighResPhotoUrl(enlargedPhoto)} 
   alt="enlarged" 
   badgeText="✌️ İki Parmakla Büyüt / Çift Dokun"
   style={{width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'}} 
/>
                   </div>
               </div>
           )}

           {/* ALT ALT-MENÜ (SUB-NAVBAR) */}
           <div style={{position: 'fixed', bottom: '0px', left: '0', right: '0', margin: '0 auto', maxWidth: '600px', zIndex: 90, display:'flex', justifyContent:'space-around', padding:'8px 4px', background: (subTab === 'FEED' && feedMode === 'WATCH') ? 'rgba(15, 23, 42, 0.95)' : 'white', backdropFilter: 'blur(12px)', borderTop: (subTab === 'FEED' && feedMode === 'WATCH') ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'background 0.3s ease'}}>
                <button onClick={()=>{ setSubTab('FEED'); setFeedMode('WATCH'); }} style={{background: (subTab==='FEED' && feedMode==='WATCH') ? '#3B82F6':'transparent', color: (subTab==='FEED' && feedMode==='WATCH') ? 'white' : '#64748B', border:'none', padding:'8px 6px', borderRadius:'10px', fontWeight:700, fontSize:'11px', flex: 1, margin: '0 1px', cursor: 'pointer'}}>🎬 Keşfet</button>
                <button onClick={()=>setSubTab('MATCH')} style={{background: subTab==='MATCH' ? '#EC4899':'transparent', color: subTab==='MATCH'?'white':'#64748B', border:'none', padding:'8px 6px', borderRadius:'10px', fontWeight:700, fontSize:'11px', flex: 1, margin: '0 1px', cursor: 'pointer'}}>👥 Match</button>
                <button onClick={()=>setSubTab('BADGES')} style={{background: subTab==='BADGES' ? '#F59E0B':'transparent', color: subTab==='BADGES'?'white':'#64748B', border:'none', padding:'8px 6px', borderRadius:'10px', fontWeight:700, fontSize:'11px', flex: 1, margin: '0 1px', cursor: 'pointer'}}>🏆 Rozet</button>
                <button onClick={()=>setSubTab('CHAT')} style={{background: subTab==='CHAT' ? '#10B981':'transparent', color: subTab==='CHAT'?'white':'#64748B', border:'none', padding:'8px 6px', borderRadius:'10px', fontWeight:700, fontSize:'11px', flex: 1, margin: '0 1px', cursor: 'pointer'}}>💬 Sohbet</button>
                <button onClick={()=>setSubTab('MY_PROFILE')} style={{background: subTab==='MY_PROFILE' ? '#6366F1':'transparent', color: subTab==='MY_PROFILE'?'white':'#64748B', border:'none', padding:'8px 6px', borderRadius:'10px', fontWeight:700, fontSize:'11px', flex: 1, margin: '0 1px', cursor: 'pointer'}}>👤 Profil</button>
                <button onClick={()=>setSubTab('UPLOAD')} style={{background: subTab==='UPLOAD' ? '#8B5CF6':'transparent', color: subTab==='UPLOAD'?'white':'#64748B', border:'none', padding:'8px 6px', borderRadius:'10px', fontWeight:700, fontSize:'11px', flex: 1, margin: '0 1px', cursor: 'pointer'}}>📸 Yükle</button>
            </div>
        </div>
    );
}

