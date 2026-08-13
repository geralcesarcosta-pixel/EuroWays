import React from 'react';
import { Plane, Check, Sparkles, AlertCircle } from 'lucide-react';

interface SeatMapProps {
  passengerCount: number;
  selectedSeats: string[];
  onSelectSeat: (seatId: string) => void;
  fareType: 'basic' | 'smart' | 'plus';
}

export const SeatMap: React.FC<SeatMapProps> = ({
  passengerCount,
  selectedSeats,
  onSelectSeat,
  fareType,
}) => {
  // 189 seats layout for Boeing 737-800 (Rows 1 to 32, 6 seats per row, row 13 skipped or row 32 having 3 seats)
  // Rows 1-5: Front premium (Extra comfort)
  // Rows 16-17: Emergency Exit (Extra legroom)
  // Rows 6-15, 18-32: Standard
  const rows = Array.from({ length: 32 }, (_, i) => i + 1).filter((r) => r !== 13); // 31 rows * 6 = 186 + 3 = 189 seats
  const columnsLeft = ['A', 'B', 'C'];
  const columnsRight = ['D', 'E', 'F'];

  // Some pre-occupied random seats for realism
  const occupiedSeats = new Set([
    '1A', '1B', '2C', '3D', '4F', '7A', '7B', '8C', '10D', '11F',
    '14A', '14B', '15C', '16A', '18D', '19E', '20F', '22A', '24C',
    '25D', '27E', '28F', '29A', '30B', '31C'
  ]);

  const getSeatPrice = (row: number): number => {
    if (fareType === 'plus') return 0;
    if (row <= 5 || row === 16 || row === 17) {
      return fareType === 'smart' ? 6.00 : 12.00;
    }
    return fareType === 'smart' ? 0 : 5.00;
  };

  const getSeatType = (row: number): 'front' | 'exit' | 'standard' => {
    if (row <= 5) return 'front';
    if (row === 16 || row === 17) return 'exit';
    return 'standard';
  };

  return (
    <div className="bg-slate-50 border border-slate-200 p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h4 className="font-black text-slate-900 text-base uppercase flex items-center gap-2 tracking-tight">
            <Plane className="w-5 h-5 text-orange-600" />
            <span>Mapa de Lugares — Boeing 737-800 (189 Lugares)</span>
          </h4>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
            Selecione {passengerCount} {passengerCount === 1 ? 'lugar' : 'lugares'} para a sua viagem
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-white border border-slate-300" />
            <span className="text-slate-600 font-bold text-[10px] uppercase">Disponível</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-orange-600 text-white font-bold flex items-center justify-center text-[10px]">
              ✓
            </div>
            <span className="font-black text-orange-600 text-[10px] uppercase">Selecionado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-slate-300 text-slate-500 flex items-center justify-center text-[10px]">
              ✕
            </div>
            <span className="text-slate-400 font-bold text-[10px] uppercase">Ocupado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-amber-100 border border-amber-400" />
            <span className="text-amber-800 font-bold text-[10px] uppercase">Saída de Emergência</span>
          </div>
        </div>
      </div>

      {/* Selected summary */}
      <div className="bg-white p-3.5 border border-slate-200 flex items-center justify-between text-xs">
        <span className="font-black uppercase tracking-wider text-slate-700 text-[11px]">
          Lugares Escolhidos ({selectedSeats.length}/{passengerCount}):
        </span>
        <div className="flex items-center gap-2">
          {selectedSeats.length === 0 ? (
            <span className="text-slate-400 uppercase text-[10px] font-bold">Nenhum lugar selecionado</span>
          ) : (
            selectedSeats.map((s) => (
              <span key={s} className="bg-orange-600 text-white font-mono font-black px-2.5 py-0.5 text-xs uppercase">
                {s}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Fuselage layout */}
      <div className="max-w-md mx-auto bg-white border border-slate-300 p-4 sm:p-6 shadow-xs">
        {/* Cockpit nose visual */}
        <div className="text-center pb-4 border-b border-slate-200 mb-4">
          <div className="w-20 h-8 bg-slate-200 mx-auto rounded-t-full flex items-center justify-center text-[10px] font-black text-slate-700 uppercase tracking-widest">
            FRENTE
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">PORTA DIANTEIRA (1L / 1R)</span>
        </div>

        {/* Seat rows */}
        <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
          {rows.map((row) => {
            const isExit = row === 16 || row === 17;
            const isFront = row <= 5;
            const seatFee = getSeatPrice(row);

            return (
              <div key={row} className="relative">
                {isExit && row === 16 && (
                  <div className="my-2 py-1 bg-amber-50 border border-amber-300 text-center text-[9px] font-black text-amber-900 uppercase tracking-wider flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>SAÍDA DE EMERGÊNCIA — ESPAÇO EXTRA PARA AS PERNAS</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  {/* Left Side (A, B, C) */}
                  <div className="flex items-center gap-1.5">
                    {columnsLeft.map((col) => {
                      const seatId = `${row}${col}`;
                      const isOccupied = occupiedSeats.has(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          disabled={isOccupied}
                          onClick={() => onSelectSeat(seatId)}
                          className={`w-7 h-8 sm:w-8 sm:h-9 text-xs font-black transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isOccupied
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : isSelected
                              ? 'bg-orange-600 text-white shadow-sm ring-2 ring-orange-300 scale-105'
                              : isExit
                              ? 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
                              : isFront
                              ? 'bg-orange-50/50 border border-orange-200 text-slate-800 hover:bg-orange-100'
                              : 'bg-white border border-slate-300 text-slate-700 hover:border-orange-500 hover:bg-orange-50/30'
                          }`}
                        >
                          <span className="text-[10px]">{col}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle & Row Number */}
                  <div className="w-8 text-center text-xs font-mono font-bold text-slate-400">
                    {row}
                  </div>

                  {/* Right Side (D, E, F) */}
                  <div className="flex items-center gap-1.5">
                    {columnsRight.map((col) => {
                      const seatId = `${row}${col}`;
                      const isOccupied = occupiedSeats.has(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          disabled={isOccupied}
                          onClick={() => onSelectSeat(seatId)}
                          className={`w-7 h-8 sm:w-8 sm:h-9 text-xs font-black transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isOccupied
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : isSelected
                              ? 'bg-orange-600 text-white shadow-sm ring-2 ring-orange-300 scale-105'
                              : isExit
                              ? 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
                              : isFront
                              ? 'bg-orange-50/50 border border-orange-200 text-slate-800 hover:bg-orange-100'
                              : 'bg-white border border-slate-300 text-slate-700 hover:border-orange-500 hover:bg-orange-50/30'
                          }`}
                        >
                          <span className="text-[10px]">{col}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back exit */}
        <div className="text-center pt-4 border-t border-slate-200 mt-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PORTA TRASEIRA & WC (2L / 2R)</span>
        </div>
      </div>
    </div>
  );
};
