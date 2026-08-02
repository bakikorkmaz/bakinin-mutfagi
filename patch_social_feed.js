const fs = require('fs');
const path = require('path');

const socialPath = path.join(__dirname, 'src', 'SocialFlow.js');
let content = fs.readFileSync(socialPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Update post container height & image styling in WATCH mode
const oldPostDiv = `<div key={post.id} style={{scrollSnapAlign: 'start', scrollSnapStop: 'always', height: 'calc(100vh - 180px)', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#090D16'}}>`;
const newPostDiv = `<div key={post.id} style={{scrollSnapAlign: 'start', scrollSnapStop: 'always', height: 'calc(100vh - 120px)', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#090D16'}}>`;

content = content.replace(oldPostDiv, newPostDiv);

const oldImgStyle = `style={{maxWidth: '100%', maxHeight: '60vh', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '16px', background: '#1E293B', boxShadow: '0 8px 30px rgba(0,0,0,0.7)', cursor: 'zoom-in'}}`;
const newImgStyle = `style={{width: '100%', height: '100%', maxHeight: '78vh', objectFit: 'contain', borderRadius: '16px', background: '#090D16', boxShadow: '0 8px 30px rgba(0,0,0,0.7)', cursor: 'zoom-in'}}`;

content = content.replace(oldImgStyle, newImgStyle);

// 2. Make bottom sub-navbar dark glassmorphism in WATCH mode
const oldNavBlock = `<div style={{position: 'fixed', bottom: '0px', left: '0', right: '0', margin: '0 auto', maxWidth: '600px', zIndex: 90, display:'flex', justifyContent:'space-around', padding:'10px', background:'white', borderTop: '1px solid #E2E8F0', boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)'}}>`;

const newNavBlock = `<div style={{position: 'fixed', bottom: '0px', left: '0', right: '0', margin: '0 auto', maxWidth: '600px', zIndex: 90, display:'flex', justifyContent:'space-around', padding:'10px', background: (subTab === 'FEED' && feedMode === 'WATCH') ? 'rgba(15, 23, 42, 0.95)' : 'white', backdropFilter: 'blur(12px)', borderTop: (subTab === 'FEED' && feedMode === 'WATCH') ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'background 0.3s ease'}}>`;

content = content.replace(oldNavBlock, newNavBlock);

// Update nav buttons text color in dark mode
const isDarkNav = `const isDark = (subTab === 'FEED' && feedMode === 'WATCH');`;
const oldBtnProfile = `style={{background: subTab==='MY_PROFILE' ? '#3B82F6':'transparent', color: subTab==='MY_PROFILE'?'white':'#64748B'`;
const newBtnProfile = `style={{background: subTab==='MY_PROFILE' ? '#3B82F6':'transparent', color: subTab==='MY_PROFILE'?'white': ((subTab === 'FEED' && feedMode === 'WATCH') ? '#94A3B8' : '#64748B')`;

content = content.replaceAll(oldBtnProfile, newBtnProfile);

fs.writeFileSync(socialPath, content, 'utf8');
console.log('SocialFlow.js updated successfully!');
