import React, { useState } from 'react';
import { ArrowLeft, Shield, Lock, CreditCard, CheckCircle2, AlertTriangle, UserCheck, Sparkles, Coffee, ShieldCheck, Tag, HeartHandshake, Check } from 'lucide-react';
import { Train, Coach, Seat, Passenger } from '../types/railway';
import { railwayService } from '../services/railwayService';

interface CheckoutPageProps {
  train: Train;
  coach: Coach;
  selectedSeats: Seat[];
  travelDate: string;
  onBookingSuccess: (pnr: string) => void;
  onBack: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  train,
  coach,
  selectedSeats,
  travelDate,
  onBookingSuccess,
  onBack
}) => {
  const [contactName, setContactName] = useState('Rahul Sharma');
  const [contactEmail, setContactEmail] = useState('rahul.sharma@domain.edu');
  const [contactPhone, setContactPhone] = useState('9876543210');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CARD' | 'NETBANK'>('UPI');

  // Value added options
  const [optInsurance, setOptInsurance] = useState(true);
  const [optAutoUpgrade, setOptAutoUpgrade] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<'VEG' | 'NON_VEG' | 'JAIN' | 'NONE'>('VEG');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const [passengers, setPassengers] = useState<Passenger[]>(
    selectedSeats.map((seat, idx) => ({
      fullName: idx === 0 ? 'Rahul Sharma' : `Passenger ${idx + 1}`,
      age: idx === 0 ? 28 : 25,
      gender: idx % 2 === 0 ? 'Male' : 'Female',
      berthPreference: seat.berthType,
      seatId: seat.seatId,
      seatNumber: seat.seatNumber,
      berthType: seat.berthType
    }))
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const baseFareTotal = selectedSeats.length * coach.baseFare;
  const devCess = 40;
  const insuranceFee = optInsurance ? Math.round(selectedSeats.length * 0.45 * 100) / 100 : 0;
  const mealCost = selectedMeal !== 'NONE' ? selectedSeats.length * 160 : 0;
  const grossTotal = baseFareTotal + devCess + insuranceFee + mealCost;
  const finalPayable = Math.max(0, Math.round(grossTotal - promoDiscount));

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'RAILFEST10') {
      const disc = Math.round(baseFareTotal * 0.10);
      setPromoDiscount(disc);
      alert(`Success! 10% promotional discount (₹${disc}) applied.`);
    } else if (promoCode.trim().toUpperCase() === 'UPI50') {
      setPromoDiscount(50);
      alert('Success! Flat ₹50 promotional discount applied.');
    } else {
      alert('Invalid promo code. Try "RAILFEST10" or "UPI50"');
    }
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    setPassengers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleCommitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const payload = {
        trainId: train.trainId,
        coachId: coach.coachId,
        journeyDate: travelDate,
        contactName,
        contactEmail,
        contactPhone,
        passengers: passengers.map(p => ({
          fullName: p.fullName,
          age: Number(p.age),
          gender: p.gender,
          berthPreference: p.berthPreference,
          seatId: p.seatId
        }))
      };

      const result = await railwayService.executeAtomicBooking(payload);

      if (result.success && result.pnr) {
        onBookingSuccess(result.pnr);
      } else {
        setErrorMessage(result.error || 'Booking transaction failed due to concurrency collision.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Fatal transaction exception');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Handcrafted Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
        <button onClick={onBack} className="text-amber-400 hover:underline">Carriage Layout</button>
        <span>/</span>
        <span className="text-slate-200">Passenger Manifest & Cryptographic Checkout</span>
      </div>

      {/* Scenic Photography Header with Animated Reservation Lock */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/kashmir_snow_train_1791009001352.jpg"
            alt="Scenic high-speed train corridor"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                Step 4 of 5: Checkout Gateway
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>BERTH HOLD: 09:54</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Passenger Manifest & Atomic Transaction Commitment
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {train.trainName} (#{train.trainNumber}) • Coach {coach.coachCode} ({coach.coachType}) • Date: {travelDate}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3.5 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700 text-emerald-400 font-bold flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit TLS / BEGIN EXCLUSIVE Lock Active</span>
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border-2 border-rose-800/80 flex items-start gap-3.5 text-sm text-rose-300">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-base text-white">Transaction Aborted (Atomic Rollback)</div>
            <p className="text-xs mt-1 text-rose-300 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleCommitBooking}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Form: Passenger Manifest, Catering & Preferences (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Primary Contact Details */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <span>Primary Lead Contact (Ticket PNR & SMS Delivery)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Mobile Phone (10-Digit)
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Passenger Manifest Lines */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Traveler Identification Manifest ({passengers.length} Berth Allocations)</span>
              </h2>

              <div className="space-y-4">
                {passengers.map((p, idx) => (
                  <div
                    key={p.seatId}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-amber-400">Passenger #{idx + 1}</span>
                      <span className="font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800">
                        Allocated: Seat #{p.seatNumber} ({p.berthType})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5 space-y-1">
                        <label className="text-[11px] text-slate-400 uppercase font-semibold">Traveler Legal Name (as per Govt ID)</label>
                        <input
                          type="text"
                          required
                          value={p.fullName}
                          onChange={(e) => handlePassengerChange(idx, 'fullName', e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] text-slate-400 uppercase font-semibold">Age (Years)</label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={120}
                          value={p.age}
                          onChange={(e) => handlePassengerChange(idx, 'age', parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[11px] text-slate-400 uppercase font-semibold">Gender</label>
                        <select
                          value={p.gender}
                          onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gourmet E-Catering Section with Picture */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-400" />
                  <span>IRCTC Gourmet E-Catering On-Board Meals</span>
                </h2>
                <span className="text-xs font-mono text-amber-400 font-bold">₹160 / meal</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 rounded-2xl overflow-hidden border border-slate-800 h-36">
                  <img
                    src="/src/assets/images/dining_catering_service_1791007344592.jpg"
                    alt="Hot fresh railway catering food served on train"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="md:col-span-8 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Prepared in FSSAI-certified central railway base kitchens and delivered piping hot to your seat at scheduled meal halts.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'VEG', label: 'Standard Veg Thali' },
                      { id: 'NON_VEG', label: 'Chicken Biryani / Curry' },
                      { id: 'JAIN', label: 'Pure Jain Meal (No Onion/Garlic)' },
                      { id: 'NONE', label: 'No Meal Opted' }
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMeal(m.id as any)}
                        className={`p-2.5 rounded-xl text-[11px] font-bold text-center border transition-all ${
                          selectedMeal === m.id
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Insurance & Auto-Upgrade Checkboxes */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-400" />
                <span>Value Added Preferences</span>
              </h2>

              <div className="space-y-3 text-xs">
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optInsurance}
                    onChange={(e) => setOptInsurance(e.target.checked)}
                    className="mt-0.5 accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <strong className="text-white">Opt-in for Railway Travel Insurance (₹0.45 / person)</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Provides accidental hospitalization cover up to ₹10 Lakhs underwritten by National Insurance.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optAutoUpgrade}
                    onChange={(e) => setOptAutoUpgrade(e.target.checked)}
                    className="mt-0.5 accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <strong className="text-white">Consider for Free Automatic Class Upgradation</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      If higher tier berths (EC / 1A) remain vacant at chart finalization, get upgraded at zero extra cost.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-400" />
                <span>Instant Payment Settlement (Simulation)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'Instant UPI Auto-Debit', desc: 'GPay, PhonePe, Paytm, BHIM' },
                  { id: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                  { id: 'NETBANK', label: 'NetBanking Gateway', desc: 'State Bank, HDFC, ICICI' }
                ].map(mode => (
                  <div
                    key={mode.id}
                    onClick={() => setPaymentMode(mode.id as any)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMode === mode.id
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{mode.label}</span>
                      <input
                        type="radio"
                        checked={paymentMode === mode.id}
                        onChange={() => {}}
                        className="accent-amber-500"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400">{mode.desc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Itemized Financial Invoice & Promo Code (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24 space-y-6">
              
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-black text-white">Itemized Financial Invoice</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Curriculum Transaction Fare Spec
                </span>
              </div>

              {/* Promo Code Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-400" /> Apply Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. RAILFEST10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono uppercase focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
                  >
                    Apply
                  </button>
                </div>
                <span className="text-[10px] text-slate-500">Try "RAILFEST10" for 10% off</span>
              </div>

              {/* Calculations */}
              <div className="space-y-3 text-xs pt-2">
                <div className="flex justify-between text-slate-300">
                  <span>Base Fare ({selectedSeats.length} × ₹{coach.baseFare}):</span>
                  <span className="font-bold text-white font-mono">₹{baseFareTotal}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Development & Safety Cess:</span>
                  <span className="font-mono">₹{devCess}</span>
                </div>

                {optInsurance && (
                  <div className="flex justify-between text-slate-400">
                    <span>Travel Insurance:</span>
                    <span className="font-mono">₹{insuranceFee}</span>
                  </div>
                )}

                {mealCost > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>E-Catering Hot Meals ({selectedSeats.length} × ₹160):</span>
                    <span className="font-mono">₹{mealCost}</span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Promo Discount:</span>
                    <span className="font-mono">-₹{promoDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>GST & CRIS Electronic Taxes:</span>
                  <span className="text-emerald-400 font-semibold">Included</span>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                  <span className="text-white">Total Amount Due:</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    ₹{finalPayable}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Lock className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Acquiring SQLite BEGIN EXCLUSIVE Lock...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{finalPayable} & Commit PNR</span>
                  </>
                )}
              </button>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SQLite Exclusive Transaction Guarantee</span>
                </div>
                <p className="leading-relaxed">
                  The system commits your reservation using an isolated <code>BEGIN EXCLUSIVE</code> block. Even if 50 users click submit simultaneously, each transaction is serialized with zero race conditions.
                </p>
              </div>

            </div>
          </div>

        </div>
      </form>

      {/* Comprehensive Travel Insurance Policy Schedule */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block mb-1">
              OPTIONAL PASSENGER COVERAGE SCHEDULE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              National Railway Passenger Travel Insurance
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Underwritten by National Insurance Company Ltd for ₹0.45 per traveler. Covers accidental derailment, collision, and emergency medical transportation:
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            POLICY #NIC-IRCTC-2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Death Indemnity</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">₹10,00,000</div>
            <div className="text-xs text-slate-400">100% Capital Sum to Nominee</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Permanent Total Disability</div>
            <div className="text-2xl font-black text-sky-400 font-mono">₹10,00,000</div>
            <div className="text-xs text-slate-400">Direct Financial Compensation</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Hospitalization Care</div>
            <div className="text-2xl font-black text-amber-400 font-mono">₹2,00,000</div>
            <div className="text-xs text-slate-400">Cashless Rail Network Hospitalization</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Mortal Remains Transport</div>
            <div className="text-2xl font-black text-rose-400 font-mono">₹10,000</div>
            <div className="text-xs text-slate-400">Fixed Transit Allowance</div>
          </div>
        </div>
      </section>

      {/* Official Automated Cancellation & Refund Deduction Matrix */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
            PRS CANCELLATION CHARTER
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Clerkage Deductions & Refund Timetable
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Computerized refund computation runs automatically upon cancellation based on hours prior to scheduled station departure:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Cancellation Timeframe</th>
                <th className="py-3 px-4">Flat Clerkage / Deduction Rate</th>
                <th className="py-3 px-4">Net Refund Yield</th>
                <th className="py-3 px-4">Mode of Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-slate-300">
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">&gt; 48 Hours Before Scheduled Departure</td>
                <td className="py-3.5 px-4 font-mono text-amber-400">Flat ₹240 (1A/EC), ₹200 (2A), ₹180 (3A), ₹120 (SL)</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">~85% to 92% Base Fare</td>
                <td className="py-3.5 px-4 text-slate-300">Instant UPI / Original Bank Account</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">Between 48 Hours and 12 Hours</td>
                <td className="py-3.5 px-4 font-mono text-amber-400">25% of Base Fare</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">75% Net Refund</td>
                <td className="py-3.5 px-4 text-slate-300">Within 15 Minutes</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">Between 12 Hours and 4 Hours (Before Chart)</td>
                <td className="py-3.5 px-4 font-mono text-rose-400">50% of Base Fare</td>
                <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">50% Net Refund</td>
                <td className="py-3.5 px-4 text-slate-300">Within 15 Minutes</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">&lt; 4 Hours / After Chart Preparation</td>
                <td className="py-3.5 px-4 font-mono text-rose-400 font-bold">100% Forfeiture (Unless TDR Filed)</td>
                <td className="py-3.5 px-4 font-mono text-rose-400 font-bold">₹0 (TDR Review Pending)</td>
                <td className="py-3.5 px-4 text-slate-400">Online TDR Investigation Required</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Legal & Anti-Scalping Advisory under Section 143 */}
      <section className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs text-slate-400">
        <h4 className="font-bold text-white text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Statutory Warning Against Unauthorized Ticket Scalping</span>
        </h4>
        <p className="leading-relaxed">
          Under Section 143 of the Railways Act 1989, procuring or transferring railway tickets through automated scripts, unauthorized agencies, or fraudulent bots is a cognizable offense punishable with imprisonment for up to 3 years, a fine of up to ₹10,000, or both. RailFleet PRS employs behavioral biometric detection and cryptographic IP rate-limiting to protect public inventory.
        </p>
      </section>

    </div>
  );
};
