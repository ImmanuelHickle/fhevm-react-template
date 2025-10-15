/**
 * Main FHEVM hook for React
 */

import { useState, useEffect, useRef } from 'react';
import { createFhevmInstance, isInstanceReady, getInstanceInfo } from '../../core/fhevm-instance';
import type { FhevmConfig, FhevmInstance } from '../../core/types';

export interface UseFhevmReturn {
  fhevm: FhevmInstance | null;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for FHEVM instance management
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { fhevm, isReady, error } = useFhevm({
 *     network: 'sepolia',
 *     contractAddress: '0x...'
 *   });
 *
 *   if (!isReady) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <div>FHEVM Ready!</div>;
 * }
 * ```
 */
export function useFhevm(config: FhevmConfig): UseFhevmReturn {
  const [fhevm, setFhevm] = useState<FhevmInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const configRef = useRef(config);

  // Update config ref when it changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Initialize FHEVM instance
  const initializeFhevm = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const instance = await createFhevmInstance(configRef.current);
      setFhevm(instance);
    } catch (err: any) {
      setError(err);
      setFhevm(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeFhevm();
  }, [config.network, config.contractAddress]);

  return {
    fhevm,
    isReady: fhevm !== null && isInstanceReady(fhevm),
    isLoading,
    error,
    refetch: initializeFhevm
  };
}
