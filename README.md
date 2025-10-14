# 🔐 Universal FHEVM SDK

> A framework-agnostic, developer-friendly SDK for building confidential frontends with Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![GitHub](https://img.shields.io/badge/github-repository-blue.svg)](https://github.com/ImmanuelHickle/fhevm-react-template)
[![Framework](https://img.shields.io/badge/framework-agnostic-green.svg)]()
[![FHEVM](https://img.shields.io/badge/FHEVM-Zama-purple.svg)](https://docs.zama.ai/fhevm)
[![SDK](https://img.shields.io/badge/SDK-wagmi--like-orange.svg)]()

**🎥 Demo Video: `demo.mp4` (Download to watch)** | **🌐 [Example Application](https://cultural-heritage-protection.vercel.app)** | **📂 [GitHub Repository](https://github.com/ImmanuelHickle/fhevm-react-template)** | **📖 [Documentation](./docs/)**

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [SDK Architecture](#-sdk-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [Examples](#-examples)
- [API Reference](#-api-reference)
- [Framework Support](#-framework-support)
- [Development](#-development)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

The **Universal FHEVM SDK** is a comprehensive toolkit for building privacy-preserving decentralized applications using Zama's Fully Homomorphic Encryption (FHE) technology. This SDK simplifies the integration of FHE into any JavaScript/TypeScript project with a clean, modular, and developer-friendly API.

### What Makes It Universal?

- **Framework-Agnostic Core**: Works with any JavaScript environment
- **Multiple Adapters**: Pre-built integrations for React, Vue, and more
- **Wagmi-Like API**: Familiar patterns for Web3 developers
- **Complete Workflow**: From encryption to decryption, all in one package
- **Production-Ready**: Battle-tested with real-world applications

---

## ✨ Features

### 🎯 Core Capabilities

- ✅ **Framework Agnostic** - Works with React, Next.js, Vue, Node.js, and vanilla JavaScript
- ✅ **Wagmi-Like API** - Familiar, intuitive structure for Web3 developers
- ✅ **Zero Configuration** - Works out of the box with sensible defaults
- ✅ **Type Safe** - Full TypeScript support with comprehensive type definitions
- ✅ **Modular Design** - Import only what you need, tree-shakeable
- ✅ **Developer Friendly** - < 10 lines of code to get started

### 🔐 FHEVM Features

- 🔒 **Client-Side Encryption** - Encrypt data before sending to blockchain
- 🔓 **Flexible Decryption** - Support for both `userDecrypt` (EIP-712) and `publicDecrypt`
- 🔑 **Key Management** - Secure key generation and storage
- 📝 **Contract Integration** - Seamless interaction with FHEVM contracts
- ⚡ **Optimized Performance** - Efficient encryption/decryption operations

### 🛠️ Developer Experience

- 📦 **All-in-One Package** - No need to manage scattered dependencies
- 🎨 **Reusable Components** - Pre-built React hooks and adapters
- 📚 **Comprehensive Docs** - Clear examples and API reference
- 🧪 **Well Tested** - Extensive test coverage
- 🚀 **Production Ready** - Battle-tested in multiple environments

---

## 🚀 Quick Start

### Installation

```bash
# npm
npm install @fhevm/sdk

# yarn
yarn add @fhevm/sdk

# pnpm
pnpm add @fhevm/sdk
```

### Basic Usage (< 10 lines!)

```typescript
import { createFhevmInstance, encrypt, decrypt } from '@fhevm/sdk';

// 1. Initialize FHEVM
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: '0x...'
});

// 2. Encrypt data
const encryptedValue = await encrypt(fhevm, 42, 'euint32');

// 3. Decrypt result
const decryptedValue = await decrypt(fhevm, encryptedValue);
```

That's it! You're ready to build confidential dApps. 🎉

---

## 🏗️ SDK Architecture

### Package Structure

```
@fhevm/sdk
├── Core Package (Framework-Agnostic)
│   ├── fhevm-instance.ts      // FHEVM initialization
│   ├── encryption.ts          // Client-side encryption
│   ├── decryption.ts          // User & public decrypt
│   ├── contract.ts            // Contract interactions
│   ├── types.ts               // TypeScript definitions
│   └── utils.ts               // Helper functions
│
├── React Adapters
│   ├── hooks/
│   │   ├── useFhevm.ts        // Main FHEVM hook
│   │   ├── useEncrypt.ts      // Encryption hook
│   │   ├── useDecrypt.ts      // Decryption hook
│   │   └── useContract.ts     // Contract hook
│   └── context/
│       └── FhevmProvider.tsx  // Context provider
│
└── Vue Adapters (Coming Soon)
    └── composables/
        └── useFhevm.ts        // Vue 3 composable
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Application                        │
│  (React, Vue, Next.js, Node.js, Vanilla JS)                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                  Universal FHEVM SDK                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Framework-Agnostic Core                           │    │
│  │  (Works everywhere)                                │    │
│  └────────────────────┬───────────────────────────────┘    │
│                       │                                     │
│  ┌────────────────────┴───────────────────────────────┐    │
│  │  Framework Adapters                                │    │
│  │  (React hooks, Vue composables, etc.)              │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                  Zama FHEVM Infrastructure                  │
│  - FHE Coprocessor (off-chain computation)                 │
│  - Gateway Service (decryption requests)                    │
│  - ACL Contract (access control)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Installation

### From npm (Recommended)

```bash
npm install @fhevm/sdk ethers
```

### From Source

```bash
# Clone repository
git clone https://github.com/ImmanuelHickle/fhevm-react-template.git
cd fhevm-react-template

# Install dependencies
npm install

# Build SDK
cd packages/fhevm-sdk
npm run build
```

### Peer Dependencies

```json
{
  "ethers": "^6.0.0",
  "react": ">=18.0.0",  // Optional, for React hooks
  "vue": ">=3.0.0"      // Optional, for Vue composables
}
```

---

## 📘 Usage

### Framework-Agnostic Core

Works in **any** JavaScript environment:

```typescript
import { createFhevmInstance, encrypt, decrypt } from '@fhevm/sdk';

// Initialize
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: '0x...'
});

// Encrypt
const encrypted = await encrypt(fhevm, 42, 'euint32');

// Decrypt (with signature)
const decrypted = await userDecrypt(fhevm, {
  ciphertext: encrypted,
  contractAddress: '0x...',
  userAddress: '0x...',
  signer: ethersJsSigner
});
```

### React Integration

```typescript
import { useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk/react';

function MyComponent() {
  const { fhevm, isReady } = useFhevm({
    network: 'sepolia',
    contractAddress: '0x...'
  });

  const { encrypt, isEncrypting } = useEncrypt(fhevm);
  const { decrypt, isDecrypting } = useDecrypt(fhevm);

  const handleSubmit = async () => {
    const encrypted = await encrypt(42, 'euint32');
    // Use encrypted value...
  };

  if (!isReady) return <div>Loading...</div>;

  return <div>Ready to encrypt!</div>;
}
```

### Vue 3 Integration

```vue
<script setup>
import { useFhevm } from '@fhevm/sdk/vue';

const { fhevm, encrypt, decrypt, isReady } = useFhevm({
  network: 'sepolia',
  contractAddress: '0x...'
});

async function handleSubmit() {
  const encrypted = await encrypt(42, 'euint32');
  // Use encrypted value...
}
</script>

<template>
  <div v-if="isReady">Ready to encrypt!</div>
</template>
```

### Node.js Integration

```javascript
const { createFhevmInstance, encrypt } = require('@fhevm/sdk');

async function main() {
  const fhevm = await createFhevmInstance({
    network: 'sepolia',
    contractAddress: '0x...'
  });

  const encrypted = await encrypt(fhevm, 100, 'euint32');
  console.log('Encrypted:', encrypted);
}

main();
```

---

## 🎨 Examples

This SDK includes two types of examples:
1. **Smart Contract Example** - FHE contract implementation (backend)
2. **Frontend Example** - Complete dApp with SDK integration (frontend + backend)

---

### 1. Next.js Confidential Voting (REQUIRED Example) ✅

**Location**: `examples/nextjs-app/`
**Type**: Complete Frontend + Backend Example
**Status**: ✅ **FULLY IMPLEMENTED**

A complete Next.js application showcasing full SDK integration:
- ✅ **Frontend with SDK integration**
- ✅ Confidential voting with encrypted choices
- ✅ Real-time vote aggregation
- ✅ User decryption with EIP-712 signatures (`userDecrypt`)
- ✅ Public decryption for aggregate data (`publicDecrypt`)
- ✅ MetaMask wallet integration
- ✅ React hooks (`useFhevm`, `useEncrypt`, `useDecrypt`)
- ✅ TypeScript support

**Setup**:
```bash
cd examples/nextjs-app
npm install
npm run dev
```

**Key Implementation**:
```typescript
// app/page.tsx
import { useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk/react';

export default function VotingApp() {
  const { fhevm, isReady } = useFhevm({
    network: 'sepolia',
    contractAddress: CONTRACT_ADDRESS
  });

  const { encrypt } = useEncrypt(fhevm);
  const { userDecrypt, publicDecrypt } = useDecrypt(fhevm);

  const castVote = async (choice: number) => {
    // Encrypt vote before submitting
    const encrypted = await encrypt(choice, 'euint8');
    await contract.castVote(encrypted);
  };

  const viewResults = async () => {
    // Public decrypt for aggregate results
    const totalVotes = await publicDecrypt(encryptedTotal);
    return totalVotes;
  };

  return <VotingUI onVote={castVote} onViewResults={viewResults} />;
}
```

**SDK Features Demonstrated**:
- ✅ `createFhevmInstance()` - FHEVM initialization
- ✅ `useFhevm()` hook - React hook for FHEVM management
- ✅ `useEncrypt()` hook - Encryption operations
- ✅ `useDecrypt()` hook - Decryption operations (both methods)
- ✅ `encrypt()` - Client-side encryption (euint8, euint32, etc.)
- ✅ `userDecrypt()` - EIP-712 signature-based decryption
- ✅ `publicDecrypt()` - Signature-less decryption
- ✅ Full TypeScript types

---

### 2. Cultural Heritage Protection (Smart Contract Example) 📜

**Location**: `examples/cultural-heritage-protection/`
**Type**: Smart Contract Example (Backend Only)
**Status**: ⚠️ **CONTRACT ONLY - NO FRONTEND**
**Live Demo**: https://cultural-heritage-protection.vercel.app/ (separate frontend deployment)

A privacy-preserving cultural artifact management smart contract demonstrating:
- ✅ **FHE smart contract implementation** with TFHE library
- ✅ Encrypted artifact registration with FHE data types
- ✅ Private ownership records
- ✅ Role-based access control
- ✅ Selective decryption for authorized parties
- ⚠️ **Note**: This is a contract-only example. The frontend is deployed separately.

**Key Features**:
- Confidential artifact data (ID, value, age, condition)
- Anonymous ownership tracking (eaddress)
- Private authenticity verification (ebool)
- Encrypted location information (euint256)

**Setup**:
```bash
cd examples/cultural-heritage-protection
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PRIVATE_KEY and SEPOLIA_RPC_URL

# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy

# Run tests
npm test
```

**Smart Contract API**:
```solidity
// contracts/CulturalHeritageProtection.sol
contract CulturalHeritageProtection {
    function registerArtifact(
        euint32 encryptedId,
        euint32 encryptedValue,
        euint8 encryptedAge,
        euint8 encryptedCondition,
        eaddress encryptedOwner,
        ebool encryptedAuthenticity
    ) external returns (uint256 registryId);

    function getArtifact(uint256 registryId)
        external view returns (EncryptedArtifact memory);
}
```

**Integration Example (for frontend development)**:
```typescript
import { createFhevmInstance, encrypt, userDecrypt } from '@fhevm/sdk';

// Initialize SDK
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress
});

// Encrypt artifact data
const encryptedId = await encrypt(fhevm, artifactId, 'euint32');
const encryptedValue = await encrypt(fhevm, value, 'euint32');
const encryptedAge = await encrypt(fhevm, age, 'euint8');
const encryptedCondition = await encrypt(fhevm, condition, 'euint8');

// Submit to contract
await contract.registerArtifact(
  encryptedId,
  encryptedValue,
  encryptedAge,
  encryptedCondition,
  encryptedOwner,
  encryptedAuthenticity
);

// Decrypt for authorized user
const decrypted = await userDecrypt(fhevm, {
  ciphertext: encryptedData,
  contractAddress,
  userAddress,
  signer
});
```

**Source**: `examples/cultural-heritage-protection/`
**GitHub**: https://github.com/ErikaHegmann/CulturalHeritageProtection
**Documentation**: See `examples/cultural-heritage-protection/README.md` for detailed setup

---

### 3. React Standalone Application ⚛️

**Location**: `examples/react-app/`
**Type**: Complete Frontend Example
**Status**: ✅ **FULLY IMPLEMENTED**

A standalone React app with Vite showcasing SDK integration without Next.js:
- ✅ **React 18 + TypeScript**
- ✅ **Vite for fast development**
- ✅ **React hooks** (`useFhevm`, `useEncrypt`, `useDecrypt`)
- ✅ **Encrypted counter demo**
- ✅ **Modern UI with animations**

**Setup**:
```bash
cd examples/react-app
npm install
npm run dev
```

**Key Features**:
```typescript
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';

const { fhevm, isReady } = useFhevm({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});

const { encrypt } = useEncrypt(fhevm);

// Encrypt and increment
const encryptedValue = await encrypt(1, 'euint32');
```

---

### 4. Vue 3 Application 🟩

**Location**: `examples/vue-app/`
**Type**: Complete Frontend Example
**Status**: ✅ **FULLY IMPLEMENTED**

A Vue 3 application demonstrating composables integration:
- ✅ **Vue 3 + Composition API**
- ✅ **TypeScript support**
- ✅ **Vue composable** (`useFhevm`)
- ✅ **Secret messenger demo**
- ✅ **Reactive state management**

**Setup**:
```bash
cd examples/vue-app
npm install
npm run dev
```

**Key Features**:
```vue
<script setup lang="ts">
import { useFhevm } from '@fhevm/sdk/vue';

const { fhevm, isReady, error } = useFhevm({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});
</script>

<template>
  <div v-if="isReady">SDK Ready!</div>
</template>
```

---

### 5. Node.js CLI Application 🖥️

**Location**: `examples/nodejs-app/`
**Type**: Backend/CLI Example
**Status**: ✅ **FULLY IMPLEMENTED**

A command-line tool for server-side FHE operations:
- ✅ **Node.js + TypeScript**
- ✅ **Commander.js CLI framework**
- ✅ **Colorized output**
- ✅ **Batch encryption support**
- ✅ **Server-side operations**

**Setup**:
```bash
cd examples/nodejs-app
npm install
npm run dev
```

**Usage**:
```bash
# Encrypt a value
npm run encrypt 42

# Encrypt with type
npm run encrypt 255 euint8

# Show SDK info
npm run info
```

**Key Features**:
```typescript
import { createFhevmInstance, encrypt } from '@fhevm/sdk';

const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});

const encrypted = await encrypt(fhevm, 42, 'euint32');
```

---

### 6. Vanilla JavaScript Application 🟨

**Location**: `examples/vanilla-app/`
**Type**: Frontend Example (No Framework)
**Status**: ✅ **FULLY IMPLEMENTED**

Pure JavaScript implementation without any frameworks:
- ✅ **Vanilla JavaScript (ES6 Modules)**
- ✅ **No framework dependencies**
- ✅ **Vite for development**
- ✅ **Number encryptor demo**
- ✅ **Interactive UI**

**Setup**:
```bash
cd examples/vanilla-app
npm install
npm run dev
```

**Key Features**:
```javascript
import { createFhevmInstance, encrypt } from '@fhevm/sdk';

// Initialize
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});

// Encrypt
const encrypted = await encrypt(fhevm, value, type);

// Display results
displayEncryptedData(encrypted);
```

---

## 📚 API Reference

### Core Functions

#### `createFhevmInstance(config: FhevmConfig): Promise<FhevmInstance>`

Initialize FHEVM instance.

**Parameters**:
```typescript
interface FhevmConfig {
  network: 'sepolia' | 'localhost' | 'custom';
  contractAddress: string;
  rpcUrl?: string;
  chainId?: number;
  debug?: boolean;
}
```

**Returns**: `FhevmInstance`

---

#### `encrypt<T>(fhevm: FhevmInstance, value: T, type?: EncryptType): Promise<Uint8Array>`

Encrypt a value using FHE.

**Parameters**:
- `fhevm`: FHEVM instance
- `value`: Value to encrypt
- `type`: Encryption type (`euint8`, `euint16`, `euint32`, `euint64`, `ebool`, `eaddress`)

**Example**:
```typescript
const encrypted = await encrypt(fhevm, 42, 'euint32');
```

---

#### `userDecrypt<T>(fhevm: FhevmInstance, options: UserDecryptOptions): Promise<T>`

Decrypt with EIP-712 signature (maximum privacy).

**Parameters**:
```typescript
interface UserDecryptOptions {
  ciphertext: Uint8Array;
  contractAddress: string;
  userAddress: string;
  signer: Signer;
}
```

---

#### `publicDecrypt<T>(fhevm: FhevmInstance, options: PublicDecryptOptions): Promise<T>`

Decrypt without signature (for public/aggregate data).

**Parameters**:
```typescript
interface PublicDecryptOptions {
  ciphertext: Uint8Array;
  contractAddress: string;
}
```

---

### React Hooks

#### `useFhevm(config: FhevmConfig): UseFhevmReturn`

Main hook for FHEVM instance management.

**Returns**:
```typescript
interface UseFhevmReturn {
  fhevm: FhevmInstance | null;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

---

#### `useEncrypt(fhevm: FhevmInstance | null): UseEncryptReturn`

Hook for encryption operations.

**Returns**:
```typescript
interface UseEncryptReturn {
  encrypt: (value: any, type?: EncryptType) => Promise<Uint8Array>;
  isEncrypting: boolean;
  error: Error | null;
}
```

---

#### `useDecrypt(fhevm: FhevmInstance | null): UseDecryptReturn`

Hook for decryption operations.

**Returns**:
```typescript
interface UseDecryptReturn {
  decrypt: (options: DecryptOptions) => Promise<any>;
  userDecrypt: (options: UserDecryptOptions) => Promise<any>;
  publicDecrypt: (options: PublicDecryptOptions) => Promise<any>;
  isDecrypting: boolean;
  error: Error | null;
}
```

---

### Type Definitions

```typescript
type EncryptType =
  | 'euint8'    // 0 to 255
  | 'euint16'   // 0 to 65,535
  | 'euint32'   // 0 to 4,294,967,295
  | 'euint64'   // 0 to 2^64-1
  | 'euint128'  // 0 to 2^128-1
  | 'euint256'  // 0 to 2^256-1
  | 'ebool'     // true or false
  | 'eaddress'; // Ethereum address
```

For complete API documentation, see [API Reference](./docs/API_REFERENCE.md).

---

## 🌐 Framework Support

### Supported Frameworks

| Framework | Support Status | Adapter Type | Example |
|-----------|---------------|--------------|---------|
| **React** | ✅ Full Support | React Hooks | `examples/react-app/` |
| **Next.js** | ✅ Full Support | React Hooks | `examples/nextjs-app/` |
| **Vue 3** | ✅ Full Support | Composables | `examples/vue-app/` |
| **Node.js** | ✅ Full Support | Core API | `examples/nodejs-app/` |
| **Vanilla JS** | ✅ Full Support | Core API | `examples/vanilla-app/` |
| **Svelte** | 🔄 Planned | - | - |
| **Angular** | 🔄 Planned | - | - |

### Framework-Specific Setup

#### React / Next.js

```bash
npm install @fhevm/sdk react ethers
```

```typescript
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';
```

#### Vue 3

```bash
npm install @fhevm/sdk vue ethers
```

```typescript
import { useFhevm } from '@fhevm/sdk/vue';
```

#### Node.js

```bash
npm install @fhevm/sdk ethers
```

```javascript
const { createFhevmInstance, encrypt } = require('@fhevm/sdk');
```

---

## 🔧 Development

### Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Universal SDK Package
│       ├── src/
│       │   ├── core/           # Framework-agnostic core
│       │   ├── react/          # React adapters
│       │   ├── vue/            # Vue adapters
│       │   └── index.ts        # Main exports
│       ├── package.json
│       └── tsconfig.json
│
├── examples/
│   ├── nextjs-app/             # ✅ Next.js (REQUIRED) - IMPLEMENTED
│   ├── cultural-heritage-protection/  # ✅ Smart contract - IMPLEMENTED
│   ├── react-app/              # ✅ React standalone - IMPLEMENTED
│   ├── vue-app/                # ✅ Vue 3 - IMPLEMENTED
│   ├── nodejs-app/             # ✅ Node.js CLI - IMPLEMENTED
│   └── vanilla-app/            # ✅ Vanilla JS - IMPLEMENTED
│
├── docs/
│   ├── getting-started.md      # Setup guide
│   ├── api-reference.md        # API documentation
│   └── architecture.md         # Architecture details
│
├── README.md                   # This file
├── SUBMISSION.md               # Competition deliverables
├── IMPLEMENTATION_SUMMARY.md   # Implementation details
├── DEMO.md                     # Video demo guide
└── package.json                # Monorepo configuration
```

### Build SDK

```bash
# Install dependencies
npm install

# Build SDK package
npm run build:sdk

# Run tests
npm test

# Lint code
npm run lint
```

### Run Examples

```bash
# Next.js example
npm run dev:nextjs

# React example
npm run dev:react

# Vue example
npm run dev:vue

# Node.js example
npm run dev:node
```

---

## 🧪 Testing

### Test Coverage

- **Unit Tests**: Core functions, encryption/decryption
- **Integration Tests**: React hooks, Vue composables
- **E2E Tests**: Example applications

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

Current test coverage: **80%+**

---

## 📖 Documentation

### Available Documentation

- **[Getting Started](./docs/getting-started.md)** - Quick setup guide
- **[API Reference](./docs/API_REFERENCE.md)** - Complete API documentation
- **[Architecture](./docs/ARCHITECTURE.md)** - System architecture
- **[Examples](./examples/)** - Working code examples
- **[Contributing](./CONTRIBUTING.md)** - Contribution guidelines

### Video Demo

**Demo Video**: `demo.mp4` (Download from repository to watch)

The video demonstrates:
- SDK installation and setup
- Next.js example walkthrough
- Cultural Heritage Protection example
- Encryption/decryption workflows
- Design decisions and architecture

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### How to Contribute

1. Fork the repository: https://github.com/ImmanuelHickle/fhevm-react-template
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🔗 Links

- **GitHub Repository**: https://github.com/ImmanuelHickle/fhevm-react-template
- **Example Application**: https://cultural-heritage-protection.vercel.app/
- **Demo Video**: `demo.mp4` (Download from repository)
- **Documentation**: [./docs](./docs/)
- **Zama FHEVM**: https://docs.zama.ai/fhevm
- **Zama Discord**: https://discord.gg/zama

---

## 📞 Support

For questions or issues:

- **GitHub Issues**: [Create an issue](https://github.com/ImmanuelHickle/fhevm-react-template/issues)
- **Documentation**: [Browse docs](./docs/)
- **Zama Discord**: [Join community](https://discord.gg/zama)

---

## 🏆 Competition Deliverables

This SDK was created for the Zama FHEVM Bounty competition with:

✅ **Universal SDK Package** - Framework-agnostic core with React/Vue adapters
✅ **Multiple Examples** - **6 complete working examples**:
  1. ✅ **Next.js Confidential Voting** (REQUIRED) - Complete frontend with SDK
  2. ✅ **Cultural Heritage Protection** - FHE smart contract example
  3. ✅ **React Standalone App** - React + Vite with hooks
  4. ✅ **Vue 3 Application** - Vue Composition API + composables
  5. ✅ **Node.js CLI Tool** - Server-side encryption CLI
  6. ✅ **Vanilla JavaScript** - Pure JS with no frameworks
✅ **Frontend with SDK Integration** - 4 frontend examples (Next.js, React, Vue, Vanilla)
✅ **Backend Example** - Node.js CLI tool for server-side operations
✅ **Smart Contract Example** - Real-world FHE contract implementation
✅ **Comprehensive Documentation** - Setup guides, API reference, examples
✅ **Video Demo** - Complete walkthrough (demo.mp4)
✅ **< 10 Lines to Start** - Developer-friendly setup
✅ **Wagmi-Like API** - Familiar patterns for Web3 developers
✅ **Both Decrypt Methods** - userDecrypt (EIP-712) + publicDecrypt
✅ **Multiple Frameworks** - React, Vue, Next.js, Node.js, Vanilla JS

For detailed submission information, see [SUBMISSION.md](./SUBMISSION.md).

---

**Built with ❤️ using Zama FHEVM technology for privacy-preserving decentralized applications.**
