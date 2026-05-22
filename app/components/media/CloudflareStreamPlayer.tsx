'use client';

import { useEffect, useState } from 'react';
import { Stream } from '@cloudflare/stream-react';
import { getStreamPlaybackToken } from '@/lib/api/cohortCommunity';

type Props = {
  videoUid?: string;
  token?: string;
  title?: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Video playback is unavailable.';
}

export default function CloudflareStreamPlayer({ videoUid, token, title }: Props) {
  const [playbackToken, setPlaybackToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!videoUid || !token) return;
      setLoading(true);
      setError('');
      try {
        const data = await getStreamPlaybackToken(videoUid, token);
        if (!cancelled) setPlaybackToken(data.token);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [videoUid, token]);

  if (!videoUid) return null;

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-gray-100 bg-black">
      {loading ? (
        <div className="flex aspect-video items-center justify-center text-sm text-white/80">Loading video...</div>
      ) : error ? (
        <div className="flex aspect-video items-center justify-center px-4 text-center text-sm text-red-100">{error}</div>
      ) : playbackToken ? (
        <Stream controls src={playbackToken} title={title || 'Community video'} />
      ) : (
        <div className="flex aspect-video items-center justify-center text-sm text-white/80">Video is preparing...</div>
      )}
    </div>
  );
}
