export const DB_SOUPS = [
  {
    "id": "s1",
    "name": "Süzme Mercimek Çorbası",
    "type": "LOCAL",
    "theme": [
      "WINTER",
      "RAMADAN"
    ],
    "cost": 25,
    "time": 30,
    "heaviness": 2,
    "ingredients": [
      "kırmızı mercimek",
      "kuru soğan",
      "tereyağı",
      "domates salçası",
      "ayçiçek yağı",
      "nane",
      "pul biber"
    ]
  },
  {
    "id": "s2",
    "name": "Kremalı Mantar Çorbası",
    "type": "FOREIGN",
    "theme": [
      "WINTER"
    ],
    "cost": 45,
    "time": 25,
    "heaviness": 4,
    "ingredients": [
      "kültür mantarı",
      "krema",
      "tereyağı",
      "un",
      "süt",
      "karabiber",
      "tuz"
    ]
  },
  {
    "id": "s3",
    "name": "Yayla Çorbası",
    "type": "LOCAL",
    "theme": [
      "SUMMER",
      "FIT"
    ],
    "cost": 20,
    "time": 20,
    "heaviness": 2,
    "ingredients": [
      "yoğurt",
      "pirinç",
      "nane",
      "yumurta",
      "zeytinyağı",
      "tuz"
    ]
  },
  {
    "id": "s4",
    "name": "Soğuk Aşı Çorbası",
    "type": "LOCAL",
    "theme": [
      "SUMMER",
      "FIT"
    ],
    "cost": 20,
    "time": 10,
    "heaviness": 1,
    "ingredients": [
      "yoğurt",
      "nane",
      "nohut",
      "buğday",
      "zeytinyağı"
    ]
  },
  {
    "id": "s5",
    "name": "Minestrone (İtalyan Sebze)",
    "type": "FOREIGN",
    "theme": [
      "WINTER",
      "FIT"
    ],
    "cost": 40,
    "time": 35,
    "heaviness": 2,
    "ingredients": [
      "kabak",
      "havuç",
      "domates",
      "taze fasulye",
      "penne",
      "kuru soğan",
      "sarımsak"
    ]
  },
  {
    "id": "s6",
    "name": "Ezogelin Çorbası",
    "type": "LOCAL",
    "theme": [
      "WINTER",
      "RAMADAN"
    ],
    "cost": 25,
    "time": 35,
    "heaviness": 3,
    "ingredients": [
      "kırmızı mercimek",
      "bulgur",
      "domates salçası",
      "nane",
      "kuru soğan",
      "tereyağı"
    ]
  },
  {
    "id": "s7",
    "name": "Tarhana Çorbası",
    "type": "LOCAL",
    "theme": [
      "WINTER"
    ],
    "cost": 15,
    "time": 15,
    "heaviness": 2,
    "ingredients": [
      "tarhana",
      "domates salçası",
      "tereyağı",
      "nane",
      "sarımsak"
    ]
  },
  {
    "id": "s8",
    "name": "Tavuk Suyu Çorbası",
    "type": "LOCAL",
    "theme": [
      "WINTER",
      "FIT"
    ],
    "cost": 35,
    "time": 45,
    "heaviness": 3,
    "ingredients": [
      "bütün tavuk",
      "tel şehriye",
      "havuç",
      "limon",
      "yumurta"
    ]
  }
];
export const DB_MAINS = [
  {
    "id": "m1",
    "name": "Karnıyarık",
    "type": "LOCAL",
    "theme": [
      "SUMMER",
      "RAMADAN"
    ],
    "cost": 120,
    "totalCost": 120,
    "time": 60,
    "prepTime": 60,
    "calories": 420,
    "heaviness": 6,
    "ingredients": [
      "patlıcan",
      "kıyma",
      "kuru soğan",
      "domates",
      "biber",
      "domates salçası",
      "sarımsak",
      "ayçiçek yağı"
    ]
  },
  {
    "id": "m2",
    "name": "Fırında Kaşarlı Köfte",
    "type": "LOCAL",
    "theme": [
      "WINTER"
    ],
    "cost": 150,
    "totalCost": 150,
    "time": 45,
    "prepTime": 45,
    "calories": 540,
    "heaviness": 7,
    "ingredients": [
      "kıyma",
      "taze kaşar",
      "kuru soğan",
      "domates",
      "biber",
      "galeta unu",
      "yumurta",
      "kimyon"
    ]
  },
  {
    "id": "m3",
    "name": "Tavuk Sote",
    "type": "LOCAL",
    "theme": ["WINTER", "FIT"],
    "cost": 85,
    "totalCost": 85,
    "time": 30,
    "prepTime": 30,
    "calories": 360,
    "heaviness": 4,
    "ingredients": ["tavuk göğsü", "biber", "domates", "kuru soğan", "ayçiçek yağı", "karabiber", "kekik"]
  },
  {
    "id": "m3_girik",
    "name": "Gırık",
    "type": "LOCAL",
    "theme": ["FAMILY", "TRADITIONAL"],
    "cost": 95,
    "totalCost": 95,
    "time": 45,
    "prepTime": 45,
    "calories": 480,
    "heaviness": 5,
    "ingredients": ["tavuk göğsü", "un", "tereyağı", "yoğurt", "sarımsak", "nane", "pul biber"]
  },
  {
    "id": "m3_tantuni",
    "name": "Tavuk Tantuni",
    "type": "LOCAL",
    "theme": ["FAMILY", "STUDENT", "TRADITIONAL"],
    "cost": 75,
    "totalCost": 75,
    "time": 25,
    "prepTime": 25,
    "calories": 420,
    "heaviness": 4,
    "ingredients": ["tavuk göğsü", "lavaş", "kuru soğan", "domates", "maydanoz", "sumak", "pamuk yağı", "pul biber"]
  },
  {
    "id": "m3_iclikofte",
    "name": "Tavuklu İçli Köfte",
    "type": "LOCAL",
    "theme": ["GUEST", "TRADITIONAL"],
    "cost": 110,
    "totalCost": 110,
    "time": 60,
    "prepTime": 60,
    "calories": 510,
    "heaviness": 6,
    "ingredients": ["tavuk göğsü", "köftelik bulgur", "irmik", "kuru soğan", "ceviz içi", "biber salçası", "tereyağı", "nane"]
  },
  {
    "id": "m3_sis",
    "name": "Tavuk Şiş",
    "type": "LOCAL",
    "theme": ["SUMMER", "FIT", "TRADITIONAL"],
    "cost": 90,
    "totalCost": 90,
    "time": 30,
    "prepTime": 30,
    "calories": 390,
    "heaviness": 3,
    "ingredients": ["tavuk göğsü", "yoğurt", "zeytinyağı", "salça", "sarımsak", "kekik", "pul biber", "biber", "domates"]
  },
  {
    "id": "m3_murgh",
    "name": "Murgh Makhani (Butter Chicken)",
    "type": "FOREIGN",
    "theme": ["GUEST", "FOREIGN"],
    "cost": 140,
    "totalCost": 140,
    "time": 40,
    "prepTime": 40,
    "calories": 580,
    "heaviness": 7,
    "ingredients": ["tavuk göğsü", "tereyağı", "krema", "domates püresi", "garam masala", "zencefil", "sarımsak", "yoğurt"]
  },
  {
    "id": "m3_piccata",
    "name": "Chicken Piccata",
    "type": "FOREIGN",
    "theme": ["FIT", "FOREIGN"],
    "cost": 130,
    "totalCost": 130,
    "time": 25,
    "prepTime": 25,
    "calories": 410,
    "heaviness": 4,
    "ingredients": ["tavuk göğsü", "tereyağı", "zeytinyağı", "limon suyu", "kapari", "tavuk suyu", "maydanoz", "un"]
  },
  {
    "id": "m3_kungpao",
    "name": "Kung Pao Chicken",
    "type": "FOREIGN",
    "theme": ["STUDENT", "FOREIGN"],
    "cost": 125,
    "totalCost": 125,
    "time": 20,
    "prepTime": 20,
    "calories": 490,
    "heaviness": 5,
    "ingredients": ["tavuk göğsü", "yer fıstığı", "kuru acı biber", "soya sosu", "susam yağı", "zencefil", "taze soğan", "nişasta"]
  },
  {
    "id": "m3_kiev",
    "name": "Chicken Kiev",
    "type": "FOREIGN",
    "theme": ["GUEST", "FOREIGN"],
    "cost": 150,
    "totalCost": 150,
    "time": 45,
    "prepTime": 45,
    "calories": 630,
    "heaviness": 8,
    "ingredients": ["tavuk göğsü", "tereyağı", "sarımsak", "maydanoz", "yumurta", "galeta unu", "un", "ayçiçek yağı"]
  },
  {
    "id": "m3_mole",
    "name": "Tavuklu Mole Poblano",
    "type": "FOREIGN",
    "theme": ["GUEST", "FOREIGN"],
    "cost": 160,
    "totalCost": 160,
    "time": 55,
    "prepTime": 55,
    "calories": 570,
    "heaviness": 7,
    "ingredients": ["tavuk göğsü", "bitter çikolata", "chili biberi", "susam", "domates", "tarçın", "karanfil", "sarımsak"]
  },
  {
    "id": "m4",
    "name": "Fettuccine Alfredo",
    "type": "FOREIGN",
    "theme": [
      "WINTER"
    ],
    "cost": 140,
    "totalCost": 140,
    "time": 25,
    "prepTime": 25,
    "calories": 620,
    "heaviness": 8,
    "ingredients": [
      "spagetti",
      "tavuk göğsü",
      "krema",
      "kültür mantarı",
      "tereyağı",
      "parmesan"
    ]
  },
  {
    "id": "m5",
    "name": "Beef Stroganoff",
    "type": "FOREIGN",
    "theme": [
      "WINTER"
    ],
    "cost": 250,
    "totalCost": 250,
    "time": 40,
    "prepTime": 40,
    "calories": 580,
    "heaviness": 8,
    "ingredients": [
      "bonfile",
      "kültür mantarı",
      "krema",
      "kuru soğan",
      "hardal",
      "tereyağı",
      "zeytinyağı"
    ]
  },
  {
    "id": "m6",
    "name": "Zeytinyağlı Taze Fasulye",
    "type": "LOCAL",
    "theme": [
      "SUMMER",
      "FIT"
    ],
    "cost": 50,
    "totalCost": 50,
    "time": 45,
    "prepTime": 45,
    "calories": 210,
    "heaviness": 2,
    "ingredients": [
      "taze fasulye",
      "domates",
      "zeytinyağı",
      "kuru soğan",
      "şeker",
      "tuz"
    ]
  },
  {
    "id": "m7",
    "name": "Etli Nohut",
    "type": "LOCAL",
    "theme": [
      "WINTER"
    ],
    "cost": 130,
    "totalCost": 130,
    "time": 90,
    "prepTime": 90,
    "calories": 480,
    "heaviness": 6,
    "ingredients": [
      "nohut",
      "kuşbaşı",
      "domates salçası",
      "kuru soğan",
      "tereyağı",
      "ayçiçek yağı"
    ]
  },
  {
    "id": "m8",
    "name": "Fırın Somon",
    "type": "FOREIGN",
    "theme": [
      "FIT",
      "SUMMER"
    ],
    "cost": 220,
    "totalCost": 220,
    "time": 30,
    "prepTime": 30,
    "calories": 390,
    "heaviness": 3,
    "ingredients": [
      "somon",
      "zeytinyağı",
      "limon",
      "sarımsak",
      "karabiber"
    ]
  },
  {
    "id": "m9",
    "name": "Patlıcan Musakka",
    "type": "LOCAL",
    "theme": [
      "SUMMER"
    ],
    "cost": 110,
    "totalCost": 110,
    "time": 55,
    "prepTime": 55,
    "calories": 440,
    "heaviness": 7,
    "ingredients": [
      "patlıcan",
      "kıyma",
      "domates salçası",
      "kuru soğan",
      "sarımsak",
      "domates",
      "sivri biber"
    ]
  },
  {
    "id": "m10",
    "name": "Et Sote",
    "type": "LOCAL",
    "theme": [
      "WINTER",
      "RAMADAN"
    ],
    "cost": 180,
    "totalCost": 180,
    "time": 50,
    "prepTime": 50,
    "calories": 460,
    "heaviness": 6,
    "ingredients": [
      "kuşbaşı",
      "kuru soğan",
      "biber",
      "domates",
      "tereyağı",
      "domates salçası",
      "kekik",
      "pul biber"
    ]
  },
  {
    "id": "m11",
    "name": "Kıymalı Makarna",
    "type": "LOCAL",
    "theme": [
      "STUDENT"
    ],
    "cost": 45,
    "totalCost": 45,
    "time": 20,
    "prepTime": 20,
    "calories": 510,
    "heaviness": 6,
    "ingredients": [
      "burgu makarna",
      "kıyma",
      "domates salçası",
      "kuru soğan",
      "zeytinyağı",
      "tuz"
    ]
  },
  {
    "id": "m12",
    "name": "Fırında Bütün Tavuk",
    "type": "LOCAL",
    "theme": [
      "GUEST",
      "RAMADAN"
    ],
    "cost": 140,
    "totalCost": 140,
    "time": 90,
    "prepTime": 90,
    "calories": 490,
    "heaviness": 5,
    "ingredients": [
      "bütün tavuk",
      "patates",
      "havuç",
      "zeytinyağı",
      "biber salçası",
      "limon",
      "kekik"
    ]
  },
  {
    "id": "m13",
    "name": "Sebzeli Güveç",
    "type": "LOCAL",
    "theme": [
      "WINTER"
    ],
    "cost": 130,
    "totalCost": 130,
    "time": 80,
    "prepTime": 80,
    "calories": 380,
    "heaviness": 5,
    "ingredients": [
      "kuşbaşı",
      "patlıcan",
      "patates",
      "taze fasulye",
      "kuru soğan",
      "domates",
      "sarımsak",
      "zeytinyağı"
    ]
  },
  {
    "id": "m14",
    "name": "İzmir Köfte",
    "type": "LOCAL",
    "theme": [
      "WINTER",
      "RAMADAN"
    ],
    "cost": 160,
    "totalCost": 160,
    "time": 50,
    "prepTime": 50,
    "calories": 470,
    "heaviness": 6,
    "ingredients": [
      "kıyma",
      "patates",
      "domates",
      "sivri biber",
      "domates salçası",
      "galeta unu",
      "kuru soğan",
      "kimyon"
    ]
  },
  {
    "id": "m15",
    "name": "Köri Soslu Tavuk",
    "type": "FOREIGN",
    "theme": [
      "STUDENT"
    ],
    "cost": 95,
    "totalCost": 95,
    "time": 25,
    "prepTime": 25,
    "calories": 430,
    "heaviness": 5,
    "ingredients": [
      "tavuk göğsü",
      "krema",
      "köri",
      "zeytinyağı",
      "tuz",
      "karabiber"
    ]
  },
  {
    "id": "m16",
    "name": "Zeytinyağlı Barbunya",
    "type": "LOCAL",
    "theme": [
      "SUMMER",
      "FIT"
    ],
    "cost": 60,
    "totalCost": 60,
    "time": 60,
    "prepTime": 60,
    "calories": 310,
    "heaviness": 3,
    "ingredients": [
      "barbunya",
      "zeytinyağı",
      "havuç",
      "patates",
      "kuru soğan",
      "domates",
      "sarımsak",
      "şeker"
    ]
  },
  {
    "id": "m17",
    "name": "Fırında Levrek",
    "type": "LOCAL",
    "theme": [
      "FIT"
    ],
    "cost": 190,
    "totalCost": 190,
    "time": 40,
    "prepTime": 40,
    "calories": 340,
    "heaviness": 3,
    "ingredients": [
      "levrek",
      "zeytinyağı",
      "limon",
      "kuru soğan",
      "patates",
      "karabiber",
      "tuz"
    ]
  },
  {
    "id": "m18",
    "name": "Hünkar Beğendi",
    "type": "LOCAL",
    "theme": [
      "GUEST",
      "RAMADAN"
    ],
    "cost": 210,
    "totalCost": 210,
    "time": 70,
    "prepTime": 70,
    "calories": 560,
    "heaviness": 7,
    "ingredients": [
      "kuşbaşı",
      "patlıcan",
      "süt",
      "un",
      "taze kaşar",
      "tereyağı",
      "kuru soğan",
      "domates salçası"
    ]
  },
  {
    "id": "m19",
    "name": "Mantı",
    "type": "LOCAL",
    "theme": [
      "RAMADAN",
      "WINTER"
    ],
    "cost": 110,
    "totalCost": 110,
    "time": 90,
    "prepTime": 90,
    "calories": 520,
    "heaviness": 7,
    "ingredients": [
      "mantı",
      "yoğurt",
      "tereyağı",
      "pul biber",
      "nane",
      "sarımsak",
      "domates salçası"
    ]
  },
  {
    "id": "m20",
    "name": "Tereyağlı Kuru Fasulye",
    "type": "LOCAL",
    "theme": [
      "WINTER"
    ],
    "cost": 80,
    "totalCost": 80,
    "time": 100,
    "prepTime": 100,
    "calories": 440,
    "heaviness": 6,
    "ingredients": [
      "kuru fasulye",
      "kuru soğan",
      "domates salçası",
      "biber salçası",
      "tereyağı",
      "zeytinyağı"
    ]
  }
];
export const DB_CARBS = [
  {
    "id": "c1",
    "name": "Tereyağlı Şehriyeli Pilav",
    "type": "LOCAL",
    "cost": 30,
    "time": 25,
    "heaviness": 5,
    "ingredients": [
      "pirinç",
      "tereyağı",
      "arpa şehriye",
      "tuz",
      "ayçiçek yağı"
    ]
  },
  {
    "id": "c2",
    "name": "Meyhaneli Bulgur Pilavı",
    "type": "LOCAL",
    "cost": 25,
    "time": 30,
    "heaviness": 4,
    "ingredients": [
      "bulgur",
      "domates",
      "sivri biber",
      "kuru soğan",
      "zeytinyağı",
      "domates salçası"
    ]
  },
  {
    "id": "c3",
    "name": "Fırınlanmış Baharatlı Patates",
    "type": "FOREIGN",
    "cost": 25,
    "time": 40,
    "heaviness": 3,
    "ingredients": [
      "patates",
      "zeytinyağı",
      "kekik",
      "sarımsak",
      "pul biber"
    ]
  },
  {
    "id": "c4",
    "name": "Sebzeli Kinoa",
    "type": "FOREIGN",
    "cost": 60,
    "time": 20,
    "heaviness": 2,
    "ingredients": [
      "kinoa",
      "havuç",
      "kabak",
      "zeytinyağı",
      "tuz"
    ]
  },
  {
    "id": "c5",
    "name": "Penne Arabiata",
    "type": "FOREIGN",
    "cost": 45,
    "time": 20,
    "heaviness": 5,
    "ingredients": [
      "penne",
      "domates",
      "sarımsak",
      "pul biber",
      "zeytinyağı"
    ]
  },
  {
    "id": "c6",
    "name": "Sade Erişte",
    "type": "LOCAL",
    "cost": 20,
    "time": 15,
    "heaviness": 4,
    "ingredients": [
      "erişte",
      "tereyağı",
      "tuz"
    ]
  },
  {
    "id": "c7",
    "name": "Mısırlı Pirinç Pilavı",
    "type": "LOCAL",
    "cost": 35,
    "time": 25,
    "heaviness": 4,
    "ingredients": [
      "pirinç",
      "mısır",
      "tereyağı",
      "zeytinyağı"
    ]
  }
];
export const DB_SIDES = [
  {
    "id": "sd1",
    "name": "Çoban Salata",
    "type": "LOCAL",
    "cost": 35,
    "time": 10,
    "heaviness": 1,
    "ingredients": [
      "domates",
      "salatalık",
      "kuru soğan",
      "sivri biber",
      "zeytinyağı",
      "limon",
      "tuz"
    ]
  },
  {
    "id": "sd2",
    "name": "Naneli Cacık",
    "type": "LOCAL",
    "cost": 25,
    "time": 5,
    "heaviness": 1,
    "ingredients": [
      "yoğurt",
      "salatalık",
      "nane",
      "sarımsak",
      "zeytinyağı"
    ]
  },
  {
    "id": "sd3",
    "name": "Humus",
    "type": "LOCAL",
    "cost": 40,
    "time": 15,
    "heaviness": 4,
    "ingredients": [
      "nohut",
      "tahin",
      "kimyon",
      "sarımsak",
      "zeytinyağı",
      "limon"
    ]
  },
  {
    "id": "sd4",
    "name": "Roka Parmesan Salata",
    "type": "FOREIGN",
    "cost": 60,
    "time": 5,
    "heaviness": 2,
    "ingredients": [
      "roka",
      "parmesan",
      "zeytinyağı",
      "sirke",
      "tuz"
    ]
  },
  {
    "id": "sd5",
    "name": "Gavurdağı Salatası",
    "type": "LOCAL",
    "cost": 50,
    "time": 15,
    "heaviness": 2,
    "ingredients": [
      "domates",
      "ceviz",
      "nar ekşisi",
      "kuru soğan",
      "maydanoz",
      "zeytinyağı",
      "pul biber"
    ]
  },
  {
    "id": "sd6",
    "name": "Havuç Tarator",
    "type": "LOCAL",
    "cost": 25,
    "time": 10,
    "heaviness": 2,
    "ingredients": [
      "havuç",
      "yoğurt",
      "sarımsak",
      "süzme yoğurt",
      "zeytinyağı"
    ]
  },
  {
    "id": "sd7",
    "name": "Zeytinyağlı Kereviz",
    "type": "LOCAL",
    "cost": 40,
    "time": 40,
    "heaviness": 2,
    "ingredients": [
      "kereviz",
      "havuç",
      "patates",
      "zeytinyağı",
      "portakal"
    ]
  },
  {
    "id": "sd8",
    "name": "Haydari",
    "type": "LOCAL",
    "cost": 30,
    "time": 5,
    "heaviness": 1,
    "ingredients": [
      "süzme yoğurt",
      "nane",
      "dereotu",
      "sarımsak",
      "zeytinyağı"
    ]
  }
];

