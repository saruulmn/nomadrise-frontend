'use client';

import { useSession } from "next-auth/react";
import AuthGuard from "@/app/components/AuthGuard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as
    | {
        username?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      }
    | undefined;

  if (!user) {
    return null;
  }

  const username = user.username || user.name || undefined;
  const email = user.email || undefined;

  return (
    <AuthGuard>
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Hello{username ? `, ${username}` : ""}!</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                {user?.image && (
                  <img
                    src={user.image}
                    alt={username || "User"}
                    className="w-20 h-20 rounded-full"
                  />
                )}
                <div>
                  {username && <p className="text-lg font-medium text-gray-900">Username: {username}</p>}
                  {email && <p className="text-gray-600">Email: {email}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
