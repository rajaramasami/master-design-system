import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Floating surface shared by Menu, Popover and the Select list (Figma: surface-raised, border/subtle, elevation/md, radius/surface). */
export const floatingSurfaceClass =
  'mds-pop z-50 rounded-surface border border-border-subtle bg-bg-surface-raised text-text-primary shadow-elevation-md outline-none';

export interface ScrimProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Dims the page behind a Dialog, modal Drawer or Bottom Sheet (Figma "Scrim", color/bg/overlay).
 * Dialog, Drawer and BottomSheet render it for you. Hidden from assistive technology.
 */
export const Scrim = forwardRef<HTMLDivElement, ScrimProps>(function Scrim({ className, ...rest }, ref) {
  return <div ref={ref} aria-hidden="true" {...rest} className={cn('mds-fade fixed inset-0 z-40 bg-bg-overlay', className)} />;
});

/** Moves focus into an opened modal: a [data-autofocus] element, the first field, else the safest footer action. */
export function focusFirst(container: HTMLElement | null, event: Event) {
  if (!container) return;
  const target =
    container.querySelector<HTMLElement>('[data-autofocus]') ??
    container.querySelector<HTMLElement>(
      '[data-slot="overlay-body"] :is(input, select, textarea, [role="combobox"], [role="checkbox"], [role="radio"], [role="switch"]):not(:disabled)',
    ) ??
    footerTarget(container);
  if (target) {
    event.preventDefault();
    target.focus();
  }
}

/**
 * The primary (last) footer action, except for destructive dialogs: then Cancel,
 * so an accidental Enter never deletes anything (WAI-ARIA dialog guidance).
 */
function footerTarget(container: HTMLElement) {
  const buttons = [...container.querySelectorAll<HTMLElement>('[data-slot="overlay-footer"] button:not(:disabled), [data-slot="overlay-footer"] a[href]')];
  if (buttons.length === 0) return null;
  const last = buttons[buttons.length - 1]!;
  return last.dataset.variant === 'danger' ? buttons[0]! : last;
}

export function OverlayFooter({ children, className }: { children?: ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <div data-slot="overlay-footer" className={cn('flex flex-wrap items-center justify-end gap-inline-sm', className)}>
      {children}
    </div>
  );
}
