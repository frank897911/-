import React, { useState } from 'react';
import { Bot, Send, MessageSquare, Copy, Check } from 'lucide-react';
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
      text: '您好！我是日本旅遊隨行小幫手。無論是仙台景點查詢、日語餐廳點餐翻譯、或是交通與備案規劃，隨時歡迎提問！',
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
        text: data.text || '正為您查詢解答，請稍後再試一次。',
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
          text: '網路連線異常，請稍後重新嘗試。',
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
      title: '日語現場翻譯',
      prompt: '請幫我將下列中文翻譯成日文（附上羅馬拼音）：請問這件商品可以免稅嗎？請問包裝可以分開裝嗎？',
      topic: 'translate',
    },
    {
      title: '仙台特色美食推薦',
      prompt: '請推薦仙台車站周邊必吃的牛舌名店與毛豆泥甜點名店？',
      topic: 'itinerary',
    },
    {
      title: '自駕加油與停車',
      prompt: '在日本自助加油站，無鉛汽油 (レギュラー) 該如何操作？停車場預付費怎麼開？',
      topic: 'driving',
    },
    {
      title: '日本免稅規定',
      prompt: '日本最新的外國遊客免稅規定（5000日圓以上）有什麼注意事項？',
      topic: 'shopping',
    },
  ];

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-xl border border-[#F1E9DB] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#4A4A4A] flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-[#2B7A82]" />
            <span>AI 隨行旅遊助手</span>
          </h2>
          <p className="text-xs text-[#8C827A] mt-0.5">
            Gemini AI 提供日本翻譯、景點與自駕問答
          </p>
        </div>
      </div>

      {/* Quick Topic Chips */}
      <div className="grid grid-cols-2 gap-2">
        {quickPrompts.map((q) => (
          <button
            key={q.title}
            onClick={() => handleSendPrompt(q.prompt, q.topic)}
            className="p-2.5 bg-white hover:bg-[#FFF9F2] border border-[#F1E9DB] rounded-lg text-left text-xs transition-all"
          >
            <span className="font-bold text-[#4A4A4A] block">{q.title}</span>
            <span className="text-[11px] text-[#8C827A] line-clamp-1 mt-0.5">{q.prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div className="bg-white border border-[#F1E9DB] rounded-xl p-4 min-h-[320px] max-h-[460px] overflow-y-auto space-y-3 scrollbar-thin">
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
              <div className="p-1.5 bg-[#FFF9F2] border border-[#F1E9DB] text-[#2B7A82] rounded-full flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-1.5 bg-[#4A4A4A] text-white rounded-full flex-shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
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
                    <span>複製</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#8C827A] italic p-2">
            <Bot className="w-4 h-4 animate-spin text-[#2B7A82]" />
            <span>查詢解答中，請稍候...</span>
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt();
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#F1E9DB] focus-within:border-[#4A4A4A]"
      >
        <input
          type="text"
          placeholder="詢問仙台行程、日語翻譯或交通資訊..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          disabled={loading}
          className="flex-1 px-3 py-2 text-xs bg-transparent outline-none placeholder:text-[#8C827A] font-medium"
        />

        <button
          type="submit"
          disabled={loading || !inputPrompt.trim()}
          className="px-4 py-2 bg-[#4A4A4A] hover:bg-[#333333] disabled:bg-stone-300 text-white font-medium rounded-lg text-xs transition-all active:scale-95 flex items-center gap-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span>送出</span>
        </button>
      </form>
    </div>
  );
};
