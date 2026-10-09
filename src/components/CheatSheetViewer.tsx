import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  Copy,
  Check,
  Printer,
  Bookmark,
  Volume2,
  VolumeX,
  FileQuestion,
  HelpCircle,
  ExternalLink,
  Youtube,
  Search,
  Share2,
  Calendar,
  Sparkles,
  FileDown,
  ShieldAlert,
} from 'lucide-react';
import { CheatSheetItem, POPULAR_EXAMS } from '../data/examData';
import { exportCheatSheetToWord } from '../utils/docxExport';

interface CheatSheetViewerProps {
  sheet: CheatSheetItem;
  onSaveToBinder: (sheet: CheatSheetItem) => void;
  isSaved: boolean;
  onStartQuiz: () => void;
  onOpenDoubt: () => void;
}

export const CheatSheetViewer: React.FC<CheatSheetViewerProps> = ({
  sheet,
  onSaveToBinder,
  isSaved,
  onStartQuiz,
  onOpenDoubt,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);

  // Match exam info
  const examInfo = POPULAR_EXAMS.find(
    (e) => e.name.toLowerCase() === sheet.exam.toLowerCase()
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisAvailable(true);
    }
    // Cancel any speech if sheet changes
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [sheet.id]);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(sheet.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      await exportCheatSheetToWord(sheet);
    } catch (err) {
      console.error('Failed to export Word docx', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleSpeech = () => {
    if (!speechSynthesisAvailable) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Strip markdown symbols for natural reading
      const plainText = sheet.content
        .replace(/[#*`_$~]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

      const utterance = new SpeechSynthesisUtterance(plainText.slice(0, 3000));
      utterance.rate = 1.05;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Jump to specific section header
  const scrollToSection = (sectionNumber: number) => {
    const headings = document.querySelectorAll('.cheat-sheet-content h2');
    if (headings && headings.length >= sectionNumber) {
      headings[sectionNumber - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white border-2 border-[#0F172A] rounded-sm shadow-[8px_8px_0px_0px_#0F172A] overflow-hidden cheat-sheet-content mb-8 relative">
      {/* Three hole punches binding look */}
      <div className="hidden lg:flex absolute left-4 top-0 bottom-0 flex-col justify-evenly py-10 opacity-20 pointer-events-none no-print">
        <div className="w-5 h-5 rounded-full bg-[#0F172A] border-2 border-[#0F172A]"></div>
        <div className="w-5 h-5 rounded-full bg-[#0F172A] border-2 border-[#0F172A]"></div>
        <div className="w-5 h-5 rounded-full bg-[#0F172A] border-2 border-[#0F172A]"></div>
      </div>

      {/* Header Bar */}
      <div className="border-b-2 border-[#0F172A] bg-slate-50 p-5 sm:p-8 no-print lg:pl-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="px-2 py-0.5 rounded-sm text-[10px] font-black bg-[#2563EB] text-white border-2 border-[#0F172A]">
                {sheet.exam}
              </span>
              {examInfo?.markingScheme && (
                <span className="px-2 py-0.5 rounded-sm text-[10px] font-black bg-[#E11D48] text-white border-2 border-[#0F172A] flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>{examInfo.markingScheme}</span>
                </span>
              )}
              <span className="px-2 py-0.5 rounded-sm text-[10px] font-black bg-white text-[#0F172A] border-2 border-[#0F172A] uppercase">
                Mode: {sheet.mode}
              </span>
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-widest">
                <Calendar className="w-3 h-3" />
                {new Date(sheet.timestamp).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight leading-none bg-[#D9F951] inline-block px-2 py-1 border-2 border-[#0F172A] -ml-2 rotate-1">
              {sheet.topic}
            </h1>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap self-start">
            <button
              onClick={onStartQuiz}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-black text-white bg-[#E11D48] border-2 border-[#0F172A] hover:bg-[#BE123C] shadow-[2px_2px_0px_0px_#0F172A] active:translate-y-1 active:translate-x-1 active:shadow-none transition cursor-pointer"
              title="Test yourself on 5 exam MCQs"
            >
              <FileQuestion className="w-4 h-4" />
              <span>5-Min Quiz</span>
            </button>

            <button
              onClick={onOpenDoubt}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-black text-[#0F172A] bg-white border-2 border-[#0F172A] hover:bg-slate-100 shadow-[2px_2px_0px_0px_#0F172A] active:translate-y-1 active:translate-x-1 active:shadow-none transition cursor-pointer"
              title="Ask a doubt or formula derivation"
            >
              <HelpCircle className="w-4 h-4 text-[#2563EB]" />
              <span className="hidden sm:inline">Ask Doubt</span>
            </button>

            <button
              onClick={() => onSaveToBinder(sheet)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-black border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] active:translate-y-1 active:translate-x-1 active:shadow-none transition cursor-pointer ${
                isSaved
                  ? 'bg-[#0F172A] text-[#D9F951]'
                  : 'bg-white hover:bg-slate-100 text-[#0F172A]'
              }`}
              title="Bookmark in revision binder"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#D9F951]' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <div className="flex items-center gap-1 bg-white border-2 border-[#0F172A] p-0.5 rounded-sm shadow-[2px_2px_0px_0px_#0F172A]">
               {speechSynthesisAvailable && (
                <button
                  onClick={handleToggleSpeech}
                  className={`p-1.5 rounded-sm text-xs font-black transition cursor-pointer ${
                    isSpeaking
                      ? 'bg-[#D9F951] text-[#0F172A]'
                      : 'hover:bg-slate-100 text-[#0F172A]'
                  }`}
                  title={isSpeaking ? 'Stop Audio' : 'Read Aloud'}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={handleCopyMarkdown}
                className="p-1.5 rounded-sm hover:bg-slate-100 text-[#0F172A] transition cursor-pointer"
                title="Copy markdown"
              >
                {copied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleExportWord}
                disabled={isExportingWord}
                className="p-1.5 rounded-sm hover:bg-slate-100 text-[#2563EB] transition cursor-pointer"
                title="Export Word (.docx)"
              >
                <FileDown className="w-4 h-4" />
              </button>
              <button
                onClick={handlePrint}
                className="p-1.5 rounded-sm hover:bg-slate-100 text-[#0F172A] transition cursor-pointer"
                title="Print"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars Navigation Bar */}
        <div className="mt-6 pt-4 border-t-2 border-[#0F172A] flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-black text-[#0F172A] shrink-0 uppercase tracking-widest bg-[#D9F951] px-1 border border-[#0F172A]">
            JUMP TO:
          </span>
          <button
            onClick={() => scrollToSection(1)}
            className="px-2 py-1 rounded-sm text-xs font-black bg-white hover:bg-[#D9F951] text-[#0F172A] border-2 border-[#0F172A] shadow-[1px_1px_0px_0px_#0F172A] shrink-0 transition"
          >
            🧠 1. Core
          </button>
          <button
            onClick={() => scrollToSection(2)}
            className="px-2 py-1 rounded-sm text-xs font-black bg-white hover:bg-[#D9F951] text-[#0F172A] border-2 border-[#0F172A] shadow-[1px_1px_0px_0px_#0F172A] shrink-0 transition"
          >
            ⚡ 2. Formulas
          </button>
          <button
            onClick={() => scrollToSection(3)}
            className="px-2 py-1 rounded-sm text-xs font-black bg-white hover:bg-[#D9F951] text-[#0F172A] border-2 border-[#0F172A] shadow-[1px_1px_0px_0px_#0F172A] shrink-0 transition"
          >
            🎯 3. Traps
          </button>
          <button
            onClick={() => scrollToSection(4)}
            className="px-2 py-1 rounded-sm text-xs font-black bg-white hover:bg-[#D9F951] text-[#0F172A] border-2 border-[#0F172A] shadow-[1px_1px_0px_0px_#0F172A] shrink-0 transition"
          >
            📺 4. Videos
          </button>
        </div>
      </div>

      {/* Main Markdown Body with KaTeX */}
      <div className="p-5 sm:p-10 lg:pl-16 space-y-6 text-[#0F172A] font-serif leading-relaxed text-base sm:text-lg bg-white cheat-sheet-content">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl sm:text-4xl font-black font-sans uppercase tracking-tight text-[#0F172A] mt-8 mb-6 pb-2 border-b-4 border-[#0F172A]">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <div className="mt-12 mb-6 pt-6 first:mt-0 first:pt-0">
                <h2 className="text-2xl sm:text-3xl font-black font-sans uppercase text-[#0F172A] flex items-center gap-2 pb-2 border-b-2 border-[#0F172A]">
                  <span className="bg-[#0F172A] text-white px-2 py-1 rotate-1 inline-block -ml-2 mr-1">#</span>
                  {children}
                </h2>
              </div>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-bold font-sans text-[#0F172A] mt-8 mb-3 bg-[#D9F951] inline-block px-1">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="my-3 text-[#1A1A1A] leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-square pl-6 my-4 space-y-2 text-[#1A1A1A] marker:text-[#E11D48]">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 my-4 space-y-2 text-[#1A1A1A] font-bold marker:font-sans">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed pl-2">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-8 border-[#E11D48] bg-rose-50 px-5 py-4 rounded-r-sm my-6 text-[#0F172A] font-bold italic shadow-[4px_4px_0_0_#E11D48]">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="font-bold bg-[#D9F951]/50 px-0.5">{children}</strong>
            ),
            code: ({ className, children }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="px-1.5 py-0.5 rounded-sm bg-slate-100 border-2 border-[#0F172A] text-[#E11D48] font-bold font-mono text-xs sm:text-sm shadow-[1px_1px_0_0_#0F172A]">
                    {children}
                  </code>
                );
              }
              return (
                <div className="relative group my-6">
                  <div className="absolute -inset-1 bg-[#D9F951] rounded-sm transform rotate-1 group-hover:rotate-2 transition"></div>
                  <pre className="relative bg-[#0F172A] p-5 rounded-sm border-2 border-[#0F172A] overflow-x-auto text-xs sm:text-sm font-mono text-white shadow-[4px_4px_0px_0px_#0F172A]">
                    <code>{children}</code>
                  </pre>
                </div>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto my-8 border-2 border-[#0F172A] shadow-[4px_4px_0_0_#0F172A]">
                <table className="w-full border-collapse text-left text-sm font-sans">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-[#0F172A] text-white font-black uppercase tracking-wider">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="border-b-2 border-r-2 border-[#0F172A] px-4 py-3 last:border-r-0">{children}</th>
            ),
            td: ({ children }) => (
              <td className="border-b-2 border-r-2 border-[#0F172A] bg-white px-4 py-3 text-[#0F172A] font-semibold last:border-r-0 group-last:border-b-0">{children}</td>
            ),
            tr: ({ children }) => (
              <tr className="group even:bg-slate-50">{children}</tr>
            ),
            a: ({ href, children }) => {
              const isYoutube = href?.includes('youtube.com') || href?.includes('youtu.be');
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 font-bold underline underline-offset-4 decoration-2 transition px-1 ${
                    isYoutube
                      ? 'text-[#E11D48] decoration-[#E11D48] hover:bg-[#E11D48] hover:text-white'
                      : 'text-[#2563EB] decoration-[#2563EB] hover:bg-[#2563EB] hover:text-white'
                  }`}
                >
                  {isYoutube && <Youtube className="w-4 h-4 inline" />}
                  <span>{children}</span>
                  <ExternalLink className="w-3 h-3 inline opacity-70" />
                </a>
              );
            },
          }}
        >
          {sheet.content}
        </ReactMarkdown>
      </div>

      {/* Grounding Metadata Drawer (Google Search Verification) */}
      {(sheet.groundingSources.length > 0 || sheet.searchQueries.length > 0) && (
        <div className="border-t-4 border-[#0F172A] bg-[#0F172A] p-5 sm:p-8 no-print text-white lg:pl-16">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-[#D9F951]" />
            <h4 className="text-sm font-black uppercase tracking-widest text-[#D9F951]">
              Verified Grounding Sources
            </h4>
          </div>

          {sheet.searchQueries.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Searched:</span>
              {sheet.searchQueries.map((query, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-white/10 text-white text-xs font-mono font-bold border border-white/20"
                >
                  "{query}"
                </span>
              ))}
            </div>
          )}

          {sheet.groundingSources.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sheet.groundingSources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-3 p-3 bg-white/5 border-2 border-white/20 hover:border-[#D9F951] hover:bg-white/10 transition group text-sm"
                >
                  <span className="font-bold text-slate-200 group-hover:text-white line-clamp-2">{source.title}</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#D9F951] shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
