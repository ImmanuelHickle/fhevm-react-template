/**
 * Encryption utilities for FHEVM
 */

import type { FhevmInstance, EncryptType, EncryptOptions, EncryptionResult } from './types';
import { FhevmError } from './types';

/**
 * Encrypt a value for on-chain storage
 *
 * @example
 * ```typescript
 * // Encrypt a number
 * const encrypted = await encrypt(fhevm, 42, 'euint32');
 *
 * // Encrypt a boolean
 * const encryptedBool = await encrypt(fhevm, true, 'ebool');
 * ```
 */
export async function encrypt<T = any>(
  fhevm: FhevmInstance,
  value: T,
  typeOrOptions?: EncryptType | EncryptOptions
): Promise<Uint8Array> {
  try {
    // Parse options
    const options = typeof typeOrOptions === 'string'
      ? { type: typeOrOptions }
      : typeOrOptions || {};

    const type = options.type || inferType(value);
    const contractAddress = options.contractAddress || fhevm.config.contractAddress;

    if (fhevm.config.debug) {
      console.log('[FHEVM SDK] Encrypting:', { value, type, contractAddress });
    }

    // Use fhevmjs instance to encrypt
    const encrypted = fhevm.instance.encrypt(type, value);

    if (fhevm.config.debug) {
      console.log('[FHEVM SDK] Encryption successful');
    }

    return encrypted;
  } catch (error: any) {
    throw new FhevmError(
      `Failed to encrypt value: ${error.message}`,
      'ENCRYPTION_ERROR',
      error
    );
  }
}

/**
 * Encrypt multiple values in batch
 *
 * @example
 * ```typescript
 * const encrypted = await encryptBatch(fhevm, [
 *   { value: 42, type: 'euint32' },
 *   { value: true, type: 'ebool' }
 * ]);
 * ```
 */
export async function encryptBatch(
  fhevm: FhevmInstance,
  values: Array<{ value: any; type?: EncryptType; contractAddress?: string }>
): Promise<Uint8Array[]> {
  return Promise.all(
    values.map(({ value, type, contractAddress }) =>
      encrypt(fhevm, value, { type, contractAddress })
    )
  );
}

/**
 * Infer encryption type from value
 */
function inferType(value: any): EncryptType {
  if (typeof value === 'boolean') {
    return 'ebool';
  }

  if (typeof value === 'number') {
    if (value >= 0 && value < 256) return 'euint8';
    if (value >= 0 && value < 65536) return 'euint16';
    if (value >= 0 && value < 4294967296) return 'euint32';
    return 'euint64';
  }

  if (typeof value === 'bigint') {
    if (value < BigInt(256)) return 'euint8';
    if (value < BigInt(65536)) return 'euint16';
    if (value < BigInt(4294967296)) return 'euint32';
    if (value < BigInt('18446744073709551616')) return 'euint64';
    if (value < BigInt('340282366920938463463374607431768211456')) return 'euint128';
    return 'euint256';
  }

  if (typeof value === 'string' && value.startsWith('0x')) {
    return 'eaddress';
  }

  throw new FhevmError(
    `Cannot infer encryption type for value: ${value}`,
    'TYPE_INFERENCE_ERROR'
  );
}

/**
 * Get encryption type size in bits
 */
export function getTypeSize(type: EncryptType): number {
  const sizes: Record<EncryptType, number> = {
    euint8: 8,
    euint16: 16,
    euint32: 32,
    euint64: 64,
    euint128: 128,
    euint256: 256,
    ebool: 1,
    eaddress: 160
  };

  return sizes[type];
}

/**
 * Validate encryption type
 */
export function isValidEncryptType(type: string): type is EncryptType {
  return ['euint8', 'euint16', 'euint32', 'euint64', 'euint128', 'euint256', 'ebool', 'eaddress'].includes(type);
}
