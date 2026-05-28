'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import AuthGuard from '@/app/components/AuthGuard';
import ApprovalCenter from '@/app/components/approval/ApprovalCenter';
import StatusBadge from '@/app/components/approval/StatusBadge';
import {
  ApprovalRecord,
  approveEnrollmentRequest,
  approveMenteeRequest,
  listCohortEnrollmentRequests,
  listMentorMenteeRequests,
  listMyCohortApprovalRequests,
  listMyMasterClassApprovalRequests,
  listMyMenteeRequests,
  rejectEnrollmentRequest,
  rejectMenteeRequest,
} from '@/lib/api/approvals';
import { getApiErrorMessage } from '@/lib/api/errors';
import { cohorts as sampleCohorts } from '@/lib/data/cohorts';
import { masterClasses as sampleMasterClasses } from '@/lib/data/masterClasses';

type DashboardRole = 'teacher' | 'mentor' | 'student' | 'staff';

type ProfileResponse = {
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string | null;
  is_staff?: boolean;
  groups?: string[];
};

type LearningRecord = ApprovalRecord & {
  description?: string;
  cover?: string;
  start_date?: string | null;
  end_date?: string | null;
  scheduled_at?: string | null;
  duration_minutes?: number;
  max_students?: number;
  max_attendees?: number;
  price?: string | number;
  currency?: string;
};

