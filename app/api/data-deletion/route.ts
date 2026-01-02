import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - User must be logged in' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { userEmail, userId, provider, requestedAt } = body;

    // Validate required fields
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    // Log the data deletion request
    // This is a soft request - we don't delete data immediately
    const deletionRequest = {
      userId: userId || session.user.id,
      userEmail: userEmail || session.user.email,
      provider: provider || 'unknown',
      requestedAt: requestedAt || new Date().toISOString(),
      status: 'pending',
      processedAt: null,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent'),
    };

    // TODO: Store deletion request in database
    // For now, we'll just log it to console/file
    console.log('Data Deletion Request:', {
      ...deletionRequest,
      timestamp: new Date().toISOString(),
    });

    // In a production environment, you would:
    // 1. Store this in a database (data_deletion_requests table)
    // 2. Send a confirmation email to the user
    // 3. Set up a background job to process deletions after 30 days

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Data deletion request received',
        requestId: `DR-${Date.now()}`,
        processingTimeframe: '30 days',
        status: 'pending',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Data deletion API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to request data deletion.' },
    { status: 405 }
  );
}
