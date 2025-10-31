import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance, encrypt } from '@fhevm/sdk';

/**
 * API Route: /api/fhe/encrypt
 * Encrypts values using FHE
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, type, network, contractAddress } = body;

    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Value is required' },
        { status: 400 }
      );
    }

    // Initialize FHEVM instance
    const fhevm = await createFhevmInstance({
      network: network || 'sepolia',
      contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    });

    // Encrypt the value
    const encrypted = await encrypt(fhevm, value, type || 'euint32');

    // Convert Uint8Array to base64 for JSON response
    const encryptedBase64 = Buffer.from(encrypted).toString('base64');

    return NextResponse.json({
      success: true,
      encrypted: encryptedBase64,
      type: type || 'euint32',
      originalValue: value, // For demonstration only - remove in production
    });
  } catch (error: any) {
    console.error('Encryption Error:', error);
    return NextResponse.json(
      { error: error.message || 'Encryption failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Encryption endpoint',
    method: 'POST',
    parameters: {
      value: 'number | boolean | string (required)',
      type: 'euint8 | euint16 | euint32 | euint64 | ebool | eaddress (optional, default: euint32)',
      network: 'sepolia | localhost (optional)',
      contractAddress: 'string (optional)',
    },
  });
}
