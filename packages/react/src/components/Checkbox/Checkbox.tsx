import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';
import { FieldMessage } from '../FieldMessage/FieldMessage';
import { ChoiceGroupContext, ChoiceGroupFrame, ChoiceRow, useChoiceGroup, useChoiceGroupIds, type ChoiceGroupProps } from '../Field/Choice';

/*
 * The box from the Figma set "Checkbox" (11 Inputs). Checked = Unchecked, Checked,
 * Indeterminate; State = Default, Hover, Pressed, Focus, Error, Disabled.
 * Hover and Pressed follow the whole row (group/choice), so the label is part of the target.
 */
export const checkboxBoxClass = [
  'peer inline-flex size-icon-md shrink-0 cursor-[inherit] items-center justify-center rounded-checkbox outline-none',
  'border border-border-strong bg-bg-surface text-icon-on-action',
  'transition-[background-color,border-color,box-shadow] duration-(--mds-motion-duration-fast) ease-standard',
  'group-hover/choice:enabled:bg-bg-subtle group-active/choice:enabled:bg-bg-muted',
  // Checked and indeterminate: filled, no visible border
  'data-[state=checked]:border-transparent data-[state=checked]:bg-action-primary-default',
  'data-[state=indeterminate]:border-transparent data-[state=indeterminate]:bg-action-primary-default',
  'group-hover/choice:enabled:data-[state=checked]:bg-action-primary-hover group-hover/choice:enabled:data-[state=indeterminate]:bg-action-primary-hover',
  'group-active/choice:enabled:data-[state=checked]:bg-action-primary-pressed group-active/choice:enabled:data-[state=indeterminate]:bg-action-primary-pressed',
  // Error: danger border, or danger fill when checked
  'data-invalid:border-border-danger data-invalid:focus-visible:shadow-focus-ring-danger',
  'data-invalid:data-[state=checked]:bg-action-danger-default data-invalid:data-[state=indeterminate]:bg-action-danger-default',
  'group-hover/choice:enabled:data-invalid:data-[state=checked]:bg-action-danger-hover group-hover/choice:enabled:data-invalid:data-[state=indeterminate]:bg-action-danger-hover',
  // Disabled
  'disabled:border-border-disabled disabled:bg-bg-disabled disabled:text-icon-disabled',
  'disabled:data-[state=checked]:border-border-disabled disabled:data-[state=checked]:bg-bg-disabled',
  'disabled:data-[state=indeterminate]:border-border-disabled disabled:data-[state=indeterminate]:bg-bg-disabled',
];

type RootProps = Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'asChild' | 'children'>;

export interface CheckboxProps extends RootProps {
  /** Text next to the box. Leave empty only when another element labels it (`aria-label`). */
  label?: ReactNode;
  /** Secondary text under the label (Figma "Description"). */
  description?: ReactNode;
  /** Error message under this checkbox. Inside a CheckboxGroup, set `error` on the group instead. */
  error?: ReactNode;
  /** Shows the Error state without a message of its own. */
  invalid?: boolean;
}

/**
 * An independent on/off choice. `checked="indeterminate"` shows the "select all
 * some selected" mark and reads as "mixed" to screen readers.
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { label, description, error, invalid, id, disabled, className, 'aria-describedby': ariaDescribedBy, ...rest },
  ref,
) {
  const group = useChoiceGroup();
  const auto = useId();
  const controlId = id ?? `mds-${auto}`;
  const descriptionId = `${controlId}-description`;
  const errorId = `${controlId}-error`;
  const isDisabled = disabled ?? group.disabled;
  const isInvalid = Boolean(error) || invalid || group.invalid;
  const describedBy = [description ? descriptionId : null, error ? errorId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  const box = (
    <CheckboxPrimitive.Root
      ref={ref}
      {...rest}
      id={controlId}
      disabled={isDisabled}
      aria-invalid={isInvalid || undefined}
      aria-describedby={describedBy}
      data-invalid={isInvalid ? '' : undefined}
      className={cn(checkboxBoxClass, className)}
    >
      <CheckboxPrimitive.Indicator className="group/indicator flex items-center justify-center">
        <Icon name="check" size="sm" className="hidden group-data-[state=checked]/indicator:block" />
        <Icon name="minus" size="sm" className="hidden group-data-[state=indeterminate]/indicator:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  return (
    <div className="flex flex-col gap-stack-2xs">
      <ChoiceRow control={box} controlId={controlId} label={label} description={description} descriptionId={descriptionId} disabled={isDisabled} />
      {error && <FieldMessage id={errorId} tone="error">{error}</FieldMessage>}
    </div>
  );
});

export type CheckboxGroupProps = ChoiceGroupProps;

/**
 * A labelled set of related checkboxes, e.g. "Symptoms". Renders a fieldset
 * with a legend; an `error` marks every checkbox in the group.
 */
export function CheckboxGroup({ error, invalid = false, disabled = false, ...props }: CheckboxGroupProps) {
  const ids = useChoiceGroupIds();
  return (
    <ChoiceGroupContext.Provider value={{ invalid: Boolean(error) || invalid, disabled }}>
      <ChoiceGroupFrame {...props} error={error} disabled={disabled} ids={ids} as="fieldset" />
    </ChoiceGroupContext.Provider>
  );
}
