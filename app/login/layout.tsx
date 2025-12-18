import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - NomadRise",
  description: "Sign in to NomadRise",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
