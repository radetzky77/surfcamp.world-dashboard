import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { BookingManagement } from './components/bookings/BookingManagement';
import { CalendarView } from './components/calendar/CalendarView';
import { CustomerCRM } from './components/crm/CustomerCRM';
import { PartnerManagement } from './components/partners/PartnerManagement';
import { AccommodationView } from './components/accommodations/AccommodationView';
import { SurfForecastModule } from './components/surf/SurfForecastModule';
import { FinanceModule } from './components/finance/FinanceModule';
import { MarketingModule } from './components/marketing/MarketingModule';
import { MessagesView } from './components/messages/MessagesView';
import { TasksView } from './components/tasks/TasksView';
import { AIAssistantModule } from './components/ai/AIAssistantModule';
import { WebsiteSyncModule } from './components/sync/WebsiteSyncModule';
import { SettingsModule } from './components/settings/SettingsModule';

// Partner Portal Components
import { PartnerLayout } from './components/partner/PartnerLayout';
import { PartnerLogin } from './components/partner/PartnerLogin';
import { PartnerOverview } from './components/partner/PartnerOverview';
import { MySurfCamp } from './components/partner/MySurfCamp';
import { PartnerBookings } from './components/partner/PartnerBookings';
import { PartnerCustomers } from './components/partner/PartnerCustomers';
import { PartnerEarnings } from './components/partner/PartnerEarnings';
import { PartnerSettings } from './components/partner/PartnerSettings';
import { PartnerRegisterModal } from './components/partner/PartnerRegisterModal';

// Auth Modals
import { LoginChooserModal } from './components/auth/LoginChooserModal';

