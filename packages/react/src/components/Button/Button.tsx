import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { Icon, type IconSize } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';

/*
 * Mirrors the 5 Figma sets "Button / Primary | Primary Tinted | Secondary | Danger | Ghost".
 * Size (sm, md, lg) and State (Default, Hover, Pressed, Focus, Disabled, Loading) map as:
 *   Hover, Pressed, Focus -> CSS states (hovered:, pressed:, focus-visible:)
 *   Disabled              -> `disabled`
 *   Loading               -> `loading`
 * `--btn-icon` carries the Figma icon colour, which differs from the label colour on some variants.
 */
export const buttonVariants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center gap-inline-sm whitespace-nowrap rounded-control',
    'cursor-pointer select-none no-underline outline-none',
    'transition-[background-color,border-color,color,box-shadow] duration-(--mds-motion-duration-fast) ease-standard',
    'focus-visible:shadow-focus-ring-brand',
    'unavailable:cursor-not-allowed loading:cursor-progress',
    'unavailable:[--btn-icon:var(--mds-color-icon-disabled)]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-action-primary-default text-text-on-action [--btn-icon:var(--mds-color-icon-on-action)]',
          'hovered:bg-action-primary-hover pressed:bg-action-primary-pressed',
          'unavailable:bg-bg-disabled unavailable:text-text-disabled',
        ],
        'primary-tinted': [
          'bg-action-primary-subtle text-text-brand [--btn-icon:var(--mds-color-icon-brand)]',
          'hovered:bg-action-primary-subtle-hover pressed:bg-action-primary-subtle-pressed',
          'unavailable:bg-bg-disabled unavailable:text-text-disabled',
        ],
        secondary: [
          'border border-border-default bg-action-secondary-default text-text-primary [--btn-icon:var(--mds-color-icon-primary)]',
          'hovered:border-border-strong hovered:bg-action-secondary-hover',
          'pressed:border-border-strong pressed:bg-action-secondary-pressed',
          'unavailable:border-border-disabled unavailable:text-text-disabled',
        ],
        danger: [
          'bg-action-danger-default text-text-on-action [--btn-icon:var(--mds-color-icon-on-action)]',
          'hovered:bg-action-danger-hover pressed:bg-action-danger-pressed',
          'focus-visible:shadow-focus-ring-danger',
          'unavailable:bg-bg-disabled unavailable:text-text-disabled',
        ],
        ghost: [
          'bg-transparent text-text-primary [--btn-icon:var(--mds-color-icon-primary)]',
          'hovered:bg-action-ghost-hover pressed:bg-action-ghost-pressed focus-visible:bg-action-ghost-hover',
          'unavailable:text-text-disabled',
        ],
      },
      size: {
        sm: 'h-control-sm px-inset-md text-label-md',
        md: 'h-control-md px-inset-lg text-label-md',
        lg: 'h-control-lg px-inset-xl text-body-md-strong',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

const ICON_SIZE: Record<'sm' | 'md' | 'lg', IconSize> = { sm: 'sm', md: 'sm', lg: 'md' };

type BaseProps = VariantProps<typeof buttonVariants> & {
  /** Icon before the label. Same 51 names as the Figma "Leading Icon" swap. */
  leadingIcon?: IconName;
  /** Icon after the label, e.g. `chevron-down` for a menu or `external-link`. */
  trailingIcon?: IconName;
  /**
   * Shows a spinner in place of the leading icon and keeps the label, as in Figma.
   * The button stays focusable but ignores clicks, and tells screen readers it is busy.
   */
  loading?: boolean;
  /**
   * Renders the child element (e.g. a router link) with button styles instead of a `<button>`.
   * The child must be a single element that contains the label.
   */
  asChild?: boolean;
  children?: ReactNode;
};

export type ButtonProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

/**
 * The main action button. Use one Primary per view; Secondary or Ghost for
 * the rest, Danger for destructive actions, Primary Tinted for a softer emphasis.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, leadingIcon, trailingIcon, loading = false, asChild = false, disabled, className, children, onClick, type, ...rest },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'button';
  const iconSize = ICON_SIZE[size ?? 'md'];
  const iconClass = 'text-(--btn-icon)';

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading || (asChild && disabled)) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <Comp
      ref={ref}
      {...rest}
      type={asChild ? undefined : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : disabled}
      aria-disabled={asChild && disabled ? true : undefined}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
      data-variant={variant ?? 'primary'}
      onClick={handleClick}
    >
      {loading ? (
        <Icon name="spinner" size={iconSize} className={cn(iconClass, 'mds-spinner')} />
      ) : (
        leadingIcon && <Icon name={leadingIcon} size={iconSize} className={iconClass} />
      )}
      <Slot.Slottable>{children}</Slot.Slottable>
      {trailingIcon && <Icon name={trailingIcon} size={iconSize} className={iconClass} />}
    </Comp>
  );
});
