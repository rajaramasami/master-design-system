import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { Icon, type IconSize } from '../../icons/Icon';

/* ------------------------------------------------------------ Progress bar */

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 0 to `max`. */
  value: number;
  max?: number;
  /** Names the bar, e.g. "Uploading results". Required: shown, or hidden with `hideLabel`. */
  label: ReactNode;
  hideLabel?: boolean;
  /** Shows the percentage next to the label. On by default. */
  showValue?: boolean;
  /** Figma Size: sm (progress/height/sm, 4) or md (8). */
  size?: 'sm' | 'md';
}

/**
 * Determinate progress for uploads, syncing and multi-step tasks (Figma "Progress Bar").
 * Track bg/muted, fill action/primary. Use Spinner when the duration is unknown.
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  { value, max = 100, label, hideLabel = false, showValue = true, size = 'md', className, ...rest },
  ref,
) {
  const labelId = useId();
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = Math.round((clamped / max) * 100);
  return (
    <div ref={ref} {...rest} className={cn('flex w-full flex-col gap-stack-xs', className)}>
      <div className={cn('flex items-baseline justify-between gap-inline-sm', hideLabel && !showValue && 'sr-only')}>
        <span id={labelId} className={cn('text-body-sm-strong text-text-primary', hideLabel && 'sr-only')}>{label}</span>
        {showValue && <span aria-hidden="true" className="text-caption tabular-nums text-text-secondary">{percent}%</span>}
      </div>
      <ProgressPrimitive.Root
        value={clamped}
        max={max}
        aria-labelledby={labelId}
        getValueLabel={() => `${percent}%`}
        className={cn('relative w-full overflow-hidden rounded-pill bg-bg-muted', size === 'sm' ? 'h-progress-height-sm' : 'h-progress-height-md')}
      >
        <ProgressPrimitive.Indicator
          className="h-full rounded-pill bg-action-primary-default transition-[width] duration-(--mds-motion-duration-normal) ease-standard"
          style={{ width: `${percent}%` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
});

/* ----------------------------------------------------------------- Spinner */

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Figma Size: sm, md, lg = size/icon/*. */
  size?: 'sm' | 'md' | 'lg';
  /**
   * What is loading, read by screen readers ("Loading results"). The spinner then sits in a
   * role="status" region. Pass `null` when visible text next to it already says so.
   */
  label?: string | null;
}

/**
 * Indeterminate loading for short waits, under about 10 s (Figma "Spinner"). icon/brand;
 * rotates every 0.8 s, and pulses instead when the person prefers reduced motion.
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner({ size = 'md', label = 'Loading', className, ...rest }, ref) {
  const icon = <Icon name="spinner" size={size as IconSize} className={cn('mds-spinner text-icon-brand', className)} />;
  if (label === null) return <span ref={ref} {...rest} className="inline-flex">{icon}</span>;
  return (
    <span ref={ref} role="status" {...rest} className="inline-flex">
      {icon}
      <span className="sr-only">{label}</span>
    </span>
  );
});

/* ---------------------------------------------------------------- Skeleton */

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Figma Shape: Text (a line), Circle (avatar/size/md by default), Rect (images and cards). */
  shape?: 'text' | 'circle' | 'rect';
}

/**
 * Placeholder shapes while content loads, matching the final layout to avoid jumps
 * (Figma "Skeleton"). bg/muted with a shimmer; static with reduced motion. Hidden from
 * assistive technology: set aria-busy="true" on the loading container instead.
 * Size it with classes, e.g. `className="w-[60%]"`.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton({ shape = 'text', className, ...rest }, ref) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      {...rest}
      className={cn(
        'mds-skeleton block bg-bg-muted',
        shape === 'text' && 'h-[0.75em] w-full rounded-control',
        shape === 'circle' && 'size-avatar-size-md shrink-0 rounded-pill',
        shape === 'rect' && 'h-[160px] w-full rounded-surface',
        className,
      )}
    />
  );
});

/** A List Row placeholder (Figma "Skeleton / List Row"). Stack several while a list loads. */
export function SkeletonListRow({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('flex items-center gap-inline-md px-inset-md py-inset-sm', className)}>
      <Skeleton shape="circle" />
      <span className="flex flex-1 flex-col gap-stack-sm">
        <Skeleton className="w-[55%]" />
        <Skeleton className="w-[80%]" />
      </span>
    </span>
  );
}
