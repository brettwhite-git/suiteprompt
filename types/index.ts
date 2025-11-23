export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  prerequisites: string[];
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
}

export interface Concept {
  id: string;
  title: string;
  category: string;
  simpleExplanation: string;
  technicalDetails: string;
  visualType: string;
  commonMistakes: string[];
  realWorldExample: string;
}

export interface Exercise {
  id: string;
  title: string;
  path: string;
  difficulty: string;
  estimatedTime: string;
  description: string;
  steps: ExerciseStep[];
  solution: string;
  hints: string[];
}

export interface ExerciseStep {
  step: number;
  title: string;
  description: string;
  code: string;
}

export interface UserProgress {
  pathId: string;
  moduleId: string;
  completed: boolean;
  progress: number;
  lastAccessed: Date;
}

