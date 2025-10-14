/**
 * @fhevm/sdk - Universal SDK for Zama FHEVM
 * Framework-agnostic, developer-friendly SDK for building confidential frontends
 *
 * @example
 * ```typescript
 * import { createFhevmInstance, encrypt, decrypt } from '@fhevm/sdk';
 *
 * const fhevm = await createFhevmInstance({
 *   network: 'sepolia',
 *   contractAddress: '0x...'
 * });
 *
 * const encrypted = await encrypt(fhevm, 42, 'euint32');
 * const decrypted = await decrypt(fhevm, encrypted);
 * ```
 */

// Core exports
export * from './core/fhevm-instance';
export * from './core/encryption';
export * from './core/decryption';
export * from './core/contract';
export * from './core/types';
export * from './core/utils';

// Re-export for convenience
export type {
  FhevmConfig,
  FhevmInstance,
  EncryptType,
  EncryptOptions,
  DecryptOptions,
  UserDecryptOptions,
  PublicDecryptOptions,
  ContractOptions,
  FhevmError
} from './core/types';
