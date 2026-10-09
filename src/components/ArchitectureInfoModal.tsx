import React from 'react';
import { X, Cpu, Search, Code2, ShieldCheck, Youtube, Sparkles } from 'lucide-react';

interface ArchitectureInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureInfoModal: React.FC<ArchitectureInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-2 border-[#0F172A] rounded-sm w-full max-w-2xl max-h-[88vh] flex flex-col shadow-[10px_10px_0px_0px_#0F172A] overflow-hidden my-auto animate-fade-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#0F172A] bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#D9F951] border-2 border-[#0F172A] text-[#0F172A] flex items-center justify-center shadow-[2px_2px_0px_0px_#0F172A]">
              <Cpu className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                  Full-Stack AI Wrapper Architecture
                </h3>
                <span className="px-2 py-0.5 rounded-sm text-[10px] font-black bg-[#0F172A] text-white border border-[#0F172A]">
                  Blueprint
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                Core Knowledge Base & Implementation Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm border-2 border-[#0F172A] bg-white hover:bg-[#E11D48] hover:text-white transition shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#0F172A] leading-relaxed bg-[#FDFBF7]">
          {/* Section 1 */}
          <div className="p-4 rounded-sm bg-white border-2 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] space-y-2">
            <div className="flex items-center gap-2 text-[#0F172A] font-black">
              <span className="bg-[#2563EB] text-white p-1 rounded-sm border border-[#0F172A]">
                <Cpu className="w-4 h-4" />
              </span>
              <span className="uppercase tracking-wider">1. The "AI Wrapper" Model</span>
            </div>
            <p className="text-slate-700 font-medium leading-relaxed">
              Takes verified user inputs (Exam Name + Topic + Revision Depth), wraps them in a rigidly constructed, hidden system prompt enforcing the 4-pillar architectural rules, and dispatches them to Gemini 2.5 Flash on the Express backend.
            </p>
            <div className="bg-[#0F172A] p-3 rounded-sm font-mono text-[11px] text-[#D9F951] overflow-x-auto border-2 border-[#0F172A]">
              <code>const prompt = `You are an elite competitive exam tutor for ${'{exam}'}... Structure with 4 Pillars...`;</code>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-sm bg-white border-2 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] space-y-2">
            <div className="flex items-center gap-2 text-[#0F172A] font-black">
              <span className="bg-[#D9F951] text-[#0F172A] p-1 rounded-sm border border-[#0F172A]">
                <Search className="w-4 h-4 stroke-[2.5]" />
              </span>
              <span className="uppercase tracking-wider">2. RAG Lite (Search-Grounded YouTube Pipeline)</span>
            </div>
            <p className="text-slate-700 font-medium leading-relaxed">
              Instead of relying on hallucinations or obsolete training data, the backend attaches the <code className="bg-[#D9F951]/40 border border-[#0F172A] px-1 font-mono text-[11px] font-bold">googleSearch</code> tool directly to the GenAI SDK call. This searches live 2026 YouTube lecture series, verified channels (Physics Galaxy, Khan Academy, CrashCourse), and returns real URLs.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-sm bg-white border-2 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] space-y-2">
            <div className="flex items-center gap-2 text-[#0F172A] font-black">
              <span className="bg-amber-400 text-[#0F172A] p-1 rounded-sm border border-[#0F172A]">
                <Code2 className="w-4 h-4 stroke-[2.5]" />
              </span>
              <span className="uppercase tracking-wider">3. Structured Output & KaTeX Math Rendering</span>
            </div>
            <p className="text-slate-700 font-medium leading-relaxed">
              Mathematical formulas are parsed into LaTeX notation via <code className="bg-slate-100 border border-slate-400 px-1 font-mono text-[11px]">react-markdown</code>, <code className="bg-slate-100 border border-slate-400 px-1 font-mono text-[11px]">remark-math</code>, and <code className="bg-slate-100 border border-slate-400 px-1 font-mono text-[11px]">rehype-katex</code>. Equations like <span className="font-mono bg-yellow-100 px-1 border border-yellow-400">{"$S \\propto \\frac{1}{T}$"}</span> and block integrals are rendered with crisp math typography.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-4 rounded-sm bg-white border-2 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] space-y-2">
            <div className="flex items-center gap-2 text-[#0F172A] font-black">
              <span className="bg-[#E11D48] text-white p-1 rounded-sm border border-[#0F172A]">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="uppercase tracking-wider">4. Guardrails: Rate Limiting & Prompt Sanitization</span>
            </div>
            <p className="text-slate-700 font-medium leading-relaxed">
              Backend implements an in-memory sliding window rate limiter (25 requests/min per IP) to prevent quota exhaustion, alongside regex sanitizers that neutralize jailbreak attempts ("ignore previous instructions", system prompt leaks, control characters).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[#0F172A] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-2 border-[#0F172A] rounded-sm text-xs font-black transition shadow-[3px_3px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer uppercase tracking-wider"
          >
            Got it, Back to Study Desk
          </button>
        </div>
      </div>
    </div>
  );
};
