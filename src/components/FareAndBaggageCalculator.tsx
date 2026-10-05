import React, { useState } from 'react';
import { Calculator, Luggage, IndianRupee, Info, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export const FareAndBaggageCalculator: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState<number>(750);
  const [selectedClass, setSelectedClass] = useState<'1A' | '2A' | '3A' | 'CC' | 'EC' | 'SL'>('CC');
  const [travelerCount, setTravelerCount] = useState<number>(1);
  const [baggageWeightKg, setBaggageWeightKg] = useState<number>(35);

  // Rate parameters per km for classes
  const ratePerKm: Record<string, number> = {
    '1A': 2.45,
    'EC': 2.10,
    '2A': 1.65,
    '3A': 1.15,
    'CC': 1.05,
    'SL': 0.48
  };

  const reservationFee: Record<string, number> = {
    '1A': 60,
    'EC': 40,
    '2A': 50,
    '3A': 40,
    'CC': 40,
    'SL': 20
  };

  const superfastCharge = 45;
  const isAcClass = selectedClass !== 'SL';

  // Base calculation
  const calculatedBaseFare = Math.round(distanceKm * ratePerKm[selectedClass]);
  const resFee = reservationFee[selectedClass];
  const devCess = 40;
  const subtotalBeforeGst = calculatedBaseFare + superfastCharge + resFee + devCess;
  const gstAmount = isAcClass ? Math.round(subtotalBeforeGst * 0.05) : 0;
  const singlePassengerFare = subtotalBeforeGst + gstAmount;
  const totalTripFare = singlePassengerFare * travelerCount;

  // Baggage rules
  const freeAllowanceKg: Record<string, number> = {
    '1A': 70,
    'EC': 40,
    '2A': 50,
    '3A': 40,
    'CC': 40,
    'SL': 35
  };

  const allowedLimit = freeAllowanceKg[selectedClass];
  const excessWeight = Math.max(0, baggageWeightKg - allowedLimit);
  const excessBaggageFee = excessWeight > 0 ? Math.round(excessWeight * 35) : 0;

  return (
    <div className="rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-600/20 flex items-center justify-center text-amber-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-600/20 text-amber-300 border border-rose-600/30 uppercase tracking-wider">
                INTERACTIVE ESTIMATOR
              </span>
              <span className="text-xs text-slate-400 font-mono">Official PRS Fare Slabs</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Fare Matrix & Free Luggage Allowance Calculator
            </h2>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Updated with 2026 Railway Board Rationalized Tariffs
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Fare Calculator (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-amber-400" />
            <span>Interactive Corridor Fare Simulator</span>
          </h3>

          {/* Distance Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-400 uppercase tracking-wider">Corridor Travel Distance:</span>
              <span className="text-amber-400 font-mono text-base">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min={50}
              max={2500}
              step={25}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-rose-600 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Short Intercity (50 km)</span>
              <span>Express (750 km)</span>
              <span>Cross-Country (2,500 km)</span>
            </div>
          </div>

          {/* Class Selector Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Coach Accommodation Class:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: '1A', label: '1A (First AC)' },
                { id: 'EC', label: 'EC (Exec Chair)' },
                { id: '2A', label: '2A (2-Tier)' },
                { id: '3A', label: '3A (3-Tier)' },
                { id: 'CC', label: 'CC (AC Chair)' },
                { id: 'SL', label: 'SL (Sleeper)' }
              ].map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedClass(c.id as any)}
                  className={`p-2.5 rounded-xl text-center text-xs font-black border transition-all ${
                    selectedClass === c.id
                      ? 'bg-rose-600 text-white border-amber-400 shadow-md shadow-rose-600/20'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {c.id}
                </button>
              ))}
            </div>
          </div>

          {/* Itemized Fare Breakdown Table */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Distance Base Tariff ({distanceKm} km @ ₹{ratePerKm[selectedClass]}/km):</span>
              <span className="font-bold text-white">₹{calculatedBaseFare}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Superfast Speed Surcharge:</span>
              <span>₹{superfastCharge}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Electronic Reservation Fee:</span>
              <span>₹{resFee}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Railway Development & Safety Cess:</span>
              <span>₹{devCess}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GST (5% for Air-Conditioned Travel):</span>
              <span className={gstAmount > 0 ? 'text-amber-400' : 'text-slate-500'}>
                {gstAmount > 0 ? `₹${gstAmount}` : 'Exempt (Non-AC)'}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
              <span className="text-white">Estimated Ticket Fare:</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                ₹{singlePassengerFare}
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Baggage Allowance & Excess Calculator (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Luggage className="w-5 h-5 text-sky-400" />
            <span>Luggage Rules & Free Allowance</span>
          </h3>

          <div className="space-y-4">
            
            {/* Free Allowance Badge for Selected Class */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Class {selectedClass} Allowance</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{allowedLimit} KG FREE</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Baggage Weight Simulator */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-wider">Your Luggage Weight:</span>
                <span className="text-sky-400 font-mono text-base">{baggageWeightKg} kg</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={baggageWeightKg}
                onChange={(e) => setBaggageWeightKg(Number(e.target.value))}
                className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Excess Status */}
            {excessWeight > 0 ? (
              <div className="p-4 rounded-2xl bg-rose-600/10 border border-rose-600/30 text-xs space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Excess Baggage: {excessWeight} kg
                </div>
                <p className="text-slate-300">
                  Excess baggage booking fee at parcel office: <strong className="text-white font-mono">₹{excessBaggageFee}</strong> (₹35/kg rate).
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Within Permissible Free Allowance
                </div>
                <p className="text-slate-300">
                  Zero surcharge. You can carry your suitcases directly inside coach berths.
                </p>
              </div>
            )}

            {/* Dimensional Guidelines */}
            <div className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-900">
              <div className="font-bold text-slate-300 uppercase tracking-wider">Trunk / Suitcase Dimensions:</div>
              <p>Maximum dimensions: 100 cm (L) × 60 cm (W) × 25 cm (H) to fit beneath lower berths safely.</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
