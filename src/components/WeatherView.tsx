import React, { useState } from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Thermometer, ShieldAlert, MapPin, Compass } from 'lucide-react';
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
}

const JAPAN_CITIES_WEATHER: WeatherCityData[] = [
  {
    id: 'sendai',
    cityName: '仙台 Sendai',
    japaneseName: 'せんだい',
    region: '東北地區',
    tempHigh: 20,
    tempLow: 12,
    rainProb: 10,
    condition: 'sunny',
    clothesTip: '秋季涼爽宜人，建議穿著薄外套或風衣。',
    recommendedActivity: '適合仙台城跡、瑞鳳殿散策與品嚐仙台牛舌。',
  },
  {
    id: 'matsushima',
    cityName: '松島 Matsushima',
    japaneseName: 'まつしま',
    region: '宮城海岸',
    tempHigh: 19,
    tempLow: 11,
    rainProb: 15,
    condition: 'partly_cloudy',
    clothesTip: '海風稍大，可攜帶輕便防風外套。',
    recommendedActivity: '搭乘松島灣遊覽船、走訪五大堂與福浦橋。',
  },
  {
    id: 'tokyo',
    cityName: '東京 Tokyo',
    japaneseName: 'とうきょう',
    region: '關東地區',
    tempHigh: 22,
    tempLow: 15,
    rainProb: 10,
    condition: 'partly_cloudy',
    clothesTip: '氣候舒適，穿著短袖搭配薄風衣。',
    recommendedActivity: '市區逛街觀光與公園散策。',
  },
  {
    id: 'yamagata',
    cityName: '山形 Yamagata',
    japaneseName: 'やまがた',
    region: '東北山區',
    tempHigh: 18,
    tempLow: 9,
    rainProb: 20,
    condition: 'cloudy',
    clothesTip: '山區早晚降溫明顯，建議帶針織衫或厚外套。',
    recommendedActivity: '山寺 (立石寺) 登山登高與溫泉名勝。',
  }
];

export const WeatherView: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<WeatherCityData>(JAPAN_CITIES_WEATHER[0]);

  const getWeatherIcon = (condition: WeatherCityData['condition']) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-amber-500" />;
      case 'partly_cloudy':
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-sky-400" />;
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'snow':
        return <Snowflake className="w-8 h-8 text-[#1890FF]" />;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-[#F1E9DB] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#4A4A4A] flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#2B7A82]" />
            <span>天氣預報與穿搭建議</span>
          </h2>
          <p className="text-xs text-[#8C827A] mt-0.5">
            即時查詢地區氣溫、降雨機率與出遊建議
          </p>
        </div>
      </div>

      {/* City Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {JAPAN_CITIES_WEATHER.map((city) => {
          const isSelected = city.id === selectedCity.id;
          return (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
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
        className="bg-white p-5 rounded-xl border border-[#F1E9DB] space-y-4"
      >
        <div className="flex items-start justify-between border-b border-[#F1E9DB] pb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-bold text-[#4A4A4A]">{selectedCity.cityName}</h3>
              <span className="text-xs text-[#8C827A] font-mono">{selectedCity.japaneseName}</span>
            </div>
            <span className="inline-block text-[11px] font-medium text-[#D45068] bg-[#F8C3CD]/20 px-2 py-0.5 rounded-md mt-1">
              {selectedCity.region}
            </span>
          </div>

          <div className="flex flex-col items-end">
            {getWeatherIcon(selectedCity.condition)}
            <span className="text-xs font-medium text-[#9E6B00] mt-1 bg-[#FDE08E]/25 px-2 py-0.5 rounded-md border border-[#FDE08E]/50">
              降雨 {selectedCity.rainProb}%
            </span>
          </div>
        </div>

        {/* Temperature Gauge */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#FFF9F2] p-3 rounded-lg border border-[#F1E9DB] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8C827A]">最高氣溫</span>
              <p className="text-lg font-bold text-[#D45068]">{selectedCity.tempHigh}°C</p>
            </div>
            <Thermometer className="w-5 h-5 text-[#D45068]" />
          </div>

          <div className="bg-[#FFF9F2] p-3 rounded-lg border border-[#F1E9DB] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8C827A]">最低氣溫</span>
              <p className="text-lg font-bold text-[#2B7A82]">{selectedCity.tempLow}°C</p>
            </div>
            <Thermometer className="w-5 h-5 text-[#2B7A82]" />
          </div>
        </div>

        {/* Clothing & Activity Advice */}
        <div className="space-y-2 text-xs">
          <div className="bg-[#FFF9F2] p-3 rounded-lg border border-[#F1E9DB] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#D49E24] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#9E6B00]">穿搭建議：</span>
              <p className="text-[#4A4A4A] mt-0.5">{selectedCity.clothesTip}</p>
            </div>
          </div>

          <div className="bg-[#FFF9F2] p-3 rounded-lg border border-[#F1E9DB] flex items-start gap-2">
            <Compass className="w-4 h-4 text-[#2B7A82] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#2B7A82]">景點參考：</span>
              <p className="text-[#4A4A4A] mt-0.5">{selectedCity.recommendedActivity}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
