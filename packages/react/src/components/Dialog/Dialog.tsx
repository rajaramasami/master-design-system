import { forwardRef, useRef, useState, type ComponentPropsWithoutRef, type PointerEvent, type ReactNode } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { usePortalContainer } from '../../provider/ThemeProvider';
import { IconButton } from '../IconButton/IconButton';
import { focusFirst, OverlayFooter, Scrim } from '../Overlay/shared';

/*
 * Dialog, Drawer and BottomSheet share Radix Dialog: role="dialog", aria-modal,
 * a focus trap, Esc to close, and focus returned to the trigger. They differ in
 * where the panel sits and how it moves.
 */

type RootProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;
const TriggerBase = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>>(function Trigger(props, ref) {
  return <DialogPrimitive.Trigger ref={ref} asChild {...props} />;
});

interface PanelProps extends Omit<ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, 'title'> {
  /** Names the panel for screen readers. Required. */
  title: ReactNode;
  /** Short text under the title, read when the panel opens. */
  description?: ReactNode;
  /** Figma "Show Close". On by default. */
  showClose?: boolean;
  /** Actions at the bottom. Label them with the outcome ("Cancel appointment"), not "OK". */
  footer?: ReactNode;
}

function Header({ title, description, showClose, titleClass }: { title: ReactNode; description?: ReactNode; showClose: boolean; titleClass: string }) {
  return (
    <div className="flex items-start gap-inline-md">
      <div className="flex min-w-0 flex-1 flex-col gap-stack-xs">
        <DialogPrimitive.Title className={cn('text-text-primary', titleClass)}>{title}</DialogPrimitive.Title>
        {description && <DialogPrimitive.Description className="text-body-sm text-text-secondary">{description}</DialogPrimitive.Description>}
      </div>
      {showClose && (
        <DialogPrimitive.Close asChild>
          <IconButton variant="ghost" size="md" icon="close" label="Close" className="-mt-inset-xs -mr-inset-xs" />
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

/** Without a description, tell Radix there is none, so screen readers don't look for one. */
const noDescription = (description: ReactNode) => (description ? {} : { 'aria-describedby': undefined });

function useAutoFocus(onOpenAutoFocus?: (e: Event) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const handler = (e: Event) => {
    onOpenAutoFocus?.(e);
    if (!e.defaultPrevented) focusFirst(ref.current, e);
  };
  return { ref, handler };
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const r of refs) {
      if (typeof r === 'function') r(node);
      else if (r) (r as React.MutableRefObject<T | null>).current = node;
    }
  };
}

/* ---------------------------------------------------------------- Dialog */

export const Dialog = (props: RootProps) => <DialogPrimitive.Root {...props} />;
/** The element that opens the dialog. Wraps your Button with `asChild`. */
export const DialogTrigger = TriggerBase;
/** Closes the dialog. Wrap a footer Button: `<DialogClose asChild><Button>Cancel</Button></DialogClose>`. */
export const DialogClose = DialogPrimitive.Close;

export interface DialogContentProps extends PanelProps {
  /**
   * Figma Size: sm (dialog/width/sm, confirmations with no body), md (forms), lg (rich content).
   */
  size?: 'sm' | 'md' | 'lg';
}

const DIALOG_WIDTH = { sm: 'w-dialog-width-sm', md: 'w-dialog-width-md', lg: 'w-dialog-width-lg' } as const;

/**
 * A modal that interrupts to confirm a decision or complete a short task (Figma "Dialog").
 * Focus moves to the first field; with no field, to the primary action, or to the first
 * action when the primary is Danger, so an accidental Enter never confirms a destructive action.
 * Mark an element with `data-autofocus` to choose yourself. On phones prefer BottomSheet.
 */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { size = 'md', title, description, showClose = true, footer, children, className, onOpenAutoFocus, ...rest },
  ref,
) {
  const container = usePortalContainer();
  const auto = useAutoFocus(onOpenAutoFocus);
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay asChild>
        <Scrim />
      </DialogPrimitive.Overlay>
      <DialogPrimitive.Content
        ref={mergeRefs(ref, auto.ref)}
        onOpenAutoFocus={auto.handler}
        {...noDescription(description)}
        {...rest}
        className={cn(
          'mds-dialog fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2*var(--mds-spacing-inset-lg))] max-w-[calc(100vw-2*var(--mds-spacing-inset-lg))] -translate-x-1/2 -translate-y-1/2 flex-col gap-stack-lg overflow-y-auto',
          'rounded-sheet bg-bg-surface p-inset-xl text-text-primary shadow-elevation-xl outline-none',
          DIALOG_WIDTH[size],
          className,
        )}
      >
        <Header title={title} description={description} showClose={showClose} titleClass="text-heading-md" />
        {children && <div data-slot="overlay-body" className="text-body-md">{children}</div>}
        <OverlayFooter>{footer}</OverlayFooter>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

/* ---------------------------------------------------------------- Drawer */

export const Drawer = (props: RootProps) => <DialogPrimitive.Root {...props} />;
export const DrawerTrigger = TriggerBase;
export const DrawerClose = DialogPrimitive.Close;

export interface DrawerContentProps extends PanelProps {
  /** Figma Side: right (default) for details and forms, left for navigation on small screens. */
  side?: 'right' | 'left';
}

/**
 * A side panel for details or a longer task without leaving the page (Figma "Drawer").
 * Width drawer/width, full height; header, scrolling body, footer with a top border.
 * Modal by default (Scrim, focus trap); pass `modal={false}` on Drawer for a panel that doesn't block the page.
 */
export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(function DrawerContent(
  { side = 'right', title, description, showClose = true, footer, children, className, onOpenAutoFocus, ...rest },
  ref,
) {
  const container = usePortalContainer();
  const auto = useAutoFocus(onOpenAutoFocus);
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay asChild>
        <Scrim />
      </DialogPrimitive.Overlay>
      <DialogPrimitive.Content
        ref={mergeRefs(ref, auto.ref)}
        onOpenAutoFocus={auto.handler}
        {...noDescription(description)}
        {...rest}
        className={cn(
          'fixed inset-y-0 z-50 flex w-drawer-width max-w-full flex-col bg-bg-surface text-text-primary shadow-elevation-xl outline-none',
          side === 'right' ? 'mds-drawer-right right-0' : 'mds-drawer-left left-0',
          className,
        )}
      >
        <div className="p-inset-lg">
          <Header title={title} description={description} showClose={showClose} titleClass="text-heading-sm" />
        </div>
        <div data-slot="overlay-body" className="min-h-0 flex-1 overflow-y-auto px-inset-lg pb-inset-lg text-body-md">
          {children}
        </div>
        {footer && <OverlayFooter className="border-t border-border-subtle p-inset-lg">{footer}</OverlayFooter>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

/* ----------------------------------------------------------- Bottom sheet */

export const BottomSheet = (props: RootProps) => <DialogPrimitive.Root {...props} />;
export const BottomSheetTrigger = TriggerBase;
export const BottomSheetClose = DialogPrimitive.Close;

export interface BottomSheetContentProps extends PanelProps {
  /** Figma "Show Handle". The handle can be dragged down to close, but is never the only way to close. */
  showHandle?: boolean;
}

const DISMISS_DISTANCE = 96;

/**
 * Short tasks and options that slide up from the bottom edge on phones (Figma "Bottom Sheet").
 * Top corners radius/sheet; drag the handle down, tap the scrim, press Esc or use Close to dismiss.
 * Put a full-width lg Button in `footer`; it sits above the home indicator.
 */
export const BottomSheetContent = forwardRef<HTMLDivElement, BottomSheetContentProps>(function BottomSheetContent(
  { title, description, showClose = true, showHandle = true, footer, children, className, onOpenAutoFocus, style, ...rest },
  ref,
) {
  const container = usePortalContainer();
  const auto = useAutoFocus(onOpenAutoFocus);
  const closeRef = useRef<HTMLButtonElement>(null);
  const start = useRef<number | null>(null);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    start.current = e.clientY;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (start.current != null) setDrag(Math.max(0, e.clientY - start.current));
  };
  const onPointerUp = () => {
    if (drag > DISMISS_DISTANCE) closeRef.current?.click();
    start.current = null;
    setDragging(false);
    setDrag(0);
  };

  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay asChild>
        <Scrim />
      </DialogPrimitive.Overlay>
      <DialogPrimitive.Content
        ref={mergeRefs(ref, auto.ref)}
        onOpenAutoFocus={auto.handler}
        {...noDescription(description)}
        {...rest}
        style={{ ...style, translate: drag ? `0 ${drag}px` : undefined, transition: dragging ? 'none' : 'translate var(--mds-motion-duration-normal) var(--mds-motion-easing-standard)' }}
        className={cn(
          'mds-sheet fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col gap-stack-md rounded-t-sheet bg-bg-surface pt-inset-sm text-text-primary shadow-elevation-xl outline-none',
          'pb-[max(var(--mds-spacing-inset-sm),env(safe-area-inset-bottom))]',
          className,
        )}
      >
        {showHandle && (
          <div
            aria-hidden="true"
            className="-mb-stack-xs flex cursor-grab touch-none justify-center py-inset-xs active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="h-sheet-handle-height w-sheet-handle-width rounded-pill bg-border-default" />
          </div>
        )}
        <div className="px-inset-lg">
          <Header title={title} description={description} showClose={showClose} titleClass="text-heading-sm" />
        </div>
        {children && (
          <div data-slot="overlay-body" className="min-h-0 flex-1 overflow-y-auto px-inset-lg text-body-md">
            {children}
          </div>
        )}
        {footer && (
          <div data-slot="overlay-footer" className="flex flex-col gap-stack-sm px-inset-lg [&>*]:w-full">
            {footer}
          </div>
        )}
        <DialogPrimitive.Close ref={closeRef} className="hidden" tabIndex={-1} aria-hidden="true" />
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
