import React, { useState, useEffect } from 'react';
import { db, auth, storage } from './firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

export default function SocialFlow({ activeUser, setActiveUser }) {
   const [subTab, setSubTab] = useState('FOLLOW'); // FEED, CHAT, FOLLOW, UPLOAD
   const [model, setModel] = useState(null);
   const [isModelLoading, setIsModelLoading] = useState(true);

   // --- FOLLOW SİSTEMİ ALTYAPISI ---
   const [allUsers, setAllUsers] = useState([]);
   const [loadingUsers, setLoadingUsers] = useState(false);
   const [myProfile, setMyProfile] = useState(null);
   const [searchQuery, setSearchQuery] = useState("");
   const [feedMode, setFeedMode] = useState('WATCH');

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

   // --- YORUM (COMMENT) SİSTEMİ ---
   const [commentModalPost, setCommentModalPost] = useState(null);
   const [commentText, setCommentText] = useState("");

   // --- RESİM BÜYÜTMA MODALI ---
   const [enlargedPhoto, setEnlargedPhoto] = useState(null);

    useEffect(() => {
        async function loadModel() {
            try {
                const loadedModel = await mobilenet.load({version: 2, alpha: 1.0});
                setModel(loadedModel);
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

   // Sohbet Aboneliği
   useEffect(() => {
       if (selectedChatUser && activeUser?.uid) {
           const chatId = [activeUser.uid, selectedChatUser.id].sort().join('_');
           const chatQ = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp', 'asc'));
           const unSubChat = onSnapshot(chatQ, (snap) => {
               const m = [];
               snap.forEach(d => m.push({id: d.id, ...d.data()}));
               setChatMessages(m);
           });
           return () => unSubChat();
       }
   }, [selectedChatUser, activeUser]);

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
           return alert("Yapay Zeka güvenlik modülü arka planda yükleniyor, lütfen 3-4 saniye bekleyip tekrar deneyin.");
       }
       if (!model) {
           return alert("Güvenlik Bildirimi: Yapay Zeka analiz motoru başlatılamadı. Lütfen sayfası yenileyin.");
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
                               const predictions = await model.classify(elem);
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
                           canvas.getContext('2d').drawImage(elem, 0, 0, canvas.width, canvas.height);
                           try {
                               const predictions = await model.classify(canvas);
                               finish(predictions);
                           } catch(e) { finish([]); }
                       });
                       elem.addEventListener('error', () => finish([]));
                   }
               });
           };

           const predictions = await processMedia();
           
           const FOOD_TERMS = ['food', 'plate', 'dish', 'cup', 'fruit', 'vegetable', 'meat', 'cake', 'bread', 'bowl', 'pot', 'pan', 'bottle', 'pizza', 'hamburger', 'hotdog', 'ice cream', 'strawberry', 'apple', 'banana', 'orange', 'broccoli', 'carrot', 'sandwich', 'hot pot', 'bakery', 'restaurant', 'coffee', 'espresso', 'tea', 'menu', 'soup', 'salad', 'dining table', 'wine', 'beer', 'sauce', 'cookie', 'dough', 'spoon', 'fork', 'kitchen', 'recipe', 'meal', 'drink', 'pudding', 'confectionery', 'cheese', 'grocery', 'produce'];

           const isFoodRelated = predictions.some(p => {
               return FOOD_TERMS.some(t => p.className.toLowerCase().includes(t));
           });

           if (!isFoodRelated) {
               console.log("Model Algılaması Engellendi:", predictions);
               const confirmBypass = window.confirm("Güvenlik Bildirimi: Yapay Zeka analizine göre bu içerik tam olarak yemek/mutfak ile eşleşmedi (veya henüz başında).\n\nSadece yemek fotoğrafı veya videosu gönderebilirsiniz. İçeriğin kesinlikle mutfak/yemek ile ilgili olduğunu onaylıyor musunuz?");
               if (!confirmBypass) {
                   setUploading(false);
                   return;
               }
               // Kullanıcı onaylarsa yükleme devam eder.
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
        try {
            const chatId = [activeUser.uid, selectedChatUser.id].sort().join('_');
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
                    <p style={{fontSize: '13px', color: '#64748B', fontWeight: 600}}>@{activeUser.username}</p>
                    
                    <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px'}}>
                        <div>
                            <div style={{fontSize: '18px', fontWeight: 800, color: '#1E293B'}}>{(myProfile?.followers || []).filter(userExists).length}</div>
                            <div style={{fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700}}>Takipçi</div>
                        </div>
                        <div>
                            <div style={{fontSize: '18px', fontWeight: 800, color: '#1E293B'}}>{(myProfile?.follows || []).filter(userExists).length}</div>
                            <div style={{fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700}}>Takip</div>
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
                </div>
                
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

   const renderFeedScreen = () => {
       // Gizlilik Filtresi
       let visiblePosts = feedPosts.filter(p => {
           if (p.userId === activeUser.uid) return true; // Kendi içeriğimiz görünür
           const postOwner = allUsers.find(u => u.id === p.userId);
           if (!postOwner) return true;
           if (myProfile?.blocked?.includes(postOwner.id)) return false;
           if (postOwner.blocked?.includes(activeUser.uid)) return false;
           if (postOwner.isPrivate && !(myProfile?.follows?.includes(postOwner.id))) return false; // Takip etmediğimiz gizli hesap görünmez
           return true; 
       });
       
       if (feedMode === 'LIKED') {
           visiblePosts = visiblePosts.filter(p => p.likes?.includes(activeUser.uid));
       }

       return (
       <div className="feed-container" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
           <div style={{display: 'flex', gap: '10px', marginBottom: '10px', padding: '5px', background: '#F1F5F9', borderRadius: '12px'}}>
               <button onClick={() => setFeedMode('WATCH')} style={{flex: 1, padding: '8px', background: feedMode === 'WATCH' ? 'white' : 'transparent', color: feedMode === 'WATCH' ? '#3B82F6' : '#64748B', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: feedMode === 'WATCH' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: '0.2s'}}>📺 İzle</button>
               <button onClick={() => setFeedMode('SEARCH')} style={{flex: 1, padding: '8px', background: feedMode === 'SEARCH' ? 'white' : 'transparent', color: feedMode === 'SEARCH' ? '#8B5CF6' : '#64748B', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: feedMode === 'SEARCH' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: '0.2s'}}>🔍 Şef Bul</button>
               <button onClick={() => setFeedMode('LIKED')} style={{flex: 1, padding: '8px', background: feedMode === 'LIKED' ? 'white' : 'transparent', color: feedMode === 'LIKED' ? '#EC4899' : '#64748B', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: feedMode === 'LIKED' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: '0.2s'}}>❤️ Beğeniler</button>
           </div>
           
           {feedMode === 'SEARCH' ? (
               <div style={{flex: 1, overflowY: 'auto', paddingBottom: '20px'}}>
                   <input 
                       type="text" 
                       placeholder="👤 Dünya genelinde Şef Ara..." 
                       value={searchQuery} 
                       onChange={(e) => setSearchQuery(e.target.value)}
                       style={{width: '100%', padding: '12px 15px', borderRadius: '12px', background: 'white', border: '1px solid #E2E8F0', outline: 'none', color: '#334155', marginBottom: '15px'}}
                   />
                   {allUsers.filter(u => u.id !== activeUser.uid && ((u.username||'').toLowerCase().includes(searchQuery.toLowerCase()) || (u.name||'').toLowerCase().includes(searchQuery.toLowerCase()))).map(u => {
                       if (myProfile?.blocked?.includes(u.id)) return null;
                       if (u.blocked?.includes(activeUser.uid)) return null;
                       const isFollowing = myProfile?.follows?.includes(u.id);
                       const isRequested = u.requests?.includes(activeUser.uid);
                       return (
                           <div key={u.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'white', borderRadius: '16px', marginBottom: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)'}}>
                               <div onClick={() => openProfile(u)} style={{display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer'}}>
                                   {u.photoURL ? <img src={u.photoURL} onClick={(e) => { e.stopPropagation(); setEnlargedPhoto(u.photoURL) }} style={{width:'50px', height:'50px', borderRadius:'50%', objectFit: 'cover', cursor: 'zoom-in'}} /> : <div style={{width:'50px',height:'50px',borderRadius:'50%',background:'#F1F5F9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px'}}>👤</div>}
                                   <div style={{fontWeight: 800, color: '#334155'}}>@{u.username}</div>
                               </div>
                               <button onClick={() => handleFollow(u.id, isFollowing, u.isPrivate, isRequested)} style={{background: isFollowing ? '#E2E8F0' : isRequested ? '#F59E0B' : '#8B5CF6', color: isFollowing ? '#64748B' : 'white', padding: '8px 16px', borderRadius: '20px', border: 'none', fontWeight: 800, cursor: 'pointer', transition: '0.2s'}}>
                                   {isFollowing ? 'Takibi Bırak' : isRequested ? 'İstek Gönderildi' : 'Takip Et'}
                               </button>
                           </div>
                       )
                   })}
               </div>
           ) : (
               <div style={{overflowY: 'scroll', scrollSnapType: 'y mandatory', margin: '0 -15px', background: 'black', flex: 1, paddingBottom: '70px'}}>
                   {visiblePosts.length === 0 ? (
                       <div style={{textAlign: 'center', margin: '30px 20px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>Henüz hiçbir gönderi paylaşılmamış. İlk paylaşan şef sen ol!</div>
                   ) : (
                       visiblePosts.map(post => {
                           const isLikedByMe = post.likes?.includes(activeUser.uid);
                           return (
                               <div key={post.id} style={{scrollSnapAlign: 'start', height: 'calc(100vh - 130px)', width: '100%', position: 'relative', overflow: 'hidden'}}>
                            {post.images && post.images.length > 0 ? (
                                 <div style={{display: 'flex', width: '100%', height: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory'}}>
                                     {post.images.map((imgUrl, i) => (
                                         <div key={i} style={{minWidth: '100vw', height: '100%', scrollSnapAlign: 'center', position: 'relative'}}>
                                             <img src={imgUrl} alt="post" style={{width: '100%', height: '100%', objectFit: 'contain', background: 'black'}} />
                                             <div style={{position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '8px 15px', borderRadius: '15px', fontSize: '14px', fontWeight: 900}}>
                                                 {i + 1} / {post.images.length}
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             ) : (
                                 <video 
                                     src={post.videoURL} 
                                     controls 
                                     playsInline 
                                     style={{width: '100%', height: '100%', objectFit: 'contain', background: 'black'}} 
                                 />
                             )}
                            
                            <div style={{position: 'absolute', bottom: '25px', left: '15px', right: '70px', color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.8)', zIndex: 5}}>
                                <div style={{fontWeight: 900, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>
                                    <div onClick={() => {
                                         const pOwner = allUsers.find(u => u.id === post.userId) || {id: post.userId, username: post.username, name: post.userName, photoURL: post.userPhoto};
                                         openProfile(pOwner);
                                     }} style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                                       {post.userPhoto ? <img src={post.userPhoto} alt="p" style={{width:'35px', height:'35px', borderRadius:'50%'}} /> : <span style={{fontSize:'24px'}}>👤</span>}
                                       @{post.username || post.userName.replace(/\s+/g, '')}
                                    </div>
                                    
                                    {post.userId !== activeUser.uid && (
                                        <button 
                                            onClick={() => handleFollow(post.userId, myProfile?.follows?.includes(post.userId))}
                                            style={{
                                                padding: '4px 12px', borderRadius: '15px', border: '1px solid white', 
                                                background: myProfile?.follows?.includes(post.userId) ? 'transparent' : '#EC4899', 
                                                color: 'white', fontWeight: 800, fontSize: '12px', cursor: 'pointer', transition: '0.2s', marginLeft: '5px'
                                            }}>
                                            {myProfile?.follows?.includes(post.userId) ? '✓ Takipte' : 'Takip Et +'}
                                        </button>
                                    )}
                                </div>
                                <div style={{fontSize: '14px', marginTop: '10px', lineHeight: '1.4'}}>{post.caption}</div>
                            </div>

                            <div style={{position: 'absolute', bottom: '35px', right: '15px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', zIndex: 5}}>
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'}} onClick={async () => {
                                      const pRef = doc(db, 'posts', post.id);
                                      if (isLikedByMe) {
                                          await updateDoc(pRef, { likes: arrayRemove(activeUser.uid) });
                                      } else {
                                          await updateDoc(pRef, { likes: arrayUnion(activeUser.uid) });
                                          if (post.userId !== activeUser.uid) {
                                              const nMsg = `${activeUser.name || activeUser.username || "Bir şef"} adlı şef videonuzu beğendi.`;
                                              const newNotif = { id: Date.now().toString(), text: nMsg, type: 'LIKE', fromId: activeUser.uid, timestamp: Date.now() };
                                              await updateDoc(doc(db, 'users', post.userId), { notifications: arrayUnion(newNotif) });
                                          }
                                      }
                                }}>
                                    <div style={{width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: isLikedByMe ? '#EC4899' : 'white'}}>
                                       {isLikedByMe ? '❤️' : '🤍'}
                                    </div>
                                    <span style={{color: 'white', fontSize: '12px', marginTop: '5px', fontWeight: 600, textShadow: '0 1px 2px black'}}>{post.likes?.length || 0}</span>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'}} onClick={() => {
                                      setCommentModalPost(post);
                                      setCommentText('');
                                }}>
                                    <div style={{width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white'}}>
                                       💬
                                    </div>
                                    <span style={{color: 'white', fontSize: '12px', marginTop: '5px', fontWeight: 600, textShadow: '0 1px 2px black'}}>{post.comments?.length || 0}</span>
                                </div>
                            </div>
                       </div>
                   )
               })
           )}
               </div>
           )}

           {/* YORUM MODALI */}
           {commentModalPost && (
               <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}} onClick={() => setCommentModalPost(null)}>
                   <div style={{background: 'white', width: '100%', maxWidth: '500px', height: '60vh', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', display: 'flex', flexDirection: 'column', padding: '20px'}} onClick={e => e.stopPropagation()}>
                       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px'}}>
                           <h3 style={{margin: 0, fontSize: '18px', color: '#1E293B', fontWeight: 900}}>Yorumlar ({commentModalPost.comments?.length || 0})</h3>
                           <button onClick={() => setCommentModalPost(null)} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748B'}}>✕</button>
                       </div>
                       
                       <div style={{flex: 1, overflowY: 'auto', marginBottom: '15px'}}>
                           {(!commentModalPost.comments || commentModalPost.comments.length === 0) ? (
                               <div style={{textAlign: 'center', color: '#94A3B8', marginTop: '40px'}}>İlk yorumu siz yapın!</div>
                           ) : (
                               [...commentModalPost.comments].map((c, idx) => (
                                   <div key={idx} style={{display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'flex-start'}}>
                                       {c.photoURL ? <img src={c.photoURL} alt="" style={{width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover'}} /> : <div style={{width: '35px', height: '35px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'}}>👤</div>}
                                       <div style={{flex: 1}}>
                                           <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                               <span style={{fontWeight: 800, fontSize: '14px', color: '#334155'}}>@{c.username}</span>
                                               <span style={{fontSize: '11px', color: '#94A3B8'}}>{new Date(c.timestamp).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}</span>
                                           </div>
                                           <div style={{fontSize: '14px', color: '#1E293B', marginTop: '2px'}}>{c.text}</div>
                                       </div>
                                   </div>
                               ))
                           )}
                       </div>
                       
                       <div style={{display: 'flex', gap: '10px'}}>
                           <input 
                               type="text" 
                               value={commentText} 
                               onChange={e => setCommentText(e.target.value)} 
                               onKeyDown={async e => {
                                   if (e.key === 'Enter' && commentText.trim() && activeUser?.uid) {
                                       const pRef = doc(db, 'posts', commentModalPost.id);
                                       const newComment = {
                                           userId: activeUser.uid,
                                           username: activeUser.username || 'anonim',
                                           photoURL: activeUser.photoURL || '',
                                           text: commentText.trim(),
                                           timestamp: Date.now()
                                       };
                                       await updateDoc(pRef, { comments: arrayUnion(newComment) });
                                       
                                       // Eğer modal açıkken canlı güncellemeyi Modal'da görmek için manuel ekleyelim (onSnapshot feedPosts'u güncelleyecek zaten ama modal için anlık state override iyi olur)
                                       setCommentModalPost({...commentModalPost, comments: [...(commentModalPost.comments||[]), newComment]});
                                       setCommentText('');

                                       if (commentModalPost.userId !== activeUser.uid) {
                                           const nMsg = `${activeUser.name || activeUser.username || "Bir şef"} gönderinize yorum yaptı: "${commentText.trim().substring(0, 20)}..."`;
                                           const newNotif = { id: Date.now().toString(), text: nMsg, type: 'COMMENT', fromId: activeUser.uid, timestamp: Date.now() };
                                           await updateDoc(doc(db, 'users', commentModalPost.userId), { notifications: arrayUnion(newNotif) });
                                       }
                                   }
                               }}
                               placeholder={activeUser?.uid ? "Yorumunuzu yazın..." : "Giriş yapmanız gerekiyor."} 
                               disabled={!activeUser?.uid}
                               style={{flex: 1, padding: '12px 15px', border: '1px solid #E2E8F0', borderRadius: '20px', outline: 'none', background: '#F8FAFC'}} 
                           />
                           <button 
                               onClick={async () => {
                                   if (commentText.trim() && activeUser?.uid) {
                                       const pRef = doc(db, 'posts', commentModalPost.id);
                                       const newComment = {
                                           userId: activeUser.uid,
                                           username: activeUser.username || 'anonim',
                                           photoURL: activeUser.photoURL || '',
                                           text: commentText.trim(),
                                           timestamp: Date.now()
                                       };
                                       await updateDoc(pRef, { comments: arrayUnion(newComment) });
                                       
                                       setCommentModalPost({...commentModalPost, comments: [...(commentModalPost.comments||[]), newComment]});
                                       setCommentText('');

                                       if (commentModalPost.userId !== activeUser.uid) {
                                           const nMsg = `${activeUser.name || activeUser.username || "Bir şef"} gönderinize yorum yaptı: "${commentText.trim().substring(0, 20)}..."`;
                                           const newNotif = { id: Date.now().toString(), text: nMsg, type: 'COMMENT', fromId: activeUser.uid, timestamp: Date.now() };
                                           await updateDoc(doc(db, 'users', commentModalPost.userId), { notifications: arrayUnion(newNotif) });
                                       }
                                   }
                               }} 
                               disabled={!activeUser?.uid || !commentText.trim()}
                               style={{background: '#3B82F6', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}
                           >
                               ➤
                           </button>
                       </div>
                   </div>
               </div>
           )}
       </div>
       );
   };

    const renderProfileScreen = () => {
        if (!selectedProfileUser) return null;
        if (selectedProfileUser.blocked?.includes(activeUser.uid)) {
            return <div style={{padding: '50px 20px', textAlign: 'center', color: '#64748B', fontWeight: 800}}><div style={{fontSize: '40px', marginBottom: '10px'}}>🚫</div>Bu profili görüntüleyemezsiniz. <br/><button onClick={()=>setSubTab('FEED')} style={{marginTop:'15px', padding:'8px 15px', borderRadius:'8px', border:'none', background:'#3B82F6', color:'white', cursor:'pointer'}}>Geri Dön</button></div>;
        }

        const isMe = selectedProfileUser.id === activeUser.uid;
        const isBlockedByMe = myProfile?.blocked?.includes(selectedProfileUser.id);
        const userPosts = feedPosts.filter(p => p.userId === selectedProfileUser.id);
        const isFollowing = myProfile?.follows?.includes(selectedProfileUser.id);
        const isPrivate = selectedProfileUser.isPrivate;
        const isRequested = selectedProfileUser.requests?.includes(activeUser.uid);
        const canSeePosts = (isMe || !isPrivate || isFollowing) && !isBlockedByMe;
        const userExists = (uid) => uid === activeUser?.uid || allUsers.some(u => u.id === uid);
        
        return (
            <div style={{padding: '10px 0'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
                    <button onClick={() => setSubTab('FEED')} style={{background: '#E2E8F0', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, color: '#64748B'}}>← Geri</button>
                    <div style={{fontWeight: 900, color: '#1E293B', fontSize: '20px'}}>@{selectedProfileUser.username}</div>
                </div>
                
                <div style={{display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px'}}>
                    {selectedProfileUser.photoURL ? <img src={selectedProfileUser.photoURL} alt="" onClick={(e) => { e.stopPropagation(); setEnlargedPhoto(selectedProfileUser.photoURL); }} style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', cursor: 'zoom-in'}} /> : <div style={{width: '80px', height: '80px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px'}}>👤</div>}
                    
                    <div style={{flex: 1, display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
                        <div>
                            <div style={{fontWeight: 900, fontSize: '18px'}}>{userPosts.length}</div>
                            <div style={{fontSize: '12px', color: '#64748B'}}>Gönderi</div>
                        </div>
                        <div onClick={() => canSeePosts && setConnectionModal('followers')} style={{cursor: canSeePosts ? 'pointer' : 'default'}}>
                            <div style={{fontWeight: 900, fontSize: '18px'}}>{(selectedProfileUser.followers || []).filter(userExists).length}</div>
                            <div style={{fontSize: '12px', color: '#64748B'}}>Takipçi</div>
                        </div>
                        <div onClick={() => canSeePosts && setConnectionModal('follows')} style={{cursor: canSeePosts ? 'pointer' : 'default'}}>
                            <div style={{fontWeight: 900, fontSize: '18px'}}>{(selectedProfileUser.follows || []).filter(userExists).length}</div>
                            <div style={{fontSize: '12px', color: '#64748B'}}>Takip</div>
                        </div>
                    </div>
                </div>
                
                <div style={{marginBottom: '20px'}}>
                    <div style={{fontWeight: 800, color: '#1E293B', fontSize: '16px'}}>{selectedProfileUser.name}</div>
                    {selectedProfileUser.bio && <div style={{fontSize: '14px', marginTop: '5px', color: '#64748B'}}>{selectedProfileUser.bio}</div>}
                    
                    {!isMe && (
                        <div style={{display: 'flex', gap: '8px', marginTop: '15px'}}>
                            {!isBlockedByMe && (
                                <>
                                    <button onClick={() => handleFollow(selectedProfileUser.id, isFollowing, isPrivate, isRequested)} style={{flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: isFollowing ? '#E2E8F0' : (isRequested ? '#F59E0B' : '#3B82F6'), color: isFollowing ? '#64748B' : 'white', fontWeight: 800, cursor: 'pointer'}}>
                                        {isFollowing ? 'Takibi Bırak' : isRequested ? 'İstek Gönderildi' : 'Takip Et'}
                                    </button>
                                    {isFollowing && <button onClick={() => { setSubTab('CHAT'); setSelectedChatUser(selectedProfileUser); }} style={{flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#10B981', color: 'white', fontWeight: 800, cursor: 'pointer'}}>Mesaj Gönder</button>}
                                </>
                            )}
                            <button onClick={() => {
                                if(!isBlockedByMe && !window.confirm("Bu kişiyi engellemek istediğinize emin misiniz? (Tüm takipler silinir)")) return;
                                handleBlockUser(selectedProfileUser.id, isBlockedByMe);
                            }} style={{padding: '8px 12px', borderRadius: '8px', border: 'none', background: isBlockedByMe ? '#E2E8F0' : '#EF4444', color: isBlockedByMe ? '#64748B' : 'white', fontWeight: 800, cursor: 'pointer'}}>
                                {isBlockedByMe ? 'Engeli Kaldır' : 'Engelle'}
                            </button>
                        </div>
                    )}
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', margin: '0 -15px'}}>
                    {!canSeePosts ? (
                        <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#64748B'}}>
                            <div style={{fontSize: '40px', marginBottom: '10px'}}>🔒</div>
                            <div style={{fontWeight: 800}}>Bu hesap gizli.</div>
                            <div style={{fontSize: '13px'}}>İçeriklerini görmek için takip etmelisin.</div>
                        </div>
                    ) : userPosts.length === 0 ? (
                        <div style={{gridColumn: '1 / -1', padding: '50px 20px', textAlign: 'center', color: '#64748B'}}>
                            <div style={{fontSize: '40px', marginBottom: '10px'}}>🎬</div>
                            <div style={{fontWeight: 600}}>Henüz gönderi yok.</div>
                        </div>
                    ) : (
                        userPosts.sort((a,b)=>b.timestamp-a.timestamp).map(p => (
                            <div key={p.id} style={{aspectRatio: '9/16', background: 'black', position: 'relative'}}>
                                 <video src={p.videoURL} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                 <div style={{position: 'absolute', bottom: '5px', left: '5px', color: 'white', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(0,0,0,0.5)', padding: '2px 5px', borderRadius: '10px'}}>
                                     <span>❤️</span> {p.likes?.length || 0}
                                 </div>
                            </div>
                        ))
                    )}
                </div>
                
                {connectionModal && (
                    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}} onClick={() => setConnectionModal(null)}>
                        <div style={{background: 'white', width: '100%', maxWidth: '400px', borderRadius: '16px', padding: '20px', maxHeight: '70vh', display: 'flex', flexDirection: 'column'}} onClick={e => e.stopPropagation()}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                                <h3 style={{margin: 0, fontSize: '18px', color: '#1E293B', fontWeight: 900}}>{connectionModal === 'followers' ? 'Takipçiler' : 'Takip Ettikleri'}</h3>
                                <button onClick={() => setConnectionModal(null)} style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B'}}>✕</button>
                            </div>
                            <div style={{flex: 1, overflowY: 'auto'}}>
                                {(() => {
                                    const idsList = connectionModal === 'followers' ? (selectedProfileUser.followers || []) : (selectedProfileUser.follows || []);
                                    
                                    const globalUsers = [...allUsers, {id: activeUser.uid, name: activeUser.name, username: activeUser.username, photoURL: activeUser.photoURL}];
                                    const finalUsers = globalUsers.filter(u => idsList.includes(u.id));
                                    
                                    if (finalUsers.length === 0) return <div style={{textAlign: 'center', color: '#64748B', margin: '20px 0'}}>Liste boş.</div>;

                                    return finalUsers.map(u => (
                                        <div key={u.id} onClick={() => { setConnectionModal(null); openProfile(u); }} style={{display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 0', borderBottom: '1px solid #E2E8F0', cursor: 'pointer'}}>
                                            {u.photoURL ? <img src={u.photoURL} alt="" style={{width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover'}} /> : <div style={{width: '45px', height: '45px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'}}>👤</div>}
                                            <div style={{fontWeight: 800, color: '#334155'}}>@{u.username}</div>
                                        </div>
                                    ));
                                })()}
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
                       {u.photoURL ? <img src={u.photoURL} alt="" style={{width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover'}}/> : <div style={{width:'45px', height:'45px', borderRadius:'50%', background:'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px'}}>👤</div>}
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
                                    <img src={u.photoURL} alt={u.name} style={{width:'50px', height:'50px', borderRadius:'50%', objectFit: 'cover'}} />
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

   return (
       <div style={{display:'flex', flexDirection:'column', height:'calc(100vh - 80px)', width:'100%', background: '#F8FAFC'}}>
           {/* ÜST BAŞLIK */}
           <div style={{padding: '15px 20px', background: '#1E293B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
               <div style={{fontWeight: 900, fontSize: '20px'}}>🎬 Eğlence Serüveni</div>
           </div>

           {/* İÇERİK EKRANLARI */}
           <div style={{flex:1, overflowY: 'auto', padding: '0 15px', paddingBottom: '70px'}}>
               {subTab === 'MY_PROFILE' && renderMyProfileScreen()}
               {subTab === 'FEED' && renderFeedScreen()}
               {subTab === 'CHAT' && (
                  <div style={{padding: '10px 0', height: '100%', display: 'flex', flexDirection: 'column'}}>
                     {!selectedChatUser ? (
                        <>
                           <h2 style={{fontSize: '22px', color: '#1E293B', marginBottom: '5px', fontWeight: 900}}>💬 Gurme Sohbetleri</h2>
                           <p style={{fontSize: '13px', color: '#64748B', marginBottom: '20px'}}>Sadece takipleştiğiniz şeflerle anlık ve güvenli sohbet edin.</p>
                           <div style={{flex: 1, overflowY: 'auto'}}>
                              {allUsers.filter(u => myProfile?.follows?.includes(u.id)).length === 0 ? (
                                  <div style={{textAlign: 'center', margin: '30px 0', color: '#64748B'}}>Henüz kimseyi takip etmiyorsunuz. Önce topluluktan şefleri bulun!</div>
                              ) : (
                                  allUsers.filter(u => myProfile?.follows?.includes(u.id)).map(u => (
                                     <div key={u.id} onClick={() => setSelectedChatUser(u)} style={{display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'white', borderRadius: '16px', marginBottom: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)', cursor: 'pointer'}}>
                                         {u.photoURL ? <img src={u.photoURL} alt="p" style={{width:'45px', height:'45px', borderRadius:'50%', objectFit:'cover'}} /> : <div style={{width:'45px', height:'45px', borderRadius:'50%', background:'#E2E8F0', display:'flex', alignItems:'center', justifyContent:'center'}}>👤</div>}
                                         <div style={{fontWeight: '800', color: '#334155'}}>@{u.username || 'anonim'}</div>
                                     </div>
                                  ))
                              )}
                           </div>
                        </>
                     ) : (
                        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                           <div style={{display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid #E2E8F0', marginBottom: '15px'}}>
                               <button onClick={() => setSelectedChatUser(null)} style={{background: '#E2E8F0', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, color: '#64748B'}}>← Geri</button>
                               <div onClick={() => openProfile(selectedChatUser)} style={{fontWeight: 900, color: '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                   {selectedChatUser.photoURL ? <img src={selectedChatUser.photoURL} style={{width:'30px',height:'30px',borderRadius:'50%',objectFit:'cover'}}/> : <span>👤</span>}
                                   @{selectedChatUser.username || 'anonim'} <span style={{fontSize: '12px', color: '#64748B', fontWeight: 600}}>ile Sohbet</span>
                               </div>
                           </div>
                           
                           <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '10px', paddingTop: '10px'}}>
                               {chatMessages.length === 0 && <div style={{textAlign: 'center', color: '#94A3B8', marginTop: '20px'}}>İlk mesajı siz gönderin!</div>}
                               {chatMessages.map(m => {
                                   const isMe = m.senderId === activeUser.uid;
                                   const timeString = new Date(m.timestamp).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});
                                   return (
                                   <div key={m.id} style={{alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%', display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '10px', alignItems:'flex-end'}}>
                                       {!isMe && <img src={selectedChatUser?.photoURL || ''} alt="" style={{width:'28px', height:'28px', borderRadius:'50%', objectFit: 'cover', background: '#E2E8F0'}}/>}
                                       <div style={{background: isMe ? 'linear-gradient(135deg, #10B981, #059669)' : 'white', color: isMe ? 'white' : '#1E293B', padding: '12px 16px', borderRadius: '20px', borderBottomRightRadius: isMe ? '4px' : '20px', borderBottomLeftRadius: isMe ? '20px' : '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', position: 'relative'}}>
                                           <div style={{fontSize: '15px', lineHeight: '1.4'}}>{m.text}</div>
                                           <div style={{fontSize: '10px', color: isMe ? 'rgba(255,255,255,0.8)' : '#94A3B8', textAlign: isMe ? 'right' : 'left', marginTop: '6px', fontWeight: 600}}>{timeString}</div>
                                       </div>
                                   </div>
                               )})}
                           </div>
                           
                           <div style={{display: 'flex', gap: '10px', marginTop: 'auto'}}>
                               <input type="text" value={msgText} onChange={e => setMsgText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Mesaj yazın..." style={{flex: 1, padding: '12px 15px', border: '1px solid #E2E8F0', borderRadius: '20px', outline: 'none', background: '#F8FAFC'}} />
                               <button onClick={handleSendMessage} style={{background: '#3B82F6', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>➤</button>
                           </div>
                        </div>
                     )}
                  </div>
               )}
               {subTab === 'NOTIFY' && renderNotificationsScreen()}
               {subTab === 'FOLLOW' && renderFollowScreen()}
               {subTab === 'PROFILE' && renderProfileScreen()}
               
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
           
           {/* FOTOĞRAF BÜYÜTME MODALI */}
           {enlargedPhoto && (
               <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}} onClick={() => setEnlargedPhoto(null)}>
                   <div style={{position: 'relative', maxWidth: '90%', maxHeight: '90%'}}>
                       <button onClick={() => setEnlargedPhoto(null)} style={{position: 'absolute', top: '-40px', right: '0', background: 'transparent', color: 'white', fontSize: '30px', border: 'none', cursor: 'pointer', fontWeight: 800}}>✕</button>
                       <img src={enlargedPhoto} style={{width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'}} />
                   </div>
               </div>
           )}

           {/* ALT ALT-MENÜ (SUB-NAVBAR) */}
           <div style={{position: 'fixed', bottom: '75px', left: '0', right: '0', margin: '0 auto', maxWidth: '600px', zIndex: 90, display:'flex', justifyContent:'space-around', padding:'10px', background:'white', borderTop: '1px solid #E2E8F0', boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
               <button onClick={()=>setSubTab('MY_PROFILE')} style={{background: subTab==='MY_PROFILE' ? '#3B82F6':'transparent', color: subTab==='MY_PROFILE'?'white':'#64748B', border:'none', padding:'10px', borderRadius:'12px', fontWeight:600, flex: 1, margin: '0 2px', cursor: 'pointer', transition: '0.2s'}}>👤 Profil</button>
               <button onClick={()=>setSubTab('FEED')} style={{background: subTab==='FEED' ? '#3B82F6':'transparent', color: subTab==='FEED'?'white':'#64748B', border:'none', padding:'10px', borderRadius:'12px', fontWeight:600, flex: 1, margin: '0 2px', cursor: 'pointer', transition: '0.2s'}}>🌍 Keşfet</button>
               <button onClick={()=>setSubTab('CHAT')} style={{background: subTab==='CHAT' ? '#3B82F6':'transparent', color: subTab==='CHAT'?'white':'#64748B', border:'none', padding:'10px', borderRadius:'12px', fontWeight:600, flex: 1, margin: '0 2px', cursor: 'pointer', transition: '0.2s'}}>💬 Sohbet</button>
               <button onClick={()=>setSubTab('NOTIFY')} style={{position: 'relative', background: subTab==='NOTIFY' ? '#3B82F6':'transparent', color: subTab==='NOTIFY'?'white':'#64748B', border:'none', padding:'10px', borderRadius:'12px', fontWeight:600, flex: 1, margin: '0 2px', cursor: 'pointer', transition: '0.2s'}}>
                  🔔 Bildirim
                  {(myProfile?.requests?.length > 0 || myProfile?.unreadCount?.length > 0 || myProfile?.notifications?.length > 0) && (
                     <span style={{position:'absolute', top:'-5px', right:'-5px', background:'#EF4444', color:'white', borderRadius:'50%', width:'20px', height:'20px', fontSize:'11px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                        {(myProfile?.requests?.length || 0) + (myProfile?.unreadCount?.length || 0) + (myProfile?.notifications?.length || 0)}
                     </span>
                  )}
               </button>
               <button onClick={()=>setSubTab('FOLLOW')} style={{background: subTab==='FOLLOW' ? '#3B82F6':'transparent', color: subTab==='FOLLOW'?'white':'#64748B', border:'none', padding:'10px', borderRadius:'12px', fontWeight:600, flex: 1, margin: '0 2px', cursor: 'pointer', transition: '0.2s'}}>👥 Şeflerim</button>
               <button onClick={()=>setSubTab('UPLOAD')} style={{background: subTab==='UPLOAD' ? '#EC4899':'transparent', color: subTab==='UPLOAD'?'white':'#64748B', border:'none', padding:'10px', borderRadius:'12px', fontWeight:600, flex: 1, margin: '0 2px', cursor: 'pointer', transition: '0.2s'}}>🎬</button>
           </div>
        </div>
    );
}

