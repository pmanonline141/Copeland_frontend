"use client";

// Catches unexpected errors in any page so the user never sees a blank screen.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm opacity-70">{process.env.NODE_ENV !== "production" ? error.message : "Please try again."}</p>
      <button type="button" onClick={reset} className="rounded-md border px-4 py-2 text-sm">
        Try again
      </button>
    </div>
  );
}
