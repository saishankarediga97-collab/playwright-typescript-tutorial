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
  Play,
  Moon,
  Sun
} from 'lucide-react';
import type { ModuleId } from '../types/curriculum';

interface NavbarProps {
  currentModule: ModuleId | 'playground' | 'simulator';
  onSelectModule: (module: ModuleId | 'playground' | 'simulator') => void;
  completedLessonCount: number;
  totalLessonCount: number;
  onOpenSearch: () => void;
  onOpenQuiz: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentModule,
  onSelectModule,
  completedLessonCount,
  totalLessonCount,
  onOpenSearch,
  onOpenQuiz,
  theme,
  onToggleTheme,
}) => {
const percentComplete = totalLessonCount > 0 
    ? Math.round((completedLessonCount / totalLessonCount) * 100) 
    : 0;

  const navItems: Array<{
    id: ModuleId | 'playground' | 'simulator';
    label: string;
    icon: typeof Code2;
    activeClass: string;
    idleClass: string;
  }> = [
    {
      id: 'typescript',
      label: 'TypeScript',
      icon: Code2,
      activeClass: 'bg-blue-600 text-white shadow-sm',
      idleClass: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
    },
    {
      id: 'dsa',
      label: 'DSA in TS',
      icon: Layers,
      activeClass: 'bg-blue-600 text-white shadow-sm',
      idleClass: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
    },
    {
      id: 'playwright',
      label: 'Playwright POM',
      icon: Sparkles,
      activeClass: 'bg-blue-600 text-white shadow-sm',
      idleClass: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
    },
    {
      id: 'api',
      label: 'API Testing',
      icon: Globe,
      activeClass: 'bg-blue-600 text-white shadow-sm',
      idleClass: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
    },
    {
      id: 'framework',
      label: 'Framework Code',
      icon: FolderGit2,
      activeClass: 'bg-blue-600 text-white shadow-sm',
      idleClass: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
    },
    {
      id: 'simulator',
      label: 'PW Simulator',
      icon: Play,
      activeClass: 'bg-emerald-600 text-white shadow-sm',
      idleClass: 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40',
    },
    {
      id: 'playground',
      label: 'TS Runner',
      icon: Terminal,
      activeClass: 'bg-indigo-600 text-white shadow-sm',
      idleClass: 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr),auto] items-center gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[auto,minmax(0,1fr),auto]">
        {/* Brand / Logo */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Code2 className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-100 tracking-tight text-base sm:text-lg">TS & Playwright</span>
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 sm:text-xs">
                Production Masterclass
              </span>
            </div>
            <p className="hidden truncate text-xs text-slate-400 sm:block">TypeScript • DSA • POM Chaining • API Automation</p>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="hidden min-w-0 justify-center lg:flex">
          <nav className="flex items-center gap-1 rounded-xl border border-slate-800/80 bg-slate-900/80 p-1">
            {navItems.map(({ id, label, icon: Icon, activeClass, idleClass }) => (
              <button
                key={id}
                onClick={() => onSelectModule(id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  currentModule === id ? activeClass : idleClass
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${id === 'simulator' ? 'fill-current' : ''}`} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Action Controls & Progress */}
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <button
            onClick={onToggleTheme}
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-indigo-500" />
            )}
            <span className="hidden md:inline">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
            title="Search topics and code (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden sm:inline rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Knowledge Check / Quiz Button */}
          <button
            onClick={onOpenQuiz}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-colors"
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

        <div className="col-span-full lg:hidden">
          <nav className="mobile-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
            {navItems.map(({ id, label, icon: Icon, activeClass, idleClass }) => (
              <button
                key={id}
                onClick={() => onSelectModule(id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium transition-all ${
                  currentModule === id ? activeClass : idleClass
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${id === 'simulator' ? 'fill-current' : ''}`} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
