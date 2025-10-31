'use client';

import React, { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { FhevmInstance } from '@fhevm/sdk';

interface ComputationDemoProps {
  fhevm: FhevmInstance | null;
}

/**
 * Computation Demo Component
 * Demonstrates encrypted computation preparation
 */
export const ComputationDemo: React.FC<ComputationDemoProps> = ({ fhevm }) => {
  const [valueA, setValueA] = useState<string>('');
  const [valueB, setValueB] = useState<string>('');
  const [operation, setOperation] = useState<string>('add');
  const [result, setResult] = useState<{ a: string; b: string; operation: string } | null>(null);

  const { encrypt, isEncrypting } = useEncrypt(fhevm);

  const handleCompute = async () => {
    if (!valueA || !valueB) {
      alert('Please enter both values');
      return;
    }

    try {
      const numA = parseInt(valueA, 10);
      const numB = parseInt(valueB, 10);

      if (isNaN(numA) || isNaN(numB)) {
        alert('Please enter valid numbers');
        return;
      }

      // Encrypt both values
      const encryptedA = await encrypt(numA, 'euint32');
      const encryptedB = await encrypt(numB, 'euint32');

      setResult({
        a: Buffer.from(encryptedA).toString('base64'),
        b: Buffer.from(encryptedB).toString('base64'),
        operation,
      });
    } catch (err: any) {
      console.error('Computation preparation failed:', err);
      alert('Failed to prepare computation: ' + err.message);
    }
  };

  return (
    <Card title="Computation Demo" subtitle="Prepare encrypted values for on-chain computation">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Value A"
            type="number"
            value={valueA}
            onChange={(e) => setValueA(e.target.value)}
            placeholder="Enter first value"
            disabled={!fhevm || isEncrypting}
          />

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Operation
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              disabled={!fhevm || isEncrypting}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="add">Add (+)</option>
              <option value="sub">Subtract (-)</option>
              <option value="mul">Multiply (×)</option>
              <option value="div">Divide (÷)</option>
            </select>
          </div>

          <Input
            label="Value B"
            type="number"
            value={valueB}
            onChange={(e) => setValueB(e.target.value)}
            placeholder="Enter second value"
            disabled={!fhevm || isEncrypting}
          />
        </div>

        <Button
          onClick={handleCompute}
          disabled={!fhevm || !valueA || !valueB || isEncrypting}
          variant="primary"
          className="w-full"
        >
          {isEncrypting ? '🔐 Encrypting...' : '🔐 Encrypt for Computation'}
        </Button>

        {result && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-sm font-semibold mb-3">
              ✓ Values encrypted! Send to smart contract for computation:
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-400">Encrypted A:</span>
                <div className="bg-black/30 p-2 rounded font-mono text-gray-300 break-all mt-1">
                  {result.a.substring(0, 60)}...
                </div>
              </div>
              <div>
                <span className="text-gray-400">Operation:</span>
                <div className="bg-black/30 p-2 rounded font-mono text-gray-300 mt-1">
                  {result.operation.toUpperCase()}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Encrypted B:</span>
                <div className="bg-black/30 p-2 rounded font-mono text-gray-300 break-all mt-1">
                  {result.b.substring(0, 60)}...
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
