import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Navigation, Compass, Clock, Zap, AlertCircle, CheckCircle2, 
  Shield, Radio, Train as TrainIcon, Wind, Thermometer, Volume2, Search, 
  ZoomIn, ZoomOut, Play, Pause, RefreshCw, Eye, ArrowRight, Activity, Gauge
} from 'lucide-react';
import { Train } from '../types/railway';

interface LiveTrainMapProps {
  trains: Train[];
  selectedTrainId?: number;
  onSelectTrain?: (trainId: number) => void;
}

interface StationNode {
  code: string;
  name: string;
  city: string;
  state: string;
  x: number; // Percentage coordinate on map (0-100)
  y: number;
  platforms: number;
  weather: string;
  temp: string;
}

interface ActiveCorridorTrain {
  id: number;
  trainNumber: string;
  trainName: string;
  type: string;
  color: string;
  glowColor: string;
  from: string;
  to: string;
  pathId: string;
  speed: number;
  status: string;
  nextHalt: string;
  etaNextHalt: string;
  distanceKm: number;
  totalKm: number;
}

export const LiveTrainMap: React.FC<LiveTrainMapProps> = ({
  trains,
  selectedTrainId = 1,
  onSelectTrain
}) => {
  const [activeTrainId, setActiveTrainId] = useState<number>(selectedTrainId);
  const [radarSearchQuery, setRadarSearchQuery] = useState<string>('');
  const [corridorFilter, setCorridorFilter] = useState<'ALL' | 'NORTHERN' | 'WESTERN' | 'SOUTHERN' | 'KONKAN'>('ALL');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredStation, setHoveredStation] = useState<StationNode | null>(null);
  const [isHornPlaying, setIsHornPlaying] = useState<boolean>(false);

  // Train animation progress states (0 to 100)
  const [trainProgress, setTrainProgress] = useState<Record<number, number>>({
    1: 42, // Delhi -> Howrah
    2: 65, // Delhi -> Mumbai
    3: 30, // Delhi -> Ahmedabad
    4: 78, // Bengaluru -> Chennai
    5: 52  // Mumbai -> Goa
  });

  useEffect(() => {
    if (selectedTrainId) {
      setActiveTrainId(selectedTrainId);
    }
  }, [selectedTrainId]);

  // Geographical station nodes across India's Golden Quadrilateral
  const stations: StationNode[] = useMemo(() => [
    { code: 'NDLS', name: 'New Delhi Railway Station', city: 'Delhi', state: 'Delhi NCR', x: 42, y: 26, platforms: 16, weather: 'Sunny', temp: '28°C' },
    { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', x: 52, y: 34, platforms: 10, weather: 'Clear', temp: '29°C' },
    { code: 'PRYJ', name: 'Prayagraj Junction', city: 'Prayagraj', state: 'Uttar Pradesh', x: 58, y: 38, platforms: 10, weather: 'Partly Cloudy', temp: '30°C' },
    { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', x: 67, y: 40, platforms: 10, weather: 'Humid', temp: '31°C' },
    { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', x: 77, y: 48, platforms: 23, weather: 'Tropical Mist', temp: '30°C' },
    { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', x: 37, y: 32, platforms: 8, weather: 'Warm Breeze', temp: '33°C' },
    { code: 'KOTA', name: 'Kota Junction', city: 'Kota', state: 'Rajasthan', x: 38, y: 39, platforms: 6, weather: 'Clear Sky', temp: '32°C' },
    { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', x: 27, y: 46, platforms: 12, weather: 'Sunny', temp: '34°C' },
    { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat', x: 29, y: 50, platforms: 7, weather: 'Sunny', temp: '33°C' },
    { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat', x: 29, y: 54, platforms: 6, weather: 'Breezy', temp: '31°C' },
    { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', x: 29, y: 61, platforms: 9, weather: 'Coastal Breeze', temp: '29°C' },
    { code: 'MAO', name: 'Madgaon Junction', city: 'Goa', state: 'Goa', x: 32, y: 72, platforms: 4, weather: 'Tropical Sunshine', temp: '28°C' },
    { code: 'SBC', name: 'KSR Bengaluru Junction', city: 'Bengaluru', state: 'Karnataka', x: 42, y: 80, platforms: 10, weather: 'Cool & Pleasant', temp: '23°C' },
    { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', x: 52, y: 78, platforms: 17, weather: 'Coastal Warm', temp: '31°C' }
  ], []);

  // Multi-train fleet on the grid
  const activeFleet: ActiveCorridorTrain[] = useMemo(() => [
    {
      id: 1,
      trainNumber: '22436',
      trainName: 'Vande Bharat Express',
      type: 'VANDE_BHARAT',
      color: '#f59e0b', // Amber
      glowColor: 'rgba(245, 158, 11, 0.6)',
      from: 'NDLS',
      to: 'HWH',
      pathId: 'path-northern',
      speed: 130,
      status: 'ON TIME • 130 km/h',
      nextHalt: 'Kanpur Central (CNB)',
      etaNextHalt: '10:08 AM',
      distanceKm: 440,
      totalKm: 1447
    },
    {
      id: 2,
      trainNumber: '12952',
      trainName: 'Mumbai Rajdhani Express',
      type: 'SUPERFAST_EXPRESS',
      color: '#ef4444', // Red
      glowColor: 'rgba(239, 68, 68, 0.6)',
      from: 'NDLS',
      to: 'MMCT',
      pathId: 'path-western',
      speed: 125,
      status: 'ON TIME • 125 km/h',
      nextHalt: 'Kota Junction (KOTA)',
      etaNextHalt: '20:55 PM',
      distanceKm: 890,
      totalKm: 1384
    },
    {
      id: 3,
      trainNumber: '12002',
      trainName: 'New Delhi Shatabdi',
      type: 'SHATABDI',
      color: '#38bdf8', // Sky
      glowColor: 'rgba(56, 189, 248, 0.6)',
      from: 'NDLS',
      to: 'ADI',
      pathId: 'path-ahmedabad',
      speed: 118,
      status: 'EXP +3 MIN',
      nextHalt: 'Jaipur Junction (JP)',
      etaNextHalt: '10:45 AM',
      distanceKm: 310,
      totalKm: 940
    },
    {
      id: 4,
      trainNumber: '20608',
      trainName: 'Vande Bharat Express',
      type: 'VANDE_BHARAT',
      color: '#10b981', // Emerald
      glowColor: 'rgba(16, 185, 129, 0.6)',
      from: 'SBC',
      to: 'MAS',
      pathId: 'path-southern',
      speed: 130,
      status: 'ON TIME • 130 km/h',
      nextHalt: 'Katpadi Junction',
      etaNextHalt: '08:20 AM',
      distanceKm: 275,
      totalKm: 359
    },
    {
      id: 5,
      trainNumber: '22119',
      trainName: 'Tejas Superfast Express',
      type: 'TEJAS',
      color: '#a855f7', // Purple
      glowColor: 'rgba(168, 85, 247, 0.6)',
      from: 'MMCT',
      to: 'MAO',
      pathId: 'path-konkan',
      speed: 120,
      status: 'ON TIME • 120 km/h',
      nextHalt: 'Ratnagiri Junction',
      etaNextHalt: '11:15 AM',
      distanceKm: 320,
      totalKm: 765
    }
  ], []);

  // Filtered active fleet
  const visibleFleet = useMemo(() => {
    return activeFleet.filter(t => {
      if (radarSearchQuery.trim()) {
        const q = radarSearchQuery.toLowerCase().trim();
        const matchesQuery = t.trainName.toLowerCase().includes(q) || 
                             t.trainNumber.includes(q) || 
                             t.from.toLowerCase().includes(q) || 
                             t.to.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (corridorFilter === 'ALL') return true;
      if (corridorFilter === 'NORTHERN') return t.id === 1;
      if (corridorFilter === 'WESTERN') return t.id === 2 || t.id === 3;
      if (corridorFilter === 'SOUTHERN') return t.id === 4;
      if (corridorFilter === 'KONKAN') return t.id === 5;
      return true;
    });
  }, [activeFleet, radarSearchQuery, corridorFilter]);

  // Active selected train data
  const selectedFleetTrain = useMemo(() => {
    return activeFleet.find(t => t.id === activeTrainId) || activeFleet[0];
  }, [activeFleet, activeTrainId]);

  // Simulation tick
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTrainProgress(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          const id = Number(key);
          const increment = (0.2 + (id * 0.05)) * simSpeedMultiplier;
          let val = next[id] + increment;
          if (val >= 98) val = 8; // loop
          next[id] = Number(val.toFixed(2));
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeedMultiplier]);

  const handlePlayHorn = () => {
    setIsHornPlaying(true);
    setTimeout(() => setIsHornPlaying(false), 1500);
  };

  // Helper function to calculate position on curved track
  const getTrainCoord = (trainId: number) => {
    const progress = (trainProgress[trainId] || 50) / 100;
    
    switch (trainId) {
      case 1: { // Northern: Delhi (42, 26) -> Kanpur (52, 34) -> Prayagraj (58, 38) -> Patna (67, 40) -> Howrah (77, 48)
        const x = 42 + progress * (77 - 42);
        const y = 26 + Math.sin(progress * Math.PI) * 12 + progress * (48 - 26);
        return { x, y };
      }
      case 2: { // Western: Delhi (42, 26) -> Kota (38, 39) -> Vadodara (29, 50) -> Mumbai (29, 61)
        const x = 42 - progress * (42 - 29);
        const y = 26 + progress * (61 - 26);
        return { x, y };
      }
      case 3: { // Delhi (42, 26) -> Jaipur (37, 32) -> Ahmedabad (27, 46)
        const x = 42 - progress * (42 - 27);
        const y = 26 + progress * (46 - 26);
        return { x, y };
      }
      case 4: { // Southern: Bengaluru (42, 80) -> Chennai (52, 78)
        const x = 42 + progress * (52 - 42);
        const y = 80 - progress * (80 - 78);
        return { x, y };
      }
      case 5: { // Konkan: Mumbai (29, 61) -> Goa (32, 72)
        const x = 29 + progress * (32 - 29);
        const y = 61 + progress * (72 - 61);
        return { x, y };
      }
      default:
        return { x: 50, y: 50 };
    }
  };

  return (
    <div className="rounded-[2.5rem] bg-[#030712] border-2 border-slate-800 p-6 sm:p-10 shadow-2xl space-y-6">
      
      {/* Header & RTIS Satellite Telemetry Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE RTIS SATELLITE RADAR
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">NavIC & GPS Synchronized</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              National High-Speed Railway Telemetry Map
            </h2>
          </div>
        </div>

        {/* Live Controls: Simulation Speed & Locomotive Horn */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold flex items-center gap-1.5 text-slate-200 transition-colors cursor-pointer"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isSimulating ? 'Pause Radar' : 'Resume Radar'}</span>
          </button>

          <button
            onClick={() => setSimSpeedMultiplier(prev => (prev === 1 ? 2 : prev === 2 ? 4 : 1))}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-400 transition-colors"
          >
            {simSpeedMultiplier}x Speed
          </button>

          <button
            onClick={handlePlayHorn}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isHornPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105 shadow-md shadow-amber-500/30'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>{isHornPlaying ? 'HOOONK!' : 'Loco Horn'}</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 overflow-hidden">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.45))}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="px-2 text-[10px] font-mono font-bold text-slate-400 hover:text-white"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Corridor Filters & Train Search Input */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Quick Corridor Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Corridors' },
            { id: 'NORTHERN', label: 'Delhi ➔ Howrah' },
            { id: 'WESTERN', label: 'Delhi ➔ Mumbai' },
            { id: 'SOUTHERN', label: 'Bengaluru ➔ Chennai' },
            { id: 'KONKAN', label: 'Mumbai ➔ Goa' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCorridorFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                corridorFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search train or waypoint */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={radarSearchQuery}
            onChange={(e) => setRadarSearchQuery(e.target.value)}
            placeholder="Find train #, station, or route..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          {radarSearchQuery && (
            <button
              onClick={() => setRadarSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

      </div>

      {/* Main Geographic Vector Map Canvas */}
      <div className="relative rounded-3xl bg-slate-950 border-2 border-slate-800/90 overflow-hidden shadow-2xl h-[460px] sm:h-[540px]">
        
        {/* Subtle Map Grid Background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Topographic Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

        {/* SVG Railway Tracks Layer */}
        <svg 
          className="w-full h-full"
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: '50% 50%',
            transition: 'transform 0.3s ease-out'
          }}
        >
          {/* Track 1: Northern High-Speed: New Delhi (42, 26) -> Kanpur (52, 34) -> Prayagraj (58, 38) -> Patna (67, 40) -> Howrah (77, 48) */}
          <path
            d="M 42 26 Q 50 33 52 34 T 58 38 T 67 40 T 77 48"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 42 26 Q 50 33 52 34 T 58 38 T 67 40 T 77 48"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            strokeOpacity="0.8"
          />

          {/* Track 2: Western Bullet: New Delhi (42, 26) -> Kota (38, 39) -> Vadodara (29, 50) -> Mumbai (29, 61) */}
          <path
            d="M 42 26 Q 40 33 38 39 T 29 50 T 29 61"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 42 26 Q 40 33 38 39 T 29 50 T 29 61"
            fill="none"
            stroke="#ef4444"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            strokeOpacity="0.8"
          />

          {/* Track 3: New Delhi (42, 26) -> Jaipur (37, 32) -> Ahmedabad (27, 46) */}
          <path
            d="M 42 26 Q 39 30 37 32 T 27 46"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.4"
          />
          <path
            d="M 42 26 Q 39 30 37 32 T 27 46"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.7"
            strokeDasharray="2 1.5"
            strokeOpacity="0.7"
          />

          {/* Track 4: Southern Corridor: Bengaluru (42, 80) -> Chennai (52, 78) */}
          <path
            d="M 42 80 L 52 78"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.6"
          />
          <path
            d="M 42 80 L 52 78"
            fill="none"
            stroke="#10b981"
            strokeWidth="0.8"
            strokeDasharray="2 1"
            strokeOpacity="0.8"
          />

          {/* Track 5: Konkan Coastal Viaduct: Mumbai (29, 61) -> Goa (32, 72) */}
          <path
            d="M 29 61 Q 30 66 32 72"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.6"
          />
          <path
            d="M 29 61 Q 30 66 32 72"
            fill="none"
            stroke="#a855f7"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            strokeOpacity="0.8"
          />

          {/* Connecting Trunk Links */}
          <path d="M 29 61 Q 36 71 42 80" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="1 2" />
          <path d="M 77 48 Q 65 64 52 78" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="1 2" />
        </svg>

        {/* Station Nodes layer */}
        {stations.map(st => (
          <div
            key={st.code}
            onMouseEnter={() => setHoveredStation(st)}
            onMouseLeave={() => setHoveredStation(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
            style={{ left: `${st.x}%`, top: `${st.y}%` }}
          >
            {/* Glowing station dot */}
            <div className="relative flex items-center justify-center">
              <span className="absolute w-6 h-6 rounded-full bg-amber-400/20 animate-ping pointer-events-none group-hover:scale-150 transition-transform"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-lg group-hover:border-white">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-white"></span>
              </span>
            </div>

            {/* Station Label */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
              <span className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-800 text-[10px] font-mono font-bold text-slate-300 group-hover:text-amber-400 group-hover:border-amber-500/50 shadow-md">
                {st.code}
              </span>
            </div>
          </div>
        ))}

        {/* Moving Active Trains On Track */}
        {visibleFleet.map(t => {
          const pos = getTrainCoord(t.id);
          const isSelected = t.id === activeTrainId;

          return (
            <div
              key={t.id}
              onClick={() => {
                setActiveTrainId(t.id);
                if (onSelectTrain) onSelectTrain(t.id);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transition: 'left 0.9s linear, top 0.9s linear'
              }}
            >
              {/* Animated Train Badge & Pulsing Ring */}
              <div className="relative flex items-center justify-center">
                {isSelected && (
                  <span 
                    className="absolute w-10 h-10 rounded-full animate-ping pointer-events-none"
                    style={{ backgroundColor: t.glowColor }}
                  />
                )}
                
                <div 
                  className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-black flex items-center gap-1.5 shadow-2xl transition-all ${
                    isSelected
                      ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-950 text-slate-950'
                      : 'text-white border hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isSelected ? t.color : '#0f172a',
                    borderColor: t.color
                  }}
                >
                  <TrainIcon className="w-3 h-3 animate-pulse" />
                  <span>#{t.trainNumber}</span>
                </div>
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-slate-950/95 border border-slate-700 px-3 py-1.5 rounded-xl text-[11px] font-mono shadow-2xl z-40">
                <span className="text-white font-bold block">{t.trainName}</span>
                <span className="text-amber-400">{t.from} ➔ {t.to} ({t.speed} km/h)</span>
              </div>
            </div>
          );
        })}

        {/* Hovered Station Tooltip Card */}
        {hoveredStation && (
          <div 
            className="absolute z-40 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl text-xs space-y-1.5 pointer-events-none animate-in fade-in duration-150"
            style={{
              left: `${Math.min(hoveredStation.x + 3, 75)}%`,
              top: `${Math.min(hoveredStation.y + 4, 75)}%`
            }}
          >
            <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
              <MapPin className="w-3.5 h-3.5" />
              <span>{hoveredStation.name} ({hoveredStation.code})</span>
            </div>
            <div className="text-slate-300 font-sans">
              City: {hoveredStation.city}, {hoveredStation.state}
            </div>
            <div className="flex items-center justify-between gap-4 text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800">
              <span>Platforms: <strong>{hoveredStation.platforms}</strong></span>
              <span>Weather: <strong>{hoveredStation.weather} ({hoveredStation.temp})</strong></span>
            </div>
          </div>
        )}

        {/* Bottom Left Map Legend */}
        <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1 hidden sm:block">
          <div className="text-white font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Radar Legend</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Northern High-Speed (Delhi - Howrah)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Western Rajdhani (Delhi - Mumbai)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Southern Vande Bharat (SBC - MAS)</span>
          </div>
        </div>

      </div>

      {/* Selected Train Real-Time Telemetry Bar */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-lg"
              style={{ backgroundColor: selectedFleetTrain.color }}
            >
              <TrainIcon className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{selectedFleetTrain.trainName}</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                  #{selectedFleetTrain.trainNumber}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Route: {selectedFleetTrain.from} ➔ {selectedFleetTrain.to} • Corridor Telemetry Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              ● {selectedFleetTrain.status}
            </span>
          </div>
        </div>

        {/* 4 Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 uppercase text-[10px] block">Current Speed</span>
            <span className="text-xl font-black text-emerald-400 flex items-baseline gap-1 mt-0.5">
              <span>{selectedFleetTrain.speed}</span>
              <span className="text-xs font-normal text-slate-400">km/h</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 uppercase text-[10px] block">Next Scheduled Halt</span>
            <span className="text-sm font-bold text-white block mt-1 truncate">
              {selectedFleetTrain.nextHalt}
            </span>
            <span className="text-[10px] text-amber-400">ETA: {selectedFleetTrain.etaNextHalt}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 uppercase text-[10px] block">Distance Progression</span>
            <span className="text-sm font-bold text-white block mt-1">
              {selectedFleetTrain.distanceKm} / {selectedFleetTrain.totalKm} km
            </span>
            <span className="text-[10px] text-slate-400">
              {Math.round((selectedFleetTrain.distanceKm / selectedFleetTrain.totalKm) * 100)}% Complete
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 uppercase text-[10px] block">Kavach ATP Signal</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>SIL-4 Locked (100%)</span>
            </span>
            <span className="text-[10px] text-slate-400">Pneumatic Auto-Brake Ready</span>
          </div>
        </div>

      </div>

    </div>
  );
};
