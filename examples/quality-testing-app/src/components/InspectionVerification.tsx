import React, { useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';

const CONTRACT_ABI = [
  'function getInspectionCount() public view returns (uint256)',
  'function verifyInspection(uint256 inspectionId) public view returns (bool)'
];

interface Props {
  provider: BrowserProvider;
  account: string;
  contractAddress: string;
}

export default function InspectionVerification({ provider, account, contractAddress }: Props) {
  const [inspectionId, setInspectionId] = useState('');
  const [totalInspections, setTotalInspections] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getTotalInspections = async () => {
    setLoading(true);
    setMessage('');

    try {
      const contract = new Contract(contractAddress, CONTRACT_ABI, provider);
      const count = await contract.getInspectionCount();
      setTotalInspections(Number(count));
      setMessage(`✅ Total inspections on record: ${count}`);
    } catch (err: any) {
      console.error('Count error:', err);
      setMessage('❌ Error: ' + (err.message || 'Failed to get inspection count'));
    } finally {
      setLoading(false);
    }
  };

  const verifyInspection = async () => {
    if (!inspectionId) {
      setMessage('Please enter inspection ID');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const contract = new Contract(contractAddress, CONTRACT_ABI, provider);
      const isValid = await contract.verifyInspection(parseInt(inspectionId));

      if (isValid) {
        setMessage(`✅ Inspection #${inspectionId} is valid and verified`);
      } else {
        setMessage(`❌ Inspection #${inspectionId} could not be verified`);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setMessage('❌ Error: ' + (err.message || 'Failed to verify inspection'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ gridColumn: 'span 2' }}>
      <h3>🔍 Inspection Verification</h3>

      <div className="stats">
        <div className="stat-card">
          <h4>Total Inspections</h4>
          <p>{totalInspections !== null ? totalInspections : '---'}</p>
        </div>
        <div className="stat-card">
          <h4>Network</h4>
          <p>Sepolia</p>
        </div>
        <div className="stat-card">
          <h4>Encryption</h4>
          <p>FHE</p>
        </div>
      </div>

      <div className="form-group">
        <label>Inspection ID</label>
        <input
          type="number"
          value={inspectionId}
          onChange={(e) => setInspectionId(e.target.value)}
          placeholder="Enter inspection ID to verify"
          disabled={loading}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button onClick={verifyInspection} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Inspection'}
        </button>
        <button onClick={getTotalInspections} disabled={loading} style={{ background: '#48bb78' }}>
          {loading ? 'Loading...' : 'Get Total Count'}
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
