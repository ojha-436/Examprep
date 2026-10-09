import React, { useState } from 'react';
import { X, Search, Bookmark, Trash2, ExternalLink, Download, FileText } from 'lucide-react';
import { CheatSheetItem } from '../data/examData';

interface RevisionBinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheets: CheatSheetItem[];
  onSelectSheet: (sheet: CheatSheetItem) => void;
  onDeleteSheet: (id: string) => void;
  onClearAll: () => void;
}

export const RevisionBinderModal: React.FC<RevisionBinderModalProps> = ({
  isOpen,
  onClose,
  sheets,
  onSelectSheet,
  onDeleteSheet,
  onClearAll,
}) => {
  const [filterExam, setFilterExam] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  if (!isOpen) return null;

  const uniqueExams = ['All', ...Array.from(new Set(sheets.map((s) => s.exam)))];

  const filtered = sheets.filter((s) => {
    const matchesExam = filterExam === 'All' || s.exam === filterExam;
    const matchesSearch =
      s.topic.toLowerCase().includes(search.toLowerCase()) ||
      s.exam.toLowerCase().includes(search.toLowerCase()) ||
      s.content.toLowerCase().includes(search.toLowerCase());
    return matchesExam && matchesSearch;
  });

  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(sheets, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ExamPrepAI_RevisionBinder_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-2 border-[#0F172A] rounded-sm w-full max-w-3xl max-h-[85vh] flex flex-col shadow-[10px_10px_0px_0px_#0F172A] overflow-hidden my-auto animate-fade-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#0F172A] bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#D9F951] border-2 border-[#0F172A] text-[#0F172A] flex items-center justify-center shadow-[2px_2px_0px_0px_#0F172A]">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                  My Revision Binder
                </h3>
                <span className="px-2 py-0.5 rounded-sm text-[10px] font-black bg-[#2563EB] text-white border-2 border-[#0F172A]">
                  {sheets.length} Sheets
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                Saved high-yield sheets ready for instant offline revision
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {sheets.length > 0 && (
              <button
                onClick={exportAsJSON}
                className="px-3 py-1.5 rounded-sm border-2 border-[#0F172A] bg-white hover:bg-[#D9F951] text-[#0F172A] font-bold text-xs flex items-center gap-1.5 transition shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                title="Export all sheets as JSON backup"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Export JSON</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-sm border-2 border-[#0F172A] bg-white hover:bg-[#E11D48] hover:text-white transition shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b-2 border-[#0F172A] bg-[#FDFBF7] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 stroke-[2.5]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across topics and formulas..."
              className="w-full bg-white border-2 border-[#0F172A] rounded-sm pl-9 pr-3 py-2 text-xs font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-[#D9F951]/10 focus:shadow-[2px_2px_0px_0px_#0F172A] shadow-[2px_2px_0px_0px_#0F172A]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {uniqueExams.map((examName) => (
              <button
                key={examName}
                onClick={() => setFilterExam(examName)}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold whitespace-nowrap transition border-2 border-[#0F172A] cursor-pointer ${
                  filterExam === examName
                    ? 'bg-[#0F172A] text-white shadow-[2px_2px_0px_0px_#0F172A]'
                    : 'bg-white text-[#0F172A] hover:bg-[#D9F951] shadow-[1px_1px_0px_0px_#0F172A]'
                }`}
              >
                {examName}
              </button>
            ))}
          </div>
        </div>

        {/* List of Sheets */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 bg-[#FDFBF7]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <FileText className="w-12 h-12 text-slate-400 mx-auto stroke-[1.5]" />
              <h4 className="text-sm font-black text-[#0F172A] uppercase">No Revision Sheets Found</h4>
              <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
                Generate high-yield notes using the 4-Pillar engine and tap "Save" to build your private revision binder.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-sm bg-white border-2 border-[#0F172A] hover:bg-slate-50 transition flex items-center justify-between gap-3 group shadow-[3px_3px_0px_0px_#0F172A] hover:-translate-y-0.5"
              >
                <div
                  onClick={() => {
                    onSelectSheet(item);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-sm bg-[#2563EB] text-white text-[10px] font-black border border-[#0F172A]">
                      {item.exam}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 border border-slate-300">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#0F172A] group-hover:text-[#2563EB] transition truncate">
                    {item.topic}
                  </h4>
                  <p className="text-xs font-medium text-slate-600 truncate mt-1">
                    {item.content.slice(0, 100).replace(/[#*`]/g, '')}...
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectSheet(item);
                      onClose();
                    }}
                    className="p-2 rounded-sm bg-white hover:bg-[#D9F951] text-[#0F172A] border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs transition cursor-pointer"
                    title="Open sheet"
                  >
                    <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => onDeleteSheet(item.id)}
                    className="p-2 rounded-sm bg-white hover:bg-[#E11D48] hover:text-white text-[#E11D48] border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs transition cursor-pointer"
                    title="Delete sheet"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {sheets.length > 0 && (
          <div className="p-3 sm:p-4 border-t-2 border-[#0F172A] bg-white flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Stored locally in browser</span>
            <button
              onClick={onClearAll}
              className="text-[#E11D48] hover:underline font-black cursor-pointer"
            >
              Clear all binder notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
