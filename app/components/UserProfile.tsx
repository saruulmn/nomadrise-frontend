"use client";

import { useSession, signOut } from "next-auth/react";
import { Dropdown } from "antd";
import { UserIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import type { MenuProps } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  PROFILE_AVATAR_UPDATED_EVENT,
  type ProfileAvatarUpdatedEvent,
} from "@/lib/profile-avatar";

export default function UserProfile() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const lang = (pathname.startsWith("/en") ? "en" : "mn") as Locale;
  const [dictionary, setDictionary] = useState<{ nav: Record<string, string | undefined> } | null>(null);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    if (!session?._at) return;

    const controller = new AbortController();

    fetch(`${apiBase}/auth/me/profile/`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${session._at}` },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json() as Promise<{ avatar_url?: string | null }>;
      })
      .then((profile) => {
        if (profile) {
          setProfileAvatarUrl(profile.avatar_url || null);
        }
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          setProfileAvatarUrl(null);
        }
      });

    return () => controller.abort();
  }, [apiBase, session?._at]);

  useEffect(() => {
    const handleAvatarUpdated = (event: Event) => {
      const { detail } = event as ProfileAvatarUpdatedEvent;
      setProfileAvatarUrl(detail.avatarUrl || null);
    };

    window.addEventListener(PROFILE_AVATAR_UPDATED_EVENT, handleAvatarUpdated);
    return () => {
      window.removeEventListener(PROFILE_AVATAR_UPDATED_EVENT, handleAvatarUpdated);
    };
  }, []);

  if (!dictionary) return null;

  if (!session?.user) {
    // Login button is hidden
    return null;
  }

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: <a href={`/${lang}/profile`}>{dictionary.nav.profile || "Profile"}</a>,
      icon: <UserIcon className="w-4 h-4" />,
    },
    {
      key: "settings",
      label: <a href={`/${lang}/settings`}>{dictionary.nav.settings || "Settings"}</a>,
      icon: <Cog6ToothIcon className="w-4 h-4" />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: dictionary.nav.signOut || "Sign Out",
      icon: <ArrowRightOnRectangleIcon className="w-4 h-4" />,
      onClick: () => signOut({ callbackUrl: `/${lang}` }),
      danger: true,
    },
  ];

  const avatarSrc = profileAvatarUrl;

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {session.user.name?.charAt(0) || "U"}
          </div>
        )}
        <span className="text-sm font-medium hidden sm:inline">
          {session.user.name}
        </span>
      </div>
    </Dropdown>
  );
}
