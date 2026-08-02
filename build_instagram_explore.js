const fs = require('fs');
const path = require('path');

const socialPath = path.join(__dirname, 'src', 'SocialFlow.js');
let content = fs.readFileSync(socialPath, 'utf8').replace(/\r\n/g, '\n');

// Replace renderFeedScreen and state management for comments & modal post
const newFeedAndCommentCode = `
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

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            visiblePosts = visiblePosts.filter(p => 
                (p.caption || '').toLowerCase().includes(q) ||
                (p.username || '').toLowerCase().includes(q) ||
                (p.userName || '').toLowerCase().includes(q)
            );
        }

        return (
            <div className="feed-container" style={{display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '70px'}}>
                {/* İNSTAGRAM KEŞFET ÜST KONTROL BARI */}
                <div style={{padding: '10px 0', borderBottom: '1px solid #E2E8F0', marginBottom: '10px', background: 'white'}}>
                    <div style={{display: 'flex', gap: '8px', marginBottom: '10px'}}>
                        <input 
                            type="text" 
                            placeholder="🔍 Keşfet'te Tarif veya Şef Ara..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{flex: 1, padding: '10px 14px', borderRadius: '20px', background: '#F1F5F9', border: '1px solid #E2E8F0', outline: 'none', fontSize: '13px', fontWeight: 600}}
                        />
                    </div>
                    
                    <div style={{display: 'flex', background: '#F8FAFC', borderRadius: '12px', padding: '3px', border: '1px solid #E2E8F0'}}>
                        <button 
                            onClick={() => setViewMode('GRID')} 
                            style={{flex: 1, padding: '8px', borderRadius: '10px', border: 'none', background: viewMode === 'GRID' ? 'white' : 'transparent', color: viewMode === 'GRID' ? '#3B82F6' : '#64748B', fontWeight: 900, fontSize: '13px', cursor: 'pointer', boxShadow: viewMode === 'GRID' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}
                        >
                            📱 Izgara (Instagram)
                        </button>
                        <button 
                            onClick={() => setViewMode('REELS')} 
                            style={{flex: 1, padding: '8px', borderRadius: '10px', border: 'none', background: viewMode === 'REELS' ? 'white' : 'transparent', color: viewMode === 'REELS' ? '#EC4899' : '#64748B', fontWeight: 900, fontSize: '13px', cursor: 'pointer', boxShadow: viewMode === 'REELS' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}
                        >
                            🎬 Dikey Reel Akışı
                        </button>
                    </div>
                </div>

                {visiblePosts.length === 0 ? (
                    <div style={{textAlign: 'center', margin: '40px 20px', color: '#64748B'}}>
                        <div style={{fontSize: '40px', marginBottom: '10px'}}>📷</div>
                        <div style={{fontWeight: 800, fontSize: '16px'}}>Henüz gösterilecek gönderi yok.</div>
                        <div style={{fontSize: '13px', marginTop: '5px'}}>İlk paylaşımı yaparak mutfağını ilham yap!</div>
                    </div>
                ) : viewMode === 'GRID' ? (
                    /* 📱 INSTAGRAM 3'LÜ IZGARA (EXPLORE GRID) */
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', margin: '0 -15px'}}>
                        {visiblePosts.map(post => {
                            const isLikedByMe = post.likes?.includes(activeUser.uid);
                            const hasMultiple = post.images && post.images.length > 1;
                            const isVideo = !!post.videoURL;
                            const coverImg = post.images?.[0] || post.userPhoto;

                            return (
                                <div 
                                    key={post.id} 
                                    onClick={() => setSelectedPostModal(post)} 
                                    style={{aspectRatio: '1/1', background: '#0F172A', position: 'relative', cursor: 'pointer', overflow: 'hidden'}}
                                >
                                    {post.images && post.images.length > 0 ? (
                                        <img src={getHighResPhotoUrl(coverImg)} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                    ) : isVideo ? (
                                        <video src={post.videoURL} style={{width: '100%', height: '100%', objectFit: 'cover'}} muted />
                                    ) : (
                                        <div style={{width: '100%', height: '100%', background: 'linear-gradient(135deg, #1E293B, #0F172A)'}} />
                                    )}

                                    {/* Rozetler */}
                                    <div style={{position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '6px', padding: '2px 5px', fontSize: '10px', fontWeight: 800}}>
                                        {isVideo ? '🎥' : hasMultiple ? ('📷 ' + post.images.length) : ''}
                                    </div>

                                    {/* Beğeni & Yorum Rozeti */}
                                    <div style={{position: 'absolute', bottom: '5px', left: '5px', display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '10px', color: 'white', fontSize: '10px', fontWeight: 800}}>
                                        <span>❤️ {post.likes?.length || 0}</span>
                                        <span>💬 {post.comments?.length || 0}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* 🎬 DIKEY REEL AKIŞI (REELS STREAM) */
                    <div className="feed-scroll-container" style={{overflowY: 'scroll', scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch', margin: '0 -15px', background: '#000000', flex: 1, height: 'calc(100vh - 160px)'}}>
                        {visiblePosts.map(post => {
                            const isLikedByMe = post.likes?.includes(activeUser.uid);
                            return (
                                <div key={post.id} style={{scrollSnapAlign: 'start', scrollSnapStop: 'always', height: 'calc(100vh - 160px)', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000000'}}>
                                     {post.images && post.images.length > 0 ? (
                                          <div style={{display: 'flex', width: '100%', height: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory'}}>
                                              {post.images.map((imgUrl, i) => (
                                                  <div key={i} style={{minWidth: '100%', width: '100%', flexShrink: 0, height: '100%', scrollSnapAlign: 'center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                      <img src={getHighResPhotoUrl(imgUrl)} alt="post" onClick={() => setEnlargedPhoto(getHighResPhotoUrl(imgUrl))} style={{width: '100%', height: '100%', objectFit: 'contain', background: '#000000', cursor: 'zoom-in'}} />
                                                      <div style={{position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 900}}>
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
                                     
                                     {/* Profil & Caption */}
                                     <div style={{position: 'absolute', bottom: '25px', left: '15px', right: '70px', color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.8)', zIndex: 5}}>
                                         <div style={{fontWeight: 900, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>
                                             <div onClick={() => {
                                                  const pOwner = allUsers.find(u => u.id === post.userId) || {id: post.userId, username: post.username, name: post.userName, photoURL: post.userPhoto};
                                                  openProfile(pOwner);
                                              }} style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                                                {post.userPhoto ? <img src={getHighResPhotoUrl(post.userPhoto)} alt="p" style={{width:'35px', height:'35px', borderRadius:'50%'}} /> : <span style={{fontSize:'24px'}}>👤</span>}
                                                @{post.username || (post.userName||'').replace(/\\s+/g, '')}
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
                                         <div style={{fontSize: '13px', marginTop: '8px', lineHeight: '1.4'}}>{post.caption}</div>
                                     </div>

                                     {/* Sağ Aksiyon Butonları (Beğeni + Yorum) */}
                                     <div style={{position: 'absolute', bottom: '35px', right: '15px', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center', zIndex: 5}}>
                                         {/* Beğeni */}
                                         <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'}} onClick={async () => {
                                               const pRef = doc(db, 'posts', post.id);
                                               if (isLikedByMe) {
                                                   await updateDoc(pRef, { likes: arrayRemove(activeUser.uid) });
                                               } else {
                                                   await updateDoc(pRef, { likes: arrayUnion(activeUser.uid) });
                                                   if (post.userId !== activeUser.uid) {
                                                       const targetUserRef = doc(db, 'users', post.userId);
                                                       await updateDoc(targetUserRef, {
                                                           notifications: arrayUnion({
                                                               id: Date.now().toString(),
                                                               type: 'LIKE',
                                                               text: '@' + (activeUser.username || 'Bir şef') + ' gönderinizi beğendi!',
                                                               timestamp: Date.now()
                                                           })
                                                       });
                                                   }
                                               }
                                         }}>
                                             <span style={{fontSize: '28px', filter: isLikedByMe ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'}}>{isLikedByMe ? '❤️' : '🤍'}</span>
                                             <span style={{color: 'white', fontSize: '12px', fontWeight: 800}}>{post.likes?.length || 0}</span>
                                         </div>

                                         {/* Yorum Butonu 💬 */}
                                         <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'}} onClick={() => setCommentDrawerPost(post)}>
                                             <span style={{fontSize: '26px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'}}>💬</span>
                                             <span style={{color: 'white', fontSize: '12px', fontWeight: 800}}>{post.comments?.length || 0}</span>
                                         </div>

                                         {/* Detay Aç 🔍 */}
                                         <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'}} onClick={() => setSelectedPostModal(post)}>
                                             <span style={{fontSize: '24px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'}}>🔍</span>
                                             <span style={{color: 'white', fontSize: '11px', fontWeight: 700}}>İncele</span>
                                         </div>
                                     </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 📱 İNSTAGRAM GÖNDERİ DETAY MODALI */}
                {selectedPostModal && (
                    <div 
                        style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px', backdropFilter: 'blur(8px)'}}
                        onClick={() => setSelectedPostModal(null)}
                    >
                        <div 
                            style={{background: 'white', width: '100%', maxWidth: '500px', maxHeight: '90vh', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative'}}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Üst Profil Başlığı */}
                            <div style={{padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', background: 'white'}}>
                                <div onClick={() => { setSelectedPostModal(null); openProfile(allUsers.find(u => u.id === selectedPostModal.userId) || {id: selectedPostModal.userId, username: selectedPostModal.username, name: selectedPostModal.userName, photoURL: selectedPostModal.userPhoto}); }} style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                                    {selectedPostModal.userPhoto ? <img src={getHighResPhotoUrl(selectedPostModal.userPhoto)} alt="" style={{width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover'}} /> : <div style={{width: '38px', height: '38px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>👤</div>}
                                    <div>
                                        <div style={{fontWeight: 900, color: '#1E293B', fontSize: '14px'}}>@{selectedPostModal.username || selectedPostModal.userName}</div>
                                        <div style={{fontSize: '11px', color: '#64748B'}}>{selectedPostModal.userName}</div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedPostModal(null)} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748B', fontWeight: 800}}>✕</button>
                            </div>

                            {/* Görsel / Video Alanı */}
                            <div style={{background: '#090D16', position: 'relative', flexShrink: 0, maxHeight: '55vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                {selectedPostModal.images && selectedPostModal.images.length > 0 ? (
                                    <PinchZoomImage 
                                        src={getHighResPhotoUrl(selectedPostModal.images[0])} 
                                        alt="post"
                                        style={{width: '100%', height: 'auto', maxHeight: '55vh', objectFit: 'contain'}}
                                    />
                                ) : (
                                    <video src={selectedPostModal.videoURL} controls style={{width: '100%', maxHeight: '55vh', objectFit: 'contain'}} />
                                )}
                            </div>

                            {/* İntibak Butonları (Beğeni, Yorum, Paylaş) */}
                            <div style={{padding: '12px 16px', display: 'flex', gap: '15px', alignItems: 'center', borderBottom: '1px solid #F1F5F9'}}>
                                <button 
                                    onClick={async () => {
                                        const isLiked = selectedPostModal.likes?.includes(activeUser.uid);
                                        const pRef = doc(db, 'posts', selectedPostModal.id);
                                        if (isLiked) {
                                            await updateDoc(pRef, { likes: arrayRemove(activeUser.uid) });
                                            setSelectedPostModal({...selectedPostModal, likes: (selectedPostModal.likes||[]).filter(id => id !== activeUser.uid)});
                                        } else {
                                            await updateDoc(pRef, { likes: arrayUnion(activeUser.uid) });
                                            setSelectedPostModal({...selectedPostModal, likes: [...(selectedPostModal.likes||[]), activeUser.uid]});
                                        }
                                    }}
                                    style={{background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}
                                >
                                    {selectedPostModal.likes?.includes(activeUser.uid) ? '❤️' : '🤍'}
                                    <span style={{fontSize: '13px', fontWeight: 800, color: '#334155'}}>{selectedPostModal.likes?.length || 0}</span>
                                </button>

                                <button 
                                    onClick={() => setCommentDrawerPost(selectedPostModal)}
                                    style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}
                                >
                                    💬
                                    <span style={{fontSize: '13px', fontWeight: 800, color: '#334155'}}>{selectedPostModal.comments?.length || 0} Yorum</span>
                                </button>
                            </div>

                            {/* Açıklama & Yorumlar Özeti */}
                            <div style={{padding: '12px 16px', overflowY: 'auto', flex: 1}}>
                                {selectedPostModal.caption && (
                                    <div style={{fontSize: '14px', color: '#1E293B', lineHeight: '1.4', marginBottom: '10px'}}>
                                        <b>@{selectedPostModal.username || selectedPostModal.userName}</b> {selectedPostModal.caption}
                                    </div>
                                )}

                                <div 
                                    onClick={() => setCommentDrawerPost(selectedPostModal)} 
                                    style={{color: '#3B82F6', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginTop: '5px'}}
                                >
                                    {(selectedPostModal.comments?.length || 0) > 0 ? \`Tüm \${selectedPostModal.comments.length} yorumu gör / yaz...\` : 'İlk yorumu sen yaz... ✍️'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 💬 YORUMLAR MODALI (COMMENT DRAWER) */}
                {commentDrawerPost && (
                    <div 
                        style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(5px)'}}
                        onClick={() => setCommentDrawerPost(null)}
                    >
                        <div 
                            style={{background: 'white', width: '100%', maxWidth: '500px', height: '75vh', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 -10px 30px rgba(0,0,0,0.2)'}}
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
                                        return (
                                            <div key={c.id || Math.random()} style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                                                {c.userPhoto ? <img src={getHighResPhotoUrl(c.userPhoto)} alt="" style={{width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover'}} /> : <div style={{width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>👤</div>}
                                                <div style={{background: '#F8FAFC', padding: '10px 14px', borderRadius: '16px', flex: 1, border: '1px solid #F1F5F9'}}>
                                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                                                        <span style={{fontWeight: 800, fontSize: '13px', color: '#1E293B'}}>@{c.username || c.userName}</span>
                                                        <span style={{fontSize: '10px', color: '#94A3B8'}}>{cTime}</span>
                                                    </div>
                                                    <div style={{fontSize: '13px', color: '#334155', lineHeight: '1.4'}}>{c.text}</div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Yorum Yazma Alanı */}
                            <div style={{display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid #E2E8F0'}}>
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
`;

const startFeed = content.indexOf('const renderFeedScreen = () => {');
const startNotifications = content.indexOf('const renderNotificationsScreen = () => {');

content = content.slice(0, startFeed) + newFeedAndCommentCode + '\n\n' + content.slice(startNotifications);

fs.writeFileSync(socialPath, content, 'utf8');
console.log('SocialFlow.js successfully converted to authentic Instagram Explore experience!');
