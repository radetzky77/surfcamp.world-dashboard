export type UserRole =
  | 'super_admin'
  | 'owner'
  | 'staff'
  | 'partner'
  | 'instructor'
  | 'accountant';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  partnerId?: string;
  phone?: string;
}

export interface Partner {
  id: string;
  companyName: string;
  ownerName: string;
  country: string;
  location: string;
  lat: number;
  lng: number;
  bankDetails: {
    bankName: string;
    iban: string;
    swift: string;
    accountHolder: string;
  };
  commissionRate: number; // default 0.20 (20% to platform, 80% to partner)
  contractStatus: 'active' | 'pending' | 'review' | 'terminated';
  rating: number;
  totalBookings: number;
  totalRevenue: number;
  totalPayout: number;
  photos: string[];
  phone: string;
  email: string;
  description: string;
}

export interface Accommodation {
  id: string;
  partnerId: string;
  campName: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  surfPackageIncluded: boolean;
  availableRooms: number;
  totalRooms: number;
  photos: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  surfLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  medicalNotes?: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  ltv: number;
  totalBookings: number;
  referralSource: string;
  loyaltyTier: 'Standard' | 'Silver' | 'Gold' | 'VIP';
  avatar: string;
  createdAt: string;
}

export interface BookingExtra {
  id: string;
  name: string;
  price: number;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partnerId: string;
  partnerName: string;
  campName: string;
  accommodationId: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  extras: BookingExtra[];
  grossTotal: number;
  discountCode?: string;
  discountAmount: number;
  netTotal: number;
  partnerPayout: number; // 80%
  platformRevenue: number; // 20%
  discountCost: number;
  taxAmount: number; // VAT
  netProfit: number;
  profitMargin: number; // Percentage
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'partially_paid' | 'refunded';
  paymentMethod: 'stripe' | 'wire' | 'cash';
  googleCalendarSynced: boolean;
  createdAt: string;
  timeline: { time: string; event: string; user: string }[];
  notes: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
  usageCount: number;
  maxUses: number;
  campaign: string;
  validUntil: string;
}

export interface Expense {
  id: string;
  category: 'Operations' | 'Marketing' | 'Payroll' | 'Insurance' | 'Software' | 'Equipment';
  amount: number;
  description: string;
  date: string;
  partnerId?: string;
  status: 'paid' | 'pending';
}

export interface Invoice {
  id: string;
  bookingId: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  tax: number;
  status: 'issued' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  issuedDate: string;
}

export interface SurfForecastSpot {
  id: string;
  name: string;
  country: string;
  location: string;
  lat: number;
  lng: number;
  waveHeightM: number;
  wavePeriodSec: number;
  swellDirection: string;
  windSpeedKts: number;
  windDirection: string;
  waterTempC: number;
  tide: string;
  condition: 'Fair' | 'Good' | 'Epic' | 'Flat';
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  role: UserRole;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  dueDate: string;
  campName?: string;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  channel: 'whatsapp' | 'email' | 'internal';
  content: string;
  timestamp: string;
  read: boolean;
  bookingNumber?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'weather' | 'alert' | 'sync';
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
  ip: string;
}
