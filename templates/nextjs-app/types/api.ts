/**
 * API Type Definitions
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptApiRequest {
  value: any;
  type?: string;
  network?: string;
  contractAddress?: string;
}

export interface EncryptApiResponse {
  success: boolean;
  encrypted: string; // base64 encoded
  type: string;
  originalValue?: any;
}

export interface DecryptApiRequest {
  ciphertext: string; // base64 encoded
  contractAddress?: string;
  network?: string;
  decryptMethod?: 'public' | 'user';
}

export interface DecryptApiResponse {
  success: boolean;
  decrypted: any;
  method: string;
}

export interface ComputeApiRequest {
  operation: string;
  values: any[];
  type?: string;
  network?: string;
  contractAddress?: string;
}

export interface ComputeApiResponse {
  success: boolean;
  message: string;
  note: string;
  operation: string;
  encryptedValues: string[];
  count: number;
  hint: string;
}

export interface KeyApiResponse {
  success: boolean;
  keyInfo?: {
    network: string;
    contractAddress: string;
    hasPublicKey: boolean;
    message: string;
    note: string;
  };
  message?: string;
}
