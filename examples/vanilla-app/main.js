import { createFhevmInstance, encrypt } from '@fhevm/sdk';

// Configuration
const CONTRACT_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';
const NETWORK = 'sepolia';

// State
let fhevmInstance = null;
let isReady = false;

// DOM Elements
const statusEl = document.getElementById('status');
const contentEl = document.getElementById('content');
const numberInput = document.getElementById('number-input');
const typeSelect = document.getElementById('type-select');
const encryptBtn = document.getElementById('encrypt-btn');
const clearBtn = document.getElementById('clear-btn');
const resultsEl = document.getElementById('results');

const originalValueEl = document.getElementById('original-value');
const encryptionTypeEl = document.getElementById('encryption-type');
const encryptedSizeEl = document.getElementById('encrypted-size');
const encryptedHexEl = document.getElementById('encrypted-hex');

// Initialize FHEVM SDK
async function initializeFhevm() {
  try {
    console.log('Initializing FHEVM SDK...');

    fhevmInstance = await createFhevmInstance({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS
    });

    isReady = true;

    // Update UI
    statusEl.className = 'status ready';
    statusEl.textContent = '✅ FHEVM SDK Ready!';
    contentEl.style.display = 'block';

    console.log('FHEVM SDK initialized successfully');
  } catch (error) {
    console.error('FHEVM initialization error:', error);

    statusEl.className = 'status error';
    statusEl.textContent = `❌ Error: ${error.message}`;
  }
}

// Encrypt number
async function handleEncrypt() {
  if (!isReady || !fhevmInstance) {
    alert('FHEVM SDK is not ready yet');
    return;
  }

  const value = parseInt(numberInput.value, 10);
  const type = typeSelect.value;

  // Validation
  if (isNaN(value) || value < 0) {
    alert('Please enter a valid positive number');
    return;
  }

  // Type-specific validation
  const maxValues = {
    euint8: 255,
    euint16: 65535,
    euint32: 4294967295,
    euint64: Number.MAX_SAFE_INTEGER
  };

  if (value > maxValues[type]) {
    alert(`Value ${value} is too large for ${type}. Maximum: ${maxValues[type]}`);
    return;
  }

  // Disable button during encryption
  encryptBtn.disabled = true;
  encryptBtn.textContent = '⏳ Encrypting...';

  try {
    console.log(`Encrypting ${value} as ${type}...`);

    // Encrypt the value
    const encrypted = await encrypt(fhevmInstance, value, type);

    console.log('Encryption successful:', encrypted);

    // Convert to hex for display
    const hexString = Array.from(encrypted.slice(0, 64))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Display results
    originalValueEl.textContent = value;
    encryptionTypeEl.textContent = type;
    encryptedSizeEl.textContent = `${encrypted.length} bytes`;
    encryptedHexEl.textContent = `0x${hexString}${encrypted.length > 64 ? '...' : ''}`;

    resultsEl.style.display = 'block';

    // Scroll to results
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    console.error('Encryption error:', error);
    alert(`Encryption failed: ${error.message}`);
  } finally {
    encryptBtn.disabled = false;
    encryptBtn.textContent = '🔒 Encrypt Number';
  }
}

// Clear results
function handleClear() {
  numberInput.value = '';
  resultsEl.style.display = 'none';
  originalValueEl.textContent = '';
  encryptionTypeEl.textContent = '';
  encryptedSizeEl.textContent = '';
  encryptedHexEl.textContent = '';
}

// Event listeners
encryptBtn.addEventListener('click', handleEncrypt);
clearBtn.addEventListener('click', handleClear);

// Allow Enter key to encrypt
numberInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleEncrypt();
  }
});

// Update input max based on type
typeSelect.addEventListener('change', () => {
  const type = typeSelect.value;
  const maxValues = {
    euint8: 255,
    euint16: 65535,
    euint32: 4294967295,
    euint64: Number.MAX_SAFE_INTEGER
  };

  numberInput.max = maxValues[type];
  numberInput.placeholder = `Enter a number (0-${maxValues[type].toLocaleString()})`;
});

// Initialize on page load
console.log('🔐 Vanilla JS FHEVM Example');
console.log('Powered by @fhevm/sdk');
initializeFhevm();
