import React, { useState } from 'react';
import {
  X,
  Info,
  Luggage,
  MapPin,
  Clock,
  Plane,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';

interface TravelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TravelInfoModal: React.FC<TravelInfoModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'terminal2' | 'baggage' | 'turnaround' | 'azores'>('terminal2');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white shadow-2xl max-w-3xl w-full border border-slate-300 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b-2 border-orange-600 shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="font-black text-base uppercase tracking-wider">Informações de Viagem Fastwings</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Guia de passageiro, Terminal 2 e políticas de bagagem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 transition-colors cursor-pointer text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('terminal2')}
            className={`pb-3 px-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'terminal2'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Base: Terminal 2 Lisboa
          </button>
          <button
            onClick={() => setActiveTab('baggage')}
            className={`pb-3 px-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'baggage'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Bagagem & Tarifas
          </button>
          <button
            onClick={() => setActiveTab('turnaround')}
            className={`pb-3 px-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'turnaround'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Modelo Low-Cost (30m Turnaround)
          </button>
          <button
            onClick={() => setActiveTab('azores')}
            className={`pb-3 px-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'azores'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Destinos Açores
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700">
          {activeTab === 'terminal2' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-5 flex items-start gap-3">
                <Plane className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-sm">Todos os voos Fastwings partem do Terminal 2 de Lisboa</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                    O Terminal 2 de Lisboa é o terminal dedicado a companhias de alta eficiência low-cost. Todos os voos de partida para os Açores partem deste terminal.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 p-5 space-y-2">
                  <h5 className="font-black text-slate-900 uppercase flex items-center gap-2 text-xs">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>Autocarro Shuttle Gratuito</span>
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Existe um shuttle bus gratuito que liga o Terminal 1 (Metropolitano de Lisboa) ao Terminal 2 a cada 10 minutos. O trajeto demora cerca de 3 minutos.
                  </p>
                </div>

                <div className="border border-slate-200 p-5 space-y-2">
                  <h5 className="font-black text-slate-900 uppercase flex items-center gap-2 text-xs">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>Horários de Comparência</span>
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    • Entrega de bagagem: encerra 40 min antes do voo.<br />
                    • Porta de embarque: encerra impreterivelmente 20 min antes do voo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'baggage' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-slate-200 p-5 space-y-3 bg-slate-50">
                  <div className="font-black text-slate-900 uppercase text-xs">1. Basic (desde 29,99 €)</div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Check className="w-3.5 h-3.5 text-orange-600" />
                      <span>Pequena mala pessoal (40×20×25 cm)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1 font-medium">
                      Deve caber debaixo do assento à sua frente (mochila, bolsa ou pasta).
                    </p>
                  </div>
                </div>

                <div className="border-2 border-orange-600 p-5 space-y-3 bg-white shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-orange-600 uppercase text-xs">2. Smart (desde 49,99 €)</div>
                    <span className="bg-orange-600 text-white text-[9px] font-black px-1.5 py-0.5 uppercase">Popular</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 font-medium">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Check className="w-3.5 h-3.5 text-orange-600" />
                      <span>Pequena mala pessoal</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Check className="w-3.5 h-3.5 text-orange-600" />
                      <span>Mala de cabine 10kg (55×40×20 cm)</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Check className="w-3.5 h-3.5 text-orange-600" />
                      <span>Escolha de lugar standard</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-900 p-5 space-y-3 bg-slate-950 text-white">
                  <div className="font-black text-orange-500 uppercase text-xs">3. Plus (desde 74,99 €)</div>
                  <div className="text-xs text-slate-300 space-y-1.5 font-medium">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Check className="w-3.5 h-3.5 text-orange-500" />
                      <span>Mala pessoal + Cabine 10kg</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Check className="w-3.5 h-3.5 text-orange-500" />
                      <span>Mala de Porão 20kg</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Check className="w-3.5 h-3.5 text-orange-500" />
                      <span>Escolha de qualquer lugar</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Check className="w-3.5 h-3.5 text-orange-500" />
                      <span>Alteração de voo gratuita</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'turnaround' && (
            <div className="space-y-4">
              <div className="border border-slate-200 p-5 bg-slate-50 space-y-3">
                <h4 className="font-black text-slate-900 text-sm uppercase flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>O segredo das tarifas baixas: 30 minutos de turnaround</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  A Fastwings opera com base numa frota homogénea de <strong className="text-slate-900">Boeing 737-800 com 189 lugares em classe única</strong>. O nosso modelo operacional inovador exige um tempo máximo de rotação no solo de 30 minutos entre aterrar e descolar novamente.
                </p>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-white p-3 border border-slate-200 text-center">
                    <div className="text-xl font-black text-orange-600">189 Y</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Classe Única Eficiente</div>
                  </div>
                  <div className="bg-white p-3 border border-slate-200 text-center">
                    <div className="text-xl font-black text-orange-600">30 min</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Turnaround Máximo</div>
                  </div>
                  <div className="bg-white p-3 border border-slate-200 text-center">
                    <div className="text-xl font-black text-orange-600">12h+</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Utilização Diária do 737</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'azores' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200">
                  <div className="font-black text-slate-900 uppercase">Ponta Delgada (PDL) — São Miguel</div>
                  <p className="text-slate-600 mt-1 font-medium leading-relaxed">Lagoa das 7 Cidades, Termas da Ferraria e Cozido das Furnas. Voos diários pela manhã e final do dia.</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200">
                  <div className="font-black text-slate-900 uppercase">Terceira (TER) — Lajes</div>
                  <p className="text-slate-600 mt-1 font-medium leading-relaxed">Angra do Heroísmo, Biscoitos e Algar do Carvão. Ligações diretas para o grupo central.</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200">
                  <div className="font-black text-slate-900 uppercase">Pico (PIX) — Madalena / São Roque</div>
                  <p className="text-slate-600 mt-1 font-medium leading-relaxed">Subida à montanha mais alta de Portugal e trilhos pelas vinhas de lava negra.</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200">
                  <div className="font-black text-slate-900 uppercase">Horta (HOR) — Faial</div>
                  <p className="text-slate-600 mt-1 font-medium leading-relaxed">Marina internacional dos iatistas, Peter Café Sport e paisagem lunar dos Capelinhos.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
