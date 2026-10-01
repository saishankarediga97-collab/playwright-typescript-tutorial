import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LessonViewer } from './components/LessonViewer';
import { CodePlayground } from './components/CodePlayground';
import { PlaywrightSimulator } from './components/PlaywrightSimulator';
import { FrameworkExplorer } from './components/FrameworkExplorer';
import { QuizModal } from './components/QuizModal';
import { SearchModal } from './components/SearchModal';
import { typescriptLessons } from './data/typescriptLessons';
import { dsaLessons } from './data/dsaLessons';
import { playwrightLessons } from './data/playwrightLessons';
import { apiLessons } from './data/apiLessons';
import { Lesson, ModuleId } from './types/curriculum';

export function App() {
  const [currentModule, setCurrentModule] = useState<ModuleId | 'playground' | 'simulator'>('typescript');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(typescriptLessons[0].id);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pw_ts_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [playgroundCode, setPlaygroundCode] = useState<string>('');

  // Persist completed lessons
  useEffect(() => {
    try {
      localStorage.setItem('pw_ts_completed_lessons', JSON.stringify(completedLessonIds));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [completedLessonIds]);

  // Global Ctrl+K / Cmd+K search listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // All lessons combined for search and stats
  const allLessons: Lesson[] = [
    ...typescriptLessons,
    ...dsaLessons,
    ...playwrightLessons,
    ...apiLessons,
  ];

  // Lessons for current active module
  const currentModuleLessons: Lesson[] = (() => {
    switch (currentModule) {
      case 'typescript':
        return typescriptLessons;
      case 'dsa':
        return dsaLessons;
      case 'playwright':
        return playwrightLessons;
      case 'api':
        return apiLessons;
      default:
        return typescriptLessons;
    }
  })();

  const currentLesson: Lesson =
    allLessons.find((l) => l.id === selectedLessonId) || currentModuleLessons[0];

  const handleToggleComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const handleSelectModule = (mod: ModuleId | 'playground' | 'simulator') => {
    setCurrentModule(mod);
    if (mod === 'typescript') setSelectedLessonId(typescriptLessons[0].id);
    else if (mod === 'dsa') setSelectedLessonId(dsaLessons[0].id);
    else if (mod === 'playwright') setSelectedLessonId(playwrightLessons[0].id);
    else if (mod === 'api') setSelectedLessonId(apiLessons[0].id);
  };

  const handleSelectLessonFromSearch = (lessonId: string, moduleId: ModuleId) => {
    setCurrentModule(moduleId);
    setSelectedLessonId(lessonId);
  };

  const handleOpenInPlayground = (code: string) => {
    setPlaygroundCode(code);
    setCurrentModule('playground');
  };

  // Lesson previous / next navigation
  const currentIndex = currentModuleLessons.findIndex((l) => l.id === selectedLessonId);
  const prevLesson = currentIndex > 0 ? currentModuleLessons[currentIndex - 1] : undefined;
  const nextLesson =
    currentIndex < currentModuleLessons.length - 1
      ? currentModuleLessons[currentIndex + 1]
      : undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Navbar */}
      <Navbar
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
        completedLessonCount={completedLessonIds.length}
        totalLessonCount={allLessons.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden">
        {currentModule === 'playground' ? (
          <CodePlayground initialCode={playgroundCode} />
        ) : currentModule === 'simulator' ? (
          <PlaywrightSimulator />
        ) : currentModule === 'framework' ? (
          <FrameworkExplorer />
        ) : (
          <div className="mx-auto flex h-full w-full max-w-7xl overflow-hidden px-4 sm:px-6">
            <Sidebar
              currentModule={currentModule}
              lessons={currentModuleLessons}
              selectedLessonId={selectedLessonId}
              onSelectLesson={setSelectedLessonId}
              completedLessonIds={completedLessonIds}
              onToggleComplete={handleToggleComplete}
              onSelectModule={(mod) => handleSelectModule(mod)}
            />

            <LessonViewer
              lesson={currentLesson}
              isCompleted={completedLessonIds.includes(currentLesson.id)}
              onToggleComplete={() => handleToggleComplete(currentLesson.id)}
              onPrevLesson={prevLesson ? () => setSelectedLessonId(prevLesson.id) : undefined}
              onNextLesson={nextLesson ? () => setSelectedLessonId(nextLesson.id) : undefined}
              onOpenInPlayground={handleOpenInPlayground}
            />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        lessons={allLessons}
        onSelectLesson={handleSelectLessonFromSearch}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </div>
  );
}

export default App;
