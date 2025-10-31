import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance, publicDecrypt } from '@fhevm/sdk';

/**
 * API Route: /api/fhe/decrypt
 * Decrypts FHE ciphertexts (public decryption only)
 * Note: User decryption requires signature and should be done client-side
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ciphertext, contractAddress, network, decryptMethod } = body;

    if (!ciphertext) {
      return NextResponse.json(
        { error: 'Ciphertext is required' },
        { status: 400 }
      );
    }

    // Initialize FHEVM instance
    const fhevm = await createFhevmInstance({
      network: network || 'sepolia',
      contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    });

    // Convert base64 ciphertext back to Uint8Array
    const ciphertextBytes = Buffer.from(ciphertext, 'base64');

    // Only public decrypt is supported server-side
    // User decrypt requires signature and must be done client-side
    if (decryptMethod === 'user') {
      return NextResponse.json(
        {
          error: 'User decryption requires signature and must be done client-side',
          hint: 'Use useDecrypt hook with userDecrypt() on the client',
        },
        { status: 400 }
      );
    }

    const decrypted = await publicDecrypt(fhevm, {
      ciphertext: ciphertextBytes,
      contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    });

    return NextResponse.json({
      success: true,
      decrypted,
      method: 'publicDecrypt',
    });
  } catch (error: any) {
    console.error('Decryption Error:', error);
    return NextResponse.json(
      { error: error.message || 'Decryption failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Decryption endpoint (public decrypt only)',
    note: 'User decryption requires signature and must be done client-side',
    method: 'POST',
    parameters: {
      ciphertext: 'string (base64 encoded, required)',
      contractAddress: 'string (optional)',
      network: 'sepolia | localhost (optional)',
    },
  });
}
