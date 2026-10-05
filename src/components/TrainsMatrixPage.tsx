import React, { useState, useMemo } from 'react';
import { ArrowLeft, Clock, Filter, ArrowUpDown, Shield, AlertCircle, Train as TrainIcon, Sparkles, Radio, ChevronDown, ChevronUp, Coffee, CheckCircle2, MapPin, Zap, Search } from 'lucide-react';
import { Train, Coach } from '../types/railway';

interface TrainsMatrixPageProps {
  trains: Train[];
  sourceCode: string;
  destCode: string;
  travelDate: string;
  onSelectCoach: (train: Train, coach: Coach) => void;
  onBackToSearch: () => void;
  onTrackTrain: (trainId: number) => void;
}

export const TrainsMatrixPage: React.FC<TrainsMatrixPageProps> = ({
  trains,
  sourceCode,
  destCode,
  travelDate,
  onSelectCoach,
  onBackToSearch,
  onTrackTrain
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'departure' | 'duration' | 'fare'>('departure');
  const [expandedRouteTrainId, setExpandedRouteTrainId] = useState<number | null>(null);

  const filteredTrains = useMemo(() => {
    let result = [...trains];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t =>
        t.trainName.toLowerCase().includes(q) ||
        t.trainNumber.includes(q) ||
        t.sourceName.toLowerCase().includes(q) ||
        t.destinationName.toLowerCase().includes(q) ||
        t.departureTime.includes(q) ||
        t.coaches.some(c => c.coachType.toLowerCase().includes(q) || c.coachCode.toLowerCase().includes(q))
      );
    }

    if (selectedTypeFilter !== 'ALL') {
      result = result.filter(t => t.trainType === selectedTypeFilter);
    }

    if (sortBy === 'departure') {
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } else if (sortBy === 'duration') {
      result.sort((a, b) => a.durationHours - b.durationHours);
    } else if (sortBy === 'fare') {
      result.sort((a, b) => {
        const minA = Math.min(...a.coaches.map(c => c.baseFare));
        const minB = Math.min(...b.coaches.map(c => c.baseFare));
        return minA - minB;
      });
    }

    return result;
  }, [trains, searchQuery, selectedTypeFilter, sortBy]);

  return (
    <div className="space-y-8">
      
      {/* Handcrafted Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
        <button onClick={onBackToSearch} className="text-amber-400 hover:underline">Route Search</button>
        <span>/</span>
        <span className="text-slate-200">Matching Schedules & Carriage Matrix ({sourceCode} ➔ {destCode})</span>
      </div>

      {/* Visual Terminal Hero Banner with Picture */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/modern_rail_terminal_1791007356836.jpg"
            alt="Modern railway station platform terminal with express trains"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Live Relational Matrix
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <span>{sourceCode}</span>
              <span className="text-amber-400">➔</span>
              <span>{destCode}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Date: <strong className="text-white">{travelDate}</strong> • Showing {filteredTrains.length} Express & Superfast Services
            </p>
          </div>

          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            <button
              onClick={onBackToSearch}
              className="px-4 py-2 rounded-xl bg-slate-950/90 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-bold transition-all shadow-sm"
            >
              ← Modify Route
            </button>
          </div>
        </div>
      </div>

      {/* Live Train Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-amber-500 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search trains by name, number, coach class, or departure time (e.g. Vande Bharat, 22436, 12952, EC, CC)..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-10 py-3 text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-lg"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3 text-slate-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters and Sorters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" /> Filter:
          </span>
          {[
            { id: 'ALL', label: 'All Fleet Types' },
            { id: 'VANDE_BHARAT', label: '⚡ Vande Bharat' },
            { id: 'SUPERFAST_EXPRESS', label: 'Superfast / Rajdhani' },
            { id: 'SHATABDI', label: 'Shatabdi Express' },
            { id: 'TEJAS', label: 'Tejas Superfast' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setSelectedTypeFilter(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTypeFilter === btn.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Sorters */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
          <span className="text-slate-500 font-semibold px-2">Sort By:</span>
          <button
            onClick={() => setSortBy('departure')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              sortBy === 'departure' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Departure
          </button>
          <button
            onClick={() => setSortBy('duration')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              sortBy === 'duration' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Duration
          </button>
          <button
            onClick={() => setSortBy('fare')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              sortBy === 'fare' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lowest Fare
          </button>
        </div>
      </div>

      {/* Train Schedule Cards List */}
      {filteredTrains.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Matching Trains Found</h3>
          <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
            No active schedules match your chosen corridor. Try switching to a popular route like NDLS ➔ HWH or NDLS ➔ MMCT.
          </p>
          <button
            onClick={onBackToSearch}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            Return to Route Search
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTrains.map((train, idx) => {
            const isRouteExpanded = expandedRouteTrainId === train.trainId;

            // Tailored authentic railway photography per train fleet
            const trainImage = 
              train.trainType === 'VANDE_BHARAT' 
                ? '/src/assets/images/vande_express_viaduct_1791012422831.jpg'
                : train.trainType === 'SUPERFAST_EXPRESS'
                ? '/src/assets/images/hero_train_speed_1791007315199.jpg'
                : train.trainType === 'SHATABDI'
                ? '/src/assets/images/modern_rail_terminal_1791007356836.jpg'
                : train.trainType === 'TEJAS'
                ? '/src/assets/images/coastal_rail_bridge_1791008989586.jpg'
                : '/src/assets/images/scenic_mountain_rail_1791007927403.jpg';

            return (
              <div
                key={train.trainId}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-6 transition-all hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/5 group animate-in fade-in slide-in-from-bottom-3 duration-300"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                
                {/* Visual Train Fleet Photography Header */}
                <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-slate-950">
                  <img
                    src={trainImage}
                    alt={train.trainName}
                    className="w-full h-full object-cover object-center opacity-65 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80"></div>
                  
                  {/* Floating badges on photo */}
                  <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-amber-500/40 font-mono font-black text-amber-400 text-xs shadow-lg">
                        #{train.trainNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>RTIS TRACKED</span>
                      </span>
                    </div>

                    <span className="px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-white/10 text-slate-200 text-xs font-mono font-bold">
                      {train.trainType === 'VANDE_BHARAT' ? '160 km/h High-Speed' : '130 km/h Superfast'}
                    </span>
                  </div>

                  {/* Title overlay on photo bottom */}
                  <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-1">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md tracking-tight">
                        {train.trainName}
                      </h2>
                      <div className="text-xs text-slate-300 flex items-center gap-2 font-medium drop-shadow">
                        <span>Corridor: {train.sourceCode} ➔ {train.destinationCode}</span>
                        <span>•</span>
                        <span>Runs: <strong className="text-amber-400">{train.runsOn}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 sm:pt-0">
                      <button
                        onClick={() => onTrackTrain(train.trainId)}
                        className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 backdrop-blur-md border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        title="Open Live GPS Tracking Map for this Train"
                      >
                        <Radio className="w-3.5 h-3.5 animate-pulse text-sky-400" />
                        <span>Live GPS</span>
                      </button>

                      <button
                        onClick={() => setExpandedRouteTrainId(isRouteExpanded ? null : train.trainId)}
                        className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>Halts</span>
                        {isRouteExpanded ? <ChevronUp className="w-3.5 h-3.5 text-amber-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-6">

                {/* Timeline / Route Corridor */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  
                  {/* Origin */}
                  <div className="sm:col-span-4">
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {train.departureTime}
                    </div>
                    <div className="text-sm font-bold text-slate-200">
                      {train.sourceName}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Station: {train.sourceCode} • Platform 1
                    </div>
                  </div>

                  {/* Duration with Track Arrow */}
                  <div className="sm:col-span-4 flex flex-col items-center justify-center py-2 sm:py-0">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{train.durationHours} hrs total journey</span>
                    </div>
                    <div className="w-full max-w-[180px] h-1 bg-slate-800 rounded-full relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-1.5">
                      Direct Priority Transit
                    </span>
                  </div>

                  {/* Destination */}
                  <div className="sm:col-span-4 sm:text-right">
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {train.arrivalTime}
                    </div>
                    <div className="text-sm font-bold text-slate-200">
                      {train.destinationName}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Station: {train.destinationCode} • Platform 9
                    </div>
                  </div>

                </div>

                {/* Expandable Route Timetable & Intermediate Halts */}
                {isRouteExpanded && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-3">
                    <div className="font-bold font-sans text-slate-300 flex items-center justify-between">
                      <span>Official Stoppages & Distance Schedule</span>
                      <span className="text-slate-500 font-normal">Train #{train.trainNumber}</span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 text-slate-400 text-[11px] pb-1 border-b border-slate-800 font-bold uppercase">
                      <span>Station</span>
                      <span>Sch. Arr</span>
                      <span>Sch. Dep</span>
                      <span>Halt</span>
                      <span className="hidden sm:inline">Platform</span>
                    </div>

                    <div className="space-y-1.5 text-slate-300 text-[11px]">
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        <span className="font-bold text-white">{train.sourceCode} (Origin)</span>
                        <span>Source</span>
                        <span>{train.departureTime}</span>
                        <span>—</span>
                        <span className="hidden sm:inline">PF #16</span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        <span>CNB (Kanpur)</span>
                        <span>10:08</span>
                        <span>10:10</span>
                        <span>2 min</span>
                        <span className="hidden sm:inline">PF #1</span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        <span>PRYJ (Prayagraj)</span>
                        <span>12:08</span>
                        <span>12:10</span>
                        <span>2 min</span>
                        <span className="hidden sm:inline">PF #6</span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        <span>DDU (Deen Dayal)</span>
                        <span>13:50</span>
                        <span>13:52</span>
                        <span>2 min</span>
                        <span className="hidden sm:inline">PF #2</span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        <span className="font-bold text-emerald-400">{train.destinationCode} (Terminus)</span>
                        <span>{train.arrivalTime}</span>
                        <span>Terminus</span>
                        <span>—</span>
                        <span className="hidden sm:inline">PF #9</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Coach Composition Chart */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Train Rake Composition (Locomotive to Guard):</span>
                    <span className="text-slate-500 font-normal">Standard 16-Carriage Formation</span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-[10px] font-mono">
                    <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-amber-400 font-bold">LOCO</span>
                    <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-500">EOG</span>
                    {train.coaches.map(c => (
                      <span key={c.coachId} className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-white font-bold">
                        {c.coachCode}
                      </span>
                    ))}
                    <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-500">PANTRY</span>
                    <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-500">GUARD</span>
                  </div>
                </div>

                {/* Coach Tier Cards Matrix */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Select Carriage to Open Visual Seat Allocation Grid:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {train.coaches.map(coach => {
                      const availableCount = coach.seats.filter(s => !s.isBooked).length;
                      const isFillingFast = availableCount < 8;

                      return (
                        <div
                          key={coach.coachId}
                          onClick={() => onSelectCoach(train, coach)}
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/80 hover:bg-slate-850 cursor-pointer transition-all group flex flex-col justify-between shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-black text-sm text-white group-hover:text-amber-400 transition-colors">
                              {coach.coachType}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-850 text-slate-400">
                              {coach.coachCode}
                            </span>
                          </div>

                          <div className="text-xl font-black text-amber-400 font-mono mb-2">
                            ₹{coach.baseFare}
                          </div>

                          <div className="text-[11px] font-bold flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${availableCount > 0 ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-red-400'}`}></span>
                            <span className={availableCount > 0 ? (isFillingFast ? 'text-amber-400' : 'text-emerald-400') : 'text-rose-400'}>
                              {availableCount > 0 ? `${availableCount} Available` : 'REGRET'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Premier Express Train Fleet Comparative Benchmark */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
              FLEET ROLLING STOCK BENCHMARK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Indian Railways Premier Express Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              From distributed-traction Vande Bharat electric multiple units to air-braked LHB Rajdhani rakes, compare speed, comfort, and operational specifications:
            </p>
          </div>
          <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Certified by RDSO Lucknow
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Train Category</th>
                <th className="py-3 px-4">Max Speed</th>
                <th className="py-3 px-4">Traction / Propulsion</th>
                <th className="py-3 px-4">Coach Suspension</th>
                <th className="py-3 px-4">Doors & Gangways</th>
                <th className="py-3 px-4">Pantry Catering</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-slate-300">
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span>Vande Bharat 2.0 (Train 18)</span>
                </td>
                <td className="py-4 px-4 font-mono text-amber-400 font-bold">160 km/h (Tested 180)</td>
                <td className="py-4 px-4 text-slate-300">Distributed EMU 3-Phase IGBT</td>
                <td className="py-4 px-4 text-emerald-400">Secondary Air Springs (Zero Jerk)</td>
                <td className="py-4 px-4 text-slate-300">Automatic Sliding Plug Doors</td>
                <td className="py-4 px-4 text-emerald-400 font-semibold">Included Hot Meals (IRCTC)</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span>Tejas Superfast Express</span>
                </td>
                <td className="py-4 px-4 font-mono text-sky-400 font-bold">140 - 160 km/h</td>
                <td className="py-4 px-4 text-slate-300">WAP-7 / WAP-5 Locomotive</td>
                <td className="py-4 px-4 text-emerald-400">Pneumatic Air Suspension LHB</td>
                <td className="py-4 px-4 text-slate-300">Automated Central Locking</td>
                <td className="py-4 px-4 text-emerald-400 font-semibold">Gourmet Chef-Curated Meals</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  <span>Rajdhani Express</span>
                </td>
                <td className="py-4 px-4 font-mono text-rose-400 font-bold">130 - 140 km/h</td>
                <td className="py-4 px-4 text-slate-300">High-Horsepower Electric Loco</td>
                <td className="py-4 px-4 text-slate-300">German LHB Stainless Steel</td>
                <td className="py-4 px-4 text-slate-300">Vestibuled Sealed Inter-Car</td>
                <td className="py-4 px-4 text-emerald-400 font-semibold">Pre-Booked Gourmet Dinner & Breakfast</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>Shatabdi Express</span>
                </td>
                <td className="py-4 px-4 font-mono text-emerald-400 font-bold">130 - 150 km/h</td>
                <td className="py-4 px-4 text-slate-300">WAP-7 6000 HP Head-On Generation</td>
                <td className="py-4 px-4 text-slate-300">LHB High-Speed Chair Car</td>
                <td className="py-4 px-4 text-slate-300">Wide Panoramic Windows</td>
                <td className="py-4 px-4 text-emerald-400 font-semibold">Complimentary Snacks, Tea & Meals</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <span>Duronto Non-Stop Express</span>
                </td>
                <td className="py-4 px-4 font-mono text-purple-400 font-bold">120 - 130 km/h</td>
                <td className="py-4 px-4 text-slate-300">End-to-End Point Transit</td>
                <td className="py-4 px-4 text-slate-300">LHB Sleeper & AC Hybrid</td>
                <td className="py-4 px-4 text-slate-300">Standard Vestibule Access</td>
                <td className="py-4 px-4 text-slate-300">Optional Hot Pantry Service</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Engineering Marvels & Historic Mountain Corridors */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden group">
          <div className="text-2xl font-black text-amber-400 font-mono">01.</div>
          <h3 className="text-base font-bold text-white">Chenab River Rail Arch Bridge</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Suspended 359 meters above the Chenab riverbed in Jammu & Kashmir, this steel arch bridge is taller than the Eiffel Tower and engineered to resist blast loads and -20°C alpine temperatures.
          </p>
          <div className="pt-2 text-[10px] font-mono text-emerald-400">USBRL Rail Link Project</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden group">
          <div className="text-2xl font-black text-sky-400 font-mono">02.</div>
          <h3 className="text-base font-bold text-white">New Pamban Vertical Sea Bridge</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            India's premier vertical-lift oceanic railway bridge spanning 2.05 km across the Palk Strait, lifting 17 meters into the air to permit commercial cargo ships to sail beneath the tracks.
          </p>
          <div className="pt-2 text-[10px] font-mono text-sky-400">Mandapam ➔ Rameswaram Oceanic Track</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden group">
          <div className="text-2xl font-black text-emerald-400 font-mono">03.</div>
          <h3 className="text-base font-bold text-white">Konkan Western Ghats Corridor</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            A 760 km marvel traversing 91 tunnels, 2,000 bridges, and viaducts carved into the Sahyadri mountains, famous for panoramic monsoon waterfalls and lush coastal rainforests.
          </p>
          <div className="pt-2 text-[10px] font-mono text-emerald-400">Roha (Mumbai) ➔ Thokur (Mangaluru)</div>
        </div>
      </section>

      {/* Reservation Charting Timelines & Final Waitlist Clearance Rules */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>OFFICIAL PRS CHARTING DIRECTIVE</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white">
          When are Train Charts Prepared?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Under Ministry of Railways directives, the <strong>First Reservation Chart</strong> is generated at least <strong>4 hours before the scheduled train departure</strong> from the originating station. The <strong>Second and Final Chart</strong> is locked <strong>30 minutes prior to departure</strong> after releasing all unutilized emergency quotas, Tatkal cancellations, and VIP allocations to RAC/Waitlist passengers sequentially.
        </p>
      </section>

    </div>
  );
};
