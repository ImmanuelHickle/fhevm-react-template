#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { createFhevmInstance, encrypt, FhevmInstance } from '@fhevm/sdk';

const program = new Command();

// Configuration
const CONTRACT_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';
const NETWORK = 'sepolia';

// ASCII Art Banner
function showBanner() {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════╗
║     🔐 FHEVM CLI Tool v1.0.0         ║
║   Encrypt & Decrypt with Zama FHEVM  ║
╚═══════════════════════════════════════╝
  `));
}

// Initialize FHEVM instance
async function initializeFhevm(): Promise<FhevmInstance> {
  const spinner = ora('Initializing FHEVM SDK...').start();

  try {
    const fhevm = await createFhevmInstance({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS
    });

    spinner.succeed(chalk.green('FHEVM SDK initialized successfully!'));
    return fhevm;
  } catch (error) {
    spinner.fail(chalk.red('Failed to initialize FHEVM SDK'));
    throw error;
  }
}

// Encrypt command
async function encryptCommand(value: string, type: string = 'euint32') {
  showBanner();
  console.log(chalk.blue('🔒 Encrypting value...\n'));

  try {
    const fhevm = await initializeFhevm();

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      console.log(chalk.red('❌ Error: Value must be a number'));
      process.exit(1);
    }

    const spinner = ora(`Encrypting ${numValue} as ${type}...`).start();

    const encrypted = await encrypt(fhevm, numValue, type as any);

    spinner.succeed(chalk.green('Encryption complete!'));

    // Display results
    console.log(chalk.cyan('\n📊 Encryption Results:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white(`Original Value: ${chalk.yellow(numValue)}`));
    console.log(chalk.white(`Type: ${chalk.yellow(type)}`));
    console.log(chalk.white(`Encrypted Length: ${chalk.yellow(encrypted.length)} bytes`));
    console.log(chalk.white(`Encrypted (Hex): ${chalk.yellow(
      Array.from(encrypted.slice(0, 32))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    )}...`));
    console.log(chalk.gray('─'.repeat(50)));

    console.log(chalk.green('\n✅ Encryption successful!'));
  } catch (error: any) {
    console.log(chalk.red(`\n❌ Error: ${error.message}`));
    process.exit(1);
  }
}

// Decrypt command (demo)
async function decryptCommand(hexData: string) {
  showBanner();
  console.log(chalk.blue('🔓 Decrypting value...\n'));

  try {
    const fhevm = await initializeFhevm();

    // Convert hex to Uint8Array
    const cleanHex = hexData.replace(/^0x/, '');
    const encrypted = new Uint8Array(
      cleanHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );

    const spinner = ora('Decrypting data...').start();

    // In a real app, you would:
    // const decrypted = await userDecrypt(fhevm, {
    //   ciphertext: encrypted,
    //   contractAddress: CONTRACT_ADDRESS,
    //   userAddress: '0xYourAddress',
    //   signer: yourSigner
    // });

    // For demo purposes
    await new Promise(resolve => setTimeout(resolve, 1000));
    const demoDecrypted = 42;

    spinner.succeed(chalk.green('Decryption complete!'));

    // Display results
    console.log(chalk.cyan('\n📊 Decryption Results:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white(`Encrypted Length: ${chalk.yellow(encrypted.length)} bytes`));
    console.log(chalk.white(`Decrypted Value: ${chalk.yellow(demoDecrypted)}`));
    console.log(chalk.gray('─'.repeat(50)));

    console.log(chalk.green('\n✅ Decryption successful!'));
    console.log(chalk.dim('\nNote: This is a demo. Real decryption requires wallet signature.'));
  } catch (error: any) {
    console.log(chalk.red(`\n❌ Error: ${error.message}`));
    process.exit(1);
  }
}

// Info command
async function infoCommand() {
  showBanner();
  console.log(chalk.blue('ℹ️  FHEVM SDK Information\n'));

  try {
    const fhevm = await initializeFhevm();

    console.log(chalk.cyan('📊 SDK Configuration:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white(`Network: ${chalk.yellow(NETWORK)}`));
    console.log(chalk.white(`Contract Address: ${chalk.yellow(CONTRACT_ADDRESS)}`));
    console.log(chalk.gray('─'.repeat(50)));

    console.log(chalk.cyan('\n🔐 Supported Encryption Types:'));
    console.log(chalk.gray('─'.repeat(50)));
    const types = [
      { type: 'euint8', range: '0 to 255' },
      { type: 'euint16', range: '0 to 65,535' },
      { type: 'euint32', range: '0 to 4,294,967,295' },
      { type: 'euint64', range: '0 to 2^64-1' },
      { type: 'ebool', range: 'true/false' },
      { type: 'eaddress', range: 'Ethereum address' }
    ];

    types.forEach(({ type, range }) => {
      console.log(chalk.white(`  ${chalk.yellow(type.padEnd(12))} - ${chalk.dim(range)}`));
    });
    console.log(chalk.gray('─'.repeat(50)));

    console.log(chalk.cyan('\n📚 Available Commands:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white(`  ${chalk.yellow('encrypt <value> [type]')} - Encrypt a value`));
    console.log(chalk.white(`  ${chalk.yellow('decrypt <hex>')}          - Decrypt encrypted data`));
    console.log(chalk.white(`  ${chalk.yellow('info')}                   - Show this information`));
    console.log(chalk.gray('─'.repeat(50)));

    console.log(chalk.green('\n✅ SDK is ready to use!'));
  } catch (error: any) {
    console.log(chalk.red(`\n❌ Error: ${error.message}`));
    process.exit(1);
  }
}

// Define CLI commands
program
  .name('fhevm-cli')
  .description('CLI tool for encrypting and decrypting data with Zama FHEVM')
  .version('1.0.0');

program
  .command('encrypt <value> [type]')
  .description('Encrypt a numeric value')
  .action(encryptCommand);

program
  .command('decrypt <hex>')
  .description('Decrypt encrypted data (hex format)')
  .action(decryptCommand);

program
  .command('info')
  .description('Show FHEVM SDK information')
  .action(infoCommand);

// Default action
program.action(() => {
  showBanner();
  console.log(chalk.yellow('Run with --help to see available commands\n'));
  program.help();
});

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  showBanner();
  console.log(chalk.yellow('Run with --help to see available commands\n'));
  program.help();
}
