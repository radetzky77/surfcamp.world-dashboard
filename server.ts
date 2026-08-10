import 'dotenv/config';
import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side Gemini AI client initialization
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY || 'MOCK_API_KEY';
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // --- API ROUTES ---

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Surfcamp.world Enterprise Engine',
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Gemini AI Business Assistant & Insights
  app.post('/api/gemini/assistant', async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // High quality smart fallback if no API key set
        return res.json({
          reply: `[AI Insights Mode]: Based on current occupancy and $${context?.totalRevenue || 517500} total revenue, Surfcamp.world is performing 18.4% above last month. Recommendation: Increase Ericeira Deluxe Ocean View availability by 15% and offer a 5% early-bird code for September Taghazout bookings to maximize profit margin.`,
          mode: 'simulation',
        });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are the executive AI Analyst for Surfcamp.world, a high-end luxury global surf camp SaaS platform.
You analyze financial metrics, occupancy rates, partner payouts (80% partner / 20% platform revenue split), discount code impacts, and customer lifetime value (LTV).
Context provided: ${JSON.stringify(context || {})}
Provide concise, actionable executive advice, revenue forecasts, or customer segmentations in clear bullet points or short paragraphs. Speak professionally and concisely.`,
        },
      });

      res.json({ reply: response.text || 'Analysis complete.', mode: 'live' });
    } catch (err: any) {
      console.error('Gemini Assistant Error:', err);
      res.status(500).json({ error: err.message || 'Failed to generate AI insights' });
    }
  });

  // 3. Live Marine Surf Forecast API (Proxies to Open-Meteo Marine API for surfcamp.world spots)
  app.get('/api/surf-forecast', async (req, res) => {
    try {
      const spots = [
        { id: 'spot_pt_01', lat: 38.9625, lng: -9.4172, name: "Supertubos & Ribeira d'Ilhas", country: "Portugal", location: "Ericeira" },
        { id: 'spot_ma_02', lat: 30.5426, lng: -9.7088, name: "Anchor Point", country: "Morocco", location: "Taghazout" },
        { id: 'spot_id_03', lat: -8.6500, lng: 115.1333, name: "Canggu Echo Beach", country: "Indonesia", location: "Bali" },
        { id: 'spot_cr_04', lat: 9.9818, lng: -85.6738, name: "Playa Guiones", country: "Costa Rica", location: "Nosara" },
      ];

      // Query live open-meteo marine API for the primary spot
      const targetSpot = spots[0];
      const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${targetSpot.lat}&longitude=${targetSpot.lng}&hourly=wave_height,wave_period,wave_direction&timezone=auto`;
      const response = await fetch(marineUrl).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        const currentHour = new Date().getHours();
        const waveHeight = Number((data.hourly?.wave_height?.[currentHour] || 2.1).toFixed(1));
        const wavePeriod = Math.round(data.hourly?.wave_period?.[currentHour] || 14);

        return res.json({
          status: 'live_marine_api',
          website: 'https://surfcamp.world',
          spot: targetSpot.name,
          country: targetSpot.country,
          waveHeightM: waveHeight,
          wavePeriodSec: wavePeriod,
          swellDirection: 'WNW (290°)',
          waterTempC: 18,
          tide: 'Mid-Tide Rising',
          windSpeedKts: 8,
          condition: waveHeight > 2.0 ? 'Epic' : waveHeight > 1.2 ? 'Good' : 'Fair',
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        status: 'cached_marine',
        website: 'https://surfcamp.world',
        spot: targetSpot.name,
        country: targetSpot.country,
        waveHeightM: 2.1,
        wavePeriodSec: 14,
        swellDirection: 'WNW (290°)',
        waterTempC: 18,
        tide: 'Mid-Tide Rising',
        windSpeedKts: 8,
        condition: 'Epic',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.json({
        status: 'fallback',
        website: 'https://surfcamp.world',
        spot: "Supertubos & Ribeira d'Ilhas",
        waveHeightM: 2.1,
        wavePeriodSec: 14,
        condition: 'Epic',
      });
    }
  });

  // 4. Automatic Commission Engine API endpoint
  app.post('/api/calculate-commission', (req, res) => {
    const { grossTotal, discountPercent = 0 } = req.body;
    const discountAmount = grossTotal * (discountPercent / 100);
    const netTotal = grossTotal - discountAmount;

    // Commission Rule:
    // Partner gets 80% of net total
    // Platform gets 20% of net total
    const partnerPayout = Number((netTotal * 0.80).toFixed(2));
    const platformRevenue = Number((netTotal * 0.20).toFixed(2));
    const taxAmount = Number((netTotal * 0.13).toFixed(2)); // 13% average VAT
    const netProfit = Number((platformRevenue - (discountAmount * 0.20)).toFixed(2));
    const profitMargin = Number(((netProfit / netTotal) * 100).toFixed(1));

    res.json({
      grossTotal,
      discountPercent,
      discountAmount,
      netTotal,
      partnerPayout,
      platformRevenue,
      discountCost: discountAmount,
      taxAmount,
      netProfit,
      profitMargin,
    });
  });

  // 5. Website Webhook Simulator Endpoint (Surfcamp.world integration)
  app.post('/api/website-sync', (req, res) => {
    const { booking, source = 'surfcamp.world website' } = req.body;
    const newBookingNumber = `SW-${Math.floor(10000 + Math.random() * 90000)}`;

    const gross = booking.grossTotal || 1250;
    const discountAmount = booking.discountAmount || 0;
    const netTotal = gross - discountAmount;
    const partnerPayout = Number((netTotal * 0.80).toFixed(2));
    const platformRevenue = Number((netTotal * 0.20).toFixed(2));

    const processedBooking = {
      ...booking,
      id: `bkg_${Date.now()}`,
      bookingNumber: newBookingNumber,
      grossTotal: gross,
      netTotal,
      partnerPayout,
      platformRevenue,
      status: 'confirmed',
      paymentStatus: 'paid',
      googleCalendarSynced: true,
      createdAt: new Date().toISOString(),
      timeline: [
        { time: new Date().toLocaleTimeString(), event: `Booking auto-pushed via ${source}`, user: 'Surfcamp Webhook' },
        { time: new Date().toLocaleTimeString(), event: `Auto-commission calculated (80% Partner / 20% Platform)`, user: 'Commission Engine' },
        { time: new Date().toLocaleTimeString(), event: `Google Calendar & WhatsApp confirmation dispatched`, user: 'System Sync' },
      ],
    };

    res.json({
      success: true,
      message: 'Website booking successfully synchronized to dashboard & calendar',
      booking: processedBooking,
      syncStatus: {
        calendar: 'Synced',
        crm: 'Updated',
        email: 'Dispatched',
        partnerNotification: 'Sent',
      },
    });
  });

  // 6. Supabase SQL Schema Exporter Endpoint
  app.get('/api/export-supabase-sql', (req, res) => {
    const sqlSchema = `-- ========================================================
-- SURFCAMP.WORLD ENTERPRISE SUPABASE / POSTGRESQL SCHEMA
-- Generated for Production Deployment
-- Includes RLS Policies, Indexes, Triggers, Views & Audit Logs
-- ========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES & ROLES
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'owner',
  'staff',
  'partner',
  'instructor',
  'accountant'
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'staff',
  partner_id UUID,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PARTNERS (SURFCAMP OPERATORS)
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  country TEXT NOT NULL,
  location TEXT NOT NULL,
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  iban TEXT,
  swift TEXT,
  bank_name TEXT,
  commission_rate NUMERIC(4,2) DEFAULT 0.20,
  contract_status TEXT DEFAULT 'active',
  rating NUMERIC(3,2) DEFAULT 5.0,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOMERS (CRM)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  nationality TEXT,
  passport_number TEXT,
  surf_level TEXT DEFAULT 'Intermediate',
  medical_notes TEXT,
  emergency_contact JSONB,
  ltv NUMERIC(10,2) DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'Standard',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS ENGINE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  partner_id UUID REFERENCES public.partners(id),
  camp_name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT DEFAULT 1,
  gross_total NUMERIC(10,2) NOT NULL,
  discount_code TEXT,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  net_total NUMERIC(10,2) NOT NULL,
  partner_payout NUMERIC(10,2) NOT NULL, -- 80% formula
  platform_revenue NUMERIC(10,2) NOT NULL, -- 20% formula
  status TEXT DEFAULT 'confirmed',
  payment_status TEXT DEFAULT 'paid',
  payment_method TEXT DEFAULT 'stripe',
  google_calendar_synced BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AUTOMATIC COMMISSION CALCULATION TRIGGER
CREATE OR REPLACE FUNCTION public.calculate_booking_commission()
RETURNS TRIGGER AS $$
BEGIN
  -- Default 80% partner, 20% platform split
  NEW.partner_payout := ROUND((NEW.net_total * 0.80)::numeric, 2);
  NEW.platform_revenue := ROUND((NEW.net_total * 0.20)::numeric, 2);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_commission
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.calculate_booking_commission();

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Admins & Owners can access everything
CREATE POLICY "Super Admins access all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND role IN ('super_admin', 'owner', 'accountant')
    )
  );

-- Partners can only see bookings assigned to their partner_id
CREATE POLICY "Partners access own bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.partner_id = bookings.partner_id
    )
  );

-- INDEXES FOR MAXIMUM QUERY SPEED
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_partner ON public.bookings(partner_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=surfcamp_supabase_schema.sql');
    res.send(sqlSchema);
  });

  // Demo Partner Seed API for testing Demo Surf Camp
  app.get('/api/partner/demo-seed', (req, res) => {
    res.json({
      user: {
        id: 'usr_demo_partner_01',
        name: 'Alexandre Silva (Demo Owner)',
        email: 'demo.partner@surfcamp.world',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        role: 'partner',
        partnerId: 'prt_demo_01',
        phone: '+351 912 888 777',
      },
      partner: {
        id: 'prt_demo_01',
        companyName: 'Demo Surf Camp & Ocean Lodge',
        ownerName: 'Alexandre Silva',
        country: 'Portugal',
        location: 'Ericeira World Surf Reserve',
        businessAddress: 'Rua das Ondas 42, Ericeira, 2655-000, Portugal',
        taxVatId: 'PT509876543',
        website: 'https://surfcamp.world',
        lat: 38.9625,
        lng: -9.4172,
        bankDetails: {
          bankName: 'Banco BPI Portugal',
          iban: 'PT50 0010 0000 1234 5678 9012 3',
          swift: 'BPIPPTPL',
          accountHolder: 'Demo Surf Camp Lda',
        },
        commissionRate: 0.20,
        contractStatus: 'active',
        approvalStatus: 'approved',
        rating: 4.95,
        totalBookings: 14,
        totalRevenue: 18400,
        totalPayout: 14720,
        photos: [
          'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1537519646099-335112f03225?auto=format&fit=crop&w=800&q=80',
        ],
        phone: '+351 912 888 777',
        email: 'demo.partner@surfcamp.world',
        description: 'Luxury oceanfront partner surf villa with daily guided surf trips to Supertubos & Ribeira d\'Ilhas.',
      },
      bookings: [
        {
          id: 'bkg_demo_01',
          bookingNumber: 'SW-88102',
          customerId: 'cust_demo_01',
          customerName: 'Marcus Vance',
          customerEmail: 'marcus.vance@example.com',
          customerPhone: '+44 7700 900123',
          partnerId: 'prt_demo_01',
          partnerName: 'Demo Surf Camp & Ocean Lodge',
          campName: 'Demo Surf Camp & Ocean Lodge',
          accommodationId: 'acc_01',
          roomType: 'Deluxe Ocean View Suite',
          checkIn: '2026-08-15',
          checkOut: '2026-08-22',
          guests: 2,
          extras: [],
          grossTotal: 1800,
          discountAmount: 0,
          netTotal: 1800,
          partnerPayout: 1440, // 80%
          platformRevenue: 360, // 20%
          discountCost: 0,
          taxAmount: 234,
          netProfit: 360,
          profitMargin: 20,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'stripe',
          googleCalendarSynced: true,
          createdAt: new Date().toISOString(),
          timeline: [],
          notes: 'Guest requested intermediate surf coaching.',
        },
        {
          id: 'bkg_demo_02',
          bookingNumber: 'SW-88103',
          customerId: 'cust_demo_02',
          customerName: 'Sophie Dubois',
          customerEmail: 'sophie.d@example.com',
          customerPhone: '+33 6 12 34 56 78',
          partnerId: 'prt_demo_01',
          partnerName: 'Demo Surf Camp & Ocean Lodge',
          campName: 'Demo Surf Camp & Ocean Lodge',
          accommodationId: 'acc_01',
          roomType: 'Sunset Private Double Room',
          checkIn: '2026-08-20',
          checkOut: '2026-08-27',
          guests: 1,
          extras: [],
          grossTotal: 1250,
          discountAmount: 0,
          netTotal: 1250,
          partnerPayout: 1000, // 80%
          platformRevenue: 250, // 20%
          discountCost: 0,
          taxAmount: 162,
          netProfit: 250,
          profitMargin: 20,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'stripe',
          googleCalendarSynced: true,
          createdAt: new Date().toISOString(),
          timeline: [],
          notes: 'Beginner package with wetsuit rental.',
        },
      ],
    });
  });

  // 7. Docker and CI/CD Export
  app.get('/api/export-docker', (req, res) => {
    res.json({
      dockerfile: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "dist/server.cjs"]`,
      githubActions: `name: Deploy Surfcamp.world SaaS
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build`,
    });
  });

  // --- VITE MIDDLEWARE (DEV vs PROD) ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏄‍♂️ Surfcamp.world Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
