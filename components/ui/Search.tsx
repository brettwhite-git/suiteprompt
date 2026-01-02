'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import learningPathsData from '@/data/learning-paths.json';
import conceptsData from '@/data/concepts.json';
import { LearningPath, Concept } from '@/types';

interface SearchResult {
  type: 'path' | 'module' | 'concept';
  id: string;
  title: string;
  description: string;
  href: string;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim() || query.length < 2) return [];

    const searchLower = query.toLowerCase();
    const allResults: SearchResult[] = [];

    // Search learning paths
    (learningPathsData.paths as LearningPath[]).forEach((path) => {
      if (
        path.title.toLowerCase().includes(searchLower) ||
        path.description.toLowerCase().includes(searchLower)
      ) {
        allResults.push({
          type: 'path',
          id: path.id,
          title: path.title,
          description: path.description,
          href: `/marketplace/learn/${path.id}`,
        });
      }

      // Search modules
      path.modules.forEach((module) => {
        if (
          module.title.toLowerCase().includes(searchLower) ||
          module.description.toLowerCase().includes(searchLower)
        ) {
          allResults.push({
            type: 'module',
            id: module.id,
            title: `${path.title} - ${module.title}`,
            description: module.description,
            href: `/marketplace/learn/${path.id}/${module.id}`,
          });
        }
      });
    });

    // Search concepts
    (conceptsData.concepts as Concept[]).forEach((concept) => {
      if (
        concept.title.toLowerCase().includes(searchLower) ||
        concept.simpleExplanation.toLowerCase().includes(searchLower)
      ) {
        allResults.push({
          type: 'concept',
          id: concept.id,
          title: concept.title,
          description: concept.simpleExplanation.substring(0, 100) + '...',
          href: `/concepts/${concept.id}`,
        });
      }
    });

    return allResults.slice(0, 10); // Limit to 10 results
  }, [query]);

  const handleFocus = () => {
    setIsOpen(true);
    if (query.length >= 2) {
      setShowResults(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowResults(e.target.value.length >= 2);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'path':
        return '📚';
      case 'module':
        return '📖';
      case 'concept':
        return '💡';
      default:
        return '🔍';
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Search learning paths, modules, concepts..."
          className="w-full px-4 py-3 pl-12 pr-4 bg-background border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            {results.map((result) => (
              <a
                key={result.id}
                href={result.href}
                className="block px-4 py-3 hover:bg-accent border-b border-border last:border-b-0 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{getTypeIcon(result.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {result.title}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && showResults && query.length >= 2 && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg p-4 text-center text-muted-foreground"
        >
          No results found for "{query}"
        </motion.div>
      )}
    </div>
  );
}

