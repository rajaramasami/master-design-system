import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { RadioGroup as RadioPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { ChoiceGroupContext, ChoiceGroupFrame, ChoiceRow, useChoiceGroup, useChoiceGroupIds, type ChoiceGroupProps } from '../Field/Choice';

/*
 * The circle from the Figma set "Radio" (11 Inputs). Checked = Unchecked, Checked;
 * State = Default, Hover, Pressed, Focus, Error, Disabled. Checked has a 2px
 * border/brand ring and an action/primary dot.
 *
 * Note: in Figma the dot is the space left by the circle's padding, which is bound
 * to spacing/inset/xs, so the dot shrinks from 12px to 4px in Comfortable density.
 * Here the dot is a fixed 60% of the circle (12px on web) in every density.
 */
const radioCircleClass = [
  'inline-flex size-icon-md shrink-0 cursor-[inherit] items-center justify-center rounded-pill outline-none',
  'border border-border-strong bg-bg-surface',
  'transition-[background-color,border-color,box-shadow] duration-(--mds-motion-duration-fast) ease-standard',
  'group-hover/choice:enabled:bg-bg-subtle group-active/choice:enabled:bg-bg-muted',
  'data-[state=checked]:border-2 data-[state=checked]:border-border-brand',
  'data-invalid:border-border-danger data-invalid:data-[state=checked]:border-border-danger data-invalid:focus-visible:shadow-focus-ring-danger',
  'disabled:border-border-disabled disabled:bg-bg-disabled disabled:data-[state=checked]:border-border-disabled',
  '[--dot:var(--mds-color-action-primary-default)] group-hover/choice:enabled:[--dot:var(--mds-color-action-primary-hover)] group-active/choice:enabled:[--dot:var(--mds-color-action-primary-pressed)]',
  'data-invalid:[--dot:var(--mds-color-action-danger-default)] group-hover/choice:enabled:data-invalid:[--dot:var(--mds-color-action-danger-default)] disabled:[--dot:var(--mds-color-icon-disabled)]',
];

type ItemProps = Omit<ComponentPropsWithoutRef<typeof RadioPrimitive.Item>, 'asChild' | 'children'>;

export interface RadioProps extends ItemProps {
  /** The option's text. */
  label: ReactNode;
  /** Secondary text under the label. */
  description?: ReactNode;
}

/** One option inside a RadioGroup. */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  { label, description, id, disabled, className, ...rest },
  ref,
) {
  const group = useChoiceGroup();
  const auto = useId();
  const controlId = id ?? `mds-${auto}`;
  const descriptionId = `${controlId}-description`;
  const isDisabled = disabled ?? group.disabled;

  const circle = (
    <RadioPrimitive.Item
      ref={ref}
      {...rest}
      id={controlId}
      disabled={isDisabled}
      aria-describedby={description ? descriptionId : undefined}
      data-invalid={group.invalid ? '' : undefined}
      className={cn(radioCircleClass, className)}
    >
      <RadioPrimitive.Indicator className="block size-[60%] rounded-pill bg-(--dot)" />
    </RadioPrimitive.Item>
  );

  return <ChoiceRow control={circle} controlId={controlId} label={label} description={description} descriptionId={descriptionId} disabled={isDisabled} />;
});

type RootProps = Omit<ComponentPropsWithoutRef<typeof RadioPrimitive.Root>, 'asChild' | 'orientation' | 'disabled' | 'dir'>;

export interface RadioGroupProps extends RootProps, Omit<ChoiceGroupProps, 'className' | 'children'> {
  className?: string;
  children?: ReactNode;
}

/**
 * One choice from a small visible set (2 to 6 options; use Select for more).
 * Arrow keys move the selection; Tab moves in and out of the group.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { label, description, error, invalid = false, hideLabel, disabled = false, orientation = 'vertical', className, children, ...rest },
  ref,
) {
  const ids = useChoiceGroupIds();
  const isInvalid = Boolean(error) || invalid;
  const describedBy = [description ? ids.descriptionId : null, error ? ids.errorId : null].filter(Boolean).join(' ') || undefined;
  return (
    <ChoiceGroupContext.Provider value={{ invalid: isInvalid, disabled }}>
      <ChoiceGroupFrame ids={ids} label={label} hideLabel={hideLabel} description={description} error={error} disabled={disabled} className={className}>
        <RadioPrimitive.Root
          ref={ref}
          {...rest}
          disabled={disabled}
          orientation={orientation}
          aria-labelledby={ids.labelId}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          className={cn('flex', orientation === 'horizontal' ? 'flex-row flex-wrap gap-x-inline-lg gap-y-stack-xs' : 'flex-col gap-stack-xs')}
        >
          {children}
        </RadioPrimitive.Root>
      </ChoiceGroupFrame>
    </ChoiceGroupContext.Provider>
  );
});
