import React, { useState } from 'react';
import { useAirline } from '../../context/AirlineContext';
import {
  Plane,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  Luggage,
  Clock,
  Ticket,
  Info,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface HomePageProps {
  onOpenManageBooking: () => void;
  onOpenFlightStatus: () => void;
  onOpenCheckIn: () => void;
  onOpenTravelInfo: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenManageBooking,
  onOpenFlightStatus,
  onOpenCheckIn,
  onOpenTravelInfo,
}) => {
  const {
    destinations,
    bookingSearch,
    setBookingSearch,
    setCurrentView,
  } = useAirline();

  const [origin, setOrigin] = useState(bookingSearch.origin || 'LIS');
  const [destination, setDestination] = useState(bookingSearch.destination || 'PDL');
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>(bookingSearch.tripType || 'oneway');
  const [departureDate, setDepartureDate] = useState(bookingSearch.departureDate);
  const [returnDate, setReturnDate] = useState(bookingSearch.returnDate || '');
  const [adults, setAdults] = useState(bookingSearch.adults || 1);

  const activeDestinations = destinations.filter((d) => d.active);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSearch({
      origin,
      destination,
      tripType,
      departureDate,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      adults,
      children: 0,
    });
    setCurrentView('booking');
  };

  const handleSelectPopularRoute = (destCode: string) => {
    setOrigin('LIS');
    setDestination(destCode);
    setBookingSearch({
      origin: 'LIS',
      destination: destCode,
      tripType: 'oneway',
      departureDate,
      adults: 1,
      children: 0,
    });
    setCurrentView('booking');
  };

  return (
    <div className="space-y-12 pb-16 bg-slate-50">
      {/* Top Accent Gradient Line */}
      <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-300 w-full" />

      {/* Hero Section with Search Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="space-y-6">
          {/* Headline */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Base Lisboa (Terminal 2) ⇄ Açores</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
                Voos Rápidos & Tarifas Ensolaradas
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider max-w-md sm:text-right">
              Voe sem escalas para São Miguel, Terceira, Pico e Faial desde 29,99 € no nosso Boeing 737-800
            </p>
          </div>

          {/* Search Card Container */}
          <div className="bg-white shadow-2xl p-6 sm:p-10 border border-slate-200 space-y-6">
            {/* Trip Type Selector */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTripType('oneway')}
                  className={`px-5 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    tripType === 'oneway'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Só Ida
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('roundtrip')}
                  className={`px-5 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    tripType === 'roundtrip'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Ida e Volta
                </button>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                Turnaround Máximo 30 Min
              </span>
            </div>

            {/* Search Engine Form */}
            <form onSubmit={handleSearchSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Origin */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1.5">
                    Origem
                  </label>
                  <div className="border-2 border-slate-200 p-3 sm:p-3.5 font-bold text-sm sm:text-base flex items-center bg-slate-50 focus-within:border-orange-500 focus-within:bg-white transition-all">
                    <MapPin className="w-4 h-4 text-orange-500 mr-2 shrink-0" />
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer uppercase text-sm"
                    >
                      <option value="LIS">Lisboa (LIS) — T2</option>
                      {activeDestinations
                        .filter((d) => d.code !== 'LIS')
                        .map((d) => (
                          <option key={d.code} value={d.code}>
                            {d.name} ({d.code})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1.5">
                    Destino
                  </label>
                  <div className="border-2 border-slate-200 p-3 sm:p-3.5 font-bold text-sm sm:text-base flex items-center bg-slate-50 focus-within:border-orange-500 focus-within:bg-white transition-all">
                    <Plane className="w-4 h-4 text-orange-500 mr-2 shrink-0" />
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer uppercase text-sm"
                    >
                      {activeDestinations
                        .filter((d) => d.code !== origin)
                        .map((d) => (
                          <option key={d.code} value={d.code}>
                            {d.name} ({d.code})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Departure Date */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1.5">
                    Data de Ida
                  </label>
                  <div className="border-2 border-slate-200 p-2.5 sm:p-3 font-bold text-sm sm:text-base flex items-center bg-slate-50 focus-within:border-orange-500 focus-within:bg-white transition-all">
                    <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="date"
                      required
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full bg-transparent font-black text-slate-900 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Passengers */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1.5">
                    Passageiros
                  </label>
                  <div className="border-2 border-slate-200 p-3 sm:p-3.5 font-bold text-sm sm:text-base flex items-center bg-slate-50 focus-within:border-orange-500 focus-within:bg-white transition-all">
                    <Users className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer uppercase text-sm"
                    >
                      <option value={1}>1 Adulto</option>
                      <option value={2}>2 Adultos</option>
                      <option value={3}>3 Adultos</option>
                      <option value={4}>4 Adultos</option>
                      <option value={5}>5 Adultos</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Big Search CTA */}
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xl sm:text-2xl py-5 sm:py-6 transition-all shadow-lg active:scale-[0.99] uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer"
                id="search-flights-cta"
              >
                <Plane className="w-6 h-6" />
                <span>PROCURAR VOOS</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
            Destinos Populares <span className="text-orange-600">Açores</span>
          </h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Tarifas Diretas desde Lisboa T2
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeDestinations
            .filter((d) => d.code !== 'LIS')
            .map((dest) => (
              <div
                key={dest.code}
                onClick={() => handleSelectPopularRoute(dest.code)}
                className="bg-white p-5 border border-slate-200 hover:border-orange-500 transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden mb-4 border border-slate-100">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                      {dest.islandOrCity}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-400 mb-1 tracking-wider uppercase">
                    Lisboa → {dest.code}
                  </div>
                  <h3 className="font-black text-lg text-slate-900 group-hover:text-orange-600 transition-colors uppercase">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    desde
                  </div>
                  <div className="text-orange-600 font-black text-xl">
                    {dest.featuredPrice.toFixed(2)} €
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Quick Passenger Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Gerir a minha reserva */}
          <div
            onClick={onOpenManageBooking}
            className="bg-white border border-slate-200 hover:border-orange-500 p-6 transition-all shadow-xs hover:shadow-md cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 bg-slate-100 text-orange-600 font-black flex items-center justify-center">
              <Luggage className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">Gerir Reserva</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Consulte a sua reserva, adicione malas de porão de 20kg ou altere lugares no Boeing 737.
            </p>
          </div>

          {/* Estado do voo */}
          <div
            onClick={onOpenFlightStatus}
            className="bg-white border border-slate-200 hover:border-orange-500 p-6 transition-all shadow-xs hover:shadow-md cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 bg-slate-100 text-orange-600 font-black flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">Estado do Voo</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Consulte partidas, portas de embarque no Terminal 2 e horários operacionais em direto.
            </p>
          </div>

          {/* Check-in online */}
          <div
            onClick={onOpenCheckIn}
            className="bg-white border border-slate-200 hover:border-orange-500 p-6 transition-all shadow-xs hover:shadow-md cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 bg-slate-100 text-orange-600 font-black flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">Check-in Online</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Emita o seu cartão de embarque digital com código QR a partir de 24h antes do voo.
            </p>
          </div>

          {/* Informações de viagem */}
          <div
            onClick={onOpenTravelInfo}
            className="bg-white border border-slate-200 hover:border-orange-500 p-6 transition-all shadow-xs hover:shadow-md cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 bg-slate-100 text-orange-600 font-black flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">Guia de Viagem</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Terminal 2 de Lisboa, regras de bagagem de mão e modelo low-cost de 30m turnaround.
            </p>
          </div>
        </div>
      </div>

      {/* Operations Live Status Banner (From Professional Polish Theme) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between border border-slate-800 gap-6">
          <div className="flex flex-wrap items-center gap-8">
            <div>
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                Centro de Operações Fastwings
              </div>
              <div className="font-black text-base flex items-center gap-2 text-white mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>AERONAVE 01: BOEING 737-800 (CS-FWG) ATIVA</span>
              </div>
            </div>

            <div className="hidden sm:block border-l border-slate-800 pl-8">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                Utilização Diária
              </div>
              <div className="font-black text-base text-orange-400 mt-1">
                12H 45M • 30M TURNAROUND
              </div>
            </div>

            <div className="hidden lg:block border-l border-slate-800 pl-8">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                Rotas de Hoje (LIS T2)
              </div>
              <div className="font-mono font-bold text-xs text-slate-300 mt-1 flex gap-2">
                <span className="bg-slate-800 px-2 py-0.5 rounded">PDL</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded">TER</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded">PIX</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded">HOR</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenFlightStatus}
              className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 text-xs font-black uppercase tracking-wider transition-colors text-center cursor-pointer border border-slate-700"
            >
              Ver Voos em Direto
            </button>
            <button
              onClick={() => setCurrentView('ceo')}
              className="flex-1 md:flex-none bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 text-xs font-black uppercase tracking-wider transition-colors text-center cursor-pointer"
            >
              Painel OCC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
