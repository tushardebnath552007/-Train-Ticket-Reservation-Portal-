import React, { useState } from 'react';
import { Sparkles, Award, MapPin, Calendar, Clock, ArrowRight, Heart, Star, Compass, Shield } from 'lucide-react';

interface HeritageRailwaysSectionProps {
  onSelectCorridor?: (source: string, destination: string) => void;
}

export const HeritageRailwaysSection: React.FC<HeritageRailwaysSectionProps> = ({ onSelectCorridor }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const touristTrains = [
    {
      title: "Maharajas' Express",
      tag: "WORLD'S LEADING LUXURY TRAIN",
      tagColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
      description: "Presidential suites with private bathtubs, dedicated butler service, crystal-chandelier dining cars (Mayur Mahal & Rang Mahal), and royal safaris in Ranthambore.",
      route: "Delhi ➔ Agra ➔ Ranthambore ➔ Jaipur",
      duration: "7 Nights / 8 Days",
      image: "/src/assets/images/royal_dining_car_1791008958052.jpg",
      badge: "5-Star Fine Dining",
      source: "NDLS",
      dest: "HWH"
    },
    {
      title: "Palace on Wheels",
      tag: "REGAL RAJASTHAN SOJOURN",
      tagColor: "text-sky-400 bg-sky-500/15 border-sky-500/30",
      description: "14 opulent coaches named after former princely states, private royal coupe cabins, khidmatgar stewards, Ayurvedic rejuvenating spa treatments, and palace banquets.",
      route: "Delhi ➔ Jaipur ➔ Jodhpur ➔ Udaipur",
      duration: "Golden Triangle Circuit",
      image: "/src/assets/images/luxury_sleeper_cabin_1791007939769.jpg",
      badge: "Royal Suites",
      source: "NDLS",
      dest: "MMCT"
    },
    {
      title: "The Golden Chariot",
      tag: "SOUTHERN SPLENDOUR",
      tagColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
      description: "Explore the UNESCO stone chariot of Hampi, Badami caves, Mysore Palace, and serene tropical Kerala backwaters aboard purple-and-gold carriages.",
      route: "Bengaluru ➔ Hampi ➔ Mysore ➔ Goa",
      duration: "Pride of Karnataka",
      image: "/src/assets/images/scenic_mountain_rail_1791007927403.jpg",
      badge: "Heritage Circuit",
      source: "SBC",
      dest: "MAS"
    }
  ];

  return (
    <div className="rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
              UNESCO WORLD HERITAGE & ROYAL LUXURY
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Historic Heritage Railways & Royal Expeditions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centuries of engineering grandeur preserved on narrow-gauge mountain tracks and 5-star salon trainsets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm">
            ★ Living Heritage of India
          </span>
        </div>
      </div>

      {/* Featured Big Heritage Showcase Banner with Generated Steam Image */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 group hover:border-amber-500/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
        <div className="h-80 sm:h-[26rem] w-full overflow-hidden relative">
          <img
            src="/src/assets/images/heritage_steam_rail_1791008350926.jpg"
            alt="Vintage dark polished steam locomotive crossing stone arch bridge in misty green hills"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent"></div>
          
          {/* Floating Badges */}
          <div className="absolute top-5 left-5 flex flex-wrap gap-2">
            <span className="bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-mono font-black text-amber-400 border border-amber-500/40 shadow-lg">
              UNESCO World Heritage • Built 1899
            </span>
            <span className="bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-300 border border-emerald-500/30">
              Swiss Abt Rack & Pinion
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-10 relative z-10 -mt-20 space-y-4 bg-gradient-to-b from-transparent to-slate-950">
          <div className="max-w-3xl space-y-2">
            <h3 className="text-2xl sm:text-4xl font-black text-white group-hover:text-amber-400 transition-colors">
              Nilgiri & Darjeeling Himalayan Mountain Steam Rail
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Ascend through clouds, cascading waterfalls, and emerald tea gardens using the unique Swiss Abt rack-and-pinion system. Powered by original coal-fired steam engines lovingly maintained at the heritage loco shed.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono">
              <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-amber-400" /> Gauge: <strong>1,000mm Meter Gauge</strong></span>
              <span>•</span>
              <span>Elevation: <strong>2,203 Meters (Ooty)</strong></span>
              <span>•</span>
              <span>Bridges: <strong>250 Arch Stone Bridges</strong></span>
            </div>

            <button
              onClick={() => onSelectCorridor && onSelectCorridor('SBC', 'MAS')}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explore Mountain Train Timetable</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Royal Tourist Trains Cards with High-Res Photos & Hover Zooms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {touristTrains.map((train, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseLeave={() => setHoveredCard(null)}
            className="group rounded-[2rem] bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl hover:border-amber-500/60 hover:-translate-y-2.5 transition-all duration-500 flex flex-col justify-between"
          >
            {/* Image with zoom effect */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={train.image}
                alt={train.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-black border backdrop-blur-md ${train.tagColor}`}>
                  {train.tag}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-mono font-bold text-amber-400 border border-amber-500/30">
                {train.badge}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                  {train.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {train.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-900 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span className="truncate max-w-[180px]">{train.route}</span>
                  <span className="text-amber-400 font-bold shrink-0">{train.duration}</span>
                </div>

                <button
                  onClick={() => onSelectCorridor && onSelectCorridor(train.source, train.dest)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 group-hover:bg-amber-500 text-slate-300 group-hover:text-slate-950 border border-slate-800 group-hover:border-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300"
                >
                  <span>View Itinerary & Availability</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
