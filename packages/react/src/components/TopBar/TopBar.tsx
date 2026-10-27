import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';
import { useMds, type Platform } from '../../provider/ThemeProvider';
import { IconButton } from '../IconButton/IconButton';

export interface TopBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The page title. Rendered as the page's h1 by default. */
  title: ReactNode;
  titleAs?: 'h1' | 'h2' | 'p';
  /** Shows Back: "‹ Back" on iOS, an arrow IconButton on Android and web. */
  onBack?: () => void;
  /** iOS shows this next to the chevron, e.g. the previous screen's title. Default "Back". */
  backLabel?: string;
  /** Replaces Back, e.g. a menu IconButton that opens the navigation Drawer. */
  leading?: ReactNode;
  /**
   * Trailing content. Web: search, notifications, account. iOS: one text action (a ghost
   * Button). Android: up to two IconButtons plus an overflow Menu.
   */
  actions?: ReactNode;
  /** Overrides the platform from ThemeProvider. Figma Platform: Web, iOS, Android. */
  platform?: Platform;
}

/**
 * The bar at the top of a screen (Figma "Top Bar", 14 Navigation). Height from topbar/height:
 * 56 on web, 44 on iOS, 64 on Android. bg/surface with a bottom border/subtle.
 * Icon buttons need labels; the title is the page heading.
 */
export const TopBar = forwardRef<HTMLElement, TopBarProps>(function TopBar(
  { title, titleAs: Title = 'h1', onBack, backLabel = 'Back', leading, actions, platform, className, ...rest },
  ref,
) {
  const ctx = useMds();
  const p = platform ?? ctx.platform;
  const base = 'flex h-topbar-height w-full shrink-0 items-center gap-inline-sm border-b border-border-subtle bg-bg-surface';

  if (p === 'ios') {
    return (
      <header ref={ref} {...rest} className={cn(base, 'grid grid-cols-[1fr_auto_1fr] px-inset-sm', className)}>
        <div className="flex min-w-0 items-center">
          {leading ??
            (onBack && (
              <button
                type="button"
                onClick={onBack}
                className="-ml-inset-xs inline-flex min-h-target-min cursor-pointer items-center gap-stack-2xs rounded-control px-inset-xs text-body-md text-text-brand outline-none hovered:opacity-70 pressed:opacity-50 focus-visible:shadow-focus-ring-brand"
              >
                <Icon name="chevron-left" size="md" />
                <span className="truncate">{backLabel}</span>
              </button>
            ))}
        </div>
        <Title className="m-0 truncate text-center text-body-md-strong text-text-primary">{title}</Title>
        <div className="flex min-w-0 items-center justify-end">{actions}</div>
      </header>
    );
  }

  const back =
    leading ?? (onBack && <IconButton variant="ghost" size="md" icon="arrow-left" label={backLabel} onClick={onBack} />);
  return (
    <header ref={ref} {...rest} className={cn(base, p === 'android' ? 'px-inset-sm' : 'px-inset-lg', className)}>
      {back}
      <Title className="m-0 min-w-0 flex-1 truncate text-heading-sm text-text-primary">{title}</Title>
      {actions && <div className="flex shrink-0 items-center gap-inline-sm">{actions}</div>}
    </header>
  );
});
