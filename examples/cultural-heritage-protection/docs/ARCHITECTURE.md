# Cultural Heritage Protection System - Architecture

## System Overview

The Cultural Heritage Protection System is a decentralized application (dApp) built with Fully Homomorphic Encryption (FHE) technology to provide privacy-preserving management of sensitive cultural heritage data.

## Core Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
│  (Next.js Frontend - React Components + Tailwind CSS)       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                  Application Logic Layer                     │
│  - Wallet Connection (MetaMask, WalletConnect)              │
│  - FHE Encryption/Decryption                                │
│  - State Management                                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    Blockchain Layer                         │
│  - Smart Contracts (Solidity + TFHE)                       │
│  - Encrypted Data Storage                                   │
│  - Access Control Logic                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    FHE Infrastructure                       │
│  - FHE Coprocessor (Off-chain computation)                 │
│  - Gateway (Decryption service)                            │
│  - ACL Contract (Access permissions)                       │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Layer

#### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Build Tool**: Webpack/Turbopack

#### Key Components

**ArtifactList.tsx**
- Displays encrypted artifact registry
- Shows encrypted metadata
- Handles artifact selection

**EncryptionPanel.tsx**
- Encrypts artifact data before submission
- Validates input data
- Shows encryption status

**DecryptionPanel.tsx**
- Decrypts artifact data for authorized users
- Handles EIP-712 signature requests
- Displays decrypted information

**WalletConnect.tsx**
- MetaMask integration
- Wallet connection management
- Network switching

**StatusIndicator.tsx**
- Shows system status
- Displays encryption/decryption progress
- Error handling and notifications

### 2. Smart Contract Layer

#### Contract Architecture

```solidity
contract CulturalHeritageProtection {
    // Encrypted artifact storage
    struct EncryptedArtifact {
        euint32 artifactId;
        euint8 category;
        euint32 age;
        euint8 condition;
        euint32 value;
        eaddress owner;
        ebool isAuthentic;
        euint32 locationHash;
    }

    // Access control
    mapping(uint256 => mapping(address => bool)) public accessPermissions;

    // Role management
    mapping(address => Role) public roles;

    // Main functions
    function registerArtifact(...) external;
    function updateArtifact(...) external;
    function transferOwnership(...) external;
    function grantAccess(...) external;
    function revokeAccess(...) external;
}
```

#### Key Contracts

**CulturalHeritageProtection.sol**
- Main contract for artifact management
- Handles encrypted data storage
- Implements access control
- Manages artifact lifecycle

**AccessControl.sol**
- Role-based permissions
- Grant/revoke access rights
- Permission verification

**ArtifactRegistry.sol**
- Artifact registration
- Metadata management
- Ownership tracking

### 3. FHE Integration Layer

#### Client-Side Encryption

```typescript
// Encryption workflow
const fhevm = await createFhevmInstance({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});

// Encrypt artifact data
const encryptedId = await encrypt(fhevm, artifactId, 'euint32');
const encryptedAge = await encrypt(fhevm, age, 'euint32');
const encryptedValue = await encrypt(fhevm, value, 'euint32');
```

#### Decryption Service

```typescript
// User decryption with signature
const decrypted = await userDecrypt(fhevm, {
  ciphertext: encryptedData,
  contractAddress: CONTRACT_ADDRESS,
  userAddress: USER_ADDRESS,
  signer: ethersJsSigner
});
```

## Data Flow

### Artifact Registration Flow

```
1. User Input (Plaintext)
   ↓
2. Client-Side Validation
   ↓
3. FHE Encryption
   ↓
4. Submit Transaction to Smart Contract
   ↓
5. Smart Contract Validation
   ↓
6. Store Encrypted Data On-Chain
   ↓
7. Emit Event (with encrypted data)
   ↓
8. Update Frontend State
```

### Artifact Viewing Flow

```
1. User Requests Artifact Data
   ↓
2. Check Access Permissions (Smart Contract)
   ↓
3. If Authorized:
   a. Retrieve Encrypted Data
   b. User Signs EIP-712 Request
   c. Send to Gateway
   d. Gateway Verifies Signature
   e. Gateway Decrypts Data
   f. Return Plaintext to User
   ↓
4. Display Decrypted Data
```

## Privacy Model

### What's Encrypted (Private)

| Data Type | FHE Type | Privacy Level |
|-----------|----------|---------------|
| Artifact ID | `euint32` | Private |
| Category | `euint8` | Private |
| Age/Period | `euint32` | Private |
| Condition Rating | `euint8` | Private |
| Estimated Value | `euint32` | Private |
| Owner Address | `eaddress` | Private |
| Authenticity Status | `ebool` | Private |
| Location Hash | `euint32` | Private |

### What's Public

- Transaction existence and timing
- Contract interactions
- Participant addresses (when not using eaddress)
- Access grant/revoke events
- Number of artifacts (count)

### Access Control Matrix

| Role | Register | View Own | View Others | Grant Access | Update | Transfer |
|------|----------|----------|-------------|--------------|--------|----------|
| **Owner** | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Curator** | ✅ | ✅ | ✅ (granted) | ❌ | ✅ (granted) | ❌ |
| **Auditor** | ❌ | ❌ | ✅ (granted) | ❌ | ❌ | ❌ |
| **Public** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Security Architecture

### Authentication Layer

```
User Wallet → MetaMask → Signature → Contract Verification
```

**Components:**
- Wallet-based authentication
- EIP-712 signature verification
- Transaction signing
- Role-based authorization

