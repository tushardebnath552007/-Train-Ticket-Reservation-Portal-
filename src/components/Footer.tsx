import React from 'react';
import { 
  Train, 
  ShieldCheck, 
  PhoneCall, 
  HelpCircle, 
  FileText, 
  Lock, 
  Globe, 
  ExternalLink, 
  Heart,
  Mail,
  MessageCircle,
  Share2
} from 'lucide-react';

interface FooterProps {
  onNavigateToContact?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToTrains?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToTracking?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToContact,
  onNavigateToHome,
  onNavigateToTrains,
  onNavigateToDashboard,
  onNavigateToTracking
}) => {
  return (
    <footer className="border-t border-slate-800 bg-[#060a12] text-slate-400 text-xs">
      
      {/* Top Advisory Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
            <span className="font-bold text-slate-200">
              Official Indian Railways Center for Railway Information Systems (CRIS) Technical Replica
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono">
            <button 
              onClick={onNavigateToContact}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" /> 24x7 Rail Madad: <strong>139</strong>
            </button>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Security Helpline: <strong>182</strong></span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Concurrency Safe (BEGIN EXCLUSIVE)
            </span>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Mission & Social Media Icons (Col 1-2) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-700 flex items-center justify-center text-white font-black shadow-md shadow-rose-600/20">
                <Train className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  RailFleet Express
                </span>
                <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-600/15 text-amber-400 border border-rose-600/30">
                  PRS v1.0
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An enterprise-grade high-availability Passenger Reservation System (PRS) and dynamic railway fleet manager designed to eliminate race conditions using SQLite3 serialized transaction locking (<code>BEGIN EXCLUSIVE</code>).
            </p>

            {/* Official Indian Railways Social Media Channels */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold block">
                Connect on Official Channels:
              </span>
              <div className="flex items-center gap-2.5">
                
                {/* Twitter / X */}
                <a
                  href="https://twitter.com/RailMinIndia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-600 hover:bg-rose-600/10 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                  title="Twitter / X (@RailMinIndia)"
                  aria-label="Twitter / X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/RailMinIndia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500 hover:bg-sky-500/10 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                  title="Facebook (Ministry of Railways)"
                  aria-label="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-1.874 0-2.433.72-2.433 2.378v1.602h4.524l-.654 3.667h-3.87v7.98h-4.67z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@RailMinIndia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500 hover:bg-rose-500/10 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                  title="YouTube (Indian Railways Channel)"
                  aria-label="YouTube"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/railminindia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500 hover:bg-pink-500/10 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                  title="Instagram (@railminindia)"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Telegram / RailMadad */}
                <a
                  href="https://t.me/railminindia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-400 hover:bg-sky-400/10 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                  title="Telegram News Channel"
                  aria-label="Telegram"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>

              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-[11px] font-mono">
              <div className="text-amber-400 font-bold">National Railway Architecture & Verification</div>
              <div className="text-slate-400">Centre for Railway Information Systems (CRIS) Standards</div>
              <div className="text-emerald-400">Atomic Mutex: SQLite `BEGIN EXCLUSIVE` Certified</div>
            </div>
          </div>

          {/* Col 3: Reservation Services */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-xs">
              Ticketing & Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onNavigateToHome} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Instant Route Search
                </button>
              </li>
              <li>
                <button onClick={onNavigateToTrains} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Vande Bharat Express Corridors
                </button>
              </li>
              <li>
                <button onClick={onNavigateToTracking} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Satellite Live Radar Map
                </button>
              </li>
              <li>
                <button onClick={onNavigateToDashboard} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  PNR Status & Cancellation
                </button>
              </li>
              <li>
                <button onClick={onNavigateToContact} className="hover:text-amber-400 text-amber-400/90 font-bold transition-colors cursor-pointer text-left flex items-center gap-1">
                  <span>24/7 Rail Madad & Contact</span>
                  <PhoneCall className="w-3 h-3 text-amber-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Railway Guidelines */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-xs">
              Passenger Guidelines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-300">Free Luggage Allowance: 40kg (AC) / 35kg (SL)</li>
              <li className="hover:text-slate-300">Tatkal Booking Window: 10:00 AM (AC) / 11:00 AM (Non-AC)</li>
              <li className="hover:text-slate-300">Senior Citizen Lower Berth Quota Rules</li>
              <li className="hover:text-slate-300">E-Catering Gourmet Meal Guidelines</li>
              <li className="hover:text-slate-300">Instant Automated Refund Policy (85%)</li>
            </ul>
          </div>

          {/* Col 5: Support & Contact Portal */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-xs">
              Passenger Help & Contact
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Double-Booking Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Transactions are locked sequentially with ACID compliance. 100% immune to Tatkal concurrency spikes.
              </p>
              
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNavigateToContact}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-amber-400 hover:to-rose-500 text-white hover:text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open Contact & Helpdesk</span>
                </button>
              </div>

              <div className="pt-1 font-mono text-[10px] text-slate-500">
                FastAPI 0.109+ • SQLite 3.37+ • Express Port 5500
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Badges */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px]">
          <div>
            © 2026 RailFleet Express Portal. Built with precision for national railway engineering.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
            <button onClick={onNavigateToContact} className="hover:text-slate-300 cursor-pointer">
              24/7 Rail Madad
            </button>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Carriage</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Hyperlinking Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Certifications</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
