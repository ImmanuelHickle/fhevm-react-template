import { createFhevmInstance, encrypt, decrypt, userDecrypt, publicDecrypt } from '@fhevm/sdk';
import type { FhevmInstance, FhevmConfig, EncryptType } from '@fhevm/sdk';

/**
 * Client-side FHE Operations
 * Utilities for working with FHEVM on the client
 */

/**
 * Initialize FHEVM client instance
 */
export async function initializeFhevmClient(config: FhevmConfig): Promise<FhevmInstance> {
  try {
    const fhevm = await createFhevmInstance(config);
    console.log('FHEVM client initialized successfully');
    return fhevm;
  } catch (error) {
    console.error('Failed to initialize FHEVM client:', error);
    throw error;
  }
}

/**
 * Encrypt value on client side
 */
export async function encryptValue<T>(
  fhevm: FhevmInstance,
  value: T,
  type?: EncryptType
): Promise<Uint8Array> {
  try {
    const encrypted = await encrypt(fhevm, value, type);
    console.log('Value encrypted successfully');
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
}

/**
 * Encrypt multiple values
 */
export async function encryptBatch<T>(
  fhevm: FhevmInstance,
  values: T[],
  type?: EncryptType
): Promise<Uint8Array[]> {
  try {
    const encrypted = await Promise.all(
      values.map(value => encrypt(fhevm, value, type))
    );
    console.log(`${values.length} values encrypted successfully`);
    return encrypted;
  } catch (error) {
    console.error('Batch encryption failed:', error);
    throw error;
  }
}

/**
 * Convert encrypted data to base64 for transport
 */
export function toBase64(data: Uint8Array): string {
  return Buffer.from(data).toString('base64');
}

/**
 * Convert base64 back to Uint8Array
 */
export function fromBase64(base64: string): Uint8Array {
  return Buffer.from(base64, 'base64');
}

/**
 * Prepare encrypted data for smart contract call
 */
export function prepareContractData(encrypted: Uint8Array): string {
  return '0x' + Buffer.from(encrypted).toString('hex');
}

export { decrypt, userDecrypt, publicDecrypt };
