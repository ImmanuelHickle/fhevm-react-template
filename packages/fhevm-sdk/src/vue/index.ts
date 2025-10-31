export { useFhevm, type UseFhevmReturn } from './composables/useFhevm';

// Re-export core types for convenience
export type {
  FhevmInstance,
  FhevmConfig,
  EncryptType,
  UserDecryptOptions,
  PublicDecryptOptions
} from '../core/types';
