/**
 * Contract interaction utilities with FHEVM support
 */

import { ethers } from 'ethers';
import type { FhevmInstance, ContractOptions } from './types';
import { FhevmError } from './types';

/**
 * Create contract instance with FHEVM support
 *
 * @example
 * ```typescript
 * const contract = createContract(fhevm, {
 *   address: '0x...',
 *   abi: contractABI,
 *   signer: ethersJsSigner
 * });
 *
 * const tx = await contract.submitEncryptedData(encryptedValue);
 * ```
 */
export function createContract(
  fhevm: FhevmInstance,
  options: ContractOptions
): ethers.Contract {
  try {
    const { address, abi, signer, provider } = options;

    // Use signer if provided, otherwise provider, otherwise fhevm provider
    const signerOrProvider = signer || provider || fhevm.provider;

    return new ethers.Contract(address, abi, signerOrProvider);
  } catch (error: any) {
    throw new FhevmError(
      `Failed to create contract: ${error.message}`,
      'CONTRACT_CREATION_ERROR',
      error
    );
  }
}

/**
 * Call contract function with encrypted input
 *
 * @example
 * ```typescript
 * const result = await callWithEncrypted(fhevm, contract, 'submitData', [
 *   encryptedValue1,
 *   encryptedValue2
 * ]);
 * ```
 */
export async function callWithEncrypted(
  fhevm: FhevmInstance,
  contract: ethers.Contract,
  functionName: string,
  encryptedArgs: any[],
  options?: any
): Promise<any> {
  try {
    if (fhevm.config.debug) {
      console.log('[FHEVM SDK] Calling contract function:', functionName);
    }

    const tx = await contract[functionName](...encryptedArgs, options || {});
    const receipt = await tx.wait();

    if (fhevm.config.debug) {
      console.log('[FHEVM SDK] Transaction confirmed:', receipt.hash);
    }

    return receipt;
  } catch (error: any) {
    throw new FhevmError(
      `Failed to call contract function ${functionName}: ${error.message}`,
      'CONTRACT_CALL_ERROR',
      error
    );
  }
}
