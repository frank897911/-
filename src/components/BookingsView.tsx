import React, { useState } from 'react';
import { FlightDetail, HotelDetail, BookingVoucher } from '../types';
import { Plane, Hotel, Copy, Check, Phone, MapPin, FileText, Trash2, Edit2, Plus } from 'lucide-react';
import { AddEditBookingModal, BookingItemType } from './Modals';

interface BookingsViewProps {
  flights: FlightDetail[];
  hotels: HotelDetail[];
  vouchers: BookingVoucher[];
  exchangeRate: number;
  onDeleteFlight?: (id: string) => void;
  onDeleteHotel?: (id: string) => void;
  onDeleteVoucher?: (id: string) => void;
  onAddFlight?: (flight: Omit<FlightDetail, 'id'>) => void;
  onEditFlight?: (id: string, flight: Partial<FlightDetail>) => void;
  onAddHotel?: (hotel: Omit<HotelDetail, 'id'>) => void;
  onEditHotel?: (id: string, hotel: Partial<HotelDetail>) => void;
  onAddVoucher?: (voucher: Omit<BookingVoucher, 'id'>) => void;
  onEditVoucher?: (id: string, voucher: Partial<BookingVoucher>) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  flights,
  hotels,
  vouchers,
  exchangeRate,
  onDeleteFlight,
  onDeleteHotel,
  onDeleteVoucher,
  onAddFlight,
  onEditFlight,
  onAddHotel,
  onEditHotel,
  onAddVoucher,
  onEditVoucher,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'flights' | 'hotels' | 'vouchers'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<BookingItemType>('flight');
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAdd = (type: BookingItemType = 'flight') => {
    setEditingItem(null);
    setModalDefaultType(type);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any, type: BookingItemType) => {
    setEditingItem(item);
    setModalDefaultType(type);
    setIsModalOpen(true);
  };

  const handleSaveFlight = (flightData: Omit<FlightDetail, 'id'>, editId?: string) => {
    if (editId && onEditFlight) {
      onEditFlight(editId, flightData);
    } else if (onAddFlight) {
      onAddFlight(flightData);
    }
  };

  const handleSaveHotel = (hotelData: Omit<HotelDetail, 'id'>, editId?: string) => {
    if (editId && onEditHotel) {
      onEditHotel(editId, hotelData);
    } else if (onAddHotel) {
      onAddHotel(hotelData);
    }
  };

