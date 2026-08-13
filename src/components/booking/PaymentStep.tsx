import React, { useState } from 'react';
import { Flight, FareCategory, Passenger, BookingExtras } from '../../types';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Plane,
  Smartphone,
  Building,
} from 'lucide-react';

interface PaymentStepProps {
  flight: Flight;
  fareType: FareCategory;
  passengers: Passenger[];
  extras: BookingExtras;
  selectedSeats: string[];
  totalPrice: number;
  onConfirmPayment: (paymentMethod: string) => void;
  onBack: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  flight,
  fareType,
  passengers,
  extras,
  selectedSeats,
  totalPrice,
  onConfirmPayment,
  onBack,
}) => {
  const [method, setMethod] = useState<'mbway' | 'card' | 'multibanco' | 'applepay'>('mbway');
  const [mbwayPhone, setMbwayPhone] = useState(passengers[0]?.phone || '912345678');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8894');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('321');
  const [cardHolder, setCardHolder] = useState(`${passengers[0]?.firstName} ${passengers[0]?.lastName}`.trim() || 'JOAO SILVA');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const methodName =
        method === 'mbway'
          ? 'MB WAY'
          : method === 'card'
          ? 'Cartão Crédito/Débito'
          : method === 'multibanco'
          ? 'Referência Multibanco'
          : 'Apple Pay';
      onConfirmPayment(methodName);
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pagamento Seguro</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Transação encriptada de ponta a ponta com confirmação instantânea</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Payment methods */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setMethod('mbway')}
              className={`p-3.5 border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                method === 'mbway'
                  ? 'border-orange-600 bg-orange-50 text-orange-600 font-black shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-bold'
              }`}
            >
              <Smartphone className="w-5 h-5 text-orange-600" />
              <span className="text-xs uppercase font-black">MB WAY</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('card')}
              className={`p-3.5 border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                method === 'card'
                  ? 'border-orange-600 bg-orange-50 text-orange-600 font-black shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-bold'
              }`}
            >
              <CreditCard className="w-5 h-5 text-slate-800" />
              <span className="text-xs uppercase font-black">Cartão</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('multibanco')}
              className={`p-3.5 border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                method === 'multibanco'
                  ? 'border-orange-600 bg-orange-50 text-orange-600 font-black shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-bold'
              }`}
            >
              <Building className="w-5 h-5 text-blue-700" />
              <span className="text-xs uppercase font-black">Multibanco</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('applepay')}
              className={`p-3.5 border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                method === 'applepay'
                  ? 'border-orange-600 bg-orange-50 text-orange-600 font-black shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-bold'
              }`}
            >
              <Lock className="w-5 h-5 text-slate-900" />
              <span className="text-xs uppercase font-black">Apple Pay</span>
            </button>
          </div>

          {/* Form details by method */}
          <div className="bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
            {method === 'mbway' && (
              <div className="space-y-3">
                <div className="font-black text-slate-900 flex items-center gap-2 uppercase text-sm">
                  <Smartphone className="w-5 h-5 text-orange-600" />
                  <span>Pagar com MB WAY</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Irá receber uma notificação na sua aplicação MB WAY para validar o pagamento de {totalPrice.toFixed(2)} €.
                </p>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Número de Telemóvel MB WAY
                  </label>
                  <input
                    type="tel"
                    required
                    value={mbwayPhone}
                    onChange={(e) => setMbwayPhone(e.target.value)}
                    placeholder="912 345 678"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 text-lg font-mono font-bold text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {method === 'card' && (
              <div className="space-y-3">
                <div className="font-black text-slate-900 flex items-center gap-2 uppercase text-sm">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  <span>Cartão Visa / Mastercard / American Express</span>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Nome no Cartão
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 font-bold text-slate-900 text-sm focus:border-orange-500 focus:bg-white focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 font-mono font-bold text-slate-900 text-sm focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Validade
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 font-mono font-bold text-slate-900 text-sm focus:border-orange-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 font-mono font-bold text-slate-900 text-sm focus:border-orange-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {method === 'multibanco' && (
              <div className="space-y-3">
                <div className="font-black text-slate-900 uppercase text-sm">Entidade & Referência Multibanco</div>
                <p className="text-xs text-slate-500 font-medium">
                  Os dados de pagamento serão gerados instantaneamente. A reserva fica garantida durante 24 horas.
                </p>
                <div className="bg-slate-50 p-4 border border-slate-200 font-mono text-sm space-y-1">
                  <div>Entidade: <strong className="text-slate-900">21845 (Fastwings Airlines)</strong></div>
                  <div>Referência: <strong className="text-slate-900">928 341 002</strong></div>
                  <div>Montante: <strong className="text-orange-600">{totalPrice.toFixed(2)} €</strong></div>
                </div>
              </div>
            )}

            {method === 'applepay' && (
              <div className="text-center py-4 space-y-2">
                <Lock className="w-8 h-8 mx-auto text-slate-900" />
                <p className="text-xs text-slate-600 font-medium">
                  Clique no botão abaixo para autorizar o pagamento com Face ID ou Touch ID.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Summary card */}
        <div className="bg-slate-950 text-white p-6 space-y-5 h-fit border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-black text-base text-white uppercase tracking-wider">Resumo da Reserva</h3>
            <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 uppercase">
              {flight.flightNumber}
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Voo:</span>
              <span className="font-bold text-white uppercase">{flight.origin} → {flight.destination} ({flight.departureTime})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Data:</span>
              <span className="font-bold text-white">{flight.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Passageiros:</span>
              <span className="font-bold text-white">{passengers.length} Adulto(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tarifa:</span>
              <span className="font-black text-orange-400 uppercase">{fareType}</span>
            </div>
            {selectedSeats.length > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Lugares:</span>
                <span className="font-mono font-bold text-white">{selectedSeats.join(', ')}</span>
              </div>
            )}
            {extras.checkedBags20kg > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Mala Porão 20kg:</span>
                <span className="font-bold text-white">+{extras.checkedBags20kg * 25} €</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
            <span className="text-xs uppercase font-black tracking-wider text-slate-400">Total a Pagar</span>
            <div className="text-2xl font-black text-orange-500">
              {totalPrice.toFixed(2)} €
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
          >
            {isProcessing ? (
              <span>A processar pagamento...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Pagar {totalPrice.toFixed(2)} €</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onBack}
          className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-black uppercase tracking-wider px-5 py-3 text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar aos Extras</span>
        </button>
      </div>
    </form>
  );
};
