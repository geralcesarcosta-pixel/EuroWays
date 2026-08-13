import React, { useState } from 'react';
import { AirlineProvider, useAirline } from './context/AirlineContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/public/HomePage';
import { BookingFunnel } from './components/booking/BookingFunnel';
import { CeoDashboard } from './components/ceo/CeoDashboard';
import { CeoAuthModal } from './components/ceo/CeoAuthModal';
import { ManageBookingModal } from './components/public/ManageBookingModal';
import { FlightStatusModal } from './components/public/FlightStatusModal';
import { CheckInModal } from './components/public/CheckInModal';
import { TravelInfoModal } from './components/public/TravelInfoModal';

const AppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isCeoAuthenticated,
    isCeoAuthModalOpen,
    setIsCeoAuthModalOpen,
  } = useAirline();

  // Modal open states
  const [isManageBookingOpen, setIsManageBookingOpen] = useState(false);
  const [isFlightStatusOpen, setIsFlightStatusOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isTravelInfoOpen, setIsTravelInfoOpen] = useState(false);

  // If in CEO mode and authenticated, render the full-featured OCC CEO application
  if (currentView === 'ceo' && isCeoAuthenticated) {
    return <CeoDashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-orange-600 selection:text-white">
      {/* Public Header */}
      <Header
        onOpenManageBooking={() => setIsManageBookingOpen(true)}
        onOpenFlightStatus={() => setIsFlightStatusOpen(true)}
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenTravelInfo={() => setIsTravelInfoOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onOpenManageBooking={() => setIsManageBookingOpen(true)}
            onOpenFlightStatus={() => setIsFlightStatusOpen(true)}
            onOpenCheckIn={() => setIsCheckInOpen(true)}
            onOpenTravelInfo={() => setIsTravelInfoOpen(true)}
          />
        )}

        {currentView === 'booking' && (
          <BookingFunnel onOpenCheckIn={() => setIsCheckInOpen(true)} />
        )}
      </main>

      {/* Public Footer */}
      <Footer
        onOpenManageBooking={() => setIsManageBookingOpen(true)}
        onOpenFlightStatus={() => setIsFlightStatusOpen(true)}
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenTravelInfo={() => setIsTravelInfoOpen(true)}
      />

      {/* CEO Passcode Authentication Modal */}
      <CeoAuthModal
        isOpen={isCeoAuthModalOpen}
        onClose={() => setIsCeoAuthModalOpen(false)}
      />

      {/* Global Public Modals */}
      <ManageBookingModal
        isOpen={isManageBookingOpen}
        onClose={() => setIsManageBookingOpen(false)}
      />

      <FlightStatusModal
        isOpen={isFlightStatusOpen}
        onClose={() => setIsFlightStatusOpen(false)}
      />

      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
      />

      <TravelInfoModal
        isOpen={isTravelInfoOpen}
        onClose={() => setIsTravelInfoOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AirlineProvider>
      <AppContent />
    </AirlineProvider>
  );
}
