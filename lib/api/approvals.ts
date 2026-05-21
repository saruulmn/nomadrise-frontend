import api from './base';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'active' | 'registered';

export type ApprovalRecord = {
  id: string;
  status: RequestStatus;
  created_at?: string;
  updated_at?: string;
  reviewed_by?: string | number | null;
  requester?: string | number;
  student?: string | number;
  mentor?: string | number;
  teacher?: string | number | null;
  instructor?: string | number | null;
  title?: string;
  slug?: string;
  product_type?: string;
  product_id?: string;
  message?: string;
  is_public?: boolean;
};

export type AccessResponse = {
  has_access: boolean;
};

export type CohortApprovalPayload = {
  title: string;
  slug: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  max_students?: number;
  price?: string;
  currency?: string;
};

export type MasterClassApprovalPayload = {
  title: string;
  slug: string;
  description?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  max_attendees?: number;
  price?: string;
  currency?: string;
};

const auth = (token?: string) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

export async function createEnrollmentRequest(cohortId: string, token?: string) {
  const response = await api.post<ApprovalRecord>(
    '/enrollments/',
    { product_type: 'cohort', product_id: cohortId },
    auth(token),
  );
  return response.data;
}

export async function listMyEnrollmentRequests(token?: string) {
  const response = await api.get<ApprovalRecord[]>('/enrollments/own-requests/', auth(token));
  return response.data;
}

export async function cancelEnrollmentRequest(requestId: string, token?: string) {
  const response = await api.post<ApprovalRecord>(`/enrollments/${requestId}/cancel/`, {}, auth(token));
  return response.data;
}

export async function listCohortEnrollmentRequests(_cohortId?: string, token?: string) {
  const response = await api.get<ApprovalRecord[]>('/enrollments/pending-approval/', auth(token));
  return response.data;
}

export async function approveEnrollmentRequest(requestId: string, token?: string) {
  const response = await api.post<ApprovalRecord>(`/enrollments/${requestId}/approve/`, {}, auth(token));
  return response.data;
}

export async function rejectEnrollmentRequest(requestId: string, _reason?: string, token?: string) {
  const response = await api.post<ApprovalRecord>(`/enrollments/${requestId}/reject/`, {}, auth(token));
  return response.data;
}

export async function createCohortApprovalRequest(payload: CohortApprovalPayload, token?: string) {
  const response = await api.post<ApprovalRecord>('/cohorts/', payload, auth(token));
  return response.data;
}

export async function listMyCohortApprovalRequests(token?: string) {
  const response = await api.get<ApprovalRecord[]>('/cohorts/own-requests/', auth(token));
  return response.data;
}

export async function listPendingCohortApprovalRequests(token?: string) {
  const response = await api.get<ApprovalRecord[]>('/cohorts/pending-approval/', auth(token));
  return response.data;
}

export async function approveCohortApprovalRequest(requestId: string, token?: string) {
  const response = await api.post<ApprovalRecord>(`/cohorts/${requestId}/approve/`, {}, auth(token));
  return response.data;
}

export async function rejectCohortApprovalRequest(requestId: string, _reason?: string, token?: string) {
  const response = await api.post<ApprovalRecord>(`/cohorts/${requestId}/reject/`, {}, auth(token));
  return response.data;
}

export async function createMenteeRequest(mentorId: string | number, token?: string) {
  const response = await api.post<ApprovalRecord>('/mentee-requests/', { mentor: mentorId }, auth(token));
  return response.data;
}

export async function listMyMenteeRequests(token?: string) {
  const response = await api.get<ApprovalRecord[]>('/mentee-requests/own-requests/', auth(token));
  return response.data;
}

export async function listMentorMenteeRequests(token?: string) {
  const response = await api.get<ApprovalRecord[]>('/mentee-requests/pending-approval/', auth(token));
  return response.data;
}

export async function approveMenteeRequest(requestId: string, token?: string) {
  const response = await api.post<ApprovalRecord>(`/mentee-requests/${requestId}/approve/`, {}, auth(token));
  return response.data;
}

