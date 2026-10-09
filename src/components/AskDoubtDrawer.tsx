import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { X, Send, Sparkles, HelpCircle, MessageSquareQuote } from 'lucide-react';

interface AskDoubtDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exam: string;
  topic: string;
  snippet?: string;
}

export const AskDoubtDrawer: React.FC<AskDoubtDrawerProps> = ({
  isOpen,
  onClose,
  exam,
  topic,
  snippet = '',
}) => {
  const [doubtText, setDoubtText] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{ q: string; a: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'How do I derive this formula quickly without heavy calculus?',
    'What is the most common sign error examiners penalize here?',
    'Give an intuitive real-world mental model for this concept.',
    'How do I eliminate 2 options immediately if this appears in an MCQ?',
  ];

  const handleSubmit = async (queryText?: string) => {
    const query = queryText || doubtText;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ask-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam,
          topic,
          doubt: query,
          snippet,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to answer doubt');
      }

      setConversation((prev) => [...prev, { q: query, a: data.answer }]);
      setDoubtText('');
    } catch (err: any) {
      console.error('Doubt error:', err);
      setError(err.message || 'Unable to resolve doubt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#0F172A]/70 backdrop-blur-sm">
      <div className="bg-[#FDFBF7] border-l-2 border-[#0F172A] w-full max-w-lg h-full flex flex-col shadow-[-8px_0px_0px_0px_#0F172A] overflow-hidden animate-fade-in">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#0F172A] bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#D9F951] border-2 border-[#0F172A] text-[#0F172A] flex items-center justify-center shadow-[2px_2px_0px_0px_#0F172A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#0F172A] uppercase tracking-tight">
                Ask a Doubt / Deep Dive
              </h3>
              <p className="text-[11px] font-bold text-slate-600 truncate max-w-xs">
                {exam} • {topic}
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

        {/* Conversation Stream */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {conversation.length === 0 && (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-sm bg-white border-2 border-[#0F172A] flex items-center justify-center mx-auto text-[#2563EB] shadow-[3px_3px_0px_0px_#0F172A]">
                <HelpCircle className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="text-base font-black text-[#0F172A] uppercase">
                Got a Doubt on a Formula or Step?
              </h4>
              <p className="text-xs font-semibold text-slate-600 max-w-xs mx-auto">
                Ask about edge cases, shortcut derivations, tricky boundary conditions, or examiner traps.
              </p>

              {/* Quick Prompts */}
              <div className="pt-4 space-y-2 text-left">
                <span className="text-[11px] font-black text-[#E11D48] uppercase tracking-wider block">
                  High-Frequency Questions:
                </span>
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDoubtText(prompt);
                      handleSubmit(prompt);
                    }}
                    className="w-full text-left p-3 rounded-sm bg-white border-2 border-[#0F172A] hover:bg-[#D9F951] text-xs font-bold text-[#0F172A] transition flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#0F172A] cursor-pointer"
                  >
                    <MessageSquareQuote className="w-4 h-4 text-[#2563EB] shrink-0 stroke-[2.5]" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {conversation.map((entry, idx) => (
            <div key={idx} className="space-y-3">
              {/* Question Bubble */}
              <div className="p-3.5 rounded-sm bg-[#D9F951] border-2 border-[#0F172A] text-[#0F172A] text-xs sm:text-sm ml-6 shadow-[3px_3px_0px_0px_#0F172A]">
                <span className="font-black uppercase tracking-wider block text-[10px] text-slate-700 mb-1">
                  You Asked:
                </span>
                <p className="font-bold">{entry.q}</p>
              </div>

              {/* Answer Bubble with KaTeX */}
              <div className="p-4 rounded-sm bg-white border-2 border-[#0F172A] text-xs sm:text-sm text-[#0F172A] mr-4 shadow-[4px_4px_0px_0px_#0F172A] font-serif">
                <span className="font-sans font-black text-[#2563EB] uppercase tracking-wider block text-xs mb-1.5">
                  Exam Tutor Explanation:
                </span>
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {entry.a}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="p-4 rounded-sm bg-white border-2 border-[#0F172A] text-xs font-bold text-[#0F172A] flex items-center gap-2 shadow-[2px_2px_0px_0px_#0F172A] animate-pulse">
              <Sparkles className="w-4 h-4 text-[#2563EB] animate-spin" />
              <span>Analyzing formula derivation and question patterns...</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-sm bg-rose-50 border-2 border-[#E11D48] text-rose-950 font-bold text-xs shadow-[2px_2px_0px_0px_#E11D48]">
              {error}
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="p-3 sm:p-4 border-t-2 border-[#0F172A] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={doubtText}
              onChange={(e) => setDoubtText(e.target.value)}
              placeholder="Ask any doubt about this topic..."
              className="flex-1 bg-white border-2 border-[#0F172A] rounded-sm px-3.5 py-2.5 text-xs sm:text-sm font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-[#D9F951]/10 focus:shadow-[2px_2px_0px_0px_#0F172A]"
            />
            <button
              type="submit"
              disabled={loading || !doubtText.trim()}
              className="p-2.5 rounded-sm bg-[#2563EB] hover:bg-[#1D4ED8] border-2 border-[#0F172A] text-white disabled:opacity-50 transition shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
