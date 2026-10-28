import { cn } from "@/utils/cn";

export interface Column<T> {
  /** Stable key for React; also used as the column's identity. */
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  className?: string;
  align?: "left" | "right";
}

/**
 * Minimal responsive table: horizontal scroll on small screens, consistent cell styling.
 * Pair it with <QueryState> for loading / error / empty handling.
 */
export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  caption,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => string;
  caption?: string;
  className?: string;
}) {
  return (
    <div className={cn("-mx-5 overflow-x-auto sm:mx-0", className)}>
      <table className="w-full min-w-[42rem] border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-line">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  "whitespace-nowrap px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint",
                  c.align === "right" ? "text-right" : "text-left",
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={getRowKey(row, i)} className="border-b border-line/70 transition-colors duration-fast last:border-0 hover:bg-mist/60">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn("px-5 py-3.5 align-middle text-ink-soft", c.align === "right" && "text-right", c.className)}
                >
                  {c.cell(row, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
