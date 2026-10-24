"use client";

import { createContext, useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { readStorage, useStoredValue, writeStorage } from "@/lib/storage";
import { Course} from "@/types/course";

interface LibraryState {
  cart: Course[];
  purchased: Course[];
  wishlist: Course[];
}

const emptyState: LibraryState = { cart: [], purchased: [], wishlist: [] };
function isLibrary(value: unknown): value is LibraryState {
  if (!value || typeof value !== "object") return false;
  const state = value as LibraryState;
  return [state.cart, state.purchased, state.wishlist].every(
    (items) =>
      Array.isArray(items) &&
      items.every(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.title === "string" &&
          typeof item.teacherName === "string" &&
          typeof item.courseCoverUrl === "string" &&
          typeof item.price === "number" &&
          Number.isFinite(item.price) &&
          item.price >= 0,
      ),
  );
}

function latest(key: string): LibraryState {
  try {
    const value: unknown = JSON.parse(readStorage(key) ?? "null");
    return isLibrary(value) ? value : emptyState;
  } catch {
    return emptyState;
  }
}

interface CartValue extends LibraryState {
  total: number;
  checkingOut: boolean;
  add: (course: Course) => void;
  remove: (id: string) => void;
  toggleWishlist: (course: Course) => void;
  checkout: () => Promise<boolean>;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const key = `course-library:${session?.userId ?? "guest"}`;
  const state = useStoredValue(key, emptyState, isLibrary);
  const [checkingOut, setCheckingOut] = useState(false);
  const lock = useRef(false);

  function update(transform: (state: LibraryState) => LibraryState) {
    if (lock.current) return;
    try {
      writeStorage(key, transform(latest(key)));
    } catch {
      toast.error(
        "ذخیره‌سازی مرورگر در دسترس نیست. تنظیمات مرورگر را بررسی کنید.",
      );
    }
  }

  function add(course: Course) {
    update((current) => {
      if (current.purchased.some((item) => item.id === course.id)) {
        toast.info("این دوره در دوره‌های شما قرار دارد.");
        return current;
      }
      if (current.cart.some((item) => item.id === course.id)) {
        toast.info("این دوره قبلاً به سبد اضافه شده است.");
        return current;
      }
      return { ...current, cart: [...current.cart, course] };
    });
  }

  async function checkout() {
    const ordered = latest(key).cart;
    if (lock.current || !ordered.length) return false;
    lock.current = true;
    setCheckingOut(true);
    try {
      // A local simulation only: never contacts a payment gateway or charges money.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const current = latest(key);
      const purchased = [
        ...new Map(
          [...current.purchased, ...ordered].map((course) => [
            course.id,
            course,
          ]),
        ).values(),
      ];
      // One write keeps the purchase and cleared cart atomic in this browser.
      // Preserve items added in another tab after this checkout began.
      writeStorage(key, {
        ...current,
        purchased,
        cart: current.cart.filter(
          (course) => !ordered.some((item) => item.id === course.id),
        ),
      });
      toast.success(
        "خرید آزمایشی موفق بود. دوره‌ها به کتابخانه شما اضافه شدند.",
      );
      return true;
    } catch {
      toast.error("خرید ذخیره نشد. فضای ذخیره‌سازی مرورگر را بررسی کنید.");
      return false;
    } finally {
      lock.current = false;
      setCheckingOut(false);
    }
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        checkingOut,
        checkout,
        add,
        total: state.cart.reduce((sum, course) => sum + course.price, 0),
        remove: (id) =>
          update((current) => ({
            ...current,
            cart: current.cart.filter((course) => course.id !== id),
          })),
        toggleWishlist: (course) =>
          update((current) => ({
            ...current,
            wishlist: current.wishlist.some((item) => item.id === course.id)
              ? current.wishlist.filter((item) => item.id !== course.id)
              : [...current.wishlist, course],
          })),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartProvider is required");
  return context;
}
