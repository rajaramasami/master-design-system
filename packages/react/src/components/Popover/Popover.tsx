import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { usePortalContainer } from '../../provider/ThemeProvider';
import { floatingSurfaceClass, OverlayFooter } from '../Overlay/shared';
import { IconButton } from '../IconButton/IconButton';

export const Popover = PopoverPrimitive.Root;
/** The element that opens the Popover on click. Wraps your Button with `asChild`. */
export const PopoverTrigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>>(
  function PopoverTrigger(props, ref) {
    return <PopoverPrimitive.Trigger ref={ref} asChild {...props} />;
  },
);
export const PopoverClose = PopoverPrimitive.Close;

type ContentProps = Omit<ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, 'title'>;

export interface PopoverContentProps extends ContentProps {
  /** Heading that names the popover for screen readers (Figma "Title"). */
  title?: ReactNode;
  /** Figma "Show Close". On by default. */
  showClose?: boolean;
  /** Actions at the bottom, e.g. a ghost and a primary sm Button (Figma "Show Footer"). */
  footer?: ReactNode;
}

/**
 * Rich, interactive content anchored to a trigger: an explanation, a quick edit
 * or a filter panel (Figma "Popover", 15 Overlays). Opens on click, not hover.
 * Focus moves in; Esc and outside click close it and return focus to the trigger.
 */
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  { title, showClose = true, footer, children, className, sideOffset = 8, align = 'start', ...rest },
  ref,
) {
  const container = usePortalContainer();
  const titleId = useId();
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        collisionPadding={8}
        aria-labelledby={title ? titleId : undefined}
        {...rest}
        className={cn(floatingSurfaceClass, 'flex w-80 max-w-[calc(100vw-16px)] flex-col gap-stack-sm p-inset-md', className)}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-inline-sm">
            {title && <h2 id={titleId} className="pt-inset-xs text-body-md-strong text-text-primary">{title}</h2>}
            {showClose && (
              <PopoverPrimitive.Close asChild>
                <IconButton variant="ghost" size="sm" icon="close" label="Close" className="-mt-inset-xs -mr-inset-xs ml-auto" />
              </PopoverPrimitive.Close>
            )}
          </div>
        )}
        <div data-slot="overlay-body" className="text-body-sm text-text-secondary">{children}</div>
        <OverlayFooter>{footer}</OverlayFooter>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});
