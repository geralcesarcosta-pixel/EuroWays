import React, { useState } from 'react';
import { useAirline } from '../../context/AirlineContext';
import { Flight, FareCategory } from '../../types';
import {
  Plane,
  Clock,
  Calendar,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';

interface FlightSelectStepProps {
  onSelectFlight: (flight: Flight) => void;
  onBack: () => void;
}

export const FlightSelectStep: React.FC<FlightSelectStepProps> = ({
  onSelectFlight,
  onBack,
}) => {
  const { flights, destinations, bookingSearch, calculateFlightPrice } = useAirline();
  const [selectedDate, setSelectedDate] = useState<string>(bookingSearch.departureDate);

  const origDest = destinations.find((d) => d.code === bookingSearch.origin);
  const destDest = destinations.find((d) => d.code === bookingSearch.destination);

  // Available matching flights
  const matchingFlights = flights.filter(
    (f) =>
      f.origin === bookingSearch.origin &&
      f.destination === bookingSearch.destination &&
      f.date === selectedDate &&
      f.status !== 'Cancelled'
  );

  // Generate 7-day strip centered around the selected date
  const generateDateStrip = () => {
    const dates = [];
    const base = new Date(bookingSearch.departureDate || new Date());
    for (let i = -2; i <= 4; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('pt-PT', { weekday: 'short' });
      const dayNum = d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });

      // Find lowest flight price on that day
      const dayFlights = flights.filter(
        (f) =>
          f.origin === bookingSearch.origin &&
          f.destination === bookingSearch.destination &&
          f.date === iso &&
          f.status !== 'Cancelled'
      );
      const minPrice =
        dayFlights.length > 0
          ? Math.min(...dayFlights.map((f) => calculateFlightPrice(f, 'basic')))
          : null;

      dates.push({ iso, dayName, dayNum, minPrice, count: dayFlights.length });
    }
    return dates;
  };

  const dateStrip = generateDateStrip();

  return (
    <div className="space-y-6">
      {/* Route Header Banner */}
      <div className="bg-white border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-orange-600 flex items-center gap-1.5">
            <Plane className="w-4 h-4" />
            <span>Voo Direto Fastwings • Base Lisboa T2</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2 uppercase">
            <span>{origDest?.name || bookingSearch.origin}</span>
            <ArrowRight className="w-5 h-5 text-orange-600" />
            <span>{destDest?.name || bookingSearch.destination}</span>
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
            {bookingSearch.adults} {bookingSearch.adults === 1 ? 'Adulto' : 'Adultos'}
            {bookingSearch.children > 0 ? ` • ${bookingSearch.children} Crianças` : ''}
          </p>
        </div>

        <button
          onClick={onBack}
          className="text-xs font-black uppercase tracking-wider text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 px-4 py-2 transition-colors cursor-pointer"
        >
          Modificar Pesquisa
        </button>
      </div>

      {/* 7-Day Date & Fare Picker Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
        {dateStrip.map((item) => {
          const isSelected = item.iso === selectedDate;
          return (
            <button
              key={item.iso}
              onClick={() => setSelectedDate(item.iso)}
              className={`p-3 border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md scale-[1.02]'
                  : 'bg-white hover:bg-orange-50/50 border-slate-200 text-slate-800'
              }`}
            >
              <span className={`text-[10px] uppercase font-black tracking-wider ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                {item.dayName}
              </span>
              <span className="text-sm font-black my-0.5">{item.dayNum}</span>
              {item.minPrice !== null ? (
                <span
                  className={`text-[11px] font-black mt-1 px-1.5 py-0.5 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600 border border-orange-200'
                  }`}
                >
                  {item.minPrice.toFixed(2)} €
                </span>
              ) : (
                <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                  Sem voos
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Flight Cards list */}
      <div className="space-y-4">
        {matchingFlights.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-300 p-10 text-center space-y-3">
            <Plane className="w-12 h-12 mx-auto text-slate-400" />
            <h3 className="font-black text-slate-900 text-lg uppercase">Nenhum voo direto nesta data</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
              Experimente selecionar uma data adjacente na barra de tarifas acima para ver os voos diários disponíveis com o nosso Boeing 737-800.
            </p>
          </div>
        ) : (
          matchingFlights.map((flight) => {
            const basicPrice = calculateFlightPrice(flight, 'basic');
            const availableSeats = flight.capacity - flight.soldSeats;

            return (
              <div
                key={flight.id}
                className="bg-white border border-slate-200 hover:border-orange-500 p-6 transition-all shadow-xs hover:shadow-md space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-orange-600 text-white font-mono font-black text-xs px-2.5 py-1 tracking-wider uppercase">
                      {flight.flightNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      Boeing 737-800 • 189 Lugares
                    </span>
                    {flight.isExtraFlight && (
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                        Voo Extra: {flight.extraFlightReason || 'Alta Procura'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {availableSeats <= 30 && (
                      <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 border border-amber-200">
                        Apenas {availableSeats} lugares restantes!
                      </span>
                    )}
                    <span className="text-emerald-700 font-black uppercase text-xs flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Voo Direto</span>
                    </span>
                  </div>
                </div>

                {/* Schedule and price */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Origin */}
                  <div className="md:col-span-3">
                    <div className="text-3xl font-black text-slate-900">{flight.departureTime}</div>
                    <div className="font-black text-slate-800 text-sm uppercase">
                      {origDest?.name || flight.origin} ({flight.origin})
                    </div>
                    <div className="text-xs text-slate-400 font-semibold">{flight.terminal}</div>
                  </div>

                  {/* Duration & Flight indicator */}
                  <div className="md:col-span-4 text-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      {destDest?.avgFlightDurationMin ? `${Math.floor(destDest.avgFlightDurationMin / 60)}h ${destDest.avgFlightDurationMin % 60}m` : '2h 25m'} • Direto
                    </span>
                    <div className="w-full flex items-center gap-2 my-1">
                      <div className="h-0.5 flex-1 bg-slate-300" />
                      <Plane className="w-4 h-4 text-orange-500 rotate-90" />
                      <div className="h-0.5 flex-1 bg-slate-300" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Turnaround 30m</span>
                  </div>

                  {/* Destination */}
                  <div className="md:col-span-3">
                    <div className="text-3xl font-black text-slate-900">{flight.arrivalTime}</div>
                    <div className="font-black text-slate-800 text-sm uppercase">
                      {destDest?.name || flight.destination} ({flight.destination})
                    </div>
                    <div className="text-xs text-slate-400 font-semibold">{destDest?.airportName || 'Aeroporto'}</div>
                  </div>

                  {/* Price CTA */}
                  <div className="md:col-span-2 md:text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Desde</div>
                    <div className="text-2xl font-black text-orange-600 leading-none mb-2">
                      {basicPrice.toFixed(2)} €
                    </div>
                    <button
                      onClick={() => onSelectFlight(flight)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black px-4 py-2.5 text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <span>Selecionar</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
