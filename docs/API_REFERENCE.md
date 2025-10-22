# FHEVM SDK API Reference

Complete API documentation for the Universal FHEVM SDK.

---

## Table of Contents

1. [Core SDK](#core-sdk)
2. [React Hooks](#react-hooks)
3. [Vue Composables](#vue-composables)
4. [Type Definitions](#type-definitions)
5. [Configuration](#configuration)
6. [Error Handling](#error-handling)

---

## Core SDK

### `createFhevmInstance(config)`

Creates and initializes an FHEVM instance.

**Parameters:**

```typescript
interface FhevmConfig {
  network: 'localhost' | 'sepolia' | 'mainnet';
  contractAddress: string;
  gatewayUrl?: string;
  aclAddress?: string;
}
```

**Returns:** `Promise<FhevmInstance>`

**Example:**

```typescript
import { createFhevmInstance } from '@fhevm/sdk';

const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: '0x1234567890abcdef1234567890abcdef12345678'
});
```

---

### `encrypt(fhevm, value, type)`

Encrypts a value using the FHEVM instance.

**Parameters:**

- `fhevm: FhevmInstance` - Initialized FHEVM instance
- `value: number | boolean | string` - Value to encrypt
- `type: FheDataType` - FHE data type

**Returns:** `Promise<Uint8Array>`

**Supported Types:**

- `'euint8'` - Encrypted 8-bit unsigned integer
- `'euint16'` - Encrypted 16-bit unsigned integer
- `'euint32'` - Encrypted 32-bit unsigned integer
- `'euint64'` - Encrypted 64-bit unsigned integer
- `'euint128'` - Encrypted 128-bit unsigned integer
- `'euint256'` - Encrypted 256-bit unsigned integer
- `'ebool'` - Encrypted boolean
- `'eaddress'` - Encrypted Ethereum address

**Example:**

```typescript
import { encrypt } from '@fhevm/sdk';

// Encrypt a number
const encryptedValue = await encrypt(fhevm, 42, 'euint32');

// Encrypt a boolean
const encryptedBool = await encrypt(fhevm, true, 'ebool');

// Encrypt an address
const encryptedAddr = await encrypt(fhevm, '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'eaddress');
```

---

### `decrypt(fhevm, encryptedData, type)`

Decrypts encrypted data (for testing/development only).

**Parameters:**

- `fhevm: FhevmInstance` - Initialized FHEVM instance
- `encryptedData: Uint8Array` - Encrypted data to decrypt
- `type: FheDataType` - FHE data type

**Returns:** `Promise<number | boolean | string>`

**Example:**

```typescript
import { decrypt } from '@fhevm/sdk';

const decryptedValue = await decrypt(fhevm, encryptedData, 'euint32');
console.log('Decrypted:', decryptedValue); // 42
```

**Note:** This is a client-side decryption for testing only. In production, use `userDecrypt()` or `publicDecrypt()`.

---

### `userDecrypt(fhevm, contractAddress, encryptedData, userAddress, signer)`

Decrypts data using EIP-712 signature (maximum privacy).

**Parameters:**

- `fhevm: FhevmInstance` - Initialized FHEVM instance
- `contractAddress: string` - Smart contract address
- `encryptedData: Uint8Array` - Encrypted data
- `userAddress: string` - User's Ethereum address
- `signer: Signer` - Ethers.js signer

**Returns:** `Promise<number | boolean | string>`

**Example:**

```typescript
import { userDecrypt } from '@fhevm/sdk';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const userAddress = await signer.getAddress();

const decryptedValue = await userDecrypt(
  fhevm,
  contractAddress,
  encryptedData,
  userAddress,
  signer
);
```

---

### `publicDecrypt(fhevm, contractAddress, encryptedData)`

Decrypts public data without signature (for aggregate/public data).

**Parameters:**

- `fhevm: FhevmInstance` - Initialized FHEVM instance
- `contractAddress: string` - Smart contract address
- `encryptedData: Uint8Array` - Encrypted data

**Returns:** `Promise<number | boolean | string>`

**Example:**

```typescript
import { publicDecrypt } from '@fhevm/sdk';

// Decrypt public aggregate data
const totalCount = await publicDecrypt(fhevm, contractAddress, encryptedTotalData);
```

---

## React Hooks

### `useFhevm(config)`

React hook for initializing FHEVM instance.

**Parameters:** `FhevmConfig` (same as `createFhevmInstance`)

**Returns:**

```typescript
{
  fhevm: FhevmInstance | null;
  isReady: boolean;
  error: Error | null;
}
```

**Example:**

```typescript
import { useFhevm } from '@fhevm/sdk/react';

function App() {
  const { fhevm, isReady, error } = useFhevm({
    network: 'sepolia',
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678'
  });

  if (error) return <div>Error: {error.message}</div>;
  if (!isReady) return <div>Loading FHEVM SDK...</div>;

  return <div>FHEVM Ready!</div>;
}
```

---

### `useEncrypt(fhevm)`

React hook for encrypting values.

**Parameters:** `fhevm: FhevmInstance | null`

**Returns:**

```typescript
{
  encrypt: (value: number | boolean | string, type: FheDataType) => Promise<Uint8Array>;
  isEncrypting: boolean;
  encryptError: Error | null;
}
```

**Example:**

```typescript
import { useEncrypt } from '@fhevm/sdk/react';

function EncryptForm({ fhevm }) {
  const { encrypt, isEncrypting, encryptError } = useEncrypt(fhevm);
  const [value, setValue] = useState('');

  const handleSubmit = async () => {
    try {
      const encrypted = await encrypt(parseInt(value), 'euint32');
      // Send encrypted data to smart contract
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleSubmit} disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt & Submit'}
      </button>
    </div>
  );
}
```

---

### `useDecrypt(fhevm)`

React hook for decrypting values.

**Parameters:** `fhevm: FhevmInstance | null`

**Returns:**

```typescript
{
  userDecrypt: (contractAddress: string, encryptedData: Uint8Array, userAddress: string, signer: Signer) => Promise<any>;
  publicDecrypt: (contractAddress: string, encryptedData: Uint8Array) => Promise<any>;
  isDecrypting: boolean;
  decryptError: Error | null;
}
```

**Example:**

```typescript
import { useDecrypt } from '@fhevm/sdk/react';
import { useAccount, useSigner } from 'wagmi';

function DecryptButton({ fhevm, encryptedData }) {
  const { userDecrypt, isDecrypting } = useDecrypt(fhevm);
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [decryptedValue, setDecryptedValue] = useState(null);

  const handleDecrypt = async () => {
    const value = await userDecrypt(
      contractAddress,
      encryptedData,
      address,
      signer
    );
    setDecryptedValue(value);
  };

  return (
    <div>
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt Value'}
      </button>
      {decryptedValue !== null && <div>Decrypted: {decryptedValue}</div>}
    </div>
  );
}
```

---

### `useContract(fhevm, contractAddress, abi)`

React hook for interacting with FHE smart contracts.

**Parameters:**

- `fhevm: FhevmInstance | null`
- `contractAddress: string`
- `abi: any[]` - Contract ABI

**Returns:**

```typescript
{
  contract: Contract | null;
  call: (method: string, ...args: any[]) => Promise<any>;
  send: (method: string, ...args: any[]) => Promise<TransactionReceipt>;
  isLoading: boolean;
  error: Error | null;
}
```

**Example:**

```typescript
import { useContract } from '@fhevm/sdk/react';
import CounterABI from './Counter.json';

function Counter({ fhevm }) {
  const { contract, call, send, isLoading } = useContract(
    fhevm,
    '0x1234567890abcdef1234567890abcdef12345678',
    CounterABI
  );
  const [count, setCount] = useState(0);

  const getCount = async () => {
    const value = await call('getCounter');
    setCount(value);
  };

  const increment = async () => {
    const encryptedOne = await encrypt(fhevm, 1, 'euint32');
    await send('increment', encryptedOne);
    await getCount();
  };

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={increment} disabled={isLoading}>
        Increment
      </button>
    </div>
  );
}
```

---

## Vue Composables

### `useFhevm(config)`

Vue composable for initializing FHEVM instance.

**Parameters:** `FhevmConfig`

**Returns:**

```typescript
{
  fhevm: Ref<FhevmInstance | null>;
  isReady: Ref<boolean>;
  error: Ref<Error | null>;
}
```

**Example:**

```vue
<script setup lang="ts">
import { useFhevm } from '@fhevm/sdk/vue';

const { fhevm, isReady, error } = useFhevm({
  network: 'sepolia',
  contractAddress: '0x1234567890abcdef1234567890abcdef12345678'
});
</script>

<template>
  <div v-if="error">Error: {{ error.message }}</div>
  <div v-else-if="!isReady">Loading FHEVM SDK...</div>
  <div v-else>FHEVM Ready!</div>
</template>
```

---

### `useEncrypt(fhevm)`

Vue composable for encrypting values.

**Parameters:** `fhevm: Ref<FhevmInstance | null>`

**Returns:**

```typescript
{
  encrypt: (value: number | boolean | string, type: FheDataType) => Promise<Uint8Array>;
  isEncrypting: Ref<boolean>;
  encryptError: Ref<Error | null>;
}
```

**Example:**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useFhevm, useEncrypt } from '@fhevm/sdk/vue';

const { fhevm } = useFhevm({ network: 'sepolia', contractAddress: '0x...' });
const { encrypt, isEncrypting } = useEncrypt(fhevm);

const value = ref('');
const encryptedData = ref<Uint8Array | null>(null);

async function handleEncrypt() {
  encryptedData.value = await encrypt(parseInt(value.value), 'euint32');
}
</script>

<template>
  <input v-model="value" />
  <button @click="handleEncrypt" :disabled="isEncrypting">
    {{ isEncrypting ? 'Encrypting...' : 'Encrypt' }}
  </button>
</template>
```

---

## Type Definitions

### `FhevmInstance`

```typescript
interface FhevmInstance {
  publicKey: string;
  chainId: number;
  config: FhevmConfig;
  encrypt(value: any, type: FheDataType): Promise<Uint8Array>;
  decrypt(encryptedData: Uint8Array, type: FheDataType): Promise<any>;
}
```

### `FheDataType`

```typescript
type FheDataType =
  | 'euint8'
  | 'euint16'
  | 'euint32'
  | 'euint64'
  | 'euint128'
  | 'euint256'
  | 'ebool'
  | 'eaddress';
```

### `FhevmConfig`

```typescript
interface FhevmConfig {
  network: 'localhost' | 'sepolia' | 'mainnet';
  contractAddress: string;
  gatewayUrl?: string;
  aclAddress?: string;
  kmsVerifierAddress?: string;
}
```

### `EncryptedValue`

```typescript
interface EncryptedValue {
  data: Uint8Array;
  type: FheDataType;
  handles: string[];
}
```

---

## Configuration

### Network Configuration

**Localhost (Development)**

```typescript
{
  network: 'localhost',
  contractAddress: '0x...',
  gatewayUrl: 'http://localhost:8545'
}
```

**Sepolia Testnet**

```typescript
{
  network: 'sepolia',
  contractAddress: '0x...',
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
}
```

**Mainnet**

```typescript
{
  network: 'mainnet',
  contractAddress: '0x...',
  gatewayUrl: 'https://gateway.zama.ai'
}
```

---

### ACL Configuration

Access Control List (ACL) addresses for different networks:

```typescript
const ACL_ADDRESSES = {
  localhost: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  sepolia: '0x8Fb3cFDdD2E868E38688F24A98675A459eDD0beb',
  mainnet: '0x...' // TBD
};
```

---

### Gateway Configuration

Configure custom gateway URLs:

```typescript
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: '0x...',
  gatewayUrl: 'https://custom-gateway.example.com',
  aclAddress: '0x...'
});
```

---

## Error Handling

### Common Errors

**`FhevmNotInitializedError`**

Thrown when attempting to use FHEVM SDK before initialization.

```typescript
try {
  const encrypted = await encrypt(fhevm, 42, 'euint32');
} catch (error) {
  if (error instanceof FhevmNotInitializedError) {
    console.error('FHEVM not initialized. Please wait for initialization.');
  }
}
```

**`EncryptionError`**

Thrown when encryption fails.

```typescript
try {
  const encrypted = await encrypt(fhevm, value, 'euint32');
} catch (error) {
  if (error instanceof EncryptionError) {
    console.error('Encryption failed:', error.message);
  }
}
```

**`DecryptionError`**

Thrown when decryption fails.

```typescript
try {
  const decrypted = await userDecrypt(fhevm, contractAddress, data, address, signer);
} catch (error) {
  if (error instanceof DecryptionError) {
    console.error('Decryption failed:', error.message);
  }
}
```

**`InvalidNetworkError`**

Thrown when network configuration is invalid.

```typescript
try {
  const fhevm = await createFhevmInstance({
    network: 'invalid-network',
    contractAddress: '0x...'
  });
} catch (error) {
  if (error instanceof InvalidNetworkError) {
    console.error('Invalid network:', error.message);
  }
}
```

---

### Error Handling Best Practices

**1. Always handle initialization errors:**

```typescript
const { fhevm, isReady, error } = useFhevm(config);

if (error) {
  return <div>Failed to initialize FHEVM: {error.message}</div>;
}
```

**2. Use try-catch for async operations:**

```typescript
async function encryptValue(value: number) {
  try {
    const encrypted = await encrypt(fhevm, value, 'euint32');
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}
```

**3. Validate inputs before encryption:**

```typescript
function validateInput(value: string, type: FheDataType): boolean {
  const num = parseInt(value);

  if (isNaN(num)) return false;

  switch (type) {
    case 'euint8': return num >= 0 && num <= 255;
    case 'euint16': return num >= 0 && num <= 65535;
    case 'euint32': return num >= 0 && num <= 4294967295;
    default: return true;
  }
}
```

**4. Provide user feedback:**

```typescript
const { encrypt, isEncrypting, encryptError } = useEncrypt(fhevm);

if (encryptError) {
  toast.error(`Encryption failed: ${encryptError.message}`);
}
```

---

## Advanced Usage

### Custom Error Classes

```typescript
class FhevmError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FhevmError';
  }
}

class FhevmNotInitializedError extends FhevmError {
  constructor() {
    super('FHEVM instance is not initialized');
    this.name = 'FhevmNotInitializedError';
  }
}

class EncryptionError extends FhevmError {
  constructor(message: string) {
    super(`Encryption failed: ${message}`);
    this.name = 'EncryptionError';
  }
}

class DecryptionError extends FhevmError {
  constructor(message: string) {
    super(`Decryption failed: ${message}`);
    this.name = 'DecryptionError';
  }
}
```

---

### Batch Operations

**Batch Encryption:**

```typescript
async function batchEncrypt(
  fhevm: FhevmInstance,
  values: number[],
  type: FheDataType
): Promise<Uint8Array[]> {
  return Promise.all(
    values.map(value => encrypt(fhevm, value, type))
  );
}

// Usage
const encryptedValues = await batchEncrypt(fhevm, [1, 2, 3, 4, 5], 'euint32');
```

**Batch Decryption:**

```typescript
async function batchDecrypt(
  fhevm: FhevmInstance,
  contractAddress: string,
  encryptedValues: Uint8Array[],
  userAddress: string,
  signer: Signer
): Promise<any[]> {
  return Promise.all(
    encryptedValues.map(data =>
      userDecrypt(fhevm, contractAddress, data, userAddress, signer)
    )
  );
}
```

---

### Caching

**Cache FHEVM instance:**

```typescript
let cachedFhevm: FhevmInstance | null = null;

async function getFhevmInstance(config: FhevmConfig): Promise<FhevmInstance> {
  if (!cachedFhevm) {
    cachedFhevm = await createFhevmInstance(config);
  }
  return cachedFhevm;
}
```

---

## Resources

- **[Getting Started Guide](./getting-started.md)** - Quick setup instructions
- **[Architecture Overview](./ARCHITECTURE.md)** - System design and structure
- **[Examples](../examples/)** - Working code examples
- **[Zama Documentation](https://docs.zama.ai/fhevm)** - Official FHEVM docs
- **[GitHub Repository](https://github.com/ImmanuelHickle/fhevm-react-template)** - Source code

---

**Last Updated**: 2024-10-29
