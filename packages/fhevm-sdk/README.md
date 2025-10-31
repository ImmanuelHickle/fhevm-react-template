# @fhevm/sdk

Universal SDK for Zama FHEVM - Framework agnostic, developer friendly

## Overview

The `@fhevm/sdk` is a comprehensive toolkit for building privacy-preserving decentralized applications using Zama's Fully Homomorphic Encryption (FHE) technology. This SDK provides a clean, modular, and type-safe API that works seamlessly across different JavaScript frameworks.

## Features

- **Framework Agnostic Core** - Works with any JavaScript environment
- **React Adapters** - Pre-built hooks for React applications
- **Vue Adapters** - Composables for Vue 3 applications
- **Wagmi-Like API** - Familiar patterns for Web3 developers
- **Type Safe** - Full TypeScript support
- **Modular Design** - Import only what you need

## Installation

```bash
npm install @fhevm/sdk ethers
```

## Quick Start

### Vanilla JavaScript / Node.js

```typescript
import { createFhevmInstance, encrypt, decrypt } from '@fhevm/sdk';

// Initialize FHEVM
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: '0x...'
});

// Encrypt data
const encrypted = await encrypt(fhevm, 42, 'euint32');

// Decrypt result
const decrypted = await userDecrypt(fhevm, {
  ciphertext: encrypted,
  contractAddress: '0x...',
  userAddress: '0x...',
  signer: ethersJsSigner
});
```

### React

```typescript
import { useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk/react';

function MyComponent() {
  const { fhevm, isReady } = useFhevm({
    network: 'sepolia',
    contractAddress: '0x...'
  });

  const { encrypt, isEncrypting } = useEncrypt(fhevm);
  const { decrypt, isDecrypting } = useDecrypt(fhevm);

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'euint32');
    // Use encrypted value...
  };

  if (!isReady) return <div>Loading...</div>;
  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

### Vue 3

```vue
<script setup lang="ts">
import { useFhevm } from '@fhevm/sdk/vue';

const { fhevm, encrypt, decrypt, isReady } = useFhevm({
  network: 'sepolia',
  contractAddress: '0x...'
});

async function handleEncrypt() {
  const encrypted = await encrypt(42, 'euint32');
  // Use encrypted value...
}
</script>

<template>
  <div v-if="isReady">
    <button @click="handleEncrypt">Encrypt</button>
  </div>
</template>
```

## API Reference

### Core Functions

#### `createFhevmInstance(config: FhevmConfig): Promise<FhevmInstance>`

Initialize FHEVM instance.

**Parameters:**
- `config.network`: Network name ('sepolia', 'localhost', or 'custom')
- `config.contractAddress`: Smart contract address
- `config.rpcUrl?`: Optional custom RPC URL
- `config.chainId?`: Optional chain ID
- `config.debug?`: Enable debug logging

#### `encrypt<T>(fhevm: FhevmInstance, value: T, type?: EncryptType): Promise<Uint8Array>`

Encrypt a value using FHE.

**Supported types:**
- `euint8` - 0 to 255
- `euint16` - 0 to 65,535
- `euint32` - 0 to 4,294,967,295
- `euint64` - 0 to 2^64-1
- `euint128` - 0 to 2^128-1
- `euint256` - 0 to 2^256-1
- `ebool` - true or false
- `eaddress` - Ethereum address

#### `userDecrypt<T>(fhevm: FhevmInstance, options: UserDecryptOptions): Promise<T>`

Decrypt with EIP-712 signature (maximum privacy).

#### `publicDecrypt<T>(fhevm: FhevmInstance, options: PublicDecryptOptions): Promise<T>`

Decrypt without signature (for public/aggregate data).

### React Hooks

#### `useFhevm(config: FhevmConfig): UseFhevmReturn`

Main hook for FHEVM instance management.

**Returns:**
- `fhevm`: FHEVM instance or null
- `isReady`: Boolean indicating if FHEVM is ready
- `isLoading`: Boolean indicating loading state
- `error`: Error object if initialization failed
- `refetch`: Function to re-initialize FHEVM

#### `useEncrypt(fhevm: FhevmInstance | null): UseEncryptReturn`

Hook for encryption operations.

**Returns:**
- `encrypt`: Function to encrypt values
- `isEncrypting`: Boolean indicating encryption in progress
- `error`: Error object if encryption failed

#### `useDecrypt(fhevm: FhevmInstance | null): UseDecryptReturn`

Hook for decryption operations.

**Returns:**
- `decrypt`: Generic decrypt function
- `userDecrypt`: EIP-712 signature-based decryption
- `publicDecrypt`: Signature-less decryption
- `isDecrypting`: Boolean indicating decryption in progress
- `error`: Error object if decryption failed

### Vue Composables

#### `useFhevm(config: FhevmConfig): UseFhevmReturn`

Vue 3 composable for FHEVM operations.

**Returns:**
- `fhevm`: Ref to FHEVM instance
- `isReady`: Ref to ready state
- `isLoading`: Ref to loading state
- `error`: Ref to error object
- `encrypt`: Function to encrypt values
- `userDecrypt`: Function for user decryption
- `publicDecrypt`: Function for public decryption
- `refetch`: Function to re-initialize

## Package Structure

```
@fhevm/sdk
├── core/              # Framework-agnostic core
│   ├── fhevm-instance.ts
│   ├── encryption.ts
│   ├── decryption.ts
│   ├── contract.ts
│   ├── types.ts
│   └── utils.ts
├── react/             # React adapters
│   ├── hooks/
│   └── context/
└── vue/               # Vue adapters
    └── composables/
```

## Examples

See the `/examples` directory in the repository for complete working examples:

- `nextjs-app/` - Next.js application
- `react-app/` - React standalone application
- `vue-app/` - Vue 3 application
- `nodejs-app/` - Node.js CLI tool
- `vanilla-app/` - Vanilla JavaScript
- `quality-testing-app/` - Privacy-preserving quality inspection system

## License

MIT

## Support

For issues and questions, please visit the main repository.
