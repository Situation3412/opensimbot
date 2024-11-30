import React, { createContext, useContext } from 'react';
import { useSimc } from '../hooks/useSimc';

export { useSimc };

const SimcContext = createContext<ReturnType<typeof useSimc> | undefined>(undefined);

export function SimcProvider({ children }: { children: React.ReactNode }) {
  const simc = useSimc();
  return <SimcContext.Provider value={simc}>{children}</SimcContext.Provider>;
}

export function useSimcContext() {
  const context = useContext(SimcContext);
  if (context === undefined) {
    throw new Error('useSimcContext must be used within a SimcProvider');
  }
  return context;
} 