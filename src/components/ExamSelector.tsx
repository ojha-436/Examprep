import React, { useState } from 'react';
import { Search, Sparkles, Zap, Flame, ShieldAlert, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { EXAM_CATEGORIES, POPULAR_EXAMS, ExamItem } from '../data/examData';

interface ExamSelectorProps {
  selectedExam: string;
  selectedTopic: string;
  selectedMode: string;
  isLoading: boolean;
  onSelectExam: (exam: string) => void;
  onSelectTopic: (topic: string) => void;
  onSelectMode: (mode: string) => void;
  onGenerate: () => void;
}

export const ExamSelector: React.FC<ExamSelectorProps> = ({
  selectedExam,
  selectedTopic,
  selectedMode,
  isLoading,
  onSelectExam,
  onSelectTopic,
  onSelectMode,
  onGenerate,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Govt & Railways');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCustomExam, setIsCustomExam] = useState<boolean>(false);
  const [customExamInput, setCustomExamInput] = useState<string>('');

  const currentExamObj = POPULAR_EXAMS.find(
    (e) => e.name.toLowerCase() === selectedExam.toLowerCase()
  );

  const filteredExams = POPULAR_EXAMS.filter((exam) => {
    const matchesCategory = activeCategory === 'All' || exam.category === activeCategory;
    const matchesSearch =
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const modes = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Master',
      tag: 'Best Overall',
      desc: 'All 4 pillars in-depth with core derivations, formulas, traps & videos',
      icon: BookOpen,
      color: 'bg-[#2563EB]',
    },
    {
      id: 'cram',
      name: '3-Min Ultra Cram',
      tag: 'Pre-Exam Speed',
      desc: 'Telegraphic bullets, instant memory triggers, zero textbook fluff',
      icon: Zap,
      color: 'bg-[#D9F951]',
    },
    {
      id: 'formulas',
      name: 'Formula Hacks',
      tag: 'Math Focus',
      desc: 'High-yield LaTeX formulas, scaling laws & calculation shortcuts',
      icon: Layers,
      color: 'bg-emerald-400',
    },
    {
      id: 'traps',
      name: 'Examiner Trap',
      tag: 'Error Defense',
      desc: 'Deceptive distractors, common calculation slips & elimination tricks',
      icon: ShieldAlert,
      color: 'bg-[#E11D48]',
    },
  ];

  const handleCustomExamSubmit = () => {
    if (customExamInput.trim()) {
      onSelectExam(customExamInput.trim());
      setIsCustomExam(false);
    }
  };

  return (
    <div className="bg-white border-2 border-[#0F172A] rounded-sm p-5 sm:p-6 shadow-[6px_6px_0px_0px_#0F172A] no-print">
      {/* Step 1: Exam Selection */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-sm bg-[#0F172A] text-white text-sm flex items-center justify-center font-bold font-mono border-2 border-[#0F172A]">1</span>
              Target Exam
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-1">
              Select your exam to trigger tailored question patterns.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCustomExam(!isCustomExam)}
            className="text-xs text-[#2563EB] font-bold hover:bg-[#D9F951] hover:text-[#0F172A] px-2 py-1 border-2 border-transparent hover:border-[#0F172A] transition self-start sm:self-auto rounded-sm"
          >
            {isCustomExam ? '← Choose from list' : '+ Custom exam'}
          </button>
        </div>

        {isCustomExam ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customExamInput}
              onChange={(e) => setCustomExamInput(e.target.value)}
              placeholder="e.g. USMLE Step 1, CFA Level 2..."
              className="flex-1 bg-white border-2 border-[#0F172A] rounded-sm px-4 py-2.5 text-sm font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-[#D9F951]/10 focus:shadow-[2px_2px_0px_0px_#0F172A] transition"
              onKeyDown={(e) => e.key === 'Enter' && handleCustomExamSubmit()}
            />
            <button
              onClick={handleCustomExamSubmit}
              className="px-4 py-2.5 bg-[#0F172A] text-white border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] hover:translate-y-px hover:translate-x-px hover:shadow-none transition rounded-sm text-xs font-bold"
            >
              Set Exam
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {EXAM_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-bold whitespace-nowrap transition border-2 ${
                    activeCategory === cat
                      ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-[2px_2px_0px_0px_#0F172A]'
                      : 'bg-white border-[#0F172A] text-[#0F172A] hover:bg-[#D9F951]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 max-h-48 overflow-y-auto pr-1">
              {filteredExams.map((exam) => {
                const isSelected = selectedExam.toLowerCase() === exam.name.toLowerCase();
                return (
                  <button
                    key={exam.id}
                    onClick={() => {
                      onSelectExam(exam.name);
                      if (exam.highYieldTopics.length > 0) {
                        onSelectTopic(exam.highYieldTopics[0]);
                      }
                    }}
                    className={`text-left p-3 rounded-sm border-2 transition group relative flex flex-col justify-between h-full ${
                      isSelected
                        ? 'bg-[#D9F951] border-[#0F172A] text-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A]'
                        : 'bg-white border-[#0F172A] text-[#0F172A] hover:shadow-[3px_3px_0px_0px_#0F172A] hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-black leading-tight pr-1">
                        {exam.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#0F172A] shrink-0" />
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <span className="text-[10px] font-bold text-slate-600 block truncate">
                        {exam.badge}
                      </span>
                      {exam.markingScheme && (
                        <span className="text-[9px] bg-white border border-[#0F172A] px-1 py-0.5 inline-block text-[#0F172A] font-bold font-mono truncate">
                          {exam.markingScheme}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="h-0.5 bg-[#0F172A] my-6" />

      {/* Step 2: Topic */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
            <span className="w-6 h-6 rounded-sm bg-[#0F172A] text-white text-sm flex items-center justify-center font-bold font-mono border-2 border-[#0F172A]">2</span>
            Topic or Chapter
          </h2>
        </div>

        <div className="relative">
          <input
            type="text"
            value={selectedTopic}
            onChange={(e) => onSelectTopic(e.target.value)}
            placeholder="e.g. Rotational Motion, Cardiac Cycle..."
            className="w-full bg-white border-2 border-[#0F172A] rounded-sm px-4 py-3 text-sm font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-[#D9F951]/10 focus:shadow-[4px_4px_0px_0px_#0F172A] transition"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                onGenerate();
              }
            }}
          />
        </div>

        {currentExamObj && currentExamObj.highYieldTopics.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-black text-[#E11D48] uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-current" />
              High-Frequency Tested Topics:
            </span>
            <div className="flex flex-wrap gap-2">
              {currentExamObj.highYieldTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => onSelectTopic(topic)}
                  className={`text-xs px-2.5 py-1.5 rounded-sm border-2 font-bold transition ${
                    selectedTopic.toLowerCase() === topic.toLowerCase()
                      ? 'bg-[#E11D48] border-[#0F172A] text-white shadow-[2px_2px_0px_0px_#0F172A]'
                      : 'bg-white border-[#0F172A] text-[#0F172A] hover:bg-slate-100'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-0.5 bg-[#0F172A] my-6" />

      {/* Step 3: Target Revision Depth Mode */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
          <span className="w-6 h-6 rounded-sm bg-[#0F172A] text-white text-sm flex items-center justify-center font-bold font-mono border-2 border-[#0F172A]">3</span>
          Revision Depth
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onSelectMode(mode.id)}
                className={`text-left p-3.5 rounded-sm border-2 transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-[4px_4px_0px_0px_#D9F951]'
                    : 'bg-white border-[#0F172A] text-[#0F172A] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#0F172A]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-sm ${isSelected ? 'bg-white/10' : mode.color} border-2 border-[#0F172A] flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#0F172A]'}`} />
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-sm border-2 ${isSelected ? 'bg-white border-white text-[#0F172A]' : 'bg-white border-[#0F172A] text-[#0F172A]'}`}>
                      {mode.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-black">{mode.name}</h3>
                  <p className={`text-[11px] mt-1.5 font-semibold ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>{mode.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-8 pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 border-2 border-[#0F172A] rounded-full bg-[#D9F951] animate-pulse" />
          <span>Live Google Search & LaTeX Math Active</span>
        </div>

        <button
          type="button"
          disabled={isLoading || !selectedExam || !selectedTopic}
          onClick={onGenerate}
          className="w-full sm:w-auto px-8 py-3.5 rounded-sm font-black text-sm text-white bg-[#2563EB] border-2 border-[#0F172A] hover:bg-[#1D4ED8] active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50 disabled:pointer-events-none transition shadow-[6px_6px_0px_0px_#0F172A] flex items-center justify-center gap-2 group cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Synthesizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>GENERATE 4-PILLAR SHEET</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
