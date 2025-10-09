# Vanilla JavaScript FHEVM Example - Number Encryptor

A pure JavaScript application demonstrating `@fhevm/sdk` integration without any framework dependencies.

## ✨ Features

- ✅ Pure Vanilla JavaScript (no frameworks)
- ✅ ES6 Modules
- ✅ Vite for development and building
- ✅ Full FHEVM SDK integration
- ✅ Interactive UI with real-time encryption
- ✅ Multiple encryption types support
- ✅ Hex data visualization
- ✅ Responsive design

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:3003

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 What This Example Demonstrates

### 1. FHEVM SDK in Vanilla JS

```javascript
import { createFhevmInstance, encrypt } from '@fhevm/sdk';

// Initialize SDK
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});

// Encrypt a value
const encrypted = await encrypt(fhevm, 42, 'euint32');
```

### 2. DOM Manipulation

```javascript
// Get DOM elements
const encryptBtn = document.getElementById('encrypt-btn');
const resultsEl = document.getElementById('results');

// Add event listeners
encryptBtn.addEventListener('click', handleEncrypt);

// Update UI
resultsEl.style.display = 'block';
```

### 3. Binary Data Handling

```javascript
// Convert Uint8Array to hex string
const hexString = Array.from(encrypted)
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');

console.log('Encrypted (hex):', `0x${hexString}`);
```

## 🎯 Use Case: Number Encryptor

This example implements a number encryption tool that demonstrates:

1. **User Input**: Accept numbers and select encryption type
2. **Client-Side Encryption**: Encrypt values in the browser
3. **Type Validation**: Enforce type-specific value ranges
4. **Result Display**: Show encrypted data in hex format
5. **Pure JavaScript**: No framework overhead

## 🔧 Technology Stack

- **Vanilla JavaScript** - No frameworks
- **ES6 Modules** - Modern JavaScript
- **Vite** - Build tool and dev server
- **@fhevm/sdk** - FHEVM SDK core
- **CSS3** - Modern styling

## 📁 Project Structure

```
vanilla-app/
├── index.html            # HTML structure
├── main.js               # JavaScript with SDK integration
├── style.css             # Styles
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## 🔐 SDK Features Used

### Core Functions

```javascript
// Initialize FHEVM
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: '0x...'
});

// Encrypt value
const encrypted = await encrypt(fhevm, value, type);
```

### Supported Encryption Types

| Type | Range | Example |
|------|-------|---------|
| `euint8` | 0 to 255 | Small numbers |
| `euint16` | 0 to 65,535 | Medium numbers |
| `euint32` | 0 to 4,294,967,295 | Large numbers |
| `euint64` | 0 to 2^64-1 | Very large numbers |

## 💡 Integration Examples

### Basic Usage

```javascript
import { createFhevmInstance, encrypt } from '@fhevm/sdk';

// 1. Initialize
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});

// 2. Encrypt
const value = 42;
const encrypted = await encrypt(fhevm, value, 'euint32');

// 3. Use encrypted data
console.log('Encrypted bytes:', encrypted);
console.log('Encrypted length:', encrypted.length);
```

### With Form Submission

```javascript
const form = document.getElementById('encrypt-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const value = parseInt(e.target.value.value);
  const type = e.target.type.value;

  try {
    const encrypted = await encrypt(fhevm, value, type);
    displayResults(encrypted);
  } catch (error) {
    console.error('Encryption failed:', error);
  }
});
```

### Error Handling

```javascript
async function encryptWithErrorHandling(value, type) {
  try {
    // Validate input
    if (isNaN(value) || value < 0) {
      throw new Error('Invalid value');
    }

    // Encrypt
    const encrypted = await encrypt(fhevm, value, type);
    return encrypted;

  } catch (error) {
    // Handle errors
    if (error.message.includes('out of range')) {
      alert('Value is out of range for this type');
    } else {
      alert(`Encryption failed: ${error.message}`);
    }
    return null;
  }
}
```

## 🎨 Customization

### Change Styling

Edit `style.css`:

```css
/* Change gradient */
body {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}

/* Change button colors */
.btn-primary {
  background: linear-gradient(135deg, #your-gradient);
}
```

### Add More Features

Edit `main.js`:

```javascript
// Add batch encryption
async function encryptBatch(values, type) {
  const results = [];

  for (const value of values) {
    const encrypted = await encrypt(fhevmInstance, value, type);
    results.push(encrypted);
  }

  return results;
}

// Add export functionality
function exportResults(encrypted) {
  const hex = Array.from(encrypted)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const blob = new Blob([hex], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'encrypted.txt';
  a.click();
}
```

### Integrate with Web3 Wallet

```javascript
import { BrowserProvider } from 'ethers';

async function connectWallet() {
  if (!window.ethereum) {
    alert('Please install MetaMask');
    return null;
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  console.log('Connected:', address);
  return { provider, signer, address };
}

// Use in app
const wallet = await connectWallet();
```

## 🧪 Testing

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Test production build
npm run preview
```

## 📦 Deployment

### Static Hosting

After running `npm run build`, deploy the `dist/` directory to:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Push `dist/` to gh-pages branch
- **Any static host**: Upload `dist/` contents

### Environment Variables

For production, update `main.js`:

```javascript
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x...';
const NETWORK = import.meta.env.VITE_NETWORK || 'sepolia';
```

Create `.env`:

```env
VITE_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
VITE_NETWORK=sepolia
```

## 📚 Learn More

- [FHEVM SDK Documentation](../../README.md)
- [Core API Reference](../../docs/api-reference.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [MDN Web Docs](https://developer.mozilla.org)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

This example is part of the Universal FHEVM SDK. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

---

**Built with ❤️ using @fhevm/sdk and Vanilla JavaScript**
