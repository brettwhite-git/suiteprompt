'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Code, Rocket, type LucideIcon } from 'lucide-react';
import { LearningPath } from '@/types';
import learningPathsData from '@/data/learning-paths.json';

interface PathSelectorProps {
  onPathSelect?: (pathId: string) => void;
}

export default function PathSelector({ onPathSelect }: PathSelectorProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const paths = learningPathsData.paths as LearningPath[];

  // Map path IDs to sidebar titles
  const getPathTitle = (pathId: string, originalTitle: string): string => {
    switch (pathId) {
      case 'functional-users':
        return 'Architecture Overview';
      case 'developers':
        return 'SuiteCloud Basics';
      case 'advanced':
        return 'Advanced Strategies';
      default:
        return originalTitle;
    }
  };

  // Map path IDs to Lucide icons
  const getPathIcon = (pathId: string): LucideIcon => {
    switch (pathId) {
      case 'functional-users':
        return Users;
      case 'developers':
        return Code;
      case 'advanced':
        return Rocket;
      default:
        return Code;
    }
  };

  const handlePathClick = (pathId: string) => {
    setSelectedPath(pathId);
    onPathSelect?.(pathId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-secondary text-secondary-foreground border-border';
      case 'Intermediate':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Advanced':
        return 'bg-accent text-accent-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Choose Your Learning Path
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the path that best matches your background and goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {paths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative cursor-pointer transform transition-all duration-300 ${
              selectedPath === path.id
                ? 'scale-105 shadow-2xl'
                : 'hover:scale-102 hover:shadow-xl'
            }`}
            onClick={() => handlePathClick(path.id)}
          >
            <div
              className={`bg-card rounded-lg border-2 ${
                selectedPath === path.id
                  ? 'border-primary'
                  : 'border-border'
              } p-6 h-full flex flex-col`}
            >
              {/* Icon and Title */}
              <div className="flex items-center mb-3 min-h-[2.5rem]">
                {(() => {
                  const IconComponent = getPathIcon(path.id);
                  return <IconComponent className="w-8 h-8 mr-3 text-primary flex-shrink-0" />;
                })()}
                <h2 className="text-2xl font-bold text-foreground leading-tight">
                  {getPathTitle(path.id, path.title)}
                </h2>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed min-h-[3rem]">{path.description}</p>

              {/* Difficulty Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(
                    path.difficulty
                  )}`}
                >
                  {path.difficulty}
                </span>
              </div>

              {/* Time Estimate */}
              <div className="mb-4 flex items-center text-foreground">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{path.estimatedTime}</span>
              </div>

              {/* Prerequisites */}
              <div className="mb-4 min-h-[4.5rem]">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Prerequisites:
                </h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {path.prerequisites.map((prereq, idx) => (
                    <li key={idx}>{prereq}</li>
                  ))}
                </ul>
              </div>

              {/* Module Count */}
              <div className="mt-auto pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {path.modules.length} modules
                  </span>
                  {selectedPath === path.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 text-primary-foreground"
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
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedPath && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <a
            href={`/marketplace/learn/${selectedPath}`}
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg"
          >
            Start Learning Path →
          </a>
        </motion.div>
      )}
    </div>
  );
}

