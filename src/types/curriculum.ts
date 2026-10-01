export type ModuleId = 'typescript' | 'dsa' | 'playwright' | 'api' | 'framework';

export interface CodeSnippet {
  title: string;
  language: 'typescript' | 'javascript' | 'json';
  code: string;
  description?: string;
  runnable?: boolean;
}

export interface LessonSection {
  id: string;
  title: string;
  content: string; // Markdown or rich text
  callout?: {
    type: 'tip' | 'info' | 'warning' | 'production';
    title: string;
    text: string;
  };
  snippet?: CodeSnippet;
  diagram?: string;
}

export interface Lesson {
  id: string;
  moduleId: ModuleId;
  title: string;
  subtitle: string;
  readingTime: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Production';
  tags: string[];
  overview: string;
  sections: LessonSection[];
  playgroundCode?: string;
  keyTakeaways: string[];
}

export interface FrameworkFile {
  path: string;
  filename: string;
  category: 'config' | 'pages' | 'tests' | 'fixtures' | 'api' | 'utils';
  language: string;
  code: string;
  description: string;
  keyHighlights: string[];
}

export interface QuizQuestion {
  id: string;
  module: ModuleId;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  codeSnippet?: string;
}
