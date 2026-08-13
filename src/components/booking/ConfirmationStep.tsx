import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Booking } from '../../types';
import { useAirline } from '../../context/AirlineContext';
import {
  CheckCircle2,
  Calendar,
  Plane,
  Printer,
  Download,
  Share2,
  Luggage,
  ArrowRight,
  Ticket,
} from 'lucide-react';

interface ConfirmationStepProps {
  booking: Booking;
  onFinish: () => void;
  onOpenCheckIn: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  booking,
  onFinish,
  onOpenCheckIn,
}) => {
  const { destinations } = useAirline();

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FA8205', '#FFA940', '#FFD591', '#1E293B'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const origDest = destinations.find((d) => d.code === booking.origin);
  const destDest = destinations.find((d) => d.code === booking.destination);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Success Badge */}
      <div className="bg-slate-950 text-white p-8 text-center space-y-4 border border-slate-800 shadow-xl">
        <div className="w-14 h-14 bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black tracking-tight uppercase">Reserva Confirmada com Sucesso!</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider max-w-md mx-auto">
          O seu bilhete eletrónico e detalhes da viagem foram emitidos e enviados por email.
        </p>

        <div className="bg-slate-900 border border-slate-800 text-white p-4 inline-block mx-auto mt-2">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Código de Reserva Fastwings</div>
          <div className="text-3xl font-mono font-black text-orange-500 tracking-widest mt-0.5">
            {booking.bookingCode}
          </div>
        </div>
      </div>

      {/* Ticket Details Card */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Voo Direto Fastwings</span>
            <h3 className="text-lg font-black text-slate-900 uppercase">
              {origDest?.name || booking.origin} → {destDest?.name || booking.destination}
            </h3>
          </div>
          <span className="bg-orange-600 text-white font-mono font-black text-xs px-3 py-1 uppercase">
            {booking.flightNumber}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Data</span>
            <div className="font-black text-slate-900 text-sm mt-0.5">{booking.flightDate}</div>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Horário</span>
            <div className="font-black text-slate-900 text-sm mt-0.5">{booking.departureTime} → {booking.arrivalTime}</div>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Terminal</span>
            <div className="font-black text-slate-900 text-sm mt-0.5">Terminal 2 (LIS)</div>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Lugares</span>
            <div className="font-mono font-black text-orange-600 text-sm mt-0.5">
              {booking.selectedSeats?.join(', ') || 'No Check-in'}
            </div>
          </div>
        </div>

        {/* Passengers list */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passageiros:</span>
          {booking.passengers.map((p, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 p-3 text-xs font-black text-slate-800 flex items-center justify-between uppercase">
              <span>{p.firstName} {p.lastName}</span>
              <span className="text-slate-500 font-mono">{p.docType}: {p.docNumber}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => window.print()}
          className="border border-slate-300 hover:bg-slate-100 text-slate-800 font-black uppercase tracking-wider py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Imprimir Confirmação</span>
        </button>

        <button
          onClick={onOpenCheckIn}
          className="bg-slate-950 hover:bg-black text-white font-black uppercase tracking-wider py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Ticket className="w-4 h-4 text-orange-500" />
          <span>Fazer Check-in Online</span>
        </button>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onFinish}
          className="text-slate-600 hover:text-slate-900 text-xs font-black uppercase tracking-wider underline cursor-pointer"
        >
          Voltar à Página Inicial
        </button>
      </div>
    </div>
  );
};
