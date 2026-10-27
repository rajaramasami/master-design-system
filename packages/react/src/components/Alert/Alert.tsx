import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';
import { IconButton } from '../IconButton/IconButton';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const TONE_ICON: Record<AlertTone, IconName> = { info: 'info', success: 'success', warning: 'warning', danger: 'alert' };

/* Mirrors the Figma set "Alert" (13 Feedback): Tone × Layout Inline, Banner. */
const alertVariants = cva('flex items-start gap-inline-md text-text-primary', {
  variants: {
    tone: {
      info: 'border-status-info-border bg-status-info-bg [--alert-icon:var(--mds-color-icon-info)]',
      success: 'border-status-success-border bg-status-success-bg [--alert-icon:var(--mds-color-icon-success)]',
      warning: 'border-status-warning-border bg-status-warning-bg [--alert-icon:var(--mds-color-icon-warning)]',
      danger: 'border-status-danger-border bg-status-danger-bg [--alert-icon:var(--mds-color-icon-danger)]',
    },
    layout: {
      inline: 'rounded-surface border p-inset-md',
      banner: 'w-full border-b px-inset-lg py-inset-sm',
    },
  },
  defaultVariants: { tone: 'info', layout: 'inline' },
});

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  /** Inline sits in the content; Banner spans the top of a page with a bottom border. */
  layout?: 'inline' | 'banner';
  /** One line (body/sm-strong). */
  title: ReactNode;
  /** What happened and what to do next (Figma "Description"). */
  children?: ReactNode;
  /** Buttons, e.g. Secondary and Ghost sm (Figma "Show Actions"). */
  actions?: ReactNode;
  /** Shows a dismiss button (Figma "Show Close"). */
  onDismiss?: () => void;
  /**
   * Set when the alert appears in response to something the person did, so screen readers
   * announce it: Danger and Warning interrupt (role="alert"), Info and Success wait (role="status").
   * Leave off for alerts that are part of the page from the start.
   */
  announce?: boolean;
}

/**
 * A persistent message about the page or a section (Figma "Alert"). Status fill and border,
 * a tone icon and text/primary, so the meaning never relies on colour alone.
 * For a brief confirmation after an action, use a toast instead.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'info', layout = 'inline', title, children, actions, onDismiss, announce = false, className, ...rest },
  ref,
) {
  const role = announce ? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status') : undefined;
  const banner = layout === 'banner';
  return (
    <div ref={ref} role={role} {...rest} className={cn(alertVariants({ tone, layout }), className)}>
      <span className="flex h-[var(--mds-text-body-sm-line-height)] shrink-0 items-center">
        <Icon name={TONE_ICON[tone]} size="md" className="text-(--alert-icon)" />
      </span>
      <div className={cn('flex min-w-0 flex-1', banner ? 'flex-wrap items-center gap-x-inline-sm gap-y-stack-xs' : 'flex-col gap-stack-sm')}>
        <div className={cn('flex min-w-0', banner ? 'flex-wrap gap-x-inline-xs' : 'flex-col gap-stack-xs')}>
          <p className="m-0 text-body-sm-strong">{title}</p>
          {children && <div className="text-body-sm">{children}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-inline-sm">{actions}</div>}
      </div>
      {onDismiss && <IconButton variant="ghost" size="sm" icon="close" label="Dismiss" onClick={onDismiss} className="-my-inset-xs -mr-inset-xs shrink-0" />}
    </div>
  );
});
