const fs = require('fs');
let appStr = fs.readFileSync('src/App.js', 'utf8');

// 1. Add generateGroupMenu to import
if(!appStr.includes('generateGroupMenu')) {
   appStr = appStr.replace(/} from '\.\/engine';/g, ", generateGroupMenu } from './engine';");
}

// 2. Add States
if(!appStr.includes('const [groupMembers, setGroupMembers]')) {
   const stateInject = `
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
    if(results.length === 0) alert('Bu grubun katı kurallarının *tümünü* aynı anda sağlayan ortak bir yemek bulunamadı. Alternatif bulmak için en zıt kısıtlamalardan birini (örn hem vegan hem yüksek kalori vs) esnetebilirsiniz.');
  };
`;
   const hookStart = appStr.indexOf('const [crossInput, setCrossInput]');
   if(hookStart !== -1) {
      appStr = appStr.substring(0, hookStart) + stateInject + '\\n\\n' + appStr.substring(hookStart);
   }
}

// 3. Add Dashboard Hub Card
if(!appStr.includes('Müşterek (Grup) Menü')) {
   const dbHubStr = `<div className="hub-card" onClick={() => { setDashboardView('WEEKLY'); setWeeklyPlan(null); }}>`;
   const cardInject = `
        <div className="hub-card" onClick={() => { setDashboardView('GROUP'); setGroupResults(null); }}>
          <div className="hub-icon">🤝</div>
          <div className="hub-title">Müşterek (Grup) Menü</div>
          <div className="hub-desc">Farklı diyet, alerji veya hedefleri olan birden çok insanı ortak bir paydada doyuracak mucize yemekler bulun.</div>
        </div>
   `;
   appStr = appStr.replace(dbHubStr, cardInject.trim() + '\\n        ' + dbHubStr);
}

// 4. Add UI Component
if(!appStr.includes("dashboardView === 'GROUP'")) {
   const fridgeRenderStart = appStr.indexOf(`{dashboardView === 'FRIDGE' && (`);
   const uiInject = `
      {dashboardView === 'GROUP' && (
      <>
        <div className="module-header-nav">
          <button className="back-btn" onClick={() => setDashboardView('HUB')}>← Geri Dön</button>
        </div>
        <div className="budget-card" style={{borderLeft: '4px solid #8B5CF6'}}>
          <h3 className="budget-title">🤝 Müşterek (Grup) Menü Analizi</h3>
          <p style={{fontSize: '13px', color: '#8D99AE', marginBottom: '20px'}}>Evinizdeki kişileri veya misafirlerinizi ekleyin; diyet profillerini seçin. Sistem herkesi ortak paydada mutlu edecek yemeği bulsun!</p>

          <div style={{display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap'}}>
            <input type="text" placeholder="Kişi Adı (Örn: Mehmet)" value={newMemberName} onChange={e=>setNewMemberName(e.target.value)} style={{flex: 1, minWidth: '150px', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1'}} />
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
             <span>✨ Herkese Uyan Ortak Menüleri Keşfet</span>
          </button>

          {groupResults && groupResults.length > 0 && (
             <div style={{marginTop: '30px'}}>
                <h4 style={{fontSize: '15px', color: '#8B5CF6', marginBottom: '15px'}}>🎯 Grubunuza Uygun {groupResults.length} Adet Premium Öneri:</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                   {groupResults.map((dish, i) => (
                      <div key={i} style={{border: '1px solid #DDD6FE', borderRadius: '12px', padding: '15px', background: 'white', borderLeft: '5px solid #8B5CF6'}}>
                         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                            <div>
                               <div style={{fontWeight: 800, color: '#1E293B', fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                  {dish.name}
                                  <span style={{fontSize: '11px', background: '#8B5CF6', color: 'white', padding: '3px 6px', borderRadius: '4px'}}>Uyum: %100</span>
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
                            <button onClick={()=>openShopping({ main: dish })} style={{width: '100%', padding: '10px', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'}}>🛒 Modülü Görüntüle ve Pazar Listesi Çıkar</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </>
      )}

      `;
   appStr = appStr.substring(0, fridgeRenderStart) + uiInject + appStr.substring(fridgeRenderStart);
}

fs.writeFileSync('src/App.js', appStr, 'utf8');
console.log('App.js injected seamlessly.');
