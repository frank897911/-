import React, { useState, useEffect, useRef } from 'react';
import { ActiveTab, TravelAppData, ItineraryItem, GourmetItem, ShoppingItem, ExpenseItem, ItineraryDay, JournalEntry, ChecklistItem, GroupMember, FlightDetail, HotelDetail, BookingVoucher } from './types';
import { initialTravelData, emergencyContactsList } from './data/initialData';
import { sortItineraryItems } from './utils';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DailyItineraryView } from './components/DailyItineraryView';
import { BookingsView } from './components/BookingsView';
import { ExpenseView } from './components/ExpenseView';
import { JournalView } from './components/JournalView';
import { PlanningView } from './components/PlanningView';
import { MembersView } from './components/MembersView';
import { AiAssistantView } from './components/AiAssistantView';
import { AddItemModal, AddGourmetModal, AddShoppingModal, ExchangeModal, EditTripModal, EditDayModal } from './components/Modals';
import { TripCoverBanner } from './components/TripCoverBanner';
import { CloudSyncModal } from './components/CloudSyncModal';
import { motion, AnimatePresence } from 'motion/react';

const LOCAL_STORAGE_KEY = 'sendai_japan_travel_data_v3';

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

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>('itinerary');
  const [activeDayId, setActiveDayId] = useState<string>(data.days[0]?.id || 'day-1');
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(true);

  // Modals state
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingDayId, setEditingDayId] = useState<string>(data.days[0]?.id || 'day-1');
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);

  const [isEditTripOpen, setIsEditTripOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);
  const [isEditDayOpen, setIsEditDayOpen] = useState(false);

  const [isExchangeOpen, setIsExchangeOpen] = useState(false);

  // Save to LocalStorage when user edits data
  useEffect(() => {
    const currentStr = JSON.stringify(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, currentStr);
  }, [data]);

  /* Trip & Day Handlers */
  const handleSaveTripDetails = (title: string, start: string, end: string, coverImage?: string) => {
    setData((prev) => ({
      ...prev,
      tripTitle: title,
      startDate: start,
      endDate: end,
      coverImage: coverImage !== undefined ? coverImage : prev.coverImage,
    }));
  };

  const handleUpdateCoverImage = (newImage: string) => {
    setData((prev) => ({
      ...prev,
      coverImage: newImage,
    }));
  };

  const handleSaveDayDetails = (dayId: string, updated: Partial<ItineraryDay>) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          ...updated,
          weather: updated.weather ? { ...day.weather, ...updated.weather } : day.weather,
        };
      }),
    }));
  };

  const handleDeleteDay = (dayId: string) => {
    setData((prev) => {
      const remaining = prev.days.filter((d) => d.id !== dayId);
      const reindexed = remaining.map((d, index) => ({
        ...d,
        dayNumber: index + 1,
      }));
      return { ...prev, days: reindexed };
    });
    if (activeDayId === dayId && data.days.length > 1) {
      const remaining = data.days.filter((d) => d.id !== dayId);
      if (remaining.length > 0) {
        setActiveDayId(remaining[0].id);
      }
    }
  };

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
          const updatedItems = day.items.map((i) => (i.id === editId ? { ...itemData, id: editId } : i));
          return {
            ...day,
            items: sortItineraryItems(updatedItems),
          };
        } else {
          const newItem: ItineraryItem = {
            ...itemData,
            id: `item-${Date.now()}`,
          };
          return {
            ...day,
            items: sortItineraryItems([...day.items, newItem]),
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
    const newDay: ItineraryDay = {
      id: newDayId,
      dayNumber: nextDayNum,
      date: `2026-10-${(7 + nextDayNum).toString().padStart(2, '0')}`,
      title: `Day ${nextDayNum}`,
      cityRegion: '仙台 Sendai',
      weather: {
        dayId: newDayId,
        city: '仙台 Sendai',
        condition: 'sunny' as const,
        tempHigh: 20,
        tempLow: 12,
        rainProb: 10,
        clothesTip: '秋季氣候涼爽，請準備隨身外套。',
        usagiNote: '',
      },
      items: [],
    };

    setData((prev) => ({
      ...prev,
      days: [...prev.days, newDay],
    }));

    setActiveDayId(newDayId);
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

  /* Journal Handlers */
  const handleAddJournal = (journalData: Omit<JournalEntry, 'id' | 'likesCount'>) => {
    const newEntry: JournalEntry = {
      ...journalData,
      id: `j-${Date.now()}`,
      likesCount: 1,
    };
    setData((prev) => ({
      ...prev,
      journals: [newEntry, ...prev.journals],
    }));
  };

  const handleDeleteJournal = (id: string) => {
    setData((prev) => ({
      ...prev,
      journals: prev.journals.filter((j) => j.id !== id),
    }));
  };

  const handleLikeJournal = (id: string) => {
    setData((prev) => ({
      ...prev,
      journals: prev.journals.map((j) => (j.id === id ? { ...j, likesCount: (j.likesCount || 0) + 1 } : j)),
    }));
  };

  /* Planning Checklist Handlers */
  const handleToggleChecklist = (id: string) => {
    setData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c)),
    }));
  };

  const handleAddChecklist = (itemData: Omit<ChecklistItem, 'id' | 'completed'>) => {
    const newItem: ChecklistItem = {
      ...itemData,
      id: `chk-${Date.now()}`,
      completed: false,
    };
    setData((prev) => ({
      ...prev,
      checklists: [...prev.checklists, newItem],
    }));
  };

  const handleDeleteChecklist = (id: string) => {
    setData((prev) => ({
      ...prev,
      checklists: prev.checklists.filter((c) => c.id !== id),
    }));
  };

  /* Itinerary Day Title Handler */
  const handleUpdateDayTitle = (dayId: string, newTitle: string) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((d) => (d.id === dayId ? { ...d, title: newTitle } : d)),
    }));
  };

  /* Group Members Handlers */
  const handleAddMember = (memberData: Omit<GroupMember, 'id'>) => {
    const newMember: GroupMember = {
      ...memberData,
      id: `m-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
  };

  const handleEditMember = (id: string, updated: Partial<GroupMember>) => {
    setData((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === id ? { ...m, ...updated } : m)),
    }));
  };

  const handleDeleteMember = (id: string) => {
    setData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
    }));
  };

  /* Booking Handlers */
  const handleAddFlight = (flightData: Omit<FlightDetail, 'id'>) => {
    const newFlight: FlightDetail = { ...flightData, id: `f-${Date.now()}` };
    setData((prev) => ({ ...prev, flights: [...prev.flights, newFlight] }));
  };

  const handleEditFlight = (id: string, updated: Partial<FlightDetail>) => {
    setData((prev) => ({
      ...prev,
      flights: prev.flights.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    }));
  };

  const handleDeleteFlight = (id: string) => {
    setData((prev) => ({
      ...prev,
      flights: prev.flights.filter((f) => f.id !== id),
    }));
  };

  const handleAddHotel = (hotelData: Omit<HotelDetail, 'id'>) => {
    const newHotel: HotelDetail = { ...hotelData, id: `h-${Date.now()}` };
    setData((prev) => ({ ...prev, hotels: [...prev.hotels, newHotel] }));
  };

  const handleEditHotel = (id: string, updated: Partial<HotelDetail>) => {
    setData((prev) => ({
      ...prev,
      hotels: prev.hotels.map((h) => (h.id === id ? { ...h, ...updated } : h)),
    }));
  };

  const handleDeleteHotel = (id: string) => {
    setData((prev) => ({
      ...prev,
      hotels: prev.hotels.filter((h) => h.id !== id),
    }));
  };

  const handleAddVoucher = (voucherData: Omit<BookingVoucher, 'id'>) => {
    const newVoucher: BookingVoucher = { ...voucherData, id: `v-${Date.now()}` };
    setData((prev) => ({ ...prev, vouchers: [...prev.vouchers, newVoucher] }));
  };

  const handleEditVoucher = (id: string, updated: Partial<BookingVoucher>) => {
    setData((prev) => ({
      ...prev,
      vouchers: prev.vouchers.map((v) => (v.id === id ? { ...v, ...updated } : v)),
    }));
  };

  const handleDeleteVoucher = (id: string) => {
    setData((prev) => ({
      ...prev,
      vouchers: prev.vouchers.filter((v) => v.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E3A37] font-sans antialiased selection:bg-[#C5D5B5]/40">
      <div
        className={`mx-auto transition-all duration-300 ${
          isMobileFrameMode
            ? 'max-w-md min-h-screen bg-[#FDFBF7] border-x border-[#EBE3D5] shadow-sm relative'
            : 'max-w-4xl min-h-screen bg-[#FDFBF7]'
        }`}
      >
        {/* Top Cover Banner */}
        <div className="pt-[max(0.75rem,env(safe-area-inset-top))] px-3 sm:px-4">
          <TripCoverBanner
            coverImage={data.coverImage}
            tripTitle={data.tripTitle}
            startDate={data.startDate}
            endDate={data.endDate}
            onOpenEditTripModal={() => setIsEditTripOpen(true)}
            onUpdateCoverImage={handleUpdateCoverImage}
          />
        </div>

        {/* Sticky Control Navbar */}
        <Navbar
          tripTitle={data.tripTitle}
          startDate={data.startDate}
          endDate={data.endDate}
          exchangeRate={data.exchangeRateJpyToTwd}
          onOpenExchangeModal={() => setIsExchangeOpen(true)}
          onOpenEditTripModal={() => setIsEditTripOpen(true)}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
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
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <DailyItineraryView
                  days={data.days}
                  activeDayId={activeDayId}
                  startDate={data.startDate}
                  endDate={data.endDate}
                  tripTitle={data.tripTitle}
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
                  onUpdateDayTitle={handleUpdateDayTitle}
                />
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <BookingsView
                  flights={data.flights}
                  hotels={data.hotels}
                  vouchers={data.vouchers}
                  exchangeRate={data.exchangeRateJpyToTwd}
                  onDeleteFlight={handleDeleteFlight}
                  onDeleteHotel={handleDeleteHotel}
                  onDeleteVoucher={handleDeleteVoucher}
                  onAddFlight={handleAddFlight}
                  onEditFlight={handleEditFlight}
                  onAddHotel={handleAddHotel}
                  onEditHotel={handleEditHotel}
                  onAddVoucher={handleAddVoucher}
                  onEditVoucher={handleEditVoucher}
                />
              </motion.div>
            )}

            {activeTab === 'expense' && (
              <motion.div
                key="expense"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <ExpenseView
                  expenses={data.expenses}
                  members={data.members}
                  exchangeRate={data.exchangeRateJpyToTwd}
                  totalBudgetTwd={data.totalBudgetTwd}
                  onAddExpense={handleAddExpense}
                  onDeleteExpense={handleDeleteExpense}
                  onUpdateTotalBudget={(newBudget) => {
                    setData((prev) => ({ ...prev, totalBudgetTwd: newBudget }));
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'journal' && (
              <motion.div
                key="journal"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <JournalView
                  journals={data.journals}
                  members={data.members}
                  onAddJournal={handleAddJournal}
                  onDeleteJournal={handleDeleteJournal}
                  onLikeJournal={handleLikeJournal}
                />
              </motion.div>
            )}

            {activeTab === 'planning' && (
              <motion.div
                key="planning"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <PlanningView
                  checklists={data.checklists}
                  members={data.members}
                  onToggleChecklist={handleToggleChecklist}
                  onAddChecklist={handleAddChecklist}
                  onDeleteChecklist={handleDeleteChecklist}
                />
              </motion.div>
            )}

            {activeTab === 'members' && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <MembersView
                  members={data.members}
                  onAddMember={handleAddMember}
                  onEditMember={handleEditMember}
                  onDeleteMember={handleDeleteMember}
                />
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
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

        <EditTripModal
          isOpen={isEditTripOpen}
          onClose={() => setIsEditTripOpen(false)}
          tripTitle={data.tripTitle}
          startDate={data.startDate}
          endDate={data.endDate}
          coverImage={data.coverImage}
          onSave={handleSaveTripDetails}
        />

        <EditDayModal
          isOpen={isEditDayOpen}
          onClose={() => {
            setIsEditDayOpen(false);
            setEditingDay(null);
          }}
          day={editingDay}
          onSave={handleSaveDayDetails}
          onDeleteDay={handleDeleteDay}
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

        <CloudSyncModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          data={data}
          onUpdateData={(newData) => setData(newData)}
        />
      </div>
    </div>
  );
}