export const DB_SALADS = [
  {
    "id": "sal1",
    "name": "Taze Mevsim Salatası",
    "type": "LOCAL",
    "cost": 25,
    "time": 10,
    "heaviness": 1,
    "ingredients": ["marul", "salatalık", "domates", "havuç", "mısır", "zeytinyağı", "limon"],
    "recipeDesc": "1. Marul ve yeşillikleri bol suda yıkayıp kurulayın.\n2. Domates, salatalık ve havuçları ince ince doğrayın.\n3. Zengin zeytinyağı, limon ve bir çimdik tuz ile harmanlayıp taze servis edin."
  },
  {
    "id": "sal2",
    "name": "Geleneksel Çoban Salatası",
    "type": "LOCAL",
    "cost": 30,
    "time": 10,
    "heaviness": 1,
    "ingredients": ["domates", "salatalık", "kuru soğan", "yeşil biber", "maydanoz", "zeytinyağı", "sirke"],
    "recipeDesc": "1. Tüm sebzeleri tavla zarı büyüklüğünde minik küpler halinde doğrayın.\n2. Ince kıyılmış maydanozu ekleyin.\n3. Sızma zeytinyağı, elma sirkesi ve tuz gezdirip iyice karıştırın."
  },
  {
    "id": "sal3",
    "name": "Cevizli Gavurdağı Salatası",
    "type": "LOCAL",
    "cost": 55,
    "time": 15,
    "heaviness": 2,
    "ingredients": ["domates", "ceviz", "nar ekşisi", "kuru soğan", "maydanoz", "zeytinyağı", "pul biber"],
    "recipeDesc": "1. Domates ve soğanları çok ince kıyın.\n2. Bol kırıklanmış ceviz içini ekleyin.\n3. Hakiki nar ekşisi, zeytinyağı ve pul biber ile lezzetlendirip servis edin."
  },
  {
    "id": "sal4",
    "name": "Sezar Salata (Tavuklu & Parmesanlı)",
    "type": "FOREIGN",
    "cost": 85,
    "time": 20,
    "heaviness": 3,
    "ingredients": ["tavuk göğsü", "akdeniz yeşillikleri", "parmesan", "kruton ekmek", "sezar sos", "zeytinyağı"],
    "recipeDesc": "1. Tavuk göğsünü ızgarada pişirip ince dilimleyin.\n2. Taze akdeniz yeşilliklerini geniş kaseye alın.\n3. Kruton ekmekler, parmesan rendesi ve tavuk dilimleri ile süsleyip sezar sos gezdirin."
  },
  {
    "id": "sal5",
    "name": "Ege Otlu & Beyaz Peynirli Akdeniz Salatası",
    "type": "LOCAL",
    "cost": 45,
    "time": 10,
    "heaviness": 2,
    "ingredients": ["akdeniz yeşillikleri", "beyaz peynir", "siyah zeytin", "ceviz", "zeytinyağı", "nar ekşisi"],
    "recipeDesc": "1. Yeşillikleri kıyıp servis tabağına yayın.\n2. Üzerine küp küp doğranmış beyaz peynir, zeytin ve ceviz serpiştirin.\n3. Sızma zeytinyağı ve nar ekşisi dökerek tamamlayın."
  }
];

