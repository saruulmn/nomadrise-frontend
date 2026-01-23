"use client";

import { useSession, signOut } from "next-auth/react";
import { Button, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export default function UserProfile() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const lang = (pathname.startsWith("/en") ? "en" : "mn") as Locale;
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  if (!dictionary) return null;

  if (!session?.user) {
    // Login button is hidden
    return null;
  }

  const items: MenuProps["items"] = [
    {
      key: "dashboard",
      label: <a href="/dashboard">Dashboard</a>,
      icon: <UserOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: dictionary.nav.signOut || "Sign Out",
      icon: <LogoutOutlined />,
      onClick: () => signOut({ callbackUrl: "/" }),
      danger: true,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full"
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
