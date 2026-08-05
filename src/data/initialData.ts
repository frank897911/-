import { TravelAppData, EmergencyContact } from '../types';

export const emergencyContactsList: EmergencyContact[] = [
  {
    id: 'em-1',
    category: 'police',
    title: '日本警察局 (緊急通報)',
    phone: '110',
    description: '交通事故、車禍事故、財物遭竊通報 (車輛事故請務必報警取得事故證明書)',
    tips: '若不懂日文，可向接線員重複說：「Japanese English please」或「Taiwanese/Chinese please」。'
  },
  {
    id: 'em-2',
    category: 'medical',
    title: '救護車 / 消防局',
    phone: '119',
    description: '突發急性疾病、意外受傷、緊急醫療救護',
    tips: '報案時請先說明是「火事 (Kaji/火災)」還是「急病 (Kyubyo/急病)」。'
  },
  {
    id: 'em-3',
    category: 'embassy',
    title: '台北駐日經濟文化代表處 (東京)',
    phone: '+81-3-3280-7111',
    address: '東京都港區白金台5-20-2',
    description: '國人在日本遭遇重大緊急急難救助 (24小時緊急專線: +81-80-1006-7880)',
    tips: '護照遺失、重大交通事故、緊急醫療支援服務。'
  },
  {
    id: 'em-4',
    category: 'passport',
    title: '護照遺失緊急處理須知',
    phone: '+81-80-1006-7880',
    description: '1. 至當地警察署報案開立「遺失證明(盜難屆)」\n2. 準備身分證件影本、大頭照2張\n3. 前往駐日代表處申請入國證明書。',
  },
  {
    id: 'em-5',
    category: 'translator',
    title: 'JNTO 日本政府觀光局 24小時多語通譯',
    phone: '+81-50-3816-2720',
    description: '提供繁體中文/英文 24小時旅遊諮詢與緊急口譯支援服務',
  },
  {
    id: 'em-6',
    category: 'card_loss',
    title: '海外信用卡掛失與保險專線',
    phone: '+886-2-2521-1234',
    description: '富邦/國泰/玉山 海外緊急刷卡授權與海外突發疾病醫療保險報案中心'
  }
];

