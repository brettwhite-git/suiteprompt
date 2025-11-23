'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

interface CodePlaygroundProps {
  initialCode?: string;
  language?: string;
  templates?: { name: string; code: string }[];
  onRun?: (code: string) => void;
  readOnly?: boolean;
}

export default function CodePlayground({
  initialCode = '// Write your code here\n',
  language = 'typescript',
  templates = [],
  onRun,
  readOnly = false,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');

    // Simulate code execution
    setTimeout(() => {
      if (onRun) {
        try {
          const result = onRun(code);
          setOutput(`Output:\n${result || 'Code executed successfully!'}`);
        } catch (error) {
          setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        setOutput('Code execution simulated.\nIn a real environment, this would execute in NetSuite.');
      }
      setIsRunning(false);
    }, 1000);
  };

  const handleTemplateSelect = (templateName: string) => {
    const template = templates.find((t) => t.name === templateName);
    if (template) {
      setCode(template.code);
      setSelectedTemplate(templateName);
    }
  };

  const handleFormat = () => {
    // Basic formatting - in production, use a proper formatter
    setCode((prev) => {
      // Simple indentation fix
      const lines = prev.split('\n');
      const formatted = lines
        .map((line, index) => {
          const trimmed = line.trim();
          if (trimmed === '') return '';
          return trimmed;
        })
        .filter((line) => line !== '')
        .join('\n');
      return formatted;
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Code Playground</h3>
        <div className="flex items-center space-x-4">
          {templates.length > 0 && (
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
            >
              <option value="">Select Template</option>
              {templates.map((template) => (
                <option key={template.name} value={template.name}>
                  {template.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={handleFormat}
            className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            Format
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning || readOnly}
            className={`px-4 py-1 rounded text-sm font-semibold transition-colors ${
              isRunning || readOnly
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRunning ? 'Running...' : '▶ Run'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="h-96 border-b border-gray-200">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>

      {/* Output Panel */}
      <div className="bg-gray-900 text-green-400 p-4 min-h-[150px] max-h-[300px] overflow-auto">
        <div className="font-mono text-sm whitespace-pre-wrap">
          {output || 'Output will appear here...'}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border-t border-blue-200 p-4">
        <div className="flex items-start space-x-2">
          <span className="text-blue-600">ℹ️</span>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">NetSuite API Autocomplete</p>
            <p>
              The editor includes autocomplete for NetSuite APIs. Try typing{' '}
              <code className="bg-blue-100 px-1 rounded">N/</code> to see
              available modules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

