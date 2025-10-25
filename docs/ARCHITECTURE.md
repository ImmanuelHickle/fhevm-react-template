# FHEVM SDK Architecture

Comprehensive architecture documentation for the Universal FHEVM SDK.

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Component Design](#component-design)
4. [Data Flow](#data-flow)
5. [Framework Adapters](#framework-adapters)
6. [Security Model](#security-model)
7. [Performance Considerations](#performance-considerations)

---

## Overview

The FHEVM SDK is a **framework-agnostic**, **type-safe**, and **developer-friendly** SDK for building applications with Fully Homomorphic Encryption (FHE) on Ethereum.

### Design Principles

1. **Framework Agnostic**: Core SDK works in any JavaScript environment
2. **Type Safe**: Full TypeScript support with comprehensive type definitions
3. **Developer Friendly**: Familiar API patterns (similar to wagmi, ethers.js)
4. **Modular**: Framework-specific adapters built on universal core
5. **Secure by Default**: Best practices enforced at the SDK level
6. **Performant**: Optimized for production use with caching and batching

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                       │
│  (React, Vue, Next.js, Node.js, Vanilla JS, etc.)          │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                Framework Adapters Layer                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  React   │  │   Vue    │  │  Angular │  │  Svelte  │   │
│  │  Hooks   │  │Composable│  │ Services │  │  Stores  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
┌───────▼─────────────▼─────────────▼─────────────▼──────────┐
│                    Core SDK Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Initialization│  │  Encryption  │  │  Decryption  │     │
│  │   Manager    │  │   Engine     │  │   Engine     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Contract   │  │    Cache     │  │    Error     │     │
│  │   Manager    │  │   Manager    │  │   Handler    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  FHEVM Protocol Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Gateway    │  │     ACL      │  │  KMS Verifier│     │
│  │   Service    │  │   Contract   │  │   Contract   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Blockchain Layer                           │
│               (Ethereum + FHEVM Extensions)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Design

### Core SDK Components

#### 1. Initialization Manager

**Responsibilities:**
- Creates and configures FHEVM instances
- Manages network connections
- Retrieves and validates public keys
- Handles chain ID verification

**Key Functions:**

```typescript
class InitializationManager {
  async createInstance(config: FhevmConfig): Promise<FhevmInstance> {
    // 1. Validate configuration
    this.validateConfig(config);

    // 2. Connect to network
    const provider = await this.connectToNetwork(config.network);

    // 3. Retrieve public key from gateway
    const publicKey = await this.getPublicKey(config.gatewayUrl);

    // 4. Get chain ID
    const chainId = await provider.getChainId();

    // 5. Initialize ACL and KMS contracts
    const acl = await this.initializeACL(config.aclAddress);
    const kms = await this.initializeKMS(config.kmsVerifierAddress);

    // 6. Create instance
    return new FhevmInstance({
      publicKey,
      chainId,
      config,
      acl,
      kms
    });
  }

  validateConfig(config: FhevmConfig): void {
    if (!config.network) throw new Error('Network is required');
    if (!config.contractAddress) throw new Error('Contract address is required');
    if (!ethers.utils.isAddress(config.contractAddress)) {
      throw new Error('Invalid contract address');
    }
  }
}
```

---

#### 2. Encryption Engine

**Responsibilities:**
- Encrypts data using TFHE library
- Handles different FHE data types
- Manages encryption parameters
- Validates input ranges

**Key Functions:**

```typescript
class EncryptionEngine {
  async encrypt(
    value: number | boolean | string,
    type: FheDataType,
    publicKey: string
  ): Promise<Uint8Array> {
    // 1. Validate input
    this.validateInput(value, type);

    // 2. Convert value to appropriate format
    const normalizedValue = this.normalizeValue(value, type);

    // 3. Get encryption parameters
    const params = this.getEncryptionParams(type);

    // 4. Encrypt using TFHE
    const encrypted = await tfhe.encrypt(
      normalizedValue,
      publicKey,
      params
    );

    // 5. Return encrypted bytes
    return encrypted;
  }

  validateInput(value: any, type: FheDataType): void {
    switch (type) {
      case 'euint8':
        if (value < 0 || value > 255) {
          throw new Error('Value out of range for euint8 (0-255)');
        }
        break;
      case 'euint16':
        if (value < 0 || value > 65535) {
          throw new Error('Value out of range for euint16 (0-65535)');
        }
        break;
      case 'euint32':
        if (value < 0 || value > 4294967295) {
          throw new Error('Value out of range for euint32 (0-4294967295)');
        }
        break;
      case 'ebool':
        if (typeof value !== 'boolean') {
          throw new Error('Value must be boolean for ebool type');
        }
        break;
      case 'eaddress':
        if (!ethers.utils.isAddress(value)) {
          throw new Error('Invalid Ethereum address');
        }
        break;
    }
  }
}
```

---

#### 3. Decryption Engine

**Responsibilities:**
- Decrypts FHE data
- Manages EIP-712 signatures
- Handles user-specific and public decryption
- Coordinates with gateway service

**Key Functions:**

```typescript
class DecryptionEngine {
  async userDecrypt(
    contractAddress: string,
    encryptedData: Uint8Array,
    userAddress: string,
    signer: Signer
  ): Promise<any> {
    // 1. Generate EIP-712 signature
    const signature = await this.generateSignature(
      contractAddress,
      encryptedData,
      userAddress,
      signer
    );

    // 2. Request decryption from gateway
    const decryptedValue = await this.requestDecryption(
      encryptedData,
      signature,
      'user'
    );

    // 3. Verify and return result
    return this.verifyDecryption(decryptedValue);
  }

  async publicDecrypt(
    contractAddress: string,
    encryptedData: Uint8Array
  ): Promise<any> {
    // 1. Request public decryption (no signature needed)
    const decryptedValue = await this.requestDecryption(
      encryptedData,
      null,
      'public'
    );

    // 2. Return result
    return decryptedValue;
  }

  async generateSignature(
    contractAddress: string,
    encryptedData: Uint8Array,
    userAddress: string,
    signer: Signer
  ): Promise<string> {
    const domain = {
      name: 'FHEVM',
      version: '1',
      chainId: await signer.getChainId(),
      verifyingContract: contractAddress
    };

    const types = {
      Reencrypt: [
        { name: 'publicKey', type: 'bytes' },
        { name: 'signature', type: 'bytes' }
      ]
    };

    const value = {
      publicKey: this.publicKey,
      signature: ethers.utils.hexlify(encryptedData)
    };

    return signer._signTypedData(domain, types, value);
  }
}
```

---

#### 4. Contract Manager

**Responsibilities:**
- Creates contract instances
- Manages contract interactions
- Handles transaction preparation
- Manages gas estimation

**Key Functions:**

```typescript
class ContractManager {
  createContract(
    address: string,
    abi: any[],
    signer: Signer
  ): Contract {
    return new ethers.Contract(address, abi, signer);
  }

  async prepareTransaction(
    contract: Contract,
    method: string,
    args: any[]
  ): Promise<TransactionRequest> {
    // 1. Encode function call
    const data = contract.interface.encodeFunctionData(method, args);

    // 2. Estimate gas
    const gasLimit = await contract.estimateGas[method](...args);

    // 3. Get gas price
    const gasPrice = await contract.provider.getGasPrice();

    // 4. Return transaction request
    return {
      to: contract.address,
      data,
      gasLimit,
      gasPrice
    };
  }
}
```

---

#### 5. Cache Manager

**Responsibilities:**
- Caches FHEVM instances
- Caches public keys
- Manages cache invalidation
- Optimizes repeated operations

**Implementation:**

```typescript
class CacheManager {
  private instanceCache: Map<string, FhevmInstance> = new Map();
  private publicKeyCache: Map<string, string> = new Map();
  private ttl: number = 3600000; // 1 hour

  getCachedInstance(key: string): FhevmInstance | null {
    const cached = this.instanceCache.get(key);
    if (cached && !this.isExpired(cached)) {
      return cached;
    }
    this.instanceCache.delete(key);
    return null;
  }

  setCachedInstance(key: string, instance: FhevmInstance): void {
    this.instanceCache.set(key, {
      ...instance,
      cachedAt: Date.now()
    });
  }

  isExpired(cached: any): boolean {
    return Date.now() - cached.cachedAt > this.ttl;
  }

  clearCache(): void {
    this.instanceCache.clear();
    this.publicKeyCache.clear();
  }
}
```

---

#### 6. Error Handler

**Responsibilities:**
- Handles and categorizes errors
- Provides user-friendly error messages
- Logs errors for debugging
- Suggests remediation steps

**Implementation:**

```typescript
class ErrorHandler {
  handle(error: Error): FhevmError {
    // Network errors
    if (error.message.includes('network')) {
      return new NetworkError(
        'Failed to connect to network. Please check your internet connection.',
        error
      );
    }

    // Encryption errors
    if (error.message.includes('encrypt')) {
      return new EncryptionError(
        'Encryption failed. Please check input value and type.',
        error
      );
    }

    // Decryption errors
    if (error.message.includes('decrypt')) {
      return new DecryptionError(
        'Decryption failed. Please verify your signature and permissions.',
        error
      );
    }

    // Contract errors
    if (error.message.includes('contract')) {
      return new ContractError(
        'Contract interaction failed. Please check contract address and ABI.',
        error
      );
    }

    // Generic error
    return new FhevmError('An unexpected error occurred.', error);
  }
}
```

---

## Data Flow

### Encryption Flow

```
User Input
    │
    ▼
┌─────────────────┐
│  Validate Input │
│  (Range Check)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Normalize Value │
│ (Type Conversion)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Encrypt with    │
│ Public Key      │
│ (TFHE Library)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return Encrypted│
│ Uint8Array      │
└─────────────────┘
```

### Decryption Flow (User Decrypt)

```
Encrypted Data
    │
    ▼
┌─────────────────┐
│ Generate EIP-712│
│ Signature       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Send to Gateway │
│ with Signature  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Gateway Verifies│
│ Signature       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Gateway Decrypts│
│ & Returns Value │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return Decrypted│
│ Value to User   │
└─────────────────┘
```

### Smart Contract Interaction Flow

```
User Action
    │
    ▼
┌─────────────────┐
│ Encrypt Input   │
│ Values          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Prepare         │
│ Transaction     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Estimate Gas    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Sign Transaction│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Send to Network │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Wait for        │
│ Confirmation    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return Receipt  │
└─────────────────┘
```

---

## Framework Adapters

### React Adapter Architecture

```typescript
// React adapter built on core SDK
export function useFhevm(config: FhevmConfig) {
  const [fhevm, setFhevm] = useState<FhevmInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const instance = await createFhevmInstance(config);
        if (mounted) {
          setFhevm(instance);
          setIsReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [config.network, config.contractAddress]);

  return { fhevm, isReady, error };
}
```

### Vue Adapter Architecture

```typescript
// Vue adapter built on core SDK
export function useFhevm(config: FhevmConfig) {
  const fhevm = ref<FhevmInstance | null>(null);
  const isReady = ref(false);
  const error = ref<Error | null>(null);

  onMounted(async () => {
    try {
      const instance = await createFhevmInstance(config);
      fhevm.value = instance;
      isReady.value = true;
    } catch (err) {
      error.value = err as Error;
    }
  });

  return { fhevm, isReady, error };
}
```

---

## Security Model

### Encryption Security

1. **Client-Side Encryption**: All sensitive data encrypted in browser before transmission
2. **Public Key Cryptography**: Uses TFHE public key from gateway
3. **No Plaintext Transmission**: Encrypted data never transmitted as plaintext
4. **Type Safety**: TypeScript enforces correct data types

### Decryption Security

1. **EIP-712 Signatures**: User authentication via standardized signatures
2. **Address Verification**: Only authorized addresses can decrypt
3. **ACL Integration**: Access control enforced at smart contract level
4. **Gateway Validation**: Gateway verifies all decryption requests

### Smart Contract Security

1. **Access Control**: FHEVM ACL contract enforces permissions
2. **Encrypted State**: Sensitive state variables stored encrypted
3. **Audit Trail**: All operations logged on-chain
4. **No Backdoors**: No privileged decryption access

---

## Performance Considerations

### Optimization Strategies

#### 1. Caching

```typescript
// Cache FHEVM instances
const instanceCache = new Map<string, FhevmInstance>();

function getCachedInstance(key: string): FhevmInstance | undefined {
  return instanceCache.get(key);
}
```

#### 2. Batch Operations

```typescript
// Batch encrypt multiple values
async function batchEncrypt(
  values: number[],
  type: FheDataType
): Promise<Uint8Array[]> {
  return Promise.all(values.map(v => encrypt(fhevm, v, type)));
}
```

#### 3. Lazy Initialization

```typescript
// Initialize only when needed
let fhevmInstance: FhevmInstance | null = null;

async function getFhevm(): Promise<FhevmInstance> {
  if (!fhevmInstance) {
    fhevmInstance = await createFhevmInstance(config);
  }
  return fhevmInstance;
}
```

#### 4. Request Deduplication

```typescript
// Avoid duplicate requests
const pendingRequests = new Map<string, Promise<any>>();

async function deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const promise = fn();
  pendingRequests.set(key, promise);

  try {
    return await promise;
  } finally {
    pendingRequests.delete(key);
  }
}
```

---

## Resources

- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[Getting Started](./getting-started.md)** - Quick setup guide
- **[Examples](../examples/)** - Working code examples
- **[Zama Documentation](https://docs.zama.ai/fhevm)** - Official FHEVM docs

---

**Last Updated**: 2024-10-29
