import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Destination,
  Flight,
  PriceBucket,
  Booking,
  FareCategory,
  OperationalConflict,
  FlightStatus,
  Passenger,
  BookingExtras,
} from '../types';
import {
  INITIAL_DESTINATIONS,
  INITIAL_PRICE_BUCKETS,
  INITIAL_FLIGHTS,
  INITIAL_BOOKINGS,
  PRICE_LIMITS,
} from '../data/initialData';

interface BookingSearchParams {
  origin: string;
  destination: string;
  tripType: 'roundtrip' | 'oneway';
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
}

interface AirlineContextType {
  // Navigation & view
  currentView: string;
  setCurrentView: (view: string) => void;
  bookingSearch: BookingSearchParams;
  setBookingSearch: (params: BookingSearchParams) => void;
  activeBookingId: string | null;
  setActiveBookingId: (id: string | null) => void;

  // CEO Passcode Authentication
  isCeoAuthenticated: boolean;
  isCeoAuthModalOpen: boolean;
  setIsCeoAuthModalOpen: (open: boolean) => void;
  authenticateCeo: (code: string) => boolean;
  logoutCeo: () => void;
  requestCeoAccess: () => void;

  // Data
  destinations: Destination[];
  flights: Flight[];
  priceBuckets: PriceBucket[];
  bookings: Booking[];
  priceLimits: { min: number; max: number };

  // Operations & CEO
  calculateFlightPrice: (flight: Flight, fareType: FareCategory) => number;
  checkOperationalConflicts: (flightCandidate: Partial<Flight>, excludeFlightId?: string) => OperationalConflict[];
  addFlight: (flight: Omit<Flight, 'id' | 'soldSeats'>) => { success: boolean; flight?: Flight; error?: string };
  updateFlight: (id: string, updates: Partial<Flight>) => void;
  deleteFlight: (id: string) => void;
  updateFlightStatus: (
    id: string,
    status: FlightStatus,
    extra?: { actualDepartureTime?: string; actualArrivalTime?: string; delayMinutes?: number; delayReason?: string; gate?: string }
  ) => void;

  // Pricing
  updatePriceBuckets: (buckets: PriceBucket[]) => void;
  setManualFlightPrice: (flightId: string, prices: { basic?: number; smart?: number; plus?: number }) => void;

  // Destinations
  addDestination: (destination: Destination) => void;
  toggleDestination: (code: string) => void;
  updateDestination: (code: string, updates: Partial<Destination>) => void;

  // Bookings
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt'>) => Booking;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  refundBooking: (id: string) => void;
  checkInBooking: (bookingCode: string, seatAssignments: { [passengerId: string]: string }) => boolean;
  getBookingByCode: (code: string) => Booking | undefined;

  // Quick stats
  kpisToday: {
    flightsCount: number;
    passengersCount: number;
    loadFactor: number;
    revenue: number;
    aircraftUtilization: string;
    aircraftAvailable: string;
    conflicts: OperationalConflict[];
  };

  // Reset / Seeding
  resetToDefaults: () => void;
}

const AirlineContext = createContext<AirlineContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'fastwings_v1_';

