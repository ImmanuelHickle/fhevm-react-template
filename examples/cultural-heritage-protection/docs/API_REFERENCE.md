# API Reference - Cultural Heritage Protection System

## Smart Contract API

### CulturalHeritageProtection Contract

#### Main Functions

##### registerArtifact

Register a new cultural heritage artifact with encrypted data.

```solidity
function registerArtifact(
    einput encryptedArtifactId,
    bytes calldata inputProof,
    einput encryptedCategory,
    einput encryptedAge,
    einput encryptedCondition,
    einput encryptedValue,
    einput encryptedLocationHash
) external returns (uint256)
```

**Parameters:**
- `encryptedArtifactId`: Encrypted unique identifier for the artifact
- `inputProof`: ZK proof for encrypted inputs
- `encryptedCategory`: Encrypted category code (1-255)
- `encryptedAge`: Encrypted age/period in years
- `encryptedCondition`: Encrypted condition rating (1-10)
- `encryptedValue`: Encrypted estimated value
- `encryptedLocationHash`: Encrypted location identifier

**Returns:**
- `uint256`: Registry ID for the artifact

**Events:**
- `ArtifactRegistered(uint256 indexed registryId, address indexed owner)`

**Access:** Public (any authenticated user)

**Example:**
```typescript
const tx = await contract.registerArtifact(
    encryptedId,
    proof,
    encryptedCategory,
    encryptedAge,
    encryptedCondition,
    encryptedValue,
    encryptedLocation
);
await tx.wait();
```

---

##### updateArtifact

Update encrypted metadata for an existing artifact.

```solidity
function updateArtifact(
    uint256 registryId,
    einput encryptedCondition,
    einput encryptedValue,
    einput encryptedLocationHash
) external
```

**Parameters:**
- `registryId`: Registry ID of the artifact
- `encryptedCondition`: New encrypted condition rating
- `encryptedValue`: New encrypted value
- `encryptedLocationHash`: New encrypted location

**Access:** Owner or authorized curator only

**Events:**
- `ArtifactUpdated(uint256 indexed registryId, address indexed updater)`

---

##### transferOwnership

Transfer artifact ownership to another address.

```solidity
function transferOwnership(
    uint256 registryId,
    address newOwner
) external
```

**Parameters:**
- `registryId`: Registry ID of the artifact
- `newOwner`: Address of the new owner

**Access:** Current owner only

**Events:**
- `OwnershipTransferred(uint256 indexed registryId, address indexed from, address indexed to)`

---

##### grantAccess

Grant decryption access to a specific address.

```solidity
function grantAccess(
    uint256 registryId,
    address user
) external
```

**Parameters:**
- `registryId`: Registry ID of the artifact
- `user`: Address to grant access to

**Access:** Owner or admin only

**Events:**
- `AccessGranted(uint256 indexed registryId, address indexed user, address indexed grantor)`

---

##### revokeAccess

Revoke decryption access from an address.

```solidity
function revokeAccess(
    uint256 registryId,
    address user
) external
```

**Parameters:**
- `registryId`: Registry ID of the artifact
- `user`: Address to revoke access from

**Access:** Owner or admin only

**Events:**
- `AccessRevoked(uint256 indexed registryId, address indexed user, address indexed revoker)`

---

##### getEncryptedArtifact

Retrieve encrypted artifact data.

```solidity
function getEncryptedArtifact(
    uint256 registryId
) external view returns (EncryptedArtifact memory)
```

**Parameters:**
- `registryId`: Registry ID of the artifact

**Returns:**
- `EncryptedArtifact`: Struct containing all encrypted fields

**Access:** Public (returns encrypted data)

---

##### checkAccess

Check if an address has access to decrypt an artifact.

```solidity
function checkAccess(
    uint256 registryId,
    address user
) external view returns (bool)
```

**Parameters:**
- `registryId`: Registry ID of the artifact
- `user`: Address to check

**Returns:**
- `bool`: True if user has access, false otherwise

---

#### View Functions

##### getArtifactCount

```solidity
function getArtifactCount() external view returns (uint256)
```

Returns the total number of registered artifacts.

##### getOwnerArtifacts

