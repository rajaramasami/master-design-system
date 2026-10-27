import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';

export type EmptyStateType = 'empty' | 'no-results' | 'error' | 'offline';

const TYPE: Record<EmptyStateType, { icon: IconName; disc: string; color: string }> = {
  empty: { icon: 'file', disc: 'bg-bg-muted', color: 'text-icon-secondary' },
  'no-results': { icon: 'search', disc: 'bg-bg-muted', color: 'text-icon-secondary' },
  error: { icon: 'alert', disc: 'bg-status-danger-bg', color: 'text-icon-danger' },
  offline: { icon: 'wifi-off', disc: 'bg-status-warning-bg', color: 'text-icon-warning' },
};

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma Type: Empty (first use), No results, Error (danger tint), Offline (warning tint). */
  type?: EmptyStateType;
  /** Overrides the type's icon. */
  icon?: IconName;
  /** Says what happened, e.g. "No appointments yet". */
  title: ReactNode;
  titleAs?: 'h2' | 'h3' | 'h4' | 'p';
  /** One sentence with the next step. */
  description?: ReactNode;
  /** Up to two Buttons, secondary first. */
  actions?: ReactNode;
}

/**
 * Fills a list, table or panel that has nothing to show (Figma "Empty State"). Never leave a
 * blank area: say what happened and offer the next step.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { type = 'empty', icon, title, titleAs: Title = 'h3', description, actions, className, ...rest },
  ref,
) {
  const t = TYPE[type];
  return (
    <div ref={ref} {...rest} className={cn('flex flex-col items-center gap-stack-md p-inset-xl text-center', className)}>
      <span className={cn('flex size-avatar-size-xl items-center justify-center rounded-pill', t.disc)}>
        <Icon name={icon ?? t.icon} size="lg" className={t.color} />
      </span>
      <div className="flex max-w-[44ch] flex-col gap-stack-xs">
        <Title className="m-0 text-heading-sm text-text-primary">{title}</Title>
        {description && <p className="m-0 text-body-sm text-text-secondary">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap justify-center gap-inline-sm">{actions}</div>}
    </div>
  );
});
