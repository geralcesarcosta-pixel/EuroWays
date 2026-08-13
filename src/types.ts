export type FlightStatus = 'Scheduled' | 'Boarding' | 'Departed' | 'Delayed' | 'Landed' | 'Cancelled';

export type FareCategory = 'basic' | 'smart' | 'plus';

export type PaymentStatus = 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELLED';

export interface Destination {
  code: string; // IATA (LIS, PDL, TER, PIX, HOR, FNC, etc.)
  name: string;
  islandOrCity: string;
  country: string;
  airportName: string;
  avgFlightDurationMin: number; // in minutes
  active: boolean;
  image: string;
  description: string;
  airportTax: number;
  featuredPrice: number;
}

export interface PriceBucket {
  id: string;
  minSeats: number;
  maxSeats: number;
  price: number;
}

export interface Flight {
  id: string;
  flightNumber: string; // e.g. FW101, FW203, FW901
  origin: string; // IATA code
  destination: string; // IATA code
  date: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  arrivalTime: string; // HH:mm
  aircraft: string; // e.g. "Aircraft 01 (B737-800)"
  capacity: number; // 189
  soldSeats: number;
  terminal: string; // "Terminal 2"
  gate: string;
  status: FlightStatus;
  basePrice: number;
  isExtraFlight?: boolean;
  extraFlightReason?: string;
  // Dynamic pricing overrides
  manualPrices?: {
    basic?: number;
    smart?: number;
    plus?: number;
  };
  // Operational details
  actualDepartureTime?: string;
  actualArrivalTime?: string;
  delayMinutes?: number;
  delayReason?: string;
  operationalNotes?: string;
}

export interface Passenger {
  id: string;
  type: 'adult' | 'child' | 'infant';
  title?: string;
  firstName: string;
  lastName: string;
  docType: 'CC' | 'Passaporte' | 'Outro';
  docNumber: string;
  dob?: string;
  nationality: string;
  email: string;
  phone: string;
  seat?: string;
}

export interface BookingExtras {
  cabinBags: number; // 10kg overhead
  checkedBags20kg: number; // 20kg hold
  priorityBoarding: boolean;
  fastTrack: boolean;
  travelInsurance: boolean;
  flexTicket: boolean;
}

export interface Booking {
  id: string;
  bookingCode: string; // e.g. "FW8K2P"
  flightId: string;
  flightNumber: string;
  flightDate: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  returnFlightId?: string;
  returnFlightNumber?: string;
  returnFlightDate?: string;
  returnOrigin?: string;
  returnDestination?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  fareType: FareCategory;
  passengers: Passenger[];
  selectedSeats: string[];
  extras: BookingExtras;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  checkedIn: boolean;
  checkInDate?: string;
  notes?: string;
}

export interface FareDetail {
  type: FareCategory;
  name: string;
  price: number;
  badge?: string;
  features: string[];
  baggageSummary: string;
}

export interface OperationalConflict {
  type: 'TURNAROUND_TOO_SHORT' | 'LOCATION_MISMATCH' | 'TIME_OVERLAP' | 'MAINTENANCE_VIOLATION';
  flightAId: string;
  flightBId?: string;
  message: string;
  details: string;
  severity: 'error' | 'warning';
}
