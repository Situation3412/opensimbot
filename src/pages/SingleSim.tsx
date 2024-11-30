import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SimulationOption } from '../components/SimulationOption';
import { LoadingState } from '../components/LoadingState';
import { SimulationResults } from '../components/SimulationResults';
import { Tabs } from '../components/ui/Tabs';
import { useToast } from '../contexts/ToastContext';
import { useConfig } from '../contexts/ConfigContext';
import { useSimulation } from '../hooks/useSimulation';
import { SingleSimOptions, BaseSimulationResult } from '../types/simulation';
import { CharacterInput } from '../components/CharacterInput';
import { SIMULATION_MESSAGES } from '../constants/simulationMessages';
import { COMMON_OPTION_METADATA } from '../types/simulation';
import { FIGHT_STYLES } from '../constants/simulationOptions';

export const SingleSim: React.FC = () => {
  const { config } = useConfig();
  const { showToast } = useToast();
  const [simcInput, setSimcInput] = useState('');
  const [result, setResult] = useState<BaseSimulationResult | null>(null);
  const { isSimulating, output, runSimulation } = useSimulation('single');
  
  const [options, setOptions] = useState<SingleSimOptions>({
    iterations: config.iterations,
    fightStyle: 'Patchwerk',
    fightLength: 300,
    targetError: 0.1,
    enableScaling: false
  });

  const handleSimulate = () => {
    runSimulation(
      async () => {
        const simResult = await window.electron.simc.runSingleSim({
          input: simcInput,
          iterations: options.iterations,
          threads: config.threads,
          fightStyle: options.fightStyle,
          fightLength: options.fightLength,
          targetError: options.targetError,
          calculateScaling: options.enableScaling
        });

        if (simResult.error) {
          throw new Error(simResult.error);
        }

        setResult({
          dps: simResult.dps,
          error: simResult.targetError || 0.1
        });
      },
      () => {
        if (!simcInput.trim()) {
          showToast('error', 'Please enter character data');
          return false;
        }
        return true;
      }
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Card>
        <Card.Header>
          <h2 className="text-xl font-medium">Single Sim</h2>
        </Card.Header>
        <Card.Body>
          {isSimulating ? (
            <LoadingState 
              output={output} 
              hideScrollbar
              {...SIMULATION_MESSAGES.single}
            />
          ) : (
            <div className="space-y-6">
              <Tabs
                tabs={[
                  {
                    id: 'input',
                    label: 'Character Input',
                    content: (
                      <div className="space-y-6">
                        <CharacterInput
                          value={simcInput}
                          onChange={setSimcInput}
                          disabled={isSimulating}
                        />
                        {result && (
                          <div className="mt-6">
                            <SimulationResults data={result} type="single" />
                          </div>
                        )}
                      </div>
                    )
                  },
                  {
                    id: 'options',
                    label: 'Options',
                    content: (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <SimulationOption
                            type="number"
                            label="Iterations"
                            value={options.iterations}
                            onChange={(value) => setOptions(prev => ({ ...prev, iterations: value }))}
                            {...COMMON_OPTION_METADATA.iterations}
                          />
                          
                          <SimulationOption
                            type="select"
                            label="Fight Style"
                            tooltip="Different fight styles simulate different types of encounters"
                            value={options.fightStyle}
                            onChange={(value) => setOptions(prev => ({ ...prev, fightStyle: value }))}
                            options={FIGHT_STYLES}
                          />
                          
                          <SimulationOption
                            type="number"
                            label="Fight Length"
                            value={options.fightLength}
                            onChange={(value) => setOptions(prev => ({ ...prev, fightLength: value }))}
                            {...COMMON_OPTION_METADATA.fightLength}
                          />
                          
                          <SimulationOption
                            type="number"
                            label="Target Error"
                            value={options.targetError}
                            onChange={(value) => setOptions(prev => ({ ...prev, targetError: value }))}
                            {...COMMON_OPTION_METADATA.targetError}
                          />
                        </div>

                        <SimulationOption
                          type="checkbox"
                          label="Enable Scaling"
                          tooltip="Calculate stat weights to show the relative value of different stats (increases simulation time)"
                          checked={options.enableScaling}
                          onChange={(checked) => setOptions(prev => ({ ...prev, enableScaling: checked }))}
                        />
                      </div>
                    )
                  }
                ]}
              />

              <div className="flex justify-end">
                <Button
                  onClick={handleSimulate}
                  disabled={isSimulating || !simcInput.trim()}
                  isLoading={isSimulating}
                >
                  {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}; 