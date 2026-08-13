import React, { useState } from 'react';
import { useAirline } from '../../context/AirlineContext';
import {
  Plane,
  TrendingUp,
  Users,
  Percent,
  Euro,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Settings,
  Luggage,
  MapPin,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Flight, Booking, Destination, PriceBucket, FlightStatus, OperationalConflict } from '../../types';

export const CeoDashboard: React.FC = () => {
  const {
    kpisToday,
    flights,
    destinations,
    bookings,
    priceBuckets,
    priceLimits,
    addFlight,
    updateFlight,
    deleteFlight,
    updateFlightStatus,
    updatePriceBuckets,
    setManualFlightPrice,
    addDestination,
    toggleDestination,
    updateBooking,
    cancelBooking,
    refundBooking,
    createBooking,
    checkOperationalConflicts,
    resetToDefaults,
    setCurrentView,
  } = useAirline();

  const [activeTab, setActiveTab] = useState<'overview' | 'flights' | 'yield' | 'bookings' | 'destinations'>('overview');

  // Modal states
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  // Flight search & filters
  const [flightFilterDate, setFlightFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [flightSearchTerm, setFlightSearchTerm] = useState('');

  // Booking search
  const [bookingSearchTerm, setBookingSearchTerm] = useState('');
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);

  // New Flight Form state
  const [newFlightData, setNewFlightData] = useState({
    flightNumber: 'FW901',
    origin: 'LIS',
    destination: 'PDL',
    date: new Date().toISOString().split('T')[0],
    departureTime: '22:30',
    arrivalTime: '23:55',
    aircraft: 'Aircraft 01 (B737-800)',
    capacity: 189,
    terminal: 'Terminal 2',
    gate: '204',
    status: 'Scheduled' as FlightStatus,
    basePrice: 39.99,
    isExtraFlight: true,
    extraFlightReason: 'Pico de Verão / Alta Procura',
    operationalNotes: '',
  });

  // Operational conflict feedback for modal
  const [conflictErrors, setConflictErrors] = useState<OperationalConflict[]>([]);

  // New Destination Form state
  const [newDestData, setNewDestData] = useState<Destination>({
    code: 'FNC',
    name: 'Funchal',
    islandOrCity: 'Madeira',
    country: 'Portugal',
    airportName: 'Aeroporto Internacional Cristiano Ronaldo',
    avgFlightDurationMin: 100,
    active: true,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    description: 'Ilha da Madeira, floresta Laurissilva, levadas e clima ameno o ano inteiro.',
    airportTax: 15.0,
    featuredPrice: 39.99,
  });

  // Manual office booking form state
  const [manualBookingForm, setManualBookingForm] = useState({
    flightId: flights[0]?.id || '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    docNumber: '',
    seat: '14A',
    fareType: 'smart' as const,
    checkedBags: 1,
  });

  // Check conflicts live when filling flight form
  const handleValidateNewFlight = () => {
    const conflicts = checkOperationalConflicts(newFlightData, editingFlight?.id);
    setConflictErrors(conflicts);
    return conflicts;
  };

  const handleSaveFlight = (e: React.FormEvent) => {
    e.preventDefault();
    const conflicts = handleValidateNewFlight();
    const hasFatal = conflicts.some((c) => c.severity === 'error');

    if (hasFatal) {
      return;
    }

    if (editingFlight) {
      updateFlight(editingFlight.id, newFlightData);
      setEditingFlight(null);
    } else {
      addFlight(newFlightData);
    }
    setShowAddFlightModal(false);
  };

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    addDestination(newDestData);
    setShowAddDestModal(false);
  };

  const handleSaveManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const fl = flights.find((f) => f.id === manualBookingForm.flightId) || flights[0];
    if (!fl) return;

    createBooking({
      flightId: fl.id,
      flightNumber: fl.flightNumber,
      flightDate: fl.date,
      origin: fl.origin,
      destination: fl.destination,
      departureTime: fl.departureTime,
      arrivalTime: fl.arrivalTime,
      fareType: manualBookingForm.fareType,
      passengers: [
        {
          id: `pax-${Date.now()}`,
          type: 'adult',
          firstName: manualBookingForm.firstName,
          lastName: manualBookingForm.lastName,
          docType: 'CC',
          docNumber: manualBookingForm.docNumber,
          nationality: 'Portuguesa',
          email: manualBookingForm.email,
          phone: manualBookingForm.phone,
          seat: manualBookingForm.seat,
        },
      ],
      selectedSeats: [manualBookingForm.seat],
      extras: {
        cabinBags: 1,
        checkedBags20kg: manualBookingForm.checkedBags,
        priorityBoarding: true,
        fastTrack: false,
        travelInsurance: false,
        flexTicket: false,
      },
      totalPrice: fl.basePrice + 20 + manualBookingForm.checkedBags * 25,
      paymentStatus: 'PAID',
      paymentMethod: 'Escritório / Backoffice',
      checkedIn: false,
      notes: 'Reserva inserida manualmente pela equipa de operações Fastwings.',
    });

    setShowManualBookingModal(false);
  };

  const todayFlights = flights
    .filter((f) => f.date === flightFilterDate && f.status !== 'Cancelled')
    .sort((a, b) => a.departureTime.localeCompare(b.departureTime));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      {/* CEO Top Banner */}
      <div className="bg-slate-950 border-b-2 border-orange-600 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              FW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-wider uppercase text-white">FASTWINGS — Operations Control (OCC)</h1>
                <span className="bg-orange-600/20 text-orange-500 border border-orange-500/40 text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">
                  CEO / OCC LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Base: Lisboa Terminal 2 • Frota: 1 × Boeing 737-800 (189Y) • Turnaround Máximo 30 min
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all border border-slate-700 cursor-pointer shadow-xs active:scale-98"
            >
              ← Ir para Site Público
            </button>
            <button
              onClick={() => {
                if (window.confirm('Deseja repor os dados originais de demonstração da Fastwings?')) {
                  resetToDefaults();
                }
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Repor dados de fábrica"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-orange-600 text-orange-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard & Planner do 737</span>
          </button>

          <button
            onClick={() => setActiveTab('flights')}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'flights'
                ? 'border-orange-600 text-orange-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Gestão de Voos & Voos Extra</span>
          </button>

          <button
            onClick={() => setActiveTab('yield')}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'yield'
                ? 'border-orange-600 text-orange-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Euro className="w-4 h-4" />
            <span>Tarifas & Price Buckets</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'border-orange-600 text-orange-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Reservas ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('destinations')}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'destinations'
                ? 'border-orange-600 text-orange-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Destinos ({destinations.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* TAB 1: OVERVIEW & AIRCRAFT PLANNER */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Voos Hoje</span>
                <div className="text-2xl font-black text-white">{kpisToday.flightsCount}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">100% Boeing 737-800</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passageiros</span>
                <div className="text-2xl font-black text-orange-500">{kpisToday.passengersCount}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Transportados hoje</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Load Factor</span>
                <div className="text-2xl font-black text-emerald-400">{kpisToday.loadFactor}%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Ocupação da aeronave</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receita Hoje</span>
                <div className="text-2xl font-black text-white">{kpisToday.revenue.toLocaleString('pt-PT')} €</div>
                <div className="text-[10px] text-emerald-400 uppercase font-bold">+12% vs. previsão</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aeronaves</span>
                <div className="text-2xl font-black text-white">{kpisToday.aircraftAvailable}</div>
                <div className="text-[10px] text-emerald-400 uppercase font-bold">Status: ACTIVE 100%</div>
              </div>

              <div className="bg-slate-950 border border-orange-600/50 p-4 space-y-1 bg-orange-950/20">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Aircraft Utilisation</span>
                <div className="text-2xl font-black text-orange-500">{kpisToday.aircraftUtilization}</div>
                <div className="text-[10px] text-slate-300 uppercase font-bold">Tempo de voo hoje</div>
              </div>
            </div>

            {/* Visual Aircraft Planner Timeline */}
            <div className="bg-slate-950 border border-slate-800 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Plane className="w-4 h-4" />
                    <span>Visual OCC Aircraft Planner • Frota Homogénea</span>
                  </div>
                  <h2 className="text-lg font-black text-white uppercase tracking-wide mt-0.5">
                    Rotação Diária: B737-800 | Aircraft 01 (CS-FST)
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={flightFilterDate}
                    onChange={(e) => setFlightFilterDate(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-1.5 text-xs font-bold focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setEditingFlight(null);
                      setShowAddFlightModal(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ ADICIONAR VOO EXTRA</span>
                  </button>
                </div>
              </div>

              {/* Timeline diagram text */}
              <div className="bg-slate-900 p-4 border border-slate-800 font-mono text-xs flex flex-wrap items-center gap-2 text-slate-300">
                <span className="text-orange-500 font-black uppercase">ROTAÇÃO ATIVA:</span>
                {todayFlights.map((f, idx) => (
                  <React.Fragment key={f.id}>
                    <span className="bg-slate-800 text-white px-2 py-0.5 font-bold border border-slate-700">
                      {f.departureTime} {f.origin}
                    </span>
                    <span className="text-orange-500 font-black">→</span>
                    <span className="bg-slate-800 text-white px-2 py-0.5 font-bold border border-slate-700">
                      {f.arrivalTime} {f.destination}
                    </span>
                    {idx < todayFlights.length - 1 && (
                      <span className="text-slate-600 font-bold">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Visual Gantt Segments */}
              <div className="space-y-4 pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blocos de Voo & Turnaround (30 min)</div>
                <div className="space-y-3">
                  {todayFlights.map((flight, idx) => {
                    const nextFlight = todayFlights[idx + 1];
                    let turnaroundMinutes = 0;
                    let hasTurnaroundIssue = false;

                    if (nextFlight) {
                      const [arrH, arrM] = flight.arrivalTime.split(':').map(Number);
                      const [nextH, nextM] = nextFlight.departureTime.split(':').map(Number);
                      turnaroundMinutes = nextH * 60 + nextM - (arrH * 60 + arrM);
                      if (turnaroundMinutes < 30) hasTurnaroundIssue = true;
                    }

                    return (
                      <div key={flight.id} className="space-y-2">
                        {/* Flight Segment Box */}
                        <div className="bg-slate-900 border border-slate-800 hover:border-orange-500 p-4 flex flex-wrap items-center justify-between gap-4 transition-all">
                          <div className="flex items-center gap-3">
                            <span className="bg-orange-600 text-white font-mono font-black px-2.5 py-1 text-xs">
                              {flight.flightNumber}
                            </span>
                            <div>
                              <div className="font-black text-white text-sm uppercase">
                                {flight.origin} → {flight.destination}
                              </div>
                              <div className="text-xs text-slate-400 font-medium">
                                {flight.departureTime} às {flight.arrivalTime} • Porta {flight.gate}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right text-xs">
                              <div className="text-[10px] text-slate-400 font-bold uppercase">Ocupação</div>
                              <div className="font-bold text-white">
                                {flight.soldSeats} / {flight.capacity} ({Math.round((flight.soldSeats / flight.capacity) * 100)}%)
                              </div>
                            </div>

                            <select
                              value={flight.status}
                              onChange={(e) => updateFlightStatus(flight.id, e.target.value as FlightStatus)}
                              className="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 text-xs font-bold focus:border-orange-500 focus:outline-none cursor-pointer uppercase"
                            >
                              <option value="Scheduled">Scheduled</option>
                              <option value="Boarding">Boarding</option>
                              <option value="Departed">Departed</option>
                              <option value="Delayed">Delayed</option>
                              <option value="Landed">Landed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            <button
                              onClick={() => {
                                setEditingFlight(flight);
                                setNewFlightData({
                                  flightNumber: flight.flightNumber,
                                  origin: flight.origin,
                                  destination: flight.destination,
                                  date: flight.date,
                                  departureTime: flight.departureTime,
                                  arrivalTime: flight.arrivalTime,
                                  aircraft: flight.aircraft,
                                  capacity: flight.capacity,
                                  terminal: flight.terminal,
                                  gate: flight.gate,
                                  status: flight.status,
                                  basePrice: flight.basePrice,
                                  isExtraFlight: !!flight.isExtraFlight,
                                  extraFlightReason: flight.extraFlightReason || '',
                                  operationalNotes: flight.operationalNotes || '',
                                });
                                setShowAddFlightModal(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Turnaround block connector */}
                        {nextFlight && (
                          <div className="flex items-center gap-3 pl-8 py-1">
                            <div className="w-0.5 h-6 bg-slate-800" />
                            <div
                              className={`text-xs px-3 py-1 font-bold flex items-center gap-1.5 uppercase tracking-wider ${
                                hasTurnaroundIssue
                                  ? 'bg-red-950 text-red-200 border border-red-500 animate-pulse'
                                  : 'bg-slate-900 text-emerald-400 border border-slate-800'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>
                                Turnaround em {flight.destination}: {turnaroundMinutes} min
                                {hasTurnaroundIssue ? ' (⚠ ERRO: Mínimo 30 min)' : ' (Válido)'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLIGHTS & EXTRA FLIGHTS */}
        {activeTab === 'flights' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-wider">Programação de Voos & Voos Extra</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Adicione e controle voos regulares e extras sazonais</p>
              </div>

              <button
                onClick={() => {
                  setEditingFlight(null);
                  setShowAddFlightModal(true);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>+ ADICIONAR VOO EXTRA</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Pesquisar por nº de voo..."
                  value={flightSearchTerm}
                  onChange={(e) => setFlightSearchTerm(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-bold text-white focus:border-orange-500 focus:outline-none uppercase"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Voo</th>
                      <th className="py-3 px-4">Rota</th>
                      <th className="py-3 px-4">Data & Horário</th>
                      <th className="py-3 px-4">Aeronave</th>
                      <th className="py-3 px-4">Lugares</th>
                      <th className="py-3 px-4">Tarifa Base</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium">
                    {flights
                      .filter((f) => f.flightNumber.toLowerCase().includes(flightSearchTerm.toLowerCase()))
                      .map((flight) => (
                        <tr key={flight.id} className="hover:bg-slate-900">
                          <td className="py-3 px-4 font-mono font-black text-white">
                            <span className="bg-orange-600 text-white px-2 py-0.5 text-[11px]">
                              {flight.flightNumber}
                            </span>
                            {flight.isExtraFlight && (
                              <span className="ml-1.5 bg-purple-900 text-purple-200 px-1.5 py-0.5 text-[9px] font-bold uppercase">
                                Extra
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-bold text-white uppercase">
                            {flight.origin} → {flight.destination}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {flight.date} ({flight.departureTime} - {flight.arrivalTime})
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{flight.aircraft}</td>
                          <td className="py-3 px-4 text-slate-300">
                            <span className="font-bold text-white">{flight.soldSeats}</span> / {flight.capacity}
                          </td>
                          <td className="py-3 px-4 font-black text-orange-500 font-mono">
                            {flight.basePrice.toFixed(2)} €
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-slate-800 text-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase border border-slate-700">
                              {flight.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Tem a certeza que deseja eliminar o voo ${flight.flightNumber}?`)) {
                                  deleteFlight(flight.id);
                                }
                              }}
                              className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: YIELD & PRICE BUCKETS */}
        {activeTab === 'yield' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-wider">Gestão das Tarifas & Dynamic Price Buckets</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  O preço da tarifa sobe automaticamente à medida que o Boeing 737-800 vai enchendo.
                </p>
              </div>
            </div>

            {/* Buckets Configuration */}
            <div className="bg-slate-950 border border-slate-800 p-6 space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Euro className="w-4 h-4 text-orange-500" />
                <span>Escalões de Preço Dinâmico (Price Buckets)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {priceBuckets.map((bucket, idx) => (
                  <div key={bucket.id} className="bg-slate-900 border border-slate-800 p-4 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Escalão {idx + 1}: {bucket.minSeats}–{bucket.maxSeats} lugares vendidos
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={bucket.price}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const next = priceBuckets.map((b) => (b.id === bucket.id ? { ...b, price: val } : b));
                          updatePriceBuckets(next);
                        }}
                        className="w-28 bg-slate-950 border border-slate-700 px-3 py-1.5 text-base font-black text-orange-500 focus:border-orange-500 focus:outline-none"
                      />
                      <span className="text-xs font-black text-white uppercase">€ (Basic)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Smart: +20 € ({bucket.price + 20} €) • Plus: +45 € ({bucket.price + 45} €)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKING MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-wider">Gestão Central de Reservas</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pesquise, edite passageiros, emita reembolsos ou crie reservas manuais</p>
              </div>

              <button
                onClick={() => setShowManualBookingModal(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>+ CRIAR RESERVA MANUAL</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 space-y-4">
              <input
                type="text"
                placeholder="Pesquisar por Código (ex: FW8K2P), Nome ou Voo..."
                value={bookingSearchTerm}
                onChange={(e) => setBookingSearchTerm(e.target.value)}
                className="w-full sm:w-80 bg-slate-900 border border-slate-700 px-4 py-2 text-xs font-bold text-white focus:border-orange-500 focus:outline-none uppercase"
              />

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Código (PNR)</th>
                      <th className="py-3 px-4">Passageiro</th>
                      <th className="py-3 px-4">Voo & Rota</th>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Tarifa</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium">
                    {bookings
                      .filter(
                        (b) =>
                          b.bookingCode.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
                          b.passengers.some((p) => p.lastName.toLowerCase().includes(bookingSearchTerm.toLowerCase())) ||
                          b.flightNumber.toLowerCase().includes(bookingSearchTerm.toLowerCase())
                      )
                      .map((bk) => (
                        <tr key={bk.id} className="hover:bg-slate-900">
                          <td className="py-3 px-4 font-mono font-black text-orange-500">{bk.bookingCode}</td>
                          <td className="py-3 px-4 font-bold text-white uppercase">
                            {bk.passengers[0]?.firstName} {bk.passengers[0]?.lastName}
                            {bk.passengers.length > 1 ? ` (+${bk.passengers.length - 1})` : ''}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {bk.flightNumber} ({bk.origin} → {bk.destination})
                          </td>
                          <td className="py-3 px-4 text-slate-400">{bk.flightDate}</td>
                          <td className="py-3 px-4 uppercase font-bold text-slate-300">{bk.fareType}</td>
                          <td className="py-3 px-4 font-black text-white">{bk.totalPrice.toFixed(2)} €</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-black uppercase ${
                                bk.paymentStatus === 'PAID'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                  : 'bg-red-950 text-red-300 border border-red-700'
                              }`}
                            >
                              {bk.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            {bk.paymentStatus === 'PAID' && (
                              <button
                                onClick={() => refundBooking(bk.id)}
                                className="text-amber-400 hover:underline cursor-pointer font-bold uppercase text-[10px]"
                              >
                                Reembolsar
                              </button>
                            )}
                            {bk.paymentStatus === 'PAID' && (
                              <button
                                onClick={() => cancelBooking(bk.id)}
                                className="text-red-400 hover:underline cursor-pointer font-bold uppercase text-[10px]"
                              >
                                Cancelar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DESTINATIONS */}
        {activeTab === 'destinations' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-wider">Gestão de Destinos & Rotas</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ative ou crie novas rotas para a Fastwings (ex: Funchal, Porto, Faro)</p>
              </div>

              <button
                onClick={() => setShowAddDestModal(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>+ ADICIONAR DESTINO</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {destinations.map((dest) => (
                <div
                  key={dest.code}
                  className="bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-slate-900 font-mono font-black text-orange-500 px-2 py-0.5 border border-slate-800 text-xs">
                        {dest.code}
                      </span>
                      <button
                        onClick={() => toggleDestination(dest.code)}
                        className={`px-2.5 py-0.5 text-[9px] font-black uppercase cursor-pointer ${
                          dest.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {dest.active ? 'Ativo no Site' : 'Inativo'}
                      </button>
                    </div>
                    <h3 className="font-black text-base uppercase text-white">{dest.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 font-medium">{dest.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Duração Média:</span>
                    <span className="font-black text-white">{dest.avgFlightDurationMin} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT FLIGHT */}
      {showAddFlightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-950 text-white max-w-xl w-full border border-slate-700 p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b-2 border-orange-600 pb-3">
              <h3 className="font-black text-base uppercase tracking-wider text-white">
                {editingFlight ? `Editar Voo ${editingFlight.flightNumber}` : '+ Adicionar Voo / Voo Extra'}
              </h3>
              <button onClick={() => setShowAddFlightModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFlight} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Nº do Voo *</label>
                  <input
                    type="text"
                    required
                    value={newFlightData.flightNumber}
                    onChange={(e) => setNewFlightData({ ...newFlightData, flightNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold uppercase focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={newFlightData.date}
                    onChange={(e) => setNewFlightData({ ...newFlightData, date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Origem *</label>
                  <select
                    value={newFlightData.origin}
                    onChange={(e) => setNewFlightData({ ...newFlightData, origin: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none uppercase"
                  >
                    {destinations.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Destino *</label>
                  <select
                    value={newFlightData.destination}
                    onChange={(e) => setNewFlightData({ ...newFlightData, destination: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none uppercase"
                  >
                    {destinations.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Hora Partida (HH:mm) *</label>
                  <input
                    type="time"
                    required
                    value={newFlightData.departureTime}
                    onChange={(e) => setNewFlightData({ ...newFlightData, departureTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Hora Chegada (HH:mm) *</label>
                  <input
                    type="time"
                    required
                    value={newFlightData.arrivalTime}
                    onChange={(e) => setNewFlightData({ ...newFlightData, arrivalTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Preço Inicial (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newFlightData.basePrice}
                    onChange={(e) => setNewFlightData({ ...newFlightData, basePrice: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold text-orange-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Porta / Gate</label>
                  <input
                    type="text"
                    value={newFlightData.gate}
                    onChange={(e) => setNewFlightData({ ...newFlightData, gate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none uppercase"
                  />
                </div>
              </div>

              {/* Conflict alerts if any */}
              {conflictErrors.length > 0 && (
                <div className="p-3 bg-red-950 border border-red-500 space-y-1">
                  <div className="font-black text-red-400 flex items-center gap-1.5 uppercase text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>⚠ Conflito Operacional Detetado</span>
                  </div>
                  {conflictErrors.map((c, i) => (
                    <p key={i} className="text-red-200 text-[11px] leading-relaxed">
                      • {c.message}: {c.details}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddFlightModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 font-black uppercase text-xs tracking-wider cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 font-black uppercase text-xs tracking-wider shadow-xs cursor-pointer active:scale-98"
                >
                  Guardar Voo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DESTINATION */}
      {showAddDestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-950 text-white max-w-md w-full border border-slate-700 p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b-2 border-orange-600 pb-3">
              <h3 className="font-black text-base uppercase tracking-wider text-white">+ Adicionar Novo Destino</h3>
              <button onClick={() => setShowAddDestModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Código IATA (ex: FNC, OPO, FAO) *</label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  value={newDestData.code}
                  onChange={(e) => setNewDestData({ ...newDestData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold uppercase focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Nome da Cidade / Ilha *</label>
                <input
                  type="text"
                  required
                  value={newDestData.name}
                  onChange={(e) => setNewDestData({ ...newDestData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Nome do Aeroporto</label>
                <input
                  type="text"
                  value={newDestData.airportName}
                  onChange={(e) => setNewDestData({ ...newDestData, airportName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Duração Voo (min)</label>
                  <input
                    type="number"
                    value={newDestData.avgFlightDurationMin}
                    onChange={(e) => setNewDestData({ ...newDestData, avgFlightDurationMin: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Preço Inicial (€)</label>
                  <input
                    type="number"
                    value={newDestData.featuredPrice}
                    onChange={(e) => setNewDestData({ ...newDestData, featuredPrice: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold text-orange-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDestModal(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 font-black uppercase text-xs tracking-wider cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 font-black uppercase text-xs tracking-wider shadow-xs cursor-pointer active:scale-98"
                >
                  Adicionar Destino
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL OFFICE BOOKING */}
      {showManualBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-950 text-white max-w-md w-full border border-slate-700 p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b-2 border-orange-600 pb-3">
              <h3 className="font-black text-base uppercase tracking-wider text-white">+ Criar Reserva Manual (Backoffice)</h3>
              <button onClick={() => setShowManualBookingModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualBooking} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Selecionar Voo *</label>
                <select
                  value={manualBookingForm.flightId}
                  onChange={(e) => setManualBookingForm({ ...manualBookingForm, flightId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold text-white focus:border-orange-500 focus:outline-none uppercase"
                >
                  {flights.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.flightNumber} ({f.origin} → {f.destination}) • {f.date} {f.departureTime}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Primeiro Nome *</label>
                  <input
                    type="text"
                    required
                    value={manualBookingForm.firstName}
                    onChange={(e) => setManualBookingForm({ ...manualBookingForm, firstName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Apelido *</label>
                  <input
                    type="text"
                    required
                    value={manualBookingForm.lastName}
                    onChange={(e) => setManualBookingForm({ ...manualBookingForm, lastName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={manualBookingForm.email}
                  onChange={(e) => setManualBookingForm({ ...manualBookingForm, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Nº CC / Passaporte</label>
                  <input
                    type="text"
                    value={manualBookingForm.docNumber}
                    onChange={(e) => setManualBookingForm({ ...manualBookingForm, docNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Lugar 737</label>
                  <input
                    type="text"
                    value={manualBookingForm.seat}
                    onChange={(e) => setManualBookingForm({ ...manualBookingForm, seat: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 font-bold focus:border-orange-500 focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowManualBookingModal(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 font-black uppercase text-xs tracking-wider cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 font-black uppercase text-xs tracking-wider shadow-xs cursor-pointer active:scale-98"
                >
                  Emitir Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
