import React, { useRef, useEffect, useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingStateProps {
  title?: string;
  description?: string;
  output?: string;
  className?: string;
  hideScrollbar?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Running Simulation',
  description = 'This may take a few minutes depending on your settings.',
  output,
  className = '',
  hideScrollbar = false
}) => {
  const outputRef = useRef<HTMLPreElement>(null);
  const { config } = useConfig();
  const isDark = config.theme === 'dark';
  const [processedLines, setProcessedLines] = useState<string[]>([]);

  // Process output into lines, handling carriage returns
  useEffect(() => {
    if (!output) {
      setProcessedLines([]);
      return;
    }

    const lines = output.split('\n');
    const newLines: string[] = [];

    for (const line of lines) {
      if (line.includes('\r')) {
        const parts = line.split('\r');
        const lastPart = parts[parts.length - 1];
        if (newLines.length > 0) {
          newLines[newLines.length - 1] = lastPart;
        } else {
          newLines.push(lastPart);
        }
      } else if (line.trim()) {
        newLines.push(line);
      }
    }

    setProcessedLines(prev => {
      const combined = [...prev];
      for (const line of newLines) {
        if (!combined.includes(line)) {
          combined.push(line);
        }
      }
      return combined;
    });
  }, [output]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [processedLines]);

  return (
    <div className={`
      flex flex-col items-center justify-center p-8 text-center
      animate-fadeIn
      ${isDark ? 'text-gray-200' : 'text-gray-700'}
      ${className}
    `}>
      <LoadingSpinner size="lg" />
      <h3 className="mt-6 text-xl font-semibold tracking-tight">{title}</h3>
      <p className={`
        mt-3 text-sm max-w-md mx-auto
        ${isDark ? 'text-gray-400' : 'text-gray-500'}
      `}>
        {description}
      </p>

      {output && (
        <div className="w-full mt-8 animate-slideUp">
          <pre 
            ref={outputRef}
            className={`
              w-full p-6 rounded-xl font-mono text-sm text-left
              transition-colors duration-200
              ${hideScrollbar ? 'scrollbar-hide' : 'scrollbar-thin scrollbar-thumb-rounded'}
              ${isDark 
                ? 'bg-gray-800/50 text-gray-200 border border-gray-700/50 scrollbar-track-gray-800 scrollbar-thumb-gray-700' 
                : 'bg-gray-50/50 text-gray-900 border border-gray-200/50 scrollbar-track-gray-100 scrollbar-thumb-gray-300'
              }
            `}
            style={{ 
              height: '400px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {processedLines.join('\n')}
          </pre>
        </div>
      )}
    </div>
  );
}; 