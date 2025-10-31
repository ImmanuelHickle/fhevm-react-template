'use client';

import React, { useState } from 'react';
import { useEncrypt, useDecrypt } from '@fhevm/sdk/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { FhevmInstance } from '@fhevm/sdk';
import { ethers } from 'ethers';

interface BankingExampleProps {
  fhevm: FhevmInstance | null;
  signer: ethers.Signer | null;
  userAddress: string;
}

/**
 * Banking Example Component
 * Demonstrates encrypted balance and transaction management
 */
export const BankingExample: React.FC<BankingExampleProps> = ({
  fhevm,
  signer,
  userAddress,
}) => {
  const [balance, setBalance] = useState<string>('1000');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [encryptedBalance, setEncryptedBalance] = useState<string>('');
  const [decryptedBalance, setDecryptedBalance] = useState<number | null>(null);

  const { encrypt, isEncrypting } = useEncrypt(fhevm);
  const { decrypt, isDecrypting } = useDecrypt(fhevm);

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x1234567890abcdef1234567890abcdef12345678';

  // Encrypt balance
  const encryptBalance = async () => {
    if (!balance) return;

    try {
      const numBalance = parseInt(balance, 10);
      if (isNaN(numBalance)) {
        alert('Please enter a valid balance');
        return;
      }

      const encrypted = await encrypt(numBalance, 'euint64');
      const base64 = Buffer.from(encrypted).toString('base64');
      setEncryptedBalance(base64);
    } catch (err: any) {
      console.error('Encryption failed:', err);
      alert('Encryption failed: ' + err.message);
    }
  };

  // Decrypt balance
  const decryptBalance = async () => {
    if (!encryptedBalance || !signer) {
      alert('Please encrypt a balance first and connect wallet');
      return;
    }

    try {
      const ciphertext = Buffer.from(encryptedBalance, 'base64');
      const decrypted = await decrypt({
        ciphertext,
        contractAddress: CONTRACT_ADDRESS,
        userAddress,
        signer,
      });

      setDecryptedBalance(decrypted);
    } catch (err: any) {
      console.error('Decryption failed:', err);
      alert('Decryption failed: ' + err.message);
    }
  };

  // Process transfer
  const processTransfer = async () => {
    if (!transferAmount) return;

    try {
      const amount = parseInt(transferAmount, 10);
      if (isNaN(amount)) {
        alert('Please enter a valid amount');
        return;
      }

      const encrypted = await encrypt(amount, 'euint64');
      const base64 = Buffer.from(encrypted).toString('base64');

      // In a real application, you would send this to your smart contract
      console.log('Encrypted transfer amount:', base64);
      alert(`Transfer of ${amount} tokens encrypted successfully! In production, this would be sent to the smart contract.`);
    } catch (err: any) {
      console.error('Transfer failed:', err);
      alert('Transfer failed: ' + err.message);
    }
  };

  return (
    <Card
      title="🏦 Banking Example"
      subtitle="Confidential balance and transaction management"
      variant="gradient"
    >
      <div className="space-y-6">
        {/* Balance Management */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Balance Management</h3>
          <div className="space-y-3">
            <Input
              label="Your Balance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="Enter balance"
              disabled={!fhevm || isEncrypting}
            />

            <Button
              onClick={encryptBalance}
              disabled={!fhevm || !balance || isEncrypting}
              variant="primary"
              className="w-full"
            >
              {isEncrypting ? '🔐 Encrypting...' : '🔐 Encrypt Balance'}
            </Button>

            {encryptedBalance && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm font-semibold mb-2">
                  ✓ Balance Encrypted
                </p>
                <div className="bg-black/30 p-2 rounded font-mono text-xs text-gray-300 break-all">
                  {encryptedBalance.substring(0, 80)}...
                </div>
                <Button
                  onClick={decryptBalance}
                  disabled={!signer || isDecrypting}
                  variant="warning"
                  size="small"
                  className="w-full mt-2"
                >
                  {isDecrypting ? '🔓 Decrypting...' : '🔓 Decrypt Balance'}
                </Button>
              </div>
            )}

            {decryptedBalance !== null && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-sm font-semibold">
                  Decrypted Balance: {decryptedBalance} tokens
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Transfer */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Encrypted Transfer</h3>
          <div className="space-y-3">
            <Input
              label="Transfer Amount"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter amount to transfer"
              disabled={!fhevm || isEncrypting}
            />

            <Button
              onClick={processTransfer}
              disabled={!fhevm || !transferAmount || isEncrypting}
              variant="success"
              className="w-full"
            >
              {isEncrypting ? '🔐 Processing...' : '💸 Process Encrypted Transfer'}
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-purple-300 text-sm">
            💡 In a real banking application, encrypted balances and transfers would be stored
            and processed on-chain using FHEVM smart contracts, ensuring complete privacy.
          </p>
        </div>
      </div>
    </Card>
  );
};
