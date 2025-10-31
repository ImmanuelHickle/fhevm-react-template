'use client';

import { useState, useCallback } from 'react';
import { encrypt } from '@fhevm/sdk';
import type { FhevmInstance, EncryptType } from '@fhevm/sdk';

/**
 * Custom hook for FHE computation operations
 */
export function useComputation(fhevm: FhevmInstance | null) {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);

  /**
   * Prepare encrypted values for computation
   */
  const prepareComputation = useCallback(
    async (values: number[], type?: EncryptType): Promise<Uint8Array[] | null> => {
      if (!fhevm) {
        const err = new Error('FHEVM instance not initialized');
        setError(err);
        return null;
      }

      setIsComputing(true);
      setError(null);

      try {
        const encrypted = await Promise.all(
          values.map(value => encrypt(fhevm, value, type || 'euint32'))
        );

        setResult({
          encryptedValues: encrypted,
          count: encrypted.length,
          type: type || 'euint32',
        });

        console.log(`${values.length} values encrypted for computation`);
        return encrypted;
      } catch (err: any) {
        console.error('Computation preparation failed:', err);
        setError(err);
        return null;
      } finally {
        setIsComputing(false);
      }
    },
    [fhevm]
  );

  /**
   * Prepare binary operation (two operands)
   */
  const prepareBinaryOp = useCallback(
    async (
      a: number,
      b: number,
      operation: 'add' | 'sub' | 'mul' | 'div',
      type?: EncryptType
    ): Promise<{ a: Uint8Array; b: Uint8Array; operation: string } | null> => {
      if (!fhevm) {
        const err = new Error('FHEVM instance not initialized');
        setError(err);
        return null;
      }

      setIsComputing(true);
      setError(null);

      try {
        const [encryptedA, encryptedB] = await Promise.all([
          encrypt(fhevm, a, type || 'euint32'),
          encrypt(fhevm, b, type || 'euint32'),
        ]);

        const opResult = {
          a: encryptedA,
          b: encryptedB,
          operation,
        };

        setResult(opResult);
        console.log(`Binary operation ${operation} prepared`);

        return opResult;
      } catch (err: any) {
        console.error('Binary operation preparation failed:', err);
        setError(err);
        return null;
      } finally {
        setIsComputing(false);
      }
    },
    [fhevm]
  );

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return {
    prepareComputation,
    prepareBinaryOp,
    isComputing,
    error,
    result,
    reset,
  };
}