export const DB_DESSERTS = [
  {
    "id": "des1",
    "name": "Geleneksel Fırın Sütlaç",
    "type": "LOCAL",
    "cost": 35,
    "time": 45,
    "heaviness": 3,
    "ingredients": ["süt", "pirinç", "şeker", "nişasta", "vanilya", "yumurta sarısı"],
    "recipeDesc": "1. Pirinci haşlayıp süt ve şeker ile kaynatın.\n2. Nişastayı az suda açıp kıvam alması için tencereye ekleyin.\n3. Isıya dayanıklı güveçlere paylaştırıp fırının üst ızgarasında üzeri kızarana kadar pişirin."
  },
  {
    "id": "des2",
    "name": "Antep Fıstıklı Ev Baklavası",
    "type": "LOCAL",
    "cost": 120,
    "time": 60,
    "heaviness": 5,
    "ingredients": ["baklavalık yufka", "antep fıstığı", "tereyağı", "şeker", "su", "limon suyu"],
    "recipeDesc": "1. İncecik baklava yufkalarının arasına eritilmiş tereyağı sürerek kat kat dizin.\n2. Orta kata bol çekilmiş Antep fıstığı yayın.\n3. Dilimleyip fırınlayın, sıcak baklavaya ılık şerbet dökün."
  },
  {
    "id": "des3",
    "name": "Karamelli Trileçe",
    "type": "FOREIGN",
    "cost": 65,
    "time": 50,
    "heaviness": 4,
    "ingredients": ["un", "yumurta", "şeker", "süt", "krema", "karamel sosu"],
    "recipeDesc": "1. Yumuşacık kek tabanını pişirip çatalla delikler açın.\n2. Süt ve krema karışımını kekin üzerine döküp çekmesini bekleyin.\n3. En üst kısıma ev yapımı karamel sosu döküp soğuk servis edin."
  },
  {
    "id": "des4",
    "name": "Çilekli Magnolia",
    "type": "FOREIGN",
    "cost": 50,
    "time": 25,
    "heaviness": 3,
    "ingredients": ["süt", "un", "nişasta", "şeker", "çilek", "bisküvi", "krema"],
    "recipeDesc": "1. İpeksi muhallebiyi pişirip soğuduktan sonra krema ile çırpın.\n2. Kuplara çekilmiş bisküvi ve taze çilek dilimleri dizin.\n3. Kat kat muhallebi ve bisküvi yerleştirip buzdolabında soğutun."
  },
  {
    "id": "des5",
    "name": "Dondurmalı İrmik Helvası",
    "type": "LOCAL",
    "cost": 40,
    "time": 30,
    "heaviness": 4,
    "ingredients": ["irmik", "tereyağı", "şeker", "süt", "maraş dondurması", "dolmalık fıstık"],
    "recipeDesc": "1. İrmiği ve fıstıkları tereyağında pembeleşene kadar kavurun.\n2. Sıcak süt ve şeker şerbetini verip demlenmeye bırakın.\n3. Kaseye helva koyup ortasına Maraş dondurması gizleyerek ters çevirin."
  }
];