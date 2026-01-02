"use client";

import React, { createContext, useContext, useState } from "react";
import { NavBarSkeleton, ScholarshipListSkeleton } from "./Skeleton";

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (v: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}
      {isLoading && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(255,255,255,0.9)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
            <NavBarSkeleton />
            <div style={{ marginTop: 20 }}>
              <ScholarshipListSkeleton />
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}

export default LoadingProvider;
