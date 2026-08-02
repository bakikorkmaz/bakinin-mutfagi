const fs = require('fs');
const path = require('path');

const socialPath = path.join(__dirname, 'src', 'SocialFlow.js');
let content = fs.readFileSync(socialPath, 'utf8').replace(/\r\n/g, '\n');

// Build the pure full-screen Dikey Akış component
const pureReelsCode = `
    const [commentDrawerPost, setCommentDrawerPost] = useState(null);
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

        const targetPost = feedPosts.find(p => p.id === postId);
        if (targetPost) {
            targetPost.comments = [...(targetPost.comments || []), commentObj];
            if (commentDrawerPost?.id === postId) {
                setCommentDrawerPost({...targetPost});
            }
        }

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
                {/* YUKARIDAKİ SOL GERİ DÖN BUTONU */}
                <button 
                    onClick={() => { if (onBack) onBack(); else setSubTab('MY_PROFILE'); }}
                    style={{
                        position: 'absolute', top: '20px', left: '20px', zIndex: 100000, 
                        background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)', 
                        color: 'white', border: '1px solid rgba(255, 255, 255, 0.25)', 
                        padding: '10px 18px', borderRadius: '30px', fontSize: '13px', 
                        fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', 
                        gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', transition: '0.2s'
                    }}
                >
                    ← Ana Sayfa
                </button>

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
                                                @{post.username || (post.userName||'').replace(/\\s+/g, '')}
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

content = content.slice(0, startFeed) + pureReelsCode + '\n\n' + content.slice(startNotifications);

fs.writeFileSync(socialPath, content, 'utf8');
console.log('SocialFlow.js successfully transformed into pure 100vh Dikey Akış experience!');
