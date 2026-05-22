import api from './base';

const auth = (token?: string) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

export type CommunityMedia = {
  id: string;
  kind: 'image' | 'document' | 'video';
  filename?: string;
  mime_type?: string;
  size?: number;
  visibility?: string;
  url?: string | null;
  stream_uid?: string;
  provider?: string;
  duration_seconds?: number | null;
  alt_text?: string;
};

export type CommunityAuthor = {
  id: number;
  name: string;
  email?: string;
  avatar_url?: string | null;
};

export type CommunityComment = {
  id: string;
  author: CommunityAuthor;
  body: string;
  parent?: string | null;
  status: 'active' | 'hidden' | 'deleted';
  created_at: string;
  updated_at: string;
  can_edit: boolean;
  can_delete: boolean;
};

export type CommunityPost = {
  id: string;
  author: CommunityAuthor;
  title: string;
  body: string;
  post_type: 'text' | 'video' | 'image' | 'document' | 'mixed';
  status: 'published' | 'hidden' | 'deleted';
  pinned: boolean;
  media: CommunityMedia[];
  comment_count: number;
  created_at: string;
  updated_at: string;
  can_edit: boolean;
  can_delete: boolean;
  can_comment: boolean;
  is_cohort_expired: boolean;
};

export type CommunityPostListResponse = {
  cohort: {
    id: string;
    title: string;
    is_expired: boolean;
  };
  can_post: boolean;
  results: CommunityPost[];
};

export type CreateCommunityPostPayload = {
  title?: string;
  body?: string;
  image_id?: string;
  document_id?: string;
  video_id?: string;
};

export async function listCohortCommunityPosts(cohortId: string, token?: string) {
  const response = await api.get<CommunityPostListResponse>(
    `/cohorts/${cohortId}/community/posts/`,
    auth(token),
  );
  return response.data;
}

export async function createCohortCommunityPost(cohortId: string, payload: CreateCommunityPostPayload, token?: string) {
  const response = await api.post<CommunityPost>(
    `/cohorts/${cohortId}/community/posts/`,
    payload,
    auth(token),
  );
  return response.data;
}

export async function listCohortCommunityComments(cohortId: string, postId: string, token?: string) {
  const response = await api.get<{ results: CommunityComment[] }>(
    `/cohorts/${cohortId}/community/posts/${postId}/comments/`,
    auth(token),
  );
  return response.data.results;
}

export async function createCohortCommunityComment(cohortId: string, postId: string, body: string, token?: string) {
  const response = await api.post<CommunityComment>(
    `/cohorts/${cohortId}/community/posts/${postId}/comments/`,
    { body },
    auth(token),
  );
  return response.data;
}

export async function moderateCohortCommunityPost(cohortId: string, postId: string, action: 'hide' | 'publish' | 'delete', token?: string) {
  const response = await api.post<CommunityPost>(
    `/cohorts/${cohortId}/community/posts/${postId}/${action}/`,
    {},
    auth(token),
  );
  return response.data;
}

export async function moderateCohortCommunityComment(
  cohortId: string,
  postId: string,
  commentId: string,
  action: 'hide' | 'publish' | 'delete',
  token?: string,
) {
  const response = await api.post<CommunityComment>(
    `/cohorts/${cohortId}/community/posts/${postId}/comments/${commentId}/${action}/`,
    {},
    auth(token),
  );
  return response.data;
}
