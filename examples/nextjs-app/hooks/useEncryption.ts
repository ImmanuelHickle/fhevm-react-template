'use client';

import { useState, useCallback } from 'react';
import { encrypt } from '@fhevm/sdk';
import type { FhevmInstance, EncryptType } from '@fhevm/sdk';

/**
 * Custom hook for encryption operations
 */
export function useEncryption(fhevm: FhevmInstance | null) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastEncrypted, setLastEncrypted] = useState<Uint8Array | null>(null);

  const encryptValue = useCallback(
    async <T,>(value: T, type?: EncryptType): Promise<Uint8Array | null> => {
      if (!fhevm) {
        const err = new Error('FHEVM instance not initialized');
        setError(err);
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await encrypt(fhevm, value, type);
        setLastEncrypted(encrypted);
        console.log('Encryption successful');
        return encrypted;
      } catch (err: any) {
        console.error('Encryption failed:', err);
        setError(err);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [fhevm]
  );

  const encryptBatch = useCallback(
    async <T,>(values: T[], type?: EncryptType): Promise<Uint8Array[] | null> => {
      if (!fhevm) {
        const err = new Error('FHEVM instance not initialized');
        setError(err);
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await Promise.all(
          values.map(value => encrypt(fhevm, value, type))
        );
        console.log(`${values.length} values encrypted successfully`);
        return encrypted;
      } catch (err: any) {
        console.error('Batch encryption failed:', err);
        setError(err);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [fhevm]
  );

  const reset = useCallback(() => {
    setError(null);
    setLastEncrypted(null);
  }, []);

  return {
    encrypt: encryptValue,
    encryptBatch,
    isEncrypting,
    error,
    lastEncrypted,
    reset,
  };
}
