import React from 'react';
import IngredientCard from '../components/IngredientCard';
import '../styles/App.css';

const Home = () => {
  // 100 MALZEME
  const ingredients = [
    { n: "Nohut", i: "🫘" }, { n: "Mercimek", i: "🥣" }, { n: "Fasulye", i: "🍲" }, { n: "Bezelye", i: "🫛" },
    { n: "Pirinç", i: "🍚" }, { n: "Bulgur", i: "🌾" }, { n: "Yulaf", i: "🥣" }, { n: "Mısır", i: "🌽" },
    { n: "Yumurta", i: "🥚" }, { n: "Süt", i: "🥛" }, { n: "Peynir", i: "🧀" }, { n: "Zeytin", i: "🫒" },
    { n: "Domates", i: "🍅" }, { n: "Salatalık", i: "🥒" }, { n: "Biber", i: "🫑" }, { n: "Patates", i: "🥔" },
    { n: "Soğan", i: "🧅" }, { n: "Sarımsak", i: "🧄" }, { n: "Havuç", i: "🥕" }, { n: "Patlıcan", i: "🍆" },
    { n: "Kabak", i: "🥒" }, { n: "Ispanak", i: "🌿" }, { n: "Brokoli", i: "🥦" }, { n: "Karnabahar", i: "🥦" },
    { n: "Lahana", i: "🥬" }, { n: "Marul", i: "🥬" }, { n: "Maydanoz", i: "🌿" }, { n: "Dereotu", i: "🌱" },
    { n: "Nane", i: "🌿" }, { n: "Fesleğen", i: "🌿" }, { n: "Tavuk", i: "🍗" }, { n: "Et", i: "🥩" },
    { n: "Kıyma", i: "🥩" }, { n: "Balık", i: "🐟" }, { n: "Sucuk", i: "🍕" }, { n: "Salam", i: "🥓" },
    { n: "Tereyağı", i: "🧈" }, { n: "Zeytinyağı", i: "🫙" }, { n: "Un", i: "🌾" }, { n: "Şeker", i: "🧂" },
    { n: "Yoğurt", i: "🥛" }, { n: "Bal", i: "🍯" }, { n: "Reçel", i: "🍓" }, { n: "Tahin", i: "🍯" },
    { n: "Ceviz", i: "🥥" }, { n: "Fındık", i: "🌰" }, { n: "Elma", i: "🍎" }, { n: "Muz", i: "🍌" },
    { n: "Portakal", i: "🍊" }, { n: "Limon", i: "🍋" }, { n: "Çay", i: "☕" }, { n: "Kahve", i: "☕" },
    { n: "Kekik", i: "🌿" }, { n: "Pul Biber", i: "🌶️" }, { n: "Karabiber", i: "🧂" }, { n: "Zencefil", i: "🫚" },
    { n: "Bamya", i: "🌿" }, { n: "Pırasa", i: "🥬" }, { n: "Enginar", i: "🌵" }, { n: "Bakla", i: "🫛" },
    { n: "Kestane", i: "🌰" }, { n: "İrmik", i: "🌾" }, { n: "Salça", i: "🥫" }, { n: "Pekmez", i: "🍇" },
    { n: "Çilek", i: "🍓" }, { n: "Vişne", i: "🍒" }, { n: "İncir", i: "🥯" }, { n: "Ayva", i: "🍎" },
    { n: "Kayısı", i: "🍑" }, { n: "Şeftali", i: "🍑" }, { n: "Armut", i: "🍐" }, { n: "Nar", i: "🍎" },
    { n: "Kavun", i: "🍈" }, { n: "Karpuz", i: "🍉" }, { n: "Erik", i: "🍏" }, { n: "Kivi", i: "🥝" },
    { n: "Ananas", i: "🍍" }, { n: "Mandalina", i: "🍊" }, { n: "Roka", i: "🌿" }, { n: "Tere", i: "🌿" },
    { n: "Sumak", i: "🔴" }, { n: "Zerdeçal", i: "🟡" }, { n: "Kimyon", i: "🧂" }, { n: "Maya", i: "🍞" },
    { n: "Susam", i: "🥯" }, { n: "Çörek Otu", i: "🧂" }, { n: "Tarçın", i: "🪵" }, { n: "Karanfil", i: "📍" },
    { n: "Vanilya", i: "🍦" }, { n: "Kuşkonmaz", i: "🌿" }, { n: "Semizotu", i: "🌿" }, { n: "Kinoa", i: "🍚" },
    { n: "Avokado", i: "🥑" }, { n: "Çia Tohumu", i: "🧂" }, { n: "Hurma", i: "🌴" }, { n: "Yer Fıstığı", i: "🥜" },
    { n: "Kaju", i: "🌰" }, { n: "Maca", i: "🌾" }, { n: "Damla Sakızı", i: "💧" }, { n: "Ihlamur", i: "🍵" }
  ];

  // 100 GERÇEK TARİF (Öncekilerin devamı ve tamamı)
  const recipes = [
    "Mercimek + Soğan + Havuç ➔ Mercimek Çorbası", "Nohut + Tahin + Limon ➔ Humus", 
    "Fasulye + Sucuk + Salça ➔ Sucuklu Fasulye", "Pirinç + Domates + Biber ➔ Domatesli Pilav",
    "Bulgur + Salça + Nane ➔ Kısır", "Yumurta + Domates + Biber ➔ Menemen",
    "Patlıcan + Kıyma + Soğan ➔ Karnıyarık", "Patates + Süt + Tereyağı ➔ Patates Püresi",
    "Yoğurt + Salatalık + Sarımsak ➔ Cacık", "Ispanak + Yumurta + Soğan ➔ Ispanaklı Yumurta",
    "Tavuk + Mantar + Krema ➔ Kremalı Tavuk", "Makarna + Peynir + Maydanoz ➔ Peynirli Makarna",
    "Un + Süt + Yumurta ➔ Krep", "Kıymalı + Patates + Salça ➔ Patates Oturtma",
    "Bezelye + Havuç + Patates ➔ Zeytinyağlı Garnitür", "Kabak + Dereotu + Yoğurt ➔ Kabak Borani",
    "Lahana + Pirinç + Kıyma ➔ Lahana Sarması", "Havuç + Tarçın + Ceviz ➔ Havuçlu Kek",
    "Mısır + Tereyağı + Tuz ➔ Süt Mısır", "Balık + Limon + Maydanoz ➔ Izgara Balık",
    "Semizotu + Yoğurt + Ceviz ➔ Semizotu Salatası", "Kırmızı Biber + Ceviz + Tahin ➔ Muhammara",
    "Un + Tereyağı + Bal ➔ Un Helvası", "Muz + Süt + Bal ➔ Smoothie",
    "Mantı + Yoğurt + Pul Biber ➔ Mantı", "Bamya + Limon + Domates ➔ Bamya Yemeği",
    "Pırasa + Pirinç + Havuç ➔ Zeytinyağlı Pırasa", "Karnabahar + Beşamel Sos ➔ Fırın Karnabahar",
    "Brokoli + Limon + Sarımsak ➔ Brokoli Salatası", "Enginar + Bakla + Dereotu ➔ Enginar",
    "Kavurma + Yumurta ➔ Kavurmalı Yumurta", "Pastırma + Kuru Fasulye ➔ Pastırmalı Fasulye",
    "Mantar + Sarımsak + Kekik ➔ Mantar Sote", "Kestane + Şeker ➔ Kestane Şekeri",
    "Şehriye + Tavuk Suyu + Limon ➔ Şehriye Çorbası", "Tarhana + Yoğurt + Sarımsak ➔ Tarhana Çorbası",
    "İrmik + Süt + Şeker ➔ İrmik Helvası", "Tahin + Pekmez ➔ Tahin Pekmez",
    "Çilek + Şeker + Limon ➔ Çilek Reçeli", "Vişne + Su + Şeker ➔ Komposto",
    "Kekik + Zeytinyağı + Pul Biber ➔ Kahvaltılık Sos", "Domates + Şehriye + Nane ➔ Domates Çorbası",
    "Erişte + Ceviz + Peynir ➔ Erişte", "Patates + Patlıcan + Biber ➔ Kızartma",
    "Zencefil + Bal + Limon ➔ Bağışıklık Çayı", "Ayva + Şeker + Karanfil ➔ Ayva Tatlısı",
    "Kabak + Tahin + Ceviz ➔ Kabak Tatlısı", "Simit + Peynir + Çay ➔ Kahvaltı",
    "Un + Su + Tuz ➔ Lavaş", "Kuşbaşı Et + Arpacık Soğan ➔ Yahni",
    "Barbunya + Havuç + Patates ➔ Pilaki", "Kinoa + Avokado + Limon ➔ Fit Salata",
    "Yulaf + Yoğurt + Meyve ➔ Fit Kahvaltı", "Çia + Süt + Çilek ➔ Puding",
    "Hurma + Ceviz ➔ Enerji Topu", "Badem + Su ➔ Badem Sütü",
    "Yer Fıstığı + Bal ➔ Fıstık Ezmesi", "Ihlamur + Tarçın ➔ Kış Çayı",
    "Türk Kahvesi + Sakız ➔ Sakızlı Kahve", "Erişte + Yeşil Mercimek ➔ Tutmaç",
    "Yarma + Yoğurt ➔ Ayran Aşı", "Dereotu + Peynir + Un ➔ Dereotlu Poğaça",
    "Mısır Unu + Tereyağı + Peynir ➔ Mıhlama", "Sumak + Soğan + Maydanoz ➔ Kebap Salatası",
    "Limon + Nane + Şeker ➔ Limonata", "Reyhan + Su + Şeker ➔ Reyhan Şerbeti",
    "Zerdeçal + Süt + Karabiber ➔ Altın Süt", "Maya + Un + Tuz ➔ Ev Ekmeği",
    "Pazı + Pirinç + Yoğurt ➔ Pazı Sarması", "Kereviz + Portakal Suyu ➔ Zeytinyağlı Kereviz",
    "Kırmızı Mercimek + Bulgur ➔ Mercimek Köftesi", "Domates + Mozzarella + Fesleğen ➔ Caprese",
    "Patates + Garnitür + Mayonez ➔ Rus Salatası", "Kıyma + Galeta Unu + Soğan ➔ Anne Köftesi",
    "Biftek + Karamelize Soğan ➔ Philly Steak", "Tavuk + Köri + Krema ➔ Köri Soslu Tavuk",
    "Un + Kakao + Süt + Şeker ➔ Islak Kek", "Mısır + Biber + Fasulye ➔ Meksika Salatası",
    "Somon + Dereotu + Limon ➔ Fırın Somon", "Kabak + Peynir + Un ➔ Mücver",
    "Yumurta + Beyaz Peynir + Dereotu ➔ Peynirli Omlet", "Pancar + Sirke + Sarımsak ➔ Pancar Turşusu",
    "Sarımsak + Mayonez + Yoğurt ➔ Haydari", "Börülce + Zeytinyağı + Limon ➔ Börülce Salatası",
    "Tavuk + Pirinç + Nohut ➔ Nohutlu Pilav", "Ceviz + Bal + Kaymak ➔ Bal-Kaymak Tabağı",
    "Kuru Üzüm + Kuruyemiş + Pirinç ➔ İç Pilav", "Sosis + Ketçap + Mayonez ➔ Karışık Sandviç",
    "Un + Su + Ispanak ➔ El Açması Börek", "Vişne + İrmik + Süt ➔ Vişne Soslu İrmik Tatlısı",
    "Kadayıf + Antep Fıstığı ➔ Fıstıklı Kadayıf", "Güllaç + Süt + Gül Suyu ➔ Güllaç",
    "Karamel + Süt + 3 Çeşit Un ➔ Triliçe", "Sufle + Bitter Çikolata ➔ Çikolatalı Sufle",
    "Elma + Üzüm + Ceviz ➔ Waldorf Salata", "Soya Sosu + Sebze + Erişte ➔ Noodle",
    "Tahin + Şeker + Susam ➔ Tahinli Çörek", "Portakal + Havuç + Elma ➔ Atom İçecek",
    "Karpuz + Nane + Buz ➔ Karpuz Frozen", "Ananas + Yoğurt ➔ Tropikal Kahvaltı"
  ];

  return (
    <div className="main-container">
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--neon)', fontSize: '3.5rem', textShadow: '0 0 20px var(--neon)' }}>
          BAKİ KORKMAZ | SMART KITCHEN
        </h1>
        <p style={{ letterSpacing: '2px', opacity: 0.7 }}>PRO ANALYTICS & RECIPIE ENGINE v1.0</p>
      </header>

      {/* 700x700 PROFESYONEL PANEL */}
      <section className="recipe-dashboard">
        <h2 style={{ color: 'var(--neon)', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid var(--neon)', paddingBottom: '10px' }}>
           ANALİZ EDİLEN 100 ALTERNATİF TARİF
        </h2>
        <div className="scroll-area">
          {recipes.map((r, index) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
              <span style={{ color: 'var(--neon)', fontWeight: 'bold' }}>#{index + 1} ➔ </span>
              {r}
            </div>
          ))}
        </div>
      </section>

      {/* MALZEME ENVANTERİ */}
      <h2 style={{ textAlign: 'center', margin: '40px 0', color: 'var(--neon)' }}>DİJİTAL ENVANTER (100 BİRİM)</h2>
      <div className="ingredients-grid">
        {ingredients.map((item, index) => (
          <IngredientCard key={index} name={item.n} icon={item.i} />
        ))}
      </div>
    </div>
  );
};

export default Home;