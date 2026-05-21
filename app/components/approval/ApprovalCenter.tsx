'use client';

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  ApprovalRecord,
  approveEnrollmentRequest,
  approveMenteeRequest,
  cancelEnrollmentRequest,
  createBecomeMentorRequest,
  createCohortApprovalRequest,
  createMasterClassApprovalRequest,
  listCohortEnrollmentRequests,
  listMentorMenteeRequests,
  listMyBecomeMentorRequests,
  listMyCohortApprovalRequests,
  listMyEnrollmentRequests,
  listMyMasterClassApprovalRequests,
  listMyMenteeRequests,
  rejectEnrollmentRequest,
  rejectMenteeRequest,
} from '@/lib/api/approvals';
import StatusBadge from './StatusBadge';

type Role = 'student' | 'teacher' | 'mentor' | 'teamMember';
type ProfileResponse = { groups?: string[] };

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function detectRole(groups: string[] = []): Role {
  if (groups.includes('mentor')) return 'mentor';
  if (groups.includes('teacher')) return 'teacher';
  if (groups.includes('teamMember')) return 'teamMember';
  return 'student';
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === 'object') {
      const detail = (data as { detail?: unknown }).detail;
      if (typeof detail === 'string') return detail;
      return Object.values(data as Record<string, unknown>).flat().join(' ');
    }
  }
  return error instanceof Error ? error.message : 'Something went wrong.';
}

