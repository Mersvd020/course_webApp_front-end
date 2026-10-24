"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const changeEvent = "course-storage-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changeEvent, callback);
  };
}

export function readStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(changeEvent));
}

// The server snapshot is empty so persisted state never causes hydration mismatches.
export function useStoredValue<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
): T {
  const snapshot = useSyncExternalStore(
    subscribe,
    useCallback(() => readStorage(key), [key]),
    () => null,
  );
  return useMemo(() => {
    try {
      const value: unknown = snapshot ? JSON.parse(snapshot) : null;
      return validate(value) ? value : fallback;
    } catch {
      return fallback;
    }
  }, [snapshot, fallback, validate]);
}

export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
