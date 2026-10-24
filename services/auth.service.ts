import { api } from "@/lib/api";

import type {
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  Session,
} from "@/types/auth";
import { record, text, unwrap } from "./response";

function deviceId() {
  let id = localStorage.getItem("device-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device-id", id);
  }
  return id;
}

export async function login(input: LoginInput): Promise<Session> {
  const response = await api.post("/user/login", input, {
    headers: { "x-device-id": deviceId() },
    timeout: 10000,
  });
  const data = record(unwrap(response.data));
  const token = text(
    data.accessToken ?? data.token ?? record(data.tokens).accessToken,
  );
  if (!token) throw new Error("پاسخ ورود فاقد توکن معتبر است.");
  return {
    token,
    email: input.email,
    userId: input.email.trim().toLowerCase(),
  };
}

export async function register(input: RegisterInput) {
  await api.post("/user/register", input, { timeout: 10000 });
}

export async function forgotPassword(email: string) {
  const response = await api.post(
    "/user/step1_forgetPassword",
    { email },
    { timeout: 10000 },
  );
  const data = record(unwrap(response.data));
  return {
    resetToken:
      text(data.resetToken ?? data.accessToken ?? data.token) || undefined,
  };
}

export async function resetPassword(
  input: ResetPasswordInput,
  resetToken?: string,
) {
  await api.post("/user/step2_resetPassword", input, {
    timeout: 10000,
    // Use a recovery token if the backend issued one in step one.
    ...(resetToken
      ? { headers: { Authorization: `Bearer ${resetToken}` } }
      : {}),
  });
}

export function authError(error: unknown): string {
  const status = record(record(error).response).status;
  if (status === 401 || status === 403)
    return "ایمیل، رمز عبور یا کد تأیید صحیح نیست.";
  if (status === 409) return "این ایمیل یا شماره تلفن قبلاً ثبت شده است.";
  if (status === 429) return "تعداد درخواست‌ها زیاد است. کمی بعد تلاش کنید.";
  return "ارتباط با سامانه برقرار نشد یا اطلاعات پذیرفته نشد. دوباره تلاش کنید.";
}
