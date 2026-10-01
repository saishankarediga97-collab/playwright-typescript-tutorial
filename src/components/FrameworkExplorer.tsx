import React, { useState } from 'react';
import { 
  FolderGit2, 
  FileCode, 
  Settings, 
  Globe, 
  Sparkles, 
  Copy, 
  Check, 
  ShieldCheck, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { frameworkFiles } from '../data/frameworkFiles';
import type { FrameworkFile } from '../types/curriculum';

export const FrameworkExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FrameworkFile>(frameworkFiles[0]);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'config':
        return <Settings className="h-4 w-4 text-amber-400" />;
      case 'pages':
        return <Layers className="h-4 w-4 text-blue-400" />;
      case 'fixtures':
        return <Sparkles className="h-4 w-4 text-purple-400" />;
      case 'api':
        return <Globe className="h-4 w-4 text-cyan-400" />;
      case 'tests':
        return <FileCode className="h-4 w-4 text-emerald-400" />;
      default:
        return <FileCode className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-7xl flex-col p-4 sm:p-6 lg:h-[calc(100dvh-4rem)] lg:min-h-0">
      {/* Top Banner */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <FolderGit2 className="h-5 w-5 text-blue-400" />
          <h1 className="text-lg font-bold text-slate-100 sm:text-xl">
            Enterprise Playwright + TypeScript Architecture Explorer
          </h1>
          <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-blue-300">
            Production Blueprint
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Explore complete production code files for configs, BasePage, POM with chained promises, API client, custom fixtures, and test specs.
        </p>
      </div>

      {/* Explorer Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 min-h-0">
        {/* Left Side (4 Cols): File Tree */}
          <div className="flex min-h-[20rem] flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-lg lg:col-span-4 lg:min-h-0">
          <div className="border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Structure
            </span>
            <span className="text-[11px] text-slate-500 font-mono">playwright-enterprise/</span>
          </div>

          <div className="p-3 overflow-y-auto flex-1 space-y-1">
            {frameworkFiles.map((file) => {
              const isSelected = file.path === selectedFile.path;

              return (
                <div
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-mono transition-all cursor-pointer border ${
                    isSelected
                      ? 'border-blue-500/50 bg-blue-500/15 text-blue-200 shadow-sm font-semibold'
                      : 'border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/70 hover:text-slate-200'
                  }`}
                >
                  {getCategoryIcon(file.category)}
                  <span className="truncate flex-1">{file.path}</span>
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform ${
                      isSelected ? 'text-blue-400 translate-x-0.5' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Quick Stats in File Tree Footer */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Total Framework Modules:</span>
              <span className="font-semibold text-slate-200">{frameworkFiles.length} files</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pattern:</span>
              <span className="text-blue-400 font-semibold">POM + Chained Promises</span>
            </div>
          </div>
        </div>

        {/* Right Side (8 Cols): Code Viewer & Architectural Highlights */}
          <div className="flex min-h-[26rem] flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-lg lg:col-span-8 lg:min-h-0">
          {/* Header Bar */}
            <div className="flex flex-col gap-3 border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2 font-mono text-xs text-slate-200">
                {getCategoryIcon(selectedFile.category)}
                <span className="truncate font-semibold">{selectedFile.path}</span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-sans uppercase font-bold">
                  {selectedFile.category}
                </span>
              </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 hover:border-slate-600 hover:text-white transition-all shadow-sm"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copy File Code</span>
                </>
              )}
            </button>
          </div>

          {/* Description & Highlights Box */}
          <div className="border-b border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
              {selectedFile.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {selectedFile.keyHighlights.map((hl, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-300 flex items-center gap-1"
                >
                  <ShieldCheck className="h-3 w-3 text-blue-400" />
                  {hl}
                </span>
              ))}
            </div>
          </div>

          {/* Code Viewer */}
          <pre className="flex-1 overflow-x-auto overflow-y-auto bg-[#0a0e17] p-4 text-xs font-mono leading-relaxed text-slate-200">
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
