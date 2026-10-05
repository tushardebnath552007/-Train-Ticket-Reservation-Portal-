import React, { useState } from 'react';
import { Train as TrainIcon, Clock, Radio, ArrowRight, Zap, CheckCircle2, Search } from 'lucide-react';
import { Train } from '../types/railway';

interface StationDepartureBoardProps {
  trains: Train[];
  onSelectTrain: (train: Train) => void;
  onTrackTrain: (trainId: number) => void;
}

export const StationDepartureBoard: React.FC<StationDepartureBoardProps> = ({
  trains,
  onSelectTrain,
  onTrackTrain
}) => {
  const [selectedCity, setSelectedCity] = useState<'NDLS' | 'MMCT' | 'SBC'>('NDLS');
  const [boardSearchQuery, setBoardSearchQuery] = useState('');

  const departures = [
    {
      trainNumber: '22436',
      name: 'Vande Bharat Express',
      destination: 'Howrah Junction (HWH)',
      scheduledTime: '06:00',
      expectedTime: '06:00',
      platform: '16',
      status: 'ON TIME',
      statusColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      coaches: '16 Coaches (CC, EC)',
      trainId: 1
    },
    {
      trainNumber: '12952',
      name: 'Mumbai Rajdhani Express',
      destination: 'Mumbai Central (MMCT)',
      scheduledTime: '16:55',
      expectedTime: '16:55',
      platform: '03',
      status: 'BOARDING',
      statusColor: 'text-amber-400 bg-rose-600/15 border-rose-600/30 animate-pulse',
      coaches: '20 Coaches (1A, 2A, 3A)',
      trainId: 2
    },
    {
      trainNumber: '12002',
      name: 'New Delhi Shatabdi',
      destination: 'Ahmedabad Junction (ADI)',
      scheduledTime: '06:15',
      expectedTime: '06:20',
      platform: '01',
      status: 'EXP +5 MIN',
      statusColor: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
      coaches: '14 Coaches (CC, EC)',
      trainId: 3
    },
    {
      trainNumber: '20608',
      name: 'Vande Bharat Express',
      destination: 'Chennai Central (MAS)',
      scheduledTime: '05:45',
      expectedTime: '05:45',
      platform: '07',
      status: 'ON TIME',
      statusColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      coaches: '16 Coaches (CC, EC)',
      trainId: 4
    },
    {
      trainNumber: '22119',
      name: 'Tejas Superfast Express',
      destination: 'Madgaon Junction (MAO)',
      scheduledTime: '05:50',
      expectedTime: '05:50',
      platform: '02',
      status: 'ON TIME',
      statusColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      coaches: '12 Coaches (CC, EC)',
      trainId: 5
    }
  ];

  const filteredDepartures = departures.filter(d => {
    if (!boardSearchQuery.trim()) return true;
    const q = boardSearchQuery.toLowerCase().trim();
    return (
      d.name.toLowerCase().includes(q) ||
      d.trainNumber.includes(q) ||
      d.destination.toLowerCase().includes(q) ||
      d.platform.includes(q) ||
      d.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-3xl bg-[#030712] border-2 border-slate-800 shadow-2xl overflow-hidden space-y-4 p-6 sm:p-8 font-mono">
      
      {/* Top Station Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/10 border border-rose-600/30 flex items-center justify-center text-amber-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                DIGITAL PASSENGER CONCOURSE
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-sans">
              Live Station Departures Display Board
            </h2>
          </div>
        </div>

        {/* Station Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-sans font-bold self-start sm:self-auto">
          {[
            { id: 'NDLS', label: 'New Delhi (NDLS)' },
            { id: 'MMCT', label: 'Mumbai (MMCT)' },
            { id: 'SBC', label: 'Bengaluru (SBC)' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setSelectedCity(st.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCity === st.id
                  ? 'bg-rose-600 text-white font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Departure Board Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={boardSearchQuery}
          onChange={(e) => setBoardSearchQuery(e.target.value)}
          placeholder="Filter departures by train name, train #, platform, destination, or status..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-600"
        />
        {boardSearchQuery && (
          <button
            onClick={() => setBoardSearchQuery('')}
            className="absolute right-3 top-2.5 text-slate-500 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* LED Split Flap Style Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-amber-400/80 uppercase text-[11px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3">TRAIN #</th>
              <th className="py-3 px-4 font-sans">SERVICE NAME</th>
              <th className="py-3 px-4">DESTINATION TERMINAL</th>
              <th className="py-3 px-3">SCHED</th>
              <th className="py-3 px-3">EXPECTED</th>
              <th className="py-3 px-3">PF</th>
              <th className="py-3 px-3">STATUS</th>
              <th className="py-3 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 bg-black/60">
            {filteredDepartures.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-900/60 transition-colors group">
                <td className="py-3 px-3 font-bold text-amber-400 font-mono text-sm">
                  {item.trainNumber}
                </td>
                <td className="py-3 px-4 font-sans font-bold text-white text-sm">
                  {item.name}
                  <span className="text-[10px] text-slate-500 block font-mono font-normal">{item.coaches}</span>
                </td>
                <td className="py-3 px-4 text-slate-300 font-mono">
                  {item.destination}
                </td>
                <td className="py-3 px-3 text-slate-400 font-bold">
                  {item.scheduledTime}
                </td>
                <td className="py-3 px-3 text-amber-300 font-bold">
                  {item.expectedTime}
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400 font-bold">
                    PF {item.platform}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${item.statusColor}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => {
                      const matched = trains.find(t => t.trainId === item.trainId);
                      if (matched) onSelectTrain(matched);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600 text-amber-400 hover:text-slate-950 font-bold text-[11px] transition-colors border border-rose-600/30 cursor-pointer"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
            {filteredDepartures.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-500 text-xs">
                  No scheduled departures match "{boardSearchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Board Ticker Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Local Terminal Time: <strong>{new Date().toLocaleTimeString('en-IN')} IST</strong></span>
        </div>
        <div className="text-slate-500">
          Split-Flap LED Board updates in real-time from Station Interlocking Cabin
        </div>
      </div>

    </div>
  );
};
