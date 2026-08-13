import React, { useState } from 'react';
import { FastwingsLogo } from './FastwingsLogo';
import { useAirline } from '../context/AirlineContext';
import {
  Plane,
  Luggage,
  Info,
  HelpCircle,
  Clock,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Ticket,
} from 'lucide-react';

interface HeaderProps {
  onOpenManageBooking: () => void;
  onOpenFlightStatus: () => void;
  onOpenCheckIn: () => void;
  onOpenTravelInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenManageBooking,
  onOpenFlightStatus,
  onOpenCheckIn,
  onOpenTravelInfo,
}) => {
  const { currentView, setCurrentView, requestCeoAccess } = useAirline();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCeo = currentView === 'ceo';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
      {/* Top micro bar */}
      <div className="bg-slate-900 text-white text-xs font-semibold px-4 sm:px-10 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="bg-orange-600 text-white px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">
            BASE LISBOA T2
          </span>
          <span className="hidden sm:inline text-slate-300 text-xs font-medium">
            Ligações diretas diárias para os Açores • Turnaround 30 min • Boeing 737-800
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenFlightStatus}
            className="hover:text-orange-400 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>Estado dos Voos</span>
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => {
              if (isCeo) {
                setCurrentView('home');
              } else {
                requestCeoAccess();
              }
            }}
            className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
            id="ceo-quick-toggle"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
            <span>{isCeo ? '← Voltar ao Site' : 'Painel CEO / OCC'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <FastwingsLogo
            theme="orange"
            size="md"
            onClick={() => setCurrentView('home')}
          />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-black uppercase tracking-widest text-slate-700">
            <button
              onClick={() => setCurrentView('home')}
              className={`transition-colors cursor-pointer ${
                currentView === 'home' || currentView === 'booking'
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                  : 'hover:text-orange-600 pb-1'
              }`}
            >
              Voos
            </button>
            <button
              onClick={onOpenManageBooking}
              className="hover:text-orange-600 transition-colors cursor-pointer pb-1 flex items-center gap-1.5"
            >
              <Luggage className="w-4 h-4 text-slate-400" />
              <span>Gerir reserva</span>
            </button>
            <button
              onClick={onOpenCheckIn}
              className="hover:text-orange-600 transition-colors cursor-pointer pb-1 flex items-center gap-1.5"
            >
              <Ticket className="w-4 h-4 text-slate-400" />
              <span>Check-in online</span>
            </button>
            <button
              onClick={onOpenTravelInfo}
              className="hover:text-orange-600 transition-colors cursor-pointer pb-1 flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>Informação</span>
            </button>
          </nav>
        </div>

        {/* Right CTA section */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-slate-400 font-black text-xs tracking-wider">
            PT | EUR
          </div>
          <button
            onClick={onOpenCheckIn}
            className="border-2 border-slate-200 hover:border-orange-500 text-slate-800 font-bold px-4 py-2 text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Check-in
          </button>
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 100, behavior: 'smooth' });
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white font-black px-5 py-2.5 text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-2"
          >
            <Plane className="w-4 h-4" />
            <span>Procurar Voos</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-md bg-slate-100 cursor-pointer"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3"
          >
            <Plane className="w-5 h-5 text-orange-600" />
            <span>Pesquisar Voos</span>
          </button>
          <button
            onClick={() => {
              onOpenManageBooking();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3"
          >
            <Luggage className="w-5 h-5 text-slate-500" />
            <span>Gerir a minha reserva</span>
          </button>
          <button
            onClick={() => {
              onOpenCheckIn();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3"
          >
            <Ticket className="w-5 h-5 text-slate-500" />
            <span>Check-in online</span>
          </button>
          <button
            onClick={() => {
              onOpenFlightStatus();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3"
          >
            <Clock className="w-5 h-5 text-slate-500" />
            <span>Estado dos voos em tempo real</span>
          </button>
          <button
            onClick={() => {
              onOpenTravelInfo();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3"
          >
            <Info className="w-5 h-5 text-slate-500" />
            <span>Informações de viagem & Bagagem</span>
          </button>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setCurrentView(isCeo ? 'home' : 'ceo');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>{isCeo ? 'Ir para Website Público' : 'Aceder ao Painel CEO / OCC'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
