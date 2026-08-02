const fs = require('fs');
const path = require('path');

const socialPath = path.join(__dirname, 'src', 'SocialFlow.js');
let content = fs.readFileSync(socialPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Create renderSearchScreen function
const renderSearchScreenCode = `
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
`;

// Insert renderSearchScreen before renderFeedScreen
content = content.replace('const renderFeedScreen = () => {', renderSearchScreenCode + '\n   const renderFeedScreen = () => {');

// 2. Simplify renderFeedScreen to directly show the full-height reel stream (no top İzle/Şef Bul/Beğeniler buttons)
const newRenderFeedScreen = `   const renderFeedScreen = () => {
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
        <div className="feed-container" style={{display: 'flex', flexDirection: 'column', height: '100%', margin: 0, padding: 0}}>
            <div className="feed-scroll-container" style={{overflowY: 'scroll', scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch', margin: '0', padding: '0', background: '#000000', flex: 1, height: 'calc(100vh - 95px)'}}>
                {visiblePosts.length === 0 ? (
                    <div style={{textAlign: 'center', margin: '30px 20px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>Henüz hiçbir gönderi paylaşılmamış. İlk paylaşan şef sen ol!</div>
                ) : (
                    visiblePosts.map(post => {
                        const isLikedByMe = post.likes?.includes(activeUser.uid);
                        return (
                            <div key={post.id} style={{scrollSnapAlign: 'start', scrollSnapStop: 'always', height: 'calc(100vh - 95px)', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000000', margin: 0, padding: 0}}>
                         {post.images && post.images.length > 0 ? (
                              <div style={{display: 'flex', width: '100%', height: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory'}}>
                                  {post.images.map((imgUrl, i) => (
                                      <div key={i} style={{minWidth: '100%', width: '100%', flexShrink: 0, height: '100%', scrollSnapAlign: 'center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                          <img src={getHighResPhotoUrl(imgUrl)} alt="post" onClick={() => setEnlargedPhoto(getHighResPhotoUrl(imgUrl))} style={{width: '100%', height: '100%', objectFit: 'contain', borderRadius: '0px', background: '#000000', cursor: 'zoom-in'}} />
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
                         
                         <div style={{position: 'absolute', bottom: '25px', left: '15px', right: '70px', color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.8)', zIndex: 5}}>
                             <div style={{fontWeight: 900, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>
                                 <div onClick={() => {
                                      const pOwner = allUsers.find(u => u.id === post.userId) || {id: post.userId, username: post.username, name: post.userName, photoURL: post.userPhoto};
                                      openProfile(pOwner);
                                  }} style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                                    {post.userPhoto ? <img src={getHighResPhotoUrl(post.userPhoto)} alt="p" style={{width:'35px', height:'35px', borderRadius:'50%'}} /> : <span style={{fontSize:'24px'}}>👤</span>}
                                    @{post.username || post.userName.replace(/\\s+/g, '')}
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
                                           const targetUserRef = doc(db, 'users', post.userId);
                                           await updateDoc(targetUserRef, {
                                               notifications: arrayUnion({
                                                   id: Date.now().toString(),
                                                   type: 'LIKE',
                                                   text: \`@\${activeUser.username || 'Bir şef'} gönderinizi beğendi!\`,
                                                   timestamp: Date.now()
                                               })
                                           });
                                       }
                                   }
                             }}>
                                 <span style={{fontSize: '28px', filter: isLikedByMe ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'}}>{isLikedByMe ? '❤️' : '🤍'}</span>
                                 <span style={{color: 'white', fontSize: '12px', fontWeight: 800}}>{post.likes?.length || 0}</span>
                             </div>
                         </div>
                     </div>
                 );
             })}
         </div>
     </div>
     );
   };`;

// Replace renderFeedScreen
const startFeed = content.indexOf('const renderFeedScreen = () => {');
const startNotifications = content.indexOf('const renderNotificationsScreen = () => {');

content = content.slice(0, startFeed) + newRenderFeedScreen + '\n\n' + content.slice(startNotifications);

// 3. Update main subTab renderer to include SEARCH subtab
content = content.replace(
  `{subTab === 'FEED' && renderFeedScreen()}`,
  `{subTab === 'FEED' && renderFeedScreen()}\n                {subTab === 'SEARCH' && renderSearchScreen()}`
);

// 4. Update bottom navbar: replace Şeflerim button with 🔍 Şef Bul button (setting subTab to 'SEARCH')
const oldFollowBtn = `<button onClick={()=>setSubTab('FOLLOW')} style={{background: subTab==='FOLLOW' ? '#3B82F6':'transparent', color: subTab==='FOLLOW'?'white':'#64748B', border:'none', padding:'10px', borderRadius:'12px', fontWeight:600, flex: 1, margin: '0 2px', cursor: 'pointer', transition: '0.2s'}}>👥 Şeflerim</button>`;

const newSearchBtn = `<button onClick={()=>setSubTab('SEARCH')} style={{background: subTab==='SEARCH' ? '#3B82F6':'transparent', color: subTab==='SEARCH'?'white': ((subTab === 'FEED') ? '#94A3B8' : '#64748B'), border:'none', padding:'10px', borderRadius:'12px', fontWeight:600, flex: 1, margin: '0 2px', cursor: 'pointer', transition: '0.2s'}}>🔍 Şef Bul</button>`;

content = content.replace(oldFollowBtn, newSearchBtn);

fs.writeFileSync(socialPath, content, 'utf8');
console.log('SocialFlow.js successfully refactored!');
