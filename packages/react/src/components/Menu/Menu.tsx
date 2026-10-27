import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { DropdownMenu as MenuPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';
import { usePortalContainer } from '../../provider/ThemeProvider';
import { floatingSurfaceClass } from '../Overlay/shared';

/*
 * The row from the Figma set "Menu Item" (15 Overlays), shared with Select options.
 * Type Default | Danger; State Default, Hover, Pressed, Focus (keyboard highlight),
 * Selected (bg/selected + check), Disabled. Height size/row/sm.
 * Radix moves focus to the highlighted item, so :focus-visible shows the ring only for keyboard use.
 */
export const menuItemClass = [
  'group/item relative flex min-h-row-sm w-full cursor-pointer select-none items-center gap-inline-sm rounded-control px-inset-sm py-inset-xs',
  'text-body-sm text-text-primary outline-none [--item-icon:var(--mds-color-icon-secondary)]',
  'data-highlighted:bg-action-ghost-hover active:bg-action-ghost-pressed',
  'data-[state=checked]:bg-bg-selected',
  'data-[variant=danger]:text-text-danger data-[variant=danger]:[--item-icon:var(--mds-color-icon-danger)]',
  'data-[variant=danger]:data-highlighted:bg-status-danger-bg data-[variant=danger]:active:bg-status-danger-bg data-[variant=danger]:focus-visible:shadow-focus-ring-danger',
  'data-disabled:pointer-events-none data-disabled:text-text-disabled data-disabled:[--item-icon:var(--mds-color-icon-disabled)]',
  'data-disabled:data-[variant=danger]:text-text-disabled data-disabled:data-[variant=danger]:[--item-icon:var(--mds-color-icon-disabled)]',
];

const shortcutClass = 'ml-auto pl-inset-sm text-caption text-text-tertiary group-data-disabled/item:text-text-disabled';

export const Menu = MenuPrimitive.Root;

/** The element that opens the menu. Wraps your Button or IconButton with `asChild`. */
export const MenuTrigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof MenuPrimitive.Trigger>>(function MenuTrigger(props, ref) {
  return <MenuPrimitive.Trigger ref={ref} asChild {...props} />;
});

export type MenuContentProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;

/**
 * The floating list (Figma "Menu"). Opens below its trigger and flips when there is
 * no room. Arrow keys move, Enter selects, typing jumps to a match, Esc closes and
 * returns focus to the trigger.
 */
export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(function MenuContent(
  { className, sideOffset = 4, align = 'start', ...rest },
  ref,
) {
  const container = usePortalContainer();
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        collisionPadding={8}
        {...rest}
        className={cn(
          floatingSurfaceClass,
          'flex max-h-(--radix-dropdown-menu-content-available-height) min-w-[max(var(--radix-dropdown-menu-trigger-width),15.5rem)] flex-col gap-stack-2xs overflow-y-auto p-inset-xs',
          className,
        )}
      />
    </MenuPrimitive.Portal>
  );
});

interface ItemExtras {
  /** Leading icon (Figma "Leading Icon"). */
  icon?: IconName;
  /** Keyboard shortcut shown at the end, e.g. "⌘E". Display only: wire the shortcut yourself. */
  shortcut?: string;
  /** Figma Type: Danger for destructive actions such as Delete. */
  variant?: 'default' | 'danger';
}

function ItemInner({ icon, shortcut, children, trailing }: Omit<ItemExtras, 'variant'> & { children?: ReactNode; trailing?: ReactNode }) {
  return (
    <>
      {icon && <Icon name={icon} size="sm" className="text-(--item-icon)" />}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut && <span className={shortcutClass}>{shortcut}</span>}
      {trailing}
    </>
  );
}

export type MenuItemProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & ItemExtras;

/** An action in a Menu. Use `onSelect` to run it; the menu closes afterwards. */
export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(
  { icon, shortcut, variant = 'default', className, children, ...rest },
  ref,
) {
  return (
    <MenuPrimitive.Item ref={ref} {...rest} data-variant={variant} className={cn(menuItemClass, className)}>
      <ItemInner icon={icon} shortcut={shortcut}>{children}</ItemInner>
    </MenuPrimitive.Item>
  );
});

const selectedCheck = (Indicator: typeof MenuPrimitive.ItemIndicator) => (
  <Indicator className="ml-auto flex">
    <Icon name="check" size="sm" className="text-icon-brand" />
  </Indicator>
);

export type MenuRadioItemProps = ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem> & Omit<ItemExtras, 'variant'>;

/** Single choice inside a MenuRadioGroup (Figma State=Selected: bg/selected + check). Reads as menuitemradio. */
export const MenuRadioItem = forwardRef<HTMLDivElement, MenuRadioItemProps>(function MenuRadioItem(
  { icon, shortcut, className, children, ...rest },
  ref,
) {
  return (
    <MenuPrimitive.RadioItem ref={ref} {...rest} className={cn(menuItemClass, className)}>
      <ItemInner icon={icon} shortcut={shortcut} trailing={selectedCheck(MenuPrimitive.ItemIndicator)}>{children}</ItemInner>
    </MenuPrimitive.RadioItem>
  );
});
export const MenuRadioGroup = MenuPrimitive.RadioGroup;

export type MenuCheckboxItemProps = ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem> & Omit<ItemExtras, 'variant'>;

/** An on/off option that keeps the menu open. Reads as menuitemcheckbox. */
export const MenuCheckboxItem = forwardRef<HTMLDivElement, MenuCheckboxItemProps>(function MenuCheckboxItem(
  { icon, shortcut, className, children, ...rest },
  ref,
) {
  return (
    <MenuPrimitive.CheckboxItem ref={ref} {...rest} className={cn(menuItemClass, className)}>
      <ItemInner icon={icon} shortcut={shortcut} trailing={selectedCheck(MenuPrimitive.ItemIndicator)}>{children}</ItemInner>
    </MenuPrimitive.CheckboxItem>
  );
});

/** A section heading inside a menu (Figma "section label", overline style). */
export function MenuLabel({ className, ...rest }: ComponentPropsWithoutRef<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label {...rest} className={cn('px-inset-sm py-inset-xs text-overline uppercase text-text-tertiary', className)} />;
}

export function MenuSeparator({ className, ...rest }: ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator {...rest} className={cn('-mx-inset-xs my-stack-2xs h-px bg-border-subtle', className)} />;
}

export const MenuGroup = MenuPrimitive.Group;
export const MenuSub = MenuPrimitive.Sub;

/** Opens a submenu (Figma "Show Submenu": chevron at the end). Right arrow opens it, left closes it. */
export const MenuSubTrigger = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger> & Omit<ItemExtras, 'variant' | 'shortcut'>>(
  function MenuSubTrigger({ icon, className, children, ...rest }, ref) {
    return (
      <MenuPrimitive.SubTrigger ref={ref} {...rest} className={cn(menuItemClass, 'data-[state=open]:bg-action-ghost-hover', className)}>
        <ItemInner icon={icon} trailing={<Icon name="chevron-right" size="sm" className="ml-auto text-(--item-icon)" />}>{children}</ItemInner>
      </MenuPrimitive.SubTrigger>
    );
  },
);

export const MenuSubContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>>(function MenuSubContent(
  { className, ...rest },
  ref,
) {
  const container = usePortalContainer();
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.SubContent
        ref={ref}
        sideOffset={4}
        collisionPadding={8}
        {...rest}
        className={cn(floatingSurfaceClass, 'flex min-w-[15.5rem] flex-col gap-stack-2xs p-inset-xs', className)}
      />
    </MenuPrimitive.Portal>
  );
});
