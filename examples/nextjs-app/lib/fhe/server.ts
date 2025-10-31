import { createFhevmInstance, encrypt, publicDecrypt } from '@fhevm/sdk';
import type { FhevmInstance, FhevmConfig, EncryptType } from '@fhevm/sdk';

/**
 * Server-side FHE Operations
 * Utilities for working with FHEVM on the server (API routes)
 */

/**
 * Initialize FHEVM server instance
 */
export async function initializeFhevmServer(config: FhevmConfig): Promise<FhevmInstance> {
  try {
    const fhevm = await createFhevmInstance(config);
    console.log('FHEVM server initialized successfully');
    return fhevm;
  } catch (error) {
    console.error('Failed to initialize FHEVM server:', error);
    throw error;
  }
}

/**
 * Encrypt value on server side
 */
export async function serverEncrypt<T>(
  fhevm: FhevmInstance,
  value: T,
  type?: EncryptType
): Promise<Uint8Array> {
  try {
    const encrypted = await encrypt(fhevm, value, type);
    return encrypted;
  } catch (error) {
    console.error('Server encryption failed:', error);
    throw error;
  }
}

/**
 * Public decrypt (server-side, no signature required)
 */
export async function serverPublicDecrypt(
  fhevm: FhevmInstance,
  ciphertext: Uint8Array,
  contractAddress: string
): Promise<any> {
  try {
    const decrypted = await publicDecrypt(fhevm, {
      ciphertext,
      contractAddress,
    });
    return decrypted;
  } catch (error) {
    console.error('Server decryption failed:', error);
    throw error;
  }
}

/**
 * Get default server config
 */
export function getServerConfig(): FhevmConfig {
  return {
    network: (process.env.NEXT_PUBLIC_NETWORK as any) || 'sepolia',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  };
}

export { publicDecrypt };
