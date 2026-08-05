import React from 'react';

interface AvatarProps {
  className?: string;
  size?: number;
  mood?: 'happy' | 'excited' | 'eating' | 'driving' | 'sleeping';
}

export const UsagiAvatar: React.FC<AvatarProps> = ({ className = '', size = 48, mood = 'happy' }) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm overflow-visible">
        {/* Bunny Ears */}
        <ellipse cx="38" cy="22" rx="9" ry="22" fill="#FFC2D1" stroke="#332C2B" strokeWidth="2.5" transform="rotate(-8 38 22)" />
        <ellipse cx="38" cy="22" rx="5" ry="15" fill="#FF8FAB" />
        
        <ellipse cx="62" cy="22" rx="9" ry="22" fill="#FFC2D1" stroke="#332C2B" strokeWidth="2.5" transform="rotate(8 62 22)" />
        <ellipse cx="62" cy="22" rx="5" ry="15" fill="#FF8FAB" />

        {/* Head */}
        <circle cx="50" cy="58" r="32" fill="#FFC2D1" stroke="#332C2B" strokeWidth="2.5" />

        {/* Cheeks (Blush) */}
        <circle cx="30" cy="62" r="7" fill="#FF8FAB" opacity="0.8" />
        <circle cx="70" cy="62" r="7" fill="#FF8FAB" opacity="0.8" />

        {/* Eyes */}
        {mood === 'happy' && (
          <>
            <circle cx="38" cy="54" r="3" fill="#332C2B" />
            <circle cx="62" cy="54" r="3" fill="#332C2B" />
          </>
        )}
        {mood === 'excited' && (
          <>
            <path d="M 34 55 Q 38 50 42 55" fill="none" stroke="#332C2B" strokeWidth="3" strokeLinecap="round" />
            <path d="M 58 55 Q 62 50 66 55" fill="none" stroke="#332C2B" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        {mood === 'eating' && (
          <>
            <circle cx="38" cy="54" r="2.5" fill="#332C2B" />
            <circle cx="62" cy="54" r="2.5" fill="#332C2B" />
          </>
        )}
        {mood === 'driving' && (
          <>
            <ellipse cx="38" cy="54" rx="3.5" ry="2.5" fill="#332C2B" />
            <ellipse cx="62" cy="54" rx="3.5" ry="2.5" fill="#332C2B" />
          </>
        )}

        {/* Mouth */}
        {mood === 'eating' ? (
          <path d="M 45 63 Q 50 70 55 63 Z" fill="#FF4D6D" stroke="#332C2B" strokeWidth="2" />
        ) : (
          <path d="M 44 61 Q 50 67 56 61" fill="none" stroke="#332C2B" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Nose */}
        <circle cx="50" cy="58" r="1.8" fill="#332C2B" />

        {/* Accessory / Driving Hat / Camera */}
        {mood === 'driving' && (
          <path d="M 32 38 Q 50 30 68 38 L 70 42 L 30 42 Z" fill="#FFE58F" stroke="#332C2B" strokeWidth="2" />
        )}
      </svg>
    </div>
  );
};

export const PiskeAvatar: React.FC<AvatarProps> = ({ className = '', size = 44, mood = 'happy' }) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm overflow-visible">
        {/* White Chick Body/Head */}
        <ellipse cx="50" cy="56" rx="32" ry="30" fill="#FFFFFF" stroke="#332C2B" strokeWidth="2.5" />

        {/* Cheeks */}
        <circle cx="32" cy="60" r="6" fill="#FFB7C5" opacity="0.85" />
        <circle cx="68" cy="60" r="6" fill="#FFB7C5" opacity="0.85" />

        {/* Eyes */}
        <circle cx="38" cy="52" r="2.8" fill="#332C2B" />
        <circle cx="62" cy="52" r="2.8" fill="#332C2B" />

        {/* Beak */}
        <ellipse cx="50" cy="58" rx="6" ry="4" fill="#FFC53D" stroke="#332C2B" strokeWidth="2" />

        {/* Wings */}
        <path d="M 18 58 Q 12 64 20 68" fill="none" stroke="#332C2B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 82 58 Q 88 64 80 68" fill="none" stroke="#332C2B" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const StampSticker: React.FC<{ type: 'done' | 'must_eat' | 'must_buy' | 'drive' | 'flight'; text?: string }> = ({ type, text }) => {
  const configs = {
    done: { bg: 'bg-rose-100 border-rose-400 text-rose-600', label: text || '完成！', icon: '🌸' },
    must_eat: { bg: 'bg-amber-100 border-amber-400 text-amber-700', label: text || '必吃！', icon: '🍡' },
    must_buy: { bg: 'bg-purple-100 border-purple-400 text-purple-700', label: text || '必買！', icon: '🛍️' },
    drive: { bg: 'bg-sky-100 border-sky-400 text-sky-700', label: text || '自駕', icon: '🚗' },
    flight: { bg: 'bg-emerald-100 border-emerald-400 text-emerald-700', label: text || '航班', icon: '✈️' },
  };

  const config = configs[type] || configs.done;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-dashed font-bold text-xs shadow-xs tracking-wider transform rotate-1 transition-transform ${config.bg}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};
