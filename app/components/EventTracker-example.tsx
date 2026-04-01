/**
 * Example Client Component using Internal API Routes
 * 
 * ⚠️ SECURITY PATTERN: This demonstrates the CORRECT way for client components
 * to communicate with protected Django endpoints.
 * 
 * Key principle:
 * - Client components NEVER call Django directly
 * - Client components ALWAYS use Next.js API routes as a proxy
 * - The API route handles X-API-Key authentication (server-side)
 * - The client never sees or accesses X-API-Key
 * 
 * Location: app/components/EventTracker.tsx (or any client component)
 * This component would be used like:
 *   'use client'
 *   import EventTracker from '@/components/EventTracker';
 *   
 *   export default function MyPage() {
 *     return <EventTracker />;
 *   }
 */

'use client';

import { useEffect } from 'react';

interface Eventpayload {
  event_type: string;
  page: string;
  user_id?: string;
}

/**
 * Client-side event tracking component
 * 
 * This demonstrates how to safely send events to Django from a client component
 * WITHOUT ever exposing the X-API-Key.
 */
export function EventTracker({ page }: { page: string }) {
  useEffect(() => {
    // Send a page view event through our Next.js API route
    // This route handles the authentication with Django
    const trackPageView = async () => {
      try {
        const payload: EventPayload = {
          event_type: 'page_view',
          page,
          user_id: undefined, // Could get from session if available
        };

        // Call your Next.js API route, NOT Django directly
        const response = await fetch('/api/nextjs-integration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.warn('Failed to track page view:', await response.json());
        }
      } catch (error) {
        console.error('Error tracking page view:', error);
        // Don't throw - event tracking shouldn't break the app
      }
    };

    trackPageView();
  }, [page]);

  return null; // This component doesn't render anything
}

/**
 * Example of using the Event Tracker in a page:
 * 
 * export default function ScholarshipsPage() {
 *   return (
 *     <>
 *       <EventTracker page="/scholarships" />
 *       <div className="scholarships-content">
 *         ...
 *       </div>
 *     </>
 *   );
 * }
 */

// ============================================================================
// SECURITY COMPARISON: RIGHT vs WRONG
// ============================================================================

/**
 * ❌ WRONG - DO NOT DO THIS
 * 
 * This exposes the API key to the browser!
 */
// export async function wrongWayToCallDjango() {
//   const apiKey = process.env.NEXTJS_API_KEY; // ❌ Exposed to client!
//   const response = await fetch('http://localhost:8000/api/nextjs/sync/', {
//     method: 'POST',
//     headers: {
//       'X-API-Key': apiKey, // ❌ BAD! Visible in Network tab / browser!
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ event_type: 'page_view' })
//   });
// }

/**
 * ✅ RIGHT - DO THIS INSTEAD
 * 
 * Client component calls internal API route
 */
export async function rightWayToSendEvent(payload: EventPayload) {
  // Call your internal API route
  const response = await fetch('/api/nextjs-integration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to send event');
  }

  return response.json();
}

/**
 * ✅ ALSO RIGHT - Server Components or Server Actions
 * 
 * Server-side code can use serverApi with X-API-Key directly
 */
// 'use server'
// import { serverApi } from '@/lib/api/base';
// 
// export async function serverActionExample() {
//   // This is server-side, so NEXTJS_API_KEY is safe to use
//   const response = await serverApi.post('/nextjs/sync/', {
//     event_type: 'form_submission'
//   });
//   return response.data;
// }
