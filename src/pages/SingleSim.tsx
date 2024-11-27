import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { ThemedCard } from '../components/ThemedCard';
import { ThemedFormControl } from '../components/ThemedFormControl';
import { useConfig } from '../contexts/ConfigContext';

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
  const outputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Set up progress listener
    window.electron.simc.onProgress((newOutput) => {
      setOutput(prev => prev + newOutput);
      // Auto-scroll to bottom
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    });

    // Cleanup
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
      // Clear the output when simulation is complete
      setOutput('');
    }
  };

  return (
    <Container className="py-4">
      <ThemedCard>
        <ThemedCard.Header>Single Sim</ThemedCard.Header>
        <ThemedCard.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Character Import String</Form.Label>
              <ThemedFormControl
                as="textarea"
                rows={10}
                placeholder="Paste your SimC addon export here..."
                value={simcInput}
                onChange={(e) => setSimcInput(e.target.value)}
              />
              <Form.Text className={config.theme === 'dark' ? 'text-light' : 'text-muted'}>
                You can get this from the in-game SimC addon using /simc
              </Form.Text>
            </Form.Group>
            
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

            {/* Only show output during simulation */}
            {isSimulating && output && (
              <Form.Group>
                <ThemedFormControl
                  ref={outputRef}
                  as="textarea"
                  rows={10}
                  value={output}
                  readOnly
                  className="font-monospace"
                />
              </Form.Group>
            )}

            {result?.error && (
              <Alert variant="danger" className="mt-3">
                {result.error}
              </Alert>
            )}
          </Form>
        </ThemedCard.Body>
      </ThemedCard>
    </Container>
  );
}; 