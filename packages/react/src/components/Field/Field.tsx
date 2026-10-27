import { useId, type ReactNode } from 'react';
import { Label } from 'radix-ui';
import { cn } from '../../lib/cn';
import { FieldMessage } from '../FieldMessage/FieldMessage';

/** Props every labelled form control shares. Mirrors the Figma text properties Label, Helper and Error Message. */
export interface FieldProps {
  /** Visible label. Required: every field needs an accessible name. */
  label: ReactNode;
  /** Hides the label visually but keeps it for screen readers (Figma "Show Label" off). */
  hideLabel?: boolean;
  /** Help text under the field (Figma "Helper"). */
  description?: ReactNode;
  /**
   * Error message. When set, the field shows its Error state, the message
   * replaces the description, and the input gets `aria-invalid`.
   */
  error?: ReactNode;
}

/** Stable ids for a field and the text that describes it. */
export function useFieldIds(
  id: string | undefined,
  has: { description?: unknown; error?: unknown; extra?: string[]; parts?: string[] },
) {
  const auto = useId();
  const inputId = id ?? `mds-${auto}`;
  const messageId = `${inputId}-message`;
  const partIds = (has.parts ?? []).map((p) => `${inputId}-${p}`);
  const showError = has.error != null && has.error !== false && has.error !== '';
  const showDescription = !showError && has.description != null && has.description !== '';
  const describedBy = [showError || showDescription ? messageId : null, ...partIds, ...(has.extra ?? [])].filter(Boolean).join(' ') || undefined;
  return { inputId, messageId, showError, showDescription, describedBy };
}

export function FieldLabel({ htmlFor, hidden, disabled, children, className }: { htmlFor: string; hidden?: boolean; disabled?: boolean; children: ReactNode; className?: string }) {
  return (
    <Label.Root
      htmlFor={htmlFor}
      className={cn('text-label-md', disabled ? 'text-text-disabled' : 'text-text-primary', hidden && 'sr-only', className)}
    >
      {children}
    </Label.Root>
  );
}

/** The description or error under a field, wired to `messageId`. */
export function FieldFooter({
  messageId,
  showError,
  showDescription,
  error,
  description,
  disabled,
  trailing,
}: {
  messageId: string;
  showError: boolean;
  showDescription: boolean;
  error?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  trailing?: ReactNode;
}) {
  if (!showError && !showDescription && !trailing) return null;
  return (
    <div className="flex items-start justify-between gap-inline-xs">
      {showError ? (
        <FieldMessage id={messageId} tone="error">{error}</FieldMessage>
      ) : showDescription ? (
        <FieldMessage id={messageId} tone="helper" disabled={disabled}>{description}</FieldMessage>
      ) : (
        <span />
      )}
      {trailing}
    </div>
  );
}
