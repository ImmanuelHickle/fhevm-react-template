/**
 * FHE Type Definitions and Utilities
 */

export type EncryptType =
  | 'euint8'
  | 'euint16'
  | 'euint32'
  | 'euint64'
  | 'euint128'
  | 'euint256'
  | 'ebool'
  | 'eaddress';

export interface EncryptedValue {
  ciphertext: Uint8Array;
  type: EncryptType;
  encryptedAt: Date;
}

export interface DecryptOptions {
  ciphertext: Uint8Array;
  contractAddress: string;
  userAddress?: string;
  signer?: any;
}

/**
 * Get the maximum value for a given encrypt type
 */
export function getMaxValue(type: EncryptType): bigint {
  switch (type) {
    case 'euint8':
      return 255n;
    case 'euint16':
      return 65535n;
    case 'euint32':
      return 4294967295n;
    case 'euint64':
      return 18446744073709551615n;
    case 'euint128':
      return (1n << 128n) - 1n;
    case 'euint256':
      return (1n << 256n) - 1n;
    case 'ebool':
      return 1n;
    case 'eaddress':
      return (1n << 160n) - 1n;
    default:
      throw new Error(`Unknown encrypt type: ${type}`);
  }
}

/**
 * Validate value for encrypt type
 */
export function validateValue(value: any, type: EncryptType): boolean {
  if (type === 'ebool') {
    return typeof value === 'boolean';
  }

  if (type === 'eaddress') {
    return typeof value === 'string' && value.startsWith('0x') && value.length === 42;
  }

  const numValue = BigInt(value);
  const maxValue = getMaxValue(type);

  return numValue >= 0n && numValue <= maxValue;
}

/**
 * Get human-readable type description
 */
export function getTypeDescription(type: EncryptType): string {
  switch (type) {
    case 'euint8':
      return 'Unsigned 8-bit integer (0-255)';
    case 'euint16':
      return 'Unsigned 16-bit integer (0-65,535)';
    case 'euint32':
      return 'Unsigned 32-bit integer (0-4,294,967,295)';
    case 'euint64':
      return 'Unsigned 64-bit integer (0-18,446,744,073,709,551,615)';
    case 'euint128':
      return 'Unsigned 128-bit integer';
    case 'euint256':
      return 'Unsigned 256-bit integer';
    case 'ebool':
      return 'Boolean (true/false)';
    case 'eaddress':
      return 'Ethereum address';
    default:
      return 'Unknown type';
  }
}
