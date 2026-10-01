import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  Sparkles, 
  Globe, 
  FolderGit2,
  Filter
} from 'lucide-react';
import { Lesson, ModuleId } from '../types/curriculum';

interface SidebarProps {
  currentModule: ModuleId | 'playground' | 'simulator';
  lessons: Lesson[];
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  completedLessonIds: string[];
  onToggleComplete: (lessonId: string) => void;
  onSelectModule: (moduleId: ModuleId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  lessons,
  selectedLessonId,
  onSelectLesson,
  completedLessonIds,
  onToggleComplete,
  onSelectModule,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const filteredLessons = lessons.filter((lesson) => {
    if (filterLevel === 'all') return true;
    return lesson.level.toLowerCase() === filterLevel.toLowerCase();
  });

  return (
    <aside className="w-80 flex-shrink-0 border-r border-slate-800 bg-slate-950/70 p-4 overflow-y-auto h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div>
        {/* Module Switcher in Mobile/Compact */}
        <div className="lg:hidden mb-4 space-y-1">
          <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Select Track
          </label>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => onSelectModule('typescript')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                currentModule === 'typescript'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-800 text-slate-400'
              }`}
            >
              <BookOpen className="h-3 w-3" /> TypeScript
            </button>
            <button
              onClick={() => onSelectModule('dsa')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                currentModule === 'dsa'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-800 text-slate-400'
              }`}
            >
              <Layers className="h-3 w-3" /> DSA
            </button>
            <button
              onClick={() => onSelectModule('playwright')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                currentModule === 'playwright'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-800 text-slate-400'
              }`}
            >
              <Sparkles className="h-3 w-3" /> Playwright
            </button>
            <button
              onClick={() => onSelectModule('api')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                currentModule === 'api'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-800 text-slate-400'
              }`}
            >
              <Globe className="h-3 w-3" /> API Testing
            </button>
          </div>
        </div>

        {/* Section Header with Level Filter */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Curriculum Outline
            </span>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
              {filteredLessons.length}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Filter className="h-3 w-3 text-slate-400" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              aria-label="Filter lessons by difficulty level"
              className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="production">Production</option>
            </select>
          </div>
        </div>

        {/* Lesson Items */}
        <div className="space-y-1.5">
          {filteredLessons.map((lesson) => {
            const isSelected = lesson.id === selectedLessonId;
            const isCompleted = completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className={`group flex items-start gap-2.5 rounded-xl p-2.5 transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-blue-500/50 bg-blue-500/10 shadow-sm'
                    : 'border-transparent hover:border-slate-800 hover:bg-slate-900/60'
                }`}
                onClick={() => onSelectLesson(lesson.id)}
              >
                {/* Completion Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(lesson.id);
                  }}
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                  title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-400 group-hover:text-slate-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3
                      className={`text-xs font-semibold leading-snug truncate ${
                        isSelected ? 'text-blue-300' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {lesson.title}
                    </h3>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {lesson.subtitle}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-semibold border ${
                        lesson.level === 'Production'
                          ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                          : lesson.level === 'Advanced'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                          : lesson.level === 'Intermediate'
                          ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      }`}
                    >
                      {lesson.level}
                    </span>

                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="h-2.5 w-2.5" />
                      {lesson.readingTime}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    isSelected ? 'text-blue-400 translate-x-0.5' : 'text-slate-700 opacity-0 group-hover:opacity-100'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Enterprise Framework Quick Link */}
      <div className="mt-6 rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-3.5">
        <div className="flex items-center gap-2 text-slate-200">
          <FolderGit2 className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-semibold">Production Repo</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Explore complete production configs, fixtures, POMs, and API tests.
        </p>
        <button
          onClick={() => onSelectModule('framework' as ModuleId)}
          className="mt-2.5 w-full rounded-lg bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-600/30 transition-colors text-center"
        >
          View Full Framework Repo →
        </button>
      </div>
    </aside>
  );
};
