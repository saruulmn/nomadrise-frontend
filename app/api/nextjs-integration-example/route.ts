/**
 * Example API Route using X-API-Key authentication
 * 
 * This demonstrates how to securely call protected Django endpoints from a
 * Next.js API Route. The X-API-Key is loaded from the server environment
 * and is never exposed to the browser.
 * 
 * Location: app/api/nextjs-integration/route.ts
 * Example: POST /api/nextjs-integration
 * 
 * This pattern is useful for:
 * - Syncing data between frontend and backend
 * - Logging user interactions
 * - Recording events/analytics
 * - Proxying requests with authentication
 * 
 * SECURITY:
 * - This is a server-side route - NEXTJS_API_KEY is safe to use
 * - The client never sees the API key
 * - The client calls your Next.js API route, not Django directly
 */

import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/lib/api/base';

// Define types for the sync payload
interface SyncEventPayload {
  event_type: string;
  page: string;
  user_id?: string;
  metadata?: Record<string, unknown>;
}

interface SyncResponse {
  success: boolean;
  message: string;
}

/**
 * POST /api/nextjs-integration
 * 
 * This endpoint receives events from the client and securely forwards them
 * to Django using X-API-Key authentication.
 * 
 * Example client-side usage:
 *   const response = await fetch('/api/nextjs-integration', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({
 *       event_type: 'page_view',
 *       page: '/scholarships',
 *       user_id: 'user123'
 *     })
 *   });
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the client request body
    const body: SyncEventPayload = await request.json();

    // Validate required fields
    if (!body.event_type || !body.page) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: event_type, page' },
        { status: 400 }
      );
    }

    // Forward to Django using X-API-Key authentication
    // This request will include the X-API-Key header automatically
    const response = await serverApi.post<SyncResponse>('/nextjs/sync/', {
      event_type: body.event_type,
      page: body.page,
      user_id: body.user_id,
      metadata: body.metadata,
    });

    // Return the Django response to the client
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('Error in nextjs-integration route:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/nextjs-integration/health
 * 
 * Example of a health check endpoint that verifies the backend is accessible.
 * This demonstrates how to use serverApi.get() in an API route.
 * 
 * Example usage:
 *   const response = await fetch('/api/nextjs-integration/health');
 *   const { status } = await response.json();
 */
export async function GET(request: NextRequest) {
  try {
    // Check if this is a health check request
    const url = new URL(request.url);
    if (url.searchParams.get('check') === 'health') {
      // Call Django health check endpoint using X-API-Key
      const response = await serverApi.get('/nextjs/health-check/');
      return NextResponse.json(response.data, { status: response.status });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in health check:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Health check failed',
      },
      { status: 500 }
    );
  }
}
