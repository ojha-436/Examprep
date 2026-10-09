import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExamSelector } from './components/ExamSelector';
import { CheatSheetViewer } from './components/CheatSheetViewer';
import { DiagnosticQuizModal } from './components/DiagnosticQuizModal';
import { AskDoubtDrawer } from './components/AskDoubtDrawer';
import { RevisionBinderModal } from './components/RevisionBinderModal';
import { QuickCalculatorModal } from './components/QuickCalculatorModal';
import { ArchitectureInfoModal } from './components/ArchitectureInfoModal';
import { PYQUploaderModal } from './components/PYQUploaderModal';
import { EnterpriseAuthModal, UserProfile } from './components/EnterpriseAuthModal';
import { CheatSheetItem, INITIAL_FEATURED_SHEET } from './data/examData';
import { Sparkles, AlertCircle, BookmarkCheck, FileText, CheckCircle, Zap, Upload, Train, ShieldAlert } from 'lucide-react';

export default function App() {
  const [selectedExam, setSelectedExam] = useState<string>('RRB JE (Junior Engineer)');
  const [selectedTopic, setSelectedTopic] = useState<string>('DC Circuits: Ohm\'s Law, Kirchhoff\'s Laws & Speed Theorems');
  const [selectedMode, setSelectedMode] = useState<string>('comprehensive');

  const [currentSheet, setCurrentSheet] = useState<CheatSheetItem>(INITIAL_FEATURED_SHEET);
  const [savedSheets, setSavedSheets] = useState<CheatSheetItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modal states
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isDoubtOpen, setIsDoubtOpen] = useState(false);
  const [isBinderOpen, setIsBinderOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isPYQModalOpen, setIsPYQModalOpen] = useState(false);

  // Load saved sheets & cached user on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('examprep_binder_sheets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedSheets(parsed);
        } else {
          setSavedSheets([INITIAL_FEATURED_SHEET]);
          localStorage.setItem('examprep_binder_sheets', JSON.stringify([INITIAL_FEATURED_SHEET]));
        }
      } else {
        setSavedSheets([INITIAL_FEATURED_SHEET]);
        localStorage.setItem('examprep_binder_sheets', JSON.stringify([INITIAL_FEATURED_SHEET]));
      }

      // Check existing auth session
      const storedUser = localStorage.getItem('examprep_auth_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load saved state', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    try {
      localStorage.setItem('examprep_auth_user', JSON.stringify(newUser));
    } catch (e) {
      console.error('Failed to cache user session', e);
    }
    showToast(`Welcome back, ${newUser.name}! SSO session active.`);
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      localStorage.removeItem('examprep_auth_user');
    } catch (e) {
      console.error('Failed to remove user session', e);
    }
    showToast('Signed out of candidate workstation.');
  };

  const isCurrentSheetSaved = savedSheets.some((s) => s.id === currentSheet.id);

  const handleSaveToBinder = (sheet: CheatSheetItem) => {
    if (isCurrentSheetSaved) {
      const updated = savedSheets.filter((s) => s.id !== sheet.id);
      setSavedSheets(updated);
      localStorage.setItem('examprep_binder_sheets', JSON.stringify(updated));
      showToast('Removed from Revision Binder');
    } else {
      const updated = [sheet, ...savedSheets];
      setSavedSheets(updated);
      localStorage.setItem('examprep_binder_sheets', JSON.stringify(updated));
      showToast('Saved to Revision Binder!');
    }
  };

  const handleDeleteFromBinder = (id: string) => {
    const updated = savedSheets.filter((s) => s.id !== id);
    setSavedSheets(updated);
    localStorage.setItem('examprep_binder_sheets', JSON.stringify(updated));
    showToast('Deleted from Binder');
  };

  const handleClearAllBinder = () => {
    setSavedSheets([]);
    localStorage.removeItem('examprep_binder_sheets');
    showToast('Cleared all binder notes');
  };

  // Generate Cheat Sheet
  const handleGenerate = async () => {
    if (!selectedExam.trim() || !selectedTopic.trim()) {
      setError('Please select an exam and topic.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam: selectedExam,
          topic: selectedTopic,
          mode: selectedMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate revision cheat-sheet');
      }

      const newSheet: CheatSheetItem = {
        id: `sheet-${Date.now()}`,
        exam: data.exam,
        topic: data.topic,
        mode: data.mode,
        content: data.content,
        groundingSources: data.groundingSources || [],
        searchQueries: data.searchQueries || [],
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setCurrentSheet(newSheet);

      // Auto-save generated sheet to binder for quick access
      setSavedSheets((prev) => {
        const filtered = prev.filter((s) => s.topic.toLowerCase() !== newSheet.topic.toLowerCase());
        const nextList = [newSheet, ...filtered];
        localStorage.setItem('examprep_binder_sheets', JSON.stringify(nextList));
        return nextList;
      });

      showToast('New 4-Pillar Cheat Sheet generated & saved!');

      // Smooth scroll down to viewer on mobile
      setTimeout(() => {
        const viewerEl = document.getElementById('cheat-sheet-section');
        viewerEl?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Something went wrong while generating the cheat sheet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0F172A] flex flex-col selection:bg-[#D9F951] selection:text-[#0F172A]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border-2 border-[#0F172A] text-[#0F172A] px-4 py-2.5 rounded-sm shadow-[4px_4px_0_0_#0F172A] flex items-center gap-2 text-xs font-bold animate-fade-in no-print">
          <CheckCircle className="w-5 h-5 text-[#2563EB]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Navigation */}
      <Header
        savedCount={savedSheets.length}
        user={user}
        onOpenBinder={() => setIsBinderOpen(true)}
        onOpenCalculator={() => setIsCalcOpen(true)}
        onOpenInfo={() => setIsInfoOpen(true)}
        onOpenPYQ={() => setIsPYQModalOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-8 no-print border-b-2 border-[#0F172A] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNFMkU4RjAiLz48L3N2Zz4=')]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] text-[#0F172A] text-xs font-bold">
              <Zap className="w-4 h-4 text-[#E11D48]" />
              <span>RRB JE • RRB ALP • SSC JE • SSC CHSL • Govt CBT Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
              High-Yield Revision & Cheat-Sheet Engine for{' '}
              <span className="bg-[#D9F951] px-2 border-2 border-[#0F172A] whitespace-nowrap inline-block rotate-1">
                Government Exams
              </span>
            </h1>

            <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-2xl mx-auto mt-4">
              Synthesize <strong>4-Pillar revision sheets</strong> for RRB & SSC exams: Core Knowledge Base, High-Yield Formulas in LaTeX, Examiner Traps, and Search-Grounded YouTube Marathons. Export directly to <strong>Microsoft Word (.docx)</strong>!
            </p>
          </div>

          {/* Special PYQ Practice Test Callout Box */}
          <div className="mt-8 max-w-4xl mx-auto p-5 rounded-sm bg-white border-2 border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-sm bg-[#2563EB] text-white flex items-center justify-center shrink-0 border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A]">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <span>Upload Previous Year Question (PYQ) Paper</span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm border-2 border-[#0F172A] bg-[#E11D48] text-white">New CBT</span>
                </h2>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Drop past shift PDF or screenshots. AI extracts the pattern & generates custom practice tests with official CBT negative marking!
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPYQModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-sm font-extrabold text-sm text-[#0F172A] bg-[#D9F951] hover:bg-white transition border-2 border-[#0F172A] shadow-[4px_4px_0_0_#0F172A] active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0 cursor-pointer flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Launch PYQ Practice Generator</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-sm bg-white border-2 border-[#E11D48] shadow-[4px_4px_0_0_#E11D48] text-[#0F172A] text-xs sm:text-sm flex items-start gap-3 no-print">
            <AlertCircle className="w-6 h-6 text-[#E11D48] shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-black text-base text-[#E11D48]">Generation Error</strong>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input & Configuration */}
          <div className="lg:col-span-4 space-y-6">
            <ExamSelector
              selectedExam={selectedExam}
              selectedTopic={selectedTopic}
              selectedMode={selectedMode}
              isLoading={isLoading}
              onSelectExam={setSelectedExam}
              onSelectTopic={setSelectedTopic}
              onSelectMode={setSelectedMode}
              onGenerate={handleGenerate}
            />
          </div>

          {/* Right Column: Cheat Sheet Display */}
          <div className="lg:col-span-8">
            <section id="cheat-sheet-section" className="space-y-4">
              <div className="flex items-center justify-between no-print border-b-2 border-slate-200 pb-2 mb-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#0F172A] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#2563EB]" />
                  Active High-Yield Revision Sheet
                </h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-sm border-2 border-slate-300">
                  Target: <strong className="text-[#0F172A]">{currentSheet.exam}</strong>
                </span>
              </div>

              <CheatSheetViewer
                sheet={currentSheet}
                onSaveToBinder={handleSaveToBinder}
                isSaved={isCurrentSheetSaved}
                onStartQuiz={() => setIsQuizOpen(true)}
                onOpenDoubt={() => setIsDoubtOpen(true)}
              />
            </section>
          </div>
        </div>
      </main>

      {/* Print-only footer */}
      <footer className="print-only hidden p-6 text-center text-xs font-bold text-[#0F172A] border-t-2 border-[#0F172A]">
        Generated by ExamPrep AI • High-Yield 4-Pillar Revision Engine for {currentSheet.exam} ({currentSheet.topic})
      </footer>

      {/* Screen footer */}
      <footer className="border-t-2 border-[#0F172A] bg-white py-6 text-center text-xs font-bold text-slate-600 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ExamPrep AI. No fluff, just high-yield study material.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[#0F172A]">
            <button onClick={() => setIsAuthOpen(true)} className="hover:underline underline-offset-4 decoration-2 decoration-[#0F172A]">
              {user ? `Candidate Profile (${user.name})` : 'Enterprise Login / Sign Up'}
            </button>
            <button onClick={() => setIsInfoOpen(true)} className="hover:underline underline-offset-4 decoration-2 decoration-[#2563EB]">
              AI Architecture
            </button>
            <button onClick={() => setIsCalcOpen(true)} className="hover:underline underline-offset-4 decoration-2 decoration-[#E11D48]">
              Formula Speed Calc
            </button>
            <button onClick={() => setIsBinderOpen(true)} className="hover:underline underline-offset-4 decoration-2 decoration-[#D9F951]">
              Revision Binder ({savedSheets.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EnterpriseAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <DiagnosticQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        exam={currentSheet.exam}
        topic={currentSheet.topic}
      />
      <AskDoubtDrawer
        isOpen={isDoubtOpen}
        onClose={() => setIsDoubtOpen(false)}
        exam={currentSheet.exam}
        topic={currentSheet.topic}
        snippet={currentSheet.content.slice(0, 800)}
      />
      <RevisionBinderModal
        isOpen={isBinderOpen}
        onClose={() => setIsBinderOpen(false)}
        sheets={savedSheets}
        onSelectSheet={(s) => setCurrentSheet(s)}
        onDeleteSheet={handleDeleteFromBinder}
        onClearAll={handleClearAllBinder}
      />
      <QuickCalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />
      <ArchitectureInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
      <PYQUploaderModal
        isOpen={isPYQModalOpen}
        onClose={() => setIsPYQModalOpen(false)}
        defaultExam={selectedExam}
      />
    </div>
  );
}
