import React, { useState } from 'react';
import { 
  Ticket, 
  Train, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Printer, 
  Radio, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  Users,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { Booking, Station, Train as TrainType } from '../types/railway';

interface MyLastTripCardProps {
  latestBooking: Booking | null;
  stations: Station[];
  trains: TrainType[];
  onViewTicket: (booking: Booking) => void;
  onTrackTrain: (trainId: number) => void;
  onNavigateToDashboard: () => void;
  onCancelTicket?: (pnr: string) => void;
}

export const MyLastTripCard: React.FC<MyLastTripCardProps> = ({
  latestBooking,
  stations,
  trains,
  onViewTicket,
  onTrackTrain,
  onNavigateToDashboard,
  onCancelTicket
}) => {
  const [copiedPnr, setCopiedPnr] = useState(false);

  if (!latestBooking) {
    return null;
  }

  const isConfirmed = latestBooking.status === 'CONFIRMED';
  const matchedTrain = trains.find(t => t.trainId === latestBooking.trainId || t.trainNumber === latestBooking.trainNumber);
  const srcStation = stations.find(s => s.code === latestBooking.sourceCode);
  const dstStation = stations.find(s => s.code === latestBooking.destinationCode);

  const departureTime = matchedTrain?.departureTime || '06:00 AM';
  const arrivalTime = matchedTrain?.arrivalTime || '14:30 PM';
  const trainSpeed = matchedTrain?.trainType === 'VANDE_BHARAT' ? 160 : matchedTrain?.trainType === 'SHATABDI' ? 140 : 130;

  const handleCopyPnr = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(latestBooking.pnr);
    setCopiedPnr(true);
    setTimeout(() => setCopiedPnr(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-rose-600/30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl transition-all hover:border-rose-600/50">
      
      {/* Background Subtle Railway Grid Pattern & Glow */}
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        
        {/* Header Bar: Status Badge, Title & PNR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-600/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
                  Dashboard History • Most Recent Journey
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-600/20 text-amber-300 border border-rose-600/30">
                  PERSISTENT RECORD
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>My Last Trip</span>
                <span className="text-slate-500 font-normal text-sm sm:text-base">• PNR & Boarding Status</span>
              </h2>
            </div>
          </div>

          {/* Right Status Pill & PNR Copy */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* PNR Chip with copy */}
            <div 
              onClick={handleCopyPnr}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-rose-600/60 cursor-pointer transition-all group"
              title="Click to copy 10-digit PNR"
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase">PNR:</span>
              <span className="text-xs sm:text-sm font-mono font-black text-amber-400 tracking-wider">
                {latestBooking.pnr}
              </span>
              {copiedPnr ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              )}
            </div>

            {/* Confirmed / Cancelled Badge */}
            <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border ${
              isConfirmed 
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
            }`}>
              {isConfirmed ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>CONFIRMED • ATOMIC COMMIT</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>CANCELLED • 85% REFUND</span>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Central Corridor & Train Manifest Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Train Service & Route Overview (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Train Name & Number */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 font-mono font-black text-amber-400 text-xs sm:text-sm">
                #{latestBooking.trainNumber}
              </span>
              <span className="text-lg sm:text-xl font-black text-white">
                {latestBooking.trainName}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {trainSpeed} km/h High-Speed
              </span>
            </div>

            {/* Travel Corridor Visualizer */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="grid grid-cols-3 gap-2 items-center text-center">
                
                {/* Source Junction */}
                <div className="text-left">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Boarding Origin
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    {latestBooking.sourceCode}
                  </div>
                  <div className="text-xs text-slate-300 truncate font-medium">
                    {srcStation?.name || 'New Delhi Jn'}
                  </div>
                  <div className="text-[11px] font-mono text-amber-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Departs: {departureTime}</span>
                  </div>
                </div>

                {/* Transit Route Line */}
                <div className="px-2">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-slate-400 mb-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>{latestBooking.journeyDate}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-rose-600 to-rose-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1.5 flex items-center justify-center gap-1">
                    <Train className="w-3 h-3" />
                    <span>Direct Corridor</span>
                  </div>
                </div>

                {/* Destination Junction */}
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Arrival Destination
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    {latestBooking.destinationCode}
                  </div>
                  <div className="text-xs text-slate-300 truncate font-medium">
                    {dstStation?.name || 'Howrah Jn'}
                  </div>
                  <div className="text-[11px] font-mono text-sky-400 mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Arrives: {arrivalTime}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Boarding Berths & Passenger Allocation Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Berths:</span>
              </span>

              {latestBooking.passengers.map((p, idx) => (
                <div 
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs font-mono"
                >
                  <span className="text-slate-300 font-bold">{p.fullName}</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-600/20 text-amber-300 text-[10px] font-black border border-rose-600/30">
                    Seat #{p.seatNumber} ({p.berthType})
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Boarding Pass Summary & Quick Action Card (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-4 flex flex-col justify-between h-full">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Carriage / Coach
                </span>
                <span className="text-sm font-black font-mono text-amber-400">
                  {latestBooking.coachCode} ({latestBooking.coachType})
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Primary Passenger
                </span>
                <span className="text-xs font-bold text-slate-200 truncate max-w-[140px]">
                  {latestBooking.contactName}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Total Fare Paid
                </span>
                <span className="text-base font-black font-mono text-white">
                  ₹{latestBooking.totalAmount}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Concurrency Lock Latency:</span>
                <span className="text-emerald-400 font-bold">{latestBooking.transactionLatencyMs} ms</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => onViewTicket(latestBooking)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-amber-400 hover:to-rose-500 text-white hover:text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View / Print Boarding Pass</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onTrackTrain(latestBooking.trainId)}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 hover:text-sky-300 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Radio className="w-3 h-3 text-sky-400" />
                  <span>Live Radar</span>
                </button>

                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>All Bookings</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
