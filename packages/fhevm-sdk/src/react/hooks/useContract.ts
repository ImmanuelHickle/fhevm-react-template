/**
 * Contract interaction hook for React
 */

import { useState, useCallback, useMemo } from 'react';
import { createContract } from '../../core/contract';
import type { FhevmInstance, ContractOptions } from '../../core/types';
import type { ethers } from 'ethers';

export interface UseContractReturn {
  contract: ethers.Contract | null;
  call: (functionName: string, ...args: any[]) => Promise<any>;
  send: (functionName: string, ...args: any[]) => Promise<any>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for contract interactions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { fhevm } = useFhevm({ ... });
 *   const { contract, send, isLoading } = useContract(fhevm, {
 *     address: '0x...',
 *     abi: contractABI,
 *     signer: ethersJsSigner
 *   });
 *
 *   const handleSubmit = async () => {
 *     await send('submitData', encryptedValue);
 *   };
 *
 *   return <button onClick={handleSubmit} disabled={isLoading}>Submit</button>;
 * }
 * ```
 */
export function useContract(
  fhevm: FhevmInstance | null,
  options: ContractOptions
): UseContractReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const contract = useMemo(() => {
    if (!fhevm) return null;
    return createContract(fhevm, options);
  }, [fhevm, options.address, options.abi]);

  const call = useCallback(
    async (functionName: string, ...args: any[]) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      try {
        setError(null);
        const result = await contract[functionName](...args);
        return result;
      } catch (err: any) {
        setError(err);
        throw err;
      }
    },
    [contract]
  );

  const send = useCallback(
    async (functionName: string, ...args: any[]) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      try {
        setIsLoading(true);
        setError(null);

        const tx = await contract[functionName](...args);
        const receipt = await tx.wait();
        return receipt;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  return {
    contract,
    call,
    send,
    isLoading,
    error
  };
}
