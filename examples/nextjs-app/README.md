# Next.js FHEVM Example - Confidential Voting

This example demonstrates using `@fhevm/sdk` in a Next.js application to build a confidential voting dApp.

## Features

- ✅ Client-side encryption of votes using FHEVM
- ✅ React hooks for easy integration (`useFhevm`, `useEncrypt`, `useDecrypt`)
- ✅ MetaMask wallet integration
- ✅ Real-time vote submission with encrypted data
- ✅ User decrypt (EIP-712 signature) for results
- ✅ Public decrypt for aggregate totals

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## Usage

The example showcases:

1. **FHEVM Setup** - Initializing SDK with Next.js
2. **Vote Encryption** - Encrypting user choices client-side
3. **Smart Contract Interaction** - Submitting encrypted votes
4. **Result Decryption** - Decrypting vote counts (user + public)
5. **Responsive UI** - Loading states and error handling

## SDK Integration

```tsx
import { useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk/react';

function VotingApp() {
  const { fhevm, isReady } = useFhevm({
    network: 'sepolia',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!
  });

  const { encrypt } = useEncrypt(fhevm);
  const { decrypt } = useDecrypt(fhevm);

  // Use encrypt/decrypt in your components
}
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

## Learn More

- [FHEVM SDK Documentation](../../README.md)
- [API Reference](../../docs/api-reference.md)
- [Next.js Documentation](https://nextjs.org/docs)