function RequestList({
  title,
  empty,
  items,
  actions,
}: {
  title: string;
  empty: string;
  items: ApprovalRecord[];
  actions?: (item: ApprovalRecord) => ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">{empty}</p>
      ) : (
        <div className="mt-4 divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.id} className="py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">{item.title || item.product_type || item.message || item.id}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Created recently'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={item.status} />
                {actions?.(item)}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function ApprovalCenter() {
  const { data: session } = useSession();
  const token = session?._at;
  const [role, setRole] = useState<Role>('student');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [enrollments, setEnrollments] = useState<ApprovalRecord[]>([]);
  const [cohorts, setCohorts] = useState<ApprovalRecord[]>([]);
  const [masterClasses, setMasterClasses] = useState<ApprovalRecord[]>([]);
  const [mentees, setMentees] = useState<ApprovalRecord[]>([]);
  const [becomeMentor, setBecomeMentor] = useState<ApprovalRecord[]>([]);
  const [pendingEnrollments, setPendingEnrollments] = useState<ApprovalRecord[]>([]);
  const [pendingMentees, setPendingMentees] = useState<ApprovalRecord[]>([]);
  const [cohortTitle, setCohortTitle] = useState('');
  const [masterClassTitle, setMasterClassTitle] = useState('');

  const canTeach = role === 'teacher';
  const canMentor = role === 'mentor';

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const profileRes = await fetch(`${apiBase}/auth/me/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = profileRes.ok ? ((await profileRes.json()) as ProfileResponse) : { groups: [] };
      const nextRole = detectRole(profile.groups || []);
      setRole(nextRole);

      const [myEnrollments, myMentees, myBecomeMentor] = await Promise.all([
        listMyEnrollmentRequests(token),
        listMyMenteeRequests(token),
        listMyBecomeMentorRequests(token),
      ]);
      setEnrollments(myEnrollments);
      setMentees(myMentees);
      setBecomeMentor(myBecomeMentor);

      if (nextRole === 'teacher') {
        const [myCohorts, myMasterClasses, approvals] = await Promise.all([
          listMyCohortApprovalRequests(token),
          listMyMasterClassApprovalRequests(token),
          listCohortEnrollmentRequests(undefined, token),
        ]);
        setCohorts(myCohorts);
        setMasterClasses(myMasterClasses);
        setPendingEnrollments(approvals);
      }

      if (nextRole === 'mentor') {
        setPendingMentees(await listMentorMenteeRequests(token));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const slugify = (value: string) =>
    value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const run = async (label: string, action: () => Promise<unknown>, message: string) => {
    if (!window.confirm('Are you sure?')) return;
    setSubmitting(label);
    setError('');
    setSuccess('');
    try {
      await action();
      setSuccess(message);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting('');
    }
  };

  const createCohort = async (event: FormEvent) => {
    event.preventDefault();
    if (!cohortTitle.trim()) return;
    setSubmitting('cohort');
    setError('');
    try {
      await createCohortApprovalRequest({ title: cohortTitle, slug: slugify(cohortTitle), description: '' }, token);
      setCohortTitle('');
      setSuccess('Cohort approval request created.');
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting('');
    }
  };

  const createMasterClass = async (event: FormEvent) => {
    event.preventDefault();
    if (!masterClassTitle.trim()) return;
    setSubmitting('masterclass');
    setError('');
    try {
      await createMasterClassApprovalRequest({ title: masterClassTitle, slug: slugify(masterClassTitle), description: '' }, token);
      setMasterClassTitle('');
      setSuccess('Master class approval request created.');
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting('');
    }
  };

  const roleLabel = useMemo(() => role === 'teamMember' ? 'staff' : role, [role]);

  if (loading) {
    return <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Requests and approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Current role: <span className="font-semibold capitalize">{roleLabel}</span></p>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">{success}</div>}

      <RequestList
        title="Enrollment requests"
        empty="No enrollment requests yet."
        items={enrollments}
        actions={(item) => item.status === 'pending' ? (
          <button
            type="button"
            disabled={!!submitting}
            onClick={() => run(`cancel-${item.id}`, () => cancelEnrollmentRequest(item.id, token), 'Enrollment request cancelled.')}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
        ) : null}
      />

      <RequestList title="Mentee requests" empty="No mentee requests yet." items={mentees} />

      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Become a mentor</h2>
        <p className="text-sm text-gray-500 mt-1">Students and teachers can request mentor access.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!!submitting || becomeMentor.some((item) => item.status === 'pending')}
            onClick={() => run('become-mentor', () => createBecomeMentorRequest({}, token), 'Become mentor request sent.')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Request mentor role
          </button>
          {becomeMentor[0] && <StatusBadge status={becomeMentor[0].status} />}
        </div>
      </section>

      {canTeach && (
        <>
          <section className="grid gap-4 lg:grid-cols-2">
            <form onSubmit={createCohort} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Create cohort request</h2>
              <input
                value={cohortTitle}
                onChange={(event) => setCohortTitle(event.target.value)}
                placeholder="Cohort title"
                className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <button disabled={!!submitting} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                Submit for approval
              </button>
            </form>

            <form onSubmit={createMasterClass} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Create master class request</h2>
              <input
                value={masterClassTitle}
                onChange={(event) => setMasterClassTitle(event.target.value)}
                placeholder="Master class title"
                className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <button disabled={!!submitting} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                Submit for approval
              </button>
            </form>
          </section>

          <RequestList title="Cohort approval status" empty="No cohort requests yet." items={cohorts} />
          <RequestList title="Master class approval status" empty="No master class requests yet." items={masterClasses} />
          <RequestList
            title="Student enrollment approvals"
            empty="No pending enrollment requests for your cohorts."
            items={pendingEnrollments}
            actions={(item) => (
              <>
                <button disabled={!!submitting} onClick={() => run(`approve-${item.id}`, () => approveEnrollmentRequest(item.id, token), 'Enrollment approved.')} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">Approve</button>
                <button disabled={!!submitting} onClick={() => run(`reject-${item.id}`, () => rejectEnrollmentRequest(item.id, undefined, token), 'Enrollment rejected.')} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">Reject</button>
              </>
            )}
          />
        </>
      )}

      {canMentor && (
        <RequestList
          title="Mentee approvals"
          empty="No pending mentee requests."
          items={pendingMentees}
          actions={(item) => (
            <>
              <button disabled={!!submitting} onClick={() => run(`approve-mentee-${item.id}`, () => approveMenteeRequest(item.id, token), 'Mentee request approved.')} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">Approve</button>
              <button disabled={!!submitting} onClick={() => run(`reject-mentee-${item.id}`, () => rejectMenteeRequest(item.id, undefined, token), 'Mentee request rejected.')} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">Reject</button>
            </>
          )}
        />
      )}
    </div>
  );
}
