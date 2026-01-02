'use client';

import NavBar from '../components/NavBar';

export default function RootPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
