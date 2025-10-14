/**
 * React Context Provider for FHEVM
 */

import React, { createContext, useContext } from 'react';
import { useFhevm, UseFhevmReturn } from '../hooks/useFhevm';
import type { FhevmConfig } from '../../core/types';

const FhevmContext = createContext<UseFhevmReturn | null>(null);

export interface FhevmProviderProps {
  config: FhevmConfig;
  children: React.ReactNode;
}

/**
 * FHEVM Context Provider
 *
 * @example
 * ```tsx
 * <FhevmProvider config={{ network: 'sepolia', contractAddress: '0x...' }}>
 *   <App />
 * </FhevmProvider>
 * ```
 */
export function FhevmProvider({ config, children }: FhevmProviderProps) {
  const fhevmState = useFhevm(config);

  return (
    <FhevmContext.Provider value={fhevmState}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Use FHEVM context
 */
export function useFhevmContext(): UseFhevmReturn {
  const context = useContext(FhevmContext);

  if (!context) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }

  return context;
}
