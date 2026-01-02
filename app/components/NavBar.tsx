"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Dropdown, Menu, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import UserProfile from "./UserProfile";
import ThemeToggle from "./ThemeToggle";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

interface NavBarProps {
  dictionary?: any;
}

export default function NavBar({ dictionary: propDictionary }: NavBarProps = {}) {
  const pathname = usePathname();
  const lang = (pathname.startsWith("/en") ? "en" : "mn") as Locale;
  const [dictionary, setDictionary] = useState<any>(propDictionary);
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!propDictionary) {
      getDictionary(lang).then(setDictionary);
    } else {
      setDictionary(propDictionary);
    }
  }, [lang, propDictionary]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  if (!dictionary) return null;

  const items = [
    { key: "master", label: <Link href={`/${lang}/scholarships?category=postgraduate`}>{dictionary.nav.master}</Link> },
    { key: "phd", label: <Link href={`/${lang}/scholarships?category=doctorate`}>{dictionary.nav.phd}</Link> },
    { key: "exchange", label: <Link href={`/${lang}/scholarships?category=exchange`}>{dictionary.nav.exchange}</Link> },
    { key: "internship", label: <Link href={`/${lang}/scholarships?category=internship`}>{dictionary.nav.internship}</Link> },
  ];

  const mobileMenuItems = [
    {
      key: "programs",
      label: dictionary.nav.programs,
      children: [
        { key: "m1", label: <Link href={`/${lang}/scholarships?category=postgraduate`}>{dictionary.nav.master}</Link> },
        { key: "m2", label: <Link href={`/${lang}/scholarships?category=doctorate`}>{dictionary.nav.phd}</Link> },
        { key: "m3", label: <Link href={`/${lang}/scholarships?category=exchange`}>{dictionary.nav.exchange}</Link> },
        { key: "m4", label: <Link href={`/${lang}/scholarships?category=internship`}>{dictionary.nav.internship}</Link> },
      ],
    },
    { key: "sponsor", label: <Link href={`/${lang}/sponsor`}>{dictionary.nav.sponsor}</Link> },
    { key: "events", label: <Link href={`/${lang}/events`}>{dictionary.nav.events}</Link> },
    { key: "about", label: <Link href={`/${lang}#team`}>{dictionary.nav.ourTeam}</Link> },
    { key: "signin", label: <Link href={`/${lang}/signin`}>{dictionary.nav.signIn}</Link> },
  ];

  return (
    <header className="site-header overlay">
      <div className="header-inner">
        <div className="logo" style={{ marginRight: 8 }}>
          <Link href={`/${lang}`}>nomadrise.mn</Link>
        </div>

        <nav className="nav-menu" aria-label="Main navigation">
          <Link href={`/${lang}/sponsor`} className={isActive(`/${lang}/sponsor`) ? "nav-active" : undefined}>
            {dictionary.nav.sponsor}
          </Link>

          <Dropdown
            menu={{ items }}
            trigger={['hover']}
            placement="bottomLeft"
            open={open}
            onOpenChange={(next) => setOpen(next)}
          >
            <button
              className={`dropdown-toggle ${pathname.includes("/programs") ? "nav-active" : ""}`}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              aria-haspopup="true"
              aria-expanded={open}
            >
              {dictionary.nav.programs}
            </button>
          </Dropdown>

          <Link href={`/${lang}/events`} className={isActive(`/${lang}/events`) ? "nav-active" : undefined}>
            {dictionary.nav.events}
          </Link>
          
          <Link href={`/${lang}#team`}>
            {dictionary.nav.ourTeam}
          </Link>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <LanguageSwitcher />
          <UserProfile />
        </div>

        <button className="mobile-toggle" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
          <MenuOutlined />
        </button>
      </div>

      <Drawer
        title={<Link href={`/${lang}`}>nomadrise.mn</Link>}
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          items={mobileMenuItems}
          selectable={false}
          onClick={() => setDrawerOpen(false)}
          style={{ borderInlineEnd: 0 }}
        />
      </Drawer>
    </header>
  );
}
