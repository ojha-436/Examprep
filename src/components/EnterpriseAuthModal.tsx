import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Fingerprint,
  FileCheck,
  Zap,
} from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  targetExam: string;
  avatarUrl?: string;
  provider: 'email' | 'google' | 'microsoft' | 'digilocker';
}

interface EnterpriseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const EnterpriseAuthModal: React.FC<EnterpriseAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [targetExam, setTargetExam] = useState('RRB JE (Junior Engineer)');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Password strength scoring (0-4)
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordStrength = calculateStrength(password);
  const strengthLabels = ['Too Weak', 'Fair', 'Good', 'Strong', 'Enterprise Grade'];

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both institutional email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate enterprise auth handshake
    setTimeout(() => {
      setLoading(false);
      const user: UserProfile = {
        name: authMode === 'signup' && fullName ? fullName : email.split('@')[0],
        email,
        role: 'Verified Candidate (CBT Pro)',
        targetExam,
        provider: 'email',
      };
      onLoginSuccess(user);
      onClose();
    }, 700);
  };

  const handleSSOLogin = (provider: 'google' | 'microsoft' | 'digilocker') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const sampleNames: Record<string, string> = {
        google: 'Aditya Sharma (AIR-12 Candidate)',
        microsoft: 'Priya Verma (SSC Topper Batch)',
        digilocker: 'Rajesh Kumar (Govt Verified)',
      };
      const user: UserProfile = {
        name: sampleNames[provider] || 'Enterprise Aspirant',
        email: `${provider}.candidate@examengine.internal`,
        role: 'Govt CBT Aspirant',
        targetExam,
        provider,
      };
      onLoginSuccess(user);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-2 border-[#0F172A] rounded-sm w-full max-w-lg shadow-[12px_12px_0px_0px_#0F172A] overflow-hidden my-auto animate-fade-in">
        
        {/* Header Bar */}
        <div className="p-5 border-b-2 border-[#0F172A] bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#D9F951] border-2 border-[#0F172A] text-[#0F172A] flex items-center justify-center shadow-[2px_2px_0px_0px_#0F172A]">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#0F172A] tracking-tight">
                  {authMode === 'signin' ? 'Enterprise Candidate Sign In' : 'Create Candidate Account'}
                </h3>
                <span className="px-2 py-0.5 rounded-sm text-[10px] font-black bg-[#2563EB] text-white border border-[#0F172A]">
                  SOC-2 / SAML
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600">
                Single Sign-On & Cloud Binder Sync for Competitive Exams
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-sm border-2 border-[#0F172A] bg-white hover:bg-[#E11D48] hover:text-white transition shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 border-b-2 border-[#0F172A] bg-[#FDFBF7]">
          <button
            onClick={() => setAuthMode('signin')}
            className={`py-3 text-xs font-black uppercase tracking-wider transition border-r-2 border-[#0F172A] cursor-pointer ${
              authMode === 'signin'
                ? 'bg-[#0F172A] text-white'
                : 'bg-white text-[#0F172A] hover:bg-[#D9F951]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`py-3 text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              authMode === 'signup'
                ? 'bg-[#0F172A] text-white'
                : 'bg-white text-[#0F172A] hover:bg-[#D9F951]'
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-5 bg-[#FDFBF7]">
          {error && (
            <div className="p-3 bg-rose-50 border-2 border-[#E11D48] text-[#E11D48] text-xs font-bold rounded-sm shadow-[2px_2px_0px_0px_#E11D48]">
              {error}
            </div>
          )}

          {/* Institutional SSO Buttons */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
              Enterprise & Govt SSO Handshake
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSSOLogin('google')}
                className="p-2.5 rounded-sm bg-white border-2 border-[#0F172A] hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSSOLogin('microsoft')}
                className="p-2.5 rounded-sm bg-white border-2 border-[#0F172A] hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                <span>Entra ID</span>
              </button>

              <button
                type="button"
                onClick={() => handleSSOLogin('digilocker')}
                className="p-2.5 rounded-sm bg-white border-2 border-[#0F172A] hover:bg-[#D9F951] font-black text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer transition text-[#0F172A]"
                title="DigiLocker / Parichay National Govt SSO"
              >
                <Fingerprint className="w-4 h-4 text-[#E11D48] stroke-[2.5]" />
                <span>DigiLocker</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 my-2">
            <div className="h-0.5 bg-[#0F172A] flex-1"></div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Or Use Work Email
            </span>
            <div className="h-0.5 bg-[#0F172A] flex-1"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#0F172A] block mb-1">
                  Full Candidate Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra (AIR-42)"
                  className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-3.5 py-2.5 text-xs font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-[#D9F951]/10 focus:shadow-[2px_2px_0px_0px_#0F172A]"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-[#0F172A] block mb-1">
                Candidate / Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 stroke-[2.5]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@govtexamprep.edu.in"
                  className="w-full bg-white border-2 border-[#0F172A] rounded-sm pl-10 pr-3.5 py-2.5 text-xs font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-[#D9F951]/10 focus:shadow-[2px_2px_0px_0px_#0F172A]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                  Password
                </label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link dispatched to your registered email.')}
                    className="text-[11px] font-bold text-[#2563EB] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 stroke-[2.5]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border-2 border-[#0F172A] rounded-sm pl-10 pr-10 py-2.5 text-xs font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-[#D9F951]/10 focus:shadow-[2px_2px_0px_0px_#0F172A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-[#0F172A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter for registration */}
              {authMode === 'signup' && password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-500">Strength:</span>
                    <span
                      className={
                        passwordStrength <= 1
                          ? 'text-rose-600'
                          : passwordStrength <= 3
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }
                    >
                      {strengthLabels[passwordStrength]}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1.5 bg-slate-200 rounded-sm overflow-hidden">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full ${
                          passwordStrength >= step
                            ? step <= 1
                              ? 'bg-rose-500'
                              : step <= 3
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#0F172A] block mb-1">
                  Primary Competitive Exam Goal
                </label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-3.5 py-2.5 text-xs font-bold text-[#0F172A]"
                >
                  <option value="RRB JE (Junior Engineer)">RRB JE (Railway Junior Engineer)</option>
                  <option value="RRB ALP (Assistant Loco Pilot)">RRB ALP (Assistant Loco Pilot & Tech)</option>
                  <option value="SSC JE (Junior Engineer)">SSC JE (CPWD / MES)</option>
                  <option value="SSC CHSL (10+2 Level)">SSC CHSL (LDC / JSA)</option>
                  <option value="UPSC Civil Services">UPSC Civil Services</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberDevice"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 rounded-sm border-2 border-[#0F172A] text-[#2563EB] focus:ring-0 cursor-pointer"
              >
              </input>
              <label htmlFor="rememberDevice" className="text-xs font-bold text-slate-700 cursor-pointer">
                Trust this workstation (30-day encrypted session)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-sm font-black text-xs sm:text-sm text-white bg-[#2563EB] hover:bg-[#1D4ED8] border-2 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 uppercase tracking-wider transition cursor-pointer"
            >
              {loading ? (
                <span>Handshaking with Enterprise Auth...</span>
              ) : (
                <>
                  <span>{authMode === 'signin' ? 'Sign In & Launch Desk' : 'Create & Activate Account'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Compliance & Security Badges */}
          <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              256-Bit Encrypted
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              SOC-2 Type II
            </span>
            <span className="flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              ISO 27001 Certified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
