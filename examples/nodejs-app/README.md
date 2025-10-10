# Node.js FHEVM CLI - Command Line Encryption Tool

A Node.js command-line interface demonstrating `@fhevm/sdk` integration for server-side FHE operations.

## ✨ Features

- ✅ Node.js CLI application
- ✅ TypeScript support
- ✅ FHEVM SDK integration
- ✅ Interactive command interface
- ✅ Colorized output with Chalk
- ✅ Loading spinners with Ora
- ✅ Multiple encryption types support
- ✅ Server-side encryption/decryption

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build the CLI
npm run build

# Run commands
npm run dev                    # Show help
npm run encrypt 42            # Encrypt value 42
npm run encrypt 100 euint8    # Encrypt as euint8
npm run info                  # Show SDK info
```

## 📖 Available Commands

### Encrypt Value

```bash
# Encrypt a number (default: euint32)
npm run encrypt 42

# Encrypt with specific type
npm run encrypt 255 euint8
npm run encrypt 1000 euint16
npm run encrypt 999999 euint32
```

### Decrypt Value

```bash
# Decrypt hex-encoded data
npm run decrypt 0x1234abcd...
```

### Show Information

```bash
# Display SDK information and supported types
npm run info
```

## 🎯 Use Case: CLI Encryption Tool

This example implements a command-line tool that demonstrates:

1. **Server-Side Operations**: Run FHE operations in Node.js
2. **Batch Processing**: Encrypt multiple values programmatically
3. **API Integration**: Use in backend services
4. **Automation**: Script encryption workflows
5. **DevOps**: Integrate into deployment pipelines

## 🔧 Technology Stack

- **Node.js** - JavaScript runtime
- **TypeScript** - Type safety
- **Commander.js** - CLI framework
- **Chalk** - Terminal styling
- **Ora** - Loading spinners
- **@fhevm/sdk** - FHEVM SDK core

## 📁 Project Structure

```
nodejs-app/
├── src/
│   └── index.ts          # CLI application with SDK integration
├── dist/                 # Compiled JavaScript (after build)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## 🔐 SDK Features Used

### Core Functions

```typescript
import { createFhevmInstance, encrypt } from '@fhevm/sdk';

// Initialize FHEVM
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});

// Encrypt value
const encrypted = await encrypt(fhevm, 42, 'euint32');
```

### Supported Types

- `euint8` - 0 to 255
- `euint16` - 0 to 65,535
- `euint32` - 0 to 4,294,967,295
- `euint64` - 0 to 2^64-1
- `ebool` - true/false
- `eaddress` - Ethereum address

## 💡 Integration Examples

### Use in Your Node.js App

```typescript
import { createFhevmInstance, encrypt } from '@fhevm/sdk';

async function encryptData(value: number) {
  const fhevm = await createFhevmInstance({
    network: 'sepolia',
    contractAddress: '0x...'
  });

  const encrypted = await encrypt(fhevm, value, 'euint32');
  return encrypted;
}
```

### Batch Encryption

```typescript
async function encryptBatch(values: number[]) {
  const fhevm = await createFhevmInstance({
    network: 'sepolia',
    contractAddress: '0x...'
  });

  const encrypted = await Promise.all(
    values.map(v => encrypt(fhevm, v, 'euint32'))
  );

  return encrypted;
}

// Usage
const results = await encryptBatch([1, 2, 3, 4, 5]);
```

### Express API Integration

```typescript
import express from 'express';
import { createFhevmInstance, encrypt } from '@fhevm/sdk';

const app = express();
app.use(express.json());

let fhevmInstance: any = null;

// Initialize on startup
async function initFhevm() {
  fhevmInstance = await createFhevmInstance({
    network: 'sepolia',
    contractAddress: '0x...'
  });
}

// API endpoint
app.post('/api/encrypt', async (req, res) => {
  try {
    const { value, type = 'euint32' } = req.body;
    const encrypted = await encrypt(fhevmInstance, value, type);

    res.json({
      success: true,
      encrypted: Array.from(encrypted)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

initFhevm().then(() => {
  app.listen(3000, () => console.log('Server running on port 3000'));
});
```

## 🎨 Customization

### Add Custom Commands

Edit `src/index.ts`:

```typescript
program
  .command('batch <file>')
  .description('Encrypt values from a file')
  .action(async (file) => {
    const values = await readValuesFromFile(file);
    const results = await encryptBatch(values);
    console.log('Encrypted', results.length, 'values');
  });
```

### Change Network Configuration

```typescript
const fhevm = await createFhevmInstance({
  network: 'localhost',  // or 'sepolia' or 'custom'
  contractAddress: CONTRACT_ADDRESS,
  rpcUrl: 'http://localhost:8545' // optional
});
```

## 🧪 Development

```bash
# Development mode with auto-reload
npm run dev

# Build TypeScript
npm run build

# Run built version
npm start

# Type check
npx tsc --noEmit
```

## 📦 Use as Global CLI

```bash
# Build and link
npm run build
npm link

# Now use anywhere
fhevm-cli encrypt 42
fhevm-cli info
```

## 🔧 Environment Variables

Create `.env` file:

```env
FHEVM_NETWORK=sepolia
FHEVM_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
FHEVM_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

## 📚 Learn More

- [FHEVM SDK Documentation](../../README.md)
- [Core API Reference](../../docs/api-reference.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Node.js Documentation](https://nodejs.org/docs)

## 🤝 Contributing

This example is part of the Universal FHEVM SDK. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

---

**Built with ❤️ using @fhevm/sdk and Node.js**
