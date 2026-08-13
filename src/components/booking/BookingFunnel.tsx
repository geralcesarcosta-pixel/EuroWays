import React, { useState } from 'react';
import { useAirline } from '../../context/AirlineContext';
import { FlightSelectStep } from './FlightSelectStep';
import { FareSelectStep } from './FareSelectStep';
import { PassengerStep } from './PassengerStep';
import { ExtrasStep } from './ExtrasStep';
import { PaymentStep } from './PaymentStep';
import { ConfirmationStep } from './ConfirmationStep';
import { Flight, FareCategory, Passenger, BookingExtras, Booking } from '../../types';
import { Check } from 'lucide-react';

interface BookingFunnelProps {
  onOpenCheckIn: () => void;
}

export const BookingFunnel: React.FC<BookingFunnelProps> = ({ onOpenCheckIn }) => {
  const {
    bookingSearch,
    setCurrentView,
    createBooking,
    calculateFlightPrice,
  } = useAirline();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedFare, setSelectedFare] = useState<FareCategory>('basic');
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [extras, setExtras] = useState<BookingExtras>({
    cabinBags: 0,
    checkedBags20kg: 0,
    priorityBoarding: false,
    fastTrack: false,
    travelInsurance: false,
    flexTicket: false,
  });
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  const steps = [
    { num: 1, label: '1. Voo' },
    { num: 2, label: '2. Tarifa' },
    { num: 3, label: '3. Passageiros' },
    { num: 4, label: '4. Extras' },
    { num: 5, label: '5. Pagamento' },
    { num: 6, label: '6. Confirmação' },
  ];

  const totalPax = bookingSearch.adults + (bookingSearch.children || 0);

  // Compute Total Price
  const calculateTotal = (): number => {
    if (!selectedFlight) return 0;
    const farePrice = calculateFlightPrice(selectedFlight, selectedFare);
    let total = farePrice * totalPax;

    // Extras
    total += (extras.checkedBags20kg || 0) * 25;
    if (extras.priorityBoarding) total += 8 * totalPax;
    if (extras.travelInsurance) total += 14.9 * totalPax;

    // Extra seat fee if standard fare and picked front seats
    if (selectedFare === 'basic') {
      total += selectedSeats.length * 5;
    }

    return Number(total.toFixed(2));
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setCurrentStep(2);
  };

  const handleFareSelect = (fare: FareCategory) => {
    setSelectedFare(fare);
    setCurrentStep(3);
  };

  const handlePassengersSubmit = (paxList: Passenger[]) => {
    setPassengers(paxList);
    setCurrentStep(4);
  };

  const handleExtrasSubmit = (newExtras: BookingExtras, newSeats: string[]) => {
    setExtras(newExtras);
    setSelectedSeats(newSeats);
    setCurrentStep(5);
  };

  const handlePaymentConfirm = (paymentMethod: string) => {
    if (!selectedFlight) return;
    const total = calculateTotal();

    const created = createBooking({
      flightId: selectedFlight.id,
      flightNumber: selectedFlight.flightNumber,
      flightDate: selectedFlight.date,
      origin: selectedFlight.origin,
      destination: selectedFlight.destination,
      departureTime: selectedFlight.departureTime,
      arrivalTime: selectedFlight.arrivalTime,
      fareType: selectedFare,
      passengers: passengers.map((p, idx) => ({
        ...p,
        seat: selectedSeats[idx] || `${12 + idx}A`,
      })),
      selectedSeats,
      extras,
      totalPrice: total,
      paymentStatus: 'PAID',
      paymentMethod,
      checkedIn: false,
    });

    setCompletedBooking(created);
    setCurrentStep(6);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 6-step Progress Indicator */}
      <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[550px] gap-2">
          {steps.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 flex items-center justify-center text-xs font-black transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-orange-600 text-white shadow-xs scale-105'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-black uppercase tracking-wider whitespace-nowrap ${
                      isCurrent
                        ? 'text-orange-600'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors ${
                      isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Router */}
      {currentStep === 1 && (
        <FlightSelectStep
          onSelectFlight={handleFlightSelect}
          onBack={() => setCurrentView('home')}
        />
      )}

      {currentStep === 2 && selectedFlight && (
        <FareSelectStep
          selectedFlight={selectedFlight}
          onSelectFare={handleFareSelect}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <PassengerStep
          passengerCount={totalPax}
          initialPassengers={passengers}
          onSubmitPassengers={handlePassengersSubmit}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <ExtrasStep
          passengerCount={totalPax}
          fareType={selectedFare}
          initialExtras={extras}
          initialSeats={selectedSeats}
          onSubmitExtras={handleExtrasSubmit}
          onBack={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && selectedFlight && (
        <PaymentStep
          flight={selectedFlight}
          fareType={selectedFare}
          passengers={passengers}
          extras={extras}
          selectedSeats={selectedSeats}
          totalPrice={calculateTotal()}
          onConfirmPayment={handlePaymentConfirm}
          onBack={() => setCurrentStep(4)}
        />
      )}

      {currentStep === 6 && completedBooking && (
        <ConfirmationStep
          booking={completedBooking}
          onFinish={() => setCurrentView('home')}
          onOpenCheckIn={onOpenCheckIn}
        />
      )}
    </div>
  );
};
