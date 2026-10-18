export type AuthFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialAuthState: AuthFormState = { success: false, message: '' };
