import React from 'react';
import { LoadingState } from './LoadingState';
import { SimulationType } from '../types/simulation';
import { SIMULATION_MESSAGES } from '../constants/simulationMessages';

interface LoadingStateWrapperProps {
  type: SimulationType;
  isLoading: boolean;
  output: string;
  children: React.ReactNode;
}

export const LoadingStateWrapper: React.FC<LoadingStateWrapperProps> = ({
  type,
  isLoading,
  output,
  children
}) => {
  if (isLoading) {
    return (
      <LoadingState 
        output={output} 
        hideScrollbar
        {...SIMULATION_MESSAGES[type]}
      />
    );
  }

  return <>{children}</>; 
} 