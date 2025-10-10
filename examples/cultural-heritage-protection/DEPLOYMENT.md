# Deployment Documentation

## Cultural Heritage Protection Smart Contract

This document provides comprehensive deployment information and instructions for the Cultural Heritage Protection smart contract system.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Deployment Steps](#deployment-steps)
5. [Contract Verification](#contract-verification)
6. [Network Information](#network-information)
7. [Contract Addresses](#contract-addresses)
8. [Testing & Interaction](#testing--interaction)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The Cultural Heritage Protection system is a blockchain-based platform leveraging Fully Homomorphic Encryption (FHE) to manage and protect cultural heritage artifacts with privacy-preserving features.

### Key Features

- **Encrypted Artifact Registration**: Store artifact information with FHE encryption
- **Access Control Management**: Granular permission system for artifact access
- **Expert Certification**: Curator-managed expert authentication system
- **Ownership Transfer**: Secure artifact ownership transfer mechanism
- **Access History Tracking**: Complete audit trail of artifact access
- **Artifact Lifecycle Management**: Activate/deactivate artifacts as needed

---

## Prerequisites

### Required Software

- Node.js v18.0.0 or higher
- npm v8.0.0 or higher
- Git

### Required Accounts

1. **Ethereum Wallet**: MetaMask or similar wallet with private key
2. **Infura/Alchemy Account**: For RPC endpoint access
3. **Etherscan Account**: For contract verification

### Funding

- Sepolia testnet ETH for deployment (minimum 0.05 ETH recommended)
- Get Sepolia ETH from faucets:
  - https://sepoliafaucet.com/
  - https://www.alchemy.com/faucets/ethereum-sepolia
  - https://cloud.google.com/application/web3/faucet/ethereum/sepolia

---

## Environment Setup

### 1. Install Dependencies

```bash
cd /path/to/cultural-heritage-protection
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Network RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Optional: Gas reporting
REPORT_GAS=false
```

### 3. Security Notes

⚠️ **IMPORTANT**: Never commit your `.env` file to version control!

- The `.env` file contains sensitive information
- Add `.env` to your `.gitignore`
- Use `.env.example` as a template only

---

## Deployment Steps

### Step 1: Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

### Step 2: Run Tests (Optional but Recommended)

```bash
npm test
```

### Step 3: Deploy to Sepolia

```bash
npm run deploy
```

**Expected Output:**

```
🚀 Starting Cultural Heritage Protection deployment...

📡 Network: sepolia (Chain ID: 11155111)
👤 Deployer address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
💰 Deployer balance: 0.5 ETH

📄 Deploying CulturalHeritageProtection contract...
✅ Contract deployed to: 0x1234567890abcdef1234567890abcdef12345678

📝 Deployment Transaction Hash: 0xabcdef...
⛽ Gas used: 2,450,123
🔢 Block number: 4,567,890

🔍 Verifying contract state...
👨‍💼 Curator address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
📊 Total artifacts: 0

💾 Deployment info saved to: deployments/sepolia-deployment.json
🔗 Etherscan: https://sepolia.etherscan.io/address/0x1234...

✨ Deployment completed successfully!
```

### Step 4: Verify on Etherscan

```bash
npm run verify
```

**Expected Output:**

```
🔍 Starting contract verification on Etherscan...

📡 Network: sepolia (Chain ID: 11155111)
📄 Contract address: 0x1234567890abcdef1234567890abcdef12345678
🔗 Etherscan URL: https://sepolia.etherscan.io/address/0x1234...

⏳ Verifying contract on Etherscan...
This may take a few moments...

✅ Contract verified successfully!

🔗 View on Etherscan: https://sepolia.etherscan.io/address/0x1234...
💾 Deployment info updated with verification status

✨ Verification process completed!
```

---

## Contract Verification

### Manual Verification (Alternative Method)

If automated verification fails, verify manually on Etherscan:

1. Go to https://sepolia.etherscan.io/
2. Navigate to your contract address
3. Click "Contract" → "Verify and Publish"
4. Fill in the details:
   - **Compiler Type**: Solidity (Single file)
   - **Compiler Version**: v0.8.24+commit.e11b9ed9
   - **Open Source License Type**: MIT
   - **Optimization**: Yes (200 runs)
5. Paste the contract code
6. Verify constructor arguments (none for this contract)

---

## Network Information

### Sepolia Testnet

| Parameter | Value |
|-----------|-------|
| **Network Name** | Sepolia |
| **Chain ID** | 11155111 |
| **Currency Symbol** | ETH |
| **Block Explorer** | https://sepolia.etherscan.io/ |
| **RPC Endpoint** | https://sepolia.infura.io/v3/YOUR_KEY |
| **Average Block Time** | ~12 seconds |

---

## Contract Addresses

After deployment, contract addresses will be stored in `deployments/sepolia-deployment.json`:

```json
{
  "network": "sepolia",
  "chainId": 11155111,
  "contractAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "deployer": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "curator": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "deploymentTxHash": "0xabcdef...",
  "blockNumber": 4567890,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "etherscanUrl": "https://sepolia.etherscan.io/address/0x1234...",
  "verified": true,
  "verifiedAt": "2024-01-15T10:35:00.000Z"
}
```

### Etherscan Links

Once deployed, you can view your contract at:

- **Contract Address**: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
- **Read Contract**: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS#readContract
- **Write Contract**: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS#writeContract
- **Events**: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS#events

---

## Testing & Interaction

### Run Simulation Tests

Execute a complete workflow simulation:

```bash
npm run simulate
```

This script will:
1. Certify an expert account
2. Register multiple artifacts
3. Grant and revoke access permissions
4. Transfer artifact ownership
5. View artifact information and access history
6. Test activation/deactivation features

### Interactive CLI

Launch the interactive command-line interface:

```bash
npm run interact
```

Available operations:
- View contract information
- Register new artifacts
- Grant/revoke access
- Transfer ownership
- Certify experts
- View artifact details
- Check access history
- Activate/deactivate artifacts

### Using Hardhat Console

```bash
npx hardhat console --network sepolia
```

Example commands:

```javascript
const contract = await ethers.getContractAt(
  "CulturalHeritageProtection",
  "YOUR_CONTRACT_ADDRESS"
);

// View total artifacts
await contract.totalArtifacts();

// View curator address
await contract.curator();

// Register an artifact
await contract.registerArtifact(1001, 500000, 2500, true, "Ancient Pottery");
```

---

## Troubleshooting

### Common Issues

#### 1. Deployment Fails with "Insufficient Funds"

**Solution**: Ensure your wallet has enough Sepolia ETH
```bash
# Check balance
npx hardhat run scripts/check-balance.js --network sepolia
```

#### 2. Verification Fails

**Solutions**:
- Wait 1-2 minutes after deployment before verifying
- Check that ETHERSCAN_API_KEY is correct in `.env`
- Try manual verification on Etherscan
- Ensure contract is compiled with exact same settings

#### 3. "Error: ENOENT: no such file or directory"

**Solution**: Ensure you're in the correct directory
```bash
cd /path/to/cultural-heritage-protection
```

#### 4. Network Connection Issues

**Solutions**:
- Check your RPC URL in `.env`
- Verify Infura/Alchemy API key is valid
- Try alternative RPC endpoints
- Check internet connection

#### 5. Gas Price Too High

**Solutions**:
- Wait for lower network congestion
- Adjust gas settings in `hardhat.config.js`
- Use gas price estimation tools

### Getting Help

If you encounter issues:

1. Check the [Hardhat Documentation](https://hardhat.org/docs)
2. Review [Etherscan API Docs](https://docs.etherscan.io/)
3. Consult [Ethereum Sepolia Testnet Info](https://sepolia.dev/)
4. Check contract events for error details

---

## Deployment Checklist

Before mainnet deployment, ensure:

- [ ] All tests pass successfully
- [ ] Simulation script completes without errors
- [ ] Contract verified on Etherscan
- [ ] Security audit completed (recommended)
- [ ] Gas optimization reviewed
- [ ] Access control tested thoroughly
- [ ] Emergency procedures documented
- [ ] Multi-signature wallet considered for curator role
- [ ] Monitoring and alerting configured
- [ ] Documentation updated with mainnet addresses

---

## Security Considerations

### Best Practices

1. **Private Key Management**
   - Never share or commit private keys
   - Use hardware wallets for mainnet
   - Consider multi-signature wallets for curator role

2. **Access Control**
   - Verify curator address after deployment
   - Test expert certification thoroughly
   - Monitor access grant/revoke events

3. **Monitoring**
   - Set up event monitoring
   - Track unusual access patterns
   - Monitor contract balance and state changes

4. **Upgrades**
   - Plan for potential upgrades
   - Document upgrade procedures
   - Test upgrade path on testnet

---

## Additional Resources

- **Hardhat Documentation**: https://hardhat.org/docs
- **Ethers.js Documentation**: https://docs.ethers.org/v6/
- **Sepolia Faucets**: https://sepoliafaucet.com/
- **FHE VM Documentation**: https://docs.zama.ai/fhevm
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts

---

## License

MIT License - See LICENSE file for details

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0
**Network**: Sepolia Testnet
