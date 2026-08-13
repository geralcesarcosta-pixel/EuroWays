import React, { useState } from 'react';
import { useAirline } from '../../context/AirlineContext';
import {
  X,
  Search,
  Luggage,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Plus,
} from 'lucide-react';
import { Booking } from '../../types';

interface ManageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBookingCode?: string;
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({
  isOpen,
  onClose,
  initialBookingCode = '',
}) => {
  const { getBookingByCode, updateBooking, cancelBooking, refundBooking, destinations } = useAirline();
  const [searchCode, setSearchCode] = useState(initialBookingCode || '');
  const [searchEmail, setSearchEmail] = useState('');
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [isAddingBaggage, setIsAddingBaggage] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setActionSuccess('');

    const found = getBookingByCode(searchCode.trim());
    if (found) {
      if (searchEmail.trim()) {
        const matchesEmail = found.passengers.some(
          (p) => p.email.toLowerCase().includes(searchEmail.toLowerCase().trim())
        );
        if (!matchesEmail) {
          setErrorMsg('O email não coincide com nenhum passageiro desta reserva.');
          return;
        }
      }
      setActiveBooking(found);
    } else {
      setErrorMsg(`Nenhuma reserva encontrada com o código "${searchCode.toUpperCase()}".`);
    }
  };

  const getDestName = (code: string) => {
    const d = destinations.find((x) => x.code === code);
    return d ? `${d.name} (${code})` : code;
  };

  const handleAddExtraLuggage = () => {
    if (!activeBooking) return;
    const currentChecked = activeBooking.extras.checkedBags20kg || 0;
    const updatedExtras = {
      ...activeBooking.extras,
      checkedBags20kg: currentChecked + 1,
    };
    const updatedTotalPrice = activeBooking.totalPrice + 25; // 25€ per extra bag

    updateBooking(activeBooking.id, {
      extras: updatedExtras,
      totalPrice: updatedTotalPrice,
    });

    setActiveBooking({
      ...activeBooking,
      extras: updatedExtras,
      totalPrice: updatedTotalPrice,
    });

    setActionSuccess('1 Mala de porão (20kg) adicionada com sucesso (+25,00 €)!');
    setIsAddingBaggage(false);
  };

  const handleCancelReservation = () => {
    if (!activeBooking) return;
    if (window.confirm('Tem a certeza que deseja cancelar esta reserva? Esta ação libertará os lugares.')) {
      cancelBooking(activeBooking.id);
      setActiveBooking({
        ...activeBooking,
        paymentStatus: 'CANCELLED',
      });
      setActionSuccess('Reserva cancelada com sucesso.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b-2 border-orange-600">
          <div className="flex items-center gap-2">
            <Luggage className="w-5 h-5 text-orange-500" />
            <h3 className="font-black text-base uppercase tracking-wider">Gerir a Minha Reserva</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 transition-colors cursor-pointer text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {!activeBooking ? (
            /* Search Form */
            <form onSubmit={handleSearch} className="space-y-4">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                Insira o código de reserva de 6 caracteres (ex: <strong className="text-orange-600 font-mono">FW8K2P</strong>) e opcionalmente o email do passageiro:
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Código da Reserva (PNR) *
                  </label>
                  <input
                    type="text"
                    required
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                    placeholder="ex: FW8K2P"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 text-lg font-mono font-bold tracking-widest uppercase focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Email do Passageiro Principal (Opcional)
                  </label>
                  <input
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="ex: passageiro@email.pt"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 font-medium">
                  Código de teste: <span className="font-mono font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 border border-slate-200 cursor-pointer hover:bg-slate-200" onClick={() => setSearchCode('FW8K2P')}>FW8K2P</span>
                </div>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider px-6 py-3.5 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>Procurar Reserva</span>
                </button>
              </div>
            </form>
          ) : (
            /* Active Booking Details */
            <div className="space-y-6">
              {actionSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Booking Reference Banner */}
              <div className="bg-slate-50 border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Código de Reserva</div>
                  <div className="text-2xl font-mono font-black text-orange-600 tracking-wider">
                    {activeBooking.bookingCode}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-[10px] font-black tracking-wider uppercase ${
                      activeBooking.paymentStatus === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeBooking.paymentStatus === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {activeBooking.paymentStatus === 'PAID' ? 'Confirmada & Paga' : activeBooking.paymentStatus}
                  </span>
                  <span className="bg-slate-200 text-slate-800 px-2.5 py-1 text-[10px] font-black uppercase">
                    Tarifa {activeBooking.fareType}
                  </span>
                </div>
              </div>

              {/* Flight Summary */}
              <div className="border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="font-black text-slate-900 uppercase flex items-center gap-2 text-sm">
                    <span className="bg-orange-600 text-white px-2 py-0.5 text-xs font-mono">
                      {activeBooking.flightNumber}
                    </span>
                    <span>{getDestName(activeBooking.origin)} → {getDestName(activeBooking.destination)}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeBooking.flightDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Partida</div>
                    <div className="text-lg font-black text-slate-900">{activeBooking.departureTime}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{activeBooking.origin} (Terminal 2)</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chegada</div>
                    <div className="text-lg font-black text-slate-900">{activeBooking.arrivalTime}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{activeBooking.destination}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aeronave</div>
                    <div className="font-black text-slate-800 text-xs mt-1 uppercase">Boeing 737-800</div>
                    <div className="text-[11px] text-slate-500 font-medium">189 Lugares</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lugares</div>
                    <div className="font-black text-orange-600 font-mono text-sm mt-1">
                      {activeBooking.selectedSeats?.join(', ') || 'No Check-in'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Passengers list */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passageiros</h4>
                <div className="space-y-2">
                  {activeBooking.passengers.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="bg-slate-50 border border-slate-200 p-3 flex items-center justify-between text-xs uppercase font-bold"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-orange-600 text-white font-black flex items-center justify-center text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-black text-slate-900">{p.firstName} {p.lastName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {p.docType}: {p.docNumber} • {p.nationality}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="bg-slate-200 text-slate-800 px-2.5 py-1 text-[10px] font-black">
                          Lugar: {p.seat || activeBooking.selectedSeats?.[idx] || '12A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Baggage & Extras */}
              <div className="border border-slate-200 p-5 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Luggage className="w-4 h-4 text-orange-600" />
                    <span>Bagagem & Extras Contratados</span>
                  </h4>
                  <span className="text-xs font-black text-orange-600">
                    Total: {activeBooking.totalPrice.toFixed(2)} €
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="bg-white p-3 border border-slate-200 font-medium">
                    • Pequena mala pessoal: <strong className="font-black text-slate-900">Incluída</strong>
                  </div>
                  <div className="bg-white p-3 border border-slate-200 font-medium">
                    • Bagagem cabine 10kg: <strong className="font-black text-slate-900">{activeBooking.extras.cabinBags || (activeBooking.fareType !== 'basic' ? activeBooking.passengers.length : 0)} volume(s)</strong>
                  </div>
                  <div className="bg-white p-3 border border-slate-200 font-medium">
                    • Malas de Porão 20kg: <strong className="font-black text-slate-900">{activeBooking.extras.checkedBags20kg || 0} volume(s)</strong>
                  </div>
                  <div className="bg-white p-3 border border-slate-200 font-medium">
                    • Embarque Prioritário: <strong className="font-black text-slate-900">{activeBooking.extras.priorityBoarding ? 'Sim' : 'Não'}</strong>
                  </div>
                </div>

                {/* Add baggage button */}
                {activeBooking.paymentStatus === 'PAID' && (
                  <div className="pt-2">
                    <button
                      onClick={handleAddExtraLuggage}
                      className="w-full bg-white hover:bg-orange-50 text-orange-600 border border-orange-600 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar 1 Mala de Porão 20kg (+25,00 €)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setActiveBooking(null)}
                  className="text-slate-600 hover:text-slate-900 text-xs font-black uppercase tracking-wider underline cursor-pointer"
                >
                  ← Pesquisar outra reserva
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="border border-slate-300 hover:bg-slate-100 text-slate-800 px-4 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir Bilhete</span>
                  </button>

                  {activeBooking.paymentStatus === 'PAID' && (
                    <button
                      onClick={handleCancelReservation}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer"
                    >
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