import {
  INITIAL_USER,
  INITIAL_PARTNERS,
  INITIAL_ACCOMMODATIONS,
  INITIAL_CUSTOMERS,
  INITIAL_BOOKINGS,
  INITIAL_DISCOUNTS,
  INITIAL_EXPENSES,
  INITIAL_INVOICES,
  INITIAL_SURF_SPOTS,
  INITIAL_TASKS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';
import { UserRole, Booking, Partner, UserProfile, NotificationItem } from './types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/admin/dashboard');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [partnerActiveTab, setPartnerActiveTab] = useState<string>('overview');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals state
  const [showLoginChooser, setShowLoginChooser] = useState<boolean>(false);
  const [showPartnerRegisterModal, setShowPartnerRegisterModal] = useState<boolean>(false);

  // Authentication & Partner Session State
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [currentPartner, setCurrentPartner] = useState<Partner | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Global State Data
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [accommodations] = useState(INITIAL_ACCOMMODATIONS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [discounts, setDiscounts] = useState(INITIAL_DISCOUNTS);
  const [expenses] = useState(INITIAL_EXPENSES);
  const [invoices] = useState(INITIAL_INVOICES);
  const [surfSpots] = useState(INITIAL_SURF_SPOTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [messages] = useState(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Synchronize browser URL changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleQuickCreateBooking = () => {
    setActiveTab('bookings');
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handlePartnerRegisterSuccess = (newPartner: Partner, notificationMsg: string) => {
    setPartners((prev) => [...prev, newPartner]);

    // Create Admin Notification (🔔)
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'New Surf Camp Partner Application',
      message: notificationMsg,
      type: 'alert',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handlePartnerLoginSuccess = (user: UserProfile, partnerData?: Partner, demoBookings?: Booking[]) => {
    setCurrentUser(user);
    setCurrentRole('partner');
    setIsAuthenticated(true);
    if (partnerData) {
      setCurrentPartner(partnerData);
      setPartners((prev) => {
        if (!prev.find((p) => p.id === partnerData.id)) {
          return [...prev, partnerData];
        }
        return prev;
      });
    }
    if (demoBookings && demoBookings.length > 0) {
      setBookings((prev) => [...demoBookings, ...prev.filter((b) => !b.id.startsWith('bkg_demo_'))]);
    }
    navigateTo('/partner/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentRole('staff');
    setCurrentPartner(undefined);
    navigateTo('/partner/login');
  };

  const handleUpdateBookingStatus = (bookingId: string, status: 'confirmed' | 'cancelled') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  // ROUTE DISPATCHING

  // 1. Partner Login Page (`/partner/login`)
  if (currentPath === '/partner/login') {
    return (
      <PartnerLogin
        onLoginSuccess={handlePartnerLoginSuccess}
        onNavigateRegister={() => setShowPartnerRegisterModal(true)}
      />
    );
  }

  // 2. Partner Dashboard Routes (`/partner/*`)
  if (currentPath.startsWith('/partner')) {
    // Security check: if role is admin or unauthenticated
    if (currentRole !== 'partner') {
      return (
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-2xl bg-[#16161F] border border-[#5B8CFF]/30 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#5B8CFF]/10 text-[#5B8CFF] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-white">Partner Portal Authentication Required</h2>
            <p className="text-xs text-white/60">
              Please sign in to your verified Surf Camp Partner account to access the partner portal.
            </p>
            <button
              onClick={() => navigateTo('/partner/login')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white text-xs font-bold shadow hover:opacity-95 transition"
            >
              Go to Partner Login
            </button>
          </div>
        </div>
      );
    }

    return (
      <PartnerLayout
        activeTab={partnerActiveTab}
        setActiveTab={setPartnerActiveTab}
        currentUser={currentUser}
        currentPartner={currentPartner}
        onLogout={handleLogout}
      >
        {partnerActiveTab === 'overview' && (
          <PartnerOverview
            partner={currentPartner}
            bookings={bookings}
            onNavigateTab={setPartnerActiveTab}
          />
        )}
        {partnerActiveTab === 'surf-camp' && (
          <MySurfCamp
            partner={currentPartner}
            onUpdatePartner={(updated) => {
              setCurrentPartner(updated);
              setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            }}
          />
        )}
        {partnerActiveTab === 'bookings' && (
          <PartnerBookings
            partner={currentPartner}
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
          />
        )}
        {partnerActiveTab === 'customers' && (
          <PartnerCustomers partner={currentPartner} bookings={bookings} />
        )}
        {partnerActiveTab === 'earnings' && (
          <PartnerEarnings partner={currentPartner} bookings={bookings} />
        )}
        {partnerActiveTab === 'settings' && (
          <PartnerSettings currentUser={currentUser} partner={currentPartner} />
        )}
      </PartnerLayout>
    );
  }

  // 3. Admin Security Guard: If a partner role user attempts to access `/admin/*`
  if (currentRole === 'partner' && (currentPath.startsWith('/admin') || currentPath === '/')) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-2xl bg-[#16161F] border border-red-500/30 space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-extrabold text-white">ACCESS DENIED — Admin Boundary Protection</h2>
          <p className="text-xs text-white/60">
            Camp partners are strictly restricted from viewing main company dashboards, platform financial metrics, or administrative controls.
          </p>
          <button
            onClick={() => navigateTo('/partner/dashboard')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white text-xs font-bold shadow hover:opacity-95 transition flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Partner Portal</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. Main Business Admin Dashboard Experience (`/admin/*` or `/`)
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#09090B] text-white' : 'bg-slate-100 text-slate-900'} font-sans flex antialiased`}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        currentUser={currentUser}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
      />

      {/* Main Content Workspace */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Navbar */}
        <Navbar
          notifications={notifications}
          setNotifications={setNotifications}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onQuickCreateBooking={handleQuickCreateBooking}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          liveSurfInfo={{
            spot: surfSpots[0]?.name || 'Ericeira',
            waveHeightM: surfSpots[0]?.waveHeightM || 2.1,
            condition: surfSpots[0]?.condition || 'Epic',
          }}
          currentRole={currentRole}
          isAuthenticated={isAuthenticated}
          onOpenLoginChooser={() => setShowLoginChooser(true)}
          onOpenPartnerRegisterModal={() => setShowPartnerRegisterModal(true)}
          onLogout={handleLogout}
        />

        {/* Tab Content Renderer */}
        <main className="flex-1 pb-12">
          {activeTab === 'dashboard' && (
            <DashboardHome
              bookings={bookings}
              partners={partners}
              surfSpots={surfSpots}
              auditLogs={auditLogs}
              onOpenNewBooking={() => setActiveTab('bookings')}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingManagement
              bookings={bookings}
              setBookings={setBookings}
              partners={partners}
              customers={customers}
              accommodations={accommodations}
              discounts={discounts}
              initialSearch={searchTerm}
            />
          )}

          {activeTab === 'calendar' && <CalendarView bookings={bookings} partners={partners} />}

          {activeTab === 'crm' && <CustomerCRM customers={customers} setCustomers={setCustomers} />}

          {activeTab === 'partners' && <PartnerManagement partners={partners} setPartners={setPartners} />}

          {activeTab === 'accommodations' && <AccommodationView accommodations={accommodations} />}

          {activeTab === 'surf-forecast' && <SurfForecastModule surfSpots={surfSpots} />}

          {(activeTab === 'finance' || activeTab === 'invoices') && (
            <FinanceModule bookings={bookings} expenses={expenses} invoices={invoices} partners={partners} />
          )}

          {activeTab === 'discounts' && <MarketingModule discounts={discounts} setDiscounts={setDiscounts} />}

          {activeTab === 'messages' && <MessagesView messages={messages} />}

          {activeTab === 'tasks' && <TasksView tasks={tasks} setTasks={setTasks} />}

          {activeTab === 'ai-assistant' && (
            <AIAssistantModule bookings={bookings} partners={partners} customers={customers} />
          )}

          {activeTab === 'website-sync' && <WebsiteSyncModule onAddBooking={handleAddBooking} />}

          {activeTab === 'settings' && <SettingsModule currentRole={currentRole} setCurrentRole={setCurrentRole} />}
        </main>
      </div>

      {/* Login Chooser Modal */}
      <LoginChooserModal
        isOpen={showLoginChooser}
        onClose={() => setShowLoginChooser(false)}
        onSelectPartner={() => navigateTo('/partner/login')}
        onSelectAdmin={() => {
          setCurrentRole('super_admin');
          navigateTo('/admin/dashboard');
        }}
      />

      {/* Partner Registration Modal */}
      <PartnerRegisterModal
        isOpen={showPartnerRegisterModal}
        onClose={() => setShowPartnerRegisterModal(false)}
        onRegisterSuccess={handlePartnerRegisterSuccess}
      />
    </div>
  );
}
