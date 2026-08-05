import React, { useState } from 'react';
import { UsagiAvatar, PiskeAvatar } from './UsagiPiskeAvatars';
import { Sun, Cloud, CloudRain, Snowflake, Thermometer, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface WeatherCityData {
  id: string;
  cityName: string;
  japaneseName: string;
  region: string;
  tempHigh: number;
  tempLow: number;
  rainProb: number;
  condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rain' | 'snow';
  clothesTip: string;
  recommendedActivity: string;
  usagiQuote: string;
}

const JAPAN_CITIES_WEATHER: WeatherCityData[] = [
  {
    id: 'tokyo',
    cityName: '東京 Tokyo',
    japaneseName: 'とうきょう',
    region: '關東地區',
    tempHigh: 22,
    tempLow: 15,
    rainProb: 10,
    condition: 'partly_cloudy',
    clothesTip: '氣候舒適，穿著短袖搭配薄風衣或針織外衣。',
    recommendedActivity: '適合新宿/澀谷購物散策與明治神宮觀光。',
    usagiQuote: '兔兔說：東京微風吹起來超舒服～逛街最爽快了！ฅ\'ω\'ฅ'
  },
  {
    id: 'kawaguchiko',
    cityName: '河口湖 Fujikawaguchiko',
    japaneseName: 'かわぐちこ',
    region: '山梨/富士山',
    tempHigh: 18,
    tempLow: 8,
    rainProb: 0,
    condition: 'sunny',
    clothesTip: '山區早晚溫差極大！請攜帶厚外套、圍巾或發熱衣。',
    recommendedActivity: '無雲大晴天！絕佳富士山拍攝日，推薦搭乘全景纜車。',
    usagiQuote: 'P助說：今天是能看到逆富士的超讚好天氣喔！富士山好壯觀！🗻'
  },
  {
    id: 'kamakura',
    cityName: '鎌倉/江之島 Kamakura',
    japaneseName: 'かまくら',
    region: '神奈川海邊',
    tempHigh: 21,
    tempLow: 14,
    rainProb: 5,
    condition: 'sunny',
    clothesTip: '海風稍大，攜帶遮陽帽與太陽眼鏡，並穿著舒適防風外套。',
    recommendedActivity: '沿著海邊搭江之電，平交道拍照與享用新鮮吻仔魚丼。',
    usagiQuote: '兔兔說：聽著海浪聲吃冰淇淋最開心了！🍦'
  },
  {
    id: 'kyoto',
    cityName: '京都 Kyoto',
    japaneseName: 'きょうと',
    region: '關西地區',
    tempHigh: 24,
    tempLow: 13,
    rainProb: 20,
    condition: 'sunny',
    clothesTip: '白天溫暖，晚間略帶涼意，建議洋蔥式穿法。',
    recommendedActivity: '清水寺參拜、伏見稻荷千本鳥居巡禮與祇園散策。',
    usagiQuote: 'P助說：抹茶甜點和章魚燒在京都等著我們呢～🍡'
  },
  {
    id: 'hokkaido',
    cityName: '札幌 Hokkaido',
    japaneseName: 'さっぽろ',
    region: '北海道',
    tempHigh: 14,
    tempLow: 5,
    rainProb: 40,
    condition: 'rain',
    clothesTip: '涼意濃厚！務必準備鋪棉外套、長褲與隨身折傘 ☂️。',
    recommendedActivity: '前往大通公園、吃札幌味噌拉麵與狸小路商店街。',
    usagiQuote: '兔兔說：記得帶傘喔！下雨的話我們就去逛室內狸小路商店街吧！'
  }
];

export const WeatherView: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<WeatherCityData>(JAPAN_CITIES_WEATHER[0]);

  const getWeatherIcon = (condition: WeatherCityData['condition']) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-10 h-10 text-amber-500 animate-spin-slow" />;
      case 'partly_cloudy':
      case 'cloudy':
        return <Cloud className="w-10 h-10 text-sky-400" />;
      case 'rain':
        return <CloudRain className="w-10 h-10 text-blue-500 animate-bounce" />;
      case 'snow':
        return <Snowflake className="w-10 h-10 text-[#1890FF]" />;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-2xl border border-[#F1E9DB] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#4A4A4A] flex items-center gap-1.5">
            <span>日本即時天氣與穿搭建議</span>
            <Sparkles className="w-4 h-4 text-[#F8C3CD]" />
          </h2>
          <p className="text-xs text-[#8C827A] mt-0.5">
            兔兔與 P助 每日為您更新各地氣溫、降雨機率與自駕出遊裝備！
          </p>
        </div>
        <UsagiAvatar size={42} mood="excited" />
      </div>

      {/* City Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {JAPAN_CITIES_WEATHER.map((city) => {
          const isSelected = city.id === selectedCity.id;
          return (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-[#4A4A4A] text-white border-[#4A4A4A]'
                  : 'bg-white text-[#5C554E] border-[#F1E9DB] hover:bg-[#FFF9F2]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#D45068]" />
              <span>{city.cityName.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Selected City Weather Card */}
      <motion.div
        key={selectedCity.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-2xl border border-[#F1E9DB] shadow-xs space-y-4"
      >
        <div className="flex items-start justify-between border-b border-[#F1E9DB] pb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-bold text-[#4A4A4A]">{selectedCity.cityName}</h3>
              <span className="text-xs text-[#8C827A] font-mono">{selectedCity.japaneseName}</span>
            </div>
            <span className="inline-block text-[11px] font-medium text-[#D45068] bg-[#F8C3CD]/20 px-2.5 py-0.5 rounded-full mt-1">
              {selectedCity.region}
            </span>
          </div>

          <div className="flex flex-col items-end">
            {getWeatherIcon(selectedCity.condition)}
            <span className="text-xs font-medium text-[#9E6B00] mt-1 bg-[#FDE08E]/25 px-2.5 py-0.5 rounded-full border border-[#FDE08E]/50">
              降雨 {selectedCity.rainProb}%
            </span>
          </div>
        </div>

        {/* Temperature Gauge */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#FFF9F2] p-3 rounded-xl border border-[#F1E9DB] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8C827A] font-medium">最高氣溫</span>
              <p className="text-lg font-bold text-[#D45068]">{selectedCity.tempHigh}°C</p>
            </div>
            <Thermometer className="w-5 h-5 text-[#D45068]" />
          </div>

          <div className="bg-[#FFF9F2] p-3 rounded-xl border border-[#F1E9DB] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8C827A] font-medium">最低氣溫</span>
              <p className="text-lg font-bold text-[#2B7A82]">{selectedCity.tempLow}°C</p>
            </div>
            <Thermometer className="w-5 h-5 text-[#2B7A82]" />
          </div>
        </div>

        {/* Clothing & Rain Advice */}
        <div className="space-y-2 text-xs">
          <div className="bg-[#FFF9F2] p-3 rounded-xl border border-[#F1E9DB] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#D49E24] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#9E6B00]">穿搭建議：</span>
              <p className="text-[#4A4A4A] mt-0.5">{selectedCity.clothesTip}</p>
            </div>
          </div>

          <div className="bg-[#FFF9F2] p-3 rounded-xl border border-[#F1E9DB] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#2B7A82] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#2B7A82]">推薦活動：</span>
              <p className="text-[#4A4A4A] mt-0.5">{selectedCity.recommendedActivity}</p>
            </div>
          </div>
        </div>

        {/* Usagi Quote Bubble */}
        <div className="bg-[#FFF9F2] p-3 rounded-xl border border-[#F1E9DB] flex items-center gap-3">
          <PiskeAvatar size={34} mood="happy" />
          <p className="text-xs text-[#4A4A4A] font-medium leading-relaxed italic">
            "{selectedCity.usagiQuote}"
          </p>
        </div>
      </motion.div>
    </div>
  );
};
