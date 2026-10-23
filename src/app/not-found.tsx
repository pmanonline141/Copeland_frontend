import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-sm opacity-70">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="rounded-md border px-4 py-2 text-sm">
        Back to home
      </Link>
    </div>
  );
}