### Encryption Layer

```
Plaintext → FHE Public Key → Ciphertext → Blockchain Storage
```

**Security Properties:**
- Client-side encryption
- End-to-end encryption
- No plaintext exposure
- Selective decryption

### Access Control Layer

```
Request → Permission Check → Role Verification → Grant/Deny
```

**Mechanisms:**
- Role-based access control (RBAC)
- Permission mappings
- Time-based access (optional)
- Multi-signature requirements (optional)

## Network Architecture

### Deployment Architecture

```
┌──────────────┐
│   Frontend   │ (Vercel)
│  Next.js App │
└──────┬───────┘
       │
       ↓ HTTPS
┌──────────────┐
│   Ethereum   │ (Sepolia Testnet)
│  Blockchain  │
└──────┬───────┘
       │
       ↓ RPC
┌──────────────┐
│     FHE      │ (Zama Infrastructure)
│ Coprocessor  │
└──────────────┘
```

### Network Endpoints

**Frontend:**
- Production: `https://cultural-heritage-protection.vercel.app/`
- Localhost: Development environment

**Blockchain:**
- Network: Sepolia Testnet
- RPC: Ethereum JSON-RPC
- Chain ID: 11155111

**FHE Services:**
- Gateway: Zama Gateway Service
- Coprocessor: Zama FHE Coprocessor
- ACL: Access Control Contract

## State Management

### Application State

```typescript
interface AppState {
  // Wallet state
  wallet: {
    connected: boolean;
    address: string | null;
    chainId: number | null;
    balance: bigint;
  };

  // FHE state
  fhevm: {
    instance: FhevmInstance | null;
    isReady: boolean;
    publicKey: string | null;
  };

  // Artifact state
  artifacts: {
    list: EncryptedArtifact[];
    selected: EncryptedArtifact | null;
    isLoading: boolean;
  };

  // UI state
  ui: {
    isEncrypting: boolean;
    isDecrypting: boolean;
    error: Error | null;
    notification: string | null;
  };
}
```

### State Updates

```
User Action → Dispatch → Reducer → New State → Re-render
```

## Performance Optimization

### Gas Optimization Strategies

1. **Batch Operations**: Group multiple artifacts in single transaction
2. **Efficient Storage**: Minimize on-chain storage
3. **Event Indexing**: Use events for off-chain data
4. **Lazy Loading**: Load artifacts on-demand
5. **Cache Results**: Store decrypted values locally (with expiry)

### Frontend Optimization

1. **Code Splitting**: Split bundles by route
2. **Lazy Loading**: Load components on-demand
3. **Memoization**: Cache expensive computations
4. **Virtual Scrolling**: Efficient list rendering
5. **Image Optimization**: Next.js Image component

### Blockchain Optimization

1. **Minimize FHE Operations**: Use when necessary
2. **Efficient Data Structures**: Optimize storage layout
3. **Event-Driven Architecture**: Reduce state queries
4. **Transaction Batching**: Combine operations
5. **Off-Chain Computation**: Move non-sensitive logic off-chain

## Scalability Considerations

### Horizontal Scaling

- Multiple frontend instances (Vercel CDN)
- Load-balanced RPC endpoints
- Distributed FHE coprocessors

### Vertical Scaling

- Optimized smart contract code
- Efficient FHE operations
- Database indexing for events

### Future Scalability

- Layer 2 integration (zk-Rollups)
- Sharding for artifact data
- IPFS for large metadata
- Subgraph for indexing

## Monitoring and Logging

### Application Monitoring

```typescript
// Event tracking
trackEvent('artifact_registered', {
  artifactId: encrypted,
  timestamp: Date.now()
});

// Error logging
logError('encryption_failed', error, context);

// Performance monitoring
measurePerformance('encrypt_artifact', async () => {
  await encrypt(fhevm, data, 'euint32');
});
```

### Blockchain Monitoring

- Transaction status tracking
- Gas usage analytics
- Contract event monitoring
- Error rate tracking

## Disaster Recovery

### Backup Strategy

1. **Smart Contract Code**: Version controlled in Git
2. **Encrypted Data**: Permanently on blockchain
3. **Access Permissions**: Recoverable from blockchain events
4. **Frontend State**: Reconstructable from blockchain

### Recovery Procedures

1. **Contract Upgrade**: Proxy pattern for upgrades
2. **Data Migration**: Export/import encrypted data
3. **Permission Recovery**: Replay events to rebuild state
4. **Key Recovery**: User wallet recovery mechanisms

## Development Workflow

### Local Development

```bash
# 1. Start local blockchain
npx hardhat node

# 2. Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# 3. Start frontend
npm run dev

# 4. Run tests
npm test
```

### Testing Strategy

1. **Unit Tests**: Contract functions, utilities
2. **Integration Tests**: Frontend + contracts
3. **E2E Tests**: Full user workflows
4. **Security Audits**: Smart contract audits
5. **Performance Tests**: Load testing

## Deployment Pipeline

```
Code → Git Push → CI/CD → Build → Test → Deploy
```

### Stages

1. **Development**: Local testing
2. **Staging**: Testnet deployment
3. **Production**: Mainnet deployment (future)

### Continuous Integration

- Automated testing on push
- Contract compilation checks
- Frontend build verification
- Security scanning

---

**For more information:**
- [FHE Concepts](./FHE_CONCEPTS.md)
- [Getting Started](./getting-started.md)
- [API Reference](./api-reference.md)
