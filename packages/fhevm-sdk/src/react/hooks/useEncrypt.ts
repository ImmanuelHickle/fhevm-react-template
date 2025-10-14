/**
 * Encryption hook for React
 */

import { useState, useCallback } from 'react';
import { encrypt as coreEncrypt } from '../../core/encryption';
import type { FhevmInstance, EncryptType, EncryptOptions } from '../../core/types';

export interface UseEncryptReturn {
  encrypt: (value: any, typeOrOptions?: EncryptType | EncryptOptions) => Promise<Uint8Array>;
  isEncrypting: boolean;
  error: Error | null;
}

/**
 * Hook for encrypting values
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { fhevm } = useFhevm({ ... });
 *   const { encrypt, isEncrypting } = useEncrypt(fhevm);
 *
 *   const handleSubmit = async () => {
 *     const encrypted = await encrypt(42, 'euint32');
 *     // Use encrypted value...
 *   };
 *
 *   return <button onClick={handleSubmit} disabled={isEncrypting}>
 *     {isEncrypting ? 'Encrypting...' : 'Submit'}
 *   </button>;
 * }
 * ```
 */
export function useEncrypt(fhevm: FhevmInstance | null): UseEncryptReturn {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: any, typeOrOptions?: EncryptType | EncryptOptions) => {
      if (!fhevm) {
        throw new Error('FHEVM instance not initialized');
      }

      try {
        setIsEncrypting(true);
        setError(null);

        const encrypted = await coreEncrypt(fhevm, value, typeOrOptions);
        return encrypted;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setIsEncrypting(false);
      }
    },
    [fhevm]
  );

  return {
    encrypt,
    isEncrypting,
    error
  };
}
