'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DeploymentSimulator from '@/components/interactive/DeploymentSimulator';
import exercisesData from '@/data/exercises.json';
import { Exercise } from '@/types';

const exercise = exercisesData.exercises.find(
  (e) => e.id === 'hello-world-spa'
) as Exercise;

export default function Rapid101Page() {
  const [currentStep, setCurrentStep] = useState(0);

  if (!exercise) {
    return <div>Exercise not found</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Rapid 101: Hello World SPA
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Get started with SuiteCloud in 15 minutes
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>⏱️ {exercise.estimatedTime}</span>
              <span>•</span>
              <span>📊 {exercise.difficulty}</span>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {exercise.steps.length}</span>
            <span>
              {Math.round(((currentStep + 1) / exercise.steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / exercise.steps.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
                Step {exercise.steps[currentStep].step}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {exercise.steps[currentStep].title}
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                {exercise.steps[currentStep].description}
              </p>
            </div>

            {/* Code Block */}
            <div className="bg-gray-900 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 font-mono text-sm">
                <code>{exercise.steps[currentStep].code}</code>
              </pre>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-6 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <button
                onClick={() =>
                  setCurrentStep(
                    Math.min(exercise.steps.length - 1, currentStep + 1)
                  )
                }
                disabled={currentStep === exercise.steps.length - 1}
                className="px-6 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </motion.div>
        </div>

        {/* Deployment Simulator - Show on last step */}
        {currentStep === exercise.steps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DeploymentSimulator />
          </motion.div>
        )}

        {/* Hints Section */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-900 mb-4">
            💡 Hints
          </h3>
          <ul className="list-disc list-inside space-y-2 text-yellow-800">
            {exercise.hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

