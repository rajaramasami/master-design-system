import { forwardRef, type HTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';

export type FieldMessageTone = 'helper' | 'success' | 'warning' | 'error';

const TONE_ICON: Record<FieldMessageTone, IconName> = {
  helper: 'info',
  success: 'success',
  warning: 'warning',
  error: 'alert',
};

/* Mirrors the Figma set "Field Message" (13 Feedback): Tone = Helper, Success, Warning, Error. */
const fieldMessageVariants = cva('flex items-start gap-inline-xs text-body-sm', {
  variants: {
    tone: {
      helper: 'text-text-secondary [--fm-icon:var(--mds-color-icon-secondary)]',
      success: 'text-text-success [--fm-icon:var(--mds-color-icon-success)]',
      warning: 'text-text-warning [--fm-icon:var(--mds-color-icon-warning)]',
      error: 'text-text-danger [--fm-icon:var(--mds-color-icon-danger)]',
    },
    disabled: {
      true: 'text-text-disabled [--fm-icon:var(--mds-color-icon-disabled)]',
    },
  },
  defaultVariants: { tone: 'helper' },
});

export interface FieldMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  tone?: FieldMessageTone;
  /**
   * Shows the tone icon. On by default for Success, Warning and Error, so the
   * meaning never relies on colour alone; off by default for Helper.
   */
  showIcon?: boolean;
  /** Greys the message out to match a disabled field. */
  disabled?: boolean;
}

/**
 * Help or validation text under a field. The form components render it for
 * you; use it directly for custom fields, and point the input's
 * `aria-describedby` at its `id`.
 */
export const FieldMessage = forwardRef<HTMLParagraphElement, FieldMessageProps>(function FieldMessage(
  { tone = 'helper', showIcon, disabled = false, className, children, ...rest },
  ref,
) {
  const withIcon = showIcon ?? tone !== 'helper';
  return (
    <p ref={ref} {...rest} data-tone={tone} className={cn(fieldMessageVariants({ tone, disabled }), className)}>
      {withIcon && (
        // The icon box is one line tall, so the icon centres on the first line of text.
        <span className="flex h-[1lh] shrink-0 items-center">
          <Icon name={TONE_ICON[tone]} size="sm" className="text-(--fm-icon)" />
        </span>
      )}
      <span className="min-w-0">{children}</span>
    </p>
  );
});
