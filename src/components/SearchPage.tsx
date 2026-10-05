import React, { useState } from 'react';
import { Search, Calendar, MapPin, ArrowRightLeft, Shield, Zap, Sparkles, Database, CheckCircle2, Train as TrainIcon, Radio, Clock, Coffee, Wifi, Luggage, Award, ChevronDown, ChevronUp, AlertCircle, ArrowRight, Star, Heart, Tag, Send, Compass } from 'lucide-react';
import { Station, Train, Booking } from '../types/railway';
import { UserProfile } from '../types/user';
import { LiveTrainMap } from './LiveTrainMap';
import { StationDepartureBoard } from './StationDepartureBoard';
import { StationWeatherWidget } from './StationWeatherWidget';
import { PnrStatusWidget } from './PnrStatusWidget';
import { FareAndBaggageCalculator } from './FareAndBaggageCalculator';
import { StationFacilitiesGuide } from './StationFacilitiesGuide';
import { HeritageRailwaysSection } from './HeritageRailwaysSection';
import { KavachSafetyShowcase } from './KavachSafetyShowcase';
import { ScenicGatewaysShowcase } from './ScenicGatewaysShowcase';
import { MemberPortalSection } from './MemberPortalSection';
import { MyLastTripCard } from './MyLastTripCard';

