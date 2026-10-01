import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Layers, Sparkles, Globe, ArrowRight } from 'lucide-react';
import type { Lesson, ModuleId } from '../types/curriculum';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson[];
  onSelectLesson: (lessonId: string, moduleId: ModuleId) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  lessons,
  onSelectLesson,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = lessons.filter((lesson) => {
    const q = searchQuery.toLowerCase();
    const inTitle = lesson.title.toLowerCase().includes(q);
    const inSubtitle = lesson.subtitle.toLowerCase().includes(q);
    const inTags = lesson.tags.some((t) => t.toLowerCase().includes(q));
    const inSections = lesson.sections.some(
      (s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
    );
    return inTitle || inSubtitle || inTags || inSections;
  });

  const getModuleIcon = (mod: ModuleId) => {
    switch (mod) {
      case 'typescript':
        return <BookOpen className="h-4 w-4 text-blue-400" />;
      case 'dsa':
        return <Layers className="h-4 w-4 text-purple-400" />;
      case 'playwright':
        return <Sparkles className="h-4 w-4 text-emerald-400" />;
      case 'api':
        return <Globe className="h-4 w-4 text-cyan-400" />;
      default:
        return <BookOpen className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 p-3 pt-14 backdrop-blur-sm sm:p-4 sm:pt-20">
      <div className="flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl sm:max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3 bg-slate-950">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search TypeScript, Generics, BST, POM Chaining, API testing..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto flex-1 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching curriculum topics found for "{searchQuery}"
            </div>
          ) : (
            filtered.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => {
                  onSelectLesson(lesson.id, lesson.moduleId);
                  onClose();
                }}
                className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-800/60 transition-all cursor-pointer group border border-transparent hover:border-slate-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 shrink-0">
                  {getModuleIcon(lesson.moduleId)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-100 group-hover:text-blue-300 transition-colors truncate">
                      {lesson.title}
                    </span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 uppercase">
                      {lesson.moduleId}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {lesson.subtitle}
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 text-slate-600 opacity-0 group-hover:opacity-100 group-hover:text-blue-400 transition-all" />
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col gap-1 border-t border-slate-800 bg-slate-950/70 px-4 py-2 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>{filtered.length} topics available</span>
          <span>ESC to close • ⌘K</span>
        </div>
      </div>
    </div>
  );
};
