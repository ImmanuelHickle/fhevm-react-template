/**
 * FHEVM instance creation and management
 */

import { ethers } from 'ethers';
import { createInstance as createFhevmjsInstance } from 'fhevmjs';
import type { FhevmConfig, FhevmInstance, NetworkName } from './types';
import { FhevmError, NETWORK_CONFIGS } from './types';

/**
 * Create FHEVM instance
 *
 * @example
 * ```typescript
 * const fhevm = await createFhevmInstance({
 *   network: 'sepolia',
 *   contractAddress: '0x1234...'
 * });
 * ```
 */
export async function createFhevmInstance(config: FhevmConfig): Promise<FhevmInstance> {
  try {
    // Resolve network configuration
    const networkConfig = resolveNetworkConfig(config);

    // Create provider
    const provider = config.provider || new ethers.JsonRpcProvider(networkConfig.rpcUrl);

    // Get chain ID
    const network = await provider.getNetwork();
    const chainId = config.chainId || Number(network.chainId);

    if (config.debug) {
      console.log('[FHEVM SDK] Creating instance:', {
        network: config.network,
        chainId,
        contractAddress: config.contractAddress
      });
    }

    // Create fhevmjs instance
    const instance = await createFhevmjsInstance({
      chainId,
      network: provider,
      gatewayUrl: 'https://gateway.sepolia.zama.ai',
      aclAddress: '0x...' // TODO: Get from config or auto-detect
    });

    // Get public key
    const publicKey = config.publicKey || instance.getPublicKey();

    if (config.debug) {
      console.log('[FHEVM SDK] Instance created successfully');
    }

    return {
      config: {
        ...config,
        rpcUrl: networkConfig.rpcUrl,
        chainId
      },
      instance,
      publicKey,
      chainId,
      provider
    };
  } catch (error: any) {
    throw new FhevmError(
      `Failed to create FHEVM instance: ${error.message}`,
      'INSTANCE_CREATION_ERROR',
      error
    );
  }
}

/**
 * Resolve network configuration
 */
function resolveNetworkConfig(config: FhevmConfig): { rpcUrl: string; chainId?: number } {
  // If custom RPC URL provided, use it
  if (config.rpcUrl) {
    return {
      rpcUrl: config.rpcUrl,
      chainId: config.chainId
    };
  }

  // Check for network preset
  const preset = NETWORK_CONFIGS[config.network];
  if (preset) {
    return preset;
  }

  // If network looks like a URL, use it as RPC URL
  if (config.network.startsWith('http://') || config.network.startsWith('https://')) {
    return {
      rpcUrl: config.network,
      chainId: config.chainId
    };
  }

  throw new FhevmError(
    `Unknown network: ${config.network}. Provide a valid network name or custom rpcUrl.`,
    'INVALID_NETWORK'
  );
}

/**
 * Get FHEVM instance info
 */
export function getInstanceInfo(fhevm: FhevmInstance) {
  return {
    network: fhevm.config.network,
    chainId: fhevm.chainId,
    contractAddress: fhevm.config.contractAddress,
    publicKey: fhevm.publicKey.substring(0, 20) + '...',
    hasProvider: !!fhevm.provider
  };
}

/**
 * Check if FHEVM instance is ready
 */
export function isInstanceReady(fhevm: FhevmInstance): boolean {
  return !!(fhevm && fhevm.instance && fhevm.publicKey && fhevm.provider);
}
