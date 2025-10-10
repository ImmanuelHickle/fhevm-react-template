# Contributing to Cultural Heritage Protection

Thank you for your interest in contributing to the Cultural Heritage Protection project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Contact](#contact)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect everyone to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Publishing others' private information without permission
- Personal or political attacks
- Other conduct which could be considered inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

```bash
Node.js >= 18.0.0
npm >= 8.0.0
Git
MetaMask browser extension
Basic knowledge of:
  - React and Next.js
  - Solidity smart contracts
  - Fully Homomorphic Encryption (FHE) concepts
  - Ethereum blockchain
```

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/CulturalHeritageProtection.git
cd CulturalHeritageProtection
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/ErikaHegmann/CulturalHeritageProtection.git
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Run Development Server

```bash
npm run dev
```

---

## Development Process

### Branching Strategy

We use the following branch structure:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: New features (`feature/artifact-search`)
- **fix/**: Bug fixes (`fix/encryption-error`)
- **docs/**: Documentation updates (`docs/api-reference`)

### Creating a Feature Branch

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Write clear, concise code** following our coding standards
2. **Add tests** for new functionality
3. **Update documentation** for API changes
4. **Commit regularly** with meaningful messages
5. **Keep commits atomic** (one logical change per commit)

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(artifacts): add search functionality

Implement artifact search with encrypted field filtering.
Includes frontend UI and smart contract integration.

Closes #123
```

---

## Pull Request Process

### Before Submitting

1. **Sync with upstream**:
```bash
git fetch upstream
git rebase upstream/develop
```

2. **Run tests**:
```bash
npm test
npm run test:coverage
```

3. **Lint your code**:
```bash
npm run lint
```

4. **Build successfully**:
```bash
npm run build
```

### Creating a Pull Request

1. Push your branch to your fork:
```bash
git push origin feature/your-feature-name
```

2. Go to GitHub and create a Pull Request

3. Fill out the PR template:
   - **Title**: Clear, descriptive title
   - **Description**: What changes were made and why
   - **Related Issues**: Link to issues (`Closes #123`)
   - **Testing**: How to test the changes
   - **Screenshots**: For UI changes

### PR Review Process

1. **Automated checks** must pass:
   - Tests
   - Linting
   - Build
   - Security scans

2. **Code review** by maintainers:
   - At least one approval required
   - Address all review comments
   - Make requested changes

3. **Merge**:
   - Maintainer will merge after approval
   - Branch will be deleted automatically

---

## Coding Standards

### TypeScript/JavaScript

- **Use TypeScript** for all new code
- **Follow ESLint rules** in `.eslintrc.json`
- **Use meaningful variable names**
- **Add JSDoc comments** for functions
- **Avoid any type** - use proper types

**Example:**
```typescript
/**
 * Encrypts artifact data using FHE
 * @param fhevm - FHEVM instance
 * @param data - Data to encrypt
 * @param type - Encryption type
 * @returns Encrypted data as Uint8Array
 */
export async function encryptArtifact(
  fhevm: FhevmInstance,
  data: number,
  type: EncryptType
): Promise<Uint8Array> {
  // Implementation
}
```

### React Components

- **Use functional components** with hooks
- **Use TypeScript** for props
- **Extract reusable logic** into custom hooks
- **Keep components small** and focused
- **Use Tailwind CSS** for styling

**Example:**
```typescript
interface ArtifactCardProps {
  artifact: EncryptedArtifact;
  onSelect: (id: number) => void;
}

export function ArtifactCard({ artifact, onSelect }: ArtifactCardProps) {
  // Component logic
}
```

### Solidity Contracts

- **Follow Solidity style guide**
- **Use NatSpec comments**
- **Optimize gas usage**
- **Include security checks**
- **Test thoroughly**

**Example:**
```solidity
/**
 * @notice Register a new cultural heritage artifact
 * @param encryptedId Encrypted artifact identifier
 * @param encryptedValue Encrypted value estimation
 * @return registryId The ID of the registered artifact
 */
function registerArtifact(
    euint32 encryptedId,
    euint32 encryptedValue
) external returns (uint256 registryId) {
    // Implementation with security checks
}
```

---

## Testing Guidelines

### Writing Tests

All new features must include tests:

1. **Unit Tests** - Test individual functions
2. **Integration Tests** - Test component interactions
3. **E2E Tests** - Test complete user workflows

### Test Structure

```typescript
describe('Feature Name', () => {
  describe('Scenario', () => {
    it('should do something', () => {
      // Arrange
      const input = createTestData();

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
```

### Running Tests

```bash
# All tests
npm test

# Specific suite
npm test -- test/unit/artifact.test.ts

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Test Coverage

- **Minimum coverage**: 80%
- **Critical paths**: 100% coverage
- **New features**: Must include tests

---

## Documentation

### When to Update Docs

Update documentation when:

- Adding new features
- Changing APIs
- Modifying configuration
- Fixing bugs that affect usage
- Adding examples

### Documentation Files

- **README.md**: Main project documentation
- **docs/FHE_CONCEPTS.md**: FHE technology explanation
- **docs/ARCHITECTURE.md**: System architecture
- **docs/API_REFERENCE.md**: API documentation
- **CONTRIBUTING.md**: This file

### Writing Style

- **Clear and concise**
- **Use examples**
- **Include code snippets**
- **Link to related docs**
- **Keep it updated**

---

## Issue Reporting

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for known solutions
3. **Try latest version** to see if already fixed

### Bug Reports

Include:

- **Clear title** describing the bug
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Environment details**:
  - OS and version
  - Node.js version
  - Browser (if applicable)
  - Network (Sepolia, localhost, etc.)
- **Screenshots** or error messages
- **Code samples** if relevant

**Template:**
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: macOS 14
- Node: 18.17.0
- Browser: Chrome 120
- Network: Sepolia

## Additional Context
Any other relevant information
```

### Feature Requests

Include:

- **Clear title** describing the feature
- **Problem statement**: What problem does it solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other approaches
- **Additional context**: Examples, mockups

---

## Smart Contract Contributions

### Security Requirements

Smart contract changes require:

1. **Security review** by maintainers
2. **Gas optimization** analysis
3. **Test coverage** > 95%
4. **NatSpec comments** complete
5. **Audit trail** for sensitive functions

### FHE-Specific Guidelines

When working with FHE:

- **Understand FHE types** (euint8, euint32, ebool, etc.)
- **Use appropriate types** for data ranges
- **Implement access control** with TFHE.allow()
- **Test encryption/decryption** thoroughly
- **Document privacy implications**

---

## Review Process

### What We Look For

- **Code quality**: Clean, readable, maintainable
- **Tests**: Comprehensive test coverage
- **Documentation**: Updated and clear
- **Security**: No vulnerabilities
- **Performance**: No performance regressions
- **Style**: Follows coding standards

### Review Timeline

- **Initial response**: Within 3 business days
- **Full review**: Within 1 week
- **Approval/Changes**: Depends on complexity

---

## Community

### Getting Help

- **GitHub Discussions**: Ask questions
- **GitHub Issues**: Report bugs
- **Zama Discord**: Join the FHE community
- **Documentation**: Check docs first

### Stay Updated

- **Watch** the repository for notifications
- **Star** to show support
- **Follow** maintainers on GitHub

---

## Recognition

Contributors are recognized in:

- **Contributors** section of README
- **Release notes** for significant contributions
- **Hall of Fame** for major features

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

If you have questions about contributing:

- **Open a GitHub Discussion**
- **Check existing issues**
- **Review documentation**

Thank you for contributing to Cultural Heritage Protection! 🏛️

---

**Maintainers:**
- Cultural Heritage Protection Team

**Last Updated:** 2024-10-28
