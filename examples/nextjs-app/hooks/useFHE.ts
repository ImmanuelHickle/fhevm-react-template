'use client';

import { useState, useEffect, useCallback } from 'react';
import { createFhevmInstance, encrypt, decrypt } from '@fhevm/sdk';
import type { FhevmInstance, FhevmConfig, EncryptType } from '@fhevm/sdk';

/**
 * Custom hook for FHE operations
 * Provides a simplified interface for FHEVM SDK
 */
export function useFHE(config: FhevmConfig) {
  const [fhevm, setFhevm] = useState<FhevmInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize FHEVM instance
  useEffect(() => {
    let mounted = true;

    const initFhevm = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const instance = await createFhevmInstance(config);

        if (mounted) {
          setFhevm(instance);
          setIsReady(true);
          console.log('FHEVM initialized successfully');
        }
      } catch (err: any) {
        console.error('FHEVM initialization failed:', err);
        if (mounted) {
          setError(err);
          setIsReady(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initFhevm();

    return () => {
      mounted = false;
    };
  }, [config.network, config.contractAddress]);

  // Encrypt value
  const encryptValue = useCallback(
    async <T,>(value: T, type?: EncryptType): Promise<Uint8Array | null> => {
      if (!fhevm) {
        console.error('FHEVM not initialized');
        return null;
      }

      try {
        const encrypted = await encrypt(fhevm, value, type);
        return encrypted;
      } catch (err) {
        console.error('Encryption failed:', err);
        throw err;
      }
    },
    [fhevm]
  );

  // Decrypt value
  const decryptValue = useCallback(
    async (options: any): Promise<any> => {
      if (!fhevm) {
        console.error('FHEVM not initialized');
        return null;
      }

      try {
        const decrypted = await decrypt(fhevm, options);
        return decrypted;
      } catch (err) {
        console.error('Decryption failed:', err);
        throw err;
      }
    },
    [fhevm]
  );

  // Refetch/reinitialize
  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const instance = await createFhevmInstance(config);
      setFhevm(instance);
      setIsReady(true);
    } catch (err: any) {
      setError(err);
      setIsReady(false);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  return {
    fhevm,
    isReady,
    isLoading,
    error,
    encrypt: encryptValue,
    decrypt: decryptValue,
    refetch,
  };
}