  const handleSaveVoucher = (voucherData: Omit<BookingVoucher, 'id'>, editId?: string) => {
    if (editId && onEditVoucher) {
      onEditVoucher(editId, voucherData);
    } else if (onAddVoucher) {
      onAddVoucher(voucherData);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header Banner */}
      <div className="bg-[#FFFDF7] p-4 rounded-2xl border border-[#EBE3D5] shadow-[3px_3px_0px_#E2DDD0] flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E2EAD8] text-[#3B523A] border border-[#C5D5B5] flex items-center justify-center font-bold text-xl">
            🎫
          </div>
          <div>
            <h2 className="text-base font-bold text-[#3E3A37]">機票 ‧ 住宿 ‧ 預訂憑證庫</h2>
            <p className="text-xs text-[#8C827A] mt-0.5">
              整合登機證、飯店確認單與租車憑證，方便隨時檢閱
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenAdd('flight')}
          className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-[#3B523A] hover:bg-[#2C3E2B] text-white text-xs font-bold rounded-xl shadow-[2px_2px_0px_#223322] active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>新增憑證</span>
        </button>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#EBE3D5]">
        {[
          { id: 'all', label: '全部憑證' },
          { id: 'flights', label: '✈️ 登機證機票' },
          { id: 'hotels', label: '🏨 飯店住宿' },
          { id: 'vouchers', label: '📑 預約單/憑證' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSubTab === tab.id
                ? 'bg-[#3B523A] text-white font-bold shadow-xs'
                : 'text-[#78716C] hover:bg-[#F7F4EB]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Flight Boarding Passes Section */}
      {(activeSubTab === 'all' || activeSubTab === 'flights') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pl-1">
            <h3 className="text-xs font-bold text-[#4E7C59] tracking-wider uppercase flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5" />
              航班機票 (Boarding Passes)
            </h3>
            <button
              onClick={() => handleOpenAdd('flight')}
              className="text-xs text-[#3B523A] hover:underline font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              新增機票
            </button>
          </div>

          {flights.length === 0 ? (
            <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-[#EBE3D5] text-stone-400 text-xs">
              暫無航班記錄，點擊右上方「新增憑證」加入
            </div>
          ) : (
            flights.map((flight) => (
              <div
                key={flight.id}
                className="relative bg-white rounded-2xl border border-[#EBE3D5] shadow-[3px_3px_0px_#E2DDD0] overflow-hidden"
              >
                {/* Ticket Top Airline Bar */}
                <div className="bg-[#1D2B3A] text-white px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-[#FDE08E]" />
                    <span className="text-xs font-bold tracking-wide">{flight.airline}</span>
                    <span className="text-xs font-mono bg-[#FDE08E] text-[#1D2B3A] px-2 py-0.5 rounded font-extrabold">
                      {flight.flightNo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono opacity-80">{flight.date}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(flight, 'flight')}
                      className="text-stone-300 hover:text-white transition-colors p-1"
                      title="編輯機票"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {onDeleteFlight && (
                      <button
                        type="button"
                        onClick={() => onDeleteFlight(flight.id)}
                        className="text-stone-300 hover:text-rose-400 transition-colors p-1"
                        title="刪除機票"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Ticket Body */}
                <div className="p-4 bg-[#FFFDF7]">
                  <div className="flex items-center justify-between gap-2">
                    {/* Origin */}
                    <div className="flex-1">
                      <span className="text-[10px] text-[#8C827A] uppercase font-mono">DEPARTURE</span>
                      <h4 className="text-lg font-black text-[#3E3A37] font-mono leading-tight">
                        {flight.departureAirport.split(' ')[0]}
                      </h4>
                      <p className="text-xs text-[#78716C] font-medium">{flight.departureAirport.split(' ').slice(1).join(' ')}</p>
                      <div className="text-sm font-bold text-[#D45068] font-mono mt-1">{flight.departureTime}</div>
                    </div>

                    {/* Flight Route Icon Graphic */}
                    <div className="flex flex-col items-center justify-center px-2">
                      <span className="text-[10px] font-mono text-[#4E7C59] font-bold">
                        {flight.type === 'outbound' ? '去程航班' : '回程航班'}
                      </span>
                      <div className="w-20 border-t-2 border-dashed border-[#C5D5B5] relative my-1">
                        <Plane className="w-3.5 h-3.5 text-[#3B523A] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFFDF7] px-0.5" />
                      </div>
                      <span className="text-[9px] text-[#8C827A]">直飛約 3小時</span>
                    </div>

                    {/* Destination */}
                    <div className="flex-1 text-right">
                      <span className="text-[10px] text-[#8C827A] uppercase font-mono">ARRIVAL</span>
                      <h4 className="text-lg font-black text-[#3E3A37] font-mono leading-tight">
                        {flight.arrivalAirport.split(' ')[0]}
                      </h4>
                      <p className="text-xs text-[#78716C] font-medium">{flight.arrivalAirport.split(' ').slice(1).join(' ')}</p>
                      <div className="text-sm font-bold text-[#2B7A82] font-mono mt-1">{flight.arrivalTime}</div>
                    </div>
                  </div>

                  {/* Dashed Tear Line */}
                  <div className="relative my-3 border-t border-dashed border-[#EBE3D5]">
                    <div className="absolute -left-6 -top-2 w-4 h-4 rounded-full bg-[#F7F4EB] border border-[#EBE3D5]" />
                    <div className="absolute -right-6 -top-2 w-4 h-4 rounded-full bg-[#F7F4EB] border border-[#EBE3D5]" />
                  </div>

                  {/* Ticket Details Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                    <div>
                      <span className="text-[10px] text-[#8C827A] block font-mono">GATE</span>
                      <span className="font-bold text-[#3E3A37] font-mono">{flight.gate || 'TBA'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C827A] block font-mono">TERMINAL</span>
                      <span className="font-bold text-[#3E3A37] font-mono">{flight.terminal || '1'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C827A] block font-mono">SEAT</span>
                      <span className="font-bold text-[#3E3A37] font-mono">{flight.seatNo || 'TBA'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C827A] block font-mono">PNR 訂位</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(flight.id, flight.bookingReference)}
                        className="font-bold text-[#3B523A] font-mono hover:underline flex items-center justify-center gap-0.5 mx-auto"
                      >
                        {copiedId === flight.id ? <Check className="w-3 h-3 text-emerald-600" /> : flight.bookingReference}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Hotels Section */}
      {(activeSubTab === 'all' || activeSubTab === 'hotels') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between pl-1">
            <h3 className="text-xs font-bold text-[#4E7C59] tracking-wider uppercase flex items-center gap-1.5">
              <Hotel className="w-3.5 h-3.5" />
              飯店住宿 (Hotels)
            </h3>
            <button
              onClick={() => handleOpenAdd('hotel')}
              className="text-xs text-[#3B523A] hover:underline font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              新增住宿
            </button>
          </div>

          {hotels.length === 0 ? (
            <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-[#EBE3D5] text-stone-400 text-xs">
              暫無住宿記錄，點擊右上方「新增憑證」加入
            </div>
          ) : (
            hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white p-4 rounded-2xl border border-[#EBE3D5] shadow-[3px_3px_0px_#E2DDD0] space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-[#3E3A37]">{hotel.name}</h4>
                    <p className="text-xs text-[#8C827A] font-medium">{hotel.japaneseName}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(hotel, 'hotel')}
                      className="text-stone-400 hover:text-[#3E3A37] transition-colors p-1"
                      title="編輯飯店"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {onDeleteHotel && (
                      <button
                        type="button"
                        onClick={() => onDeleteHotel(hotel.id)}
                        className="text-stone-300 hover:text-rose-500 transition-colors p-1"
                        title="刪除飯店"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* CheckIn CheckOut Bar */}
                <div className="grid grid-cols-2 gap-2 bg-[#FFFDF7] p-2.5 rounded-xl border border-[#EBE3D5] text-xs">
                  <div>
                    <span className="text-[10px] text-[#8C827A] block">CHECK-IN 入住</span>
                    <div className="font-bold text-[#3E3A37] font-mono">{hotel.checkInDate}</div>
                    <div className="text-[11px] text-[#4E7C59]">{hotel.checkInTime} 以後</div>
                  </div>
                  <div className="border-l border-[#EBE3D5] pl-2.5">
                    <span className="text-[10px] text-[#8C827A] block">CHECK-OUT 退房</span>
                    <div className="font-bold text-[#3E3A37] font-mono">{hotel.checkOutDate}</div>
                    <div className="text-[11px] text-[#D45068]">{hotel.checkOutTime} 前</div>
                  </div>
                </div>

                {/* Address & Direct Phone */}
                <div className="text-xs text-[#78716C] space-y-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D45068] flex-shrink-0" />
                    <span>{hotel.address}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <a
                      href={`tel:${hotel.phone}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F7F4EB] hover:bg-[#EBE3D5] text-[#3E3A37] rounded-lg font-mono font-medium transition-all"
                    >
                      <Phone className="w-3 h-3 text-[#2B7A82]" />
                      <span>{hotel.phone}</span>
                    </a>

                    {hotel.mapCode && (
                      <span className="font-mono text-[11px] bg-[#E2EAD8]/50 text-[#3B523A] px-2 py-0.5 rounded border border-[#C5D5B5]/50">
                        MapCode: {hotel.mapCode}
                      </span>
                    )}
                  </div>
                </div>

                {/* Booking Ref */}
                <div className="pt-2 border-t border-[#EBE3D5] flex items-center justify-between text-xs">
                  <span className="text-[#8C827A]">預約代號:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(hotel.id, hotel.bookingRef)}
                    className="font-mono font-bold text-[#3B523A] hover:underline flex items-center gap-1"
                  >
                    {copiedId === hotel.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : hotel.bookingRef}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Vouchers Section */}
      {(activeSubTab === 'all' || activeSubTab === 'vouchers') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between pl-1">
            <h3 className="text-xs font-bold text-[#4E7C59] tracking-wider uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              預約單與憑證檔案 (Vouchers)
            </h3>
            <button
              onClick={() => handleOpenAdd('voucher')}
              className="text-xs text-[#3B523A] hover:underline font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              新增憑證
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {vouchers.length === 0 ? (
              <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-[#EBE3D5] text-stone-400 text-xs">
                暫無憑證資料，點擊右上方「新增憑證」加入
              </div>
            ) : (
              vouchers.map((v) => (
                <div
                  key={v.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#EBE3D5] shadow-[3px_3px_0px_#E2DDD0] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F7F4EB] text-[#3B523A] border border-[#EBE3D5] flex items-center justify-center font-bold">
                      {v.type === 'flight' ? '✈️' : v.type === 'hotel' ? '🏨' : v.type === 'car' ? '🚗' : '🎫'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#3E3A37]">{v.title}</h4>
                      <p className="text-xs text-[#8C827A] mt-0.5">{v.notes}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(v.id, v.referenceNo)}
                      className="text-xs bg-[#E2EAD8] text-[#3B523A] hover:bg-[#C5D5B5] px-2.5 py-1 rounded-lg font-mono font-bold transition-all flex items-center gap-1"
                    >
                      {copiedId === v.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : v.referenceNo}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(v, 'voucher')}
                      className="text-stone-400 hover:text-[#3E3A37] transition-colors p-1"
                      title="編輯憑證"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {onDeleteVoucher && (
                      <button
                        type="button"
                        onClick={() => onDeleteVoucher(v.id)}
                        className="text-stone-300 hover:text-rose-500 transition-colors p-1"
                        title="刪除憑證"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Booking Modal */}
      <AddEditBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={modalDefaultType}
        initialData={editingItem}
        onSaveFlight={handleSaveFlight}
        onSaveHotel={handleSaveHotel}
        onSaveVoucher={handleSaveVoucher}
      />
    </div>
  );
};

