import React, { useRef, useState } from 'react';
import { Camera, Edit3, Image as ImageIcon, Sparkles, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TripCoverBannerProps {
  coverImage?: string;
  tripTitle: string;
  startDate: string;
  endDate: string;
  onOpenEditTripModal: () => void;
  onUpdateCoverImage: (newImage: string) => void;
}

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80';

const PRESET_COVERS = [
  { name: '仙台東北楓葉', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
  { name: '日本櫻花春景', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
  { name: '雪景與溫泉鄉', url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80' },
  { name: '富士山與神社', url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=80' },
  { name: '東京繁華夜景', url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80' },
  { name: '京都古都神社', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
];

export const TripCoverBanner: React.FC<TripCoverBannerProps> = ({
  coverImage,
  tripTitle,
  startDate,
  endDate,
  onOpenEditTripModal,
  onUpdateCoverImage,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayImage = coverImage || DEFAULT_COVER;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('照片檔案較大，建議選擇 8MB 以下的照片！');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateCoverImage(reader.result);
          setIsPickerOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      onUpdateCoverImage(customUrlInput.trim());
      setCustomUrlInput('');
      setIsPickerOpen(false);
    }
  };

  return (
    <div className="relative mb-3 group">
      {/* Cover Image Banner */}
      <div className="h-36 sm:h-44 w-full rounded-2xl overflow-hidden relative shadow-sm border border-[#EBE3D5] bg-stone-100">
        <img
          src={displayImage}
          alt={tripTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Soft Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Banner Details Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 text-white flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-1">
              🇯🇵 日本自由行隨行帳
            </span>
            <h2 className="text-base sm:text-xl font-bold text-white drop-shadow-md truncate">
              {tripTitle}
            </h2>
            <p className="text-xs text-stone-200 font-mono mt-0.5 opacity-90">
              📅 {startDate} ～ {endDate}
            </p>
          </div>

          {/* Action Buttons on Banner */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setIsPickerOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/30 transition-all active:scale-95 shadow-sm"
              title="更換封面照片"
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">更換封面</span>
              <span className="sm:hidden">封面</span>
            </button>

            <button
              onClick={onOpenEditTripModal}
              className="p-1.5 bg-white/30 hover:bg-white/50 backdrop-blur-md text-white rounded-xl border border-white/30 transition-all active:scale-95"
              title="編輯旅程名稱與日期"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Change Cover Image Modal / Drawer */}
      <AnimatePresence>
        {isPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FFFDF7] rounded-3xl p-5 border border-[#EBE3D5] shadow-2xl max-w-sm w-full space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#EBE3D5] pb-3">
                <h3 className="text-base font-bold text-[#3E3A37] flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#2B7A82]" />
                  <span>更換旅程封面照片</span>
                </h3>
                <button
                  onClick={() => setIsPickerOpen(false)}
                  className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 font-bold text-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Upload Local Photo */}
              <div>
                <label className="block text-xs font-bold text-[#3E3A37] mb-1.5">
                  1. 上傳手機或電腦相片
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 border-2 border-dashed border-[#C5D5B5] hover:border-[#3B523A] bg-[#FFF9F2] rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-[#3B523A] transition-all hover:bg-[#E2EAD8]/50 active:scale-98"
                >
                  <Upload className="w-4 h-4 text-[#3B523A]" />
                  <span>選擇照片上傳 (支援 iPhone/Android 相簿)</span>
                </button>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-bold text-[#3E3A37] mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>2. 或選擇精選旅遊桌布</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_COVERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onUpdateCoverImage(preset.url);
                        setIsPickerOpen(false);
                      }}
                      className="group relative h-20 rounded-xl overflow-hidden border border-[#EBE3D5] focus:ring-2 focus:ring-[#3B523A] text-left transition-all active:scale-95"
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                      <span className="absolute bottom-1.5 left-2 right-2 text-[11px] font-bold text-white drop-shadow-md truncate">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL */}
              <form onSubmit={handleCustomUrlSubmit} className="space-y-2 pt-2 border-t border-[#EBE3D5]">
                <label className="block text-xs font-bold text-[#3E3A37]">
                  3. 或輸入網路圖片網址 (URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 px-3 py-1.5 text-xs border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#3B523A] text-white text-xs font-bold rounded-xl hover:bg-[#2C3E2B]"
                  >
                    套用
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
