import { createContext, forwardRef, useContext, type ComponentPropsWithoutRef } from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';

type TabsStyle = 'underline' | 'pill';
const StyleContext = createContext<TabsStyle>('underline');

export interface TabsProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  /**
   * Figma Style. Underline for page sections; Pill for compact view switches inside a card
   * or toolbar.
   */
  variant?: TabsStyle;
}

/**
 * Switches between views of the same content (Figma "Tabs" and "Tab", 14 Navigation).
 * Use 2 to 6 tabs. For moving to another page, use navigation (Sidebar, Tab Bar) instead.
 *
 *   <Tabs defaultValue="overview">
 *     <TabsList aria-label="Patient record">
 *       <TabsTrigger value="overview">Overview</TabsTrigger>
 *       <TabsTrigger value="results" count={3}>Results</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="overview">…</TabsContent>
 *   </Tabs>
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs({ variant = 'underline', className, ...rest }, ref) {
  return (
    <StyleContext.Provider value={variant}>
      <TabsPrimitive.Root ref={ref} {...rest} className={cn('flex flex-col gap-stack-md', className)} />
    </StyleContext.Provider>
  );
});

export type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  /** Names the set of tabs for screen readers, e.g. "Patient record". */
  'aria-label': string;
};

/** The row of tabs (role="tablist"). Scrolls sideways on small screens instead of wrapping. */
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList({ className, ...rest }, ref) {
  const style = useContext(StyleContext);
  return (
    <TabsPrimitive.List
      ref={ref}
      {...rest}
      className={cn(
        'flex max-w-full items-center gap-inline-xs overflow-x-auto [scrollbar-width:none]',
        style === 'underline' ? 'border-b border-border-subtle' : 'w-fit rounded-pill bg-bg-subtle p-inline-xs',
        className,
      )}
    />
  );
});

export interface TabsTriggerProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  /** Figma "Show Icon": a leading icon. */
  icon?: IconName;
  /** Figma "Show Count": a small count after the label, e.g. unread results. */
  count?: number;
  /** Read with the count, e.g. "new". Default reads just the number. */
  countLabel?: string;
}

/** One tab (Figma "Tab"). Arrow keys move between tabs; Tab moves into the panel. */
export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { icon, count, countLabel, className, children, ...rest },
  ref,
) {
  const style = useContext(StyleContext);
  const underline = style === 'underline';
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      {...rest}
      className={cn(
        'group relative inline-flex shrink-0 cursor-pointer select-none items-center gap-inline-sm whitespace-nowrap text-label-md outline-none',
        'transition-[background-color,color,box-shadow] duration-(--mds-motion-duration-fast) ease-standard',
        'text-text-secondary hovered:bg-action-ghost-hover hovered:text-text-primary pressed:bg-action-ghost-pressed pressed:text-text-primary',
        'focus-visible:bg-action-ghost-hover focus-visible:text-text-primary',
        'unavailable:cursor-not-allowed unavailable:text-text-disabled',
        underline
          ? [
              'h-control-md rounded-t-control px-inset-sm',
              // Inset ring: the list scrolls sideways, which would clip an outer ring.
              'focus-visible:shadow-[inset_0_0_0_2px_var(--mds-color-focus-ring)]',
              // 2 px indicator over the list's 1 px bottom border.
              'after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-transparent after:content-[""]',
              'hovered:after:bg-border-default pressed:after:bg-border-default',
              'data-[state=active]:text-text-primary data-[state=active]:after:bg-border-brand',
              'unavailable:data-[state=active]:after:bg-border-disabled',
            ]
          : [
              'h-control-sm rounded-pill border border-transparent px-inset-md focus-visible:shadow-focus-ring-brand',
              'data-[state=active]:border-border-brand data-[state=active]:bg-action-primary-subtle data-[state=active]:text-text-brand',
            ],
        className,
      )}
    >
      {icon && <Icon name={icon} size="sm" />}
      <span>{children}</span>
      {count != null && (
        <span
          className={cn(
            'inline-flex h-badge-height-sm min-w-badge-height-sm items-center justify-center rounded-pill px-inline-xs text-label-sm tabular-nums',
            'bg-bg-muted text-text-secondary group-data-[state=active]:bg-action-primary-subtle group-data-[state=active]:text-text-brand',
          )}
        >
          {count}
          {countLabel && <span className="sr-only"> {countLabel}</span>}
        </span>
      )}
    </TabsPrimitive.Trigger>
  );
});

/** The panel for one tab (role="tabpanel"), named by its tab. */
export const TabsContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(function TabsContent(
  { className, ...rest },
  ref,
) {
  return <TabsPrimitive.Content ref={ref} {...rest} className={cn('rounded-control outline-none focus-visible:shadow-focus-ring-brand', className)} />;
});

