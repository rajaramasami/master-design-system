import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Toast as ToastPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';
import { useMds } from '../../provider/ThemeProvider';
import { IconButton } from '../IconButton/IconButton';
import { Button } from '../Button/Button';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const TONE: Record<ToastTone, { icon: IconName; color: string }> = {
  neutral: { icon: 'bell', color: 'text-icon-secondary' },
  success: { icon: 'success', color: 'text-icon-success' },
  warning: { icon: 'warning', color: 'text-icon-warning' },
  danger: { icon: 'alert', color: 'text-icon-danger' },
  info: { icon: 'info', color: 'text-icon-info' },
};

export interface ToastOptions {
  /** Short confirmation, e.g. "Appointment booked". */
  title: ReactNode;
  /** One supporting line (Figma "Show Description"). */
  description?: ReactNode;
  tone?: ToastTone;
  /** One action, usually Undo (Figma "Show Action"). Toasts with an action never auto-dismiss. */
  action?: { label: string; onClick: () => void; altText?: string };
  /** Milliseconds before it hides. Default 5000; never for Danger or toasts with an action. */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
  open: boolean;
}

const MAX_VISIBLE = 3;

const ToastContext = createContext<((options: ToastOptions) => number) | null>(null);

/**
 * Shows a toast. Must be inside a ToastProvider.
 *
 *   const toast = useToast();
 *   toast({ title: 'Appointment booked', tone: 'success' });
 */
export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error('useToast must be used inside <ToastProvider>.');
  return show;
}

/**
 * Hosts toasts (Figma "Toast", 13 Feedback): bottom-right on web, bottom-centre on iOS and
 * Android, newest on top, at most three at once. Pauses while hovered or focused; F8 moves focus to the toasts.
 * Put it inside ThemeProvider so toasts get the theme.
 */
export function ToastProvider({ children, label = 'Notifications' }: { children: ReactNode; label?: string }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const { platform } = useMds();

  const show = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    setItems((list) => {
      // At most three on screen: adding a fourth closes the oldest open one.
      const next = [{ ...options, id, open: true }, ...list];
      let open = 0;
      return next.map((t) => (t.open && ++open > MAX_VISIBLE ? { ...t, open: false } : t));
    });
    return id;
  }, []);

  // Remove closed toasts after their closing animation.
  useEffect(() => {
    if (!items.some((t) => !t.open)) return;
    const timer = setTimeout(() => setItems((list) => list.filter((t) => t.open)), 400);
    return () => clearTimeout(timer);
  }, [items]);

  const setOpen = (id: number, open: boolean) => {
    setItems((list) => list.map((t) => (t.id === id ? { ...t, open } : t)));
  };

  const value = useMemo(() => show, [show]);
  const centred = platform !== 'web';

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider label={label} swipeDirection={centred ? 'down' : 'right'}>
        {children}
        {items.map((t) => {
          const tone = t.tone ?? 'neutral';
          const sticky = tone === 'danger' || t.action != null;
          return (
            <ToastPrimitive.Root
              key={t.id}
              open={t.open}
              onOpenChange={(o) => setOpen(t.id, o)}
              duration={sticky ? Infinity : (t.duration ?? 5000)}
              type={tone === 'danger' ? 'foreground' : 'background'}
              className={cn(
                'mds-toast pointer-events-auto flex w-full items-start gap-inline-md rounded-surface border border-border-subtle bg-bg-surface-raised p-inset-md text-text-primary shadow-elevation-lg',
              )}
            >
              <span className="flex h-[var(--mds-text-body-sm-line-height)] shrink-0 items-center">
                <Icon name={TONE[tone].icon} size="md" className={TONE[tone].color} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-stack-xs">
                <ToastPrimitive.Title className="text-body-sm-strong">{t.title}</ToastPrimitive.Title>
                {t.description && <ToastPrimitive.Description className="text-body-sm text-text-secondary">{t.description}</ToastPrimitive.Description>}
              </div>
              {t.action && (
                <ToastPrimitive.Action altText={t.action.altText ?? t.action.label} asChild>
                  <Button variant="ghost" size="sm" onClick={t.action.onClick} className="-my-inset-xs">{t.action.label}</Button>
                </ToastPrimitive.Action>
              )}
              <ToastPrimitive.Close asChild>
                <IconButton variant="ghost" size="sm" icon="close" label="Dismiss" className="-my-inset-xs -mr-inset-xs" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          );
        })}
        <ToastPrimitive.Viewport
          className={cn(
            'fixed bottom-0 z-[60] m-0 flex w-[min(100vw,calc(380px+2*var(--mds-spacing-inset-lg)))] list-none flex-col gap-stack-sm p-inset-lg outline-none',
            'pb-[max(var(--mds-spacing-inset-lg),env(safe-area-inset-bottom))]',
            centred ? 'left-1/2 -translate-x-1/2' : 'right-0',
          )}
        />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
