# Vue 3 FHEVM Example - Secret Messenger

A Vue 3 application demonstrating `@fhevm/sdk` integration using Vue Composition API and composables.

## ✨ Features

- ✅ Vue 3 with Composition API
- ✅ TypeScript support
- ✅ Vite for fast development
- ✅ FHEVM SDK Vue composable (`useFhevm`)
- ✅ Reactive state management
- ✅ Message encryption/decryption demo
- ✅ Modern UI with Vue-style CSS

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:3002

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 What This Example Demonstrates

### 1. Vue Composable for FHEVM

```vue
<script setup lang="ts">
import { useFhevm } from '@fhevm/sdk/vue';

const { fhevm, isReady, error } = useFhevm({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});
</script>
```

### 2. Reactive State Management

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const message = ref('');
const encryptedData = ref<Uint8Array | null>(null);

const encryptedHex = computed(() => {
  // Computed property for hex display
  return Array.from(encryptedData.value).map(b =>
    b.toString(16).padStart(2, '0')
  ).join('');
});
</script>
```

### 3. Template Integration

```vue
<template>
  <button
    @click="handleEncrypt"
    :disabled="!isReady || !message"
  >
    Encrypt Message
  </button>

  <div v-if="encryptedData">
    Encrypted: {{ encryptedHex }}
  </div>
</template>
```

## 🎯 Use Case: Secret Messenger

This example implements an encrypted messaging app that demonstrates:

1. **Message Encryption**: Convert text to encrypted bytes
2. **Binary Data Handling**: Work with Uint8Array
3. **Hex Encoding**: Display encrypted data in readable format
4. **Reactive UI**: Vue's reactivity with encrypted state
5. **Error Handling**: User-friendly error messages

## 🔧 Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **Composition API** - Modern Vue syntax
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **@fhevm/sdk** - FHEVM SDK with Vue composables

## 📁 Project Structure

```
vue-app/
├── src/
│   ├── App.vue           # Main component with SDK integration
│   ├── main.ts           # Vue app entry point
│   └── style.css         # Styles
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config
└── README.md             # This file
```

## 🔐 SDK Features Used

### Vue Composables

- **useFhevm()** - Initialize and manage FHEVM instance
  - Returns: `{ fhevm, isReady, error }`
  - Fully reactive with Vue 3
  - Auto-cleanup on unmount

### Reactive Integration

```vue
<script setup lang="ts">
const { fhevm, isReady, error } = useFhevm(config);

// Use in template
</script>

<template>
  <div v-if="isReady">SDK Ready!</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>Loading...</div>
</template>
```

## 💡 Integration Tips

### For Your Own Vue App

1. **Install SDK**:
```bash
npm install @fhevm/sdk
```

2. **Import Composable**:
```typescript
import { useFhevm } from '@fhevm/sdk/vue';
```

3. **Use in Component**:
```vue
<script setup lang="ts">
const { fhevm, isReady } = useFhevm({
  network: 'sepolia',
  contractAddress: 'your_contract_address'
});

async function encryptValue() {
  if (!isReady.value || !fhevm.value) return;

  // Use SDK methods
  const encrypted = await encrypt(fhevm.value, 42, 'euint32');
}
</script>
```

### Connect Wallet

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { BrowserProvider } from 'ethers';

const walletConnected = ref(false);
const userAddress = ref('');

async function connectWallet() {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  userAddress.value = await signer.getAddress();
  walletConnected.value = true;
}
</script>
```

## 🎨 Customization

### Change Network

```vue
<script setup lang="ts">
const { fhevm } = useFhevm({
  network: 'localhost', // or 'sepolia'
  contractAddress: CONTRACT_ADDRESS,
  rpcUrl: 'http://localhost:8545' // optional
});
</script>
```

### Add Loading States

```vue
<template>
  <button :disabled="!isReady || isProcessing">
    <span v-if="isProcessing">⏳ Processing...</span>
    <span v-else>Encrypt</span>
  </button>
</template>
```

## 🧪 Testing

```bash
# Lint code
npm run lint

# Type check
npm run build
```

## 📚 Learn More

- [FHEVM SDK Documentation](../../README.md)
- [Vue Composables API](../../docs/api-reference.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [Vue 3 Documentation](https://vuejs.org)
- [Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)

## 🤝 Contributing

This example is part of the Universal FHEVM SDK. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

---

**Built with ❤️ using @fhevm/sdk and Vue 3**
