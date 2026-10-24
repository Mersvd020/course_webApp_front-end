"use client";

import { createContext, useContext } from "react";
import {
  readStorage,
  useHydrated,
  useStoredValue,
  writeStorage,
} from "@/lib/storage";
import type { Session } from "@/types/auth";

function isSession(value: unknown): value is Session | null {
  if (value === null) return true;
  if (!value || typeof value !== "object") return false;
  const session = value as Session;
  return (
    typeof session.token === "string" &&
    typeof session.userId === "string" &&
    typeof session.email === "string"
  );
}

const AuthContext = createContext<{
  session: Session | null;
  ready: boolean;
  signIn: (session: Session) => void;
  signOut: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stored = useStoredValue<Session | null>(
    "course-session",
    null,
    isSession,
  );
  const ready = useHydrated();
  const session =
    ready && stored && readStorage("token") === stored.token ? stored : null;

  function signIn(next: Session) {
    localStorage.setItem("token", next.token);
    writeStorage("course-session", next);
  }

  function signOut() {
    localStorage.removeItem("token");
    writeStorage("course-session", null);
  }

  return (
    <AuthContext.Provider value={{ session, ready, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider is required");
  return context;
}
