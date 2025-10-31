# React Standalone FHEVM Example - Encrypted Counter

A standalone React application demonstrating `@fhevm/sdk` integration for building encrypted dApps with Vite.

## ✨ Features

- ✅ React 18 with TypeScript
- ✅ Vite for fast development
- ✅ Full FHEVM SDK integration
- ✅ React hooks (`useFhevm`, `useEncrypt`, `useDecrypt`)
- ✅ Client-side encryption/decryption
- ✅ Modern UI with CSS animations
- ✅ No framework dependencies (pure React)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:3001

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 What This Example Demonstrates

### 1. FHEVM SDK Initialization

```typescript
import { useFhevm } from '@fhevm/sdk/react';

const { fhevm, isReady, error } = useFhevm({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});
```

### 2. Encryption Operations

```typescript
import { useEncrypt } from '@fhevm/sdk/react';

const { encrypt } = useEncrypt(fhevm);

// Encrypt a value
const encryptedValue = await encrypt(42, 'euint32');
```

### 3. Decryption Operations

```typescript
import { useDecrypt } from '@fhevm/sdk/react';

const { userDecrypt } = useDecrypt(fhevm);

// Decrypt with user signature
const decrypted = await userDecrypt({
  ciphertext: encryptedValue,
  contractAddress,
  userAddress,
  signer
});
```

## 🎯 Use Case: Encrypted Counter

This example implements a simple encrypted counter that demonstrates:

1. **Encrypted Increment**: Values are encrypted client-side before operations
2. **State Management**: React state with encrypted values
3. **Decrypt on Demand**: Users can decrypt values when needed
4. **Loading States**: Proper handling of async operations
5. **Error Handling**: User-friendly error messages

## 🔧 Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **@fhevm/sdk** - FHEVM SDK with React hooks
- **Ethers.js** - Ethereum interactions

## 📁 Project Structure

```
react-app/
├── src/
│   ├── App.tsx           # Main component with SDK integration
│   ├── main.tsx          # React entry point
│   └── index.css         # Styles
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config
└── README.md             # This file
```

## 🔐 SDK Features Used

### React Hooks

- **useFhevm()** - Initialize and manage FHEVM instance
  - Returns: `{ fhevm, isReady, error }`
  - Auto-handles connection and lifecycle

- **useEncrypt(fhevm)** - Encryption operations
  - Returns: `{ encrypt }`
  - Supports all FHE types (euint8, euint32, etc.)

- **useDecrypt(fhevm)** - Decryption operations
  - Returns: `{ userDecrypt, publicDecrypt }`
  - Both signature-based and public decryption

### FHE Data Types

```typescript
// Supported encryption types
'euint8'    // 0 to 255
'euint16'   // 0 to 65,535
'euint32'   // 0 to 4,294,967,295
'euint64'   // 0 to 2^64-1
'ebool'     // true/false
'eaddress'  // Ethereum address
```

## 💡 Integration Tips

### For Your Own dApp

1. **Replace Contract Address**:
```typescript
const CONTRACT_ADDRESS = 'your_contract_address_here';
```

2. **Connect Wallet**:
```typescript
import { BrowserProvider } from 'ethers';

const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const userAddress = await signer.getAddress();
```

3. **Call Contract Methods**:
```typescript
// Encrypt data
const encryptedValue = await encrypt(value, 'euint32');

// Send to contract
await contract.someMethod(encryptedValue);

// Get encrypted result
const encryptedResult = await contract.getResult();

// Decrypt result
const result = await userDecrypt({
  ciphertext: encryptedResult,
  contractAddress,
  userAddress,
  signer
});
```

## 🎨 Customization

### Change Network

Edit `App.tsx`:
```typescript
const { fhevm } = useFhevm({
  network: 'localhost', // or 'sepolia' or 'custom'
  contractAddress: CONTRACT_ADDRESS,
  rpcUrl: 'http://localhost:8545' // for custom network
});
```

### Add More Encryption Types

```typescript
// Encrypt different types
const encryptedBool = await encrypt(true, 'ebool');
const encryptedSmall = await encrypt(100, 'euint8');
const encryptedBig = await encrypt(1000000, 'euint64');
```

## 🧪 Testing

```bash
# Lint code
npm run lint

# Build to check for errors
npm run build
```

## 📚 Learn More

- [FHEVM SDK Documentation](../../README.md)
- [React Hooks API](../../docs/api-reference.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

This example is part of the Universal FHEVM SDK. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

---

**Built with ❤️ using @fhevm/sdk and React**
