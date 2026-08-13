import React from 'react';
import { useAirline } from '../../context/AirlineContext';
import { Flight, FareCategory, FareDetail } from '../../types';
import { Check, ShieldCheck, Sparkles, Luggage, ArrowLeft, ArrowRight, UserCheck } from 'lucide-react';

interface FareSelectStepProps {
  selectedFlight: Flight;
  onSelectFare: (fareType: FareCategory) => void;
  onBack: () => void;
}

export const FareSelectStep: React.FC<FareSelectStepProps> = ({
  selectedFlight,
  onSelectFare,
  onBack,
}) => {
  const { calculateFlightPrice, destinations } = useAirline();

  const origDest = destinations.find((d) => d.code === selectedFlight.origin);
  const destDest = destinations.find((d) => d.code === selectedFlight.destination);

  const basicPrice = calculateFlightPrice(selectedFlight, 'basic');
  const smartPrice = calculateFlightPrice(selectedFlight, 'smart');
  const plusPrice = calculateFlightPrice(selectedFlight, 'plus');

  const fares: FareDetail[] = [
    {
      type: 'basic',
      name: 'Basic',
      price: basicPrice,
      badge: 'Mais Económica',
      baggageSummary: 'Pequena mala pessoal incluída.',
      features: [
        'Pequena mala pessoal (40×20×25 cm)',
        'Lugar atribuído aleatoriamente no check-in',
        'Check-in online gratuito 24h antes',
        'Sem taxas escondidas',
      ],
    },
    {
      type: 'smart',
      name: 'Smart',
      price: smartPrice,
      badge: 'Mais Popular • Recomendado',
      baggageSummary: 'Mala pessoal + bagagem de cabine 10kg + escolha de lugar.',
      features: [
        'Pequena mala pessoal (40×20×25 cm)',
        'Mala de Cabine 10kg no compartimento superior (55×40×20 cm)',
        'Escolha de lugar standard incluída',
        'Embarque Prioritário Fastwings',
        'Check-in online 48h antes',
      ],
    },
    {
      type: 'plus',
      name: 'Plus',
      price: plusPrice,
      badge: 'Total Flexibilidade',
      baggageSummary: 'Mala pessoal + cabine + 20 kg porão + escolha de lugar + alteração de voo.',
      features: [
        'Pequena mala pessoal (40×20×25 cm)',
        'Mala de Cabine 10kg no compartimento superior',
        '1 Mala de Porão 20kg incluída',
        'Escolha de qualquer lugar (incluindo saída de emergência)',
        'Embarque prioritário + Fast Track no aeroporto',
        'Alteração de voo gratuita até 2h antes',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Flight info strip */}
      <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
            Voo Selecionado
          </span>
          <h3 className="text-base font-black text-slate-900 uppercase">
            {selectedFlight.flightNumber}: {origDest?.name || selectedFlight.origin} → {destDest?.name || selectedFlight.destination} ({selectedFlight.departureTime} - {selectedFlight.arrivalTime})
          </h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{selectedFlight.date} • Boeing 737-800</p>
        </div>

        <button
          onClick={onBack}
          className="text-xs font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Alterar voo</span>
        </button>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Escolha a sua Tarifa</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Selecione o nível de serviço que melhor se adapta à sua viagem</p>
      </div>

      {/* 3 Fare Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fares.map((fare) => {
          const isSmart = fare.type === 'smart';
          const isPlus = fare.type === 'plus';

          return (
            <div
              key={fare.type}
              className={`flex flex-col justify-between transition-all duration-200 ${
                isSmart
                  ? 'border-2 border-orange-600 bg-white shadow-xl relative sm:-translate-y-2'
                  : isPlus
                  ? 'border-2 border-slate-900 bg-white shadow-md'
                  : 'border border-slate-200 bg-white shadow-xs'
              }`}
            >
              {/* Badge */}
              {isSmart && (
                <div className="bg-orange-600 text-white text-center text-xs font-black py-2 uppercase tracking-widest">
                  {fare.badge}
                </div>
              )}

              <div className="p-6 space-y-5">
                <div>
                  {!isSmart && (
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {fare.badge}
                    </span>
                  )}
                  <h3 className="text-2xl font-black text-slate-900 mt-1 uppercase">{fare.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">{fare.baggageSummary}</p>
                </div>

                {/* Price block */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Por passageiro</div>
                  <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1">
                    <span className={isSmart ? 'text-orange-600' : ''}>{fare.price.toFixed(2)}</span>
                    <span className="text-lg font-black">€</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-3 pt-2">
                  {fare.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div
                        className={`w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 ${
                          isSmart
                            ? 'bg-orange-100 text-orange-600'
                            : isPlus
                            ? 'bg-slate-900 text-white'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="leading-snug font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectFare(fare.type)}
                  className={`w-full py-4 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 ${
                    isSmart
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200'
                      : isPlus
                      ? 'bg-slate-950 hover:bg-black text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  <span>Selecionar {fare.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
