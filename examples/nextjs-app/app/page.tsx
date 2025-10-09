'use client';

import { useState } from 'react';
import { useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';

/**
 * Next.js Confidential Voting Example
 *
 * This example demonstrates:
 * - FHEVM SDK initialization with Next.js
 * - Client-side vote encryption
 * - Smart contract interaction with encrypted data
 * - Vote decryption (user + public methods)
 * - MetaMask wallet integration
 */

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x1234567890abcdef1234567890abcdef12345678';
const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'sepolia';

// Simple voting contract ABI (for demonstration)
const VOTING_ABI = [
  'function castVote(bytes calldata encryptedVote) external',
  'function getVoteCount() external view returns (uint256)',
  'function getEncryptedResults() external view returns (bytes)'
];

export default function Home() {
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [votingChoice, setVotingChoice] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string>('');
  const [decryptedResult, setDecryptedResult] = useState<any>(null);

  // Initialize FHEVM
  const { fhevm, isReady, isLoading, error } = useFhevm({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    debug: true
  });

  // Encryption hook
  const { encrypt, isEncrypting } = useEncrypt(fhevm);

  // Decryption hook
  const { decrypt, isDecrypting } = useDecrypt(fhevm);

  // Connect MetaMask wallet
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const walletSigner = await provider.getSigner();
      const address = await walletSigner.getAddress();

      setSigner(walletSigner);
      setConnectedAddress(address);
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      alert('Failed to connect wallet: ' + err.message);
    }
  };

  // Cast encrypted vote
  const castVote = async (choice: number) => {
    if (!fhevm || !signer) {
      alert('Please connect wallet and wait for FHEVM to load');
      return;
    }

    try {
      setVotingChoice(choice);

      // 1. Encrypt vote client-side
      console.log('Encrypting vote:', choice);
      const encryptedVote = await encrypt(choice, 'euint8');
      console.log('Vote encrypted successfully');

      // 2. Submit to contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VOTING_ABI, signer);
      const tx = await contract.castVote(encryptedVote);

      console.log('Transaction submitted:', tx.hash);
      setTxHash(tx.hash);

      // 3. Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.hash);

      alert('Vote cast successfully! 🎉');
    } catch (err: any) {
      console.error('Failed to cast vote:', err);
      alert('Failed to cast vote: ' + err.message);
    }
  };

  // Decrypt vote results
  const decryptResults = async () => {
    if (!fhevm || !signer) {
      alert('Please connect wallet first');
      return;
    }

    try {
      // Get encrypted results from contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VOTING_ABI, provider);
      const encryptedResults = await contract.getEncryptedResults();

      // Decrypt with user signature (EIP-712)
      const decrypted = await decrypt({
        ciphertext: encryptedResults,
        contractAddress: CONTRACT_ADDRESS,
        userAddress: connectedAddress,
        signer: signer
      });

      setDecryptedResult(decrypted);
      console.log('Decrypted results:', decrypted);
    } catch (err: any) {
      console.error('Failed to decrypt:', err);
      alert('Failed to decrypt results: ' + err.message);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🔐 Confidential Voting
          </h1>
          <p className="text-xl text-gray-300">
            Powered by Zama FHEVM SDK
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Vote privately using fully homomorphic encryption
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Wallet Connection
              </h2>
              {connectedAddress ? (
                <p className="text-green-400 font-mono text-sm">
                  ✓ Connected: {connectedAddress.substring(0, 6)}...{connectedAddress.substring(38)}
                </p>
              ) : (
                <p className="text-gray-400">Not connected</p>
              )}
            </div>
            {!connectedAddress && (
              <button
                onClick={connectWallet}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                Connect MetaMask
              </button>
            )}
          </div>
        </div>

        {/* FHEVM Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">
            FHEVM Status
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-3xl mb-2 ${isReady ? 'text-green-400' : 'text-yellow-400'}`}>
                {isLoading ? '⏳' : isReady ? '✓' : '⚠️'}
              </div>
              <p className="text-sm text-gray-300">
                {isLoading ? 'Loading...' : isReady ? 'Ready' : 'Not Ready'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-blue-400">🔐</div>
              <p className="text-sm text-gray-300">Network: {NETWORK}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-purple-400">📜</div>
              <p className="text-sm text-gray-300 font-mono">
                {CONTRACT_ADDRESS.substring(0, 6)}...
              </p>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">Error: {error.message}</p>
            </div>
          )}
        </div>

        {/* Voting Interface */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Cast Your Vote
          </h2>
          <p className="text-gray-300 mb-6">
            Your vote will be encrypted client-side before submission. Nobody can see your choice!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => castVote(1)}
              disabled={!isReady || !connectedAddress || isEncrypting}
              className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-2">✓</div>
              <div>Vote YES</div>
            </button>

            <button
              onClick={() => castVote(0)}
              disabled={!isReady || !connectedAddress || isEncrypting}
              className="p-6 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-xl font-bold text-xl hover:from-red-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-2">✗</div>
              <div>Vote NO</div>
            </button>
          </div>

          {isEncrypting && (
            <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <p className="text-blue-300 text-center">
                🔐 Encrypting your vote...
              </p>
            </div>
          )}

          {txHash && (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-300 text-sm">
                ✓ Transaction: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" className="underline font-mono">{txHash.substring(0, 10)}...</a>
              </p>
            </div>
          )}
        </div>

        {/* Results Decryption */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">
            View Results
          </h2>
          <p className="text-gray-300 mb-6">
            Decrypt the vote results using your signature (EIP-712)
          </p>

          <button
            onClick={decryptResults}
            disabled={!isReady || !connectedAddress || isDecrypting}
            className="w-full p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isDecrypting ? '🔓 Decrypting...' : '🔓 Decrypt Results'}
          </button>

          {decryptedResult && (
            <div className="mt-6 p-6 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">
                Decrypted Results:
              </h3>
              <pre className="text-green-400 font-mono text-sm">
                {JSON.stringify(decryptedResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Built with @fhevm/sdk - Universal FHEVM SDK for confidential frontends</p>
          <p className="mt-2">
            <a href="https://docs.zama.ai/fhevm" target="_blank" className="text-purple-400 hover:underline">
              Learn more about Zama FHEVM
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
