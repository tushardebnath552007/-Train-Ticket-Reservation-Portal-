import React, { useState } from 'react';
import { Compass, Sparkles, ArrowRight, Heart, Star, MapPin, Coffee, Shield, Zap } from 'lucide-react';

interface ScenicGatewaysShowcaseProps {
  onSelectCorridor: (source: string, destination: string) => void;
}

export const ScenicGatewaysShowcase: React.FC<ScenicGatewaysShowcaseProps> = ({ onSelectCorridor }) => {
  const [likedCard, setLikedCard] = useState<number | null>(null);

  const gateways = [
    {
      title: "Kashmir Valley Winter Express",
      subtitle: "Banihal ➔ Baramulla Snow Corridor",
      tag: "WINTER WONDERLAND",
      tagColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      description: "Cruise past snow-capped pine forests, frozen lakes, and majestic Pir Panjal mountain passes with heated Vistadome carriages.",
      price: "₹1,850",
      duration: "Daily Morning Run",
      image: "/src/assets/images/kashmir_snow_train_1791009001352.jpg",
      source: "NDLS",
      dest: "HWH"
    },
    {
      title: "Konkan Coastal Sea Viaduct",
      subtitle: "Mumbai ➔ Goa ➔ Mangalore Sea Rail",
      tag: "TURQUOISE OCEAN COAST",
      tagColor: "bg-teal-500/20 text-teal-300 border-teal-500/40",
      description: "Glide over dramatic oceanic bridges, Arabian Sea surf beaches, and 91 tunnels carved through the lush Western Ghats.",
      price: "₹1,240",
      duration: "Spectacular Sunset Views",
      image: "/src/assets/images/coastal_rail_bridge_1791008989586.jpg",
      source: "MMCT",
      dest: "ADI"
    },
    {
      title: "Gourmet Hot Dining & E-Catering",
      subtitle: "Central Base Kitchens Direct to Seat",
      tag: "FSSAI HYGIENE CERTIFIED",
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      description: "Piping hot regional thalis, paneer butter masala, Hyderabadi biryani, and aromatic kulhad masala chai served to your berth.",
      price: "From ₹120",
      duration: "Delivered at Next Junction",
      image: "/src/assets/images/dining_catering_service_1791007344592.jpg",
      source: "NDLS",
      dest: "MMCT"
    },
    {
      title: "Tejas & Vande Bharat Executive 180°",
      subtitle: "Aerodynamic Chair Car Luxury",
      tag: "BUSINESS CLASS RAIL",
      tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      description: "180-degree rotating plush leather recliners, personalized touch entertainment screens, USB fast chargers, and bio-vacuum washrooms.",
      price: "₹2,150",
      duration: "160 km/h Bullet Speed",
      image: "/src/assets/images/luxury_coach_interior_1791007329531.jpg",
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
              ICONIC EXPERIENCES & EXPEDITIONS
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Discover India by Scenic Rail Gateways
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            From snow-bound Himalayan valleys to sunlit coastal sea viaducts and gourmet culinary journeys.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            ★ Handcrafted Railway Odysseys
          </span>
        </div>
      </div>

      {/* 4 Big High-Res Interactive Cards with Smooth Zoom & Hover Lift */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gateways.map((item, idx) => (
          <div
            key={idx}
            className="group rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl hover:border-amber-500/60 hover:-translate-y-2.5 transition-all duration-500 flex flex-col justify-between"
          >
            {/* Image with zoom and gradient overlay */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              
              {/* Category Pill Tag */}
              <div className="absolute top-3.5 left-3.5">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black border backdrop-blur-md ${item.tagColor}`}>
                  {item.tag}
                </span>
              </div>

              {/* Heart Wishlist Micro-interaction */}
              <button
                type="button"
                onClick={() => setLikedCard(likedCard === idx ? null : idx)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                title="Save to Travel Wishlist"
              >
                <Heart className={`w-4 h-4 ${likedCard === idx ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Bottom Price Pill on Image */}
              <div className="absolute bottom-3 left-3.5 right-3.5 flex justify-between items-center text-xs font-mono text-white">
                <span className="font-bold bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-slate-800">
                  {item.price}
                </span>
                <span className="text-[11px] text-slate-300 font-bold bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-slate-800">
                  {item.duration}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h4 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] font-mono text-slate-400 font-medium">
                  {item.subtitle}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => onSelectCorridor(item.source, item.dest)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-amber-500 text-slate-300 group-hover:text-slate-950 border border-slate-800 group-hover:border-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer shadow-sm"
                >
                  <span>Book This Journey</span>
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