export const initialTravelData: TravelAppData = {
  tripTitle: '東京 & 富士山河口湖 6日夢幻隨行',
  startDate: '2026-10-15',
  endDate: '2026-10-20',
  exchangeRateJpyToTwd: 0.215, // 1 JPY = 0.215 TWD
  totalBudgetTwd: 65000,
  days: [
    {
      id: 'day-1',
      dayNumber: 1,
      date: '2026-10-15',
      title: 'Day 1: 抵達東京 ‧ 成田取車與新宿散策',
      cityRegion: '東京 Tokyo',
      weather: {
        dayId: 'day-1',
        city: '東京 Tokyo',
        condition: 'partly_cloudy',
        tempHigh: 22,
        tempLow: 15,
        rainProb: 10,
        clothesTip: '氣候涼爽宜人，建議穿著長袖薄外套 🧥',
        usagiNote: '兔兔提醒：抵達日本記得先在機場換好 Suica 交通卡喔！ฅ\'ω\'ฅ'
      },
      items: [
        {
          id: 'item-101',
          dayId: 'day-1',
          time: '12:50',
          title: '成田國際機場 (NRT) 抵達與入境領行李',
          category: 'transport',
          locationName: '成田國際機場 第二航廈',
          address: 'Chiba, Narita, Furugome, 1-1',
          mapQuery: 'Narita International Airport Terminal 2',
          notes: '請預先填寫 Visit Japan Web 快速通關 QR code',
          completed: true,
          transportType: 'flight'
        },
        {
          id: 'item-102',
          dayId: 'day-1',
          time: '14:00',
          title: 'Toyota Rent-a-Car 租車櫃檯取車 (富士山自駕開端)',
          category: 'transport',
          locationName: 'Toyota Rent a Car Narita Airport Terminal 2',
          address: '千葉県成田市古込1-1',
          mapQuery: 'Toyota Rent a Car Narita Airport Terminal 2',
          carMapCode: '137 703 125*44',
          notes: '核對台灣駕照正本 + 駕照日文譯本 + 護照，確認包含 ETC 卡與全險',
          completed: true,
          transportType: 'car',
          carRentalCompany: 'Toyota Rent-a-Car'
        },
        {
          id: 'item-103',
          dayId: 'day-1',
          time: '16:30',
          title: '入住新宿 Hotel Gracery Shinjuku (哥吉拉飯店)',
          category: 'spot',
          locationName: 'Hotel Gracery Shinjuku',
          address: '東京都新宿区歌舞伎町1-19-1',
          mapQuery: 'Hotel Gracery Shinjuku',
          carMapCode: '10 076 654*28',
          notes: '飯店設有室內特約地下停車場，登記入住並放置行李',
          completed: false,
          openingHours: '15:00 Check-in'
        },
        {
          id: 'item-104',
          dayId: 'day-1',
          time: '18:00',
          title: '晚餐：AFURI 阿夫利拉麵 (新宿 LUMINE 1)',
          category: 'restaurant',
          locationName: 'AFURI 新宿 LUMINE 1 B2',
          address: '東京都新宿区西新宿1-1-5 LUMINE1 B2F',
          mapQuery: 'AFURI Shinjuku Lumine 1',
          notes: '招牌必點：柚子鹽拉麵與炙燒叉燒飯 🍜',
          completed: false,
          cuisineType: '日式拉麵',
          bookingStatus: 'walk-in',
          mustEatDishes: '柚子鹽拉麵 (淡麗系)、炙燒豬肉飯',
          estimatedCostJpy: 1800
        },
        {
          id: 'item-105',
          dayId: 'day-1',
          time: '20:00',
          title: '新宿歌舞伎町 3D 巨貓牆 & 東京都廳夜景',
          category: 'spot',
          locationName: '東京都廳展望台',
          address: '東京都新宿区西新宿2-8-1',
          mapQuery: 'Tokyo Metropolitan Government Building',
          carMapCode: '10 043 854*11',
          notes: '都廳南展望室免費開放至 22:00，可遠眺東京夜景',
          completed: false,
          openingHours: '09:30 - 22:00 (免費)'
        }
      ]
    },
    {
      id: 'day-2',
      dayNumber: 2,
      date: '2026-10-16',
      title: 'Day 2: 富士山河口湖自駕 ‧ 新倉山淺間神社與纜車',
      cityRegion: '河口湖 Fujikawaguchiko',
      weather: {
        dayId: 'day-2',
        city: '河口湖 Fujikawaguchiko',
        condition: 'sunny',
        tempHigh: 18,
        tempLow: 8,
        rainProb: 0,
        clothesTip: '山區早晚溫差大！請準備保暖風衣與圍巾 🧣',
        usagiNote: 'P助說：今天是無雲大晴天！富士山超清晰，一定要拍爆相機記憶體！📷'
      },
      items: [
        {
          id: 'item-201',
          dayId: 'day-2',
          time: '08:00',
          title: '中央自動車道自駕專車前往河口湖 (約 1.5 小時)',
          category: 'transport',
          locationName: '新宿 IC ➔ 河口湖 IC',
          mapQuery: 'Kawaguchiko IC',
          carMapCode: '161 301 228*11',
          drivingDistanceMinutes: 90,
          notes: '全程行走中央道，通過高井戶IC，記得開啟 ETC 快速通道',
          completed: false,
          transportType: 'car'
        },
        {
          id: 'item-202',
          dayId: 'day-2',
          time: '10:00',
          title: '新倉山淺間公園 (忠靈塔 富士山絕景)',
          category: 'spot',
          locationName: '新倉山淺間公園',
          address: '山梨県富士吉田市浅間2-4-1',
          mapQuery: 'Arakurayama Sengen Park',
          carMapCode: '161 249 778*55',
          notes: '攀登 398 階咲耶姬階段，景色極佳！園區有免費停車場',
          completed: false,
          durationMinutes: 90
        },
        {
          id: 'item-203',
          dayId: 'day-2',
          time: '12:30',
          title: '午餐：ほうとう不動 (餺飥不動 河口湖北本店)',
          category: 'restaurant',
          locationName: 'Houtou Fudou Kawaguchiko',
          address: '山梨県南都留郡富士河口湖町河口707',
          mapQuery: 'Houtou Fudou Kawaguchiko Kita Main Shop',
          carMapCode: '161 391 102*00',
          notes: '特色造型白色雲朵建築，山梨名物蔬菜鐵鍋餺飥麵包',
          completed: false,
          cuisineType: '山梨名物鄉土料理',
          mustEatDishes: '名物不動餺飥麵 (ほうとう)、馬刺し',
          estimatedCostJpy: 1650
        },
        {
          id: 'item-204',
          dayId: 'day-2',
          time: '15:00',
          title: '河口湖富士山全景纜車 & 大石公園薰衣草/掃帚草',
          category: 'spot',
          locationName: '大石公園 (Oishi Park)',
          address: '山梨県南都留郡富士河口湖町大石2585',
          mapQuery: 'Oishi Park Kawaguchiko',
          carMapCode: '161 430 841*66',
          notes: '湖畔邊吃巨峰葡萄霜霜霜淇淋 🍦 邊欣賞逆富士湖景',
          completed: false,
          openingHours: '09:00 - 17:00'
        },
        {
          id: 'item-205',
          dayId: 'day-2',
          time: '18:00',
          title: '入住河口湖溫泉飯店 秀峰閣湖月 (一泊二食)',
          category: 'spot',
          locationName: '秀峰閣 湖月 (Shuhokaku Kogetsu)',
          address: '山梨県南都留郡富士河口湖町河口2312',
          mapQuery: 'Shuhokaku Kogetsu',
          carMapCode: '161 390 850*33',
          notes: '所有客房皆正對富士山與河口湖湖景！享受富士山地下天然溫泉',
          completed: false,
          openingHours: '15:00 Check-in'
        }
      ]
    },
    {
      id: 'day-3',
      dayNumber: 3,
      date: '2026-10-17',
      title: 'Day 3: 鎌倉江之島海景 ‧ 灌籃高手聖地巡禮',
      cityRegion: '鎌倉/江之島 Kamakura',
      weather: {
        dayId: 'day-3',
        city: '鎌倉 Kamakura',
        condition: 'sunny',
        tempHigh: 21,
        tempLow: 14,
        rainProb: 0,
        clothesTip: '海邊風較大，可準備帽子與墨鏡 🕶️',
        usagiNote: '兔兔說：一定要搭一次江之電電車，感受日系海邊文青風！'
      },
      items: [
        {
          id: 'item-301',
          dayId: 'day-3',
          time: '09:30',
          title: '鎌倉高校前平交道 (灌籃高手海景名場面)',
          category: 'spot',
          locationName: '鎌倉高校前車站平交道',
          address: '神奈川県鎌倉市腰越1-1-25',
          mapQuery: 'Kamakurakokomae Station Crossing',
          carMapCode: '15 220 543*12',
          notes: '拍攝電車經過與湘南海岸請保持秩序與交通安全',
          completed: false,
          durationMinutes: 45
        },
        {
          id: 'item-302',
          dayId: 'day-3',
          time: '12:00',
          title: '午餐：江之島 冨士見亭 (海景吻仔魚丼飯)',
          category: 'restaurant',
          locationName: '江之島 富士見亭',
          address: '神奈川県藤沢市江の島2-5-5',
          mapQuery: 'Fujimitei Enoshima',
          notes: '邊吃新鮮生吻仔魚海鮮丼 🐟 邊眺望相模灣富士山景色',
          completed: false,
          cuisineType: '湘南海鮮丼飯',
          mustEatDishes: '生吻仔魚與鮭魚卵雙拼丼、烤大蛤蜊',
          estimatedCostJpy: 2200
        },
        {
          id: 'item-303',
          dayId: 'day-3',
          time: '15:00',
          title: '鎌倉小町通商店街散策 & 鶴岡八幡宮',
          category: 'spot',
          locationName: '鎌倉小町通商店街',
          address: '神奈川県鎌倉市小町1丁目',
          mapQuery: 'Komachi-dori Street Kamakura',
          notes: '品嚐現烤煎餅、宇治抹茶霜淇淋、吉卜力橡子共和國商店',
          completed: false
        }
      ]
    }
  ],
  gourmetList: [
    {
      id: 'g-1',
      name: '叙叙苑 燒肉 (叙々苑 新宿中央東口店)',
      japaneseName: '叙々苑 新宿中央東口店',
      area: '新宿',
      cuisineCategory: '日式高檔燒肉',
      rating: 5,
      priceRangeJpy: '¥3,500 - ¥8,000',
      address: '東京都新宿区新宿3-27-10 武蔵野ビル7F',
      mapQuery: 'Jojoen Shinjuku Chuo Higashiguchi',
      isReserved: true,
      visited: false,
      mustOrder: '午間套餐 (Lunch Set A)、特選上等牛舌、敘敘苑特製沙拉醬',
      notes: '推薦預約午間套餐非常划算！窗邊可看到新宿街景。',
      googleRating: 4.6
    },
    {
      id: 'g-2',
      name: '挽肉と米 (挽肉與米 澀谷店)',
      japaneseName: '挽肉と米 渋谷',
      area: '澀谷',
      cuisineCategory: '現烤炭火漢堡排',
      rating: 5,
      priceRangeJpy: '¥1,800 - ¥2,200',
      address: '東京都渋谷区道玄坂2-28-1 椎津ビル3F',
      mapQuery: 'Hikiniku to Kome Shibuya',
      isReserved: false,
      visited: false,
      mustOrder: '炭火現烤和牛漢堡排套餐 (附新鮮日本羽釜米飯與免費生雞蛋)',
      notes: '需要早上 09:00 親自去現場登記整理券，或網路搶訂。',
      googleRating: 4.5
    },
    {
      id: 'g-3',
      name: '鳴門鯛燒本鋪 (現烤鯛魚燒)',
      japaneseName: '鳴門鯛焼本舗',
      area: '淺草/新宿',
      cuisineCategory: '傳統甜點小吃',
      rating: 4.8,
      priceRangeJpy: '¥280 - ¥350',
      address: '東京都台東区浅草1-28-1',
      mapQuery: 'Naruto Taiyaki Honpo Asakusa',
      isReserved: false,
      visited: true,
      mustOrder: '十勝紅豆天然鯛魚燒、鳴門金時地瓜口味',
      notes: '皮薄香脆，地瓜陷香甜綿密！P助的最愛 🍡',
      googleRating: 4.7
    },
    {
      id: 'g-4',
      name: '金子半之助 晴空塔店 (天丼)',
      japaneseName: '江戸前天丼 金子半之助',
      area: '押上/晴空塔',
      cuisineCategory: '日式天婦羅丼飯',
      rating: 4.5,
      priceRangeJpy: '¥1,500 - ¥2,200',
      address: '東京都墨田区押上1-1-2 東京ソラマチ 3F',
      mapQuery: 'Kaneko Hannosuke Tokyo Solamachi',
      isReserved: false,
      visited: false,
      mustOrder: '江戶前天丼 (大穴子穴子魚、野生大鳳尾蝦、半熟溫泉蛋)',
      notes: '獨門黑麻油淋醬，劃破溫泉蛋混合米飯絕配！',
      googleRating: 4.4
    }
  ],
  shoppingList: [
    {
      id: 's-1',
      name: '合立他命 EX Plus 270錠 (Alinamin EX Plus)',
      japaneseName: 'アリナミンEXプラス 270錠',
      category: '藥妝',
      preferredStore: 'Matsumoto Kiyoshi 松本清 / Sundrug',
      priceJpy: 5980,
      quantity: 2,
      isTaxFree: true,
      isBought: true,
      notes: '家人交代必買保健品，5000日圓以上免稅10%'
    },
    {
      id: 's-2',
      name: 'Panasonic EH-NA0J 高浸透奈米水離子吹風機',
      japaneseName: 'パナソニック ヘアドライヤー ナノケア',
      category: '電器',
      preferredStore: 'BicCamera 新宿西口店 / Yodobashi',
      priceJpy: 38600,
      quantity: 1,
      isTaxFree: true,
      isBought: false,
      notes: '搭配 BicCamera 7% 折價券 + 10% 免稅折扣！記得索取外銷護照優惠'
    },
    {
      id: 's-3',
      name: '東京牛奶起司工廠 蜂蜜高爾根佐拉起司夾心餅乾',
      japaneseName: '東京ミルクチーズ工場',
      category: '伴手禮',
      preferredStore: '成田機場免稅店 / 新宿 LUMINE',
      priceJpy: 1200,
      quantity: 4,
      isTaxFree: true,
      isBought: false,
      notes: '香濃濃郁起司，送給辦公室同事最受歡迎！'
    },
    {
      id: 's-4',
      name: 'Kanahei 兔兔與P助 日本限定聯名玩偶吊飾',
      japaneseName: 'カナヘイの小動物 ぬいぐるみ',
      category: '其他',
      preferredStore: 'Kiddyland 原宿店 / Tokyo Station Character Street',
      priceJpy: 2200,
      quantity: 2,
      isTaxFree: false,
      isBought: true,
      notes: '極具收藏價值的季節限定造型，超可愛！ฅ\'ω\'ฅ'
    },
    {
      id: 's-5',
      name: '7-11 限定 砂糖樹焦糖奶油夾心餅乾 (Sugar Butter Tree)',
      japaneseName: 'シュガーバターの木',
      category: '便利商店',
      preferredStore: '7-Eleven 便利商店',
      priceJpy: 378,
      quantity: 5,
      isTaxFree: false,
      isBought: false,
      notes: '晚間飯店點心，脆餅層次超讚。'
    }
  ],
  flights: [
    {
      id: 'fl-1',
      type: 'outbound',
      airline: '星宇航空 STARLUX Airlines',
      flightNo: 'JX 800',
      date: '2026-10-15',
      departureAirport: 'TPE 台北桃園 T1',
      departureTime: '08:30',
      arrivalAirport: 'NRT 東京成田 T2',
      arrivalTime: '12:50',
      gate: 'B6',
      terminal: 'Terminal 1 ➔ Terminal 2',
      seatNo: '18A, 18B',
      bookingReference: 'JX-89A42K'
    },
    {
      id: 'fl-2',
      type: 'inbound',
      airline: '星宇航空 STARLUX Airlines',
      flightNo: 'JX 801',
      date: '2026-10-20',
      departureAirport: 'NRT 東京成田 T2',
      departureTime: '14:00',
      arrivalAirport: 'TPE 台北桃園 T1',
      arrivalTime: '16:45',
      gate: 'C8',
      terminal: 'Terminal 2 ➔ Terminal 1',
      seatNo: '20A, 20B',
      bookingReference: 'JX-89A42K'
    }
  ],
  hotels: [
    {
      id: 'ht-1',
      name: 'Hotel Gracery Shinjuku (新宿格拉斯麗哥吉拉飯店)',
      japaneseName: 'ホテルグレイスリー新宿',
      address: '東京都新宿区歌舞伎町1-19-1',
      phone: '+81-3-5155-1111',
      checkInDate: '2026-10-15',
      checkOutDate: '2026-10-16',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      bookingRef: 'AGODA-8839210',
      mapCode: '10 076 654*28',
      mapQuery: 'Hotel Gracery Shinjuku',
      notes: '近 JR 新宿站東口，樓下即是東寶影城與歌舞伎町便利店。'
    },
    {
      id: 'ht-2',
      name: '秀峰閣 湖月 (Shuhokaku Kogetsu 富士山湖景溫泉)',
      japaneseName: '秀峰閣 湖月',
      address: '山梨県南都留郡富士河口湖町河口2312',
      phone: '+81-555-76-8888',
      checkInDate: '2026-10-16',
      checkOutDate: '2026-10-18',
      checkInTime: '15:00',
      checkOutTime: '10:00',
      bookingRef: 'JAPANICAN-99214',
      mapCode: '161 390 850*33',
      mapQuery: 'Shuhokaku Kogetsu',
      notes: '包含日式懷石晚餐與早餐自助餐。免費提供近離飯店停車位。'
    }
  ],
  expenses: [
    {
      id: 'exp-1',
      date: '2026-10-15',
      itemTitle: 'Suica 交通卡加值 2人份',
      category: 'transport',
      amountJpy: 10000,
      amountTwd: 2150,
      paymentMethod: 'cash',
      notes: '於成田機場 JR 自動售票機加值現金'
    },
    {
      id: 'exp-2',
      date: '2026-10-15',
      itemTitle: 'AFURI 新宿拉麵 2碗 + 叉燒飯',
      category: 'food',
      amountJpy: 3600,
      amountTwd: 774,
      paymentMethod: 'ic_card',
      notes: '使用 Suica 嗶卡支付'
    },
    {
      id: 'exp-3',
      date: '2026-10-15',
      itemTitle: '合立他命 EX 藥妝購入',
      category: 'shopping',
      amountJpy: 11960,
      amountTwd: 2571,
      paymentMethod: 'credit_card',
      notes: '吉鶴卡刷卡享有額外 3% 回饋'
    }
  ]
};
