"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Ачааллаж байна...</p>;

  if (session) {
    return (
      <div>
        <p>{session.user?.email}</p>
        <button onClick={() => signOut()}>Гарах</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("google")}>Google-р нэвтрэх</button>
  );
}