```solidity
function getOwnerArtifacts(address owner) external view returns (uint256[] memory)
```

Returns array of registry IDs owned by the specified address.

##### isAdmin

```solidity
function isAdmin(address user) external view returns (bool)
```

Check if address has admin role.

##### isCurator

```solidity
function isCurator(address user) external view returns (bool)
```

Check if address has curator role.

---

## Frontend API

### FHE Encryption/Decryption

#### createFhevmInstance

Initialize FHEVM instance for encryption operations.

```typescript
async function createFhevmInstance(
    config: FhevmConfig
): Promise<FhevmInstance>
```

**Parameters:**
```typescript
interface FhevmConfig {
    network: 'sepolia' | 'localhost';
    contractAddress: string;
    rpcUrl?: string;
    debug?: boolean;
}
```

**Returns:**
```typescript
interface FhevmInstance {
    config: FhevmConfig;
    instance: any;
    publicKey: string;
    chainId: number;
}
```

**Example:**
```typescript
const fhevm = await createFhevmInstance({
    network: 'sepolia',
    contractAddress: '0x...',
    debug: true
});
```

---

#### encrypt

Encrypt a value using FHE.

```typescript
async function encrypt<T>(
    fhevm: FhevmInstance,
    value: T,
    type?: EncryptType
): Promise<Uint8Array>
```

**Parameters:**
- `fhevm`: FHEVM instance
- `value`: Value to encrypt
- `type`: Encryption type (auto-inferred if not provided)

**Returns:**
- `Uint8Array`: Encrypted data

**Example:**
```typescript
const encryptedId = await encrypt(fhevm, 12345, 'euint32');
const encryptedAge = await encrypt(fhevm, 500, 'euint32');
const encryptedAuth = await encrypt(fhevm, true, 'ebool');
```

---

#### decrypt

Decrypt encrypted data (generic method).

```typescript
async function decrypt<T>(
    fhevm: FhevmInstance,
    options: DecryptOptions
): Promise<T>
```

**Parameters:**
```typescript
interface DecryptOptions {
    ciphertext: Uint8Array;
    contractAddress: string;
    userAddress?: string;
    signer?: Signer;
}
```

**Returns:**
- `T`: Decrypted value

---

#### userDecrypt

Decrypt with EIP-712 signature (maximum privacy).

```typescript
async function userDecrypt<T>(
    fhevm: FhevmInstance,
    options: UserDecryptOptions
): Promise<T>
```

**Parameters:**
```typescript
interface UserDecryptOptions {
    ciphertext: Uint8Array;
    contractAddress: string;
    userAddress: string;
    signer: Signer;
}
```

**Example:**
```typescript
const decrypted = await userDecrypt(fhevm, {
    ciphertext: encryptedData,
    contractAddress: CONTRACT_ADDRESS,
    userAddress: userAddress,
    signer: signer
});
```

---

#### publicDecrypt

Decrypt public/aggregate data without signature.

```typescript
async function publicDecrypt<T>(
    fhevm: FhevmInstance,
    options: PublicDecryptOptions
): Promise<T>
```

**Parameters:**
```typescript
interface PublicDecryptOptions {
    ciphertext: Uint8Array;
    contractAddress: string;
}
```

---

### React Hooks

#### useFhevm

Main hook for FHEVM instance management.

```typescript
function useFhevm(config: FhevmConfig): UseFhevmReturn
```

**Returns:**
```typescript
interface UseFhevmReturn {
    fhevm: FhevmInstance | null;
    isReady: boolean;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
```

**Example:**
```typescript
const { fhevm, isReady, isLoading, error } = useFhevm({
    network: 'sepolia',
    contractAddress: CONTRACT_ADDRESS
});
```

---

#### useEncrypt

Hook for encryption operations.

```typescript
function useEncrypt(fhevm: FhevmInstance | null): UseEncryptReturn
```

**Returns:**
```typescript
interface UseEncryptReturn {
    encrypt: (value: any, type?: EncryptType) => Promise<Uint8Array>;
    isEncrypting: boolean;
    error: Error | null;
}
```

