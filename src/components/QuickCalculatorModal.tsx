import React, { useState } from 'react';
import { X, Calculator, ArrowRight, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface QuickCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCalculatorModal: React.FC<QuickCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'rolling' | 'quadratic' | 'bayes' | 'tvm'>('rolling');

  // Rolling Incline Calculator state
  const [inclineTheta, setInclineTheta] = useState<number>(30);
  const [inclineHeight, setInclineHeight] = useState<number>(5);
  const [shapeFactor, setShapeFactor] = useState<number>(0.4);

  // Quadratic Calculator state
  const [quadA, setQuadA] = useState<number>(1);
  const [quadB, setQuadB] = useState<number>(-5);
  const [quadC, setQuadC] = useState<number>(6);

  // Bayes Theorem state
  const [probA, setProbA] = useState<number>(0.01);
  const [probBgivenA, setProbBgivenA] = useState<number>(0.95);
  const [probBgivenNotA, setProbBgivenNotA] = useState<number>(0.05);

  // TVM / Compounding state
  const [pv, setPv] = useState<number>(1000);
  const [rate, setRate] = useState<number>(8);
  const [periods, setPeriods] = useState<number>(5);

  if (!isOpen) return null;

  // Rolling calculations
  const g = 9.8;
  const rad = (inclineTheta * Math.PI) / 180;
  const rollingAccel = (g * Math.sin(rad)) / (1 + shapeFactor);
  const rollingVelocity = Math.sqrt((2 * g * inclineHeight) / (1 + shapeFactor));

  // Quadratic calculation
  const disc = quadB * quadB - 4 * quadA * quadC;
  let quadRootsText = '';
  if (disc > 0) {
    const r1 = (-quadB + Math.sqrt(disc)) / (2 * quadA);
    const r2 = (-quadB - Math.sqrt(disc)) / (2 * quadA);
    quadRootsText = `x₁ = ${r1.toFixed(3)}, x₂ = ${r2.toFixed(3)}`;
  } else if (disc === 0) {
    const r = -quadB / (2 * quadA);
    quadRootsText = `Equal Root: x = ${r.toFixed(3)}`;
  } else {
    const real = (-quadB / (2 * quadA)).toFixed(3);
    const imag = (Math.sqrt(-disc) / (2 * quadA)).toFixed(3);
    quadRootsText = `${real} ± ${imag}i`;
  }

  // Bayes calculation
  const probNotA = 1 - probA;
  const probB = probBgivenA * probA + probBgivenNotA * probNotA;
  const bayesPosterior = probB > 0 ? (probBgivenA * probA) / probB : 0;

  // TVM calculation
  const fv = pv * Math.pow(1 + rate / 100, periods);

  const tabs = [
    { id: 'rolling', label: 'Incline Rolling (Physics)' },
    { id: 'quadratic', label: 'Quadratic & Roots' },
    { id: 'bayes', label: 'Bayes Probability' },
    { id: 'tvm', label: 'TVM & Compounding' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-2 border-[#0F172A] rounded-sm w-full max-w-xl flex flex-col shadow-[10px_10px_0px_0px_#0F172A] overflow-hidden my-auto animate-fade-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#0F172A] bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#D9F951] border-2 border-[#0F172A] text-[#0F172A] flex items-center justify-center shadow-[2px_2px_0px_0px_#0F172A]">
              <Calculator className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                Exam Speed Formula Calculator
              </h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                Instantly compute and verify high-frequency competitive exam formulas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm border-2 border-[#0F172A] bg-white hover:bg-[#E11D48] hover:text-white transition shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="p-2 border-b-2 border-[#0F172A] bg-[#FDFBF7] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-sm text-xs font-black whitespace-nowrap transition border-2 border-[#0F172A] cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0F172A] text-white shadow-[2px_2px_0px_0px_#0F172A]'
                  : 'bg-white text-[#0F172A] hover:bg-[#D9F951]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 bg-[#FDFBF7]">
          {activeTab === 'rolling' && (
            <div className="space-y-4">
              <div className="p-3 bg-white border-2 border-[#0F172A] rounded-sm shadow-[3px_3px_0px_0px_#0F172A] text-xs font-serif text-[#0F172A]">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {"Formula: $a = \\frac{g \\sin\\theta}{1 + k^2/R^2}$, $v = \\sqrt{\\frac{2gh}{1 + k^2/R^2}}$"}
                </ReactMarkdown>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-[#0F172A]">
                <div>
                  <label className="block mb-1 font-black uppercase text-[10px]">Body Shape</label>
                  <select
                    value={shapeFactor}
                    onChange={(e) => setShapeFactor(parseFloat(e.target.value))}
                    className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-2.5 py-2 text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] font-bold"
                  >
                    <option value={0.4}>Solid Sphere (2/5 = 0.4)</option>
                    <option value={0.5}>Solid Cylinder (1/2 = 0.5)</option>
                    <option value={0.667}>Hollow Sphere (2/3 = 0.67)</option>
                    <option value={1.0}>Ring / Hollow Cylinder (1.0)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-black uppercase text-[10px]">Angle θ (deg)</label>
                  <input
                    type="number"
                    value={inclineTheta}
                    onChange={(e) => setInclineTheta(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-2.5 py-2 text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-black uppercase text-[10px]">Height h (meters)</label>
                  <input
                    type="number"
                    value={inclineHeight}
                    onChange={(e) => setInclineHeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-2.5 py-2 text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-sm border-2 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] space-y-2.5">
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-slate-600">Acceleration down incline (a):</span>
                  <span className="font-black text-[#0F172A] bg-[#D9F951] px-2 py-0.5 border border-[#0F172A]">
                    {rollingAccel.toFixed(3)} m/s²
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-slate-600">Velocity at bottom (v):</span>
                  <span className="font-black text-white bg-[#2563EB] px-2 py-0.5 border border-[#0F172A]">
                    {rollingVelocity.toFixed(3)} m/s
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quadratic' && (
            <div className="space-y-4">
              <div className="p-3 bg-white border-2 border-[#0F172A] rounded-sm shadow-[3px_3px_0px_0px_#0F172A] text-xs font-serif text-[#0F172A]">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {"Equation: $a x^2 + b x + c = 0$, $\\Delta = b^2 - 4ac$"}
                </ReactMarkdown>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-bold text-[#0F172A]">
                <div>
                  <label className="block mb-1 font-black uppercase text-[10px]">Coefficient a</label>
                  <input
                    type="number"
                    value={quadA}
                    onChange={(e) => setQuadA(parseFloat(e.target.value) || 1)}
                    className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-2.5 py-2 text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-black uppercase text-[10px]">Coefficient b</label>
                  <input
                    type="number"
                    value={quadB}
                    onChange={(e) => setQuadB(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-2.5 py-2 text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-black uppercase text-[10px]">Coefficient c</label>
                  <input
                    type="number"
                    value={quadC}
                    onChange={(e) => setQuadC(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-2.5 py-2 text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-sm border-2 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] space-y-2.5">
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-slate-600">Discriminant (Δ):</span>
                  <span className={`font-black px-2 py-0.5 border border-[#0F172A] ${disc >= 0 ? 'bg-[#D9F951] text-[#0F172A]' : 'bg-[#E11D48] text-white'}`}>
                    {disc.toFixed(3)} {disc > 0 ? '(Real & Distinct)' : disc === 0 ? '(Equal)' : '(Complex)'}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-slate-600">Roots:</span>
                  <span className="font-mono font-black text-white bg-[#0F172A] px-2 py-0.5 rounded-sm">
                    {quadRootsText}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bayes' && (
            <div className="space-y-4">
              <div className="p-3 bg-white border-2 border-[#0F172A] rounded-sm shadow-[3px_3px_0px_0px_#0F172A] text-xs font-serif text-[#0F172A]">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {"Bayes: $P(A|B) = \\frac{P(B|A) P(A)}{P(B|A)P(A) + P(B|\\neg A)P(\\neg A)}$"}
                </ReactMarkdown>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-[#0F172A]">
                <div>
                  <label className="block mb-1 font-black uppercase text-[10px]">Prior P(A)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={probA}
                    onChange={(e) => setProbA(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-2.5 py-2 text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-black uppercase text-[10px]">True Pos P(B|A)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={probBgivenA}
                    onChange={(e) => setProbBgivenA(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-2.5 py-2 text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-black uppercase text-[10px]">False Pos P(B|¬A)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={probBgivenNotA}
                    onChange={(e) => setProbBgivenNotA(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-2.5 py-2 text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-sm border-2 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] space-y-2.5">
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-slate-600">Total Evidence P(B):</span>
                  <span className="font-black text-[#0F172A] bg-slate-100 px-2 py-0.5 border border-[#0F172A]">
                    {(probB * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-slate-600">Posterior Probability P(A|B):</span>
                  <span className="font-black text-[#0F172A] bg-[#D9F951] px-2 py-0.5 border border-[#0F172A]">
                    {(bayesPosterior * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tvm' && (
            <div className="space-y-4">
              <div className="p-3 bg-white border-2 border-[#0F172A] rounded-sm shadow-[3px_3px_0px_0px_#0F172A] text-xs font-serif text-[#0F172A]">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {"Future Value: $FV = PV (1 + r)^n$"}
                </ReactMarkdown>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-bold text-[#0F172A]">
                <div>
                  <label className="block mb-1 font-black uppercase text-[10px]">PV (Principal)</label>
                  <input
                    type="number"
                    value={pv}
                    onChange={(e) => setPv(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-2.5 py-2 text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-black uppercase text-[10px]">Rate r (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-2.5 py-2 text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-black uppercase text-[10px]">Periods n</label>
                  <input
                    type="number"
                    value={periods}
                    onChange={(e) => setPeriods(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-2.5 py-2 text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-sm border-2 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] space-y-2.5">
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-slate-600">Future Value (FV):</span>
                  <span className="font-black text-white bg-[#2563EB] px-2 py-0.5 border border-[#0F172A]">
                    ₹{fv.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-slate-600">Net Growth:</span>
                  <span className="font-black text-[#0F172A] bg-[#D9F951] px-2 py-0.5 border border-[#0F172A]">
                    +₹{(fv - pv).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
