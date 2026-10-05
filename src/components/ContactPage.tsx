import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Send, 
  CheckCircle2, 
  FileText, 
  Headphones, 
  MessageSquare, 
  Building, 
  Train, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface ContactPageProps {
  onBackToHome: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToHome }) => {
  // Form state
  const [category, setCategory] = useState('REFUND_CANCELLATION');
  const [pnr, setPnr] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [trainNumber, setTrainNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    referenceId: string;
    category: string;
    pnr: string;
    time: string;
  } | null>(null);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const refId = `RM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket({
        referenceId: refId,
        category,
        pnr: pnr.trim() || 'N/A',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setIsSubmitting(false);
      setMessage('');
    }, 700);
  };

  const faqs = [
    {
      q: 'How fast are Rail Madad grievances resolved?',
      a: 'Emergency onboard complaints (medical, security, cleanliness, electrical) are dispatched directly to the on-duty Train Superintendent (TS) or Coach Attendant and addressed within 15 to 30 minutes. General refund and clerical inquiries are resolved within 24 to 48 hours.'
    },
    {
      q: 'How does the instant 85% cancellation refund work?',
      a: 'Under Indian Railways computerized PRS rules, when you cancel a confirmed ticket more than 48 hours before scheduled departure, a flat 15% clerical charge applies, and the remaining 85% net refund is initiated immediately to your original payment mode (UPI, Net Banking, or Card).'
    },
    {
      q: 'What is the unified 139 helpline?',
      a: 'Helpline 139 is the single national helpline for Indian Railways that consolidates all prior numbers (138 for general grievances, 182 for security, catering, medical, and PNR inquiries) into an automated IVR and live agent support center available in 14 regional languages.'
    },
    {
      q: 'Can I file a Ticket Deposit Receipt (TDR) online?',
      a: 'Yes, if your train is cancelled, delayed by more than 3 hours, or if you were not accommodated in the booked coach class, a TDR can be filed online through RailFleet before chart preparation for a full 100% fare refund.'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Handcrafted Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
        <button onClick={onBackToHome} className="text-amber-400 hover:underline cursor-pointer">
          Home
        </button>
        <span>/</span>
        <span>Passenger Assistance</span>
        <span>/</span>
        <span className="text-slate-200">Rail Madad 24/7 Helpline & Grievance Portal</span>
      </div>

      {/* Hero Banner with Modern Customer Support Center Photography */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/rail_madad_support_1791012407656.jpg"
            alt="Modern high-tech railway customer support control center"
            className="w-full h-full object-cover object-center opacity-45 scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <Headphones className="w-3.5 h-3.5 animate-pulse" />
            <span>24x7 NATIONAL RAIL MADAD HELPLINE & CITIZEN CHARTER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            We are here to assist <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              every mile of your journey
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium max-w-xl">
            Directly connect with Indian Railways command centers, file real-time onboard service grievances, track refund investigations, or speak with bilingual duty officers 24 hours a day.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="tel:139"
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Dial 139 (Toll-Free Rail Madad)</span>
            </a>
            <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Average Response SLA: &lt; 15 Mins</span>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Helplines Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">General Assistance</div>
            <div className="text-3xl font-black font-mono text-amber-400 mt-1">139</div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All-in-one helpline for PNR enquiry, train tracking, catering orders, and coach comfort.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-rose-500/50 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">RPF Security Line</div>
            <div className="text-3xl font-black font-mono text-rose-400 mt-1">182</div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Immediate Railway Protection Force response for women safety, theft, or onboard emergencies.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-sky-500/50 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Accident Relief</div>
            <div className="text-3xl font-black font-mono text-sky-400 mt-1">1072</div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            National disaster relief, derailment tracking, and family member emergency contact line.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Official Support Email</div>
            <div className="text-sm font-bold text-slate-200 mt-2 truncate">care@railfleet.gov.in</div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Documented grievance escalation, institutional queries, and corporate group bookings.
          </p>
        </div>

      </section>

      {/* Main Form & Headquarters Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Rail Madad Grievance & Service Request Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border-2 border-slate-800/90 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                🚆
              </div>
              <div>
                <h2 className="text-xl font-black text-white">File Rail Madad Service Ticket</h2>
                <span className="text-xs font-mono text-slate-400">Directly routed to on-duty division controllers</span>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              FAST-TRACK RESOLUTION
            </span>
          </div>

          {submittedTicket && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Grievance Dispatched Successfully!</span>
              </div>
              <p className="text-xs text-slate-300">
                Your incident has been registered in the Indian Railways central CRM. An SMS update has been sent to your registered mobile.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-emerald-500/20">
                <div>
                  <span className="text-slate-400 block text-[10px]">Tracking Reference:</span>
                  <strong className="text-amber-400 text-sm">{submittedTicket.referenceId}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Logged Time:</span>
                  <strong className="text-slate-200">{submittedTicket.time}</strong>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assistance Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="REFUND_CANCELLATION">Ticket Cancellation, TDR & Instant Refund Status</option>
                <option value="MEDICAL_EMERGENCY">Medical Emergency Onboard (Priority Dispatch)</option>
                <option value="COACH_CLEANLINESS">Coach Cleanliness, Bedrolls & Water Supply</option>
                <option value="CATERING_QUALITY">IRCTC E-Catering & Pantry Food Quality</option>
                <option value="ELECTRICAL_AC">Air Conditioning, Lights & Charging Sockets</option>
                <option value="SECURITY_THEFT">RPF Security, Theft or Harassment</option>
                <option value="GENERAL_ENQUIRY">General Route, Schedule & Quota Inquiry</option>
              </select>
            </div>

            {/* PNR and Train Number Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>10-Digit PNR (Optional)</span>
                  <span className="text-[10px] text-amber-400 font-mono">e.g. 2848920194</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  placeholder="Enter 10-digit PNR"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Train Number / Name
                </label>
                <input
                  type="text"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                  placeholder="e.g. 22436 Vande Bharat"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Passenger Contact Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Incident / Query Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Description of Grievance *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe the incident, coach number, seat/berth, and what assistance is required..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {isSubmitting ? (
                <span>Dispatching Ticket to Rail Madad...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Transmit Grievance to Division Controller</span>
                </>
              )}
            </button>

          </form>

        </div>

        {/* Zonal Headquarters & CRIS Infrastructure Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <Building className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Central Railway Headquarters</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
                <div className="font-bold text-white">Railway Board (Ministry of Railways)</div>
                <div className="text-slate-400">Rail Bhavan, Raisina Road, New Delhi - 110001</div>
                <div className="text-[11px] font-mono text-amber-400">Phone: 011-23386645</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
                <div className="font-bold text-white">Centre for Railway Information Systems (CRIS)</div>
                <div className="text-slate-400">Chanakyapuri IT Complex, New Delhi - 110021</div>
                <div className="text-[11px] font-mono text-emerald-400">PRS IT Data Center Online</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
                <div className="font-bold text-white">IRCTC Corporate Headquarters</div>
                <div className="text-slate-400">Statesman House, Barakhamba Road, Connaught Place, New Delhi</div>
                <div className="text-[11px] font-mono text-sky-400">E-Ticketing & Catering Helpline: 0755-6610661</div>
              </div>
            </div>
          </div>

          {/* Citizen Charter & SLA Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Indian Railways Citizen Charter 2026</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every passenger ticket issued through RailFleet carries a statutory guarantee of passenger safety, automated transaction rollback upon conflicting requests, and instant computerized refund processing.
            </p>
          </div>

        </div>

      </section>

      {/* Frequently Asked Passenger Inquiries (Accordion) */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Passenger FAQ & Helpdesk Knowledge Base</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Frequently Asked Assistance Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-800/90 rounded-2xl overflow-hidden bg-slate-900/60 transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <span className="font-bold text-sm text-white">{faq.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {openFaq === index && (
                <div className="p-4 sm:p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/50 bg-slate-950/60 font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </section>

      {/* 4-Tier Rail Madad Escalation Hierarchy Matrix */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
            STATUTORY REDRESSAL CHARTER
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            4-Tier Grievance Redressal Escalation Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            If an onboard issue or refund discrepancy remains unresolved, grievances auto-escalate along the following administrative chain:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">LEVEL 1 • IMMEDIATE ONBOARD</div>
            <h4 className="text-sm font-bold text-white">Train Superintendent (TS)</h4>
            <div className="text-xs text-emerald-400 font-mono">SLA: &lt; 15 Minutes</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Coach AC temperature, water replenishment, bedroll replacement, and cleanliness tickets dispatched straight to onboard OBHS crew via handheld HHT terminals.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-sky-400 font-bold uppercase">LEVEL 2 • DIVISIONAL</div>
            <h4 className="text-sm font-bold text-white">Sr. Divisional Commercial Mgr</h4>
            <div className="text-xs text-sky-400 font-mono">SLA: &lt; 24 Hours</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Handles commercial refund investigations, unauthorized vendor overcharging disputes, parcel misplacement, and station porter tariff violations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">LEVEL 3 • ZONAL HEADQUARTERS</div>
            <h4 className="text-sm font-bold text-white">Principal Chief Commercial Mgr</h4>
            <div className="text-xs text-purple-400 font-mono">SLA: &lt; 48 Hours</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zonal executive review overseeing 5 to 7 divisions. Directs structural coach maintenance, vendor contract termination, and electronic refund clearing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">LEVEL 4 • NATIONAL APEX</div>
            <h4 className="text-sm font-bold text-white">Railway Board Public Grievances</h4>
            <div className="text-xs text-rose-400 font-mono">SLA: Statutory Decision</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ministry of Railways National Secretariat, Rail Bhavan New Delhi. Final statutory arbitration authority under the Indian Railways Act 1989.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Medical Relief Protocol & Doctor On-Call Facility */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-widest block mb-1">
              LIFE-SAVING PROTOCOL
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Onboard Emergency Medical Relief & Doctor On-Call
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Immediate medical aid is provided on running trains at zero consultation charge:
            </p>
          </div>
          <a
            href="tel:139"
            className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 139 (Press 2 for Medical)</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">Comprehensive First-Aid Kit</h4>
            <p className="text-slate-400 leading-relaxed">
              Every passenger train carries a certified emergency trauma box with the Train Superintendent, containing wound dressings, analgesics, blood pressure monitors, and antipyretics.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">Station Doctor Attending Next Halt</h4>
            <p className="text-slate-400 leading-relaxed">
              Upon distress call to 139, the section controller alerts the Railway Divisional Hospital. A qualified government medical officer boards the carriage at the upcoming scheduled junction.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">Railway Claims Tribunal (RCT) Relief</h4>
            <p className="text-slate-400 leading-relaxed">
              In untoward incident situations under Section 124A, immediate interim ex-gratia relief of ₹50,000 is released within hours, followed by statutory RCT determination.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
