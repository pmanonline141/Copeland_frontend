 "use client";
import { useState } from "react";
import { useAlert } from "@/hooks/useAlert";
import { validateEmail } from "@/lib/validation";
import { CheckIcon, SendIcon, SparklesIcon } from "@/components/ui/icons";
import { btn } from "@/components/ui/button";
import { cn } from "@/utils/cn";

/**
 * Email capture band. 
 * The design is fully visible, but it requires NEXT_PUBLIC_NEWSLETTER_ENDPOINT 
 * in your .env.local to successfully submit to an API (like Formspree or Mailchimp).
 * If the endpoint is missing, it will simulate a success for UI testing purposes.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

export default function Newsletter() {
  const alert = useAlert();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problem = validateEmail(email);
    setError(problem);
    if (problem) {
      alert.error(problem, { title: "Check your email" });
      return;
    }

    setStatus("sending");

    // If no endpoint is configured, simulate success for UI testing
    if (!ENDPOINT) {
      setTimeout(() => {
        setStatus("done");
        setEmail("");
        alert.success("You're on the list (Simulated).", { title: "Subscribed" });
      }, 1000);
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      if (!res.ok) throw new Error(`Subscribe failed (${res.status})`);
      
      setStatus("done");
      setEmail("");
      alert.success("You're on the list. We'll send new drops and supplier news.", { title: "Subscribed" });
    } catch {
      setStatus("idle");
      alert.error("We could not subscribe you just now. Please try again in a moment.", { title: "Something went wrong" });
    }
  }

  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-ivory p-8 shadow-card sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="eyebrow">Stay in the loop</p>
              <h2 className="mt-4 text-balance font-serif text-3xl font-semibold sm:text-4xl">
                New drops, label releases and supplier openings
              </h2>
              <p className="mt-4 max-w-lg text-base text-ink-soft">
                Occasional emails only — new Copeland label releases, freshly moderated supplier listings, and updates on
                bulk programmes. Unsubscribe any time.
              </p>
            </div>

            {status === "done" ? (
              <div role="status" className="flex items-center gap-3 rounded-xl border border-gold/40 bg-white p-5 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                  <CheckIcon className="h-4 w-4" strokeWidth={3} />
                </span>
                <p className="text-sm font-medium text-ink">You&apos;re subscribed. Thank you.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="w-full">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "newsletter-error" : undefined}
                      placeholder="you@company.com"
                      className={cn(
                        "min-h-touch w-full rounded-md border bg-white px-4 text-sm placeholder:text-ink-faint transition-colors duration-fast focus:border-gold",
                        error ? "border-danger" : "border-line",
                      )}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={status === "sending"}
                    className={btn("primary", "lg", "shrink-0 disabled:cursor-not-allowed disabled:opacity-60")}
                  >
                    {status === "sending" ? "Subscribing…" : "Subscribe"} <SendIcon className="h-4 w-4" />
                  </button>
                </div>

                {error ? (
                  <p id="newsletter-error" className="mt-2 text-xs text-danger">{error}</p>
                ) : (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-faint">
                    <SparklesIcon className="h-3.5 w-3.5 text-gold-600" /> No spam. Just the good stuff.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}