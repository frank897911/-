import React, { useState } from 'react';
import { UsagiAvatar, PiskeAvatar } from './UsagiPiskeAvatars';
import { Bot, Send, Sparkles, MessageSquare, Car, Languages, Umbrella, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: '哈囉！我是兔兔與 P助 隨行小幫手 🍡！不管是日語餐廳點餐翻譯、日本自駕 MapCode、或是雨天備案景點，隨時問我都可以喔！ฅ\'ω\'ฅ',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSendPrompt = async (promptText?: string, topic?: string) => {
    const textToSend = promptText || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-travel-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, topic }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || '兔兔正在想答案...請稍後再試一次喔！',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: '網路連線稍微卡住了～請點擊重新嘗試喔！🍡',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    {
      title: '🗣️ 日語現場翻譯',
      prompt: '請幫我將下列中文翻譯成日文（附上羅馬拼音）：請問這件商品可以免稅嗎？請問包裝可以分開裝嗎？',
      topic: 'translate',
    },
    {
      title: '🚗 自駕加油與停車',
      prompt: '在日本 self 自助加油站，無鉛汽油 (レギュラー) 該如何操作？停車場預付費怎麼開？',
      topic: 'driving',
    },
    {
      title: '🌧️ 富士山雨天備案',
      prompt: '如果在河口湖遇到下雨，有哪些優質的室內博物館、溫泉或觀景咖啡廳推薦？',
      topic: 'itinerary',
    },
    {
      title: '🛍️ 日本免稅規定',
      prompt: '日本最新的外國遊客免稅規定（5000日圓以上）有什麼注意事項與消費稅率差異？',
      topic: 'shopping',
    },
  ];

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-2xl border border-[#F1E9DB] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#4A4A4A] flex items-center gap-1.5">
            <span>兔兔&P助 AI 隨行小幫手</span>
            <Sparkles className="w-4 h-4 text-[#F8C3CD]" />
          </h2>
          <p className="text-xs text-[#8C827A] mt-0.5">
            Gemini AI 支援的日本隨行翻譯、自駕問答與行程備案助手！
          </p>
        </div>
        <div className="flex items-center -space-x-2">
          <UsagiAvatar size={38} mood="excited" />
          <PiskeAvatar size={32} mood="happy" />
        </div>
      </div>

      {/* Quick Topic Chips */}
      <div className="grid grid-cols-2 gap-2">
        {quickPrompts.map((q) => (
          <button
            key={q.title}
            onClick={() => handleSendPrompt(q.prompt, q.topic)}
            className="p-2.5 bg-white hover:bg-[#FFF9F2] border border-[#F1E9DB] rounded-xl text-left text-xs transition-all shadow-2xs"
          >
            <span className="font-bold text-[#4A4A4A] block">{q.title}</span>
            <span className="text-[11px] text-[#8C827A] line-clamp-1 mt-0.5">{q.prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div className="bg-white border border-[#F1E9DB] rounded-2xl p-4 min-h-[320px] max-h-[460px] overflow-y-auto space-y-3 scrollbar-thin">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {msg.sender === 'ai' ? (
              <div className="flex-shrink-0">
                <UsagiAvatar size={32} mood="happy" />
              </div>
            ) : (
              <div className="p-1.5 bg-[#4A4A4A] text-white rounded-full flex-shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-[#4A4A4A] text-white font-medium rounded-tr-none'
                    : 'bg-[#FFF9F2] text-[#4A4A4A] border border-[#F1E9DB] rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-[#8C827A] px-1 font-medium">
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handleCopyText(msg.id, msg.text)}
                    className="hover:text-[#4A4A4A] flex items-center gap-0.5"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>複製說明</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#8C827A] italic p-2">
            <UsagiAvatar size={26} mood="eating" />
            <span>兔兔和 P助 正在即時查詢解答中，請稍候... 🍡</span>
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt();
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#F1E9DB] focus-within:border-[#4A4A4A] shadow-xs"
      >
        <input
          type="text"
          placeholder="詢問日本行程、日語翻譯或自駕路線..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          disabled={loading}
          className="flex-1 px-3 py-2 text-xs bg-transparent outline-none placeholder:text-[#8C827A] font-medium"
        />

        <button
          type="submit"
          disabled={loading || !inputPrompt.trim()}
          className="px-4 py-2 bg-[#4A4A4A] hover:bg-[#333333] disabled:bg-stone-300 text-white font-semibold rounded-xl text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span>送出</span>
        </button>
      </form>
    </div>
  );
};