interface SearchPageProps {
  stations: Station[];
  trains: Train[];
  bookings?: Booking[];
  onViewTicket?: (booking: Booking) => void;
  onSearch: (source: string, destination: string, date: string, coachClass: string) => void;
  onSelectQuickRoute: (source: string, destination: string) => void;
  onOpenLiveMapTab: () => void;
  onDirectSelectTrain: (train: Train) => void;
  onTrackTrain: (trainId: number) => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: (mode: 'signin' | 'signup') => void;
  onLogout: () => void;
  onViewMyBookings: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  stations,
  trains,
  bookings = [],
  onViewTicket,
  onSearch,
  onSelectQuickRoute,
  onOpenLiveMapTab,
  onDirectSelectTrain,
  onTrackTrain,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onViewMyBookings
}) => {
  const latestBooking = bookings.length > 0 ? bookings[0] : null;
  const today = new Date().toISOString().split('T')[0];
  const [source, setSource] = useState('NDLS');
  const [destination, setDestination] = useState('HWH');
  const [journeyDate, setJourneyDate] = useState(today);
  const [coachClass, setCoachClass] = useState('ALL');
  const [quota, setQuota] = useState('GENERAL');
  const [showDetailedSearch, setShowDetailedSearch] = useState(true);
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [isHeroDropdownOpen, setIsHeroDropdownOpen] = useState(false);

  const matchedStations = heroSearchQuery.trim()
    ? stations.filter(s =>
        s.name.toLowerCase().includes(heroSearchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(heroSearchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(heroSearchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const matchedTrains = heroSearchQuery.trim()
    ? trains.filter(t =>
        t.trainName.toLowerCase().includes(heroSearchQuery.toLowerCase()) ||
        t.trainNumber.includes(heroSearchQuery) ||
        t.sourceName.toLowerCase().includes(heroSearchQuery.toLowerCase()) ||
        t.destinationName.toLowerCase().includes(heroSearchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsHeroDropdownOpen(false);

    const query = heroSearchQuery.trim().toLowerCase();
    if (!query) {
      onSearch(source, destination, journeyDate, coachClass);
      return;
    }

    // 1. Check if user entered "X to Y" or "X - Y"
    const delimiter = query.includes(' to ') ? ' to ' : query.includes(' - ') ? ' - ' : null;
    if (delimiter) {
      const parts = query.split(delimiter);
      const sPart = parts[0].trim();
      const dPart = parts[1].trim();

      const foundSrc = stations.find(s =>
        s.name.toLowerCase().includes(sPart) || s.code.toLowerCase() === sPart || s.city.toLowerCase().includes(sPart)
      );
      const foundDst = stations.find(s =>
        s.name.toLowerCase().includes(dPart) || s.code.toLowerCase() === dPart || s.city.toLowerCase().includes(dPart)
      );

      if (foundSrc && foundDst) {
        setSource(foundSrc.code);
        setDestination(foundDst.code);
        onSearch(foundSrc.code, foundDst.code, journeyDate, coachClass);
        return;
      }
    }

    // 2. Check if query matches a train directly (e.g. 22436 or "Vande Bharat")
    const matchedTrain = trains.find(t =>
      t.trainNumber.includes(query) || t.trainName.toLowerCase().includes(query)
    );
    if (matchedTrain) {
      setSource(matchedTrain.sourceCode);
      setDestination(matchedTrain.destinationCode);
      onSearch(matchedTrain.sourceCode, matchedTrain.destinationCode, journeyDate, coachClass);
      return;
    }

    // 3. Check if query matches a station
    const matchedStation = stations.find(s =>
      s.name.toLowerCase().includes(query) || s.code.toLowerCase() === query || s.city.toLowerCase().includes(query)
    );
    if (matchedStation) {
      if (matchedStation.code === source) {
        onSearch(source, destination, journeyDate, coachClass);
      } else {
        setDestination(matchedStation.code);
        onSearch(source, matchedStation.code, journeyDate, coachClass);
      }
      return;
    }

    onSearch(source, destination, journeyDate, coachClass);
  };

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSwapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (source === destination) {
      alert('Source and destination cannot be identical!');
      return;
    }
    onSearch(source, destination, journeyDate, coachClass);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 5000);
      setNewsletterEmail('');
    }
  };

  const faqs = [
    {
      q: 'How does RailFleet eliminate race conditions and double-bookings during Tatkal rushes?',
      a: 'RailFleet implements an atomic SQLite BEGIN EXCLUSIVE transaction isolation protocol. When thousands of concurrent requests attempt to reserve the same berth, transactions are serialized at the database lock level. Exactly one thread acquires write exclusivity, validates berth availability, and commits; subsequent conflicting threads detect the state change and automatically trigger a clean ROLLBACK with zero database corruption.'
    },
    {
      q: 'What are the official Tatkal booking timings and quota rules?',
      a: 'Tatkal booking opens at 10:00 AM for AC classes (1A, 2A, 3A, CC, EC) and at 11:00 AM for Non-AC classes (SL). Confirmed Tatkal tickets have zero cancellation refund, while waitlisted Tatkal tickets are refunded automatically upon chart preparation.'
    },
    {
      q: 'What is the maximum allowed baggage weight per passenger?',
      a: 'First Class AC (1A) passengers are entitled to 70 kg free allowance. AC 2-Tier (2A) allows 50 kg, AC 3-Tier and Chair Car allow 40 kg, and Sleeper Class allows 35 kg per traveler.'
    },
    {
      q: 'Can I track my train with live GPS and calculate intermediate delays?',
      a: 'Yes! RailFleet features an embedded Live Satellite GPS Radar connected with Indian Railways Real-Time Train Information System (RTIS). You can inspect live speed, current waypoint, upcoming halts, and trackside weather in real-time.'
    }
  ];

  return (
    <div className="space-y-20">
      
      {/* Handcrafted Breadcrumbs Trail */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
        <span className="text-amber-400 font-bold">Bharat Railways</span>
        <span>/</span>
        <span>National Reservation System</span>
        <span>/</span>
        <span className="text-slate-200">High-Speed Corridor Grid & Live Satellite Tracking</span>
      </div>

      {/* Solidroad / Framer Style Scenic Hero Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 shadow-2xl">
        
        {/* Full-bleed Winding Mountain Rail Landscape Photography Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/winding_mountain_rail_hero_1791009627778.jpg"
            alt="Vibrant lush green mountain landscape with winding golden railway tracks"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-85 scale-100 transition-transform duration-1000"
          />
          {/* Subtle gradient vignettes for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/80"></div>
        </div>

        {/* Content Container (Center aligned Solidroad style) */}
        <div className="relative z-10 p-6 sm:p-12 lg:p-16 flex flex-col items-center text-center space-y-8 min-h-[580px] justify-center">
          
          <div className="max-w-3xl space-y-4 pt-4">
            
            {/* Center Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] drop-shadow-md">
              Train and travel across India's <br className="hidden sm:inline" />
              high-speed corridors
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow">
              Make every customer journey faster, safer, and more consistent with the national reservation platform for travelers and fleet agents.
            </p>
          </div>

          {/* Floating Pill Search Bar (Exact Solidroad capsule aesthetic - FULLY WORKING SEARCH BAR) */}
          <div className="w-full max-w-xl relative">
            <form
              onSubmit={handleHeroSearchSubmit}
              className="p-1.5 sm:p-2 rounded-full bg-white/95 backdrop-blur-xl shadow-2xl border border-white/40 flex items-center justify-between gap-2 transition-all focus-within:ring-4 focus-within:ring-rose-600/30"
            >
              <div className="flex items-center gap-2 pl-3 sm:pl-4 flex-1">
                <Search className="w-4 h-4 text-rose-600 shrink-0" />
                <input
                  type="text"
                  value={heroSearchQuery}
                  onChange={(e) => {
                    setHeroSearchQuery(e.target.value);
                    setIsHeroDropdownOpen(true);
                  }}
                  onFocus={() => setIsHeroDropdownOpen(true)}
                  placeholder="Type city, station, or train (e.g. Mumbai, Vande Bharat, NDLS to HWH)..."
                  className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-bold placeholder:text-slate-400 focus:outline-none"
                />
                {heroSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeroSearchQuery('');
                      setIsHeroDropdownOpen(false);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-rose-600 hover:bg-amber-400 text-white hover:text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span>Find trains</span>
                <span className="text-[10px]">➔</span>
              </button>
            </form>

            {/* Live Autocomplete Search Dropdown */}
            {isHeroDropdownOpen && heroSearchQuery.trim().length > 0 && (
              <div 
                className="absolute left-0 right-0 top-full mt-3 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border-2 border-slate-800 shadow-2xl p-4 text-left z-50 space-y-3 animate-in fade-in duration-150 max-h-96 overflow-y-auto"
                onMouseDown={(e) => e.preventDefault()}
              >
                {/* Stations */}
                {matchedStations.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1.5">
                      Matching Stations & Terminals
                    </span>
                    <div className="space-y-1">
                      {matchedStations.map((st) => (
                        <div
                          key={st.code}
                          onClick={() => {
                            if (st.code === source) {
                              setHeroSearchQuery(`${st.city} (${st.code})`);
                            } else {
                              setDestination(st.code);
                              setHeroSearchQuery(`${st.city} (${st.code})`);
                              onSearch(source, st.code, journeyDate, coachClass);
                            }
                            setIsHeroDropdownOpen(false);
                          }}
                          className="p-2.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 cursor-pointer flex items-center justify-between text-xs text-white transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <div>
                              <span className="font-bold">{st.name}</span>
                              <span className="text-slate-400 text-[11px] block">{st.city}, {st.state}</span>
                            </div>
                          </div>
                          <span className="font-mono text-amber-400 font-bold bg-rose-600/10 px-2 py-0.5 rounded border border-rose-600/20">
                            {st.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trains */}
                {matchedTrains.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest block mb-1.5 pt-2 border-t border-slate-900">
                      Matching High-Speed Trains
                    </span>
                    <div className="space-y-1">
                      {matchedTrains.map((tr) => (
                        <div
                          key={tr.trainId}
                          onClick={() => {
                            setSource(tr.sourceCode);
                            setDestination(tr.destinationCode);
                            setHeroSearchQuery(tr.trainName);
                            setIsHeroDropdownOpen(false);
                            onDirectSelectTrain(tr);
                          }}
                          className="p-2.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 cursor-pointer flex items-center justify-between text-xs text-white transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <TrainIcon className="w-3.5 h-3.5 text-sky-400" />
                            <div>
                              <span className="font-bold">{tr.trainName}</span>
                              <span className="text-slate-400 text-[11px] block">
                                #{tr.trainNumber} • {tr.sourceCode} ➔ {tr.destinationCode} ({tr.departureTime})
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] text-emerald-400 font-bold font-mono">
                            Book Berth ➔
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {matchedStations.length === 0 && matchedTrains.length === 0 && (
                  <div className="p-3 text-center text-xs text-slate-400 font-mono">
                    No stations or trains matched "{heroSearchQuery}". Press Enter to search corridor anyway.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Partner & Consortium Monochromatic Logos (Solidroad style footer bar) */}
          <div className="w-full pt-12 pb-2">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-white/70 text-xs sm:text-sm font-black tracking-widest uppercase">
              <span className="hover:text-white transition-colors">CRIS.GOV</span>
              <span className="hover:text-white transition-colors">IRCTC</span>
              <span className="hover:text-white transition-colors">MINISTRY OF RAILWAYS</span>
              <span className="hover:text-white transition-colors">KAVACH ATP</span>
              <span className="hover:text-white transition-colors">MAKE IN INDIA</span>
              <span className="hover:text-white transition-colors">VANDE BHARAT</span>
            </div>
          </div>

        </div>
      </section>

      {/* Persistent 'My Last Trip' Card from Dashboard History State */}
      {latestBooking && (
        <section className="space-y-4">
          <MyLastTripCard
            latestBooking={latestBooking}
            stations={stations}
            trains={trains}
            onViewTicket={onViewTicket || (() => {})}
            onTrackTrain={onTrackTrain}
            onNavigateToDashboard={onViewMyBookings}
          />
        </section>
      )}

      {/* Deep Route Booking Console (Station Pickers, Class & Quotas) */}
      <section className="bg-slate-950/90 backdrop-blur-2xl border-2 border-slate-800/90 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        
        {/* Top Quota Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Booking Quota:</span>
            {[
              { id: 'GENERAL', label: 'General' },
              { id: 'TATKAL', label: 'Tatkal (Instant)' },
              { id: 'LADIES', label: 'Ladies Quota' },
              { id: 'SENIOR', label: 'Senior Citizen' }
            ].map(q => (
              <button
                key={q.id}
                type="button"
                onClick={() => setQuota(q.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  quota === q.id
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
            <span className="font-bold">CRIS Secure Server Cluster Online</span>
          </div>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Source Junction */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>From Junction</span>
              </label>
              <div className="relative">
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-white font-bold text-sm focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 cursor-pointer appearance-none"
                >
                  {stations.map(st => (
                    <option key={st.code} value={st.code} disabled={st.code === destination}>
                      {st.name} ({st.code}) • PF 1-{st.platformCount}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-4.5 text-slate-500 text-xs pointer-events-none">▼</div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center pt-4 md:pt-0">
              <button
                type="button"
                onClick={handleSwapStations}
                className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 flex items-center justify-center transition-all hover:rotate-180 duration-300 shadow-md"
                title="Swap Station Direction"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Destination */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>To Destination</span>
              </label>
              <div className="relative">
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-white font-bold text-sm focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 cursor-pointer appearance-none"
                >
                  {stations.map(st => (
                    <option key={st.code} value={st.code} disabled={st.code === source}>
                      {st.name} ({st.code}) • PF 1-{st.platformCount}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-4.5 text-slate-500 text-xs pointer-events-none">▼</div>
              </div>
            </div>

            {/* Date */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Travel Date</span>
              </label>
              <input
                type="date"
                min={today}
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 text-white font-bold text-sm focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 cursor-pointer"
              />
            </div>

          </div>

          {/* Bottom Row Filters & Submit Button */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-4 border-t border-slate-800/80">
            <div className="sm:col-span-8 flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-2">Coach Tier:</span>
              {[
                { id: 'ALL', label: 'All Classes' },
                { id: 'EC', label: 'Executive Chair (EC)' },
                { id: 'CC', label: 'AC Chair (CC)' },
                { id: '2A', label: '2-Tier AC (2A)' },
                { id: '3A', label: '3-Tier AC (3A)' },
                { id: 'SL', label: 'Sleeper (SL)' }
              ].map(tier => (
                <button
                  type="button"
                  key={tier.id}
                  onClick={() => setCoachClass(tier.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    coachClass === tier.id
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 font-black'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            <div className="sm:col-span-4">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-amber-400 hover:to-rose-500 text-white hover:text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-2xl shadow-rose-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <span>Search Available Trains</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </form>
      </section>

      {/* Dedicated Sign In & Member Privileges Section */}
      <section className="space-y-4">
        <MemberPortalSection
          currentUser={currentUser}
          onOpenAuthModal={onOpenAuthModal}
          onLogout={onLogout}
          onViewMyBookings={onViewMyBookings}
        />
      </section>

      {/* Real-Time Station Weather & Journey Conditions Forecast */}
      <section className="space-y-4">
        <StationWeatherWidget
          sourceStation={
            stations.find(s => s.code === source) || {
              code: source,
              name: `${source} Junction`,
              city: source,
              state: 'India',
              platformCount: 10
            }
          }
          destStation={
            stations.find(s => s.code === destination) || {
              code: destination,
              name: `${destination} Terminal`,
              city: destination,
              state: 'India',
              platformCount: 10
            }
          }
          journeyDate={journeyDate}
        />
      </section>

      {/* Live Digital Station Departure Board (Split-Flap LED Board) */}
      <section className="space-y-4">
        <StationDepartureBoard
          trains={trains}
          onSelectTrain={onDirectSelectTrain}
          onTrackTrain={onTrackTrain}
        />
      </section>

      {/* Live PNR Status & Waitlist Predictor Widget */}
      <section className="space-y-4">
        <PnrStatusWidget />
      </section>

      {/* Moments on the Network — photo marquee */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
              Postcards from the network
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Moments on the Network</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:block">swipe ➔</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { src: "/src/assets/images/classic_fairy_queen_1791013004.jpg", label: "Fairy Queen • 1855" },
            { src: "/src/assets/images/hero_train_speed_1791007315199.jpg", label: "Full speed • 160 km/h" },
            { src: "/src/assets/images/royal_dining_car_1791008958052.jpg", label: "Royal dining cars" },
            { src: "/src/assets/images/classic_kalka_shimla_toy_1791013002.jpg", label: "Kalka–Shimla • 1903" },
            { src: "/src/assets/images/coastal_rail_bridge_1791008989586.jpg", label: "Konkan sea viaducts" },
            { src: "/src/assets/images/classic_darjeeling_steam_1791013001.jpg", label: "Darjeeling steam" },
            { src: "/src/assets/images/station_executive_lounge_1791008973049.jpg", label: "Executive lounges" }
          ].map((m, i) => (
            <div key={i} className="relative shrink-0 w-56 sm:w-64 h-40 sm:h-44 rounded-3xl overflow-hidden border border-slate-800 group">
              <img
                src={m.src}
                alt={m.label}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-2.5 left-3 text-xs font-bold text-white drop-shadow">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Embedded Live Train Tracking Map Radar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Real-Time Train Information System (RTIS)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Live National Train Tracking Map</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive satellite telemetry tracking Indian Railways high-speed corridors with live speed, route progression, and scheduled halts.
            </p>
          </div>

          <button
            onClick={onOpenLiveMapTab}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto shadow-sm"
          >
            <span>Open Dedicated Map Radar</span>
            <span>➔</span>
          </button>
        </div>

        <LiveTrainMap trains={trains} selectedTrainId={1} onSelectTrain={onTrackTrain} />
      </section>

      {/* Curated Scenic Rail Journeys & Luxury Fleet */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
            EXPLORE INCREDIBLE INDIA BY TRAIN
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Curated Scenic Rail Journeys & Fleet</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            From misty Himalayan vistas to aerodynamic bullet corridors, experience world-class comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Scenic Mountain Rail */}
          <div className="group rounded-[2.25rem] bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl hover:border-rose-600/70 hover:-translate-y-3 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between">
            <div className="relative h-64 overflow-hidden">
              <img
                src="/src/assets/images/scenic_mountain_rail_1791007927403.jpg"
                alt="Scenic mountain train traveling through lush emerald tea valley"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-mono font-bold text-amber-400 border border-rose-600/30">
                🏔️ Mountain Railway Corridor
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                Himalayan Panoramic Vista Express
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ascend through lush emerald green mountain valleys, tea estates, and colonial arched stone viaducts with glass-domed Vistadome carriages.
              </p>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800 font-bold">
                <span className="text-slate-400 font-mono">Fares from ₹1,420</span>
                <span className="text-amber-400 cursor-pointer flex items-center gap-1 group-hover:translate-x-1.5 transition-transform" onClick={() => onSelectQuickRoute('NDLS', 'HWH')}>
                  Explore Route <span>→</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Luxury First Class Private Sleeper Cabin */}
          <div className="group rounded-[2.25rem] bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl hover:border-rose-600/70 hover:-translate-y-3 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between">
            <div className="relative h-64 overflow-hidden">
              <img
                src="/src/assets/images/luxury_sleeper_cabin_1791007939769.jpg"
                alt="Ultra luxury first class sleeper coupe cabin with bed and window"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-mono font-bold text-sky-400 border border-sky-500/30">
                ⭐ First Class Private Coupe
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                Vande Bharat Sleeper & Rajdhani 1A
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ultra-quiet private en-suite cabins with hotel-grade plush mattresses, hot showers, personalized attendant call buttons, and ambient lighting.
              </p>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800 font-bold">
                <span className="text-slate-400 font-mono">Fares from ₹2,850</span>
                <span className="text-amber-400 cursor-pointer flex items-center gap-1 group-hover:translate-x-1.5 transition-transform" onClick={() => onSelectQuickRoute('NDLS', 'MMCT')}>
                  Explore Route <span>→</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Modern High-Speed Corridors */}
          <div className="group rounded-[2.25rem] bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl hover:border-rose-600/70 hover:-translate-y-3 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between">
            <div className="relative h-64 overflow-hidden">
              <img
                src="/src/assets/images/modern_rail_terminal_1791007356836.jpg"
                alt="Modern railway station platform terminal with express trains"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                🚆 160 km/h Bullet Corridors
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                High-Speed Intercity Expressways
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connecting New Delhi, Mumbai, Bengaluru, Chennai, and Ahmedabad with 100% electrified high-priority tracks and Kavach safety.
              </p>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800 font-bold">
                <span className="text-slate-400 font-mono">Fares from ₹980</span>
                <span className="text-amber-400 cursor-pointer flex items-center gap-1 group-hover:translate-x-1.5 transition-transform" onClick={() => onSelectQuickRoute('SBC', 'MAS')}>
                  Explore Route <span>→</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Discover India by Scenic Rail Gateways Showcase */}
      <section className="space-y-4">
        <ScenicGatewaysShowcase onSelectCorridor={onSelectQuickRoute} />
      </section>

      {/* Historic UNESCO Heritage Railways & Royal Expeditions */}
      <section className="space-y-4">
        <HeritageRailwaysSection onSelectCorridor={onSelectQuickRoute} />
      </section>

      {/* Interactive Fare Matrix & Free Baggage Allowance Simulator */}
      <section className="space-y-4">
        <FareAndBaggageCalculator />
      </section>

      {/* Station Facilities & Modern Concourse Amenities Guide */}
      <section className="space-y-4">
        <StationFacilitiesGuide />
      </section>

      {/* Kavach Anti-Collision Technology & Transaction Concurrency Architecture */}
      <section className="space-y-4">
        <KavachSafetyShowcase />
      </section>

      {/* Why Choose Bharat Railways (Trust & Engineering Specs) */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-widest block mb-1">
            ENGINEERING EXCELLENCE & PASSENGER COMMITMENT
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Why Millions Choose RailFleet</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">Zero Double-Booking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Serialized SQLite <code>BEGIN EXCLUSIVE</code> transaction locks eliminate concurrency collisions during Tatkal surges.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-600/20 flex items-center justify-center text-amber-400 font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">99.8% Punctuality Index</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time satellite GPS tracking with automatic signal prioritization across all high-speed corridors.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">Instant UPI Refunds</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated 85% cancellation refunds returned to your source account within 60 seconds of ticket cancellation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">FSSAI Gourmet Dining</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Piping hot regional delicacies and kulhad masala chai prepared in central railway base kitchens and delivered to your seat.
            </p>
          </div>
        </div>
      </section>

      {/* Traveler Testimonials & Reviews */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
              VERIFIED PASSENGER VOICES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">4.9 / 5 Rating from 2.4M Passengers</h2>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              {'★★★★★'}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "Booking Vande Bharat from Delhi to Howrah was effortlessly fast. The seat map let me pick window seats for my kids, and the live GPS tracking accurately told us when to prep for dinner."
            </p>
            <div className="pt-3 border-t border-slate-800 text-xs">
              <strong className="text-white block">Dr. Sunita Deshpande</strong>
              <span className="text-slate-500 text-[11px]">Traveler on #22436 Vande Bharat</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              {'★★★★★'}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "I had to cancel a trip due to a meeting shift. The instant cancellation computed an 85% refund and the money was back in my UPI account in under 2 minutes. Outstanding transparency."
            </p>
            <div className="pt-3 border-t border-slate-800 text-xs">
              <strong className="text-white block">Rohan Mehra</strong>
              <span className="text-slate-500 text-[11px]">Traveler on #12952 Mumbai Rajdhani</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              {'★★★★★'}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "The concurrency locking is genuine. We tested reserving the last seat on Tejas Express from two phones simultaneously, and it cleanly handled the collision without creating a double-booking mess."
            </p>
            <div className="pt-3 border-t border-slate-800 text-xs">
              <strong className="text-white block">Amitabh Mukherjee</strong>
              <span className="text-slate-500 text-[11px]">Traveler on #22119 Tejas Express</span>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
            HELP & KNOWLEDGE BASE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Comprehensive Tatkal & Premium Tatkal Booking Window Guide */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
              RESERVATION TIMINGS & QUOTA POLICY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Tatkal & Premium Tatkal Operating Windows
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Indian Railways opens Tatkal quota berths exactly one day prior to train origin departure date. Concurrency spikes exceed 30,000 requests/sec.
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-rose-600/10 border border-rose-600/30 text-amber-400 text-xs font-mono font-bold flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>NEXT TATKAL BELL: 10:00 AM IST</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AC Tatkal Window Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                10:00 AM IST DAILY
              </span>
              <span className="text-xs font-mono text-slate-400">1A, 2A, 3A, CC, EC</span>
            </div>
            <h3 className="text-lg font-black text-white">Air-Conditioned (AC) Classes</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Opening Minute Strategy:</strong> Pre-fill Passenger Master List before 09:58 AM IST.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Tatkal Charges:</strong> 30% of base fare subject to minimum ₹400 and maximum ₹500.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Premium Tatkal (PT):</strong> Dynamic dynamic pricing curve increases by 10% for every 10% seats booked.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Refund Policy:</strong> No refund is granted on confirmed Tatkal tickets upon cancellation.</span>
              </li>
            </ul>
          </div>

          {/* Non-AC Tatkal Window Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                11:00 AM IST DAILY
              </span>
              <span className="text-xs font-mono text-slate-400">Sleeper (SL) & Second Sitting (2S)</span>
            </div>
            <h3 className="text-lg font-black text-white">Non-Air Conditioned (SL / 2S) Classes</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Opening Minute Strategy:</strong> Quick UPI Intent payment selected for under-10-second authorization.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Tatkal Charges:</strong> 10% of base fare subject to minimum ₹100 and maximum ₹200.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Contingency Quota:</strong> Waitlist Tatkal (CKWL) automatically cancels with full refund if unconfirmed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Senior Citizen Quota:</strong> Automatically verified via Aadhaar age computation at booking.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Official Passenger Baggage Allowance & Restrictions Matrix */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
            STATUTORY TRAVEL GUIDELINES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Free Luggage Allowance & Carriage Limits
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Under Rule 106 of Indian Railways (Carriage of Passengers and Luggage) Rules 2026, the following limits are legally exempt from freight booking:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Class of Travel</th>
                <th className="py-3 px-4">Free Baggage Limit</th>
                <th className="py-3 px-4">Marginal Allowance</th>
                <th className="py-3 px-4">Max Permissible Weight</th>
                <th className="py-3 px-4">Excess Luggage Surcharge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-slate-300">
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">AC First Class (1A) / Executive Anubhuti</td>
                <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">70 KG</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">15 KG</td>
                <td className="py-3.5 px-4 font-mono text-slate-200">150 KG</td>
                <td className="py-3.5 px-4 text-emerald-400">1.5x Scale L-Rate</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">AC 2-Tier (2A) / First Class (FC)</td>
                <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">50 KG</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">10 KG</td>
                <td className="py-3.5 px-4 font-mono text-slate-200">100 KG</td>
                <td className="py-3.5 px-4 text-emerald-400">1.5x Scale L-Rate</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">AC 3-Tier (3A) / AC Chair Car (CC)</td>
                <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">40 KG</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">10 KG</td>
                <td className="py-3.5 px-4 font-mono text-slate-200">40 KG</td>
                <td className="py-3.5 px-4 text-amber-400">Parcel Van Booking Required</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">Sleeper Class (SL)</td>
                <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">40 KG</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">10 KG</td>
                <td className="py-3.5 px-4 font-mono text-slate-200">80 KG</td>
                <td className="py-3.5 px-4 text-emerald-400">Standard Scale L-Rate</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">Second Class (2S / General Unreserved)</td>
                <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">35 KG</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">10 KG</td>
                <td className="py-3.5 px-4 font-mono text-slate-200">70 KG</td>
                <td className="py-3.5 px-4 text-emerald-400">Standard Scale L-Rate</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300 space-y-1">
          <strong className="text-white block font-bold">Prohibited Hazardous Cargo:</strong>
          <span>Gas cylinders, acids, flammable chemicals, fireworks, and live battery corrosives are strictly punishable by up to 3 years imprisonment under Section 164 of the Railways Act.</span>
        </div>
      </section>

      {/* National Rail Infrastructure & Electrification Statistics */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block mb-1">
            NATIONAL NETWORK METRICS 2026
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Indian Railways Operational Footprint
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Network Track Length</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">108,706 <span className="text-xs text-amber-400 font-sans">KM</span></div>
            <div className="text-[11px] text-emerald-400 font-semibold">96.8% Broad Gauge Electrified</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Daily Passenger Volume</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">24.2 <span className="text-xs text-amber-400 font-sans">Million</span></div>
            <div className="text-[11px] text-slate-400">Across 7,325 Operational Stations</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Kavach TCAS Deployed</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">14,200 <span className="text-xs text-amber-400 font-sans">KM</span></div>
            <div className="text-[11px] text-sky-400 font-semibold">Automatic Anti-Collision Active</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Vande Bharat Corridors</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">102 <span className="text-xs text-amber-400 font-sans">Rakes</span></div>
            <div className="text-[11px] text-amber-400 font-semibold">160 km/h Semi-High Speed Service</div>
          </div>
        </div>
      </section>

      {/* Newsletter / Bulletin Subscription Strip */}
      <section className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-rose-600/10 via-rose-500/10 to-transparent border border-rose-600/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-black text-white">Subscribe to National Railway Alerts</h3>
          <p className="text-xs text-slate-400">
            Get instant alerts on Tatkal booking opening windows, new Vande Bharat route launches, and festive special trains.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
          <input
            type="email"
            required
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            placeholder="Enter your email address..."
            className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-xs w-full md:w-72 focus:outline-none focus:border-rose-600 font-medium"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-amber-400 text-white hover:text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Join</span>
          </button>
        </form>
      </section>

    </div>
  );
};
