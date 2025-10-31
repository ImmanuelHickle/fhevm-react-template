import { useState } from 'react';
import { useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk/react';

const CONTRACT_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';

function App() {
  const [counter, setCounter] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize FHEVM SDK
  const { fhevm, isReady, error } = useFhevm({
    network: 'sepolia',
    contractAddress: CONTRACT_ADDRESS
  });

  // Get encryption and decryption functions
  const { encrypt } = useEncrypt(fhevm);
  const { userDecrypt } = useDecrypt(fhevm);

  const handleIncrement = async () => {
    if (!isReady || !fhevm) return;

    setIsProcessing(true);
    try {
      // Encrypt the value 1 before incrementing
      const encryptedOne = await encrypt(1, 'euint32');
      console.log('Encrypted value:', encryptedOne);

      // In a real app, you would send this to your smart contract
      // await contract.increment(encryptedOne);

      // For demo purposes, just increment locally
      setCounter(prev => prev + 1);
    } catch (err) {
      console.error('Increment error:', err);
      alert('Failed to increment counter');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecrypt = async () => {
    if (!isReady || !fhevm) return;

    setIsProcessing(true);
    try {
      // In a real app, you would get encrypted data from contract
      // const encryptedCounter = await contract.getCounter();

      // For demo purposes, encrypt the current counter value
      const encryptedValue = await encrypt(counter, 'euint32');

      // Then decrypt it (demonstrating the full cycle)
      const decrypted = await userDecrypt({
        ciphertext: encryptedValue,
        contractAddress: CONTRACT_ADDRESS,
        userAddress: '0xYourAddress', // In real app, get from wallet
        signer: null as any // In real app, get from ethers
      });

      console.log('Decrypted value:', decrypted);
      alert(`Decrypted value: ${decrypted}`);
    } catch (err) {
      console.error('Decrypt error:', err);
      alert('Failed to decrypt value');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>🔐 React FHEVM Counter</h1>
        <p className="subtitle">Encrypted counter using Zama FHEVM SDK</p>

        {/* Status indicator */}
        {error && (
          <div className="status error">
            ❌ Error: {error.message}
          </div>
        )}
        {!isReady && !error && (
          <div className="status loading">
            ⏳ Initializing FHEVM SDK...
          </div>
        )}
        {isReady && (
          <div className="status ready">
            ✅ FHEVM SDK Ready!
          </div>
        )}

        {/* Counter display */}
        <div className="counter-section">
          <div className="counter-display">
            <div className="counter-label">Current Counter</div>
            <div className="counter-value">{counter}</div>
          </div>

          {/* Action buttons */}
          <div className="button-group">
            <button
              className="primary"
              onClick={handleIncrement}
              disabled={!isReady || isProcessing}
            >
              {isProcessing ? '⏳ Processing...' : '➕ Increment (Encrypted)'}
            </button>
            <button
              className="secondary"
              onClick={handleDecrypt}
              disabled={!isReady || isProcessing || counter === 0}
            >
              🔓 Decrypt Value
            </button>
          </div>
        </div>

        {/* SDK Features info */}
        <div className="info-section">
          <div className="info-title">SDK Features Demonstrated:</div>
          <ul className="info-list">
            <li>useFhevm() - React hook for FHEVM instance</li>
            <li>useEncrypt() - Client-side encryption hook</li>
            <li>useDecrypt() - Decryption operations hook</li>
            <li>encrypt() - Encrypt values as euint32</li>
            <li>userDecrypt() - EIP-712 signature-based decryption</li>
          </ul>
          <span className="sdk-badge">@fhevm/sdk/react</span>
        </div>
      </div>
    </div>
  );
}

export default App;
