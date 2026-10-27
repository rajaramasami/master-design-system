import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from '../IconButton/IconButton';

/** Page numbers to show: first, last, and one either side of the current page; null is a gap. */
export function pageRange(page: number, pageCount: number): (number | null)[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const keep = new Set([1, pageCount, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pageCount));
  // Close a gap of one page instead of showing "…" for it.
  if (keep.has(3) || page <= 3) keep.add(2).add(3);
  if (keep.has(pageCount - 2) || page >= pageCount - 2) keep.add(pageCount - 1).add(pageCount - 2);
  const sorted = [...keep].sort((a, b) => a - b);
  const out: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1]! > 1) out.push(null);
    out.push(p);
  });
  return out;
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page, starting at 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /**
   * Figma "Show Summary". Pass the total and page size to show "Showing 11–20 of 96 results",
   * or any node. Omit to hide it.
   */
  summary?: { total: number; pageSize: number; noun?: string } | ReactNode;
}

const itemClass = cn(
  'inline-flex h-control-sm min-w-control-sm shrink-0 cursor-pointer items-center justify-center rounded-control border border-transparent px-inline-xs text-label-md tabular-nums text-text-primary outline-none',
  'transition-[background-color,border-color,box-shadow] duration-(--mds-motion-duration-fast) ease-standard',
  'hovered:bg-action-ghost-hover pressed:bg-action-ghost-pressed focus-visible:shadow-focus-ring-brand',
  'aria-[current=page]:border-border-brand aria-[current=page]:bg-action-primary-subtle aria-[current=page]:text-text-brand',
);

/**
 * Moves through long result lists (Figma "Pagination" and "Page Item", 14 Navigation).
 * Previous and next disable at the ends. On phones, prefer "Load more" with a visible count.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, pageCount, onPageChange, summary, className, 'aria-label': ariaLabel = 'Pagination', ...rest },
  ref,
) {
  const go = (p: number) => p !== page && p >= 1 && p <= pageCount && onPageChange(p);
  let summaryNode: ReactNode = null;
  if (summary && typeof summary === 'object' && 'total' in summary) {
    const from = summary.total === 0 ? 0 : (page - 1) * summary.pageSize + 1;
    const to = Math.min(page * summary.pageSize, summary.total);
    summaryNode = `Showing ${from}–${to} of ${summary.total} ${summary.noun ?? 'results'}`;
  } else summaryNode = summary as ReactNode;

  return (
    <nav ref={ref} aria-label={ariaLabel} {...rest} className={cn('flex flex-wrap items-center justify-between gap-x-inline-lg gap-y-stack-sm', className)}>
      {summaryNode != null && summaryNode !== false && <p className="m-0 text-body-sm text-text-secondary">{summaryNode}</p>}
      <ul className="m-0 ml-auto flex list-none items-center gap-inline-xs p-0">
        <li className="flex">
          <IconButton variant="ghost" size="sm" icon="chevron-left" label="Previous page" disabled={page <= 1} onClick={() => go(page - 1)} />
        </li>
        {pageRange(page, pageCount).map((p, i) =>
          p === null ? (
            <li key={`gap-${i}`} aria-hidden="true" className="inline-flex h-control-sm min-w-control-sm items-center justify-center text-label-md text-text-secondary">
              …
            </li>
          ) : (
            <li key={p} className="flex">
              <button type="button" className={itemClass} aria-label={`Page ${p}`} aria-current={p === page ? 'page' : undefined} onClick={() => go(p)}>
                {p}
              </button>
            </li>
          ),
        )}
        <li className="flex">
          <IconButton variant="ghost" size="sm" icon="chevron-right" label="Next page" disabled={page >= pageCount} onClick={() => go(page + 1)} />
        </li>
      </ul>
    </nav>
  );
});
