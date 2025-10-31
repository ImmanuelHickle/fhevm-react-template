/**
 * FHE Key Management Utilities
 */

/**
 * Key management is handled automatically by the SDK
 * This file provides helper functions for key-related operations
 */

export interface KeyInfo {
  network: string;
  contractAddress: string;
  hasPublicKey: boolean;
  keyFetchedAt?: Date;
}

/**
 * Get key information
 */
export async function getKeyInfo(network: string, contractAddress: string): Promise<KeyInfo> {
  try {
    const response = await fetch(`/api/keys?network=${network}&contractAddress=${contractAddress}`);
    const data = await response.json();

    return {
      network,
      contractAddress,
      hasPublicKey: data.success,
      keyFetchedAt: new Date(),
    };
  } catch (error) {
    console.error('Failed to fetch key info:', error);
    throw error;
  }
}

/**
 * Refresh FHE keys
 */
export async function refreshKeys(network: string, contractAddress: string): Promise<void> {
  try {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'refresh',
        network,
        contractAddress,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh keys');
    }

    console.log('Keys refreshed successfully');
  } catch (error) {
    console.error('Failed to refresh keys:', error);
    throw error;
  }
}

/**
 * Check if keys are available
 */
export async function checkKeysAvailable(network: string, contractAddress: string): Promise<boolean> {
  try {
    const info = await getKeyInfo(network, contractAddress);
    return info.hasPublicKey;
  } catch (error) {
    console.error('Failed to check key availability:', error);
    return false;
  }
}
