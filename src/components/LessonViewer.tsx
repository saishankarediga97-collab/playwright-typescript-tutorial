import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Play, 
  Copy, 
  Check, 
  Lightbulb, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  Code
} from 'lucide-react';
import type { Lesson, CodeSnippet } from '../types/curriculum';

interface LessonViewerProps {
  lesson: Lesson;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onPrevLesson?: () => void;
  onNextLesson?: () => void;
  onOpenInPlayground: (code: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  isCompleted,
  onToggleComplete,
  onPrevLesson,
  onNextLesson,
  onOpenInPlayground,
}) => {
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedMap((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 overflow-visible px-0 py-6 sm:px-2 sm:py-8 lg:overflow-y-auto lg:px-6 lg:h-[calc(100dvh-4rem)]">
      {/* Header Info */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
              lesson.level === 'Production'
                ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                : lesson.level === 'Advanced'
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : lesson.level === 'Intermediate'
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
            }`}
          >
            {lesson.level}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            {lesson.readingTime}
          </span>
          <div className="flex flex-wrap items-center gap-1.5 md:ml-auto">
            {lesson.tags.map((tag) => (
              <span
                key={tag}
                className="hidden sm:inline-block rounded-md bg-slate-900 border border-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          {lesson.title}
        </h1>
        <p className="text-base text-slate-300">
          {lesson.subtitle}
        </p>

        {/* Action Bar */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={onToggleComplete}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all border ${
              isCompleted
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Circle className="h-4 w-4 text-slate-400" />
                <span>Mark as Complete</span>
              </>
            )}
          </button>

          {lesson.playgroundCode && (
            <button
              onClick={() => onOpenInPlayground(lesson.playgroundCode!)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-all"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Launch Live Playground</span>
            </button>
          )}
        </div>
      </div>

      {/* Overview Card */}
      <div className="my-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 sm:p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2 mb-2">
          <Info className="h-4 w-4" /> Lesson Overview
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          {lesson.overview}
        </p>
      </div>

      {/* Key Takeaways */}
      {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-amber-400" /> Key Architectural Takeaways
          </h2>
          <ul className="space-y-2">
            {lesson.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-400 border border-blue-500/20">
                  {idx + 1}
                </span>
                <span className="leading-snug">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-8">
        {lesson.sections.map((section) => (
          <section key={section.id} className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-100 border-b border-slate-800/80 pb-2">
              {section.title}
            </h2>

            {/* Content text */}
            <div className="max-w-none whitespace-pre-line font-sans text-sm leading-relaxed text-slate-300">
              {section.content}
            </div>

            {/* Callouts */}
            {section.callout && (
              <div
                className={`rounded-xl border p-4 ${
                  section.callout.type === 'production'
                    ? 'border-purple-500/30 bg-purple-500/10 text-purple-200'
                    : section.callout.type === 'tip'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                    : section.callout.type === 'warning'
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                    : 'border-blue-500/30 bg-blue-500/10 text-blue-200'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-xs mb-1.5 uppercase tracking-wide">
                  {section.callout.type === 'production' && <ShieldCheck className="h-4 w-4 text-purple-400" />}
                  {section.callout.type === 'tip' && <Lightbulb className="h-4 w-4 text-emerald-400" />}
                  {section.callout.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-400" />}
                  {section.callout.type === 'info' && <Info className="h-4 w-4 text-blue-400" />}
                  <span>{section.callout.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {section.callout.text}
                </p>
              </div>
            )}

            {/* Code Snippet */}
            {section.snippet && (
              <CodeBlockCard
                snippet={section.snippet}
                onCopy={handleCopy}
                isCopied={copiedMap[section.snippet.title] || false}
                onRunInPlayground={onOpenInPlayground}
              />
            )}
          </section>
        ))}
      </div>

      {/* Lesson Navigation Footer */}
      <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
        {onPrevLesson ? (
          <button
            onClick={onPrevLesson}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all sm:w-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Previous Lesson
          </button>
        ) : <div />}

        {onNextLesson ? (
          <button
            onClick={onNextLesson}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-all sm:w-auto"
          >
            Next Lesson <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={onToggleComplete}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all sm:w-auto"
          >
            <Check className="h-3.5 w-3.5" /> Complete Track
          </button>
        )}
      </div>
    </div>
  );
};

interface CodeBlockCardProps {
  snippet: CodeSnippet;
  isCopied: boolean;
  onCopy: (code: string, id: string) => void;
  onRunInPlayground: (code: string) => void;
}

const CodeBlockCard: React.FC<CodeBlockCardProps> = ({
  snippet,
  isCopied,
  onCopy,
  onRunInPlayground,
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md">
      {/* Code Header */}
      <div className="flex flex-col gap-3 border-b border-slate-800/80 bg-slate-900/80 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Code className="h-4 w-4 text-blue-400" />
          <span className="truncate text-xs font-medium text-slate-300 font-mono">
            {snippet.title}
          </span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            {snippet.language}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {snippet.runnable && (
            <button
              onClick={() => onRunInPlayground(snippet.code)}
              className="flex items-center gap-1.5 rounded-md bg-blue-600/20 border border-blue-500/30 px-2.5 py-1 text-[11px] font-medium text-blue-300 hover:bg-blue-600/30 transition-colors"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Run Code</span>
            </button>
          )}

          <button
            onClick={() => onCopy(snippet.code, snippet.title)}
            className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed bg-[#0a0e17]">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
};
