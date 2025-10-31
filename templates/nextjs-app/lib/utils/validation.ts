/**
 * Validation Utilities
 * Input validation for FHE operations
 */

import type { EncryptType } from '../fhe/types';
import { getMaxValue } from '../fhe/types';

/**
 * Validate value for encryption type
 */
export function validateEncryptionValue(value: any, type: EncryptType): {
  valid: boolean;
  error?: string;
} {
  // Boolean validation
  if (type === 'ebool') {
    if (typeof value !== 'boolean') {
      return { valid: false, error: 'Value must be a boolean for ebool type' };
    }
    return { valid: true };
  }

  // Address validation
  if (type === 'eaddress') {
    if (typeof value !== 'string') {
      return { valid: false, error: 'Value must be a string for eaddress type' };
    }
    if (!value.startsWith('0x') || value.length !== 42) {
      return { valid: false, error: 'Invalid Ethereum address format' };
    }
    return { valid: true };
  }

  // Numeric types validation
  try {
    const numValue = BigInt(value);
    const maxValue = getMaxValue(type);

    if (numValue < 0n) {
      return { valid: false, error: 'Value cannot be negative' };
    }

    if (numValue > maxValue) {
      return { valid: false, error: `Value exceeds maximum for ${type} (${maxValue.toString()})` };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid numeric value' };
  }
}

/**
 * Validate network name
 */
export function validateNetwork(network: string): boolean {
  const validNetworks = ['sepolia', 'localhost', 'custom'];
  return validNetworks.includes(network.toLowerCase());
}

/**
 * Validate configuration object
 */
export function validateFhevmConfig(config: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.network || typeof config.network !== 'string') {
    errors.push('Network is required and must be a string');
  } else if (!validateNetwork(config.network)) {
    errors.push('Invalid network. Must be one of: sepolia, localhost, custom');
  }

  if (!config.contractAddress || typeof config.contractAddress !== 'string') {
    errors.push('Contract address is required and must be a string');
  } else if (!config.contractAddress.startsWith('0x') || config.contractAddress.length !== 42) {
    errors.push('Invalid contract address format');
  }

  if (config.rpcUrl !== undefined && typeof config.rpcUrl !== 'string') {
    errors.push('RPC URL must be a string if provided');
  }

  if (config.chainId !== undefined && typeof config.chainId !== 'number') {
    errors.push('Chain ID must be a number if provided');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate ciphertext format
 */
export function validateCiphertext(ciphertext: any): boolean {
  if (!ciphertext) {
    return false;
  }

  // Check if it's a Uint8Array or can be converted to one
  if (ciphertext instanceof Uint8Array) {
    return ciphertext.length > 0;
  }

  // Check if it's a base64 string
  if (typeof ciphertext === 'string') {
    try {
      const decoded = Buffer.from(ciphertext, 'base64');
      return decoded.length > 0;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Validate decrypt options
 */
export function validateDecryptOptions(options: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!validateCiphertext(options.ciphertext)) {
    errors.push('Invalid ciphertext format');
  }

  if (!options.contractAddress || typeof options.contractAddress !== 'string') {
    errors.push('Contract address is required');
  }

  // User decrypt specific validation
  if (options.userAddress || options.signer) {
    if (!options.userAddress) {
      errors.push('User address is required for user decryption');
    }
    if (!options.signer) {
      errors.push('Signer is required for user decryption');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize and validate batch values
 */
export function validateBatchValues(values: any[], type: EncryptType): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!Array.isArray(values)) {
    errors.push('Values must be an array');
    return { valid: false, errors };
  }

  if (values.length === 0) {
    errors.push('Values array cannot be empty');
    return { valid: false, errors };
  }

  values.forEach((value, index) => {
    const validation = validateEncryptionValue(value, type);
    if (!validation.valid) {
      errors.push(`Value at index ${index}: ${validation.error}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
