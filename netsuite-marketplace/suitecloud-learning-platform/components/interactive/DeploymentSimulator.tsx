'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  details?: string;
}

const deploymentSteps: DeploymentStep[] = [
  {
    id: 'validate',
    title: 'Validate Project',
    description: 'Checking project structure and dependencies',
    status: 'pending',
  },
  {
    id: 'build',
    title: 'Build Project',
    description: 'Compiling TypeScript and bundling files',
    status: 'pending',
  },
  {
    id: 'bundle',
    title: 'Bundle Files',
    description: 'Packaging files according to deploy.xml',
    status: 'pending',
  },
  {
    id: 'upload',
    title: 'Upload to NetSuite',
    description: 'Uploading files and creating objects',
    status: 'pending',
  },
  {
    id: 'install',
    title: 'Install SuiteApp',
    description: 'Installing SuiteApp in your account',
    status: 'pending',
  },
];

export default function DeploymentSimulator() {
  const [steps, setSteps] = useState<DeploymentStep[]>(deploymentSteps);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const runDeployment = async () => {
    setIsRunning(true);
    setCurrentStepIndex(0);

    for (let i = 0; i < steps.length; i++) {
      // Update current step to running
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === i ? { ...step, status: 'running' } : step
        )
      );

      // Simulate step execution
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update current step to completed
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === i ? { ...step, status: 'completed' } : step
        )
      );

      setCurrentStepIndex(i + 1);
    }

    setIsRunning(false);
  };

  const reset = () => {
    setSteps(deploymentSteps);
    setIsRunning(false);
    setCurrentStepIndex(-1);
  };

  const getStatusIcon = (status: DeploymentStep['status']) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
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
        );
      case 'running':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.div>
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          </div>
        );
    }
  };

  const getStatusColor = (status: DeploymentStep['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'running':
        return 'border-blue-500 bg-blue-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Deployment Simulator
      </h3>

      <div className="space-y-4 mb-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 ${getStatusColor(step.status)} transition-all duration-300`}
          >
            <div className="flex items-center space-x-4">
              {getStatusIcon(step.status)}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={runDeployment}
          disabled={isRunning}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
            isRunning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isRunning ? 'Deploying...' : 'Run Deployment'}
        </button>
        <button
          onClick={reset}
          disabled={isRunning}
          className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Reset
        </button>
      </div>

      {steps.every((step) => step.status === 'completed') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg"
        >
          <p className="text-green-800 font-semibold">
            ✅ Deployment completed successfully!
          </p>
        </motion.div>
      )}
    </div>
  );
}