**Example:**
```typescript
const { encrypt, isEncrypting } = useEncrypt(fhevm);

const handleSubmit = async () => {
    const encrypted = await encrypt(artifactId, 'euint32');
    await contract.registerArtifact(encrypted, ...);
};
```

---

#### useDecrypt

Hook for decryption operations.

```typescript
function useDecrypt(fhevm: FhevmInstance | null): UseDecryptReturn
```

**Returns:**
```typescript
interface UseDecryptReturn {
    decrypt: (options: DecryptOptions) => Promise<any>;
    userDecrypt: (options: UserDecryptOptions) => Promise<any>;
    publicDecrypt: (options: PublicDecryptOptions) => Promise<any>;
    isDecrypting: boolean;
    error: Error | null;
}
```

**Example:**
```typescript
const { userDecrypt, isDecrypting } = useDecrypt(fhevm);

const handleDecrypt = async () => {
    const value = await userDecrypt({
        ciphertext: encryptedData,
        contractAddress: CONTRACT_ADDRESS,
        userAddress: address,
        signer: signer
    });
    console.log('Decrypted:', value);
};
```

---

#### useContract

Hook for contract interactions.

```typescript
function useContract(
    fhevm: FhevmInstance | null,
    options: ContractOptions
): UseContractReturn
```

**Parameters:**
```typescript
interface ContractOptions {
    address: string;
    abi: any[];
    signer?: Signer;
}
```

**Returns:**
```typescript
interface UseContractReturn {
    contract: Contract | null;
    call: (method: string, ...args: any[]) => Promise<any>;
    send: (method: string, ...args: any[]) => Promise<any>;
    isLoading: boolean;
    error: Error | null;
}
```

---

### Utility Functions

#### formatAddress

Format Ethereum address for display.

```typescript
function formatAddress(address: string): string
```

**Example:**
```typescript
formatAddress('0x1234567890abcdef1234567890abcdef12345678')
// Returns: '0x1234...5678'
```

---

#### isAddress

Validate Ethereum address.

```typescript
function isAddress(address: string): boolean
```

---

#### sleep

Wait for specified milliseconds.

```typescript
function sleep(ms: number): Promise<void>
```

---

#### retry

Retry operation on failure.

```typescript
async function retry<T>(
    operation: () => Promise<T>,
    maxAttempts: number
): Promise<T>
```

---

## Type Definitions

### EncryptType

```typescript
type EncryptType =
    | 'euint8'
    | 'euint16'
    | 'euint32'
    | 'euint64'
    | 'euint128'
    | 'euint256'
    | 'ebool'
    | 'eaddress';
```

### EncryptedArtifact

```typescript
interface EncryptedArtifact {
    registryId: uint256;
    artifactId: euint32;
    category: euint8;
    age: euint32;
    condition: euint8;
    value: euint32;
    owner: eaddress;
    isAuthentic: ebool;
    locationHash: euint32;
    timestamp: uint256;
}
```

### Role

```typescript
enum Role {
    None,
    Owner,
    Admin,
    Curator,
    Auditor
}
```

---

## Error Codes

### Contract Errors

- `Unauthorized`: Caller lacks required permissions
- `InvalidArtifact`: Artifact does not exist
- `AlreadyRegistered`: Artifact ID already registered
- `InvalidInput`: Invalid encrypted input data
- `AccessDenied`: User lacks access to decrypt
- `InvalidRole`: Invalid role assignment

### Client Errors

- `FHEVM_NOT_INITIALIZED`: FHEVM instance not ready
- `ENCRYPTION_FAILED`: Encryption operation failed
- `DECRYPTION_FAILED`: Decryption operation failed
- `NETWORK_ERROR`: Network connection error
- `WALLET_NOT_CONNECTED`: Wallet not connected
- `SIGNATURE_REJECTED`: User rejected signature request

---

## Rate Limits

### Contract Calls

- Maximum artifacts per transaction: 10
- Maximum batch decryption: 20 items
- Cooldown between updates: None (gas-limited)

### Gateway Requests

- Decryption requests: 100 per minute per address
- Burst limit: 20 requests per second

---

**For more information:**
- [FHE Concepts](./FHE_CONCEPTS.md)
- [Architecture](./ARCHITECTURE.md)
- [Getting Started](./getting-started.md)
