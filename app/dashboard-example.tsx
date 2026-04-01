/**
 * Example Server Component using X-API-Key authentication
 * 
 * This demonstrates how to securely call protected Django endpoints from a
 * Next.js Server Component. The X-API-Key is loaded from the server environment
 * and is never exposed to the browser.
 * 
 * Location: app/dashboard/page.tsx (or any server component)
 * 
 * SECURITY:
 * - NEXTJS_API_KEY environment variable is only available on the server
 * - Never call this component with 'use client' directive
 * - Never pass the returned data to client components in a way that includes auth data
 */

import { serverApi } from '@/lib/api/base';

// Define types for the API responses
interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  message: string;
  timestamp: string;
}

interface UserStats {
  total_users: number;
  total_profiles: number;
  active_profiles: number;
}

/**
 * Server Component - automatically 'use server'
 * This renders on the server and the data is passed to the client
 */
export default async function DashboardPage() {
  let healthStatus: HealthStatus | null = null;
  let userStats: UserStats | null = null;
  let error: string | null = null;

  try {
    // Call protected endpoints using server-side X-API-Key authentication
    // This is safe because NEXTJS_API_KEY is never exposed to the browser
    
    // Example 1: Health check
    const healthResponse = await serverApi.get<HealthStatus>('/nextjs/health-check/');
    healthStatus = healthResponse.data;

    // Example 2: Get user statistics
    const statsResponse = await serverApi.get<UserStats>('/nextjs/stats/');
    userStats = statsResponse.data;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
    console.error('Dashboard data fetch error:', err);
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {error && (
        <div className="error-alert">
          <p>Error loading dashboard data: {error}</p>
        </div>
      )}

      <section className="health-section">
        <h2>Backend Status</h2>
        {healthStatus ? (
          <div className={`status status-${healthStatus.status}`}>
            <p>Status: {healthStatus.status}</p>
            <p>Message: {healthStatus.message}</p>
            <p className="timestamp">{new Date(healthStatus.timestamp).toLocaleString()}</p>
          </div>
        ) : (
          <p>Loading health status...</p>
        )}
      </section>

      <section className="stats-section">
        <h2>User Statistics</h2>
        {userStats ? (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{userStats.total_users}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userStats.total_profiles}</div>
              <div className="stat-label">Total Profiles</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userStats.active_profiles}</div>
              <div className="stat-label">Active Profiles</div>
            </div>
          </div>
        ) : (
          <p>Loading statistics...</p>
        )}
      </section>
    </div>
  );
}
