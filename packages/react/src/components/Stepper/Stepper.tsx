import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';

export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';

export interface StepItem {
  label: ReactNode;
  /** Figma "Description": a date, a short instruction or, for Error, what went wrong. */
  description?: ReactNode;
  /** Set `error` to flag a step; other statuses come from `current`. */
  status?: 'error';
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: StepItem[];
  /** Index of the current step (0-based). Earlier steps are complete, later ones upcoming. */
  current: number;
  /**
   * horizontal (web and tablet), vertical (narrow columns and phones), or compact
   * ("Step 2 of 4" with the current label, for phones with little room).
   */
  orientation?: 'horizontal' | 'vertical' | 'compact';
}

const STATUS_TEXT: Record<StepStatus, string> = { complete: 'Completed', current: 'Current step', upcoming: 'Not started', error: 'Needs attention' };

function statusOf(steps: StepItem[], i: number, current: number): StepStatus {
  if (steps[i]!.status === 'error') return 'error';
  return i < current ? 'complete' : i === current ? 'current' : 'upcoming';
}

function Indicator({ status, n }: { status: StepStatus; n: number }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-step-indicator-size shrink-0 items-center justify-center rounded-pill text-label-sm tabular-nums',
        status === 'complete' && 'bg-action-primary-default text-icon-on-action',
        status === 'current' && 'border-2 border-border-brand bg-bg-surface text-text-brand',
        status === 'upcoming' && 'border border-border-strong bg-bg-surface text-text-secondary',
        status === 'error' && 'border border-border-danger bg-status-danger-bg text-icon-danger',
      )}
    >
      {status === 'complete' ? <Icon name="check" size="sm" /> : status === 'error' ? <Icon name="alert" size="sm" /> : n}
    </span>
  );
}

/**
 * Progress through a fixed sequence such as a booking flow or care plan (Figma "Stepper" and
 * "Step", 14 Navigation). Each status differs by shape or icon, not only colour, and screen
 * readers hear the status before each label. Steps are not links.
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, current, orientation = 'horizontal', className, ...rest },
  ref,
) {
  if (orientation === 'compact') {
    const step = steps[current];
    const status = statusOf(steps, current, current);
    return (
      <ol ref={ref} {...rest} className={cn('m-0 flex list-none items-center gap-inline-sm p-0', className)}>
        <li aria-current="step" className="flex items-center gap-inline-sm">
          <Indicator status={status} n={current + 1} />
          <span className="flex flex-col">
            <span className="text-caption text-text-secondary">Step {current + 1} of {steps.length}</span>
            <span className="text-body-sm-strong text-text-primary">{step?.label}</span>
          </span>
        </li>
      </ol>
    );
  }

  const vertical = orientation === 'vertical';
  return (
    <ol ref={ref} {...rest} className={cn('m-0 flex list-none p-0', vertical ? 'flex-col' : 'items-start gap-inline-sm', className)}>
      {steps.map((step, i) => {
        const status = statusOf(steps, i, current);
        const last = i === steps.length - 1;
        const connector = cn(status === 'complete' ? 'bg-border-brand' : 'bg-border-default');
        return (
          <li
            key={i}
            aria-current={status === 'current' ? 'step' : undefined}
            className={cn('flex', vertical ? 'gap-inline-sm' : cn('items-start gap-inline-sm', !last && 'min-w-0 flex-1'))}
          >
            {vertical ? (
              <span className="flex flex-col items-center">
                <Indicator status={status} n={i + 1} />
                {!last && <span aria-hidden="true" className={cn('my-stack-2xs min-h-stack-md w-[2px] flex-1 rounded-pill', connector)} />}
              </span>
            ) : (
              <Indicator status={status} n={i + 1} />
            )}
            <span className={cn('flex min-w-0 flex-col', vertical && !last && 'pb-stack-md')}>
              <span className="sr-only">{STATUS_TEXT[status]}: </span>
              <span className={cn(status === 'current' ? 'text-body-sm-strong' : 'text-body-sm', status === 'upcoming' ? 'text-text-secondary' : 'text-text-primary')}>
                {step.label}
              </span>
              {step.description && (
                <span className={cn('text-body-sm', status === 'error' ? 'text-text-danger' : status === 'upcoming' ? 'text-text-tertiary' : 'text-text-secondary')}>
                  {step.description}
                </span>
              )}
            </span>
            {!vertical && !last && (
              <span aria-hidden="true" className="flex h-step-indicator-size min-w-stack-lg flex-1 items-center">
                <span className={cn('h-[2px] w-full rounded-pill', connector)} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
});
