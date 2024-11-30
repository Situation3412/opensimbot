import { useState, useEffect } from 'react';

export const useSimulationProgress = () => {
  const [output, setOutput] = useState('');
  
  useEffect(() => {
    const handleProgress = (newOutput: string) => {
      setOutput(prev => {
        if (newOutput.includes('\r')) {
          const lines = prev.split('\n');
          const lastLine = lines[lines.length - 1] || '';
          
          if (lastLine.includes('Generating Baseline:')) {
            lines[lines.length - 1] = newOutput.trim();
          } else {
            lines.push(newOutput.trim());
          }
          
          return lines.join('\n');
        }
        
        return prev + (prev ? '\n' : '') + newOutput.trim();
      });
    };

    window.electron.simc.onProgress(handleProgress);
    return () => window.electron.simc.offProgress();
  }, []);

  return {
    output,
    setOutput,
    clearOutput: () => setOutput('')
  };
}; 