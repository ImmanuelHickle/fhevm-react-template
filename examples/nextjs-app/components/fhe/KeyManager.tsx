'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { FhevmInstance } from '@fhevm/sdk';

interface KeyManagerProps {
  fhevm: FhevmInstance | null;
  network: string;
  contractAddress: string;
}

/**
 * Key Manager Component
 * Displays FHE key management information
 */
export const KeyManager: React.FC<KeyManagerProps> = ({ fhevm, network, contractAddress }) => {
  const [keyInfo, setKeyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchKeyInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/keys?network=${network}&contractAddress=${contractAddress}`);
      const data = await response.json();
      setKeyInfo(data);
    } catch (err: any) {
      console.error('Failed to fetch key info:', err);
      alert('Failed to fetch key info: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refresh',
          network,
          contractAddress,
        }),
      });
      const data = await response.json();
      alert(data.message || 'Keys refreshed successfully');
      await fetchKeyInfo();
    } catch (err: any) {
      console.error('Failed to refresh keys:', err);
      alert('Failed to refresh keys: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Key Manager" subtitle="FHE key management and information">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Network</p>
            <p className="text-white font-mono">{network}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Contract</p>
            <p className="text-white font-mono text-sm">
              {contractAddress.substring(0, 10)}...{contractAddress.substring(contractAddress.length - 8)}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={fetchKeyInfo}
            disabled={!fhevm || loading}
            variant="primary"
            className="flex-1"
          >
            {loading ? '⏳ Loading...' : '🔑 Fetch Key Info'}
          </Button>

          <Button
            onClick={refreshKeys}
            disabled={!fhevm || loading}
            variant="secondary"
            className="flex-1"
          >
            {loading ? '⏳ Refreshing...' : '🔄 Refresh Keys'}
          </Button>
        </div>

        {keyInfo && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <pre className="text-green-400 font-mono text-xs overflow-x-auto">
              {JSON.stringify(keyInfo, null, 2)}
            </pre>
          </div>
        )}

        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm">
            ℹ️ FHE keys are automatically managed by the SDK. Manual key management is only needed for advanced use cases.
          </p>
        </div>
      </div>
    </Card>
  );
};
