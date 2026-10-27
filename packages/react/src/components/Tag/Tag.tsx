import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon, type IconSize } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';

/*
 * Mirrors the Figma set "Tag" (12 Data display): Size sm, md × State Default, Hover, Pressed,
 * Focus, Selected, Disabled. Pill with a 1px border/default. Selected: action/primary/subtle,
 * border/brand, text/brand and a check mark, so selection isn't colour alone.
 */
const pill = (size: 'sm' | 'md') =>
  cn(
    'relative inline-flex shrink-0 items-center gap-inline-xs whitespace-nowrap rounded-pill border border-border-default bg-bg-surface text-text-primary',
    'transition-[background-color,border-color,color] duration-(--mds-motion-duration-fast) ease-standard',
    size === 'sm' ? 'h-tag-height-sm px-inline-sm text-label-sm' : 'h-tag-height-md px-inline-md text-label-md',
  );

/** Interactive parts grow their hit area to the platform minimum without changing the visual size. */
const hitArea = 'before:absolute before:inset-x-0 before:top-1/2 before:h-[max(100%,var(--mds-size-target-min))] before:-translate-y-1/2 before:content-[""]';

const interactive = [
  'cursor-pointer outline-none',
  'hovered:border-border-strong hovered:bg-bg-subtle pressed:border-border-strong pressed:bg-bg-muted',
  'aria-pressed:border-border-brand aria-pressed:bg-action-primary-subtle aria-pressed:text-text-brand',
  'unavailable:cursor-not-allowed unavailable:border-border-disabled unavailable:bg-bg-disabled unavailable:text-text-disabled',
];

export interface TagProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** md by default. sm (12 px text) only for dense, non-essential filters. */
  size?: 'sm' | 'md';
  /** Figma "Leading Icon". */
  icon?: IconName;
  /**
   * Makes the tag a filter toggle (a button with aria-pressed). Selected shows the
   * check mark and brand colours.
   */
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /**
   * Shows a separate remove button (Figma "Show Remove") named "Remove {label}".
   * Pass `removeLabel` when the children aren't plain text.
   */
  onRemove?: () => void;
  removeLabel?: string;
  children: ReactNode;
}

/**
 * A filter, choice or removable value (chip). Static when it has no handlers;
 * a toggle button with `selected`; a value with its own remove button with `onRemove`.
 */
export const Tag = forwardRef<HTMLButtonElement, TagProps>(function Tag(
  { size = 'md', icon, selected, onSelectedChange, onRemove, removeLabel, disabled, className, children, onClick, ...rest },
  ref,
) {
  const iconSize: IconSize = size === 'sm' ? 'xs' : 'sm';
  const toggles = selected !== undefined || onSelectedChange !== undefined;
  const content = (
    <>
      {selected && <Icon name="check" size={iconSize} className="text-icon-brand" />}
      {icon && <Icon name={icon} size={iconSize} className={disabled ? 'text-icon-disabled' : selected ? 'text-icon-brand' : 'text-icon-secondary'} />}
      <span>{children}</span>
    </>
  );

  const remove = onRemove && (
    <button
      type="button"
      onClick={onRemove}
      disabled={disabled}
      aria-label={removeLabel ?? `Remove ${typeof children === 'string' ? children : ''}`.trim()}
      className={cn(
        hitArea,
        'relative -mr-inline-xs inline-flex shrink-0 cursor-pointer items-center justify-center rounded-pill p-[2px] text-icon-secondary outline-none',
        'hovered:bg-action-ghost-hover hovered:text-icon-primary pressed:bg-action-ghost-pressed unavailable:cursor-not-allowed unavailable:text-icon-disabled',
      )}
    >
      <Icon name="close" size={iconSize} />
    </button>
  );

  if (toggles) {
    const toggle = (
      <button
        ref={ref}
        type="button"
        {...rest}
        disabled={disabled}
        aria-pressed={Boolean(selected)}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) onSelectedChange?.(!selected);
        }}
        className={cn(pill(size), hitArea, interactive, onRemove && 'pr-inline-xs', className)}
      >
        {content}
      </button>
    );
    return onRemove ? <span className="inline-flex items-center gap-inline-xs">{toggle}{remove}</span> : toggle;
  }

  return (
    <span
      className={cn(
        pill(size),
        disabled && 'border-border-disabled bg-bg-disabled text-text-disabled',
        onRemove && (size === 'sm' ? 'pr-inline-xs' : 'pr-inline-sm'),
        className,
      )}
    >
      {content}
      {remove}
    </span>
  );
});