export async function rejectMenteeRequest(requestId: string, _reason?: string, token?: string) {
  const response = await api.post<ApprovalRecord>(`/mentee-requests/${requestId}/reject/`, {}, auth(token));
  return response.data;
}

export async function createBecomeMentorRequest(payload: { message?: string } = {}, token?: string) {
  const response = await api.post<ApprovalRecord>('/become-mentor-requests/', payload, auth(token));
  return response.data;
}

export async function listMyBecomeMentorRequests(token?: string) {
  const response = await api.get<ApprovalRecord[]>('/become-mentor-requests/own-requests/', auth(token));
  return response.data;
}

export async function listPendingBecomeMentorRequests(token?: string) {
  const response = await api.get<ApprovalRecord[]>('/become-mentor-requests/pending-approval/', auth(token));
  return response.data;
}

export async function approveBecomeMentorRequest(requestId: string, token?: string) {
  const response = await api.post<ApprovalRecord>(`/become-mentor-requests/${requestId}/approve/`, {}, auth(token));
  return response.data;
}

export async function rejectBecomeMentorRequest(requestId: string, _reason?: string, token?: string) {
  const response = await api.post<ApprovalRecord>(`/become-mentor-requests/${requestId}/reject/`, {}, auth(token));
  return response.data;
}

export async function createMasterClassApprovalRequest(payload: MasterClassApprovalPayload, token?: string) {
  const response = await api.post<ApprovalRecord>('/masterclasses/', payload, auth(token));
  return response.data;
}

export async function listMyMasterClassApprovalRequests(token?: string) {
  const response = await api.get<ApprovalRecord[]>('/masterclasses/own-requests/', auth(token));
  return response.data;
}

export async function listPendingMasterClassApprovalRequests(token?: string) {
  const response = await api.get<ApprovalRecord[]>('/masterclasses/pending-approval/', auth(token));
  return response.data;
}

export async function approveMasterClassApprovalRequest(requestId: string, token?: string) {
  const response = await api.post<ApprovalRecord>(`/masterclasses/${requestId}/approve/`, {}, auth(token));
  return response.data;
}

export async function rejectMasterClassApprovalRequest(requestId: string, _reason?: string, token?: string) {
  const response = await api.post<ApprovalRecord>(`/masterclasses/${requestId}/reject/`, {}, auth(token));
  return response.data;
}

export async function checkCohortContentAccess(cohortId: string, token?: string) {
  const response = await api.get<AccessResponse>(`/cohorts/${cohortId}/access/`, auth(token));
  return response.data;
}

export async function checkMasterClassAccess(masterClassId: string, token?: string) {
  const response = await api.get<AccessResponse>(`/masterclasses/${masterClassId}/access/`, auth(token));
  return response.data;
}

const approvalApi = {
  createEnrollmentRequest,
  listMyEnrollmentRequests,
  cancelEnrollmentRequest,
  listCohortEnrollmentRequests,
  approveEnrollmentRequest,
  rejectEnrollmentRequest,
  createCohortApprovalRequest,
  listMyCohortApprovalRequests,
  listPendingCohortApprovalRequests,
  approveCohortApprovalRequest,
  rejectCohortApprovalRequest,
  createMenteeRequest,
  listMyMenteeRequests,
  listMentorMenteeRequests,
  approveMenteeRequest,
  rejectMenteeRequest,
  createBecomeMentorRequest,
  listMyBecomeMentorRequests,
  listPendingBecomeMentorRequests,
  approveBecomeMentorRequest,
  rejectBecomeMentorRequest,
  createMasterClassApprovalRequest,
  listMyMasterClassApprovalRequests,
  listPendingMasterClassApprovalRequests,
  approveMasterClassApprovalRequest,
  rejectMasterClassApprovalRequest,
  checkCohortContentAccess,
  checkMasterClassAccess,
};

export default approvalApi;
