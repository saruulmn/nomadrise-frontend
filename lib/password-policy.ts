import type { Locale } from "@/i18n/config";

export type PasswordRuleKey = "length" | "uppercase" | "lowercase" | "number" | "special";

export interface PasswordRule {
  key: PasswordRuleKey;
  label: string;
  isValid: boolean;
}

const LABELS: Record<Locale, Record<PasswordRuleKey, string>> = {
  en: {
    length: "At least 8 characters",
    uppercase: "At least one uppercase letter",
    lowercase: "At least one lowercase letter",
    number: "At least one number",
    special: "At least one special character (e.g., $, @, #, %)",
  },
  mn: {
    length: "Хамгийн багадаа 8 тэмдэгттэй байх",
    uppercase: "Дор хаяж нэг том үсэг агуулсан байх",
    lowercase: "Дор хаяж нэг жижиг үсэг агуулсан байх",
    number: "Дор хаяж нэг тоо агуулсан байх",
    special: "Дор хаяж нэг тусгай тэмдэгт агуулсан байх (жишээ: $, @, #, %)",
  },
};

export const PASSWORD_POLICY_ERROR: Record<Locale, string> = {
  en: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
  mn: "Нууц үг хамгийн багадаа 8 тэмдэгттэй, том үсэг, жижиг үсэг, тоо болон тусгай тэмдэгт агуулсан байх ёстой.",
};

export function getPasswordRules(password: string, lang: Locale): PasswordRule[] {
  const labels = LABELS[lang];

  return [
    { key: "length", label: labels.length, isValid: password.length >= 8 },
    { key: "uppercase", label: labels.uppercase, isValid: /[A-Z]/.test(password) },
    { key: "lowercase", label: labels.lowercase, isValid: /[a-z]/.test(password) },
    { key: "number", label: labels.number, isValid: /\d/.test(password) },
    { key: "special", label: labels.special, isValid: /[^A-Za-z0-9]/.test(password) },
  ];
}

export function isPasswordStrong(password: string): boolean {
  return getPasswordRules(password, "en").every((rule) => rule.isValid);
}
