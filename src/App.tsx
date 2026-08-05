import React, { useState, useEffect } from 'react';
import { ActiveTab, TravelAppData, ItineraryItem, GourmetItem, ShoppingItem, ExpenseItem } from './types';
import { initialTravelData, emergencyContactsList } from './data/initialData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DailyItineraryView } from './components/DailyItineraryView';
import { WeatherView } from './components/WeatherView';
import { GourmetView } from './components/GourmetView';
import { ShoppingView } from './components/ShoppingView';
import { ToolsInfoView } from './components/ToolsInfoView';
import { AiAssistantView } from './components/AiAssistantView';
import { AddItemModal, AddGourmetModal, AddShoppingModal, ExchangeModal } from './components/Modals';
import { motion, AnimatePresence } from 'motion/react';

const LOCAL_STORAGE_KEY = 'piske_usagi_japan_travel_data_v1';

export default function App() {
  const [data, setData] = useState<TravelAppData>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
    return initialTravelData;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('itinerary');
  const [activeDayId, setActiveDayId] = useState<string>(data.days[0]?.id || 'day-1');
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(true);

  // Modals state
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingDayId, setEditingDayId] = useState<string>(data.days[0]?.id || 'day-1');
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);

  const [isAddGourmetOpen, setIsAddGourmetOpen] = useState(false);
  const [isAddShoppingOpen, setIsAddShoppingOpen] = useState(false);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  /* Itinerary Handlers */
  const handleToggleItineraryComplete = (dayId: string, itemId: string) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          items: day.items.map((item) => {
            if (item.id !== itemId) return item;
            return { ...item, completed: !item.completed };
          }),
        };
      }),
    }));
  };

  const handleSaveItineraryItem = (dayId: string, itemData: Omit<ItineraryItem, 'id'>, editId?: string) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((day) => {
        if (day.id !== dayId) return day;
        if (editId) {
          return {
            ...day,
            items: day.items.map((i) => (i.id === editId ? { ...itemData, id: editId } : i)),
          };
        } else {
          const newItem: ItineraryItem = {
            ...itemData,
            id: `item-${Date.now()}`,
          };
          return {
            ...day,
            items: [...day.items, newItem],
          };
        }
      }),
    }));
  };

  const handleDeleteItineraryItem = (dayId: string, itemId: string) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          items: day.items.filter((i) => i.id !== itemId),
        };
      }),
    }));
  };

  const handleAddDay = () => {
    const nextDayNum = data.days.length + 1;
    const newDayId = `day-${Date.now()}`;
    const newDay = {
      id: newDayId,
      dayNumber: nextDayNum,
      date: `2026-10-${14 + nextDayNum}`,
      title: `Day ${nextDayNum}: 日本自由行探索`,
      cityRegion: '東京 Tokyo',
      weather: {
        dayId: newDayId,
        city: '東京 Tokyo',
        condition: 'sunny' as const,
        tempHigh: 22,
        tempLow: 14,
        rainProb: 10,
        clothesTip: '氣候宜人，準備舒適步行的輕便鞋與薄外套。',
        usagiNote: '兔兔提醒：出發前別忘了確認相機與行動電源補滿電力喔！',
      },
      items: [],
    };

    setData((prev) => ({
      ...prev,
      days: [...prev.days, newDay],
    }));

    setActiveDayId(newDayId);
  };

  /* Gourmet Handlers */
  const handleToggleGourmetVisited = (id: string) => {
    setData((prev) => ({
      ...prev,
      gourmetList: prev.gourmetList.map((g) => (g.id === id ? { ...g, visited: !g.visited } : g)),
    }));
  };

  const handleAddGourmet = (gourmetData: Omit<GourmetItem, 'id'>) => {
    const newItem: GourmetItem = {
      ...gourmetData,
      id: `g-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      gourmetList: [newItem, ...prev.gourmetList],
    }));
  };

  const handleDeleteGourmet = (id: string) => {
    setData((prev) => ({
      ...prev,
      gourmetList: prev.gourmetList.filter((g) => g.id !== id),
    }));
  };

  /* Shopping Handlers */
  const handleToggleShoppingBought = (id: string) => {
    setData((prev) => ({
      ...prev,
      shoppingList: prev.shoppingList.map((s) => (s.id === id ? { ...s, isBought: !s.isBought } : s)),
    }));
  };

  const handleAddShopping = (shoppingData: Omit<ShoppingItem, 'id'>) => {
    const newItem: ShoppingItem = {
      ...shoppingData,
      id: `s-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      shoppingList: [newItem, ...prev.shoppingList],
    }));
  };

  const handleDeleteShopping = (id: string) => {
    setData((prev) => ({
      ...prev,
      shoppingList: prev.shoppingList.filter((s) => s.id !== id),
    }));
  };

  /* Expense Handlers */
  const handleAddExpense = (expenseData: Omit<ExpenseItem, 'id'>) => {
    const newItem: ExpenseItem = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      expenses: [newItem, ...prev.expenses],
    }));
  };

  const handleDeleteExpense = (id: string) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4A4A] font-sans antialiased selection:bg-[#F8C3CD]/40">
      {/* Outer Container Wrapper (Mobile Frame View Simulation Option) */}
      <div
        className={`mx-auto transition-all duration-300 ${
          isMobileFrameMode
            ? 'max-w-md min-h-screen bg-[#FDFBF7] border-x border-[#F1E9DB] shadow-sm relative'
            : 'max-w-4xl min-h-screen bg-[#FDFBF7]'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          tripTitle={data.tripTitle}
          startDate={data.startDate}
          endDate={data.endDate}
          exchangeRate={data.exchangeRateJpyToTwd}
          onOpenExchangeModal={() => setIsExchangeOpen(true)}
          isMobileFrameMode={isMobileFrameMode}
          onToggleFrameMode={() => setIsMobileFrameMode(!isMobileFrameMode)}
          onSelectTab={setActiveTab}
        />

        {/* Main Content View Container */}
        <main className="p-3 sm:p-4">
          <AnimatePresence mode="wait">
            {activeTab === 'itinerary' && (
              <motion.div
                key="itinerary"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <DailyItineraryView
                  days={data.days}
                  activeDayId={activeDayId}
                  onSelectDay={setActiveDayId}
                  onToggleComplete={handleToggleItineraryComplete}
                  onOpenAddItemModal={(dayId) => {
                    setEditingDayId(dayId);
                    setEditingItem(null);
                    setIsAddItemModalOpen(true);
                  }}
                  onOpenEditItemModal={(dayId, item) => {
                    setEditingDayId(dayId);
                    setEditingItem(item);
                    setIsAddItemModalOpen(true);
                  }}
                  onDeleteItem={handleDeleteItineraryItem}
                  onAddDay={handleAddDay}
                />
              </motion.div>
            )}

            {activeTab === 'weather' && (
              <motion.div
                key="weather"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <WeatherView />
              </motion.div>
            )}

            {activeTab === 'gourmet' && (
              <motion.div
                key="gourmet"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <GourmetView
                  gourmetList={data.gourmetList}
                  onToggleVisited={handleToggleGourmetVisited}
                  onOpenAddModal={() => setIsAddGourmetOpen(true)}
                  onDeleteGourmet={handleDeleteGourmet}
                />
              </motion.div>
            )}

            {activeTab === 'shopping' && (
              <motion.div
                key="shopping"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <ShoppingView
                  shoppingList={data.shoppingList}
                  exchangeRate={data.exchangeRateJpyToTwd}
                  onToggleBought={handleToggleShoppingBought}
                  onOpenAddModal={() => setIsAddShoppingOpen(true)}
                  onDeleteItem={handleDeleteShopping}
                />
              </motion.div>
            )}

            {activeTab === 'tools' && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <ToolsInfoView
                  flights={data.flights}
                  hotels={data.hotels}
                  emergencyContacts={emergencyContactsList}
                  expenses={data.expenses}
                  exchangeRate={data.exchangeRateJpyToTwd}
                  totalBudgetTwd={data.totalBudgetTwd}
                  onAddExpense={handleAddExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <AiAssistantView />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Tab Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Modals */}
        <AddItemModal
          isOpen={isAddItemModalOpen}
          onClose={() => setIsAddItemModalOpen(false)}
          dayId={editingDayId}
          initialItem={editingItem}
          onSave={handleSaveItineraryItem}
        />

        <AddGourmetModal
          isOpen={isAddGourmetOpen}
          onClose={() => setIsAddGourmetOpen(false)}
          onAdd={handleAddGourmet}
        />

        <AddShoppingModal
          isOpen={isAddShoppingOpen}
          onClose={() => setIsAddShoppingOpen(false)}
          onAdd={handleAddShopping}
        />

        <ExchangeModal
          isOpen={isExchangeOpen}
          onClose={() => setIsExchangeOpen(false)}
          rate={data.exchangeRateJpyToTwd}
          budget={data.totalBudgetTwd}
          onSave={(newRate, newBudget) => {
            setData((prev) => ({
              ...prev,
              exchangeRateJpyToTwd: newRate,
              totalBudgetTwd: newBudget,
            }));
          }}
        />
      </div>
    </div>
  );
}
