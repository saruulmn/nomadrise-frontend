'use client';

import type { RequestStatus } from '@/lib/api/approvals';

const STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  registered: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function StatusBadge({ status }: { status?: RequestStatus | string }) {
  const value = status || 'pending';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${STYLES[value] || STYLES.pending}`}>
      {value}
    </span>
  );
}
