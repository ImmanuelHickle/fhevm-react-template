/**
 * Decryption hook for React
 */

import { useState, useCallback } from 'react';
import { decrypt as coreDecrypt, userDecrypt, publicDecrypt } from '../../core/decryption';
import type { FhevmInstance, UserDecryptOptions, PublicDecryptOptions } from '../../core/types';

export interface UseDecryptReturn {
  decrypt: <T = any>(options: UserDecryptOptions | PublicDecryptOptions) => Promise<T>;
  userDecrypt: <T = any>(options: UserDecryptOptions) => Promise<T>;
  publicDecrypt: <T = any>(options: PublicDecryptOptions) => Promise<T>;
  isDecrypting: boolean;
  error: Error | null;
}

/**
 * Hook for decrypting values
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { fhevm } = useFhevm({ ... });
 *   const { decrypt, isDecrypting } = useDecrypt(fhevm);
 *
 *   const handleDecrypt = async (ciphertext: Uint8Array) => {
 *     const value = await decrypt({
 *       ciphertext,
 *       contractAddress: '0x...',
 *       userAddress: '0x...',
 *       signer: ethersJsSigner
 *     });
 *     console.log('Decrypted:', value);
 *   };
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useDecrypt(fhevm: FhevmInstance | null): UseDecryptReturn {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = useCallback(
    async <T = any>(options: UserDecryptOptions | PublicDecryptOptions) => {
      if (!fhevm) {
        throw new Error('FHEVM instance not initialized');
      }

      try {
        setIsDecrypting(true);
        setError(null);

        const decrypted = await coreDecrypt<T>(fhevm, options);
        return decrypted;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setIsDecrypting(false);
      }
    },
    [fhevm]
  );

  const handleUserDecrypt = useCallback(
    async <T = any>(options: UserDecryptOptions) => {
      if (!fhevm) {
        throw new Error('FHEVM instance not initialized');
      }

      try {
        setIsDecrypting(true);
        setError(null);

        const decrypted = await userDecrypt<T>(fhevm, options);
        return decrypted;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setIsDecrypting(false);
      }
    },
    [fhevm]
  );

  const handlePublicDecrypt = useCallback(
    async <T = any>(options: PublicDecryptOptions) => {
      if (!fhevm) {
        throw new Error('FHEVM instance not initialized');
      }

      try {
        setIsDecrypting(true);
        setError(null);

        const decrypted = await publicDecrypt<T>(fhevm, options);
        return decrypted;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setIsDecrypting(false);
      }
    },
    [fhevm]
  );

  return {
    decrypt,
    userDecrypt: handleUserDecrypt,
    publicDecrypt: handlePublicDecrypt,
    isDecrypting,
    error
  };
}
