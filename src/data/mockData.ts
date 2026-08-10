import {
  Partner,
  Accommodation,
  Customer,
  Booking,
  DiscountCode,
  Expense,
  Invoice,
  SurfForecastSpot,
  Task,
  Message,
  NotificationItem,
  AuditLog,
  UserProfile,
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_owner_01',
  name: 'Platform Administrator',
  email: 'admin@surfcamp.world',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  role: 'super_admin',
  phone: '+351 912 000 000',
};

// Clean empty states for production/registration readiness
export const INITIAL_PARTNERS: Partner[] = [];
export const INITIAL_ACCOMMODATIONS: Accommodation[] = [];
export const INITIAL_CUSTOMERS: Customer[] = [];
export const INITIAL_BOOKINGS: Booking[] = [];
export const INITIAL_DISCOUNTS: DiscountCode[] = [];
export const INITIAL_EXPENSES: Expense[] = [];
export const INITIAL_INVOICES: Invoice[] = [];
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_MESSAGES: Message[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_SURF_SPOTS: SurfForecastSpot[] = [
  {
    id: 'spot_pt_01',
    name: "Supertubos & Ribeira d'Ilhas",
    country: 'Portugal',
    location: 'Ericeira',
    lat: 38.9625,
    lng: -9.4172,
    waveHeightM: 2.1,
    wavePeriodSec: 14,
    swellDirection: 'WNW (290°)',
    windSpeedKts: 8,
    windDirection: 'Offshore NNE',
    waterTempC: 18,
    tide: 'Mid-Tide Rising',
    condition: 'Epic',
  },
  {
    id: 'spot_ma_02',
    name: 'Anchor Point',
    country: 'Morocco',
    location: 'Taghazout',
    lat: 30.5426,
    lng: -9.7088,
    waveHeightM: 1.8,
    wavePeriodSec: 13,
    swellDirection: 'NW (310°)',
    windSpeedKts: 6,
    windDirection: 'Offshore E',
    waterTempC: 21,
    tide: 'Low-Tide',
    condition: 'Good',
  },
  {
    id: 'spot_id_03',
    name: 'Canggu Echo Beach',
    country: 'Indonesia',
    lat: -8.6500,
    lng: 115.1333,
    location: 'Bali',
    waveHeightM: 1.5,
    wavePeriodSec: 12,
    swellDirection: 'SW (220°)',
    windSpeedKts: 10,
    windDirection: 'Side-Offshore SE',
    waterTempC: 28,
    tide: 'High-Tide',
    condition: 'Fair',
  },
  {
    id: 'spot_cr_04',
    name: 'Playa Guiones',
    country: 'Costa Rica',
    location: 'Nosara',
    lat: 9.9818,
    lng: -85.6738,
    waveHeightM: 1.2,
    wavePeriodSec: 11,
    swellDirection: 'SSW (200°)',
    windSpeedKts: 5,
    windDirection: 'Offshore ENE',
    waterTempC: 29,
    tide: 'Mid-Tide',
    condition: 'Good',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    timestamp: new Date().toISOString(),
    user: 'System Engine',
    role: 'super_admin',
    action: 'System Initialized & Reset',
    details: 'Database reset to clean state. Ready for live partner registrations & website bookings.',
    ip: '127.0.0.1',
  },
];
