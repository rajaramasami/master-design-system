import { createContext, forwardRef, useContext, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';
import { useMds, type Platform } from '../../provider/ThemeProvider';

const PlatformContext = createContext<'ios' | 'android'>('ios');

export interface TabBarProps extends HTMLAttributes<HTMLElement> {
  /** 3 to 5 TabBarItems, one of them selected. */
  children: ReactNode;
  /** Overrides the platform from ThemeProvider. Web renders the iOS style. */
  platform?: Platform;
}

/**
 * Primary navigation on phones: 3 to 5 top-level destinations (Figma "Tab Bar", 14 Navigation).
 * iOS: tab bar on bg/surface with a top border, filled icon when selected. Android: navigation
 * bar on bg/subtle with an indicator pill. Never use it for actions. It is navigation, not a
 * tablist: the selected item has aria-current="page".
 */
export const TabBar = forwardRef<HTMLElement, TabBarProps>(function TabBar(
  { children, platform, className, 'aria-label': ariaLabel = 'Main', ...rest },
  ref,
) {
  const ctx = useMds();
  const p = (platform ?? ctx.platform) === 'android' ? 'android' : 'ios';
  return (
    <PlatformContext.Provider value={p}>
      <nav
        ref={ref}
        aria-label={ariaLabel}
        {...rest}
        className={cn(
          'w-full shrink-0 pb-[env(safe-area-inset-bottom)]',
          p === 'ios' ? 'border-t border-border-subtle bg-bg-surface' : 'bg-bg-subtle',
          className,
        )}
      >
        <ul className={cn('m-0 flex h-tabbar-height list-none p-0', p === 'android' ? 'items-center' : 'items-start')}>{children}</ul>
      </nav>
    </PlatformContext.Provider>
  );
});

export interface TabBarItemProps {
  /** A line icon; when selected, iOS uses its filled version where one exists. */
  icon: IconName;
  label: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  selected?: boolean;
  /** A number on the icon, e.g. unread messages. Screen readers hear it after the label, with `badgeLabel` ("unread"). */
  badge?: number;
  badgeLabel?: string;
}

/** One destination in the Tab Bar (Figma "Tab Bar Item"). */
export const TabBarItem = forwardRef<HTMLLIElement, TabBarItemProps>(function TabBarItem(
  { icon, label, href, onClick, selected = false, badge, badgeLabel },
  ref,
) {
  const p = useContext(PlatformContext);
  const android = p === 'android';
  const classes = cn(
    'flex h-full w-full cursor-pointer flex-col items-center pt-inset-xs no-underline outline-none',
    'rounded-control focus-visible:shadow-focus-ring-brand',
    android ? 'gap-stack-xs justify-center pt-0' : 'gap-stack-2xs',
    selected ? 'text-text-brand' : 'text-text-secondary hovered:text-text-primary',
  );
  const iconNode = (
    <span className="relative flex">
      <Icon name={icon} size="md" filled={selected && !android} className={selected ? 'text-icon-brand' : 'text-icon-secondary'} />
      {badge != null && (
        <span aria-hidden="true" className="absolute -top-stack-2xs -right-inline-sm inline-flex h-badge-height-sm min-w-badge-height-sm items-center justify-center rounded-pill bg-action-danger-default px-inline-xs text-label-sm text-text-on-action">
          {badge}
        </span>
      )}
    </span>
  );
  const content = (
    <>
      {android ? (
        <span
          className={cn(
            'flex h-navbar-indicator-height w-navbar-indicator-width items-center justify-center rounded-pill transition-colors duration-(--mds-motion-duration-fast) ease-standard',
            selected ? 'bg-action-primary-subtle' : 'group-hover/tbi:bg-action-ghost-hover',
          )}
        >
          {iconNode}
        </span>
      ) : (
        iconNode
      )}
      <span className={cn('text-label-sm', selected && android && 'font-semibold')}>{label}</span>
      {badge != null && <span className="sr-only">, {[badge, badgeLabel].filter(Boolean).join(' ')}</span>}
    </>
  );
  return (
    <li ref={ref} className="group/tbi flex h-full min-w-0 flex-1">
      {href ? (
        <a href={href} onClick={onClick} aria-current={selected ? 'page' : undefined} className={classes}>{content}</a>
      ) : (
        <button type="button" onClick={onClick} aria-current={selected ? 'page' : undefined} className={classes}>{content}</button>
      )}
    </li>
  );
});
