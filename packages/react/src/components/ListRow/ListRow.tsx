import { forwardRef, type HTMLAttributes, type LiHTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Figma "Show Divider": a border/subtle line between rows. */
  dividers?: boolean;
}

/** The list element (ul) that holds ListRows. */
export const List = forwardRef<HTMLUListElement, ListProps>(function List({ dividers = false, className, ...rest }, ref) {
  return (
    <ul
      ref={ref}
      {...rest}
      className={cn('m-0 flex list-none flex-col p-0', dividers && '[&>li:not(:last-child)]:border-b [&>li:not(:last-child)]:border-border-subtle [&>li]:rounded-none', className)}
    />
  );
});

const SIZE = {
  sm: 'min-h-row-sm py-inset-xs',
  md: 'min-h-row-md py-inset-sm',
  lg: 'min-h-row-lg py-inset-sm',
} as const;

export interface ListRowProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title' | 'onClick'> {
  /** Main text (body/sm-strong; body/md-strong at lg). Also the name of the link or button. */
  title: ReactNode;
  /** Secondary line. */
  description?: ReactNode;
  /** Trailing text such as a date or time (body/sm: often essential, never caption size). */
  meta?: ReactNode;
  /** Leading element: an Avatar (xs, sm, md for sizes sm, md, lg) or an Icon. */
  leading?: ReactNode;
  /** Trailing Badge. */
  badge?: ReactNode;
  /** Figma Size: row height from size/row/* (Density). */
  size?: 'sm' | 'md' | 'lg';
  /** Makes the row one link. */
  href?: string;
  /** Makes the row one button. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Figma "Show Chevron". On by default for links and buttons. */
  chevron?: boolean;
  /** bg/selected plus a check icon. Read as pressed on a button row. */
  selected?: boolean;
  disabled?: boolean;
}

/**
 * One item in a list: an appointment, test, medicine or person (Figma "List Row").
 * An interactive row is one link or button named by its title; the whole row is the target.
 */
export const ListRow = forwardRef<HTMLLIElement, ListRowProps>(function ListRow(
  { title, description, meta, leading, badge, size = 'md', href, onClick, chevron, selected, disabled, className, ...rest },
  ref,
) {
  const isLink = href != null && !disabled;
  const isButton = onClick != null;
  const interactive = (isLink || isButton) && !disabled;
  const showChevron = chevron ?? (isLink || isButton);
  const stretched = 'outline-none after:absolute after:inset-0 after:rounded-control after:content-[""] focus-visible:shadow-none';
  const titleClass = cn(size === 'lg' ? 'text-body-md-strong' : 'text-body-sm-strong', disabled ? 'text-text-disabled' : 'text-text-primary');

  const titleNode = isLink ? (
    <a data-row-action href={href} className={cn(stretched, titleClass)}>{title}</a>
  ) : isButton ? (
    <button
      data-row-action
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected === undefined ? undefined : selected}
      className={cn(stretched, titleClass, 'cursor-pointer text-left disabled:cursor-not-allowed')}
    >
      {title}
    </button>
  ) : (
    <span className={titleClass}>{title}</span>
  );

  return (
    <li
      ref={ref}
      {...rest}
      data-selected={selected ? '' : undefined}
      className={cn(
        'relative flex items-center gap-inline-md rounded-control bg-bg-surface px-inset-md',
        'transition-[background-color,box-shadow] duration-(--mds-motion-duration-fast) ease-standard',
        SIZE[size],
        interactive && 'has-[[data-row-action]:hover]:bg-bg-subtle has-[[data-row-action]:active]:bg-bg-muted has-[[data-row-action]:focus-visible]:shadow-focus-ring-brand',
        selected && 'bg-bg-selected has-[[data-row-action]:hover]:bg-bg-selected',
        className,
      )}
    >
      {leading && <span className={cn('flex shrink-0', disabled && 'opacity-60')}>{leading}</span>}
      <span className="flex min-w-0 flex-1 flex-col gap-stack-xs">
        {titleNode}
        {description && <span className={cn('text-body-sm', disabled ? 'text-text-disabled' : 'text-text-secondary')}>{description}</span>}
      </span>
      {(badge || meta || selected || showChevron) && (
        <span className="flex shrink-0 items-center gap-inline-sm">
          {badge}
          {meta && <span className={cn('text-body-sm', disabled ? 'text-text-disabled' : 'text-text-tertiary')}>{meta}</span>}
          {selected && <Icon name="check" size="md" label="Selected" className="text-icon-brand" />}
          {showChevron && <Icon name="chevron-right" size="sm" className={disabled ? 'text-icon-disabled' : 'text-icon-secondary'} />}
        </span>
      )}
    </li>
  );
});
