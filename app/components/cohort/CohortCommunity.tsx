'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  CommunityComment,
  CommunityMedia,
  CommunityPost,
  createCohortCommunityComment,
  createCohortCommunityPost,
  createStreamUploadURL,
  listCohortCommunityComments,
  listCohortCommunityPosts,
  moderateCohortCommunityComment,
  moderateCohortCommunityPost,
  uploadVideoToCloudflare,
} from '@/lib/api/cohortCommunity';
import CloudflareStreamPlayer from '@/app/components/media/CloudflareStreamPlayer';
import { getApiErrorMessage } from '@/lib/api/errors';

function formatDate(value: string, lang: string) {
  return new Date(value).toLocaleString(lang === 'mn' ? 'mn-MN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MediaPreview({ media, token }: { media: CommunityMedia; token?: string }) {
  if (media.kind === 'image' && media.url) {
    return (
      <img
        src={media.url}
        alt={media.alt_text || media.filename || 'Community image'}
        className="mt-4 max-h-[30rem] w-full rounded-lg object-cover border border-gray-100 shadow-sm dark:border-white/10"
      />
    );
  }

  if (media.kind === 'video' && media.stream_uid) {
    return <CloudflareStreamPlayer videoUid={media.stream_uid} token={token} title={media.filename || 'Community video'} />;
  }

  if (media.kind === 'video' && media.url) {
    return (
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-100 bg-black shadow-sm dark:border-white/10">
        <iframe
          src={media.url}
          className="aspect-video w-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={media.filename || 'Community video'}
        />
      </div>
    );
  }

  if (media.kind === 'document') {
    return (
      <a
        href={media.url || '#'}
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
      >
        <span className="truncate font-medium">{media.filename || 'Document attachment'}</span>
        <span className="ml-3 text-blue-600">{media.url ? 'Open' : 'Unavailable'}</span>
      </a>
    );
  }

  return null;
}

function AuthorAvatar({ post }: { post: Pick<CommunityPost, 'author'> }) {
  return post.author.avatar_url ? (
    <img src={post.author.avatar_url} alt={post.author.name} className="community-avatar h-11 w-11 rounded-full object-cover" />
  ) : (
    <div className="community-avatar flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-teal-400 text-sm font-bold text-white">
      {(post.author.name || 'U').charAt(0).toUpperCase()}
    </div>
  );
}

function Comments({
  cohortId,
  post,
  token,
  lang,
  onError,
}: {
  cohortId: string;
  post: CommunityPost;
  token?: string;
  lang: string;
  onError: (message: string) => void;
}) {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      setComments(await listCohortCommunityComments(cohortId, post.id, token));
    } catch (error) {
      onError(getApiErrorMessage(error, lang === 'mn' ? 'mn' : 'en'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cohortId, post.id, token]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!body.trim() || !token) return;
    setSubmitting(true);
    try {
      const comment = await createCohortCommunityComment(cohortId, post.id, body.trim(), token);
      setComments((current) => [...current, comment]);
      setBody('');
    } catch (error) {
      onError(getApiErrorMessage(error, lang === 'mn' ? 'mn' : 'en'));
    } finally {
      setSubmitting(false);
    }
  };

  const moderate = async (commentId: string, action: 'hide' | 'publish' | 'delete') => {
    if (!token || !window.confirm(`${action} this comment?`)) return;
    try {
      const updated = await moderateCohortCommunityComment(cohortId, post.id, commentId, action, token);
      if (action === 'delete') {
        setComments((current) => current.filter((comment) => comment.id !== commentId));
      } else {
        setComments((current) => current.map((comment) => comment.id === commentId ? updated : comment));
      }
    } catch (error) {
      onError(getApiErrorMessage(error, lang === 'mn' ? 'mn' : 'en'));
    }
  };

  return (
    <div className="mt-6 border-t border-gray-100 pt-5 dark:border-white/10">
      {loading ? (
        <p className="text-sm text-gray-500">{lang === 'mn' ? 'Сэтгэгдэл уншиж байна...' : 'Loading comments...'}</p>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="community-comment px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{comment.author.name}</p>
                  <p className="mt-1 text-sm leading-6 text-gray-700 whitespace-pre-wrap dark:text-gray-300">{comment.body}</p>
                  <p className="mt-1 text-xs text-gray-400">{formatDate(comment.created_at, lang)}</p>
                </div>
                {comment.can_delete && (
                  <div className="flex gap-2 text-xs">
                    {comment.status === 'hidden' ? (
                      <button type="button" onClick={() => moderate(comment.id, 'publish')} className="community-action text-blue-600">Publish</button>
                    ) : (
                      <button type="button" onClick={() => moderate(comment.id, 'hide')} className="community-action text-amber-600">Hide</button>
                    )}
                    <button type="button" onClick={() => moderate(comment.id, 'delete')} className="community-action text-red-600">Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {post.can_comment ? (
        <form onSubmit={submit} className="mt-4 flex gap-2">
          <input
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={lang === 'mn' ? 'Сэтгэгдэл бичих...' : 'Write a comment...'}
            className="premium-input min-w-0 flex-1 px-4 py-2.5 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="premium-button premium-button-primary min-h-0 px-4 py-2 text-sm disabled:opacity-50"
          >
            {submitting ? '...' : lang === 'mn' ? 'Илгээх' : 'Post'}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          {lang === 'mn' ? 'Сэтгэгдэл бичих боломжгүй.' : 'Commenting is disabled.'}
        </p>
      )}
    </div>
  );
}

export default function CohortCommunity({
  cohortId,
  token,
  lang,
  enabled,
}: {
  cohortId: string;
  token?: string;
  lang: string;
  enabled: boolean;
}) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [imageId, setImageId] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [canPost, setCanPost] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!enabled || !token) return;
    setLoading(true);
    setError('');
    try {
      const data = await listCohortCommunityPosts(cohortId, token);
      setPosts(data.results);
      setCanPost(data.can_post);
      setIsExpired(data.cohort.is_expired);
    } catch (err) {
      setError(getApiErrorMessage(err, lang === 'mn' ? 'mn' : 'en'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cohortId, token, enabled]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || (!body.trim() && !title.trim() && !imageId && !documentId && !videoId && !videoFile)) return;
    setSubmitting(true);
    setUploadingVideo(!!videoFile);
    setError('');
    try {
      let uploadedVideoUid: string | undefined;
      if (videoFile) {
        const upload = await createStreamUploadURL(cohortId, videoFile, token);
        await uploadVideoToCloudflare(upload.upload_url, videoFile);
        uploadedVideoUid = upload.video_uid;
      }
      const post = await createCohortCommunityPost(cohortId, {
        title: title.trim(),
        body: body.trim(),
        image_id: imageId || undefined,
        document_id: documentId || undefined,
        video_id: videoId || undefined,
        video_uid: uploadedVideoUid,
      }, token);
      setPosts((current) => [post, ...current]);
      setBody('');
      setTitle('');
      setImageId('');
      setDocumentId('');
      setVideoId('');
      setVideoFile(null);
    } catch (err) {
      setError(getApiErrorMessage(err, lang === 'mn' ? 'mn' : 'en'));
    } finally {
      setUploadingVideo(false);
      setSubmitting(false);
    }
  };

  const moderate = async (postId: string, action: 'hide' | 'publish' | 'delete') => {
    if (!token || !window.confirm(`${action} this post?`)) return;
    try {
      const updated = await moderateCohortCommunityPost(cohortId, postId, action, token);
      if (action === 'delete') {
        setPosts((current) => current.filter((post) => post.id !== postId));
      } else {
        setPosts((current) => current.map((post) => post.id === postId ? updated : post));
      }
    } catch (err) {
      setError(getApiErrorMessage(err, lang === 'mn' ? 'mn' : 'en'));
    }
  };

  if (!enabled) {
    return (
      <section className="premium-card p-6 text-sm text-amber-700 dark:text-amber-300">
        {lang === 'mn' ? 'Ангид байгаа хичээлүүдийг харахын тулд элсэлт батлагдсан байх ёстой.' : 'Your enrollment must be approved to view the community.'}
      </section>
    );
  }

  return (
    <section className="community-feed space-y-5">
      {isExpired && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800 shadow-sm dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
          {lang === 'mn'
            ? 'Энэ cohort дууссан. Пост болон сэтгэгдэл бичих боломжгүй.'
            : 'This cohort has expired. Posting and commenting are disabled.'}
        </div>
      )}

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">{error}</div>}

      <form onSubmit={submit} className="community-composer p-5 md:p-6">
        <h2 className="text-base font-extrabold tracking-[-0.01em] text-gray-950 dark:text-white">{lang === 'mn' ? 'Community пост' : 'Community post'}</h2>
        <div className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={!canPost}
            placeholder={lang === 'mn' ? 'Гарчиг' : 'Title'}
            className="premium-input w-full px-4 py-3 text-sm outline-none disabled:opacity-60"
          />
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            disabled={!canPost}
            placeholder={lang === 'mn' ? 'Cohort community-дээ бичих...' : 'Share with your cohort community...'}
            rows={4}
            className="premium-input w-full resize-none px-4 py-3 text-sm leading-6 outline-none disabled:opacity-60"
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input value={imageId} onChange={(e) => setImageId(e.target.value)} disabled={!canPost} placeholder="Image media ID" className="premium-input px-3 py-2 text-xs disabled:opacity-60" />
            <input value={documentId} onChange={(e) => setDocumentId(e.target.value)} disabled={!canPost} placeholder="Document media ID" className="premium-input px-3 py-2 text-xs disabled:opacity-60" />
            <input value={videoId} onChange={(e) => setVideoId(e.target.value)} disabled={!canPost || !!videoFile} placeholder="Video media ID" className="premium-input px-3 py-2 text-xs disabled:opacity-60" />
          </div>
          <label className="block rounded-lg border border-dashed border-gray-300 bg-gray-50/70 px-4 py-4 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-white">{lang === 'mn' ? 'Видео хавсаргах' : 'Attach video'}</span>
            <input
              type="file"
              accept="video/*"
              disabled={!canPost || submitting || !!videoId}
              onChange={(event) => setVideoFile(event.target.files?.[0] || null)}
              className="mt-2 block w-full text-xs"
            />
            {videoFile && <span className="mt-2 block truncate">{videoFile.name}</span>}
          </label>
        </div>
        <button
          type="submit"
          disabled={!canPost || submitting}
          className="premium-button premium-button-primary mt-4 disabled:opacity-50"
        >
          {uploadingVideo
            ? (lang === 'mn' ? 'Видео байршуулж байна...' : 'Uploading video...')
            : submitting ? (lang === 'mn' ? 'Илгээж байна...' : 'Posting...') : (lang === 'mn' ? 'Нийтлэх' : 'Post')}
        </button>
      </form>

      {loading ? (
        <div className="premium-card p-6 text-sm text-gray-500">
          {lang === 'mn' ? 'Community уншиж байна...' : 'Loading community...'}
        </div>
      ) : posts.length === 0 ? (
        <div className="lms-empty-state text-sm">
          {lang === 'mn' ? 'Одоогоор пост алга.' : 'No posts yet.'}
        </div>
      ) : (
        posts.map((post) => (
          <article key={post.id} className="community-post p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <AuthorAvatar post={post} />
                <div>
                  <p className="font-bold text-gray-950 dark:text-white">{post.author.name}</p>
                  <p className="text-xs font-medium text-gray-400">{formatDate(post.created_at, lang)} · {post.post_type}</p>
                </div>
              </div>
              {post.can_delete && (
                <div className="flex gap-2 text-xs">
                  {post.status === 'hidden' ? (
                    <button type="button" onClick={() => moderate(post.id, 'publish')} className="community-action text-blue-600">Publish</button>
                  ) : (
                    <button type="button" onClick={() => moderate(post.id, 'hide')} className="community-action text-amber-600">Hide</button>
                  )}
                  <button type="button" onClick={() => moderate(post.id, 'delete')} className="community-action text-red-600">Delete</button>
                </div>
              )}
            </div>
            {post.title && <h3 className="mt-5 text-xl font-extrabold tracking-[-0.02em] text-gray-950 dark:text-white">{post.title}</h3>}
            {post.body && <p className="mt-2 whitespace-pre-wrap text-[0.95rem] leading-7 text-gray-700 dark:text-gray-300">{post.body}</p>}
            {post.media.map((item) => <MediaPreview key={`${item.kind}-${item.id}`} media={item} token={token} />)}
            <Comments cohortId={cohortId} post={post} token={token} lang={lang} onError={setError} />
          </article>
        ))
      )}
    </section>
  );
}
