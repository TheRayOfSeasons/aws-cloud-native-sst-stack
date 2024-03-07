export interface User {
  email: string
}

export interface LoginResponse extends User {
  token: string
}

export interface Credentials {
  email: string
  password: string
}

export interface ResendCodePayload {
  email: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ConfirmPayload {
  email: string
  code: string
}

export interface ConfirmForgotPasswordPayload {
  email: string
  code: string
  newPassword: string
}
