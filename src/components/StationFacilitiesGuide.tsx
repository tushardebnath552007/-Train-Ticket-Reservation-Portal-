import React, { useState } from 'react';
import { Building2, Coffee, Wifi, Luggage, Accessibility, Car, Shield, PhoneCall, CheckCircle2, Sparkles, MapPin, ArrowRight, Eye } from 'lucide-react';

export const StationFacilitiesGuide: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<'NDLS' | 'HWH' | 'MMCT' | 'SBC' | 'MAS' | 'ADI'>('NDLS');
  const [activePhoto, setActivePhoto] = useState<'lounge' | 'concourse'>('lounge');

  const stationData = {
    NDLS: {
      name: 'New Delhi Railway Station (NDLS)',
      city: 'Delhi NCR',
      platforms: 16,
      passengersDaily: '500,000+',
      lounges: 'IRCTC Executive Lounge (Ajmeri Gate side, Platform 16 & Paharganj side, Platform 1) with recliners, shower rooms, and hot continental buffet.',
      metroLink: 'Direct subway link to Delhi Metro Yellow Line and Airport Express High-Speed Line.',
      cloakroom: 'Platform 1 & Platform 16 (₹20 per 24 hours per bag, lock mandatory).',
      medical: '24x7 Emergency Medical Center on Platform 1 with St. John Ambulance.',
      foodPlaza: 'Haldiram\'s, KFC, Subway, Chaayos, Jan Ahaar hygienic subsidized cafeteria.',
      divyangjan: '12 Battery-operated transit carts, low-height ticket counters, tactile flooring, braille signage.'
    },
    HWH: {
      name: 'Howrah Junction (HWH)',
      city: 'Kolkata, West Bengal',
      platforms: 23,
      passengersDaily: '1,000,000+',
      lounges: 'Eastern Railway Premium AC Lounge on Platform 8 with buffet dining, work pods, and Wi-Fi.',
      metroLink: 'Directly connected with Kolkata Metro Underwater Green Line through Howrah Station Box.',
      cloakroom: 'Main Concourse near Platform 9 (Automated barcode tracking).',
      medical: 'Emergency First-Aid Post near Platform 14, 24x7 Doctor on Call.',
      foodPlaza: 'Balaram Mullick sweets, Flurys bakery kiosk, Comesum 24x7 multicuisine, Mio Amore.',
      divyangjan: 'Dedicated wheelchair assistance desk, ramp access from cab road entrance.'
    },
    MMCT: {
      name: 'Mumbai Central (MMCT)',
      city: 'Mumbai, Maharashtra',
      platforms: 9,
      passengersDaily: '350,000+',
      lounges: 'Urban Pod Capsule Hotel & Executive AC Lounge on Platform 1 with soundproof resting capsules.',
      metroLink: 'Adjacent to Mumbai Metro Line 3 (Aqua Line) and Western Suburban rail link.',
      cloakroom: 'Concourse ground floor opposite inquiry counter.',
      medical: 'Western Railway Medical Unit on Platform 1.',
      foodPlaza: 'McDonald\'s, Tibb\'s Frankie, Kailash Parbat, Cafe Coffee Day.',
      divyangjan: 'Braille maps, dedicated senior citizen waiting bays, escalators on all platforms.'
    },
    SBC: {
      name: 'KSR Bengaluru City Junction (SBC)',
      city: 'Bengaluru, Karnataka',
      platforms: 10,
      passengersDaily: '250,000+',
      lounges: 'South Western Railway Deluxe Lounge on Platform 1 with electric massage recliners.',
      metroLink: 'Direct skywalk to Namma Metro Majestic Interchange (Purple & Green lines).',
      cloakroom: 'Near Entrance #1 on Platform 1.',
      medical: '24x7 Health Care Pod with automated defibrillator on Platform 5.',
      foodPlaza: 'Nandhini Deluxe, Maiyas pure veg, Vasudev Adiga\'s, Cafe Coffee Day.',
      divyangjan: 'Battery buggies operated round-the-clock for elderly travelers, lift access.'
    },
    MAS: {
      name: 'Chennai Central (MAS)',
      city: 'Chennai, Tamil Nadu',
      platforms: 17,
      passengersDaily: '400,000+',
      lounges: 'Air-conditioned Executive Waiting Hall with reclining couches on Platform 1.',
      metroLink: 'Direct subway connection to Chennai Central Metro Underground Hub.',
      cloakroom: 'Moore Market Complex entrance & Main concourse.',
      medical: 'Southern Railway Medical Post on Platform 1.',
      foodPlaza: 'Saravana Bhavan, A2B (Adyar Ananda Bhavan), Murugan Idli Shop, Domino\'s.',
      divyangjan: 'Wheelchairs provided at all arrival bays with dedicated railway porters.'
    },
    ADI: {
      name: 'Ahmedabad Junction (ADI)',
      city: 'Ahmedabad, Gujarat',
      platforms: 12,
      passengersDaily: '200,000+',
      lounges: 'Western Railway AC Lounge on Platform 1 with Jain culinary food kiosk.',
      metroLink: 'Direct connection to Ahmedabad Metro Line 1 Kalupur station.',
      cloakroom: 'Main station hall opposite PRS reservation counters.',
      medical: 'Apollo Pharmacy and First-Aid post on Platform 1.',
      foodPlaza: 'Das Khaman, Honest Restaurant, Farki lassi, Subway, Amul Ice Cream parlor.',
      divyangjan: 'Escalators and hydraulic elevators connecting all 12 platform foot-overbridges.'
    }
  };

  const current = stationData[selectedStation];

  return (
    <div className="rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-600/20 flex items-center justify-center text-amber-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-600/20 text-amber-300 border border-rose-600/30 uppercase tracking-wider">
                WORLD-CLASS CONCOURSES
              </span>
              <span className="text-xs text-slate-400 font-mono">Terminal Passenger Amenities</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Station Facilities & Modern Concourse Guide
            </h2>
          </div>
        </div>

        {/* Station Selectors with hover effects */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          {(['NDLS', 'HWH', 'MMCT', 'SBC', 'MAS', 'ADI'] as const).map(code => (
            <button
              key={code}
              type="button"
              onClick={() => setSelectedStation(code)}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-300 ${
                selectedStation === code
                  ? 'bg-rose-600 text-white font-black shadow-md shadow-rose-600/20 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Photos Showcase Grid with Hover Zoom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Photo Card 1: Executive Lounge */}
        <div className="group rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl hover:border-rose-600/50 hover:-translate-y-1.5 transition-all duration-500">
          <div className="relative h-60 overflow-hidden">
            <img
              src="/src/assets/images/station_executive_lounge_1791008973049.jpg"
              alt="Ultra modern railway executive passenger lounge with leather armchairs and buffet"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-mono font-bold text-amber-400 border border-rose-600/30">
              IRCTC Executive Lounge Facility
            </div>
            
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-xs text-white font-mono">
              <span className="font-bold">Entry from ₹180 / 2 hours</span>
              <span className="text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Amenities ➔
              </span>
            </div>
          </div>
          <div className="p-4 bg-slate-950 text-xs text-slate-300">
            Complimentary high-speed Wi-Fi, hot beverage dispenser, shower cubicles, and gourmet meal buffet.
          </div>
        </div>

        {/* Photo Card 2: Modern Terminal Concourse */}
        <div className="group rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl hover:border-sky-500/50 hover:-translate-y-1.5 transition-all duration-500">
          <div className="relative h-60 overflow-hidden">
            <img
              src="/src/assets/images/modern_rail_terminal_1791007356836.jpg"
              alt="Modern train station concourse with high speed express trains"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-mono font-bold text-sky-400 border border-sky-500/30">
              Multi-Modal Concourse & Metro Hub
            </div>
            
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-xs text-white font-mono">
              <span className="font-bold">Zero-Congestion Skywalks</span>
              <span className="text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Transit Links ➔
              </span>
            </div>
          </div>
          <div className="p-4 bg-slate-950 text-xs text-slate-300">
            Direct weather-sheltered skywalks connecting train platforms with underground rapid metro rail networks.
          </div>
        </div>

      </div>

      {/* Selected Station Details Card */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6">
        
        {/* Title bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-black text-white">{current.name}</h3>
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block font-mono">
              Location: {current.city} • Platforms: {current.platforms} • Daily Transit: {current.passengersDaily}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              ● 24x7 Operations Active
            </span>
          </div>
        </div>

        {/* Grid of Facilities with hover lift */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-rose-600/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Coffee className="w-4 h-4" />
              <span>IRCTC Executive Lounge</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{current.lounges}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-sky-500/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
              <Car className="w-4 h-4" />
              <span>Metro & Multi-Modal Transit</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{current.metroLink}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Luggage className="w-4 h-4" />
              <span>Cloakroom & Baggage Lockers</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{current.cloakroom}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-purple-500/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Accessibility className="w-4 h-4" />
              <span>Senior & Divyangjan Support</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{current.divyangjan}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-rose-500/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <Coffee className="w-4 h-4" />
              <span>Food Plaza & Dining Vendors</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{current.foodPlaza}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-rose-500/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <Shield className="w-4 h-4" />
              <span>Emergency First Aid & Police</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{current.medical}</p>
          </div>

        </div>

      </div>

    </div>
  );
};
