import React, { useState, useEffect } from 'react';
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';
import { BrowserProvider } from 'ethers';
import InspectorAuthorization from './components/InspectorAuthorization';
import QualityInspection from './components/QualityInspection';
import InspectionVerification from './components/InspectionVerification';

const CONTRACT_ADDRESS = '0xB867082d753197aeAf0E3523FE993Eae79F45342';

function App() {
  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [connected, setConnected] = useState(false);

  const { fhevm, isReady, error: fhevmError } = useFhevm({
    network: 'sepolia',
    contractAddress: CONTRACT_ADDRESS
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const browserProvider = new BrowserProvider(window.ethereum);
        const accounts = await browserProvider.listAccounts();
        if (accounts.length > 0) {
          setProvider(browserProvider);
          setAccount(accounts[0].address);
          setConnected(true);
        }
      } catch (err) {
        console.error('Failed to check connection:', err);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this application');
      return;
    }

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      await browserProvider.send('eth_requestAccounts', []);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      setProvider(browserProvider);
      setAccount(address);
      setConnected(true);
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      alert('Failed to connect wallet: ' + err.message);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🔒 Privacy Quality Inspection System</h1>
        <p>Anonymous quality testing powered by Fully Homomorphic Encryption</p>
      </div>

      <div className={`connection-status ${connected ? 'status-connected' : 'status-disconnected'}`}>
        {connected ? (
          <>
            <p>✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
            {isReady ? (
              <p style={{ color: '#48bb78', marginTop: '0.5rem' }}>✅ FHEVM SDK Ready</p>
            ) : (
              <p style={{ color: '#ed8936', marginTop: '0.5rem' }}>⏳ Initializing FHEVM SDK...</p>
            )}
          </>
        ) : (
          <>
            <p>❌ Not Connected</p>
            <button onClick={connectWallet} style={{ marginTop: '1rem', maxWidth: '200px', margin: '1rem auto 0' }}>
              Connect Wallet
            </button>
          </>
        )}
      </div>

      {fhevmError && (
        <div className="error">
          Error initializing FHEVM: {fhevmError.message}
        </div>
      )}

      {connected && isReady && fhevm && (
        <div className="main-grid">
          <InspectorAuthorization
            provider={provider!}
            account={account}
            contractAddress={CONTRACT_ADDRESS}
          />
          <QualityInspection
            provider={provider!}
            account={account}
            contractAddress={CONTRACT_ADDRESS}
            fhevm={fhevm}
          />
          <InspectionVerification
            provider={provider!}
            account={account}
            contractAddress={CONTRACT_ADDRESS}
          />
        </div>
      )}

      {!connected && (
        <div className="info-box">
          <p>
            👋 Welcome to the Privacy Quality Inspection System!
            <br /><br />
            This application uses Fully Homomorphic Encryption (FHE) to ensure all quality inspection data
            remains private and secure on the blockchain. Connect your MetaMask wallet to get started.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
