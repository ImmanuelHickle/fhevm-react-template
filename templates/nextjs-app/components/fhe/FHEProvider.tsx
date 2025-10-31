'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useFhevm } from '@fhevm/sdk/react';
import type { FhevmInstance, FhevmConfig } from '@fhevm/sdk';

interface FHEContextValue {
  fhevm: FhevmInstance | null;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const FHEContext = createContext<FHEContextValue | undefined>(undefined);

export interface FHEProviderProps {
  children: ReactNode;
  config: FhevmConfig;
}

/**
 * FHE Provider Component
 * Provides FHEVM instance to all child components
 */
export const FHEProvider: React.FC<FHEProviderProps> = ({ children, config }) => {
  const fhevmState = useFhevm(config);

  return (
    <FHEContext.Provider value={fhevmState}>
      {children}
    </FHEContext.Provider>
  );
};

/**
 * Hook to use FHE context
 */
export const useFHEContext = () => {
  const context = useContext(FHEContext);
  if (context === undefined) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
};
