'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Play, Copy, Check, Code2, FileCode } from 'lucide-react';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

interface CodePlaygroundProps {
  initialCode?: string;
  language?: string;
  templates?: { name: string; code: string }[];
  onRun?: (code: string) => string | void;
  readOnly?: boolean;
  showOutput?: boolean;
  height?: string;
  title?: string;
}

export default function CodePlayground({
  initialCode = '// Write your SuiteScript 2.x code here\n',
  language = 'typescript',
  templates = [],
  onRun,
  readOnly = false,
  showOutput = true,
  height = 'h-96',
  title = 'SuiteScript Code Playground',
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('📊 Analyzing code...\n');

    // Simulate code execution with realistic SuiteScript feedback
    setTimeout(() => {
      if (onRun) {
        try {
          const result = onRun(code);
          setOutput(`✅ Code analyzed successfully!\n\n${result || 'Syntax looks good!'}`);
        } catch (error) {
          setOutput(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        // Provide helpful feedback
        const lines = code.split('\n').length;
        const hasImport = code.includes('import');
        const hasDefine = code.includes('define');

        let feedback = '✅ Code Analysis Complete\n\n';
        feedback += `📝 Lines of code: ${lines}\n`;

        if (hasImport && hasDefine) {
          feedback += '⚠️  Mixed module systems detected (both import and define)\n';
        } else if (hasImport) {
          feedback += '✓ Using ES6 module syntax\n';
        } else if (hasDefine) {
          feedback += '✓ Using AMD module syntax\n';
        }

        feedback += '\n💡 Note: This is a syntax viewer. Actual execution requires NetSuite environment.\n';
        feedback += '📚 Deploy to NetSuite to test with live data.';

        setOutput(feedback);
      }
      setIsRunning(false);
    }, 800);
  };

  const handleTemplateSelect = (templateName: string) => {
    const template = templates.find((t) => t.name === templateName);
    if (template) {
      setCode(template.code);
      setSelectedTemplate(templateName);
      setOutput('');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto bg-card border border-border rounded-lg shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-muted/50 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <Code2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>

          <div className="flex items-center space-x-2">
            {templates.length > 0 && (
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="bg-background text-foreground px-3 py-1.5 rounded border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Template</option>
                  {templates.map((template) => (
                    <option key={template.name} value={template.name}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-sm transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {!readOnly && (
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={`flex items-center space-x-1 px-4 py-1.5 rounded text-sm font-semibold transition-colors ${
                  isRunning
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Analyzing...' : 'Analyze'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className={`${height} border-b border-border`}>
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
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
            fontFamily: 'Fira Code, Monaco, Courier New, monospace',
            fontLigatures: true,
            formatOnPaste: true,
            formatOnType: true,
            suggest: {
              snippetsPreventQuickSuggestions: false,
            },
          }}
        />
      </div>

      {/* Output Panel */}
      {showOutput && (
        <div className="bg-muted/30 backdrop-blur-sm p-4 min-h-[150px] max-h-[300px] overflow-auto">
          <div className="font-mono text-sm whitespace-pre-wrap text-foreground/90">
            {output || '💡 Click "Analyze" to check your code syntax and get feedback...'}
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="bg-primary/5 border-t border-primary/10 p-4">
        <div className="flex items-start space-x-2">
          <span className="text-lg">💡</span>
          <div className="text-sm text-muted-foreground flex-1">
            <p className="font-semibold mb-1 text-foreground">SuiteScript 2.x Support</p>
            <p>
              This editor provides syntax highlighting for SuiteScript 2.x with TypeScript support.
              <br />
              <span className="text-xs">
                Note: Actual execution requires a NetSuite environment. Use this for learning and syntax validation.
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