type MenteeRecord = ApprovalRecord & {
  student_name?: string;
  student_email?: string;
  student_avatar_url?: string | null;
  mentor_name?: string;
  mentor_email?: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const apiOrigin = (() => {
  try {
    return new URL(apiBase).origin;
  } catch {
    return '';
  }
})();

function hasRole(groups: string[] = [], role: DashboardRole) {
  return groups.some((group) => group.toLowerCase() === role.toLowerCase());
}

function getRoleOptions(profile?: ProfileResponse | null): DashboardRole[] {
  const groups = profile?.groups || [];
  const options: DashboardRole[] = [];
  if (hasRole(groups, 'teacher')) options.push('teacher');
  if (hasRole(groups, 'mentor')) options.push('mentor');
  if (profile?.is_staff) options.push('staff');
  return options.length ? options : ['student'];
}

function displayName(profile: ProfileResponse | null, fallback?: string | null) {
  if (!profile) return fallback || 'Dashboard';
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
  return fullName || profile.username || fallback || profile.email || 'Dashboard';
}

function resolveImage(src: string | undefined | null, fallback: string) {
  if (!src) return fallback;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  if (src.startsWith('/')) return src;
  return apiOrigin ? `${apiOrigin}/${src.replace(/^\/+/, '')}` : fallback;
}

function formatDate(value?: string | null) {
  if (!value) return 'Not scheduled';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatMoney(value?: string | number, currency = 'USD') {
  const numeric = Number(value || 0);
  if (!numeric) return 'Free';
  return `${currency} ${numeric.toLocaleString()}`;
}

function fallbackCourseImage(record: LearningRecord, kind: 'cohort' | 'masterclass') {
  const title = (record.title || '').toLowerCase();
  if (kind === 'cohort') {
    return sampleCohorts.find((item) => item.name.toLowerCase() === title)?.thumbnail || sampleCohorts[0].thumbnail;
  }
  return sampleMasterClasses.find((item) => item.title.toLowerCase() === title)?.thumbnail || sampleMasterClasses[0].thumbnail;
}

function SummaryTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: typeof AcademicCapIcon;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function RoleTabs({
  roles,
  activeRole,
  onChange,
}: {
  roles: DashboardRole[];
  activeRole: DashboardRole;
  onChange: (role: DashboardRole) => void;
}) {
  if (roles.length <= 1) return null;
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
      {roles.map((role) => (
        <button
          key={role}
          type="button"
          onClick={() => onChange(role)}
          className={`rounded-md px-4 py-2 text-sm font-semibold capitalize transition-colors ${
            activeRole === role ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {role}
        </button>
      ))}
    </div>
  );
}

function CourseCard({
  record,
  kind,
  lang,
}: {
  record: LearningRecord;
  kind: 'cohort' | 'masterclass';
  lang: string;
}) {
  const image = resolveImage(record.cover, fallbackCourseImage(record, kind));
  const href = kind === 'cohort' ? `/${lang}/cohort/${record.id}` : `/${lang}/masterclass/${record.id}`;
  const date = kind === 'cohort' ? formatDate(record.start_date) : formatDate(record.scheduled_at);
  const capacity = kind === 'cohort' ? record.max_students : record.max_attendees;

  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Link href={href} className="block aspect-[16/9] overflow-hidden bg-gray-100">
        <img src={image} alt={record.title || kind} className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]" />
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {kind === 'cohort' ? 'Cohort' : 'Master class'}
            </p>
            <h3 className="mt-1 line-clamp-2 text-base font-bold text-gray-950">{record.title || 'Untitled'}</h3>
          </div>
          <StatusBadge status={record.status} />
        </div>
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">{record.description || 'No description yet.'}</p>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDaysIcon className="h-4 w-4" aria-hidden="true" />
            {date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UserGroupIcon className="h-4 w-4" aria-hidden="true" />
            {capacity ? `${capacity} seats` : 'No limit'}
          </span>
          {kind === 'masterclass' && (
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" aria-hidden="true" />
              {record.duration_minutes || 60} min
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <BookOpenIcon className="h-4 w-4" aria-hidden="true" />
            {formatMoney(record.price, record.currency)}
          </span>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="mt-1">{detail}</p>
    </div>
  );
}

function ActionButtons({
  approve,
  reject,
  disabled,
}: {
  approve: () => void;
  reject: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={approve}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white disabled:opacity-50"
        aria-label="Approve"
      >
        <CheckIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={reject}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white disabled:opacity-50"
        aria-label="Reject"
      >
        <XMarkIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function TeacherDashboard({
  cohorts,
  masterClasses,
  enrollmentRequests,
  busy,
  onApproveEnrollment,
  onRejectEnrollment,
  lang,
}: {
  cohorts: LearningRecord[];
  masterClasses: LearningRecord[];
  enrollmentRequests: ApprovalRecord[];
  busy: string;
  onApproveEnrollment: (id: string) => void;
  onRejectEnrollment: (id: string) => void;
  lang: string;
}) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryTile label="Cohorts" value={cohorts.length} icon={AcademicCapIcon} />
        <SummaryTile label="Master classes" value={masterClasses.length} icon={BookOpenIcon} />
        <SummaryTile label="Pending students" value={enrollmentRequests.length} icon={UserGroupIcon} />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-950">Your cohorts</h2>
          <Link href={`/${lang}/cohort`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</Link>
        </div>
        {cohorts.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cohorts.map((cohort) => <CourseCard key={cohort.id} record={cohort} kind="cohort" lang={lang} />)}
          </div>
        ) : (
          <EmptyState title="No cohorts yet" detail="Created or approved cohorts will appear here with their thumbnails." />
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-950">Your master classes</h2>
          <Link href={`/${lang}/masterclass`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</Link>
        </div>
        {masterClasses.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {masterClasses.map((masterClass) => (
              <CourseCard key={masterClass.id} record={masterClass} kind="masterclass" lang={lang} />
            ))}
          </div>
        ) : (
          <EmptyState title="No master classes yet" detail="Your master class thumbnails and statuses will appear here." />
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-950">Student enrollment approvals</h2>
        {enrollmentRequests.length ? (
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
            {enrollmentRequests.map((request) => (
              <div key={request.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-gray-950">{request.title || request.product_type || 'Enrollment request'}</p>
                  <p className="mt-1 text-sm text-gray-500">{formatDate(request.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={request.status} />
                  <ActionButtons
                    disabled={!!busy}
                    approve={() => onApproveEnrollment(request.id)}
                    reject={() => onRejectEnrollment(request.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No pending enrollments" detail="Student requests for your cohorts will show up here." />
        )}
      </section>
    </div>
  );
}

function MenteeRow({
  request,
  pending,
  busy,
  onApprove,
  onReject,
}: {
  request: MenteeRecord;
  pending?: boolean;
  busy: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const name = request.student_name || `Student ${String(request.student || '').slice(0, 8)}`;
  const initial = name.charAt(0).toUpperCase() || 'S';

  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {request.student_avatar_url ? (
          <img src={request.student_avatar_url} alt={name} className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
            {initial}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-950">{name}</p>
          <p className="truncate text-sm text-gray-500">{request.student_email || request.message || 'No email available'}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={request.status} />
        {pending && (
          <ActionButtons
            disabled={!!busy}
            approve={() => onApprove(request.id)}
            reject={() => onReject(request.id)}
          />
        )}
      </div>
    </div>
  );
}

function MentorDashboard({
  mentees,
  pendingMentees,
  busy,
  onApproveMentee,
  onRejectMentee,
}: {
  mentees: MenteeRecord[];
  pendingMentees: MenteeRecord[];
  busy: string;
  onApproveMentee: (id: string) => void;
  onRejectMentee: (id: string) => void;
}) {
  const activeMentees = mentees.filter((item) => item.status === 'approved');

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryTile label="Active mentees" value={activeMentees.length} icon={UserGroupIcon} />
        <SummaryTile label="Pending requests" value={pendingMentees.length} icon={ClockIcon} />
        <SummaryTile label="Total requests" value={mentees.length} icon={AcademicCapIcon} />
      </div>

      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-950">Mentee list</h2>
        {activeMentees.length ? (
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
            {activeMentees.map((request) => (
              <MenteeRow
                key={request.id}
                request={request}
                busy={busy}
                onApprove={onApproveMentee}
                onReject={onRejectMentee}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="No approved mentees yet" detail="Approved mentorship students will appear in this list." />
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-950">Pending mentee approvals</h2>
        {pendingMentees.length ? (
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
            {pendingMentees.map((request) => (
              <MenteeRow
                key={request.id}
                request={request}
                pending
                busy={busy}
                onApprove={onApproveMentee}
                onReject={onRejectMentee}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="No pending mentees" detail="New mentorship requests will appear here for approval." />
        )}
      </section>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const lang = pathname.startsWith('/en') ? 'en' : 'mn';
  const token = session?._at;

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [activeRole, setActiveRole] = useState<DashboardRole>('student');
  const [cohorts, setCohorts] = useState<LearningRecord[]>([]);
  const [masterClasses, setMasterClasses] = useState<LearningRecord[]>([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState<ApprovalRecord[]>([]);
  const [mentees, setMentees] = useState<MenteeRecord[]>([]);
  const [pendingMentees, setPendingMentees] = useState<MenteeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const roleOptions = useMemo(() => getRoleOptions(profile), [profile]);

  const load = useCallback(async () => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push(`/${lang}/login`);
      return;
    }
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const profileResponse = await fetch(`${apiBase}/auth/me/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!profileResponse.ok) throw new Error(`Profile fetch failed: HTTP ${profileResponse.status}`);
      const nextProfile = (await profileResponse.json()) as ProfileResponse;
      const nextRoles = getRoleOptions(nextProfile);
      setProfile(nextProfile);
      setActiveRole((current) => (nextRoles.includes(current) ? current : nextRoles[0]));

      const shouldLoadTeacher = nextRoles.includes('teacher');
      const shouldLoadMentor = nextRoles.includes('mentor');

      const [teacherData, mentorData] = await Promise.all([
        shouldLoadTeacher
          ? Promise.all([
              listMyCohortApprovalRequests(token) as Promise<LearningRecord[]>,
              listMyMasterClassApprovalRequests(token) as Promise<LearningRecord[]>,
              listCohortEnrollmentRequests(undefined, token),
            ])
          : Promise.resolve<[LearningRecord[], LearningRecord[], ApprovalRecord[]]>([[], [], []]),
        shouldLoadMentor
          ? Promise.all([
              listMyMenteeRequests(token) as Promise<MenteeRecord[]>,
              listMentorMenteeRequests(token) as Promise<MenteeRecord[]>,
            ])
          : Promise.resolve<[MenteeRecord[], MenteeRecord[]]>([[], []]),
      ]);

      setCohorts(teacherData[0]);
      setMasterClasses(teacherData[1]);
      setEnrollmentRequests(teacherData[2]);
      setMentees(mentorData[0]);
      setPendingMentees(mentorData[1]);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [lang, router, status, token]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (label: string, action: () => Promise<unknown>) => {
    setBusy(label);
    setError('');
    try {
      await action();
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusy('');
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="flex flex-col gap-4 border-b border-gray-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                {activeRole === 'mentor' ? 'Mentor dashboard' : activeRole === 'teacher' ? 'Teacher dashboard' : 'Dashboard'}
              </p>
              <h1 className="mt-2 text-3xl font-bold text-gray-950">
                {displayName(profile, session?.user?.name)}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                {activeRole === 'mentor'
                  ? 'Track mentees and approve new mentorship requests.'
                  : activeRole === 'teacher'
                    ? 'Manage your cohorts, master classes, thumbnails, and student approvals.'
                    : 'Your learning requests and account activity will appear here.'}
              </p>
            </div>
            <RoleTabs roles={roleOptions} activeRole={activeRole} onChange={setActiveRole} />
          </header>

          {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          {loading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-sm">Loading dashboard...</div>
          ) : activeRole === 'teacher' ? (
            <TeacherDashboard
              cohorts={cohorts}
              masterClasses={masterClasses}
              enrollmentRequests={enrollmentRequests}
              busy={busy}
              lang={lang}
              onApproveEnrollment={(id) => run(`approve-enrollment-${id}`, () => approveEnrollmentRequest(id, token))}
              onRejectEnrollment={(id) => run(`reject-enrollment-${id}`, () => rejectEnrollmentRequest(id, undefined, token))}
            />
          ) : activeRole === 'mentor' ? (
            <MentorDashboard
              mentees={mentees}
              pendingMentees={pendingMentees}
              busy={busy}
              onApproveMentee={(id) => run(`approve-mentee-${id}`, () => approveMenteeRequest(id, token))}
              onRejectMentee={(id) => run(`reject-mentee-${id}`, () => rejectMenteeRequest(id, undefined, token))}
            />
          ) : (
            <div className="space-y-6">
              <EmptyState title="No role dashboard yet" detail="Teacher and mentor dashboards appear after your role is approved." />
              <ApprovalCenter />
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
