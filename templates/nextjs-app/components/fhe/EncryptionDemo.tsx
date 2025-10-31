'use client';

import React, { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { FhevmInstance, EncryptType } from '@fhevm/sdk';

interface EncryptionDemoProps {
  fhevm: FhevmInstance | null;
}

/**
 * Encryption Demo Component
 * Demonstrates client-side encryption with FHEVM SDK
 */
export const EncryptionDemo: React.FC<EncryptionDemoProps> = ({ fhevm }) => {
  const [value, setValue] = useState<string>('');
  const [encryptType, setEncryptType] = useState<EncryptType>('euint32');
  const [encryptedResult, setEncryptedResult] = useState<string>('');

  const { encrypt, isEncrypting, error } = useEncrypt(fhevm);

  const handleEncrypt = async () => {
    if (!value) {
      alert('Please enter a value to encrypt');
      return;
    }

    try {
      // Parse value based on type
      let parsedValue: any = value;
      if (encryptType === 'ebool') {
        parsedValue = value.toLowerCase() === 'true';
      } else if (encryptType !== 'eaddress') {
        parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue)) {
          alert('Please enter a valid number');
          return;
        }
      }

      const encrypted = await encrypt(parsedValue, encryptType);
      const base64 = Buffer.from(encrypted).toString('base64');
      setEncryptedResult(base64);
    } catch (err: any) {
      console.error('Encryption failed:', err);
      alert('Encryption failed: ' + err.message);
    }
  };

  return (
    <Card title="Encryption Demo" subtitle="Encrypt values using FHE">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Value to Encrypt"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
            disabled={!fhevm || isEncrypting}
          />

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Encryption Type
            </label>
            <select
              value={encryptType}
              onChange={(e) => setEncryptType(e.target.value as EncryptType)}
              disabled={!fhevm || isEncrypting}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="euint8">euint8 (0-255)</option>
              <option value="euint16">euint16 (0-65535)</option>
              <option value="euint32">euint32</option>
              <option value="euint64">euint64</option>
              <option value="ebool">ebool</option>
              <option value="eaddress">eaddress</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handleEncrypt}
          disabled={!fhevm || !value || isEncrypting}
          variant="primary"
          className="w-full"
        >
          {isEncrypting ? '🔐 Encrypting...' : '🔐 Encrypt Value'}
        </Button>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">Error: {error.message}</p>
          </div>
        )}

        {encryptedResult && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm font-semibold mb-2">✓ Encrypted Successfully!</p>
            <div className="bg-black/30 p-3 rounded font-mono text-xs text-gray-300 break-all">
              {encryptedResult}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
