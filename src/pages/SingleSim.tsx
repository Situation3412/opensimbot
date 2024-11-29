import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { ThemedCard } from '../components/ThemedCard';
import { ThemedFormControl } from '../components/ThemedFormControl';
import { useConfig } from '../contexts/ConfigContext';
import { CharacterImport } from '../components/CharacterImport';
import { SimulationOutput } from '../components/SimulationOutput';

interface SimulationResult {
  dps: number;
  error: string | null;
}

export const SingleSim: React.FC = () => {
  const { config } = useConfig();
  const [simcInput, setSimcInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [output, setOutput] = useState<string>('');
  const outputRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    window.electron.simc.onProgress((newOutput) => {
      setOutput(prev => {
        const lines = newOutput.split(/[\r\n]+/);
        
        const formattedOutput = lines
          .filter(line => line.trim())
          .join('\n');
        
        return prev + (formattedOutput ? formattedOutput + '\n' : '');
      });

      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    });

    return () => {
      window.electron.simc.offProgress();
    };
  }, []);

  const handleSimulate = async () => {
    if (!simcInput.trim()) return;

    setIsSimulating(true);
    setResult(null);
    setOutput('');

    try {
      const response = await window.electron.simc.runSingleSim({
        input: simcInput,
        iterations: config.iterations,
        threads: config.threads
      });

      setResult(response);
    } catch (error) {
      setResult({ 
        dps: 0, 
        error: error instanceof Error ? error.message : 'Failed to run simulation' 
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Container className="py-4">
      <ThemedCard>
        <ThemedCard.Header>Single Sim</ThemedCard.Header>
        <ThemedCard.Body>
          <Form>
            <CharacterImport 
              value={simcInput}
              onChange={setSimcInput}
            />
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button 
                variant="primary"
                onClick={handleSimulate}
                disabled={isSimulating || !simcInput.trim()}
              >
                {isSimulating ? 'Simulating...' : 'Run Simulation'}
              </Button>

              {result && !result.error && (
                <div className="text-success fs-3 fw-bold">
                  {Math.round(result.dps).toLocaleString()} DPS
                </div>
              )}
            </div>

            {(isSimulating || output) && (
              <SimulationOutput output={output} />
            )}
          </Form>
        </ThemedCard.Body>
      </ThemedCard>
    </Container>
  );
}; 