import React, { useRef, useEffect } from 'react';

interface Props {
  output: string;
  title?: string;
}

export const SimulationOutput: React.FC<Props> = ({ output, title = 'Simulation Progress' }) => {
  const outputRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  if (!output) return null;

  return (
    <div className="mt-4">
      <h5>{title}</h5>
      <pre 
        ref={outputRef}
        className="mt-3 p-2 bg-dark text-light rounded" 
        style={{ 
          maxHeight: '200px', 
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
      >
        {output}
      </pre>
    </div>
  );
}; 