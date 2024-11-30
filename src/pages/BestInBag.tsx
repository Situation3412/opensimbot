import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Tabs } from '../components/ui/Tabs';
import { LoadingState } from '../components/LoadingState';
import { CharacterInput } from '../components/CharacterInput';
import { SimulationOption } from '../components/SimulationOption';
import { useToast } from '../contexts/ToastContext';
import { useSimulation } from '../hooks/useSimulation';
import { SIMULATION_MESSAGES } from '../constants/simulationMessages';
import { COMMON_OPTION_METADATA, BestInBagOptions } from '../types/simulation';
import { GEAR_SLOTS } from '../types/gear';

export const BestInBag: React.FC = () => {
  const { showToast } = useToast();
  const [simcInput, setSimcInput] = useState('');
  const { isSimulating, output, runSimulation } = useSimulation('bestInBag');
  
  const [gearSlots, setGearSlots] = useState(GEAR_SLOTS);

  const [options, setOptions] = useState<BestInBagOptions>({
    iterations: 10000,
    fightStyle: 'Patchwerk',
    fightLength: 300,
    targetError: 0.1,
    topGearSets: 5,
    minIlevel: 0,
    maxIlevel: 500,
    compareTopN: 10
  });

  const handleSimulate = () => {
    runSimulation(
      async () => {
        // TODO: Implement BestInBag simulation logic
      },
      () => {
        if (!simcInput.trim()) {
          showToast('error', 'Please enter character data');
          return false;
        }
        if (!gearSlots.some(slot => slot.enabled)) {
          showToast('error', 'Please select at least one gear slot to optimize');
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
          <h2 className="text-xl font-medium">Best in Bag</h2>
        </Card.Header>
        <Card.Body>
          {isSimulating ? (
            <LoadingState 
              output={output} 
              hideScrollbar
              {...SIMULATION_MESSAGES.bestInBag}
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
                      </div>
                    )
                  },
                  {
                    id: 'slots',
                    label: 'Gear Slots',
                    content: (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {gearSlots.map(slot => (
                          <Checkbox
                            key={slot.id}
                            label={slot.label}
                            checked={slot.enabled}
                            onChange={(e) => {
                              setGearSlots(prev => prev.map(s => 
                                s.id === slot.id ? { ...s, enabled: e.target.checked } : s
                              ));
                            }}
                          />
                        ))}
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