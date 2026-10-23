import Spinner from "@/components/ui/Spinner";

// Shown automatically while a route segment is loading.
export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
