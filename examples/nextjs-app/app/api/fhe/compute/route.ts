import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance, encrypt } from '@fhevm/sdk';

/**
 * API Route: /api/fhe/compute
 * Demonstrates FHE computation capabilities
 * Note: Actual computation happens on-chain in FHEVM contracts
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, values, type, network, contractAddress } = body;

    if (!values || !Array.isArray(values) || values.length === 0) {
      return NextResponse.json(
        { error: 'Values array is required' },
        { status: 400 }
      );
    }

    // Initialize FHEVM instance
    const fhevm = await createFhevmInstance({
      network: network || 'sepolia',
      contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    });

    // Encrypt all values
    const encryptedValues = await Promise.all(
      values.map(value => encrypt(fhevm, value, type || 'euint32'))
    );

    // Convert to base64
    const encryptedBase64 = encryptedValues.map(e => Buffer.from(e).toString('base64'));

    return NextResponse.json({
      success: true,
      message: 'Values encrypted for computation',
      note: 'Homomorphic computation happens on-chain in FHEVM contracts',
      operation: operation || 'add',
      encryptedValues: encryptedBase64,
      count: encryptedValues.length,
      hint: 'Send these encrypted values to your FHEVM smart contract for computation',
    });
  } catch (error: any) {
    console.error('Computation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Computation preparation failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE computation endpoint',
    note: 'Homomorphic computation happens on-chain in FHEVM smart contracts',
    method: 'POST',
    parameters: {
      operation: 'add | sub | mul | div (for reference)',
      values: 'number[] (required)',
      type: 'euint8 | euint16 | euint32 | euint64 (optional)',
      network: 'sepolia | localhost (optional)',
      contractAddress: 'string (optional)',
    },
  });
}
