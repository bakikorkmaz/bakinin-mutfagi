const fs = require('fs');
const path = require('path');

const enginePath = path.join(__dirname, 'src', 'engine.js');
let engineContent = fs.readFileSync(enginePath, 'utf8').replace(/\r\n/g, '\n');

const oldProcessLeftovers = `  // ZERO-FAILURE FALLBACK GENERATOR:
  // Eğer özel/farklı bir malzeme girilmişse ve veritabanı eşleşmemişse, asla boş liste dönme!
  if (t.length > 0) {
    const rawWords = t.replace(/(dünden|kalan|biraz|bir|kase|paket|haşlanmış|kızarmış|bayat|kullanılmamış|adet|tane|gram)/gi, '').trim();
    const cleanMainIng = rawWords || t;
    const capitalizedIng = cleanMainIng.charAt(0).toUpperCase() + cleanMainIng.slice(1);

    DB_MAINS_HUGE.forEach(dish => {
      const dishNameLower = dish.name.toLowerCase();
      const dishIngsLower = dish.ingredients.join(" ").toLowerCase();
      if (dishNameLower.includes(cleanMainIng) || dishIngsLower.includes(cleanMainIng)) {
        candidateRecipes.push({
          name: dish.name,
          desc: \`Artan \${cleanMainIng} ile mükemmel uyumlu \${dish.name}! (\${dish.time || 30} dk - \${dish.calories || 350} kcal)\`,
          ingredients: dish.ingredients
        });
      }
    });`;

const newProcessLeftovers = `  // ZERO-FAILURE FALLBACK GENERATOR:
  // Eğer özel/farklı bir malzeme girilmişse veya genişletilmiş arama gerekiyorsa veritabanını akıllıca tara!
  if (t.length > 0) {
    const cleanMainIng = t
      .replace(/(dünden|kalan|biraz|bir|kase|paket|haşlanmış|kızarmış|bayat|kullanılmamış|adet|tane|gram|kg|yemeği|yemeğim|yemeğinden|çorbası|sotesi|sote|kızartması|salatası|soslu|tavası|fırında)/gi, '')
      .trim();

    const tokens = cleanMainIng.split(/\\s+/).filter(w => w.length >= 3);
    const searchTokens = tokens.length > 0 ? tokens : [cleanMainIng || t];
    const capitalizedIng = (cleanMainIng || t).charAt(0).toUpperCase() + (cleanMainIng || t).slice(1);

    DB_MAINS_HUGE.forEach(dish => {
      const dishNameLower = dish.name.toLowerCase();
      const dishIngsLower = dish.ingredients.join(" ").toLowerCase();
      const matchesToken = searchTokens.some(token => dishNameLower.includes(token) || dishIngsLower.includes(token));
      if (matchesToken) {
        candidateRecipes.push({
          name: dish.name,
          desc: \`Artan \${cleanMainIng || t} malzemesi ile nefis \${dish.name} dönüşümü! (\${dish.time || 30} dk - ₺\${dish.cost || 120} - \${dish.calories || 350} kcal)\`,
          ingredients: dish.ingredients
        });
      }
    });`;

engineContent = engineContent.replace(oldProcessLeftovers, newProcessLeftovers);
fs.writeFileSync(enginePath, engineContent, 'utf8');
console.log('src/engine.js processLeftovers successfully patched!');

// Patch App.js to add "Yeni Varyasyon Üret" button in Recycle section
const appPath = path.join(__dirname, 'src', 'App.js');
let appContent = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

const oldRecycleResultsBlock = `      <div className="results-container" ref={recycleResultRef}>
        {hasSearched && results.length === 0 && (
           <div className="ai-advice-box" style={{backgroundColor: '#FFFBEB', color: '#B45309', borderLeft: '4px solid #F59E0B'}}>
              Buna uygun özel bir geri dönüşüm tarifi bulamadım. Ancak "Mutfak YZ Sohbet" bölümünden detaylı tarif isteyebilirsiniz! Veya "makarna", "pilav", "tavuk" gibi anahtar kelimeler girmeyi deneyin.
           </div>
        )}
        {results.map((res, idx) => (`;

const newRecycleResultsBlock = `      <div className="results-container" ref={recycleResultRef}>
        {hasSearched && results.length === 0 && (
           <div className="ai-advice-box" style={{backgroundColor: '#FFFBEB', color: '#B45309', borderLeft: '4px solid #F59E0B'}}>
              Buna uygun özel bir geri dönüşüm tarifi bulamadım. Ancak "Mutfak YZ Sohbet" bölümünden detaylı tarif isteyebilirsiniz! Veya "makarna", "pilav", "tavuk" gibi anahtar kelimeler girmeyi deneyin.
           </div>
        )}
        {results.length > 0 && (
           <div style={{marginBottom: '15px'}}>
              <button onClick={() => handleSearch()} style={{width: '100%', padding: '14px', background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                 <span>YENİ DÖNÜŞÜM VARYASYONLARI ÜRET 🔄</span>
              </button>
           </div>
        )}
        {results.map((res, idx) => (`;

appContent = appContent.replace(oldRecycleResultsBlock, newRecycleResultsBlock);
fs.writeFileSync(appPath, appContent, 'utf8');
console.log('src/App.js Recycle section successfully patched with refresh button!');
