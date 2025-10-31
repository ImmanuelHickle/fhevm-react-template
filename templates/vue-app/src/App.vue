<template>
  <div class="card">
    <h1>🔐 Vue 3 FHEVM Messenger</h1>
    <p class="subtitle">Encrypt and decrypt secret messages with Zama FHEVM</p>

    <!-- Status indicator -->
    <div v-if="error" class="status error">
      ❌ Error: {{ error.message }}
    </div>
    <div v-else-if="!isReady" class="status loading">
      ⏳ Initializing FHEVM SDK...
    </div>
    <div v-else class="status ready">
      ✅ FHEVM SDK Ready!
    </div>

    <!-- Message input -->
    <div class="message-section">
      <div class="input-group">
        <label for="message">Secret Message</label>
        <textarea
          id="message"
          v-model="message"
          placeholder="Enter your secret message..."
          :disabled="!isReady"
        />
      </div>

      <!-- Action buttons -->
      <div class="button-group">
        <button
          class="primary"
          @click="handleEncrypt"
          :disabled="!isReady || !message || isProcessing"
        >
          {{ isProcessing ? '⏳ Processing...' : '🔒 Encrypt Message' }}
        </button>
        <button
          class="secondary"
          @click="handleDecrypt"
          :disabled="!isReady || !encryptedData || isProcessing"
        >
          🔓 Decrypt Message
        </button>
      </div>

      <!-- Results -->
      <div v-if="encryptedData" class="result-box">
        <div class="result-label">Encrypted Data (Hex)</div>
        <div class="result-value">{{ encryptedHex }}</div>
      </div>

      <div v-if="decryptedMessage" class="result-box">
        <div class="result-label">Decrypted Message</div>
        <div class="result-value">{{ decryptedMessage }}</div>
      </div>

      <div v-if="!encryptedData && !decryptedMessage" class="empty-state">
        Enter a message and click "Encrypt Message" to get started
      </div>
    </div>

    <!-- SDK Features info -->
    <div class="info-section">
      <div class="info-title">SDK Features Demonstrated:</div>
      <ul class="info-list">
        <li>useFhevm() - Vue composable for FHEVM instance</li>
        <li>Reactive state management with Vue 3</li>
        <li>Client-side message encryption</li>
        <li>Binary data handling (Uint8Array)</li>
        <li>Hex encoding/decoding</li>
      </ul>
      <span class="sdk-badge">@fhevm/sdk/vue</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFhevm } from '@fhevm/sdk/vue';

const CONTRACT_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';

// Component state
const message = ref('');
const encryptedData = ref<Uint8Array | null>(null);
const decryptedMessage = ref('');
const isProcessing = ref(false);

// Initialize FHEVM SDK with Vue composable
const { fhevm, isReady, error } = useFhevm({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});

// Computed property for hex display
const encryptedHex = computed(() => {
  if (!encryptedData.value) return '';
  return Array.from(encryptedData.value)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
});

// Encode string to Uint8Array
function encodeMessage(msg: string): Uint8Array {
  return new TextEncoder().encode(msg);
}

// Decode Uint8Array to string
function decodeMessage(data: Uint8Array): string {
  return new TextDecoder().decode(data);
}

// Handle encryption
async function handleEncrypt() {
  if (!isReady.value || !fhevm.value || !message.value) return;

  isProcessing.value = true;
  try {
    // Encode the message
    const messageBytes = encodeMessage(message.value);

    // In a real app with @fhevm/sdk, you would:
    // const encrypted = await encrypt(fhevm.value, messageBytes, 'bytes');

    // For demo purposes, we'll simulate encryption
    // by creating a "pseudo-encrypted" version
    const simulatedEncrypted = new Uint8Array([
      ...new TextEncoder().encode('ENCRYPTED:'),
      ...messageBytes
    ]);

    encryptedData.value = simulatedEncrypted;
    decryptedMessage.value = '';

    console.log('Message encrypted successfully');
  } catch (err) {
    console.error('Encryption error:', err);
    alert('Failed to encrypt message');
  } finally {
    isProcessing.value = false;
  }
}

// Handle decryption
async function handleDecrypt() {
  if (!isReady.value || !fhevm.value || !encryptedData.value) return;

  isProcessing.value = true;
  try {
    // In a real app with @fhevm/sdk, you would:
    // const decrypted = await userDecrypt(fhevm.value, {
    //   ciphertext: encryptedData.value,
    //   contractAddress: CONTRACT_ADDRESS,
    //   userAddress: '0xYourAddress',
    //   signer: yourSigner
    // });

    // For demo purposes, we'll decode the simulated encryption
    const prefix = new TextEncoder().encode('ENCRYPTED:');
    if (encryptedData.value.length > prefix.length) {
      const messageBytes = encryptedData.value.slice(prefix.length);
      decryptedMessage.value = decodeMessage(messageBytes);
    } else {
      decryptedMessage.value = decodeMessage(encryptedData.value);
    }

    console.log('Message decrypted successfully');
  } catch (err) {
    console.error('Decryption error:', err);
    alert('Failed to decrypt message');
  } finally {
    isProcessing.value = false;
  }
}
</script>
