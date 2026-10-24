export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  phoneNumber: string;
}

export interface ResetPasswordInput extends LoginInput {
  otpCode: string;
}

export interface Session {
  token: string;
  email: string;
  userId: string;
}
