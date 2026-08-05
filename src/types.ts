export type ItemCategory = 'spot' | 'restaurant' | 'transport' | 'activity';

export interface ItineraryItem {
  id: string;
  dayId: string;
  time: string; // e.g. "09:00"
  title: string;
  category: ItemCategory;
  locationName: string;
  address?: string;
  mapQuery?: string; // Query for Google Maps link or navigation
  carMapCode?: string; // Japan rental car MapCode e.g. "33 247 891*22"
  drivingDistanceMinutes?: number; // Minutes drive from previous spot
  estimatedCostJpy?: number;
  durationMinutes?: number;
  notes?: string;
  completed: boolean;
  
  // Specific details
  // For Restaurant
  cuisineType?: string;
  bookingStatus?: 'none' | 'booked' | 'walk-in';
  bookingTime?: string;
  mustEatDishes?: string;
  
  // For Transport
  transportType?: 'shinkansen' | 'train' | 'car' | 'bus' | 'walk' | 'flight';
  origin?: string;
  destination?: string;
  platform?: string;
  carRentalCompany?: string;

  // For Spot
  openingHours?: string;
  ticketInfo?: string;
}

export interface DayWeather {
  dayId: string;
  city: string; // e.g. "東京 Tokyo", "河口湖 Fujikawaguchiko"
  condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rain' | 'snow';
  tempHigh: number; // Celsius
  tempLow: number; // Celsius
  rainProb: number; // Percentage 0-100
  clothesTip: string;
  usagiNote: string;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string; // e.g. "2026-10-15"
  title: string; // e.g. "Day 1: 抵達東京 ‧ 新宿藍瓶與歌舞伎町"
  cityRegion: string;
  weather: DayWeather;
  items: ItineraryItem[];
}

export interface GourmetItem {
  id: string;
  name: string;
  japaneseName?: string;
  area: string; // e.g. "新宿", "銀座", "河口湖"
  cuisineCategory: string; // e.g. "拉麵", "燒肉", "甜點", "鰻魚飯"
  rating: number; // 1 to 5
  priceRangeJpy: string; // e.g. "¥1,500 - ¥3,000"
  address: string;
  mapQuery: string;
  isReserved: boolean;
  visited: boolean;
  mustOrder: string;
  notes?: string;
  googleRating?: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  japaneseName?: string;
  category: '藥妝' | '電器' | '伴手禮' | '便利商店' | '服飾潮牌' | '其他';
  preferredStore?: string; // e.g. "BicCamera", "唐吉訶德 Donki", "Matsumoto Kiyoshi"
  priceJpy: number;
  quantity: number;
  isTaxFree: boolean; // 10% tax free flag
  isBought: boolean;
  notes?: string;
}

export interface FlightDetail {
  id: string;
  type: 'outbound' | 'inbound';
  airline: string; // e.g. "星宇航空 Starlux"
  flightNo: string; // e.g. "JX800"
  date: string;
  departureAirport: string; // e.g. "TPE 桃園 T1"
  departureTime: string; // e.g. "08:30"
  arrivalAirport: string; // e.g. "NRT 成田 T2"
  arrivalTime: string; // e.g. "12:50"
  gate?: string;
  terminal?: string;
  seatNo?: string;
  bookingReference: string;
}

export interface HotelDetail {
  id: string;
  name: string;
  japaneseName: string;
  address: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  bookingRef: string;
  mapCode?: string;
  mapQuery: string;
  notes?: string;
}

export interface EmergencyContact {
  id: string;
  category: 'police' | 'medical' | 'embassy' | 'passport' | 'card_loss' | 'insurance' | 'translator';
  title: string;
  phone: string;
  address?: string;
  description: string;
  tips?: string;
}

export type ExpenseCategory = 'food' | 'transport' | 'shopping' | 'accommodation' | 'ticket' | 'other';
export type PaymentMethod = 'cash' | 'credit_card' | 'ic_card';

export interface ExpenseItem {
  id: string;
  date: string; // YYYY-MM-DD
  itemTitle: string;
  category: ExpenseCategory;
  amountJpy: number;
  amountTwd: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export type ActiveTab = 'itinerary' | 'weather' | 'gourmet' | 'shopping' | 'tools' | 'ai';

export interface TravelAppData {
  tripTitle: string;
  startDate: string;
  endDate: string;
  exchangeRateJpyToTwd: number; // e.g. 0.215
  totalBudgetTwd: number;
  days: ItineraryDay[];
  gourmetList: GourmetItem[];
  shoppingList: ShoppingItem[];
  flights: FlightDetail[];
  hotels: HotelDetail[];
  expenses: ExpenseItem[];
}
