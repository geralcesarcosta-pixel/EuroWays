import React from 'react';
import { FastwingsLogo } from './FastwingsLogo';
import { Plane, ShieldCheck, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useAirline } from '../context/AirlineContext';

interface FooterProps {
  onOpenManageBooking: () => void;
  onOpenFlightStatus: () => void;
  onOpenCheckIn: () => void;
  onOpenTravelInfo: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenManageBooking,
  onOpenFlightStatus,
  onOpenCheckIn,
  onOpenTravelInfo,
}) => {
  const { setCurrentView } = useAirline();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Fastwings Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <FastwingsLogo theme="white" size="md" />
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              A companhia aérea low-cost portuguesa que liga Lisboa aos Açores com tarifas ensolaradas, rapidez operacional e pontualidade exemplar.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 bg-slate-900 px-3 py-2 border border-slate-800">
              <Plane className="w-4 h-4 text-orange-500" />
              <span>Base: Lisboa — Terminal 2 (LIS)</span>
            </div>
          </div>

          {/* Col 2: Destinos Iniciais Açores */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 border-l-2 border-orange-600 pl-2.5">
              Destinos Fastwings
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-500 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>Lisboa ⇄ Ponta Delgada (São Miguel)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-500 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>Lisboa ⇄ Terceira (Lajes)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-500 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>Lisboa ⇄ Horta (Faial)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-500 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>Lisboa ⇄ Pico</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Passageiro & Apoio */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 border-l-2 border-orange-600 pl-2.5">
              Serviços ao Passageiro
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-400">
              <li>
                <button
                  onClick={onOpenManageBooking}
                  className="hover:text-orange-500 transition-colors cursor-pointer"
                >
                  Gerir a minha reserva
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCheckIn}
                  className="hover:text-orange-500 transition-colors cursor-pointer"
                >
                  Check-in online (24h antes)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFlightStatus}
                  className="hover:text-orange-500 transition-colors cursor-pointer"
                >
                  Estado dos voos em tempo real
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTravelInfo}
                  className="hover:text-orange-500 transition-colors cursor-pointer"
                >
                  Política de Bagagem & Terminal 2
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Informação Operacional & CEO OCC */}
          <div className="space-y-4">
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 border-l-2 border-orange-600 pl-2.5">
              Modelo Operacional
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Frota: 1 × Boeing 737-800 (189Y). Rotação de turnaround máximo de 30 minutos, minimizando custos de escala e garantindo tarifas a partir de 29,99 €.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('ceo')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2.5 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <span>Acesso Painel CEO & OCC</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-bold">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Fastwings Airlines S.A. Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Operado com Boeing 737-800</span>
            <span>•</span>
            <span>Regulamentação ANAC / EASA</span>
            <span>•</span>
            <span className="text-orange-500">Sunny Low Fares</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
