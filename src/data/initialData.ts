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
  tripTitle: '仙台之旅',
  startDate: '2026-10-08',
  endDate: '2026-10-13',
  exchangeRateJpyToTwd: 0.215,
  totalBudgetTwd: 50000,
  days: [
    {
      id: 'day-1',
      dayNumber: 1,
      date: '2026-10-08',
      title: 'Day 1 (10/08)',
      cityRegion: '仙台 Sendai',
      weather: {
        dayId: 'day-1',
        city: '仙台 Sendai',
        condition: 'sunny',
        tempHigh: 20,
        tempLow: 12,
        rainProb: 10,
        clothesTip: '秋季氣候涼爽宜人，建議穿著薄外套或風衣。',
        usagiNote: ''
      },
      items: []
    },
    {
      id: 'day-2',
      dayNumber: 2,
      date: '2026-10-09',
      title: 'Day 2 (10/09)',
      cityRegion: '仙台 Sendai',
      weather: {
        dayId: 'day-2',
        city: '仙台 Sendai',
        condition: 'sunny',
        tempHigh: 21,
        tempLow: 13,
        rainProb: 0,
        clothesTip: '白天溫暖舒適，早晚微涼。',
        usagiNote: ''
      },
      items: []
    },
    {
      id: 'day-3',
      dayNumber: 3,
      date: '2026-10-10',
      title: 'Day 3 (10/10)',
      cityRegion: '仙台 Sendai',
      weather: {
        dayId: 'day-3',
        city: '仙台 Sendai',
        condition: 'partly_cloudy',
        tempHigh: 19,
        tempLow: 11,
        rainProb: 20,
        clothesTip: '氣溫舒適，適合戶外行程。',
        usagiNote: ''
      },
      items: []
    },
    {
      id: 'day-4',
      dayNumber: 4,
      date: '2026-10-11',
      title: 'Day 4 (10/11)',
      cityRegion: '仙台 Sendai',
      weather: {
        dayId: 'day-4',
        city: '仙台 Sendai',
        condition: 'sunny',
        tempHigh: 18,
        tempLow: 10,
        rainProb: 10,
        clothesTip: '早晚降溫明顯，可準備針織衫或輕便外套。',
        usagiNote: ''
      },
      items: []
    },
    {
      id: 'day-5',
      dayNumber: 5,
      date: '2026-10-12',
      title: 'Day 5 (10/12)',
      cityRegion: '仙台 Sendai',
      weather: {
        dayId: 'day-5',
        city: '仙台 Sendai',
        condition: 'partly_cloudy',
        tempHigh: 19,
        tempLow: 11,
        rainProb: 15,
        clothesTip: '天候良好，早晚注意保暖。',
        usagiNote: ''
      },
      items: []
    },
    {
      id: 'day-6',
      dayNumber: 6,
      date: '2026-10-13',
      title: 'Day 6 (10/13)',
      cityRegion: '仙台 Sendai',
      weather: {
        dayId: 'day-6',
        city: '仙台 Sendai',
        condition: 'sunny',
        tempHigh: 20,
        tempLow: 12,
        rainProb: 10,
        clothesTip: '回程日氣候舒適，注意預留機場通關時間。',
        usagiNote: ''
      },
      items: []
    }
  ],
  gourmetList: [],
  shoppingList: [],
  flights: [],
  hotels: [],
  expenses: []
};
