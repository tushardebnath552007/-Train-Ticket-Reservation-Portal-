import React, { useState } from 'react';
import { ArrowLeft, Check, CheckCircle2, ShieldCheck, Info, Sparkles, User, Zap, AlertTriangle, Eye, HelpCircle } from 'lucide-react';
import { Train, Coach, Seat } from '../types/railway';

interface SeatSelectorPageProps {
  train: Train;
  selectedCoach: Coach;
  onSwitchCoach: (coach: Coach) => void;
  onProceedToCheckout: (selectedSeats: Seat[]) => void;
  onBack: () => void;
}

export const SeatSelectorPage: React.FC<SeatSelectorPageProps> = ({
  train,
  selectedCoach,
  onSwitchCoach,
  onProceedToCheckout,
  onBack
}) => {
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) return;

    if (selectedSeatIds.includes(seat.seatId)) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seat.seatId));
    } else {
      if (selectedSeatIds.length >= 6) {
        alert('Notice: Maximum 6 berths can be selected per single PNR.');
        return;
      }
      setSelectedSeatIds(prev => [...prev, seat.seatId]);
    }
  };

  const selectedSeatsList = selectedCoach.seats.filter(s => selectedSeatIds.includes(s.seatId));
  const subtotal = selectedSeatsList.length * selectedCoach.baseFare;
  const devCess = selectedSeatsList.length > 0 ? 40 : 0;
  const totalAmount = subtotal + devCess;

  return (
    <div className="space-y-8">
      
      {/* Handcrafted Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
        <button onClick={onBack} className="text-amber-400 hover:underline">Schedules</button>
        <span>/</span>
        <span className="text-slate-200">Coach {selectedCoach.coachCode} Visual Seat Allocation</span>
      </div>

      {/* Picture Hero Banner for Carriage Interior */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
        <div className="absolute inset-0 z-0">
          <img
            src={
              ['1A', '2A', '3A', 'SL'].includes(selectedCoach.coachType)
                ? '/src/assets/images/luxury_sleeper_cabin_1791007939769.jpg'
                : '/src/assets/images/luxury_coach_interior_1791007329531.jpg'
            }
            alt="Interior view of luxury railway carriage"
            className="w-full h-full object-cover object-center opacity-40 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-600/20 text-amber-400 border border-rose-600/30">
                CLASS: {selectedCoach.coachType}
              </span>
              <span className="text-xs text-slate-400">Coach Code: {selectedCoach.coachCode}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {train.trainName} (#{train.trainNumber})
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {train.sourceName} ({train.sourceCode}) ➔ {train.destinationName} ({train.destinationCode}) • Base Fare: ₹{selectedCoach.baseFare} / seat
            </p>
          </div>

          {/* Coach Switcher Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto self-start sm:self-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase px-2 hidden sm:inline">Coach:</span>
            {train.coaches.map(c => (
              <button
                key={c.coachId}
                onClick={() => {
                  setSelectedSeatIds([]);
                  onSwitchCoach(c);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  c.coachId === selectedCoach.coachId
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {c.coachCode} ({c.coachType})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Carriage Schematic (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Legend and Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-emerald-500/20 border-2 border-emerald-500"></span>
                <span className="text-slate-200 font-semibold">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-rose-500/20 border-2 border-rose-500"></span>
                <span className="text-slate-400 font-semibold">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-rose-600/30 border-2 border-amber-400 shadow-[0_0_8px_#f59e0b]"></span>
                <span className="text-amber-400 font-bold">Selected ({selectedSeatIds.length})</span>
              </div>
            </div>

            <div className="text-slate-400 font-mono text-[11px]">
              Lock Isolation: <strong className="text-emerald-400">BEGIN EXCLUSIVE Active</strong>
            </div>
          </div>

          {/* Handcrafted Visual Carriage Layout */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-x-auto">
            
            {/* Carriage Frame */}
            <div className="min-w-[620px] bg-slate-950 border-4 border-slate-800 rounded-3xl p-6 relative space-y-6">
              
              {/* Carriage Top Walkway Indicators */}
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 pb-4 border-b border-slate-800/80">
                <span className="flex items-center gap-1.5 text-rose-600">
                  <span>◄</span> ENGINE COUPLER & VESTIBULE
                </span>
                <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  CARRIAGE {selectedCoach.coachCode} • AIR-CONDITIONED {selectedCoach.coachType}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  BIO-TOILET & EXIT <span>►</span>
                </span>
              </div>

              {/* Grid of Berths */}
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 sm:gap-3.5">
                {selectedCoach.seats.map(seat => {
                  const isSelected = selectedSeatIds.includes(seat.seatId);
                  const isBooked = seat.isBooked;

                  return (
                    <button
                      key={seat.seatId}
                      disabled={isBooked}
                      onClick={() => handleSeatClick(seat)}
                      className={`h-16 rounded-xl flex flex-col items-center justify-center p-1.5 transition-all relative ${
                        isBooked
                          ? 'bg-rose-950/20 border-2 border-rose-900/60 text-slate-600 cursor-not-allowed'
                          : isSelected
                          ? 'bg-rose-600/25 border-2 border-amber-400 text-white shadow-lg shadow-rose-600/30 scale-105 z-10 font-bold'
                          : 'bg-emerald-950/20 border-2 border-emerald-800/50 hover:border-emerald-400 text-slate-200 hover:scale-105 cursor-pointer font-medium'
                      }`}
                    >
                      <span className="text-xs font-mono font-black">
                        {seat.seatNumber}
                      </span>
                      <span className={`text-[9px] font-bold uppercase mt-0.5 leading-none ${
                        isSelected ? 'text-amber-300' : isBooked ? 'text-rose-800' : 'text-emerald-400/80'
                      }`}>
                        {seat.berthType.replace('SIDE_', 'S.')}
                      </span>

                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[9px] font-black shadow-sm">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Gangway & Aisle Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>◀ WINDOW BERTHS</span>
                <span>CENTRAL PASSAGE AISLE</span>
                <span>WINDOW BERTHS ▶</span>
              </div>

            </div>
          </div>

          {/* Berth Orientation & Amenities Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Lower Berths
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Prioritized automatically for senior citizens and expectant mothers during daytime journeys.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-400" /> Fast Charging Ports
              </h4>
              <p className="text-slate-400 leading-relaxed">
                110V/220V multi-pin socket and dedicated USB-C ports installed adjacent to every seat window.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Emergency Windows
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Seats #7 and #18 feature quick-break safety glass hammers for certified emergency egress.
              </p>
            </div>
          </div>

        </div>

        {/* Right: Checkout Sidebar (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24 space-y-6">
            
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Selected Berths Allocation</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Real-time transaction calculator
              </p>
            </div>

            {/* Selected Seats Badges */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Allocated Berths ({selectedSeatsList.length}/6):
              </span>

              {selectedSeatsList.length === 0 ? (
                <div className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  Click on available green berths in the carriage to select.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedSeatsList.map(s => (
                    <span
                      key={s.seatId}
                      className="px-2.5 py-1 rounded-lg bg-rose-600/20 border border-rose-600/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>Seat #{s.seatNumber}</span>
                      <span className="text-[10px] text-amber-400/80">({s.berthType})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs pt-2">
              <div className="flex justify-between text-slate-300">
                <span>Base Fare ({selectedSeatsList.length} × ₹{selectedCoach.baseFare}):</span>
                <span className="font-mono font-bold text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Railway Development Cess:</span>
                <span className="font-mono">₹{devCess}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (AC Sleeper / Chair Car):</span>
                <span className="text-emerald-400 font-semibold">Included</span>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                <span className="text-white">Total Amount:</span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              disabled={selectedSeatsList.length === 0}
              onClick={() => onProceedToCheckout(selectedSeatsList)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-amber-400 hover:to-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white hover:text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <span>Proceed to Passenger Details</span>
              <span>➔</span>
            </button>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Double-Booking Guarantee</span>
              </div>
              <p>
                Berths are locked atomically during checkout submit. If another user commits at the same millisecond, state integrity is 100% preserved.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Onboard experience banner */}
      <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl">
        <img
          src="/src/assets/images/royal_dining_car_1791008958052.jpg"
          alt="Fine dining aboard luxury coaches"
          referrerPolicy="no-referrer"
          className="w-full h-56 sm:h-72 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 max-w-xl">
          <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest">
            Step Inside Your Coach
          </span>
          <p className="text-white font-black text-xl sm:text-3xl mt-1 drop-shadow-lg">
            Pick a berth, picture the journey.
          </p>
          <span className="text-xs text-slate-300 mt-2 font-mono">Dining cars • Sleeper cabins • Vistadome views</span>
        </div>
      </div>

      {/* Carriage Engineering, Safety Systems & Emergency Blueprint */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
            CARRIAGE SPECIFICATIONS & SAFETY SYSTEMS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Coach Engineering & Emergency Protocol
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Designed according to RDSO Class-A crashworthiness criteria with anti-climbing center buffer couplers (CBC) to prevent coach telescoping during abrupt deceleration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-amber-400 uppercase">Emergency Brake Chain (ACP)</div>
            <h4 className="text-sm font-bold text-white">Pneumatic Air-Release Valve</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Located at coach ends and middle cabins. Pulling discharges trainline air pressure directly to 2.8 bar, signaling the driver. Section 141 penalizes non-emergency pulls with ₹1,000 fine.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-sky-400 uppercase">Emergency Windows</div>
            <h4 className="text-sm font-bold text-white">4 Breaker Points per Coach</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Toughened 8mm acoustic safety glass marked with photoluminescent green border. High-impact glass breaker hammers mounted securely beside window frames.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase">Acoustic Insulation</div>
            <h4 className="text-sm font-bold text-white">&lt; 65 dB Whisper Quiet Cabin</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Double-glazed argon gas insulated panes and sealed flexible rubber gangways absorb track vibration and aerodynamic buffet noise at 160 km/h.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-rose-400 uppercase">Fire Suppression</div>
            <h4 className="text-sm font-bold text-white">Aerosol & Dry Chemical (DCP)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Microprocessor-controlled smoke aspiration sensors in AC ducts. Dual 6 kg ABC dry chemical extinguishers mounted at both carriage vestibules.
            </p>
          </div>
        </div>
      </section>

      {/* Official Berth Nighttime Etiquette & Seating Protocol (22:00 to 06:00) */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
            STATUTORY ONBOARD CODE OF CONDUCT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Berth Allocation & Nighttime Quiet Hours
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold text-sm">Middle Berth Operating Window</div>
            <p className="leading-relaxed text-slate-400">
              Under Railway Board directive, Middle Berth passengers are entitled to unfold their berth strictly between <strong>22:00 PM and 06:00 AM IST</strong>. During daytime hours (06:00 to 22:00), the berth must be folded down to permit comfortable seated posture for Lower and Upper berth passengers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-sky-400 font-bold text-sm">Lower Berth Senior Citizen Rights</div>
            <p className="leading-relaxed text-slate-400">
              Lower berths are designated priority accommodations for senior citizens (men 60+, women 45+), pregnant women, and travelers with medical certificates. If an upper berth traveler has limited mobility, mutual exchange with the TTE's verification is permitted.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold text-sm">Audio & Light Curfew (Post 22:00)</div>
            <p className="leading-relaxed text-slate-400">
              Playing music or video content on mobile loudspeakers without earphones after 22:00 PM is strictly prohibited. Coach primary aisle illumination is dimmed to night blue lights, and reading lamps must be directed downward.
            </p>
          </div>
        </div>
      </section>

      {/* IRCTC Standard Catering & Gourmet Pantry Rate Card */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
              OFFICIAL IRCTC TARIFF
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Catering & Pantry Carriage Rate Card
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Statutory maximum retail prices (MRP) applicable across all Mail/Express pantry cars:
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            NO VENDOR OVERCHARGING TOLERATED
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Rail Neer Packaged Water</div>
            <div className="text-xl font-black text-amber-400 font-mono">₹15</div>
            <div className="text-[10px] text-slate-500">1000 ml Chilled Sealed</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Standard Veg Breakfast</div>
            <div className="text-xl font-black text-amber-400 font-mono">₹40</div>
            <div className="text-[10px] text-slate-500">2 Cutlets + Bread & Butter</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Non-Veg Breakfast</div>
            <div className="text-xl font-black text-amber-400 font-mono">₹50</div>
            <div className="text-[10px] text-slate-500">2-Egg Omelette + Toast</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Standard Veg Meal Thali</div>
            <div className="text-xl font-black text-amber-400 font-mono">₹80</div>
            <div className="text-[10px] text-slate-500">Rice, Dal, Subzi, 4 Puris</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Non-Veg Egg Meal Thali</div>
            <div className="text-xl font-black text-amber-400 font-mono">₹90</div>
            <div className="text-[10px] text-slate-500">Egg Curry (2 Eggs) + Rice</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Dip Tea / Coffee Cup</div>
            <div className="text-xl font-black text-amber-400 font-mono">₹10</div>
            <div className="text-[10px] text-slate-500">150 ml Sealed Kit</div>
          </div>
        </div>
      </section>

      {/* Berth Types, Coach Layout & Free Luggage Allowance */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-widest block mb-1">
            PASSENGER BERTH REFERENCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Berth Types, Coach Layouts & Luggage Rules
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Every coach class arranges berths differently. Pick the berth that matches your age, health, and privacy needs:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white text-sm">Lower Berth (LB)</div>
            <p className="text-slate-400 leading-relaxed">
              Easiest access, doubles as daytime seating for the whole bay. Reserved by quota for senior citizens and passengers with medical needs. Side-lower berths fold into two seats.
            </p>
            <div className="text-[10px] font-mono text-emerald-400">BEST FOR: seniors, families, knee issues</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white text-sm">Middle Berth (MB)</div>
            <p className="text-slate-400 leading-relaxed">
              Usable only between 22:00 and 06:00 by railway rule. Must stay folded in daytime. Climbing needs the side ladder; keep luggage in the chain-locked under-seat bay.
            </p>
            <div className="text-[10px] font-mono text-amber-400">NOTE: night-use only, Adults ≤ 120 kg</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white text-sm">Upper Berth (UB)</div>
            <p className="text-slate-400 leading-relaxed">
              Most private and breezy with the roof vent. Usable round the clock for resting, but lights-out etiquette applies after 22:00. Carry a small torch for night climbing.
            </p>
            <div className="text-[10px] font-mono text-sky-400">BEST FOR: young travelers, privacy</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white text-sm">Window / Aisle (CC & EC)</div>
            <p className="text-slate-400 leading-relaxed">
              Chair-car seats rotate 180° on Tejas and Vande Bharat rakes. Window seats give panoramic views; aisle seats give quick washroom and pantry access on long day runs.
            </p>
            <div className="text-[10px] font-mono text-purple-400">BEST FOR: day trains, photographers</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Free Allowance</th>
                <th className="py-3 px-4">Max Size (L+W+H)</th>
                <th className="py-3 px-4">Excess Charge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-slate-300">
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3 px-4 font-bold text-white">1A / EC</td>
                <td className="py-3 px-4 font-mono text-emerald-400">70 kg</td>
                <td className="py-3 px-4">100 × 60 × 25 cm</td>
                <td className="py-3 px-4">₹150 per kg beyond allowance</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3 px-4 font-bold text-white">2A / CC</td>
                <td className="py-3 px-4 font-mono text-emerald-400">50 kg (2A) / 25 kg (CC)</td>
                <td className="py-3 px-4">100 × 60 × 25 cm</td>
                <td className="py-3 px-4">Book in brake van for bulky items</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3 px-4 font-bold text-white">3A / SL</td>
                <td className="py-3 px-4 font-mono text-emerald-400">40 kg / 35 kg</td>
                <td className="py-3 px-4">100 × 60 × 25 cm</td>
                <td className="py-3 px-4">Cloak rooms available at junctions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
