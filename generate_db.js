const fs = require('fs');

const categories = {
  "Manav": {
     items: ["Domates","Biber","Sivri Biber","Çarliston Biber","Kırmızı Biber","Kapya Biber","Dolmalık Biber","Patlıcan","Kemer Patlıcan","Bostan Patlıcan","Kuru Soğan","Taze Soğan","Sarımsak","Patates","Taze Patates","Kabak","Bal Kabağı","Havuç","Ispanak","Kereviz","Pırasa","Karnabahar","Brokoli","Lahana","Kara Lahana","Brüksel Lahanası","Enginar","Bamya","Börülce","Taze Fasulye","Mantar","Kültür Mantarı","İstiridye Mantarı","Roka","Tere","Nane","Maydanoz","Dereotu","Kuzu Kulağı","Marul","Kıvırcık","Göbek Salata","Şalgam","Turp", "Kuşkonmaz", "Elma","Armut","Ayva","Muz","Çilek","Karpuz","Kavun","Üzüm","Siyah Üzüm","İncir","Kiraz","Vişne","Şeftali","Kayısı","Erik","Nar","Portakal","Mandalina","Limon","Greyfurt","Kivi","Avokado","Mango","Ananas","Yaban Mersini","Böğürtlen","Ahududu"]
  },
  "Süt ve Süt Ürünleri": {
     items: ["Süt","Yoğurt","Süzme Yoğurt","Tereyağı","Krema","Kaymak","Beyaz Peynir","Süzme Peynir","Eski Kaşar","Taze Kaşar","Ezine Peyniri","Tulum Peyniri","Çeçil Peyniri","Örgü Peyniri","Burgu Peyniri","Tel Peynir","Dil Peyniri","Hellim","Lor Peyniri","Çökelek","Labne","Krem Peynir","Gravyer","Cheddar","Mozzarella","Parmesan","Gouda","Kefir","Ayran"]
  },
  "Et Ürünleri": {
     items: ["Kıyma","Kuşbaşı","Antrikot","Bonfile","Kontrfile","Tranç","Nuar","Bodigo","Gerdan","İncik","Kaburga","Pirzola","Biftek","Kavurma","Pastırma","Kangal Sucuk","Parmak Sucuk","Sosis","Salam","Füme Et","Jambon","Ciğer","Yürek","Böbrek","İşkembe"]
  },
  "Tavuk ve Deniz Ürünleri": {
     items: ["Bütün Tavuk","Tavuk Göğsü","Tavuk But","Tavuk Kanat","Tavuk İncik","Baget","Tavuk Ciğeri","Taşlık","Hindi Göğüs","Bütün Hindi","Somon","Levrek","Çipura","Hamsi","İstavrit","Lüfer","Palamut","Mezgit","Uskumru","Sardalya","Kalkan","Barbun","Tekir","Kefal","Karides","Kalamar","Midye"]
  },
  "Bakliyat ve Temel Gıda": {
     items: ["Pirinç", "Bulgur", "Kırmızı Mercimek", "Yeşil Mercimek", "Sarı Mercimek", "Kuru Fasulye", "Nohut", "Barbunya", "Börülce", "Bakla", "Bezelye", "Mısır", "Kinoa", "Yulaf", "İrmik", "Arpa Şehriye", "Tel Şehriye", "Tarhana", "Un", "Mısır Unu", "Galeta Unu", "Somun Ekmek", "Lavaş", "Yufka", "Spagetti", "Penne", "Burgu Makarna", "Kelebek Makarna", "Erişte", "Mantı", "Şeker", "Zeytinyağı", "Ayçiçek Yağı", "Tereyağı", "Yumurta", "Domates Salçası", "Biber Salçası", "Sirke", "Tuz", "Karabiber", "Pul Biber", "Kekik", "Nane", "Kimyon"]
  }
};

const finalObj = {};
let totalItems = 0;

for (let cat in categories) {
    const list = new Set();
    const items = categories[cat].items;

    items.forEach(b => {
        list.add(b.toLowerCase());
        totalItems++;
    });
    finalObj[cat] = Array.from(list);
}

const fileContent = "export const CATEGORIZED_INGREDIENTS = " + JSON.stringify(finalObj, null, 2) + ";\n" + 
                    "export const INGREDIENT_KEYWORDS = Object.values(CATEGORIZED_INGREDIENTS).flat();\n";

fs.writeFileSync('src/engineIngredients.js', fileContent);
console.log('Successfully generated engineIngredients.js with ' + totalItems + ' pure items');
