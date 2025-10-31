/**
 * Security Utilities
 * Helper functions for secure FHE operations
 */

import { ethers } from 'ethers';

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[^\w\s.-]/g, '');
}

/**
 * Validate numeric input for encryption
 */
export function validateNumericInput(value: string, min?: number, max?: number): boolean {
  const num = parseFloat(value);

  if (isNaN(num)) {
    return false;
  }

  if (min !== undefined && num < min) {
    return false;
  }

  if (max !== undefined && num > max) {
    return false;
  }

  return true;
}

/**
 * Generate secure random bytes
 */
export function generateSecureRandom(length: number): Uint8Array {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto.getRandomValues(new Uint8Array(length));
  }

  // Fallback for server-side
  const crypto = require('crypto');
  return new Uint8Array(crypto.randomBytes(length));
}

/**
 * Hash data using SHA-256
 */
export async function sha256(data: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for server-side
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Validate contract interaction parameters
 */
export function validateContractParams(params: {
  contractAddress?: string;
  userAddress?: string;
  value?: any;
}): { valid: boolean; error?: string } {
  if (params.contractAddress && !isValidAddress(params.contractAddress)) {
    return { valid: false, error: 'Invalid contract address' };
  }

  if (params.userAddress && !isValidAddress(params.userAddress)) {
    return { valid: false, error: 'Invalid user address' };
  }

  if (params.value !== undefined && params.value === null) {
    return { valid: false, error: 'Value cannot be null' };
  }

  return { valid: true };
}

/**
 * Check if running in secure context (HTTPS)
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') {
    return true; // Server-side is considered secure
  }

  return window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
}

/**
 * Mask sensitive data for display
 */
export function maskSensitiveData(data: string, visibleChars: number = 6): string {
  if (data.length <= visibleChars * 2) {
    return data;
  }

  const start = data.substring(0, visibleChars);
  const end = data.substring(data.length - visibleChars);
  return `${start}...${end}`;
}
