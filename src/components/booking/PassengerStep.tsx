import React, { useState } from 'react';
import { Passenger } from '../../types';
import { User, Mail, Phone, FileText, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

interface PassengerStepProps {
  passengerCount: number;
  initialPassengers?: Passenger[];
  onSubmitPassengers: (passengers: Passenger[]) => void;
  onBack: () => void;
}

export const PassengerStep: React.FC<PassengerStepProps> = ({
  passengerCount,
  initialPassengers = [],
  onSubmitPassengers,
  onBack,
}) => {
  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    if (initialPassengers.length === passengerCount) {
      return initialPassengers;
    }
    const defaultList: Passenger[] = [];
    for (let i = 0; i < passengerCount; i++) {
      defaultList.push({
        id: `pax-${i + 1}`,
        type: 'adult',
        firstName: '',
        lastName: '',
        docType: 'CC',
        docNumber: '',
        nationality: 'Portuguesa',
        email: i === 0 ? '' : '',
        phone: i === 0 ? '+351 ' : '',
      });
    }
    return defaultList;
  });

  const [errorMessage, setErrorMessage] = useState('');

  const updatePax = (index: number, field: keyof Passenger, value: any) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName.trim() || !p.lastName.trim()) {
        setErrorMessage(`Por favor preencha o Nome e Apelido do Passageiro ${i + 1}.`);
        return;
      }
      if (!p.docNumber.trim()) {
        setErrorMessage(`Por favor preencha o número do documento (${p.docType}) do Passageiro ${i + 1}.`);
        return;
      }
      if (i === 0 && (!p.email.trim() || !p.email.includes('@'))) {
        setErrorMessage('Por favor introduza um email de contacto válido para o envio da reserva.');
        return;
      }
    }

    // Propagate primary email/phone to others if blank
    const sanitized = passengers.map((p, idx) => ({
      ...p,
      email: p.email.trim() || passengers[0].email.trim(),
      phone: p.phone.trim() || passengers[0].phone.trim(),
    }));

    onSubmitPassengers(sanitized);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Dados dos Passageiros</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Introduza os nomes exatamente como constam no documento de identificação
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-5">
        {passengers.map((pax, idx) => (
          <div
            key={pax.id || idx}
            className="bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-black text-slate-900 uppercase text-sm tracking-wide">
                <div className="w-6 h-6 bg-orange-600 text-white flex items-center justify-center text-xs font-black">
                  {idx + 1}
                </div>
                <span>Passageiro {idx + 1} ({idx === 0 ? 'Contacto Principal' : 'Adulto'})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Primeiro Nome *
                </label>
                <input
                  type="text"
                  required
                  value={pax.firstName}
                  onChange={(e) => updatePax(idx, 'firstName', e.target.value)}
                  placeholder="ex: João"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 font-bold text-slate-900 text-sm focus:border-orange-500 focus:bg-white focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Apelido(s) *
                </label>
                <input
                  type="text"
                  required
                  value={pax.lastName}
                  onChange={(e) => updatePax(idx, 'lastName', e.target.value)}
                  placeholder="ex: Silva"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 font-bold text-slate-900 text-sm focus:border-orange-500 focus:bg-white focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Tipo de Documento *
                </label>
                <select
                  value={pax.docType}
                  onChange={(e) => updatePax(idx, 'docType', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 font-bold text-slate-900 text-sm focus:border-orange-500 focus:bg-white focus:outline-none cursor-pointer uppercase"
                >
                  <option value="CC">Cartão de Cidadão (CC)</option>
                  <option value="Passaporte">Passaporte</option>
                  <option value="Outro">Outro Documento Oficial</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Nº do Documento *
                </label>
                <input
                  type="text"
                  required
                  value={pax.docNumber}
                  onChange={(e) => updatePax(idx, 'docNumber', e.target.value)}
                  placeholder="ex: 14285712 4 ZX9"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 font-bold text-slate-900 text-sm focus:border-orange-500 focus:bg-white focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Nacionalidade
                </label>
                <input
                  type="text"
                  value={pax.nationality}
                  onChange={(e) => updatePax(idx, 'nationality', e.target.value)}
                  placeholder="ex: Portuguesa"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 font-bold text-slate-900 text-sm focus:border-orange-500 focus:bg-white focus:outline-none uppercase"
                />
              </div>

              {idx === 0 && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Email de Envio da Reserva *
                    </label>
                    <input
                      type="email"
                      required
                      value={pax.email}
                      onChange={(e) => updatePax(idx, 'email', e.target.value)}
                      placeholder="ex: joao.silva@email.pt"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 font-bold text-slate-900 text-sm focus:border-orange-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Contacto Telefónico Móvel (para SMS operacionais de voo) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={pax.phone}
                      onChange={(e) => updatePax(idx, 'phone', e.target.value)}
                      placeholder="+351 912 345 678"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 font-bold text-slate-900 text-sm focus:border-orange-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-black uppercase tracking-wider px-5 py-3.5 text-xs flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Tarifa</span>
        </button>

        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider px-8 py-3.5 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
        >
          <span>Continuar para Extras & Lugares</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
