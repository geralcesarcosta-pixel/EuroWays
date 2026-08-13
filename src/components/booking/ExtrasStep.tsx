import React, { useState } from 'react';
import { BookingExtras, FareCategory } from '../../types';
import { SeatMap } from './SeatMap';
import { Luggage, ShieldCheck, Zap, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';

interface ExtrasStepProps {
  passengerCount: number;
  fareType: FareCategory;
  initialExtras: BookingExtras;
  initialSeats: string[];
  onSubmitExtras: (extras: BookingExtras, seats: string[]) => void;
  onBack: () => void;
}

export const ExtrasStep: React.FC<ExtrasStepProps> = ({
  passengerCount,
  fareType,
  initialExtras,
  initialSeats,
  onSubmitExtras,
  onBack,
}) => {
  const [extras, setExtras] = useState<BookingExtras>(initialExtras);
  const [seats, setSeats] = useState<string[]>(initialSeats);

  const handleSeatToggle = (seatId: string) => {
    if (seats.includes(seatId)) {
      setSeats(seats.filter((s) => s !== seatId));
    } else {
      if (seats.length < passengerCount) {
        setSeats([...seats, seatId]);
      } else {
        // Replace last
        setSeats([...seats.slice(0, passengerCount - 1), seatId]);
      }
    }
  };

  const updateLuggage = (type: 'cabinBags' | 'checkedBags20kg', delta: number) => {
    setExtras((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Personalize a sua Viagem</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Escolha os seus lugares a bordo do 737-800 e adicione bagagem extra</p>
      </div>

      {/* Seat Map component */}
      <SeatMap
        passengerCount={passengerCount}
        selectedSeats={seats}
        onSelectSeat={handleSeatToggle}
        fareType={fareType}
      />

      {/* Baggage & Addons options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Checked 20kg Bag */}
        <div className="bg-white border border-slate-200 p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <div className="font-black text-slate-900 flex items-center gap-2 uppercase text-sm">
              <Luggage className="w-5 h-5 text-orange-600" />
              <span>Mala de Porão 20kg</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Ideal para férias nos Açores (+25,00 €/unidade)</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateLuggage('checkedBags20kg', -1)}
              className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black flex items-center justify-center cursor-pointer border border-slate-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono font-black text-base w-4 text-center">{extras.checkedBags20kg}</span>
            <button
              type="button"
              onClick={() => updateLuggage('checkedBags20kg', 1)}
              className="w-8 h-8 bg-orange-600 hover:bg-orange-700 text-white font-black flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Priority Boarding & Fast Track */}
        <div
          onClick={() => setExtras({ ...extras, priorityBoarding: !extras.priorityBoarding })}
          className={`border p-5 flex items-center justify-between cursor-pointer transition-all shadow-xs ${
            extras.priorityBoarding
              ? 'border-orange-600 bg-orange-50/50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="space-y-1">
            <div className="font-black text-slate-900 flex items-center gap-2 uppercase text-sm">
              <Zap className="w-5 h-5 text-orange-600" />
              <span>Embarque Prioritário Fastwings</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Entre a bordo no Grupo 1 (+8,00 €)</p>
          </div>
          <input
            type="checkbox"
            checked={extras.priorityBoarding}
            onChange={() => {}}
            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
          />
        </div>

        {/* Travel Insurance */}
        <div
          onClick={() => setExtras({ ...extras, travelInsurance: !extras.travelInsurance })}
          className={`border p-5 flex items-center justify-between cursor-pointer transition-all md:col-span-2 shadow-xs ${
            extras.travelInsurance
              ? 'border-orange-600 bg-orange-50/50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="space-y-1">
            <div className="font-black text-slate-900 flex items-center gap-2 uppercase text-sm">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <span>Seguro de Viagem & Cancelamento Açores</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Cobertura médica, bagagem extraviada e cancelamentos meteorológicos (+14,90 €)</p>
          </div>
          <input
            type="checkbox"
            checked={extras.travelInsurance}
            onChange={() => {}}
            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-black uppercase tracking-wider px-5 py-3.5 text-xs flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar aos Passageiros</span>
        </button>

        <button
          type="button"
          onClick={() => onSubmitExtras(extras, seats)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider px-8 py-3.5 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
        >
          <span>Ir para Pagamento</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
