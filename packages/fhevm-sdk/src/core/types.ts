/**
 * Core TypeScript types for FHEVM SDK
 */

import type { Signer, Provider } from 'ethers';

/**
 * Supported encrypted types
 */
export type EncryptType = 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'euint128' | 'euint256' | 'ebool' | 'eaddress';

/**
 * Network configuration
 */
export type NetworkName = 'sepolia' | 'localhost' | 'mainnet' | string;

/**
 * FHEVM instance configuration
 */
export interface FhevmConfig {
  /** Network name or custom RPC URL */
  network: NetworkName;

  /** Contract address for FHE operations */
  contractAddress: string;

  /** Custom RPC URL (optional, overrides network) */
  rpcUrl?: string;

  /** Chain ID (optional, auto-detected if not provided) */
  chainId?: number;

  /** Public key for encryption (optional, auto-fetched) */
  publicKey?: string;

  /** Provider instance (optional) */
  provider?: Provider;

  /** Enable debug logging */
  debug?: boolean;
}

/**
 * FHEVM instance
 */
export interface FhevmInstance {
  config: FhevmConfig;
  instance: any; // fhevmjs instance
  publicKey: string;
  chainId: number;
  provider: Provider;
}

/**
 * Encryption options
 */
export interface EncryptOptions {
  /** Type of encrypted value */
  type?: EncryptType;

  /** Contract address (uses instance default if not provided) */
  contractAddress?: string;
}

/**
 * Base decryption options
 */
export interface DecryptOptions {
  /** Ciphertext to decrypt */
  ciphertext: Uint8Array | string;

  /** Contract address */
  contractAddress: string;
}

/**
 * User decryption options (with EIP-712 signature)
 */
export interface UserDecryptOptions extends DecryptOptions {
  /** User address */
  userAddress: string;

  /** Signer for EIP-712 signature */
  signer: Signer;
}

/**
 * Public decryption options (no signature required)
 */
export interface PublicDecryptOptions extends DecryptOptions {
  /** Optional public key for decryption */
  publicKey?: string;
}

/**
 * Contract creation options
 */
export interface ContractOptions {
  /** Contract address */
  address: string;

  /** Contract ABI */
  abi: any[];

  /** Signer for transactions (optional) */
  signer?: Signer;

  /** Provider for read operations (optional) */
  provider?: Provider;
}

/**
 * FHEVM error
 */
export class FhevmError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'FhevmError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Encryption result
 */
export interface EncryptionResult {
  /** Encrypted ciphertext */
  data: Uint8Array;

  /** Encryption type */
  type: EncryptType;

  /** Contract address used */
  contractAddress: string;
}

/**
 * Decryption result
 */
export interface DecryptionResult<T = any> {
  /** Decrypted value */
  value: T;

  /** Original ciphertext */
  ciphertext: Uint8Array | string;

  /** Decryption method used */
  method: 'user' | 'public';
}

/**
 * Network configuration presets
 */
export const NETWORK_CONFIGS: Record<string, { rpcUrl: string; chainId: number }> = {
  sepolia: {
    rpcUrl: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    chainId: 11155111
  },
  localhost: {
    rpcUrl: 'http://localhost:8545',
    chainId: 31337
  }
};
