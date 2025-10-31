# Anonymous Quality Testing System

A privacy-preserving quality inspection platform built with React and the Universal FHEVM SDK, enabling anonymous quality control processes while maintaining complete data confidentiality and integrity.

## 🔒 Core Concepts

### Privacy-Preserving Quality Inspection
Our system revolutionizes traditional quality control by implementing **anonymous quality detection** that protects sensitive manufacturing and inspection data while maintaining transparency and accountability.

### Fully Homomorphic Encryption (FHE) Integration
The platform utilizes the Universal FHEVM SDK to ensure that all quality scores, defect counts, and batch numbers remain encrypted on-chain, making them accessible only to authorized personnel while preserving complete anonymity.

### Confidential Inspection Data
- **Quality Scores**: Encrypted assessment ratings (0-100)
- **Defect Counts**: Anonymous defect tracking
- **Batch Numbers**: Confidential product identification
- **Inspector Identity**: Privacy-protected authorization system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The application will start on `http://localhost:3003`

## 📋 Smart Contract Details

**Contract Address**: `0xB867082d753197aeAf0E3523FE993Eae79F45342`
**Network**: Sepolia Testnet
**Chain ID**: 11155111

## ✨ Key Features

### 🛡️ Privacy Protection
- **End-to-End Encryption**: All sensitive data encrypted using FHE via @fhevm/sdk
- **Anonymous Inspectors**: Identity protection for quality control personnel
- **Confidential Metrics**: Private calculation of quality statistics

### 🔐 Security Features
- **Role-Based Access**: Owner and inspector authorization system
- **Data Integrity**: Blockchain immutability ensures tamper-proof records
- **Privacy Compliance**: Anonymous data handling

### 📊 Quality Management
- **Multi-Category Support**: Electronics, Automotive, Pharmaceutical, Food & Beverage, and more
- **Real-Time Verification**: Instant inspection validation system
- **Encrypted Analytics**: Privacy-preserving quality metrics calculation

## 🔧 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **SDK**: @fhevm/sdk (Universal FHEVM SDK)
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contracts**: Solidity with FHE implementation
- **Web3**: Ethers.js v6 for blockchain interaction
- **Wallet**: MetaMask integration

## 🏭 Use Cases

### Manufacturing Quality Control
- Anonymous defect reporting
- Confidential batch quality tracking
- Privacy-preserving supplier assessments

### Regulatory Compliance
- Anonymous quality documentation
- Anonymous audit trails
- Confidential compliance reporting

### Supply Chain Management
- Private quality scores across supply chain
- Anonymous vendor performance tracking
- Confidential quality benchmarking

## 💻 SDK Integration Example

This application demonstrates the Universal FHEVM SDK integration:

```typescript
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';

// Initialize FHEVM
const { fhevm, isReady } = useFhevm({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});

// Use encryption hook
const { encrypt, isEncrypting } = useEncrypt(fhevm);

// Encrypt quality data
const encryptedScore = await encrypt(qualityScore, 'euint8');
const encryptedDefects = await encrypt(defectCount, 'euint8');
const encryptedBatch = await encrypt(batchNumber, 'euint32');
```

## 📁 Project Structure

```
quality-testing-app/
├── src/
│   ├── components/
│   │   ├── InspectorAuthorization.tsx
│   │   ├── QualityInspection.tsx
│   │   └── InspectionVerification.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── contracts/
│   └── PrivacyQualityInspection.sol
├── package.json
└── README.md
```

## 🔍 Privacy Guarantees

- **Data Confidentiality**: All quality metrics encrypted with FHE
- **Inspector Anonymity**: Identity protection for all personnel
- **Computation Privacy**: Encrypted data processing without decryption
- **Access Control**: Granular permissions for data access

## 🌟 Innovation Highlights

- **Privacy-by-design** architecture using Universal FHEVM SDK
- **Zero-knowledge** quality metrics calculation
- **React hooks** for seamless FHE integration
- **Type-safe** TypeScript implementation

## 📞 Support

For questions or issues, please refer to the main repository documentation.

---

*Built with the Universal FHEVM SDK - Making privacy-preserving blockchain applications accessible to everyone.*
