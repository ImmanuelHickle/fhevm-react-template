# Contributing to FHEVM React Template

Thank you for your interest in contributing to the FHEVM React Template! This document provides guidelines and instructions for contributing to this project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Documentation](#documentation)
7. [Pull Request Process](#pull-request-process)
8. [FHE-Specific Guidelines](#fhe-specific-guidelines)
9. [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Expected Behavior

- **Be Respectful**: Treat all community members with respect
- **Be Collaborative**: Work together to improve the project
- **Be Professional**: Keep discussions focused and constructive
- **Be Inclusive**: Welcome contributors of all backgrounds and experience levels

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling, insulting, or derogatory remarks
- Personal or political attacks
- Publishing others' private information
- Other conduct deemed inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js v18.0.0 or higher
- npm v8.0.0 or higher
- Git
- A GitHub account
- Basic understanding of TypeScript, React, and Ethereum

### Fork and Clone

1. **Fork the repository** on GitHub:
   - Visit https://github.com/ImmanuelHickle/fhevm-react-template
   - Click "Fork" button

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/fhevm-react-template.git
   cd fhevm-react-template
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ImmanuelHickle/fhevm-react-template.git
   ```

### Install Dependencies

```bash
npm install
```

### Verify Setup

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build project
npm run build
```

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

**Branch Naming Conventions:**

- `feature/` - New features (e.g., `feature/add-batch-encryption`)
- `fix/` - Bug fixes (e.g., `fix/decryption-error`)
- `docs/` - Documentation updates (e.g., `docs/update-api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/simplify-hooks`)
- `test/` - Test additions/fixes (e.g., `test/add-encryption-tests`)

### 2. Make Your Changes

- Write clean, readable code
- Follow coding standards (see below)
- Add tests for new functionality
- Update documentation as needed
- Keep commits focused and atomic

### 3. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add batch encryption support

- Implement batchEncrypt() function
- Add unit tests for batch operations
- Update API documentation
- Add example usage in README"
```

**Commit Message Format:**

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Keep Your Fork Updated

Regularly sync with upstream:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Coding Standards

### TypeScript

**Use TypeScript for all code:**

```typescript
// ✅ Good: Type-safe function
function encrypt(value: number, type: FheDataType): Promise<Uint8Array> {
  // Implementation
}

// ❌ Bad: No types
function encrypt(value, type) {
  // Implementation
}
```

**Define interfaces for complex types:**

```typescript
// ✅ Good: Clear interface
interface FhevmConfig {
  network: 'localhost' | 'sepolia' | 'mainnet';
  contractAddress: string;
  gatewayUrl?: string;
  aclAddress?: string;
}

// ❌ Bad: Unclear object type
function configure(config: any) {
  // Implementation
}
```

### Code Style

**Follow ESLint and Prettier configurations:**

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

**Key Style Guidelines:**

1. **Use 2 spaces for indentation**
2. **Use single quotes for strings**
3. **Add semicolons at end of statements**
4. **Use camelCase for variables and functions**
5. **Use PascalCase for classes and interfaces**
6. **Use UPPER_CASE for constants**

**Examples:**

```typescript
// ✅ Good
const CONTRACT_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';
const maxRetries = 3;

function encryptValue(value: number): Promise<Uint8Array> {
  return encrypt(fhevm, value, 'euint32');
}

// ❌ Bad
const contract_address = '0x1234567890abcdef1234567890abcdef12345678';
const MAX_RETRIES = 3;

function EncryptValue(value: number): Promise<Uint8Array> {
  return encrypt(fhevm, value, 'euint32');
}
```

### React Components

**Use functional components with hooks:**

```typescript
// ✅ Good: Functional component with hooks
function Counter({ fhevm }: { fhevm: FhevmInstance }) {
  const [count, setCount] = useState(0);
  const { encrypt } = useEncrypt(fhevm);

  const increment = async () => {
    const encrypted = await encrypt(1, 'euint32');
    // Send to contract
  };

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// ❌ Bad: Class component
class Counter extends React.Component {
  // Don't use class components
}
```

**Use TypeScript for props:**

```typescript
// ✅ Good: Typed props
interface CounterProps {
  fhevm: FhevmInstance;
  initialValue?: number;
  onValueChange?: (value: number) => void;
}

function Counter({ fhevm, initialValue = 0, onValueChange }: CounterProps) {
  // Implementation
}

// ❌ Bad: Untyped props
function Counter(props) {
  // Implementation
}
```

### Vue Components

**Use Composition API with `<script setup>`:**

```vue
<!-- ✅ Good: Composition API -->
<script setup lang="ts">
import { ref } from 'vue';
import { useFhevm } from '@fhevm/sdk/vue';

const { fhevm, isReady } = useFhevm({
  network: 'sepolia',
  contractAddress: '0x...'
});

const count = ref(0);
</script>

<!-- ❌ Bad: Options API -->
<script lang="ts">
export default {
  data() {
    return {
      count: 0
    };
  }
};
</script>
```

### Error Handling

**Always handle errors properly:**

```typescript
// ✅ Good: Proper error handling
async function encryptValue(value: number): Promise<Uint8Array> {
  try {
    const encrypted = await encrypt(fhevm, value, 'euint32');
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new EncryptionError(`Failed to encrypt value: ${error.message}`);
  }
}

// ❌ Bad: Silent failure
async function encryptValue(value: number): Promise<Uint8Array | null> {
  try {
    return await encrypt(fhevm, value, 'euint32');
  } catch (error) {
    return null; // Silent failure - don't do this!
  }
}
```

**Use custom error classes:**

```typescript
class EncryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EncryptionError';
  }
}

class DecryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DecryptionError';
  }
}
```

---

## Testing Guidelines

### Writing Tests

**Test all new functionality:**

```typescript
import { describe, it, expect } from 'vitest';
import { encrypt } from '@fhevm/sdk';

describe('encrypt()', () => {
  it('should encrypt euint32 value', async () => {
    const fhevm = await createFhevmInstance({
      network: 'localhost',
      contractAddress: '0x...'
    });

    const encrypted = await encrypt(fhevm, 42, 'euint32');

    expect(encrypted).toBeInstanceOf(Uint8Array);
    expect(encrypted.length).toBeGreaterThan(0);
  });

  it('should throw error for invalid value', async () => {
    const fhevm = await createFhevmInstance({
      network: 'localhost',
      contractAddress: '0x...'
    });

    await expect(
      encrypt(fhevm, -1, 'euint32')
    ).rejects.toThrow('Value out of range');
  });
});
```

### Test Coverage

**Maintain high test coverage:**

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test interactions between components
- **E2E Tests**: Test complete user workflows

**Coverage Goals:**
- Minimum 80% code coverage
- 100% coverage for critical encryption/decryption functions
- All edge cases and error conditions tested

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## Documentation

### Update Documentation

When making changes, update relevant documentation:

1. **README.md** - If adding new features or examples
2. **API_REFERENCE.md** - If changing API signatures
3. **ARCHITECTURE.md** - If changing system design
4. **Getting Started Guide** - If changing setup process
5. **Code Comments** - Add JSDoc comments for public APIs

### JSDoc Comments

**Document all public functions:**

```typescript
/**
 * Encrypts a value using the FHEVM instance.
 *
 * @param fhevm - Initialized FHEVM instance
 * @param value - Value to encrypt (number, boolean, or string)
 * @param type - FHE data type (euint8, euint16, euint32, etc.)
 * @returns Promise resolving to encrypted data as Uint8Array
 * @throws {EncryptionError} If encryption fails
 * @throws {ValidationError} If value is out of range for type
 *
 * @example
 * ```typescript
 * const encrypted = await encrypt(fhevm, 42, 'euint32');
 * ```
 */
export async function encrypt(
  fhevm: FhevmInstance,
  value: number | boolean | string,
  type: FheDataType
): Promise<Uint8Array> {
  // Implementation
}
```

---

## Pull Request Process

### Before Submitting

1. **Run all tests**: `npm test`
2. **Check linting**: `npm run lint`
3. **Build project**: `npm run build`
4. **Update documentation**: As needed
5. **Write clear commit messages**: Follow commit conventions

### Submit Pull Request

1. **Push your branch** to your fork
2. **Create pull request** on GitHub
3. **Fill out PR template** completely
4. **Link related issues**: Use "Fixes #123" or "Closes #456"
5. **Request review**: Tag relevant maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Address feedback** promptly
4. **Merge approval** required from maintainers

---

## FHE-Specific Guidelines

### Encryption Best Practices

1. **Always validate input ranges** before encryption
2. **Use appropriate FHE data types** for values
3. **Handle encryption errors** gracefully
4. **Test with various input values** including edge cases

### Decryption Best Practices

1. **Use `userDecrypt()`** for private data (with EIP-712 signature)
2. **Use `publicDecrypt()`** only for aggregate/public data
3. **Verify user permissions** before decryption
4. **Handle signature failures** appropriately

### Smart Contract Integration

1. **Always encrypt sensitive data** before sending to contract
2. **Verify contract addresses** before transactions
3. **Handle gas estimation** for FHE operations
4. **Test with local FHEVM node** before deploying

### Security Considerations

1. **Never log plaintext values** in production
2. **Never expose private keys** or encryption parameters
3. **Validate all user inputs** before processing
4. **Follow principle of least privilege** for access control

---

## Community

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and community support
- **Documentation**: Check docs first before asking

### Reporting Issues

**Use GitHub Issues** for:
- Bug reports
- Feature requests
- Documentation improvements
- Security vulnerabilities (use private reporting)

**Include in bug reports:**
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment information (Node.js version, OS, etc.)
- Code samples or screenshots

**Example Issue:**

```markdown
**Bug Description**
Encryption fails for euint64 values above 2^53

**Steps to Reproduce**
1. Initialize FHEVM instance
2. Call encrypt(fhevm, 9007199254740992, 'euint64')
3. Error thrown

**Expected Behavior**
Should encrypt successfully

**Actual Behavior**
Throws "Value out of range" error

**Environment**
- Node.js: v18.17.0
- SDK Version: 1.0.0
- OS: Windows 11
```

---

## Recognition

Contributors will be recognized in:
- **Contributors List** in README
- **Release Notes** for significant contributions
- **GitHub Contributors** page

---

## Questions?

If you have questions about contributing:

1. Check existing [documentation](./docs/)
2. Search [GitHub Issues](https://github.com/ImmanuelHickle/fhevm-react-template/issues)
3. Ask in [GitHub Discussions](https://github.com/ImmanuelHickle/fhevm-react-template/discussions)
4. Contact maintainers

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing to FHEVM React Template!** 🎉

Your contributions help make privacy-preserving applications more accessible to developers worldwide.

---

**Last Updated**: 2024-10-29
