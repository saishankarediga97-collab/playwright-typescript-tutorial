import React from 'react';
import { 
  Code2, 
  Terminal, 
  Layers, 
  Globe, 
  FolderGit2, 
  Search, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles,
  Play
} from 'lucide-react';
import { ModuleId } from '../types/curriculum';

interface NavbarProps {
  currentModule: ModuleId | 'playground' | 'simulator';
  onSelectModule: (module: ModuleId | 'playground' | 'simulator') => void;
  completedLessonCount: number;
  totalLessonCount: number;
  onOpenSearch: () => void;
  onOpenQuiz: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentModule,
  onSelectModule,
  completedLessonCount,
  totalLessonCount,
  onOpenSearch,
  onOpenQuiz,
}) => {
  const percentComplete = totalLessonCount > 0 
    ? Math.round((completedLessonCount / totalLessonCount) * 100) 
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Code2 className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-tight text-lg">TS & Playwright</span>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
                Production Masterclass
              </span>
            </div>
            <p className="text-xs text-slate-400">TypeScript • DSA • POM Chaining • API Automation</p>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-900/80 p-1 border border-slate-800/80">
          <button
            onClick={() => onSelectModule('typescript')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentModule === 'typescript'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            TypeScript
          </button>

          <button
            onClick={() => onSelectModule('dsa')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentModule === 'dsa'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            DSA in TS
          </button>

          <button
            onClick={() => onSelectModule('playwright')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentModule === 'playwright'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Playwright POM
          </button>

          <button
            onClick={() => onSelectModule('api')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentModule === 'api'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            API Testing
          </button>

          <button
            onClick={() => onSelectModule('framework')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentModule === 'framework'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FolderGit2 className="h-3.5 w-3.5" />
            Framework Code
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          {/* Interactive Tools */}
          <button
            onClick={() => onSelectModule('simulator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentModule === 'simulator'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
            }`}
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            PW Simulator
          </button>

          <button
            onClick={() => onSelectModule('playground')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentModule === 'playground'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            TS Runner
          </button>
        </nav>

        {/* Action Controls & Progress */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
            title="Search topics and code (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Knowledge Check / Quiz Button */}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
            <span>Quiz</span>
          </button>

          {/* Progress Tracker Pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-300">
                {percentComplete}% Completed
              </span>
              <div className="h-1 w-16 overflow-hidden rounded-full bg-slate-800 mt-0.5">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