export const AirlineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state or local storage
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}destinations`);
    return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
  });

  const [flights, setFlights] = useState<Flight[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}flights`);
    return saved ? JSON.parse(saved) : INITIAL_FLIGHTS;
  });

  const [priceBuckets, setPriceBuckets] = useState<PriceBucket[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}buckets`);
    return saved ? JSON.parse(saved) : INITIAL_PRICE_BUCKETS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [priceLimits, setPriceLimits] = useState(PRICE_LIMITS);

  // View state
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  // CEO Passcode Authentication
  const [isCeoAuthenticated, setIsCeoAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(`${LOCAL_STORAGE_PREFIX}ceo_auth`) === 'true';
  });
  const [isCeoAuthModalOpen, setIsCeoAuthModalOpen] = useState<boolean>(false);

  const authenticateCeo = (code: string): boolean => {
    if (code.trim() === '120322') {
      setIsCeoAuthenticated(true);
      sessionStorage.setItem(`${LOCAL_STORAGE_PREFIX}ceo_auth`, 'true');
      return true;
    }
    return false;
  };

  const logoutCeo = () => {
    setIsCeoAuthenticated(false);
    sessionStorage.removeItem(`${LOCAL_STORAGE_PREFIX}ceo_auth`);
    setCurrentView('home');
  };

  const requestCeoAccess = () => {
    if (isCeoAuthenticated) {
      setCurrentView('ceo');
    } else {
      setIsCeoAuthModalOpen(true);
    }
  };

  // Search state
  const todayStr = new Date().toISOString().split('T')[0];
  const [bookingSearch, setBookingSearch] = useState<BookingSearchParams>({
    origin: 'LIS',
    destination: 'PDL',
    tripType: 'oneway',
    departureDate: todayStr,
    returnDate: '',
    adults: 1,
    children: 0,
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}destinations`, JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}flights`, JSON.stringify(flights));
  }, [flights]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}buckets`, JSON.stringify(priceBuckets));
  }, [priceBuckets]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}bookings`, JSON.stringify(bookings));
  }, [bookings]);

  // Dynamic Price Calculation
  const calculateFlightPrice = (flight: Flight, fareType: FareCategory): number => {
    // 1. Check if CEO set manual price
    if (flight.manualPrices && flight.manualPrices[fareType]) {
      return flight.manualPrices[fareType]!;
    }

    // 2. Find base price from price bucket based on soldSeats
    let basePrice = flight.basePrice || 29.99;
    const bucket = priceBuckets.find(
      (b) => flight.soldSeats >= b.minSeats && flight.soldSeats <= b.maxSeats
    );
    if (bucket) {
      basePrice = bucket.price;
    }

    // Clamp with price limits
    basePrice = Math.max(priceLimits.min, Math.min(priceLimits.max, basePrice));

    // 3. Add fare tier differentials
    switch (fareType) {
      case 'basic':
        return basePrice;
      case 'smart':
        return Number((basePrice + 20).toFixed(2));
      case 'plus':
        return Number((basePrice + 45).toFixed(2));
      default:
        return basePrice;
    }
  };

  // Turnaround & Aircraft 01 Operational Conflict Checker
  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const checkOperationalConflicts = (
    candidate: Partial<Flight>,
    excludeFlightId?: string
  ): OperationalConflict[] => {
    const conflicts: OperationalConflict[] = [];
    if (!candidate.date || !candidate.departureTime || !candidate.arrivalTime || !candidate.origin || !candidate.destination) {
      return conflicts;
    }

    const candDepMin = parseTimeToMinutes(candidate.departureTime);
    const candArrMin = parseTimeToMinutes(candidate.arrivalTime);

    // Filter all flights of the same date
    const sameDayFlights = flights
      .filter((f) => f.date === candidate.date && f.id !== excludeFlightId && f.status !== 'Cancelled')
      .sort((a, b) => parseTimeToMinutes(a.departureTime) - parseTimeToMinutes(b.departureTime));

    // Find the immediately preceding flight and following flight
    let prevFlight: Flight | null = null;
    let nextFlight: Flight | null = null;

    for (const f of sameDayFlights) {
      const fDep = parseTimeToMinutes(f.departureTime);
      const fArr = parseTimeToMinutes(f.arrivalTime);

      // Check direct time overlap
      if (
        (candDepMin >= fDep && candDepMin < fArr) ||
        (candArrMin > fDep && candArrMin <= fArr) ||
        (candDepMin <= fDep && candArrMin >= fArr)
      ) {
        conflicts.push({
          type: 'TIME_OVERLAP',
          flightAId: candidate.id || 'new',
          flightBId: f.id,
          message: `Sobreposição de horário com o voo ${f.flightNumber} (${f.departureTime} - ${f.arrivalTime})`,
          details: `O único Boeing 737-800 não pode realizar dois voos em simultâneo.`,
          severity: 'error',
        });
      }

      if (fArr <= candDepMin) {
        prevFlight = f;
      }
      if (fDep >= candArrMin && !nextFlight) {
        nextFlight = f;
      }
    }

    // Check Turnaround and Location with preceding flight
    if (prevFlight) {
      const prevArr = parseTimeToMinutes(prevFlight.arrivalTime);
      const turnaround = candDepMin - prevArr;

      if (prevFlight.destination !== candidate.origin) {
        conflicts.push({
          type: 'LOCATION_MISMATCH',
          flightAId: candidate.id || 'new',
          flightBId: prevFlight.id,
          message: `Inconsistência de localização da aeronave`,
          details: `O voo anterior ${prevFlight.flightNumber} termina em ${prevFlight.destination}, mas este voo está programado para partir de ${candidate.origin}. O avião não pode estar em dois sítios ao mesmo tempo.`,
          severity: 'error',
        });
      }

      if (turnaround < 30) {
        conflicts.push({
          type: 'TURNAROUND_TOO_SHORT',
          flightAId: candidate.id || 'new',
          flightBId: prevFlight.id,
          message: `Turnaround insuficiente (${turnaround} min < 30 min)`,
          details: `A aeronave chega de ${prevFlight.origin} às ${prevFlight.arrivalTime}. O primeiro horário possível para a próxima partida é às ${String(Math.floor((prevArr + 30) / 60)).padStart(2, '0')}:${String((prevArr + 30) % 60).padStart(2, '0')}.`,
          severity: 'error',
        });
      }
    }

    // Check Turnaround and Location with next flight
    if (nextFlight) {
      const nextDep = parseTimeToMinutes(nextFlight.departureTime);
      const turnaround = nextDep - candArrMin;

      if (candidate.destination !== nextFlight.origin) {
        conflicts.push({
          type: 'LOCATION_MISMATCH',
          flightAId: candidate.id || 'new',
          flightBId: nextFlight.id,
          message: `Inconsistência com o voo seguinte (${nextFlight.flightNumber})`,
          details: `Este voo aterra em ${candidate.destination}, mas o voo seguinte ${nextFlight.flightNumber} parte de ${nextFlight.origin}.`,
          severity: 'error',
        });
      }

      if (turnaround < 30) {
        conflicts.push({
          type: 'TURNAROUND_TOO_SHORT',
          flightAId: candidate.id || 'new',
          flightBId: nextFlight.id,
          message: `Turnaround insuficiente para o voo ${nextFlight.flightNumber} (${turnaround} min < 30 min)`,
          details: `Este voo aterra às ${candidate.arrivalTime}. O voo seguinte parte às ${nextFlight.departureTime}, deixando apenas ${turnaround} minutos (mínimo exigido: 30 min).`,
          severity: 'error',
        });
      }
    }

    return conflicts;
  };

  // Add flight (CEO)
  const addFlight = (newFlightData: Omit<Flight, 'id' | 'soldSeats'>) => {
    const conflicts = checkOperationalConflicts(newFlightData);
    const hasFatalConflict = conflicts.some((c) => c.severity === 'error');

    if (hasFatalConflict) {
      return {
        success: false,
        error: conflicts.map((c) => c.message + ': ' + c.details).join('\n'),
      };
    }

    const newFlight: Flight = {
      ...newFlightData,
      id: `fl-${Date.now()}`,
      soldSeats: 0,
      capacity: newFlightData.capacity || 189,
      status: newFlightData.status || 'Scheduled',
      terminal: newFlightData.terminal || 'Terminal 2',
      gate: newFlightData.gate || '204',
      aircraft: 'Aircraft 01 (B737-800)',
    };

    setFlights((prev) => [...prev, newFlight]);
    return { success: true, flight: newFlight };
  };

  const updateFlight = (id: string, updates: Partial<Flight>) => {
    setFlights((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const deleteFlight = (id: string) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFlightStatus = (
    id: string,
    status: FlightStatus,
    extra?: {
      actualDepartureTime?: string;
      actualArrivalTime?: string;
      delayMinutes?: number;
      delayReason?: string;
      gate?: string;
    }
  ) => {
    setFlights((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status, ...extra } : f))
    );
  };

  const setManualFlightPrice = (
    flightId: string,
    prices: { basic?: number; smart?: number; plus?: number }
  ) => {
    setFlights((prev) =>
      prev.map((f) =>
        f.id === flightId
          ? {
              ...f,
              manualPrices: {
                ...f.manualPrices,
                ...prices,
              },
            }
          : f
      )
    );
  };

  const updatePriceBuckets = (buckets: PriceBucket[]) => {
    setPriceBuckets(buckets);
  };

  // Destination actions
  const addDestination = (dest: Destination) => {
    setDestinations((prev) => [...prev, dest]);
  };

  const toggleDestination = (code: string) => {
    setDestinations((prev) =>
      prev.map((d) => (d.code === code ? { ...d, active: !d.active } : d))
    );
  };

  const updateDestination = (code: string, updates: Partial<Destination>) => {
    setDestinations((prev) =>
      prev.map((d) => (d.code === code ? { ...d, ...updates } : d))
    );
  };

  // Booking Actions
  const generateBookingCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'FW';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt'>) => {
    const bookingCode = generateBookingCode();
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingCode,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update soldSeats on the flight
    const paxCount = newBooking.passengers.length;
    setFlights((prev) =>
      prev.map((f) => {
        if (f.id === newBooking.flightId) {
          return { ...f, soldSeats: Math.min(f.capacity, f.soldSeats + paxCount) };
        }
        if (newBooking.returnFlightId && f.id === newBooking.returnFlightId) {
          return { ...f, soldSeats: Math.min(f.capacity, f.soldSeats + paxCount) };
        }
        return f;
      })
    );

    return newBooking;
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const cancelBooking = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, paymentStatus: 'CANCELLED' } : b))
    );

    // Free up sold seats
    const paxCount = booking.passengers.length;
    setFlights((prev) =>
      prev.map((f) => {
        if (f.id === booking.flightId) {
          return { ...f, soldSeats: Math.max(0, f.soldSeats - paxCount) };
        }
        if (booking.returnFlightId && f.id === booking.returnFlightId) {
          return { ...f, soldSeats: Math.max(0, f.soldSeats - paxCount) };
        }
        return f;
      })
    );
  };

  const refundBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, paymentStatus: 'REFUNDED' } : b))
    );
  };

  const checkInBooking = (
    bookingCode: string,
    seatAssignments: { [passengerId: string]: string }
  ): boolean => {
    const booking = bookings.find(
      (b) => b.bookingCode.toUpperCase() === bookingCode.toUpperCase()
    );
    if (!booking) return false;

    const updatedPassengers = booking.passengers.map((p) => ({
      ...p,
      seat: seatAssignments[p.id] || p.seat || '12A',
    }));

    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              checkedIn: true,
              checkInDate: new Date().toISOString(),
              passengers: updatedPassengers,
              selectedSeats: updatedPassengers.map((p) => p.seat || '12A'),
            }
          : b
      )
    );
    return true;
  };

  const getBookingByCode = (code: string): Booking | undefined => {
    if (!code) return undefined;
    return bookings.find(
      (b) => b.bookingCode.toUpperCase().trim() === code.toUpperCase().trim()
    );
  };

  // KPIs for OCC Dashboard (Today)
  const kpisToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayFlights = flights.filter((f) => f.date === today && f.status !== 'Cancelled');
    const flightsCount = todayFlights.length;

    let totalCapacity = 0;
    let totalPax = 0;
    let totalMinutesAirborne = 0;

    todayFlights.forEach((f) => {
      totalCapacity += f.capacity;
      totalPax += f.soldSeats;

      const dep = parseTimeToMinutes(f.departureTime);
      const arr = parseTimeToMinutes(f.arrivalTime);
      let diff = arr - dep;
      if (diff < 0) diff += 24 * 60; // Crosses midnight
      totalMinutesAirborne += diff;
    });

    const loadFactor = totalCapacity > 0 ? (totalPax / totalCapacity) * 100 : 81.7;

    // Calculate revenue from all bookings for today's flights + historical base
    const todayRevenue = bookings.reduce((sum, b) => {
      if (b.paymentStatus === 'PAID') {
        return sum + b.totalPrice;
      }
      return sum;
    }, 63420);

    const hours = Math.floor(totalMinutesAirborne / 60);
    const mins = totalMinutesAirborne % 60;
    const aircraftUtilization = `${hours}h ${mins.toString().padStart(2, '0')}m`;

    // Operational conflicts check across all today's flights
    const allConflicts: OperationalConflict[] = [];
    todayFlights.forEach((f) => {
      const confs = checkOperationalConflicts(f, f.id);
      confs.forEach((c) => {
        if (!allConflicts.some((exist) => exist.flightAId === c.flightAId && exist.flightBId === c.flightBId)) {
          allConflicts.push(c);
        }
      });
    });

    return {
      flightsCount,
      passengersCount: totalPax || 927,
      loadFactor: Number(loadFactor.toFixed(1)),
      revenue: todayRevenue,
      aircraftUtilization: totalMinutesAirborne > 0 ? aircraftUtilization : '12h 42m',
      aircraftAvailable: '1/1 (Boeing 737-800)',
      conflicts: allConflicts,
    };
  }, [flights, bookings, priceBuckets]);

  const resetToDefaults = () => {
    localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}destinations`);
    localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}flights`);
    localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}buckets`);
    localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}bookings`);
    setDestinations(INITIAL_DESTINATIONS);
    setFlights(INITIAL_FLIGHTS);
    setPriceBuckets(INITIAL_PRICE_BUCKETS);
    setBookings(INITIAL_BOOKINGS);
  };

  return (
    <AirlineContext.Provider
      value={{
        currentView,
        setCurrentView,
        bookingSearch,
        setBookingSearch,
        activeBookingId,
        setActiveBookingId,
        isCeoAuthenticated,
        isCeoAuthModalOpen,
        setIsCeoAuthModalOpen,
        authenticateCeo,
        logoutCeo,
        requestCeoAccess,
        destinations,
        flights,
        priceBuckets,
        bookings,
        priceLimits,
        calculateFlightPrice,
        checkOperationalConflicts,
        addFlight,
        updateFlight,
        deleteFlight,
        updateFlightStatus,
        updatePriceBuckets,
        setManualFlightPrice,
        addDestination,
        toggleDestination,
        updateDestination,
        createBooking,
        updateBooking,
        cancelBooking,
        refundBooking,
        checkInBooking,
        getBookingByCode,
        kpisToday,
        resetToDefaults,
      }}
    >
      {children}
    </AirlineContext.Provider>
  );
};

export const useAirline = () => {
  const context = useContext(AirlineContext);
  if (!context) {
    throw new Error('useAirline must be used within an AirlineProvider');
  }
  return context;
};
