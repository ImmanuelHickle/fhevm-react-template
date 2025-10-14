/**
 * Decryption utilities for FHEVM
 */

import type {
  FhevmInstance,
  DecryptOptions,
  UserDecryptOptions,
  PublicDecryptOptions,
  DecryptionResult
} from './types';
import { FhevmError } from './types';

/**
 * Decrypt with user signature (EIP-712)
 *
 * @example
 * ```typescript
 * const decrypted = await userDecrypt(fhevm, {
 *   ciphertext: encrypted,
 *   contractAddress: '0x...',
 *   userAddress: '0x...',
 *   signer: ethersJsSigner
 * });
 * ```
 */
export async function userDecrypt<T = any>(
  fhevm: FhevmInstance,
  options: UserDecryptOptions
): Promise<T> {
  try {
    const { ciphertext, contractAddress, userAddress, signer } = options;

    if (fhevm.config.debug) {
      console.log('[FHEVM SDK] User decrypt:', {
        contractAddress,
        userAddress,
        ciphertextLength: typeof ciphertext === 'string' ? ciphertext.length : ciphertext.length
      });
    }

    // Convert ciphertext if needed
    const ciphertextBytes = typeof ciphertext === 'string'
      ? hexToUint8Array(ciphertext)
      : ciphertext;

    // Create EIP-712 signature
    const domain = {
      name: 'FHE Decryption',
      version: '1',
      chainId: fhevm.chainId,
      verifyingContract: contractAddress
    };

    const types = {
      Decrypt: [
        { name: 'ciphertext', type: 'bytes' },
        { name: 'user', type: 'address' }
      ]
    };

    const value = {
      ciphertext: ciphertextBytes,
      user: userAddress
    };

    // Sign the typed data
    const signature = await signer.signTypedData(domain, types, value);

    // Decrypt using fhevmjs
    const decrypted = await fhevm.instance.decrypt(contractAddress, ciphertextBytes);

    if (fhevm.config.debug) {
      console.log('[FHEVM SDK] User decrypt successful');
    }

    return decrypted as T;
  } catch (error: any) {
    throw new FhevmError(
      `Failed to decrypt (user): ${error.message}`,
      'USER_DECRYPT_ERROR',
      error
    );
  }
}

/**
 * Public decrypt (no signature required)
 *
 * @example
 * ```typescript
 * const decrypted = await publicDecrypt(fhevm, {
 *   ciphertext: encrypted,
 *   contractAddress: '0x...'
 * });
 * ```
 */
export async function publicDecrypt<T = any>(
  fhevm: FhevmInstance,
  options: PublicDecryptOptions
): Promise<T> {
  try {
    const { ciphertext, contractAddress } = options;

    if (fhevm.config.debug) {
      console.log('[FHEVM SDK] Public decrypt:', {
        contractAddress,
        ciphertextLength: typeof ciphertext === 'string' ? ciphertext.length : ciphertext.length
      });
    }

    // Convert ciphertext if needed
    const ciphertextBytes = typeof ciphertext === 'string'
      ? hexToUint8Array(ciphertext)
      : ciphertext;

    // Decrypt using fhevmjs (public method)
    const decrypted = await fhevm.instance.decrypt(contractAddress, ciphertextBytes);

    if (fhevm.config.debug) {
      console.log('[FHEVM SDK] Public decrypt successful');
    }

    return decrypted as T;
  } catch (error: any) {
    throw new FhevmError(
      `Failed to decrypt (public): ${error.message}`,
      'PUBLIC_DECRYPT_ERROR',
      error
    );
  }
}

/**
 * Generic decrypt (chooses method based on options)
 *
 * @example
 * ```typescript
 * // User decrypt
 * const decrypted1 = await decrypt(fhevm, {
 *   ciphertext: encrypted,
 *   contractAddress: '0x...',
 *   userAddress: '0x...',
 *   signer: ethersJsSigner
 * });
 *
 * // Public decrypt
 * const decrypted2 = await decrypt(fhevm, {
 *   ciphertext: encrypted,
 *   contractAddress: '0x...'
 * });
 * ```
 */
export async function decrypt<T = any>(
  fhevm: FhevmInstance,
  options: UserDecryptOptions | PublicDecryptOptions
): Promise<T> {
  if ('signer' in options && options.signer) {
    return userDecrypt<T>(fhevm, options as UserDecryptOptions);
  } else {
    return publicDecrypt<T>(fhevm, options as PublicDecryptOptions);
  }
}

/**
 * Decrypt multiple values in batch
 *
 * @example
 * ```typescript
 * const decrypted = await decryptBatch(fhevm, [
 *   { ciphertext: encrypted1, contractAddress: '0x...', userAddress: '0x...', signer },
 *   { ciphertext: encrypted2, contractAddress: '0x...' }
 * ]);
 * ```
 */
export async function decryptBatch<T = any>(
  fhevm: FhevmInstance,
  options: Array<UserDecryptOptions | PublicDecryptOptions>
): Promise<T[]> {
  return Promise.all(
    options.map(opt => decrypt<T>(fhevm, opt))
  );
}

/**
 * Helper: Convert hex string to Uint8Array
 */
function hexToUint8Array(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);

  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }

  return bytes;
}

/**
 * Helper: Convert Uint8Array to hex string
 */
export function uint8ArrayToHex(bytes: Uint8Array): string {
  return '0x' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
