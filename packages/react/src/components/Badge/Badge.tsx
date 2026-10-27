import { forwardRef, type HTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const TONE_ICON: Partial<Record<BadgeTone, IconName>> = { success: 'success', warning: 'warning', danger: 'alert', info: 'info' };

/* Mirrors the Figma set "Badge" (12 Data display): Tone × Size sm, md. */
const badgeVariants = cva('inline-flex shrink-0 items-center gap-inline-xs whitespace-nowrap rounded-pill', {
  variants: {
    tone: {
      neutral: 'bg-bg-muted text-text-secondary',
      brand: 'bg-action-primary-subtle text-text-brand',
      success: 'bg-status-success-bg text-text-success',
      warning: 'bg-status-warning-bg text-text-warning',
      danger: 'bg-status-danger-bg text-text-danger',
      info: 'bg-status-info-bg text-text-info',
    },
    size: {
      sm: 'h-badge-height-sm px-inline-xs text-label-sm',
      md: 'h-badge-height-md px-inline-sm text-label-md',
    },
  },
  defaultVariants: { tone: 'neutral', size: 'md' },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** md for status that matters ("Overdue"); sm (12 px text) only for counts and non-essential labels. */
  size?: 'sm' | 'md';
  /**
   * Figma "Show Icon". `true` uses the tone's icon (Success, Warning, Danger, Info), so status
   * isn't shown by colour alone. Pass an icon name to choose one, e.g. for Neutral or Brand.
   */
  icon?: boolean | IconName;
}

/**
 * A non-interactive status or count label. Not focusable. For a count, put the
 * context in the text or in `aria-label` ("3 overdue tasks", not just "3").
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ tone = 'neutral', size = 'md', icon, className, children, ...rest }, ref) {
  const name = typeof icon === 'string' ? icon : icon ? TONE_ICON[tone] : undefined;
  return (
    <span ref={ref} {...rest} className={cn(badgeVariants({ tone, size }), className)}>
      {name && <Icon name={name} size={size === 'sm' ? 'xs' : 'sm'} />}
      {children}
    </span>
  );
});
