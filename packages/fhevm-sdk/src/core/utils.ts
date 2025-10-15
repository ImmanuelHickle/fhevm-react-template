/**
 * Utility functions
 */

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: number;
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = 2 } = options;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(delay * Math.pow(backoff, i));
    }
  }

  throw new Error('Retry failed');
}

/**
 * Format address (0x1234...5678)
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Is valid Ethereum address
 */
export function isAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
