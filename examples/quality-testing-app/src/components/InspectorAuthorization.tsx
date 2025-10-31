import React, { useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';

const CONTRACT_ABI = [
  'function authorizeInspector(address inspector) public',
  'function isInspector(address account) public view returns (bool)'
];

interface Props {
  provider: BrowserProvider;
  account: string;
  contractAddress: string;
}

export default function InspectorAuthorization({ provider, account, contractAddress }: Props) {
  const [inspectorAddress, setInspectorAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const authorizeInspector = async () => {
    if (!inspectorAddress) {
      setMessage('Please enter inspector address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, CONTRACT_ABI, signer);

      const tx = await contract.authorizeInspector(inspectorAddress);
      setMessage('⏳ Transaction sent. Waiting for confirmation...');

      await tx.wait();
      setMessage('✅ Inspector authorized successfully!');
      setInspectorAddress('');
    } catch (err: any) {
      console.error('Authorization error:', err);
      setMessage('❌ Error: ' + (err.message || 'Failed to authorize inspector'));
    } finally {
      setLoading(false);
    }
  };

  const checkInspector = async () => {
    if (!inspectorAddress) {
      setMessage('Please enter inspector address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const contract = new Contract(contractAddress, CONTRACT_ABI, provider);
      const isAuth = await contract.isInspector(inspectorAddress);

      if (isAuth) {
        setMessage('✅ This address is an authorized inspector');
      } else {
        setMessage('❌ This address is not authorized');
      }
    } catch (err: any) {
      console.error('Check error:', err);
      setMessage('❌ Error: ' + (err.message || 'Failed to check authorization'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>👤 Inspector Authorization</h3>

      <div className="form-group">
        <label>Inspector Address</label>
        <input
          type="text"
          value={inspectorAddress}
          onChange={(e) => setInspectorAddress(e.target.value)}
          placeholder="0x..."
          disabled={loading}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button onClick={authorizeInspector} disabled={loading}>
          {loading ? 'Processing...' : 'Authorize'}
        </button>
        <button onClick={checkInspector} disabled={loading} style={{ background: '#4299e1' }}>
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </div>

      {message && (
        <div className={message.includes('✅') ? 'success' : message.includes('❌') ? 'error' : 'info-box'} style={{ marginTop: '1rem' }}>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
