import React, { useState, useEffect } from 'react';
import { SidebarNav } from './components/SidebarNav';
import { Footer } from './components/Footer';
import { SearchPage } from './components/SearchPage';
import { TrainsMatrixPage } from './components/TrainsMatrixPage';
import { SeatSelectorPage } from './components/SeatSelectorPage';
import { CheckoutPage } from './components/CheckoutPage';
import { DashboardPage } from './components/DashboardPage';
import { AdminConsolePage } from './components/AdminConsolePage';
import { LiveTrainMap } from './components/LiveTrainMap';
import { ConcurrencyLabModal } from './components/ConcurrencyLabModal';
import { BoardingPassModal } from './components/BoardingPassModal';
import { AuthModal } from './components/AuthModal';
import { ContactPage } from './components/ContactPage';
import { railwayService } from './services/railwayService';
import { Train, Coach, Seat, Booking, Station } from './types/railway';
import { UserProfile, DEMO_USERS } from './types/user';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'trains' | 'seats' | 'checkout' | 'dashboard' | 'admin' | 'tracking' | 'contact'>('search');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const updateSidebarForViewport = () => setSidebarCollapsed(window.innerWidth <= 768);
    window.addEventListener('resize', updateSidebarForViewport);
    return () => window.removeEventListener('resize', updateSidebarForViewport);
  }, []);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => DEMO_USERS.traveler);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Search parameters
  const [sourceCode, setSourceCode] = useState('NDLS');
  const [destCode, setDestCode] = useState('HWH');
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [coachFilter, setCoachFilter] = useState('ALL');

  // Selection states
  const [allTrains, setAllTrains] = useState<Train[]>(() => railwayService.getAllTrains());
  const [matchingTrains, setMatchingTrains] = useState<Train[]>(() => railwayService.searchTrains('NDLS', 'HWH', 'ALL'));
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [trackingTrainId, setTrackingTrainId] = useState<number>(1);

  // Modals state
  const [isConcurrencyLabOpen, setIsConcurrencyLabOpen] = useState(false);
  const [viewingTicketBooking, setViewingTicketBooking] = useState<Booking | null>(null);

  // Reactive data states
  const [stations, setStations] = useState<Station[]>(() => railwayService.getStations());
  const [bookings, setBookings] = useState<Booking[]>(() => railwayService.getAllBookings());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    setStations(railwayService.getStations());
    setBookings(railwayService.getAllBookings());
    const trains = railwayService.searchTrains(sourceCode, destCode, 'ALL');
    setMatchingTrains(trains);
    setAllTrains(railwayService.getAllTrains());
  }, [refreshTrigger, sourceCode, destCode]);

  const handleSearch = (src: string, dst: string, date: string, cFilter: string) => {
    setSourceCode(src);
    setDestCode(dst);
    setTravelDate(date);
    setCoachFilter(cFilter);
    const results = railwayService.searchTrains(src, dst, cFilter);
    setMatchingTrains(results);
    setActiveTab('trains');
  };

  const handleSelectQuickRoute = (src: string, dst: string) => {
    setSourceCode(src);
    setDestCode(dst);
    const results = railwayService.searchTrains(src, dst, 'ALL');
    setMatchingTrains(results);
    setActiveTab('trains');
  };

  const handleSelectCoach = (train: Train, coach: Coach) => {
    setSelectedTrain(train);
    setSelectedCoach(coach);
    setSelectedSeats([]);
    setActiveTab('seats');
  };

  const handleSwitchCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setSelectedSeats([]);
  };

  const handleProceedToCheckout = (seats: Seat[]) => {
    setSelectedSeats(seats);
    setActiveTab('checkout');
  };

  const handleBookingSuccess = (pnr: string) => {
    refreshData();
    const createdBooking = railwayService.getBookingByPnr(pnr);
    if (createdBooking) {
      setViewingTicketBooking(createdBooking);
    }
    setActiveTab('dashboard');
  };

  const handleTrackTrain = (trainId: number) => {
    setTrackingTrainId(trainId);
    setActiveTab('tracking');
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 relative">
      {/* Ambient backdrop: drifting brand-color auroras + blueprint rail grid */}
      <div className="fixed inset-0 -z-0 pointer-events-none overflow-hidden bg-[#080d18]" aria-hidden="true">
        {/* Aurora glow blobs — slow drift, brand palette */}
        <div className="aurora-a absolute -top-44 -left-36 h-[36rem] w-[36rem] rounded-full bg-amber-500/12 blur-[120px]" />
        <div className="aurora-b absolute -top-48 -right-24 h-[34rem] w-[34rem] rounded-full bg-sky-500/14 blur-[110px]" />
        <div className="aurora-c absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-rose-500/12 blur-[120px]" />
        <div className="aurora-d absolute -bottom-56 -left-32 h-[34rem] w-[34rem] rounded-full bg-amber-500/10 blur-[110px]" />
        <div className="aurora-e absolute -bottom-48 right-1/4 h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="aurora-a absolute top-[45%] left-1/3 h-[26rem] w-[26rem] rounded-full bg-violet-500/8 blur-[120px]" />
        {/* Blueprint grid + dot matrix + vignette */}
        <div className="rail-grid absolute inset-0 opacity-[0.05]" />
        <div className="rail-dots absolute inset-0 opacity-[0.05]" />
        <div className="rail-vignette absolute inset-0" />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
      
      {/* Left Sidebar Navigation */}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConcurrencyLab={() => setIsConcurrencyLabOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={(m) => { setAuthModalMode(m); setIsAuthModalOpen(true); }}
        onLogout={() => setCurrentUser(null)}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area positioned to the right of Sidebar */}
      <div className={`transition-all duration-300 flex-1 flex flex-col ${sidebarCollapsed ? 'pl-20' : 'pl-64'}`}>
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page 1: Home & Route Search Portal */}
        {activeTab === 'search' && (
          <SearchPage
            stations={stations}
            trains={allTrains.length > 0 ? allTrains : matchingTrains}
            bookings={bookings}
            onViewTicket={(b) => setViewingTicketBooking(b)}
            onSearch={handleSearch}
            onSelectQuickRoute={handleSelectQuickRoute}
            onOpenLiveMapTab={() => setActiveTab('tracking')}
            onDirectSelectTrain={(train) => {
              setSelectedTrain(train);
              setSelectedCoach(train.coaches[0]);
              setSelectedSeats([]);
              setActiveTab('seats');
            }}
            onTrackTrain={handleTrackTrain}
            currentUser={currentUser}
            onOpenAuthModal={(m) => { setAuthModalMode(m); setIsAuthModalOpen(true); }}
            onLogout={() => setCurrentUser(null)}
            onViewMyBookings={() => setActiveTab('dashboard')}
          />
        )}

        {/* Dedicated Live Train Tracking Map View */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <button onClick={() => setActiveTab('search')} className="text-amber-400 hover:underline">Home</button>
              <span>/</span>
              <span className="text-slate-200">Satellite RTIS Live GPS Radar</span>
            </div>

            <LiveTrainMap
              trains={allTrains.length > 0 ? allTrains : matchingTrains}
              selectedTrainId={trackingTrainId}
              onSelectTrain={(id) => setTrackingTrainId(id)}
            />
          </div>
        )}

        {/* Page 2: Available Trains & Schedule Matrix */}
        {activeTab === 'trains' && (
          <TrainsMatrixPage
            trains={matchingTrains}
            sourceCode={sourceCode}
            destCode={destCode}
            travelDate={travelDate}
            onSelectCoach={handleSelectCoach}
            onBackToSearch={() => setActiveTab('search')}
            onTrackTrain={handleTrackTrain}
          />
        )}

        {/* Page 3: Interactive Coach Grid & Seat Selector */}
        {activeTab === 'seats' && selectedTrain && selectedCoach && (
          <SeatSelectorPage
            train={selectedTrain}
            selectedCoach={selectedCoach}
            onSwitchCoach={handleSwitchCoach}
            onProceedToCheckout={handleProceedToCheckout}
            onBack={() => setActiveTab('trains')}
          />
        )}

        {/* Page 4: Passenger Details, Checkout & PNR Generation */}
        {activeTab === 'checkout' && selectedTrain && selectedCoach && selectedSeats.length > 0 && (
          <CheckoutPage
            train={selectedTrain}
            coach={selectedCoach}
            selectedSeats={selectedSeats}
            travelDate={travelDate}
            onBookingSuccess={handleBookingSuccess}
            onBack={() => setActiveTab('seats')}
          />
        )}

        {/* Page 5: User Booking History & Ticket Management */}
        {activeTab === 'dashboard' && (
          <DashboardPage
            bookings={bookings}
            onRefresh={refreshData}
            onViewTicket={(b) => setViewingTicketBooking(b)}
          />
        )}

        {/* Page 6: Railway Administrator Fleet Console */}
        {activeTab === 'admin' && (
          <AdminConsolePage
            metrics={railwayService.getAdminMetrics()}
            auditLogs={railwayService.getAuditLogs()}
            stations={stations}
            onRefresh={refreshData}
          />
        )}

        {/* Page 7: Rail Madad & 24/7 Helpline Contact Portal */}
        {activeTab === 'contact' && (
          <ContactPage onBackToHome={() => setActiveTab('search')} />
        )}

        {/* Page 8: MineGuard AI Telemetry & Hazard Vision Pipeline */}

      </main>

      {/* Stylish Enterprise Footer on Every Page */}
      <Footer
        onNavigateToContact={() => setActiveTab('contact')}
        onNavigateToHome={() => setActiveTab('search')}
        onNavigateToTrains={() => setActiveTab('trains')}
        onNavigateToDashboard={() => setActiveTab('dashboard')}
        onNavigateToTracking={() => setActiveTab('tracking')}
      />

      {/* Interactive Modals */}
      <ConcurrencyLabModal
        isOpen={isConcurrencyLabOpen}
        onClose={() => setIsConcurrencyLabOpen(false)}
        onRefreshParent={refreshData}
      />

      <BoardingPassModal
        booking={viewingTicketBooking}
        onClose={() => setViewingTicketBooking(null)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(usr) => {
          setCurrentUser(usr);
          setIsAuthModalOpen(false);
        }}
        initialMode={authModalMode}
      />

      </div>
      </div>
    </div>
  );
}
