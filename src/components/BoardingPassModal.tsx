import React from 'react';
import { Ticket, Printer, Download, CheckCircle2, ShieldCheck, Train, Calendar, Clock, MapPin } from 'lucide-react';
import { Booking } from '../types/railway';

interface BoardingPassModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BoardingPassModal: React.FC<BoardingPassModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
              🚆
            </div>
            <div>
              <span className="font-black text-sm text-white tracking-wide uppercase">
                Indian Railways Electronic Reservation Slip (ERS)
              </span>
              <div className={`text-[10px] font-mono flex items-center gap-1 ${
                booking.status === 'CANCELLED' ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                <ShieldCheck className="w-3 h-3" />
                <span>
                  {booking.status === 'CANCELLED' 
                    ? 'CANCELLED • 85% REFUND PROCESSED' 
                    : 'CONFIRMED • ATOMIC TRANSACTION COMMITTED'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Boarding Pass Body (Printable Shell) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden space-y-5">
          
          {/* Watermark */}
          <div className={`absolute right-4 bottom-4 text-7xl font-black select-none pointer-events-none opacity-30 ${
            booking.status === 'CANCELLED' ? 'text-rose-500' : 'text-slate-900'
          }`}>
            {booking.status === 'CANCELLED' ? 'CANCELLED' : 'CONFIRMED'}
          </div>

          {/* PNR Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                Cryptographic 10-Digit PNR
              </span>
              <span className="text-2xl font-black font-mono text-amber-400 tracking-wider">
                {booking.pnr}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                Carriage / Coach
              </span>
              <span className="text-xl font-black font-mono text-white">
                {booking.coachCode} ({booking.coachType})
              </span>
            </div>
          </div>

          {/* Train Route Summary */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 items-center text-center">
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Origin</span>
              <div className="text-lg font-black text-white">{booking.sourceCode}</div>
              <div className="text-[11px] text-slate-400 truncate">{booking.trainName}</div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">
                Train #{booking.trainNumber}
              </div>
              <div className="w-full h-0.5 bg-slate-700 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">{booking.journeyDate}</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Destination</span>
              <div className="text-lg font-black text-white">{booking.destinationCode}</div>
              <div className="text-[11px] text-emerald-400 font-semibold">Confirmed</div>
            </div>
          </div>

          {/* Passengers Manifest */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Booked Passengers & Allocated Berths:
            </span>

            <div className="space-y-1.5">
              {booking.passengers.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800/60 text-xs font-mono"
                >
                  <span className="text-slate-200">
                    {i + 1}. {p.fullName} ({p.age}y, {p.gender})
                  </span>
                  <span className="text-amber-400 font-bold">
                    Berth: Seat #{p.seatNumber} ({p.berthType})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown & Transaction Verification */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Total Fare Settled:</span>
              <strong className="text-amber-400 ml-1 font-mono text-sm">₹{booking.totalAmount}</strong>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Lock Mode: <span className="text-emerald-400">EXCLUSIVE</span> (Latency: {booking.transactionLatencyMs}ms)
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Boarding Pass</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Done & Close</span>
          </button>
        </div>

      </div>
    </div>
  );
};
