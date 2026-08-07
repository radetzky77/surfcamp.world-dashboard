import React, { useState } from 'react';
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
import { UserRole, Booking } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Global State
  const [userProfile] = useState(INITIAL_USER);
  const [partners, setPartners] = useState(INITIAL_PARTNERS);
  const [accommodations] = useState(INITIAL_ACCOMMODATIONS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [discounts, setDiscounts] = useState(INITIAL_DISCOUNTS);
  const [expenses] = useState(INITIAL_EXPENSES);
  const [invoices] = useState(INITIAL_INVOICES);
  const [surfSpots] = useState(INITIAL_SURF_SPOTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [messages] = useState(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [auditLogs] = useState(INITIAL_AUDIT_LOGS);

  const handleQuickCreateBooking = () => {
    setActiveTab('bookings');
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#09090B] text-white' : 'bg-slate-100 text-slate-900'} font-sans flex antialiased`}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        currentUser={userProfile}
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
    </div>
  );
}
