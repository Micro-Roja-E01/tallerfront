export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  rut: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phoneNumber: string;
  gender: string;
}

export interface VerifyEmailRequest {
  email: string;
  verificationCode: string;
}
