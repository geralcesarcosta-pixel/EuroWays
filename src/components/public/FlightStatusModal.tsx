import React, { useState } from 'react';
import { useAirline } from '../../context/AirlineContext';
import {
  X,
  Search,
  Plane,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { Flight } from '../../types';

interface FlightStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlightStatusModal: React.FC<FlightStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { flights, destinations } = useAirline();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string>('ALL');

  if (!isOpen) return null;

  const getDest = (code: string) => destinations.find((d) => d.code === code);

  const filteredFlights = flights.filter((f) => {
    const matchesNumber = f.flightNumber.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesRoute =
      selectedRoute === 'ALL' ||
      `${f.origin}-${f.destination}` === selectedRoute ||
      f.origin === selectedRoute ||
      f.destination === selectedRoute;

    return matchesNumber && matchesRoute;
  });

  const getStatusBadge = (flight: Flight) => {
    switch (flight.status) {
      case 'Landed':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Aterrou</span>
          </span>
        );
      case 'Departed':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1">
            <Plane className="w-3.5 h-3.5 animate-pulse" />
            <span>Em Voo</span>
          </span>
        );
      case 'Boarding':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Embarque</span>
          </span>
        );
      case 'Delayed':
        return (
          <span className="bg-red-100 text-red-800 border border-red-300 px-2.5 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Atrasado {flight.delayMinutes ? `(+${flight.delayMinutes}m)` : ''}</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="bg-stone-200 text-stone-800 border border-stone-300 px-2.5 py-1 rounded-full text-xs font-black uppercase">
            Cancelado
          </span>
        );
      case 'Scheduled':
      default:
        return (
          <span className="bg-stone-100 text-stone-700 border border-stone-300 px-2.5 py-1 rounded-full text-xs font-bold uppercase">
            Programado
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white shadow-2xl max-w-3xl w-full border border-slate-300 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b-2 border-orange-600 shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="font-black text-base uppercase tracking-wider">Estado dos Voos em Tempo Real</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Acompanhamento dos voos diários da Fastwings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 transition-colors cursor-pointer text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-3 shrink-0">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nº de voo (ex: FW101, FW203)..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-orange-500 focus:outline-none uppercase"
            />
          </div>

          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="bg-white border border-slate-300 text-slate-900 text-xs font-black uppercase px-3 py-2.5 focus:border-orange-500 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Todas as Rotas</option>
            <option value="LIS">Partidas / Chegadas Lisboa</option>
            <option value="PDL">Ponta Delgada (PDL)</option>
            <option value="TER">Terceira (TER)</option>
            <option value="HOR">Horta (HOR)</option>
            <option value="PIX">Pico (PIX)</option>
          </select>
        </div>

        {/* Flight list */}
        <div className="p-6 overflow-y-auto space-y-3 divide-y divide-slate-100">
          {filteredFlights.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <Plane className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-black text-xs uppercase tracking-wider">Nenhum voo encontrado com os filtros atuais.</p>
            </div>
          ) : (
            filteredFlights.map((flight) => {
              const orig = getDest(flight.origin);
              const dest = getDest(flight.destination);

              return (
                <div
                  key={flight.id}
                  className="pt-3 first:pt-0 bg-white hover:bg-slate-50 p-4 border border-slate-200 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-orange-600 text-white font-mono font-black text-xs px-2.5 py-1 uppercase">
                        {flight.flightNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-bold flex items-center gap-1 uppercase">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{flight.date}</span>
                      </span>
                      <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200">
                        {flight.aircraft}
                      </span>
                    </div>
                    <div>{getStatusBadge(flight)}</div>
                  </div>

                  {/* Route & Times */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{orig?.name || flight.origin} ({flight.origin})</div>
                      <div className="text-2xl font-black text-slate-900">{flight.departureTime}</div>
                      {flight.actualDepartureTime && (
                        <div className="text-[11px] text-slate-500">
                          Real: <strong className="text-slate-900 font-bold">{flight.actualDepartureTime}</strong>
                        </div>
                      )}
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {flight.terminal} {flight.gate ? `• Porta ${flight.gate}` : ''}
                      </div>
                    </div>

                    <div className="text-center flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Voo Direto</span>
                      <div className="w-full flex items-center gap-2 my-1">
                        <div className="h-0.5 flex-1 bg-slate-200" />
                        <Plane className="w-4 h-4 text-orange-600 rotate-90" />
                        <div className="h-0.5 flex-1 bg-slate-200" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Turnaround 30m</span>
                    </div>

                    <div className="sm:text-right">
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{dest?.name || flight.destination} ({flight.destination})</div>
                      <div className="text-2xl font-black text-slate-900">{flight.arrivalTime}</div>
                      {flight.actualArrivalTime && (
                        <div className="text-[11px] text-slate-500">
                          Real: <strong className="text-slate-900 font-bold">{flight.actualArrivalTime}</strong>
                        </div>
                      )}
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {dest?.airportName || 'Aeroporto'}
                      </div>
                    </div>
                  </div>

                  {/* Operational Notes / Delay info if present */}
                  {(flight.operationalNotes || flight.delayReason) && (
                    <div className="mt-3 text-xs bg-slate-50 text-slate-700 p-2.5 border border-slate-200 flex items-start gap-2">
                      <Layers className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        {flight.delayReason && <span className="font-bold text-red-600 mr-1 uppercase">Motivo do atraso: {flight.delayReason}.</span>}
                        {flight.operationalNotes && <span className="font-medium">{flight.operationalNotes}</span>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
