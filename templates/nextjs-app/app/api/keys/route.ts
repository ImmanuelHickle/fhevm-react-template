import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance } from '@fhevm/sdk';

/**
 * API Route: /api/keys
 * Handles FHE key management operations
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network') || 'sepolia';
    const contractAddress = searchParams.get('contractAddress') || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

    // Initialize FHEVM instance
    const fhevm = await createFhevmInstance({
      network,
      contractAddress,
    });

    // Get public key information
    const keyInfo = {
      network,
      contractAddress,
      hasPublicKey: !!fhevm,
      message: 'FHE keys initialized successfully',
      note: 'Keys are managed automatically by the SDK',
    };

    return NextResponse.json({
      success: true,
      keyInfo,
    });
  } catch (error: any) {
    console.error('Key Management Error:', error);
    return NextResponse.json(
      { error: error.message || 'Key management failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, network, contractAddress } = body;

    switch (action) {
      case 'refresh':
        // Reinitialize FHEVM instance
        const fhevm = await createFhevmInstance({
          network: network || 'sepolia',
          contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        });

        return NextResponse.json({
          success: true,
          message: 'FHE keys refreshed successfully',
        });

      case 'info':
        return NextResponse.json({
          success: true,
          supportedNetworks: ['sepolia', 'localhost'],
          keyManagement: 'automatic',
          note: 'Keys are fetched and managed automatically by the SDK',
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Key Management Error:', error);
    return NextResponse.json(
      { error: error.message || 'Key management operation failed' },
      { status: 500 }
    );
  }
}
