import React from 'react';
import {
  BookOpen,
  Bookmark,
  Sparkles,
  Calculator,
  Printer,
  HelpCircle,
  User,
  LogOut,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { UserProfile } from './EnterpriseAuthModal';

interface HeaderProps {
  savedCount: number;
  user: UserProfile | null;
  onOpenBinder: () => void;
  onOpenCalculator: () => void;
  onOpenInfo: () => void;
  onOpenPYQ: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  user,
  onOpenBinder,
  onOpenCalculator,
  onOpenInfo,
  onOpenPYQ,
  onOpenAuth,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-[#0F172A] bg-[#FDFBF7] no-print py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#D9F951] border-2 border-[#0F172A] flex items-center justify-center shadow-[2px_2px_0px_0px_#0F172A]">
            <Sparkles className="w-5 h-5 text-[#0F172A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-[#0F172A] tracking-tight">
                ExamPrep<span className="bg-[#D9F951] px-1 ml-0.5 border border-[#0F172A]">AI</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white text-[#0F172A] border-2 border-[#0F172A]">
                RRB • SSC • Govt CBT
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 hidden sm:block mt-0.5">
              The Top Ranker's Revision Engine
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Upload PYQ Button */}
          <button
            onClick={onOpenPYQ}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-black text-[#0F172A] bg-white border-2 border-[#0F172A] hover:bg-[#D9F951] transition shadow-[2px_2px_0px_0px_#0F172A] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none cursor-pointer"
            title="Upload Previous Year Question Paper & Generate Practice Test"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
            </span>
            <span>Upload PYQ Test</span>
          </button>

          {/* Quick Calculator */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold text-[#0F172A] bg-white border-2 border-[#0F172A] hover:bg-slate-100 transition shadow-[2px_2px_0px_0px_#0F172A] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
            title="Interactive Formula Calculator"
          >
            <Calculator className="w-4 h-4 text-[#2563EB]" />
            <span className="hidden md:inline">Speed Calc</span>
          </button>

          {/* Revision Binder */}
          <button
            onClick={onOpenBinder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold text-[#0F172A] bg-white border-2 border-[#0F172A] hover:bg-slate-100 transition shadow-[2px_2px_0px_0px_#0F172A] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
            title="Saved Revision Sheets Binder"
          >
            <Bookmark className="w-4 h-4 text-[#2563EB]" />
            <span className="hidden md:inline">Binder</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-sm text-[10px] font-extrabold bg-[#E11D48] text-white">
                {savedCount}
              </span>
            )}
          </button>

          {/* User Profile or Enterprise Login */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l-2 border-slate-300">
              <div
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#D9F951]/40 border-2 border-[#0F172A] cursor-pointer hover:bg-[#D9F951] transition shadow-[2px_2px_0px_0px_#0F172A]"
                title={`Signed in as ${user.email} (${user.role})`}
              >
                <div className="w-6 h-6 rounded-sm bg-[#0F172A] text-white font-black text-xs flex items-center justify-center">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="block text-xs font-black text-[#0F172A] truncate max-w-[120px] leading-tight">
                    {user.name}
                  </span>
                  <span className="block text-[9px] font-bold text-slate-600 truncate max-w-[120px]">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={onSignOut}
                className="p-1.5 rounded-sm border-2 border-[#0F172A] bg-white hover:bg-[#E11D48] hover:text-white transition shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                title="Sign out of candidate session"
              >
                <LogOut className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-black text-white bg-[#0F172A] hover:bg-slate-800 border-2 border-[#0F172A] transition shadow-[2px_2px_0px_0px_#0F172A] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none cursor-pointer"
              title="Enterprise & Candidate Single Sign-On"
            >
              <Lock className="w-3.5 h-3.5 text-[#D9F951] stroke-[2.5]" />
              <span>Sign In / SSO</span>
            </button>
          )}

          {/* Architecture Info */}
          <button
            onClick={onOpenInfo}
            className="p-1.5 rounded-sm text-[#0F172A] border-2 border-transparent hover:border-[#0F172A] hover:bg-white transition"
            title="Architecture & CBT Engine Info"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
