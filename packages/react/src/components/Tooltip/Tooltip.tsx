import { type ReactElement, type ReactNode } from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { usePortalContainer } from '../../provider/ThemeProvider';

export interface TooltipProps {
  /** One short phrase. No links or actions: use a Popover for those. */
  content: ReactNode;
  /** The element that shows the tooltip: usually an IconButton. Must be focusable. */
  children: ReactElement;
  /** Figma Placement: top (default), bottom, left, right. Flips when there is no room. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing, in ms. Figma guidance: about 300. */
  delay?: number;
  /** Controlled open state, mainly for docs and tests. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * A short label on hover and keyboard focus (Figma "Tooltip", 15 Overlays).
 * bg/inverse with text/inverse, body/sm, max width tooltip/max-width.
 * Esc and blur hide it. Touch has no hover, so never put essential information only here.
 */
export function Tooltip({ content, children, side = 'top', delay = 300, open, defaultOpen, onOpenChange, className }: TooltipProps) {
  const container = usePortalContainer();
  return (
    <TooltipPrimitive.Provider delayDuration={delay} skipDelayDuration={300}>
      <TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal container={container}>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            collisionPadding={8}
            className={cn(
              'mds-pop z-50 max-w-tooltip-max-width rounded-control bg-bg-inverse px-inset-sm py-inset-xs text-body-sm text-text-inverse',
              className,
            )}
          >
            {content}
            <TooltipPrimitive.Arrow width={10} height={5} className="fill-bg-inverse" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
