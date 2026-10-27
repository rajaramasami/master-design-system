import { createContext, useContext, useId, type ReactNode } from 'react';
import { Label } from 'radix-ui';
import { cn } from '../../lib/cn';
import { FieldMessage } from '../FieldMessage/FieldMessage';

/*
 * Shared layout for Checkbox, Radio and Switch rows (Figma: control + label +
 * description, gap spacing/inline/sm, row min height size/target/min). The
 * whole row is the target: hovering or pressing the label styles the control.
 */
export function ChoiceRow({
  control,
  controlId,
  label,
  description,
  descriptionId,
  disabled,
  className,
}: {
  control: ReactNode;
  controlId: string;
  label?: ReactNode;
  description?: ReactNode;
  descriptionId: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div
      data-slot="choice"
      className={cn('group/choice flex min-h-target-min items-start gap-inline-sm', disabled ? 'cursor-not-allowed' : 'cursor-pointer', className)}
      data-disabled={disabled ? '' : undefined}
    >
      {/* One body line tall, so the control centres on the first line of the label. */}
      <span className="flex min-h-[var(--mds-text-body-md-line-height)] shrink-0 items-center">{control}</span>
      {(label || description) && (
        <span className="flex min-w-0 flex-col gap-stack-2xs">
          {label && (
            <Label.Root
              htmlFor={controlId}
              className={cn('text-body-md', disabled ? 'cursor-not-allowed text-text-disabled' : 'cursor-pointer text-text-primary')}
            >
              {label}
            </Label.Root>
          )}
          {description && (
            <span id={descriptionId} className={cn('text-body-sm', disabled ? 'text-text-disabled' : 'text-text-secondary')}>
              {description}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

/** Group state shared with the checkboxes or radios inside a group. */
export const ChoiceGroupContext = createContext<{ invalid: boolean; disabled: boolean }>({ invalid: false, disabled: false });
export const useChoiceGroup = () => useContext(ChoiceGroupContext);

export interface ChoiceGroupProps {
  /** The group's visible question, e.g. "Preferred contact method". Required for screen readers. */
  label: ReactNode;
  /** Help text under the label. */
  description?: ReactNode;
  /** Error for the whole group. Every control in it shows its Error state. */
  error?: ReactNode;
  /** Shows the Error state without a message, e.g. when the message is shown elsewhere. */
  invalid?: boolean;
  /** Hides the group label visually but keeps it for screen readers. */
  hideLabel?: boolean;
  /** Disables every control in the group. */
  disabled?: boolean;
  /** Stack the options (default) or put them in a row. */
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  children?: ReactNode;
}

/** Ids and frame for a labelled group of choices. */
export function useChoiceGroupIds() {
  const id = useId();
  return { labelId: `mds-${id}-label`, descriptionId: `mds-${id}-description`, errorId: `mds-${id}-error` };
}

export function ChoiceGroupFrame({
  ids,
  label,
  description,
  error,
  disabled,
  hideLabel,
  orientation = 'vertical',
  className,
  children,
  as: As = 'div',
}: ChoiceGroupProps & { ids: ReturnType<typeof useChoiceGroupIds>; as?: 'div' | 'fieldset' }) {
  const isFieldset = As === 'fieldset';
  const labelClass = cn('p-0 text-label-md', disabled ? 'text-text-disabled' : 'text-text-primary', hideLabel && 'sr-only');
  const describedBy = [description ? ids.descriptionId : null, error ? ids.errorId : null].filter(Boolean).join(' ') || undefined;
  return (
    <As
      className={cn('m-0 flex min-w-0 flex-col gap-stack-sm border-0 p-0', className)}
      disabled={isFieldset ? disabled : undefined}
      aria-describedby={isFieldset ? describedBy : undefined}
    >
      {/* A legend must be the fieldset's first child to name the group. */}
      {isFieldset && <legend id={ids.labelId} className={cn(labelClass, 'float-left w-full')}>{label}</legend>}
      <span className={cn('flex flex-col gap-stack-2xs', !description && isFieldset && 'hidden')}>
        {isFieldset ? null : <span id={ids.labelId} className={labelClass}>{label}</span>}
        {description && (
          <span id={ids.descriptionId} className={cn('text-body-sm', disabled ? 'text-text-disabled' : 'text-text-secondary')}>
            {description}
          </span>
        )}
      </span>
      <div className={cn('flex', orientation === 'horizontal' ? 'flex-row flex-wrap gap-x-inline-lg gap-y-stack-xs' : 'flex-col gap-stack-xs')}>
        {children}
      </div>
      {error && <FieldMessage id={ids.errorId} tone="error">{error}</FieldMessage>}
    </As>
  );
}
