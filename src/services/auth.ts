export const AUTH_PROVIDERS = ["google", "github", "email-otp"] as const;

export type AuthProvider = (typeof AUTH_PROVIDERS)[number];
