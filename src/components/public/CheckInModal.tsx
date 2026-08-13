import React, { useState } from 'react';
import { useAirline } from '../../context/AirlineContext';
import {
  X,
  Ticket,
  Search,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Printer,
  Download,
  Plane,
  ShieldCheck,
} from 'lucide-react';
import { Booking } from '../../types';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose }) => {
  const { getBookingByCode, checkInBooking, destinations } = useAirline();
  const [code, setCode] = useState('');
  const [surname, setSurname] = useState('');
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState<'search' | 'verify' | 'boarding_pass'>('search');
  const [agreedSafety, setAgreedSafety] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const found = getBookingByCode(code.trim());

    if (!found) {
      setErrorMsg(`Reserva "${code.toUpperCase()}" não encontrada.`);
      return;
    }

    if (surname.trim()) {
      const match = found.passengers.some((p) =>
        p.lastName.toLowerCase().includes(surname.toLowerCase().trim())
      );
      if (!match) {
        setErrorMsg('O apelido introduzido não coincide com nenhum passageiro desta reserva.');
        return;
      }
    }

    setActiveBooking(found);
    if (found.checkedIn) {
      setStep('boarding_pass');
    } else {
      setStep('verify');
    }
  };

  const handleCompleteCheckIn = () => {
    if (!activeBooking) return;
    if (!agreedSafety) {
      setErrorMsg('Por favor confirme as declarações de segurança de bagagem.');
      return;
    }

    const assignments: { [paxId: string]: string } = {};
    activeBooking.passengers.forEach((p, idx) => {
      assignments[p.id] = p.seat || `${12 + idx}${['A', 'B', 'C', 'D', 'E', 'F'][idx % 6]}`;
    });

    checkInBooking(activeBooking.bookingCode, assignments);
    const updated = getBookingByCode(activeBooking.bookingCode);
    if (updated) {
      setActiveBooking(updated);
    }
    setStep('boarding_pass');
  };

  const getDestName = (c: string) => {
    const d = destinations.find((x) => x.code === c);
    return d ? `${d.name} (${c})` : c;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b-2 border-orange-600">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="font-black text-base uppercase tracking-wider">Check-in Online</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Emita o seu cartão de embarque digital Fastwings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 transition-colors cursor-pointer text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {step === 'search' && (
            <form onSubmit={handleSearch} className="space-y-4">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                O check-in online abre 24h antes da partida do voo e encerra 2h antes.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Código de Reserva *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ex: FW8K2P"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 text-lg font-mono font-bold tracking-widest uppercase focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Apelido do Passageiro *
                  </label>
                  <input
                    type="text"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="ex: Silva"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none uppercase"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  Demonstração: <strong className="cursor-pointer text-orange-600 underline font-mono" onClick={() => { setCode('FW8K2P'); setSurname('Silva'); }}>FW8K2P (Silva)</strong>
                </span>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider px-6 py-3.5 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>Iniciar Check-in</span>
                </button>
              </div>
            </form>
          )}

          {step === 'verify' && activeBooking && (
            <div className="space-y-5">
              <div className="bg-slate-50 border border-slate-200 p-4">
                <div className="font-black text-slate-900 text-sm uppercase mb-1">
                  {activeBooking.flightNumber} • {getDestName(activeBooking.origin)} → {getDestName(activeBooking.destination)}
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-3 font-medium">
                  <span>Data: <strong className="text-slate-900 font-bold">{activeBooking.flightDate}</strong></span>
                  <span>Partida: <strong className="text-slate-900 font-bold">{activeBooking.departureTime}</strong></span>
                  <span>Terminal: <strong className="text-slate-900 font-bold">Terminal 2 (LIS)</strong></span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Passageiros a Efetuar Check-in
                </h4>
                {activeBooking.passengers.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-3 bg-white border border-slate-200 flex items-center justify-between text-xs uppercase"
                  >
                    <div>
                      <div className="font-black text-slate-900">{p.firstName} {p.lastName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.docType}: {p.docNumber}</div>
                    </div>
                    <span className="bg-orange-100 text-orange-600 font-mono font-black px-2.5 py-1 text-xs">
                      Lugar: {p.seat || `${12 + idx}A`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Safety Declaration */}
              <div className="border border-slate-200 p-4 bg-amber-50/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-950 font-black text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Declaração de Artigos Perigosos</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Declaro que não transporto na bagagem de mão baterias de lítio soltas danificadas, gases comprimidos, explosivos ou líquidos em recipientes individuais superiores a 100ml.
                </p>
                <label className="flex items-center gap-2 pt-1 text-xs font-black uppercase tracking-wider text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedSafety}
                    onChange={(e) => setAgreedSafety(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded-none border-slate-300 focus:ring-orange-500"
                  />
                  <span>Li e aceito as condições de segurança e transporte da Fastwings.</span>
                </label>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep('search')}
                  className="text-slate-600 hover:text-slate-900 text-xs font-black uppercase tracking-wider underline cursor-pointer"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handleCompleteCheckIn}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider px-6 py-3.5 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar & Emitir Cartão</span>
                </button>
              </div>
            </div>
          )}

          {step === 'boarding_pass' && activeBooking && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check-in Concluído com Sucesso</span>
                </div>
                <h4 className="font-black text-slate-900 text-base uppercase">Cartão de Embarque Digital</h4>
              </div>

              {/* Digital Boarding Pass Ticket */}
              {activeBooking.passengers.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="border border-slate-900 shadow-md bg-white"
                >
                  {/* Top Ticket Strip */}
                  <div className="bg-slate-950 text-white px-6 py-3 flex items-center justify-between border-b-2 border-orange-600">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-orange-500" />
                      <span className="font-black tracking-widest text-xs uppercase">FASTWINGS BOARDING PASS</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-orange-500 bg-slate-900 px-2 py-0.5 border border-slate-800">
                      PNR: {activeBooking.bookingCode}
                    </span>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Passageiro</div>
                          <div className="text-sm font-black text-slate-900 uppercase">{p.firstName} {p.lastName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Voo</div>
                          <div className="text-sm font-mono font-black text-orange-600">{activeBooking.flightNumber}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 border border-slate-200">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Origem</div>
                          <div className="text-xl font-black text-slate-900">{activeBooking.origin}</div>
                          <div className="text-[10px] text-slate-500 font-bold">{activeBooking.departureTime}</div>
                        </div>
                        <div className="flex items-center justify-center">
                          <Plane className="w-4 h-4 text-orange-600 rotate-90" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Destino</div>
                          <div className="text-xl font-black text-slate-900">{activeBooking.destination}</div>
                          <div className="text-[10px] text-slate-500 font-bold">{activeBooking.arrivalTime}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="bg-slate-100 p-2 border border-slate-200">
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Data</div>
                          <div className="font-black text-slate-900 text-xs">{activeBooking.flightDate}</div>
                        </div>
                        <div className="bg-slate-100 p-2 border border-slate-200">
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Terminal</div>
                          <div className="font-black text-slate-900 text-xs">T2 (LIS)</div>
                        </div>
                        <div className="bg-slate-100 p-2 border border-slate-200">
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Porta</div>
                          <div className="font-black text-slate-900 text-xs">204</div>
                        </div>
                        <div className="bg-orange-50 border border-orange-500 p-2">
                          <div className="text-[9px] text-orange-600 uppercase font-black">LUGAR</div>
                          <div className="text-sm font-mono font-black text-orange-600">{p.seat || `${12 + idx}A`}</div>
                        </div>
                      </div>
                    </div>

                    {/* QR Code / Barcode side */}
                    <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-dashed border-slate-300">
                      <div className="w-24 h-24 bg-slate-950 text-white flex flex-col items-center justify-center p-2">
                        <QrCode className="w-16 h-16 text-white" />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-500 mt-2">
                        {activeBooking.bookingCode}-{p.seat || '12A'}-B737
                      </span>
                      <span className="text-[9px] text-orange-600 font-black uppercase mt-1">EMBARQUE GRUPO 1</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setStep('search')}
                  className="text-slate-600 hover:text-slate-900 text-xs font-black uppercase tracking-wider underline cursor-pointer"
                >
                  ← Outro check-in
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-slate-950 hover:bg-black text-white font-black uppercase tracking-wider px-5 py-3 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Printer className="w-4 h-4 text-orange-500" />
                    <span>Imprimir / Guardar PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
