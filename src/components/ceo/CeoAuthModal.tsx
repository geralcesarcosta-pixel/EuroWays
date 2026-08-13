import React, { useState, useEffect, useRef } from 'react';
import { useAirline } from '../../context/AirlineContext';
import { Lock, KeyRound, ShieldAlert, X, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface CeoAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CeoAuthModal: React.FC<CeoAuthModalProps> = ({ isOpen, onClose }) => {
  const { authenticateCeo, setCurrentView } = useAirline();
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setErrorMsg('');
      setIsSuccess(false);
      setShowPassword(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Por favor introduza o código de autorização.');
      return;
    }

    const success = authenticateCeo(passcode.trim());
    if (success) {
      setIsSuccess(true);
      setErrorMsg('');
      setTimeout(() => {
        setCurrentView('ceo');
        onClose();
        setIsSuccess(false);
        setPasscode('');
      }, 400);
    } else {
      setErrorMsg('Código de autorização inválido. Acesso restrito à direção.');
      setPasscode('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 shadow-2xl max-w-md w-full border border-slate-700 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b-2 border-orange-600">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-500">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider text-white">
                Acesso Restrito • Painel CEO & OCC
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Operações & Controlo Fastwings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 transition-colors cursor-pointer text-slate-400 hover:text-white"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2 justify-center sm:justify-start">
              <KeyRound className="w-4 h-4 text-orange-500" />
              <span>Autenticação de Segurança</span>
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Introduza a credencial de autorização para aceder à gestão de voos, ocupação, preços dinâmicos e operações.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label
                htmlFor="ceo-security-token"
                className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5"
              >
                Código de Acesso
              </label>
              <div className="relative">
                <input
                  id="ceo-security-token"
                  name="ceo-security-token"
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Introduzir código de autorização"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  disabled={isSuccess}
                  className={`w-full px-4 py-3.5 pr-11 bg-slate-950 border text-sm font-mono tracking-widest text-white placeholder:text-slate-600 placeholder:font-sans placeholder:tracking-normal focus:outline-none transition-colors ${
                    errorMsg
                      ? 'border-red-500 focus:border-red-500 bg-red-950/20'
                      : isSuccess
                      ? 'border-emerald-500 bg-emerald-950/20'
                      : 'border-slate-700 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar código' : 'Mostrar código'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-800/80 text-red-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isSuccess && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-700/80 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Acesso concedido. A carregar painel...</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 text-xs font-black uppercase tracking-wider py-2 cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSuccess || !passcode.trim()}
                className="bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider px-6 py-3 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Validar Acesso</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
