import { forwardRef, useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { FieldFooter, FieldLabel, useFieldIds, type FieldProps } from '../Field/Field';
import { fieldInputClass } from '../TextField/TextField';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldProps {
  /**
   * Shows "12/500" under the field (Figma "Show Counter"). Needs `maxLength`.
   * The limit is also part of the field's description for screen readers.
   */
  showCounter?: boolean;
  /** Class for the outer wrapper. `className` styles the textarea. */
  wrapperClassName?: string;
}

/**
 * Multi-line free text such as symptoms or notes (Figma "Textarea", 11 Inputs).
 * Starts at textarea/min-height and grows with its content.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    hideLabel,
    description,
    error,
    showCounter = false,
    maxLength,
    id,
    disabled,
    readOnly,
    value,
    defaultValue,
    onChange,
    className,
    wrapperClassName,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const counting = showCounter && maxLength != null;
  const [uncontrolledLength, setLength] = useState(String(defaultValue ?? '').length);
  const length = value != null ? String(value).length : uncontrolledLength;

  const f = useFieldIds(id, {
    description,
    error,
    parts: counting ? ['counter'] : [],
    extra: ariaDescribedBy ? [ariaDescribedBy] : [],
  });
  const counterId = `${f.inputId}-counter`;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (value == null) setLength(e.target.value.length);
    onChange?.(e);
  };

  const counter = counting ? (
    <p id={counterId} className={cn('shrink-0 text-body-sm tabular-nums', f.showError ? 'text-text-danger' : disabled ? 'text-text-disabled' : 'text-text-secondary')}>
      <span aria-hidden="true">{length}/{maxLength}</span>
      <span className="sr-only">{`Up to ${maxLength} characters`}</span>
    </p>
  ) : null;

  return (
    <div className={cn('flex flex-col gap-stack-sm', wrapperClassName)}>
      <FieldLabel htmlFor={f.inputId} hidden={hideLabel} disabled={disabled}>{label}</FieldLabel>
      <textarea
        ref={ref}
        {...rest}
        id={f.inputId}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={f.showError || undefined}
        aria-describedby={f.describedBy}
        data-invalid={f.showError ? '' : undefined}
        className={cn(
          fieldInputClass,
          'block min-h-textarea-min-height w-full resize-y rounded-control border border-border-strong bg-bg-surface px-inset-md py-inset-sm text-body-md',
          '[field-sizing:content]',
          'transition-[background-color,border-color,box-shadow] duration-(--mds-motion-duration-fast) ease-standard',
          'enabled:read-write:not-focus:hover:bg-bg-subtle',
          'focus:border-border-brand focus:shadow-focus-ring-brand focus-visible:shadow-focus-ring-brand',
          'data-invalid:border-border-danger data-invalid:focus:shadow-focus-ring-danger data-invalid:focus-visible:shadow-focus-ring-danger',
          'read-only:border-border-default read-only:bg-bg-muted',
          'disabled:border-border-disabled disabled:bg-bg-disabled',
          className,
        )}
      />
      <FieldFooter {...f} error={error} description={description} disabled={disabled} trailing={counter} />
    </div>
  );
});
