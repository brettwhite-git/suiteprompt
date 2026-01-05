'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import learningPathsData from '@/data/learning-paths.json';
import { LearningPath, Module, UserProgress } from '@/types';
import { loadMDXModule } from '@/lib/mdx-loader';

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const pathId = params.path as string;
  const moduleId = params.module as string;

  const [MDXContent, setMDXContent] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const path = (learningPathsData.paths as LearningPath[]).find(
    (p) => p.id === pathId
  );
  const module = path?.modules.find((m) => m.id === moduleId);
  const moduleIndex = path?.modules.findIndex((m) => m.id === moduleId) ?? -1;
  const previousModule =
    moduleIndex > 0 ? path?.modules[moduleIndex - 1] : null;
  const nextModule =
    moduleIndex >= 0 && moduleIndex < (path?.modules.length ?? 0) - 1
      ? path?.modules[moduleIndex + 1]
      : null;

  // Load MDX content
  useEffect(() => {
    setLoading(true);
    setError(null);
    setMDXContent(null);
    setMeta(null);

    try {
      const mdxModule = loadMDXModule(pathId, moduleId);

      if (!mdxModule) {
        setError(
          `Module content not found for "${moduleId}". The MDX file may not exist yet.`
        );
        setLoading(false);
        return;
      }

      // Debug: Log the module structure
      console.log('MDX Module loaded:', {
        hasDefault: !!mdxModule.default,
        hasMeta: !!mdxModule.meta,
        keys: Object.keys(mdxModule),
        module: mdxModule,
        moduleType: typeof mdxModule,
      });

      // Handle the case where MDX might be a function (raw import)
      let Component = mdxModule.default;
      if (!Component && typeof mdxModule === 'function') {
        // If the module itself is a function, use it directly
        Component = mdxModule as any;
      }

      if (!Component) {
        setError(`MDX module loaded but default export is missing. Module keys: ${Object.keys(mdxModule).join(', ')}, Type: ${typeof mdxModule}`);
        setLoading(false);
        return;
      }

      setMDXContent(() => Component);
      setMeta(mdxModule.meta || null);
      setLoading(false);
    } catch (err) {
      console.error('Error loading MDX module:', err);
      setError(`Failed to load module content: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  }, [pathId, moduleId]);

  // Load and update progress
  useEffect(() => {
    if (!pathId || !moduleId) return;

    // Load progress from localStorage
    const savedProgress = localStorage.getItem(`progress-${pathId}`);
    let progress: UserProgress[] = [];

    if (savedProgress) {
      progress = JSON.parse(savedProgress);
    } else {
      // Initialize progress for all modules
      progress =
        path?.modules.map((m) => ({
          pathId,
          moduleId: m.id,
          completed: false,
          progress: 0,
          lastAccessed: new Date().toISOString(),
        })) || [];
      localStorage.setItem(`progress-${pathId}`, JSON.stringify(progress));
    }

    // Update current module progress
    const moduleProgress = progress.find((p) => p.moduleId === moduleId);
    if (moduleProgress) {
      setIsCompleted(moduleProgress.completed);
      // Update lastAccessed
      const updated = progress.map((p) =>
        p.moduleId === moduleId
          ? {
              ...p,
              lastAccessed: new Date().toISOString(),
            }
          : p
      );
      localStorage.setItem(`progress-${pathId}`, JSON.stringify(updated));
    }
  }, [pathId, moduleId, path]);

  const handleMarkComplete = () => {
    const savedProgress = localStorage.getItem(`progress-${pathId}`);
    if (!savedProgress) return;

    const progress: UserProgress[] = JSON.parse(savedProgress);
    const updated = progress.map((p) =>
      p.moduleId === moduleId
        ? {
            ...p,
            completed: true,
            progress: 100,
            lastAccessed: new Date().toISOString(),
          }
        : p
    );

    localStorage.setItem(`progress-${pathId}`, JSON.stringify(updated));
    setIsCompleted(true);
  };

  const handleNavigate = (targetPath: string, targetModule?: string) => {
    if (targetModule) {
      router.push(`/marketplace/learn/${targetPath}/${targetModule}`);
    } else {
      router.push(`/marketplace/learn/${targetPath}`);
    }
  };

  if (!path || !module) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-lg border border-border shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Module Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The requested module could not be found.
          </p>
          <button
            onClick={() => router.push('/marketplace')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-lg border border-border shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading module content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-lg border border-border shadow-lg p-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Content Not Found
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => handleNavigate(pathId)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Path
            </button>
            <button
              onClick={() => router.push('/marketplace')}
              className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      <div className="bg-card rounded-lg border border-border shadow-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={() => handleNavigate(pathId)}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back to Path</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                previousModule && handleNavigate(pathId, previousModule.id)
              }
              disabled={!previousModule}
              className={`px-4 py-2 rounded-lg transition-colors ${
                previousModule
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={() => nextModule && handleNavigate(pathId, nextModule.id)}
              disabled={!nextModule}
              className={`px-4 py-2 rounded-lg transition-colors ${
                nextModule
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Module Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-lg border border-border shadow-lg p-8"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {meta?.title || module.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {meta?.description || module.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-2">Duration</div>
            <div className="text-lg font-semibold text-foreground">
              {meta?.duration || module.duration}
            </div>
          </div>
        </div>

        {/* Progress and Complete Button */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            {isCompleted && (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-500">
                <svg
                  className="w-5 h-5"
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
                <span className="font-semibold">Completed</span>
              </div>
            )}
          </div>
          {!isCompleted && (
            <button
              onClick={handleMarkComplete}
              className="px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-semibold"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </motion.div>

      {/* MDX Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-lg border border-border shadow-lg p-8"
      >
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/80 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-ul:text-foreground/80 prose-ol:text-foreground/80 prose-li:my-2">
          {MDXContent ? (
            <MDXContent />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading content...</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <div className="bg-card rounded-lg border border-border shadow-lg p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              previousModule && handleNavigate(pathId, previousModule.id)
            }
            disabled={!previousModule}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              previousModule
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>
              {previousModule ? previousModule.title : 'No Previous Module'}
            </span>
          </button>

          <button
            onClick={() => handleNavigate(pathId)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Back to Path
          </button>

          <button
            onClick={() => nextModule && handleNavigate(pathId, nextModule.id)}
            disabled={!nextModule}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              nextModule
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <span>
              {nextModule ? nextModule.title : 'No Next Module'}
            </span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

