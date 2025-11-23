'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Concept } from '@/types';

interface ConceptExplainerProps {
  concept: Concept;
  showVisual?: boolean;
}

export default function ConceptExplainer({
  concept,
  showVisual = true,
}: ConceptExplainerProps) {
  const [showTechnical, setShowTechnical] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{concept.title}</h2>

      {/* Simple Explanation (Feynman Style) */}
      <div className="mb-6 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">💡</span>
          <h3 className="text-xl font-semibold text-blue-900">
            Simple Explanation
          </h3>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">
          {concept.simpleExplanation}
        </p>
      </div>

      {/* Visual Diagram Placeholder */}
      {showVisual && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-center text-gray-500">
            Visual diagram for: {concept.visualType}
          </p>
          {/* This will be replaced with actual visual components */}
        </div>
      )}

      {/* Expandable Technical Details */}
      <div className="mb-6">
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <span className="text-lg font-semibold text-gray-900">
            🔧 Technical Details
          </span>
          <motion.svg
            animate={{ rotate: showTechnical ? 180 : 0 }}
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>
        <AnimatePresence>
          {showTechnical && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-gray-50 rounded-b-lg">
                <p className="text-gray-700 whitespace-pre-line">
                  {concept.technicalDetails}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real-World Example */}
      <div className="mb-6 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">🌍</span>
          <h3 className="text-xl font-semibold text-green-900">
            Real-World Example
          </h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {concept.realWorldExample}
        </p>
      </div>

      {/* Common Mistakes */}
      <div>
        <button
          onClick={() => setShowMistakes(!showMistakes)}
          className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border-l-4 border-red-500"
        >
          <span className="text-lg font-semibold text-red-900">
            ⚠️ Common Mistakes
          </span>
          <motion.svg
            animate={{ rotate: showMistakes ? 180 : 0 }}
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>
        <AnimatePresence>
          {showMistakes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-red-50 rounded-b-lg">
                <ul className="list-disc list-inside space-y-2">
                  {concept.commonMistakes.map((mistake, index) => (
                    <li key={index} className="text-gray-700">
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

