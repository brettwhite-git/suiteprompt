'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

const flowSteps: FlowStep[] = [
  {
    id: 'code',
    title: 'Your Code',
    description: 'Source files in your project',
    icon: '💻',
    details: [
      'TypeScript/JavaScript files',
      'XML object definitions',
      'Configuration files',
    ],
  },
  {
    id: 'build',
    title: 'Build',
    description: 'Compile and process files',
    icon: '🔨',
    details: [
      'TypeScript compilation',
      'JSX transformation',
      'Asset processing',
    ],
  },
  {
    id: 'bundle',
    title: 'Bundle',
    description: 'Package according to deploy.xml',
    icon: '📦',
    details: [
      'Read deploy.xml paths',
      'Include matching files',
      'Exclude others',
    ],
  },
  {
    id: 'validate',
    title: 'Validate',
    description: 'Check against NetSuite',
    icon: '✅',
    details: [
      'Validate manifest.xml',
      'Check dependencies',
      'Verify object definitions',
    ],
  },
  {
    id: 'deploy',
    title: 'Deploy',
    description: 'Upload to NetSuite',
    icon: '🚀',
    details: [
      'Upload File Cabinet files',
      'Create/update objects',
      'Install SuiteApp',
    ],
  },
  {
    id: 'netsuite',
    title: 'NetSuite',
    description: 'Your account',
    icon: '☁️',
    details: [
      'Files in File Cabinet',
      'Objects created',
      'SuiteApp installed',
    ],
  },
];

export default function DeploymentFlow() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Deployment Flow
      </h3>

      {/* Flow Diagram */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {flowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 min-w-[150px]">
              {/* Step Card */}
              <motion.div
                className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStep === step.id
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                onClick={() =>
                  setSelectedStep(selectedStep === step.id ? null : step.id)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{step.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </motion.div>

              {/* Arrow */}
              {index < flowSteps.length - 1 && (
                <motion.div
                  className="mx-2 text-gray-400"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                >
                  <svg
                    className="w-8 h-8"
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
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Details */}
      {selectedStep && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
        >
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            {flowSteps.find((s) => s.id === selectedStep)?.title} Details
          </h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {flowSteps
              .find((s) => s.id === selectedStep)
              ?.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
          </ul>
        </motion.div>
      )}

      {/* Command Example */}
      <div className="mt-8 p-4 bg-gray-900 rounded-lg">
        <p className="text-gray-400 text-sm mb-2">Command:</p>
        <code className="text-green-400 font-mono text-lg">
          suitecloud project:deploy
        </code>
      </div>
    </div>
  );
}

