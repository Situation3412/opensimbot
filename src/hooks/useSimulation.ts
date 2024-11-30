import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useSimulationProgress } from './useSimulationProgress';

export const useSimulation = (type: 'single' | 'bestInBag' | 'upgradeFinder') => {
  const { showToast } = useToast();
  const { output, clearOutput } = useSimulationProgress();
  const [isSimulating, setIsSimulating] = useState(false);

  const getSuccessMessage = () => {
    switch (type) {
      case 'single':
        return 'Simulation completed successfully';
      case 'bestInBag':
        return 'Best gear combinations found';
      case 'upgradeFinder':
        return 'Potential upgrades found';
    }
  };

  const runSimulation = async (
    simulationFn: () => Promise<void>,
    validateFn?: () => boolean
  ) => {
    if (validateFn && !validateFn()) {
      return;
    }

    setIsSimulating(true);
    clearOutput();
    
    try {
      await simulationFn();
      showToast('success', getSuccessMessage());
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  return {
    isSimulating,
    output,
    runSimulation
  };
}; 