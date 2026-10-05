import React, { useState } from 'react';
import { X, Mail, Lock, Phone, User, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, KeyRound } from 'lucide-react';
import { UserProfile, DEMO_USERS } from '../types/user';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (mode === 'signup') {
        if (!fullName.trim() || (!email.trim() && !phone.trim())) {
          setErrorMsg('Please enter your full name and email or phone number.');
          return;
        }

        const newUser: UserProfile = {
          id: `usr_${Date.now()}`,
          name: fullName.trim(),
          email: email.trim() || 'traveler@railfleet.gov.in',
          phone: phone.trim() || '+91 98000 00000',
          role: 'traveler',
          membershipTier: 'Standard',
          walletBalance: 500, // 500 INR welcome bonus
          totalTrips: 0,
          savedPassengers: [
            { fullName: fullName.trim(), age: 28, gender: 'Male', berthPreference: 'Window' }
          ]
        };

        onLoginSuccess(newUser);
        onClose();
        return;
      }

      // Mode: signin
      if (loginMethod === 'otp') {
        if (!otpSent) {
          if (!phone.trim() && !email.trim()) {
            setErrorMsg('Enter your mobile number or email to receive 6-digit OTP.');
            return;
          }
          setOtpSent(true);
          setOtpCode('829143'); // auto-fill demo OTP
          return;
        } else {
          // verify OTP
          if (otpCode !== '829143' && otpCode.length < 6) {
            setErrorMsg('Invalid verification OTP. Use 829143.');
            return;
          }
          onLoginSuccess(DEMO_USERS.traveler);
          onClose();
          return;
        }
      }

      // Password login
      if (email.includes('admin') || email.includes('priya')) {
        onLoginSuccess(DEMO_USERS.admin);
      } else {
        onLoginSuccess({
          ...DEMO_USERS.traveler,
          name: email ? email.split('@')[0].replace('.', ' ') : 'Traveler User',
          email: email || 'traveler@railfleet.gov.in'
        });
      }
      onClose();
    }, 600);
  };

  const handleQuickDemo = (type: 'traveler' | 'admin') => {
    const user = DEMO_USERS[type];
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/10 border border-rose-600/30 text-amber-400 text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>National Railway Single Sign-On (SSO)</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            {mode === 'signin' ? 'Welcome Back, Traveler' : 'Create Your Member Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'signin' 
              ? 'Access 1-click Tatkal booking, saved passenger manifests, and instant UPI refunds.'
              : 'Join 2.4M+ passengers enjoying zero booking fee and ₹500 welcome travel credits.'}
          </p>
        </div>

        {/* Sign In vs Register Toggle */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(''); setOtpSent(false); }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-rose-600 text-white font-black shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); setOtpSent(false); }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-rose-600 text-white font-black shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1-Click Quick Demo Login Chips */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Sparkles className="w-3 h-3" /> Quick 1-Click Demo Login:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('traveler')}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400 text-left transition-all"
            >
              <div className="font-bold text-white text-[11px]">Rahul Sharma</div>
              <div className="text-[10px] text-amber-400 font-mono">Traveler • ₹2,850</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400 text-left transition-all"
            >
              <div className="font-bold text-white text-[11px]">Priya Sen</div>
              <div className="text-[10px] text-sky-400 font-mono">Fleet Ops Admin</div>
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Full Legal Name (as per Aadhaar / Passport)</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Malhotra"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-rose-600"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Email Address or IRCTC Username</span>
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-rose-600"
            />
          </div>

          {mode === 'signin' && (
            <div className="flex items-center justify-between text-[11px] pt-1 font-mono">
              <span className="text-slate-400">Authentication Method:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('password'); setOtpSent(false); }}
                  className={`underline cursor-pointer ${loginMethod === 'password' ? 'text-amber-400 font-bold' : 'text-slate-500'}`}
                >
                  Password
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`underline cursor-pointer ${loginMethod === 'otp' ? 'text-amber-400 font-bold' : 'text-slate-500'}`}
                >
                  Mobile OTP
                </button>
              </div>
            </div>
          )}

          {loginMethod === 'password' ? (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-rose-600"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>6-Digit Verification OTP</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder={otpSent ? "829143" : "Click 'Send OTP'"}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-xs font-mono font-bold tracking-widest focus:outline-none focus:border-rose-600"
                />
                {!otpSent && (
                  <button
                    type="button"
                    onClick={() => { setOtpSent(true); setOtpCode('829143'); }}
                    className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold font-mono shrink-0 cursor-pointer"
                  >
                    Send OTP
                  </button>
                )}
              </div>
              {otpSent && (
                <span className="text-[10px] text-emerald-400 font-mono block">
                  ✓ Demo OTP sent to device: <strong>829143</strong>
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-amber-400 text-white hover:text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-rose-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {isLoading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In to Account' : 'Complete Registration & Claim ₹500'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Footer info */}
        <div className="pt-2 text-center text-[10px] text-slate-500 font-mono">
          Protected by 256-Bit SSL Encryption • Centre for Railway Information Systems
        </div>

      </div>
    </div>
  );
};
