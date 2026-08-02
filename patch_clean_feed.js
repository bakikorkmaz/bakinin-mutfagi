const fs = require('fs');
const path = require('path');

const socialPath = path.join(__dirname, 'src', 'SocialFlow.js');
let content = fs.readFileSync(socialPath, 'utf8').replace(/\r\n/g, '\n');

const cleanFeedCode = `   const renderFeedScreen = () => {
        let visiblePosts = feedPosts.filter(p => {
            if (p.userId === activeUser.uid) return true;
            const postOwner = allUsers.find(u => u.id === p.userId);
            if (!postOwner) return true;
            if (myProfile?.blocked?.includes(postOwner.id)) return false;
            if (postOwner.blocked?.includes(activeUser.uid)) return false;
            if (postOwner.isPrivate && !(myProfile?.follows?.includes(postOwner.id))) return false;
            return true; 
        });

        if (visiblePosts.length === 0) {
            return (
                <div style={{textAlign: 'center', margin: '30px 20px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    Henüz hiçbir gönderi paylaşılmamış. İlk paylaşan şef sen ol!
                </div>
            );
        }

        return (
            <div className="feed-container" style={{display: 'flex', flexDirection: 'column', height: '100%', margin: 0, padding: 0}}>
                <div className="feed-scroll-container" style={{overflowY: 'scroll', scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch', margin: '0', padding: '0', background: '#000000', flex: 1, height: 'calc(100vh - 95px)'}}>
                    {visiblePosts.map(post => {
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
                         </div>
                     </div>
                 );
             })}
         </div>
     </div>
     );
   };`;

const startFeed = content.indexOf('const renderFeedScreen = () => {');
const startNotifications = content.indexOf('const renderNotificationsScreen = () => {');

content = content.slice(0, startFeed) + cleanFeedCode + '\n\n' + content.slice(startNotifications);

fs.writeFileSync(socialPath, content, 'utf8');
console.log('Clean renderFeedScreen written successfully!');
