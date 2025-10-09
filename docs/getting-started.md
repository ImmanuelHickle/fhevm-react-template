# Getting Started with FHEVM SDK

This guide will help you get started with the Universal FHEVM SDK in less than 10 minutes.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **MetaMask** browser extension (for frontend examples)
- **Sepolia ETH** for testing (get from faucets)

## Installation

### Option 1: Install from npm (Recommended)

```bash
npm install @fhevm/sdk
```

### Option 2: Clone and Build from Source

```bash
# Clone repository
git clone https://github.com/zama-ai/fhevm-react-template.git
cd fhevm-react-template

# Install dependencies
npm install

# Build SDK
npm run build:sdk
```

## Quick Start (< 10 Lines of Code)

Here's the minimal setup to start using FHEVM:

```typescript
import { createFhevmInstance, encrypt, decrypt } from '@fhevm/sdk';

// 1. Initialize FHEVM
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: '0x...'
});

// 2. Encrypt data
const encrypted = await encrypt(fhevm, 42, 'euint32');

// 3. Decrypt result
const decrypted = await decrypt(fhevm, {
  ciphertext: encrypted,
  contractAddress: '0x...'
});

console.log('Decrypted value:', decrypted); // 42
```

That's it! You're ready to build confidential dApps. 🎉

## Framework-Specific Setup

### React / Next.js

```bash
npm install @fhevm/sdk @fhevm/react
```

```tsx
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';

function MyComponent() {
  const { fhevm, isReady } = useFhevm({
    network: 'sepolia',
    contractAddress: '0x...'
  });

  const { encrypt } = useEncrypt(fhevm);

  if (!isReady) return <div>Loading FHEVM...</div>;

  return <div>FHEVM Ready!</div>;
}
```

### Vue 3

```bash
npm install @fhevm/sdk @fhevm/vue
```

```vue
<script setup>
import { useFhevm } from '@fhevm/sdk/vue';

const { fhevm, encrypt, decrypt } = useFhevm({
  network: 'sepolia',
  contractAddress: '0x...'
});
</script>

<template>
  <div>{{ fhevm ? 'Ready' : 'Loading...' }}</div>
</template>
```

### Node.js

```bash
npm install @fhevm/sdk
```

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

## Configuration

### Environment Variables

Create `.env` file:

```env
# Required
CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
NETWORK=sepolia

# Optional
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
CHAIN_ID=11155111
DEBUG=true
```

### Network Configuration

The SDK supports multiple networks:

```typescript
// Sepolia (default)
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: '0x...'
});

// Localhost
const fhevm = await createFhevmInstance({
  network: 'localhost',
  contractAddress: '0x...'
});

// Custom RPC
const fhevm = await createFhevmInstance({
  network: 'custom',
  rpcUrl: 'https://your-rpc-url.com',
  contractAddress: '0x...',
  chainId: 12345
});
```

## Basic Encryption

### Encrypt Numbers

```typescript
// Small numbers (0-255)
const encrypted8 = await encrypt(fhevm, 42, 'euint8');

// Medium numbers (0-65535)
const encrypted16 = await encrypt(fhevm, 1000, 'euint16');

// Large numbers
const encrypted32 = await encrypt(fhevm, 1000000, 'euint32');
const encrypted64 = await encrypt(fhevm, BigInt('1000000000'), 'euint64');
```

### Encrypt Booleans

```typescript
const encryptedBool = await encrypt(fhevm, true, 'ebool');
```

### Auto Type Inference

The SDK can infer types automatically:

```typescript
// Auto-infers euint8
const auto1 = await encrypt(fhevm, 100);

// Auto-infers euint32
const auto2 = await encrypt(fhevm, 100000);

// Auto-infers ebool
const auto3 = await encrypt(fhevm, false);
```

## Basic Decryption

### User Decrypt (with Signature)

For maximum privacy, use user decryption with EIP-712 signature:

```typescript
import { userDecrypt } from '@fhevm/sdk';

const decrypted = await userDecrypt(fhevm, {
  ciphertext: encryptedValue,
  contractAddress: '0x...',
  userAddress: '0x...',
  signer: ethersJsSigner
});
```

### Public Decrypt

For public or aggregate data:

```typescript
import { publicDecrypt } from '@fhevm/sdk';

const decrypted = await publicDecrypt(fhevm, {
  ciphertext: encryptedValue,
  contractAddress: '0x...'
});
```

## Contract Interaction

```typescript
import { ethers } from 'ethers';
import { createContract } from '@fhevm/sdk';

// Create contract instance
const contract = createContract(fhevm, {
  address: '0x...',
  abi: contractABI,
  signer: ethersJsSigner
});

// Encrypt input
const encryptedValue = await encrypt(fhevm, 42, 'euint32');

// Call function with encrypted data
const tx = await contract.submitData(encryptedValue);
await tx.wait();

console.log('Transaction confirmed!');
```

## Next Steps

Now that you have FHEVM SDK set up, explore:

1. **[Examples](../examples/)** - See complete working examples
2. **[API Reference](./api-reference.md)** - Detailed API documentation
3. **[Tutorials](./tutorials/)** - Step-by-step guides
4. **[Deployment](./deployment.md)** - Deploy your dApp

## Common Issues

### Issue: Module not found

```bash
npm install @fhevm/sdk ethers
```

### Issue: RPC connection error

Check your RPC URL and network configuration in `.env`

### Issue: MetaMask not connecting

Ensure MetaMask is installed and connected to Sepolia testnet

### Issue: Transaction fails

Check that you have Sepolia ETH and contract address is correct

## Get Help

- **Documentation**: [Full Docs](../README.md)
- **Examples**: [See Examples](../examples/)
- **Issues**: [GitHub Issues](https://github.com/zama-ai/fhevm-react-template/issues)
- **Discord**: [Zama Discord](https://discord.gg/zama)

---

Ready to build? Check out our [examples](../examples/) or dive into the [API Reference](./api-reference.md)!
