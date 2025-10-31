/**
 * FHE Type Definitions for Next.js App
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

export interface FhevmConfig {
  network: string;
  contractAddress: string;
  rpcUrl?: string;
  chainId?: number;
  debug?: boolean;
}

export interface EncryptionResult {
  encrypted: Uint8Array;
  type: EncryptType;
  timestamp: Date;
}

export interface DecryptionOptions {
  ciphertext: Uint8Array;
  contractAddress: string;
  userAddress?: string;
  signer?: any;
}

export interface FhevmInstance {
  // SDK instance type
  [key: string]: any;
}

export interface EncryptOptions {
  value: any;
  type?: EncryptType;
}

export interface ComputationResult {
  encryptedValues: Uint8Array[];
  operation?: string;
  count: number;
}
