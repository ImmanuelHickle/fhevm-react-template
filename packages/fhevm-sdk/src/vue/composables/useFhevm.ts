import { ref, onMounted, type Ref } from 'vue';
import { createFhevmInstance, type FhevmInstance, type FhevmConfig } from '../../core/fhevm-instance';
import { encrypt } from '../../core/encryption';
import { userDecrypt, publicDecrypt, type UserDecryptOptions, type PublicDecryptOptions } from '../../core/decryption';

export interface UseFhevmReturn {
  fhevm: Ref<FhevmInstance | null>;
  isReady: Ref<boolean>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  encrypt: (value: any, type?: string) => Promise<Uint8Array>;
  userDecrypt: (options: UserDecryptOptions) => Promise<any>;
  publicDecrypt: (options: PublicDecryptOptions) => Promise<any>;
  refetch: () => Promise<void>;
}

export function useFhevm(config: FhevmConfig): UseFhevmReturn {
  const fhevm = ref<FhevmInstance | null>(null);
  const isReady = ref(false);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const initializeFhevm = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const instance = await createFhevmInstance(config);
      fhevm.value = instance;
      isReady.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to initialize FHEVM');
      console.error('FHEVM initialization error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const encryptValue = async (value: any, type?: string) => {
    if (!fhevm.value) {
      throw new Error('FHEVM not initialized');
    }
    return encrypt(fhevm.value, value, type);
  };

  const userDecryptValue = async (options: UserDecryptOptions) => {
    if (!fhevm.value) {
      throw new Error('FHEVM not initialized');
    }
    return userDecrypt(fhevm.value, options);
  };

  const publicDecryptValue = async (options: PublicDecryptOptions) => {
    if (!fhevm.value) {
      throw new Error('FHEVM not initialized');
    }
    return publicDecrypt(fhevm.value, options);
  };

  const refetch = async () => {
    await initializeFhevm();
  };

  onMounted(() => {
    initializeFhevm();
  });

  return {
    fhevm,
    isReady,
    isLoading,
    error,
    encrypt: encryptValue,
    userDecrypt: userDecryptValue,
    publicDecrypt: publicDecryptValue,
    refetch
  };
}
