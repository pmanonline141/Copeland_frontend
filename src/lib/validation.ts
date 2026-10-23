/** Client-side checks for forms. The API is still the authority; these just give instant feedback. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateEmail = (v: string): string | null => (!v.trim() ? "Enter your email address." : EMAIL_RE.test(v.trim()) ? null : "Enter a valid email address.");
export const validateName = (v: string): string | null => (v.trim().length < 2 ? "Enter your full name." : v.trim().length > 100 ? "That name is too long." : null);

export function passwordChecks(pw: string) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /\d/.test(pw),
  };
}
export function validatePassword(pw: string): string | null {
  if (!pw) return "Enter a password.";
  if (pw.length > 128) return "Use 128 characters or fewer.";
  const c = passwordChecks(pw);
  return c.length && c.upper && c.lower && c.number ? null : "Use at least 8 characters with upper and lower case letters and a number.";
}
/** 0 (empty) to 4 (strong). For the strength bar only. */
export function passwordScore(pw: string): number {
  if (!pw) return 0;
  const c = passwordChecks(pw);
  let s = [c.length, c.upper && c.lower, c.number].filter(Boolean).length;
  if (pw.length >= 12 && /[^A-Za-z0-9]/.test(pw)) s += 1;
  return Math.min(4, Math.max(1, s));
}

/** Only allow same-site relative paths for ?next= (blocks open redirects like //evil.com). */
export function safeNext(raw: string | null | undefined): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return null;
  return raw;
}
