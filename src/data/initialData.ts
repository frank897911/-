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
  tripTitle: '東北仙台 ‧ 楓葉溫泉美食六日遊',
  startDate: '2026-10-08',
  endDate: '2026-10-13',
  coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  pinCode: '007',
  exchangeRateJpyToTwd: 0.215,
  totalBudgetTwd: 60000,
  days: [
    {
      id: 'day-1',
      dayNumber: 1,
      date: '2026-10-08',
      title: 'Day 1: 啟程飛往仙台 ‧ 仙台車站與極上牛舌巡禮',
      cityRegion: '仙台 Sendai',
      weather: {
        dayId: 'day-1',
        city: '仙台 Sendai',
        condition: 'sunny',
        tempHigh: 21,
        tempLow: 13,
        rainProb: 10,
        clothesTip: '秋季氣候涼爽宜人，建議穿著薄外套或風衣。',
        usagiNote: '抵達仙台機場後搭乘 Sendaisundai Airport Transit 僅需 25 分鐘直達市中心！'
      },
      items: [
        {
          id: 'item-1-1',
          dayId: 'day-1',
          time: '08:45',
          title: '桃園國際機場 (TPE) 登機',
          category: 'transport',
          locationName: '桃園國際機場 第一航廈',
          address: '桃園市大園區航站南路9號',
          mapQuery: '桃園國際機場 第一航廈',
          estimatedCostJpy: 0,
          durationMinutes: 120,
          notes: '預先完成網路報到，準備好護照與 Visit Japan Web QR Code',
          completed: false,
          transportType: 'flight',
          origin: 'TPE 桃園',
          destination: 'SDJ 仙台'
        },
        {
          id: 'item-1-2',
          dayId: 'day-1',
          time: '13:10',
          title: '抵達仙台機場 (SDJ) ‧ 辦理入境',
          category: 'transport',
          locationName: '仙台機場 Sendai Airport',
          address: '宮城縣名取市下増田字南原',
          mapQuery: 'Sendai Airport',
          durationMinutes: 45,
          notes: '提領行李、出示 VJW QR Code 快速通關',
          completed: false
        },
        {
          id: 'item-1-3',
          dayId: 'day-1',
          time: '14:30',
          title: 'Times Car Rental 仙台機場店取車',
          category: 'transport',
          locationName: 'Times Car Rental 仙台空港店',
          address: '宮城縣名取市下増田字原12-1',
          mapQuery: 'Times Car Rental Sendai Airport',
          carMapCode: '110 585 304*88',
          notes: '準備台灣駕照 + 日文譯本 + 護照，確認租車 ETC 卡',
          completed: false,
          carRentalCompany: 'Times Car Rental'
        },
        {
          id: 'item-1-4',
          dayId: 'day-1',
          time: '18:00',
          title: '閣 牛舌 品牌本店 (牛たん料理 閣)',
          category: 'restaurant',
          locationName: '牛たん料理 閣 ブランドーム本店',
          address: '宮城縣仙台市青葉區一番町3-8-14',
          mapQuery: '牛たん料理 閣 ブランドーム本店',
          estimatedCostJpy: 3500,
          durationMinutes: 75,
          mustEatDishes: '特選厚切炭燒牛舌定食、刺身級牛舌薄片',
          notes: '開店前 20 分鐘抵達排隊，外皮微焦香、口感Q彈多汁！',
          completed: false,
          bookingStatus: 'walk-in'
        }
      ]
    },
    {
      id: 'day-2',
      dayNumber: 2,
      date: '2026-10-09',
      title: 'Day 2: 日本三景松島海岸 ‧ 瑞嚴寺與烤蒲鉾DIY',
      cityRegion: '松島 Matsushima',
      weather: {
        dayId: 'day-2',
        city: '松島 Matsushima',
        condition: 'sunny',
        tempHigh: 22,
        tempLow: 14,
        rainProb: 0,
        clothesTip: '海岸邊海風較大，可準備防風圍巾或薄連帽外套。',
        usagiNote: '松島海岸有超讚的現烤牡蠣與阿部蒲鉾店 DIY 手烤魚板！'
      },
      items: [
        {
          id: 'item-2-1',
          dayId: 'day-2',
          time: '09:30',
          title: '日本三景 ‧ 松島遊覽船觀光',
          category: 'spot',
          locationName: '松島海岸遊覽船乘船所',
          address: '宮城縣宮城郡松島町松島町內85',
          mapQuery: 'Matsushima Ferry Terminal',
          carMapCode: '110 401 228*11',
          estimatedCostJpy: 1500,
          durationMinutes: 90,
          notes: '欣賞仁王島、鐘島等松島灣百座奇岩松島美景',
          completed: false
        },
        {
          id: 'item-2-2',
          dayId: 'day-2',
          time: '12:00',
          title: '阿部蒲鉾店 松島店 (手烤魚板DIY)',
          category: 'restaurant',
          locationName: '阿部蒲鉾店 松島店',
          address: '宮城縣宮城郡松島町松島町內29',
          mapQuery: 'Abe Kamaboko Matsushima',
          estimatedCostJpy: 300,
          mustEatDishes: '手烤竹葉魚板、毛豆泥起司球',
          notes: '親手炭烤熱騰騰金黃蒲鉾，香氣四溢！',
          completed: false
        }
      ]
    },
    {
      id: 'day-3',
      dayNumber: 3,
      date: '2026-10-10',
      title: 'Day 3: 藏王狐狸村 ‧ 抱抱可愛紅狐與遠刈田溫泉',
      cityRegion: '藏王 Zao',
      weather: {
        dayId: 'day-3',
        city: '藏王 Zao',
        condition: 'partly_cloudy',
        tempHigh: 18,
        tempLow: 9,
        rainProb: 20,
        clothesTip: '山區氣溫較低，建議多層次穿搭與保暖外套。',
        usagiNote: '抱狐狸體驗每日有固定場次，請攜帶黑白色以外的厚手套！'
      },
      items: [
        {
          id: 'item-3-1',
          dayId: 'day-3',
          time: '10:00',
          title: '宮城藏王狐狸村 (宮城蔵王キツネ村)',
          category: 'spot',
          locationName: '宮城蔵王キツネ村',
          address: '宮城縣白石市福岡八宮川原子11-3',
          mapQuery: 'Miyagi Zao Fox Village',
          carMapCode: '569 139 311*05',
          estimatedCostJpy: 1000,
          durationMinutes: 120,
          notes: '超過100隻自由奔跑的狐狸，請務必遵照園區規定，口袋物品放妥。',
          completed: false
        }
      ]
    },
    {
      id: 'day-4',
      dayNumber: 4,
      date: '2026-10-11',
      title: 'Day 4: 寶珠山立石寺 (山寺) ‧ 登上千級石階俯瞰絕景',
      cityRegion: '山形 Yamagata',
      weather: {
        dayId: 'day-4',
        city: '山形 Yamagata',
        condition: 'sunny',
        tempHigh: 19,
        tempLow: 10,
        rainProb: 10,
        clothesTip: '登山需走 1015 階石階，請務必穿著舒適好走運動鞋。',
        usagiNote: '爬完山寺下山後來一碗蒟蒻串與力餅！'
      },
      items: []
    },
    {
      id: 'day-5',
      dayNumber: 5,
      date: '2026-10-12',
      title: 'Day 5: 仙台城跡 伊達政宗騎馬像 ‧ 定禪寺通櫸樹大道漫步',
      cityRegion: '仙台 Sendai',
      weather: {
        dayId: 'day-5',
        city: '仙台 Sendai',
        condition: 'partly_cloudy',
        tempHigh: 20,
        tempLow: 12,
        rainProb: 15,
        clothesTip: '市區散步天氣舒適。',
        usagiNote: '青葉城跡可一覽整個仙台市區與太平洋視野！'
      },
      items: []
    },
    {
      id: 'day-6',
      dayNumber: 6,
      date: '2026-10-13',
      title: 'Day 6: 滿載而歸 ‧ 仙台免稅店採買與返抵台灣',
      cityRegion: '仙台 Sendai',
      weather: {
        dayId: 'day-6',
        city: '仙台 Sendai',
        condition: 'sunny',
        tempHigh: 21,
        tempLow: 13,
        rainProb: 10,
        clothesTip: '準備輕鬆穿著上飛機。',
        usagiNote: '仙台機場免稅店記得購買萩之月 (萩の月) 與毛豆奶昔！'
      },
      items: []
    }
  ],
  gourmetList: [
    {
      id: 'g-1',
      name: '閣 牛舌 品牌本店',
      japaneseName: '牛たん料理 閣',
      area: '仙台一番町',
      cuisineCategory: '牛舌',
      rating: 5,
      priceRangeJpy: '¥3,000 - ¥5,000',
      address: '宮城縣仙台市青葉區一番町3-8-14',
      mapQuery: '牛たん料理 閣 ブランドーム本店',
      isReserved: false,
      visited: false,
      mustOrder: '特選厚切炭燒牛舌定食、牛舌刺身',
      notes: '極具人氣的仙台在地牛舌代表店！',
      googleRating: 4.6
    },
    {
      id: 'g-2',
      name: '善治郎 仙台站前本店',
      japaneseName: 'たんや善治郎',
      area: '仙台車站',
      cuisineCategory: '牛舌',
      rating: 5,
      priceRangeJpy: '¥2,500 - ¥4,500',
      address: '宮城縣仙台市青葉區中央1-8-38',
      mapQuery: 'たんや善治郎 仙台駅前本店',
      isReserved: false,
      visited: false,
      mustOrder: '真中牛舌定食、特製高湯牛尾湯',
      notes: '傳統炭火鹽烤，極度鮮美多汁',
      googleRating: 4.5
    },
    {
      id: 'g-3',
      name: '毛豆茶寮 (Zundasaryo) 仙台站店',
      japaneseName: 'ずんだ茶寮',
      area: '仙台車站 3F',
      cuisineCategory: '甜點 / 毛豆',
      rating: 5,
      priceRangeJpy: '¥400 - ¥1,000',
      address: '仙台站 3F 綠色窗口旁',
      mapQuery: 'ずんだ茶寮 仙台駅店',
      isReserved: false,
      visited: false,
      mustOrder: 'Zunda Shake 濃郁毛豆泥奶昔、毛豆餅',
      notes: '仙台必喝神級奶昔，口感滑順清香！',
      googleRating: 4.7
    }
  ],
  shoppingList: [
    {
      id: 's-1',
      name: '菓匠三全 萩之月 (萩の月) 8入禮盒',
      japaneseName: '萩の月 8個入',
      category: '伴手禮',
      preferredStore: '仙台車站 1F / 仙台機場免稅店',
      priceJpy: 1600,
      quantity: 3,
      isTaxFree: true,
      isBought: false,
      notes: '仙台第一名必買名產！柔軟蛋糕包覆卡士達內餡',
      imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 's-2',
      name: '合立他命 Alinamin EX Plus 270錠',
      japaneseName: 'アリナミンEXプラス 270錠',
      category: '藥妝',
      preferredStore: '松本清 Matsumoto Kiyoshi / Sundrug',
      priceJpy: 5500,
      quantity: 2,
      isTaxFree: true,
      isBought: true,
      notes: '買金色瓶身 270錠最有折扣，減緩眼睛酸澀與肩頸僵硬',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 's-3',
      name: '大正百保能感冒微粒 Gold A 44包',
      japaneseName: 'パブロンゴールドA微粒 44包',
      category: '藥妝',
      preferredStore: '唐吉訶德 Donki',
      priceJpy: 1480,
      quantity: 2,
      isTaxFree: true,
      isBought: false,
      notes: '家中常備藥品，微粒好吸收',
      imageUrl: ''
    }
  ],
  flights: [
    {
      id: 'f-out',
      type: 'outbound',
      airline: '星宇航空 Starlux Airlines',
      flightNo: 'JX840',
      date: '2026-10-08',
      departureAirport: 'TPE 桃園國際機場 T1',
      departureTime: '08:45',
      arrivalAirport: 'SDJ 仙台國際機場',
      arrivalTime: '13:10',
      gate: 'B6',
      terminal: 'T1',
      seatNo: '12A, 12B',
      bookingReference: 'SLX-982071'
    },
    {
      id: 'f-in',
      type: 'inbound',
      airline: '星宇航空 Starlux Airlines',
      flightNo: 'JX841',
      date: '2026-10-13',
      departureAirport: 'SDJ 仙台國際機場',
      departureTime: '14:20',
      arrivalAirport: 'TPE 桃園國際機場 T1',
      arrivalTime: '17:05',
      gate: 'A3',
      terminal: 'Main',
      seatNo: '12A, 12B',
      bookingReference: 'SLX-982071'
    }
  ],
  hotels: [
    {
      id: 'h-1',
      name: '仙台大都會飯店 (Hotel Metropolitan Sendai)',
      japaneseName: 'ホテルメトロポリタン仙台',
      address: '宮城縣仙台市青葉區中央1-1-1',
      phone: '+81-22-268-2525',
      checkInDate: '2026-10-08',
      checkOutDate: '2026-10-13',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      bookingRef: 'AGD-8829104',
      mapCode: '110 585 201*33',
      mapQuery: 'Hotel Metropolitan Sendai',
      notes: '與仙台車站直通！極度方便，房內提供加濕空氣清淨機。'
    }
  ],
  expenses: [
    {
      id: 'ex-1',
      date: '2026-10-08',
      itemTitle: 'Times 租車 6天含全險與ETC卡',
      category: 'transport',
      amountJpy: 48000,
      amountTwd: 10320,
      paymentMethod: 'credit_card',
      payer: '阿呆',
      splitType: 'equal',
      splitMembers: ['阿呆', '小雞'],
      notes: '包含 NOC 安心保險與 ETC 租借費'
    },
    {
      id: 'ex-2',
      date: '2026-10-08',
      itemTitle: '閣 牛舌 晚餐 2人聚餐',
      category: 'food',
      amountJpy: 7100,
      amountTwd: 1526,
      paymentMethod: 'cash',
      payer: '小雞',
      splitType: 'equal',
      splitMembers: ['阿呆', '小雞'],
      notes: '包含特選厚切定食與生啤酒'
    }
  ],
  journals: [
    {
      id: 'j-1',
      date: '2026-10-08',
      title: '踏上日本東北！阿呆與小雞終於吃到神級閣牛舌 🥩',
      author: '阿呆',
      moodEmoji: '🍣',
      content: '今天阿呆與小雞順利搭乘星宇航空抵達仙台！出關非常迅速，租好 Times 汽車後第一站直接衝向【閣 牛舌】。炭烤香氣撲鼻，厚切的口感脆彈多汁，兩個人都吃得超級滿足！',
      imageUrls: [
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
      ],
      likesCount: 5,
      location: '牛たん料理 閣 ブランドーム本店'
    }
  ],
  checklists: [
    {
      id: 'c-1',
      category: 'todo',
      type: 'todo',
      title: '填寫 Visit Japan Web (入境與海關申報)',
      assignee: '全體',
      assignedTo: '全體',
      completed: true,
      priority: 'high',
      notes: '請大家截圖保存 QR Code 於手機相簿'
    },
    {
      id: 'c-2',
      category: 'todo',
      type: 'todo',
      title: '開通海外漫遊 eSIM 或 Wi-Fi 分享器',
      assignee: '阿呆',
      assignedTo: '阿呆',
      completed: true,
      priority: 'high',
      notes: '已預訂每日無上限吃到飽 eSIM'
    },
    {
      id: 'c-3',
      category: 'packing',
      type: 'packing',
      title: '護照正本 + 護照影本 2張',
      assignee: '全體',
      assignedTo: '全體',
      completed: false,
      priority: 'high',
      notes: '確認護照有效期需有6個月以上'
    },
    {
      id: 'c-4',
      category: 'packing',
      type: 'packing',
      title: '台灣駕照正本 + 日文翻譯本',
      assignee: '阿呆',
      assignedTo: '阿呆',
      completed: true,
      priority: 'high',
      notes: '租車必備！兩者皆需隨身攜帶'
    },
    {
      id: 'c-5',
      category: 'shopping',
      type: 'shopping',
      title: '合利他命 EX Plus 270錠',
      assignee: '小雞',
      assignedTo: '小雞',
      completed: false,
      priority: 'high',
      targetStore: '松本清 / 唐吉訶德',
      notes: '幫家裡代購 2 瓶'
    },
    {
      id: 'c-6',
      category: 'shopping',
      type: 'shopping',
      title: 'EVE A錠 止痛藥 60錠',
      assignee: '阿呆',
      assignedTo: '阿呆',
      completed: false,
      priority: 'medium',
      targetStore: 'Sundrug 藥局'
    }
  ],
  members: [
    {
      id: 'm-1',
      name: '阿呆',
      role: '隊長 / 總召',
      avatar: '🐱',
      phone: '0912-345-678',
      isCurrentUser: true,
      notes: '總召與主要規劃者'
    },
    {
      id: 'm-2',
      name: '小雞',
      role: '副隊長 / 掌櫃',
      avatar: '🐥',
      phone: '0923-456-789',
      notes: '隨行成員與掌櫃'
    }
  ],
  vouchers: [
    {
      id: 'v-1',
      title: '星宇航空 仙台電子機票與訂位憑證',
      type: 'flight',
      referenceNo: 'SLX-982071',
      isPinProtected: true,
      notes: '登機時請出示護照與訂位代號 SLX-982071'
    },
    {
      id: 'v-2',
      title: 'Hotel Metropolitan Sendai 住宿確認單',
      type: 'hotel',
      referenceNo: 'AGD-8829104',
      isPinProtected: false,
      notes: '含 4 人雙床房 5 晚入住，已信用卡預付完成'
    },
    {
      id: 'v-3',
      title: 'Times Rent-a-Car 租車預約單',
      type: 'car',
      referenceNo: 'TMS-20261008-88',
      isPinProtected: true,
      notes: '仙台空港店取車，休旅車 (Serena / Stepwgn 級別)'
    }
  ]
};
