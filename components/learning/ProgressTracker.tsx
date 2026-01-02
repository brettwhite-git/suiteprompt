'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserProgress, LearningPath, Module } from '@/types';
import learningPathsData from '@/data/learning-paths.json';

interface ProgressTrackerProps {
  pathId: string;
  onModuleClick?: (moduleId: string) => void;
}

export default function ProgressTracker({
  pathId,
  onModuleClick,
}: ProgressTrackerProps) {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const path = (learningPathsData.paths as LearningPath[]).find(
    (p) => p.id === pathId
  );

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem(`progress-${pathId}`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    } else {
      // Initialize progress for all modules
      const initialProgress: UserProgress[] =
        path?.modules.map((module) => ({
          pathId,
          moduleId: module.id,
          completed: false,
          progress: 0,
          lastAccessed: new Date().toISOString(),
        })) || [];
      setProgress(initialProgress);
      localStorage.setItem(
        `progress-${pathId}`,
        JSON.stringify(initialProgress)
      );
    }
  }, [pathId, path]);

  const updateProgress = (
    moduleId: string,
    completed: boolean,
    progressValue: number
  ) => {
    const updated = progress.map((p) =>
      p.moduleId === moduleId
        ? {
            ...p,
            completed,
            progress: progressValue,
            lastAccessed: new Date().toISOString(),
          }
        : p
    );
    setProgress(updated);
    localStorage.setItem(`progress-${pathId}`, JSON.stringify(updated));
  };

  const getModuleProgress = (moduleId: string): UserProgress | undefined => {
    return progress.find((p) => p.moduleId === moduleId);
  };

  const getOverallProgress = (): number => {
    if (!path || progress.length === 0) return 0;
    const completed = progress.filter((p) => p.completed).length;
    return Math.round((completed / path.modules.length) * 100);
  };

  if (!path) {
    return <div>Path not found</div>;
  }

  const overallProgress = getOverallProgress();

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-lg border border-border">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-foreground">{path.title}</h2>
          <span className="text-lg font-semibold text-primary">
            {overallProgress}% Complete
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <motion.div
            className="bg-primary h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {path.modules.map((module, index) => {
          const moduleProgress = getModuleProgress(module.id);
          const isCompleted = moduleProgress?.completed || false;
          const progressValue = moduleProgress?.progress || 0;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isCompleted
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary hover:bg-primary/5'
              }`}
              onClick={() => onModuleClick?.(module.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    ) : progressValue > 0 ? (
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold">
                          {progressValue}%
                        </span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-muted-foreground font-semibold">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Module Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {module.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                    {progressValue > 0 && !isCompleted && (
                      <div className="mt-2 w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${progressValue}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="flex-shrink-0 text-sm text-muted-foreground">
                    {module.duration}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => {
            // Reset all progress
            const reset: UserProgress[] = path.modules.map((module) => ({
              pathId,
              moduleId: module.id,
              completed: false,
              progress: 0,
              lastAccessed: new Date().toISOString(),
            }));
            setProgress(reset);
            localStorage.setItem(`progress-${pathId}`, JSON.stringify(reset));
          }}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-semibold"
        >
          Reset Progress
        </button>
        <button
          onClick={() => {
            // Mark all as completed (for testing)
            const allCompleted: UserProgress[] = path.modules.map((module) => ({
              pathId,
              moduleId: module.id,
              completed: true,
              progress: 100,
              lastAccessed: new Date().toISOString(),
            }));
            setProgress(allCompleted);
            localStorage.setItem(
              `progress-${pathId}`,
              JSON.stringify(allCompleted)
            );
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          Mark All Complete
        </button>
      </div>
    </div>
  );
}

