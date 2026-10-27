import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { Icon, type IconSize } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';
import { FieldFooter, FieldLabel, useFieldIds, type FieldProps } from '../Field/Field';

/*
 * The bordered box from the Figma set "Text Field" (11 Inputs), also used by Textarea.
 * States: Hover (bg/subtle), Focus (border/brand + focus/ring-brand), Error (border/danger),
 * Disabled (bg/disabled + border/disabled), Read-only (bg/muted + border/default).
 */
export const fieldBoxVariants = cva(
  [
    'flex w-full items-center gap-inline-sm rounded-control border border-border-strong bg-bg-surface',
    'transition-[background-color,border-color,box-shadow] duration-(--mds-motion-duration-fast) ease-standard',
    '[&:not([data-disabled],[data-readonly],:focus-within)]:hover:bg-bg-subtle',
    'focus-within:border-border-brand focus-within:shadow-focus-ring-brand',
    'data-invalid:border-border-danger data-invalid:focus-within:border-border-danger data-invalid:focus-within:shadow-focus-ring-danger',
    'data-readonly:border-border-default data-readonly:bg-bg-muted',
    'data-disabled:cursor-not-allowed data-disabled:border-border-disabled data-disabled:bg-bg-disabled',
  ],
  {
    variants: {
      size: {
        sm: 'h-control-sm px-inset-sm text-body-sm',
        md: 'h-control-md px-inset-md text-body-md',
        lg: 'h-control-lg px-inset-md text-body-lg',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

/** The native input or textarea inside the box: no border or ring of its own. */
export const fieldInputClass = [
  'min-w-0 flex-1 self-stretch bg-transparent text-text-primary outline-none focus-visible:shadow-none',
  'placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:text-text-disabled disabled:placeholder:text-text-disabled',
];

const ICON_SIZE: Record<'sm' | 'md' | 'lg', IconSize> = { sm: 'sm', md: 'md', lg: 'md' };

type NativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>;

export interface TextFieldProps extends NativeProps, FieldProps {
  /** Figma Size: sm 32, md 40, lg 48 on web. */
  size?: 'sm' | 'md' | 'lg';
  /** Icon at the start of the field, e.g. `search` or `mail` (Figma "Prefix Icon"). */
  prefixIcon?: IconName;
  /** Icon at the end of the field (Figma "Suffix Icon"). Use `suffix` for an interactive control. */
  suffixIcon?: IconName;
  /** Custom content at the end, e.g. an IconButton that clears the field or shows a password. */
  suffix?: ReactNode;
  /** Class for the outer wrapper (label, field and message). `className` styles the input. */
  wrapperClassName?: string;
}

/** A single-line text input with label, help text and validation. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    hideLabel,
    description,
    error,
    size = 'md',
    prefixIcon,
    suffixIcon,
    suffix,
    id,
    disabled,
    readOnly,
    className,
    wrapperClassName,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const f = useFieldIds(id, { description, error, extra: ariaDescribedBy ? [ariaDescribedBy] : [] });
  const iconSize = ICON_SIZE[size];
  const iconClass = disabled ? 'text-icon-disabled' : 'text-icon-secondary';

  return (
    <div className={cn('flex flex-col', size === 'sm' ? 'gap-stack-xs' : 'gap-stack-sm', wrapperClassName)}>
      <FieldLabel htmlFor={f.inputId} hidden={hideLabel} disabled={disabled}>{label}</FieldLabel>
      <div
        data-slot="field-box"
        className={fieldBoxVariants({ size })}
        data-invalid={f.showError ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly && !disabled ? '' : undefined}
      >
        {prefixIcon && <Icon name={prefixIcon} size={iconSize} className={iconClass} />}
        <input
          ref={ref}
          {...rest}
          id={f.inputId}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={f.showError || undefined}
          aria-describedby={f.describedBy}
          className={cn(fieldInputClass, className)}
        />
        {suffix ?? (suffixIcon && <Icon name={suffixIcon} size={iconSize} className={iconClass} />)}
      </div>
      <FieldFooter {...f} error={error} description={description} disabled={disabled} />
    </div>
  );
});
