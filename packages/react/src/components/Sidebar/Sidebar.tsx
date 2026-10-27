import { createContext, forwardRef, useContext, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from '../Tooltip/Tooltip';

const CollapsedContext = createContext(false);

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Product name in the header (Figma "product name"). */
  productName: string;
  /** Product mark, 32 px. Defaults to the name's first letter in a brand disc. */
  productMark?: ReactNode;
  /** Figma Collapsed: icons only, with labels in tooltips. */
  collapsed?: boolean;
  /** Shows the collapse button; called with the new state. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Bottom area: Settings item and the account (Figma "footer"). */
  footer?: ReactNode;
  /** The main SidebarItems. */
  children: ReactNode;
}

/**
 * Primary navigation for web apps and tablet (Figma "Sidebar", 14 Navigation): bg/subtle with
 * a right border, 256 wide or 64 collapsed. Below 1024 px wide, use a Top Bar menu button that
 * opens a Drawer (side left) with the same items.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { productName, productMark, collapsed = false, onCollapsedChange, footer, children, className, 'aria-label': ariaLabel = 'Main', ...rest },
  ref,
) {
  const toggle = onCollapsedChange && (
    <IconButton
      variant="ghost"
      size="sm"
      icon="menu"
      label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!collapsed}
      onClick={() => onCollapsedChange(!collapsed)}
    />
  );
  const mark = productMark ?? (
    <span aria-hidden="true" className="flex size-avatar-size-sm shrink-0 items-center justify-center rounded-pill bg-action-primary-subtle text-label-sm text-text-brand">
      {productName.charAt(0).toUpperCase()}
    </span>
  );

  return (
    <CollapsedContext.Provider value={collapsed}>
      <nav
        ref={ref}
        aria-label={ariaLabel}
        data-collapsed={collapsed ? '' : undefined}
        {...rest}
        className={cn(
          'flex h-full shrink-0 flex-col gap-stack-sm border-r border-border-subtle bg-bg-subtle p-inset-sm',
          'transition-[width] duration-(--mds-motion-duration-normal) ease-standard',
          collapsed ? 'w-sidebar-width-collapsed items-center' : 'w-sidebar-width-expanded',
          className,
        )}
      >
        <div className={cn('flex items-center gap-inline-sm', collapsed ? 'flex-col' : 'p-inset-xs')}>
          {mark}
          {!collapsed && <span className="min-w-0 flex-1 truncate text-body-sm-strong text-text-primary">{productName}</span>}
          {toggle}
        </div>
        <ul className={cn('-m-[4px] flex min-h-0 flex-1 list-none flex-col gap-stack-2xs overflow-y-auto p-[4px]', collapsed && 'items-center')}>{children}</ul>
        {footer && <div className="flex flex-col gap-stack-2xs">{footer}</div>}
      </nav>
    </CollapsedContext.Provider>
  );
});

export interface SidebarItemProps {
  icon: IconName;
  label: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  /** The current page: shown selected and announced with aria-current="page". */
  selected?: boolean;
  disabled?: boolean;
  /** Figma "Show Count", e.g. unread messages. */
  count?: number;
  /** Read with the count, e.g. "unread". */
  countLabel?: string;
  className?: string;
}

/**
 * A destination in the Sidebar (Figma "Nav Item"). A link when it has `href`.
 * Collapsed, it shows the icon only, with the label as its name and in a tooltip.
 */
export const SidebarItem = forwardRef<HTMLLIElement, SidebarItemProps & { as?: 'li' | 'div' }>(function SidebarItem(
  { icon, label, href, onClick, selected = false, disabled = false, count, countLabel, className, as: Wrapper = 'li' },
  ref,
) {
  const collapsed = useContext(CollapsedContext);
  const classes = cn(
    'relative flex h-control-md cursor-pointer items-center rounded-control border border-transparent text-label-md text-text-primary no-underline outline-none',
    'transition-[background-color,border-color,box-shadow] duration-(--mds-motion-duration-fast) ease-standard',
    'hovered:bg-action-ghost-hover pressed:bg-action-ghost-pressed focus-visible:bg-action-ghost-hover focus-visible:shadow-focus-ring-brand',
    'unavailable:cursor-not-allowed unavailable:text-text-disabled',
    collapsed ? 'size-control-md shrink-0 justify-center' : 'w-full gap-inline-md px-inset-md',
    selected && 'border-border-brand bg-action-primary-subtle text-body-sm-strong text-text-brand hovered:bg-action-primary-subtle',
    className,
  );
  const content = (
    <>
      <Icon name={icon} size="md" className={disabled ? 'text-icon-disabled' : selected ? 'text-icon-brand' : 'text-icon-secondary'} />
      {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{label}</span>}
      {count != null && (
        <span
          className={cn(
            'inline-flex h-badge-height-sm min-w-badge-height-sm items-center justify-center rounded-pill px-inline-xs text-label-sm tabular-nums',
            selected ? 'bg-bg-surface text-text-brand' : 'bg-bg-muted text-text-secondary',
            collapsed && 'absolute -top-stack-2xs -right-stack-2xs',
          )}
        >
          {count}
          {countLabel && <span className="sr-only"> {countLabel}</span>}
        </span>
      )}
    </>
  );
  const a11y = { 'aria-current': selected ? ('page' as const) : undefined, 'aria-label': collapsed ? [label, count != null ? `${count}${countLabel ? ` ${countLabel}` : ''}` : ''].filter(Boolean).join(', ') : undefined };
  let control =
    href && !disabled ? (
      <a href={href} onClick={onClick} {...a11y} className={classes}>{content}</a>
    ) : href ? (
      <a role="link" aria-disabled="true" {...a11y} className={classes}>{content}</a>
    ) : (
      <button type="button" onClick={onClick} disabled={disabled} {...a11y} className={classes}>{content}</button>
    );
  if (collapsed) control = <Tooltip content={label} side="right">{control}</Tooltip>;
  return <Wrapper ref={ref as never} className="flex">{control}</Wrapper>;
});
