import React, { useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { useEncrypt } from '@fhevm/sdk/react';

const CONTRACT_ABI = [
  'function recordInspection(bytes encryptedQualityScore, bytes encryptedDefectCount, bytes encryptedBatchNumber) public returns (uint256)',
  'function getInspectionCount() public view returns (uint256)'
];

interface Props {
  provider: BrowserProvider;
  account: string;
  contractAddress: string;
  fhevm: any;
}

const CATEGORIES = [
  'Electronics',
  'Automotive',
  'Pharmaceutical',
  'Food & Beverage',
  'Textiles',
  'Construction Materials'
];

export default function QualityInspection({ provider, account, contractAddress, fhevm }: Props) {
  const [qualityScore, setQualityScore] = useState('');
  const [defectCount, setDefectCount] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { encrypt, isEncrypting } = useEncrypt(fhevm);

  const recordInspection = async () => {
    if (!qualityScore || !defectCount || !batchNumber) {
      setMessage('Please fill in all fields');
      return;
    }

    const score = parseInt(qualityScore);
    const defects = parseInt(defectCount);
    const batch = parseInt(batchNumber);

    if (score < 0 || score > 100) {
      setMessage('Quality score must be between 0 and 100');
      return;
    }

    if (defects < 0 || defects > 255) {
      setMessage('Defect count must be between 0 and 255');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Encrypt the values using the SDK
      setMessage('🔒 Encrypting quality score...');
      const encryptedScore = await encrypt(score, 'euint8');

      setMessage('🔒 Encrypting defect count...');
      const encryptedDefects = await encrypt(defects, 'euint8');

      setMessage('🔒 Encrypting batch number...');
      const encryptedBatch = await encrypt(batch, 'euint32');

      setMessage('📝 Submitting encrypted inspection to blockchain...');
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, CONTRACT_ABI, signer);

      const tx = await contract.recordInspection(
        encryptedScore,
        encryptedDefects,
        encryptedBatch
      );

      setMessage('⏳ Transaction sent. Waiting for confirmation...');
      const receipt = await tx.wait();

      setMessage(`✅ Inspection recorded successfully! Transaction: ${receipt.hash.slice(0, 10)}...`);

      // Reset form
      setQualityScore('');
      setDefectCount('');
      setBatchNumber('');
    } catch (err: any) {
      console.error('Inspection error:', err);
      setMessage('❌ Error: ' + (err.message || 'Failed to record inspection'));
    } finally {
      setLoading(false);
    }
  };

  const isProcessing = loading || isEncrypting;

  return (
    <div className="card">
      <h3>📋 Record Quality Inspection</h3>

      <div className="form-group">
        <label>Product Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={isProcessing}>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Quality Score (0-100)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={qualityScore}
          onChange={(e) => setQualityScore(e.target.value)}
          placeholder="85"
          disabled={isProcessing}
        />
      </div>

      <div className="form-group">
        <label>Defect Count (0-255)</label>
        <input
          type="number"
          min="0"
          max="255"
          value={defectCount}
          onChange={(e) => setDefectCount(e.target.value)}
          placeholder="3"
          disabled={isProcessing}
        />
      </div>

      <div className="form-group">
        <label>Batch Number</label>
        <input
          type="number"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          placeholder="12345"
          disabled={isProcessing}
        />
      </div>

      <button onClick={recordInspection} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : '🔒 Record Encrypted Inspection'}
      </button>

      {message && (
        <div className={message.includes('✅') ? 'success' : message.includes('❌') ? 'error' : 'info-box'} style={{ marginTop: '1rem' }}>
          <p>{message}</p>
        </div>
      )}

      <div className="info-box" style={{ marginTop: '1rem' }}>
        <p>
          <strong>Privacy Note:</strong> All inspection data is encrypted using FHE before being submitted to the blockchain.
          Your quality scores, defect counts, and batch numbers remain completely confidential.
        </p>
      </div>
    </div>
  );
}
