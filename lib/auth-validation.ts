import { z } from "zod";

export type AuthMode =
  "login" | "register" | "forget-password" | "reset-password";

export function schemaFor(mode: AuthMode) {
  return z
    .object({
      email: z.string().trim().email("یک ایمیل معتبر وارد کنید."),
      password:
        mode === "forget-password"
          ? z.string()
          : z
              .string()
              .min(
                mode === "login" ? 1 : 8,
                mode === "login"
                  ? "رمز عبور را وارد کنید."
                  : "رمز عبور باید حداقل ۸ کاراکتر باشد.",
              ),
      phoneNumber:
        mode === "register"
          ? z
              .string()
              .regex(/^09\d{9}$/, "شماره موبایل ۱۱ رقمی با 09 وارد کنید.")
          : z.string(),
      confirmPassword: z.string(),
      otpCode:
        mode === "reset-password"
          ? z.string().regex(/^\d{6}$/, "کد تأیید ۶ رقمی را وارد کنید.")
          : z.string(),
    })
    .refine(
      (values) =>
        !["register", "reset-password"].includes(mode) ||
        values.password === values.confirmPassword,
      { message: "تکرار رمز عبور مطابقت ندارد.", path: ["confirmPassword"] },
    );
}
