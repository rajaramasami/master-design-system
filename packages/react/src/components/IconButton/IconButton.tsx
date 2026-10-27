import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { Icon, type IconSize } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';

/*
 * Mirrors the 4 Figma sets "Icon Button / Primary | Secondary | Ghost | Danger".
 * Square, width and height from size/control/*, icon from size/icon/sm|md|lg.
 */
export const iconButtonVariants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center rounded-control',
    'cursor-pointer select-none outline-none',
    'transition-[background-color,border-color,color,box-shadow] duration-(--mds-motion-duration-fast) ease-standard',
    'focus-visible:shadow-focus-ring-brand',
    'unavailable:cursor-not-allowed loading:cursor-progress',
    'unavailable:text-icon-disabled',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-action-primary-default text-icon-on-action',
          'hovered:bg-action-primary-hover pressed:bg-action-primary-pressed unavailable:bg-bg-disabled',
        ],
        secondary: [
          'border border-border-default bg-action-secondary-default text-icon-primary',
          'hovered:border-border-strong hovered:bg-action-secondary-hover',
          'pressed:border-border-strong pressed:bg-action-secondary-pressed',
          'unavailable:border-border-disabled',
        ],
        ghost: [
          'bg-transparent text-icon-primary',
          'hovered:bg-action-ghost-hover pressed:bg-action-ghost-pressed focus-visible:bg-action-ghost-hover',
        ],
        danger: [
          'bg-action-danger-default text-icon-on-action',
          'hovered:bg-action-danger-hover pressed:bg-action-danger-pressed unavailable:bg-bg-disabled',
          'focus-visible:shadow-focus-ring-danger',
        ],
      },
      size: {
        sm: 'size-control-sm',
        md: 'size-control-md',
        lg: 'size-control-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type BaseProps = VariantProps<typeof iconButtonVariants> & {
  /** One of the 51 Figma icons. */
  icon: IconName;
  /**
   * Required accessible name, read by screen readers instead of the icon.
   * Show the same text in a Tooltip (Phase 3) for sighted users.
   */
  label: string;
  /** Replaces the icon with a spinner, ignores clicks and marks the button busy. */
  loading?: boolean;
};

export type IconButtonProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | 'children' | 'aria-label'>;

/** An icon-only button for compact actions such as add, close or more. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant, size, icon, label, loading = false, className, onClick, type, ...rest },
  ref,
) {
  const iconSize: IconSize = size ?? 'md';
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      {...rest}
      type={type ?? 'button'}
      aria-label={label}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
      className={cn(iconButtonVariants({ variant, size }), className)}
      onClick={handleClick}
    >
      <Icon name={loading ? 'spinner' : icon} size={iconSize} className={loading ? 'mds-spinner' : undefined} />
    </button>
  );
});
