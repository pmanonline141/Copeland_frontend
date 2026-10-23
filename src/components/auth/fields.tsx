"use client";
import { useId, useState } from "react";
import { AlertIcon, CheckIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { btn } from "@/components/ui/button";
import { passwordChecks, passwordScore } from "@/lib/validation";
import { cn } from "@/utils/cn";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  error?: string | null;
  hint?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
};

export function TextField({ label, error, hint, icon, trailing, id, ...props }: InputProps) {
  const uid = useId();
  const fid = id ?? uid;
  const msgId = `${fid}-msg`;
  return (
    <div>
      <label htmlFor={fid} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">{icon}</span>}
        <input
          id={fid}
          aria-invalid={!!error}
          aria-describedby={error || hint ? msgId : undefined}
          className={cn(
            "min-h-[3rem] w-full rounded-md border bg-white px-3.5 text-base text-ink placeholder:text-ink-faint transition-colors duration-fast",
            "focus:border-gold disabled:bg-mist disabled:text-ink-faint",
            !!icon && "pl-11",
            !!trailing && "pr-12",
            error ? "border-danger" : "border-line hover:border-ink/30",
          )}
          {...props}
        />
        {trailing && <span className="absolute right-1 top-1/2 -translate-y-1/2">{trailing}</span>}
      </div>
      {error ? (
        <p id={msgId} role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm text-danger"><AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>
      ) : hint ? (
        <p id={msgId} className="mt-1.5 text-sm text-ink-faint">{hint}</p>
      ) : null}
    </div>
  );
}

const LEVELS = ["", "Weak", "Fair", "Good", "Strong"];
const BAR = ["", "bg-danger", "bg-warning", "bg-gold", "bg-success"];

export function PasswordField({ showStrength, ...props }: InputProps & { showStrength?: boolean }) {
  const [show, setShow] = useState(false);
  const value = String(props.value ?? "");
  const score = passwordScore(value);
  const checks = passwordChecks(value);
  return (
    <div>
      <TextField
        {...props}
        type={show ? "text" : "password"}
        trailing={
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}
            className="flex min-h-touch min-w-touch items-center justify-center rounded-md text-ink-faint hover:text-ink">
            {show ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        }
      />
      {showStrength && value && (
        <div className="mt-3" aria-live="polite">
          <div className="flex items-center gap-3">
            <div className="grid flex-1 grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((i) => <span key={i} className={cn("h-1.5 rounded-full transition-colors duration-base", i <= score ? BAR[score] : "bg-line")} />)}
            </div>
            <span className="w-12 text-right text-xs font-medium text-ink-soft">{LEVELS[score]}</span>
          </div>
          <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-ink-soft">
            {([["length", "8+ characters"], ["upper", "Uppercase letter"], ["lower", "Lowercase letter"], ["number", "A number"]] as const).map(([k, t]) => (
              <li key={k} className={cn("flex items-center gap-1.5", checks[k] && "text-success")}>
                <CheckIcon className={cn("h-3.5 w-3.5", !checks[k] && "opacity-30")} strokeWidth={2.2} /> {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SubmitButton({ loading, children, loadingText = "Please wait" }: { loading?: boolean; children: React.ReactNode; loadingText?: string }) {
  return (
    <button type="submit" disabled={loading} aria-busy={loading} className={btn("primary", "lg", "w-full")}>
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />}
      {loading ? loadingText : children}
    </button>
  );
}

const TONES = {
  error: "border-danger/30 bg-danger-soft text-danger",
  success: "border-success/30 bg-success-soft text-success",
  warning: "border-warning/30 bg-warning-soft text-warning",
  info: "border-info/30 bg-info-soft text-info",
} as const;

export function Notice({ tone, children }: { tone: keyof typeof TONES; children: React.ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("flex items-start gap-2.5 rounded-md border p-3.5 text-sm animate-fade-in", TONES[tone])}>
      {tone === "success" ? <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} /> : <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
