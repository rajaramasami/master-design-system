import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { ChoiceRow } from '../Field/Choice';

/*
 * The track and thumb from the Figma set "Switch" (11 Inputs). Checked = Off, On;
 * State = Default, Hover, Pressed, Focus, Disabled. Track and thumb sizes come from
 * the Platform collection: web 36x20, iOS 51x31, Android 52x32.
 */
const trackClass = [
  'relative inline-flex h-switch-track-height w-switch-track-width shrink-0 cursor-[inherit] items-center rounded-pill p-switch-inset outline-none',
  'bg-action-toggle-off group-hover/choice:enabled:bg-action-toggle-off-hover group-active/choice:enabled:bg-action-toggle-off-hover',
  'data-[state=checked]:bg-action-primary-default group-hover/choice:enabled:data-[state=checked]:bg-action-primary-hover group-active/choice:enabled:data-[state=checked]:bg-action-primary-pressed',
  'disabled:bg-icon-disabled disabled:data-[state=checked]:bg-icon-disabled',
  'transition-[background-color,box-shadow] duration-(--mds-motion-duration-fast) ease-standard',
];

const thumbClass = [
  'block size-switch-thumb-size rounded-pill bg-action-toggle-thumb',
  'transition-transform duration-(--mds-motion-duration-fast) ease-standard',
  'data-[state=checked]:translate-x-[calc(var(--mds-switch-track-width)-var(--mds-switch-thumb-size)-2*var(--mds-switch-inset))]',
  'group-data-disabled/choice:bg-bg-surface',
];

type RootProps = Omit<ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'asChild' | 'children'>;

export interface SwitchProps extends RootProps {
  /** Names the setting, not its state: "Appointment reminders", not "On". */
  label?: ReactNode;
  /** Secondary text under the label. */
  description?: ReactNode;
}

/** An on/off setting that applies immediately, without a Save button. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, description, id, disabled, className, 'aria-describedby': ariaDescribedBy, ...rest },
  ref,
) {
  const auto = useId();
  const controlId = id ?? `mds-${auto}`;
  const descriptionId = `${controlId}-description`;
  const describedBy = [description ? descriptionId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  const track = (
    <SwitchPrimitive.Root ref={ref} {...rest} id={controlId} disabled={disabled} aria-describedby={describedBy} className={cn(trackClass, className)}>
      <SwitchPrimitive.Thumb className={cn(thumbClass)} />
    </SwitchPrimitive.Root>
  );

  return <ChoiceRow control={track} controlId={controlId} label={label} description={description} descriptionId={descriptionId} disabled={disabled} />;
});
