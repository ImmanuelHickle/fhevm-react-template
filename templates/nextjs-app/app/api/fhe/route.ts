import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance, encrypt, decrypt } from '@fhevm/sdk';

/**
 * API Route: /api/fhe
 * Handles general FHE operations
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, value, type, network, contractAddress } = body;

    // Initialize FHEVM instance
    const fhevm = await createFhevmInstance({
      network: network || 'sepolia',
      contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    });

    let result;

    switch (operation) {
      case 'encrypt':
        result = await encrypt(fhevm, value, type || 'euint32');
        // Convert Uint8Array to base64 for JSON response
        result = Buffer.from(result).toString('base64');
        break;

      case 'info':
        result = {
          network: network || 'sepolia',
          contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          supportedTypes: ['euint8', 'euint16', 'euint32', 'euint64', 'ebool', 'eaddress'],
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('FHE API Error:', error);
    return NextResponse.json(
      { error: error.message || 'FHE operation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'FHE API endpoint',
    endpoints: {
      POST: 'Perform FHE operations',
      encrypt: '/api/fhe/encrypt',
      decrypt: '/api/fhe/decrypt',
      compute: '/api/fhe/compute',
    },
  });
}
