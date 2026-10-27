import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { Icon, type IconSize } from '../../icons/Icon';
import type { IconName } from '../../icons/registry';
import { usePortalContainer } from '../../provider/ThemeProvider';
import { FieldFooter, FieldLabel, useFieldIds, type FieldProps } from '../Field/Field';
import { fieldBoxVariants } from '../TextField/TextField';
import { floatingSurfaceClass } from '../Overlay/shared';
import { menuItemClass } from '../Menu/Menu';

type RootProps = Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Root>, 'children' | 'dir'>;

export interface SelectProps extends RootProps, FieldProps {
  /** Shown until a value is chosen (Figma "Placeholder"). */
  placeholder?: string;
  /** Figma Size: sm 32, md 40, lg 48 on web. */
  size?: 'sm' | 'md' | 'lg';
  /** Icon at the start of the field (Figma "Prefix Icon"). */
  prefixIcon?: IconName;
  id?: string;
  className?: string;
  /** SelectItem elements. */
  children: ReactNode;
}

const ICON_SIZE: Record<'sm' | 'md' | 'lg', IconSize> = { sm: 'sm', md: 'md', lg: 'md' };

/**
 * Choose one value from a short known list, under about 15 options (Figma "Select", 11 Inputs).
 * Same anatomy and tokens as TextField with a trailing chevron; the list uses the Menu Item style.
 * Keyboard: Space, Enter or arrows open it; arrows move, typing jumps, Enter selects, Esc closes.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { label, hideLabel, description, error, placeholder, size = 'md', prefixIcon, id, className, disabled, children, ...rest },
  ref,
) {
  const container = usePortalContainer();
  const f = useFieldIds(id, { description, error });
  const iconSize = ICON_SIZE[size];

  return (
    <div className={cn('flex flex-col', size === 'sm' ? 'gap-stack-xs' : 'gap-stack-sm', className)}>
      <FieldLabel htmlFor={f.inputId} hidden={hideLabel} disabled={disabled}>{label}</FieldLabel>
      <SelectPrimitive.Root disabled={disabled} {...rest}>
        <SelectPrimitive.Trigger
          ref={ref}
          id={f.inputId}
          aria-invalid={f.showError || undefined}
          aria-describedby={f.describedBy}
          data-invalid={f.showError ? '' : undefined}
          className={cn(
            fieldBoxVariants({ size }),
            'group/select cursor-pointer text-left text-text-primary outline-none focus-visible:shadow-focus-ring-brand',
            'data-[state=open]:border-border-brand data-[state=open]:shadow-focus-ring-brand data-[state=open]:bg-bg-surface',
            'data-invalid:focus-visible:shadow-focus-ring-danger',
            'data-placeholder:text-text-tertiary data-disabled:text-text-disabled',
          )}
        >
          {prefixIcon && <Icon name={prefixIcon} size={iconSize} className={disabled ? 'text-icon-disabled' : 'text-icon-secondary'} />}
          <span className="min-w-0 flex-1 truncate">
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>
          <SelectPrimitive.Icon asChild>
            <Icon
              name="chevron-down"
              size={iconSize}
              className={cn(
                'transition-transform duration-(--mds-motion-duration-fast) ease-standard group-data-[state=open]/select:rotate-180',
                disabled ? 'text-icon-disabled' : 'text-icon-secondary',
              )}
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal container={container}>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            collisionPadding={8}
            className={cn(floatingSurfaceClass, 'max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) min-w-[12rem] overflow-hidden')}
          >
            <SelectPrimitive.Viewport className="flex flex-col gap-stack-2xs p-inset-xs">{children}</SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      <FieldFooter {...f} error={error} description={description} disabled={disabled} />
    </div>
  );
});

export interface SelectItemProps extends ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  icon?: IconName;
}

/** One option. The selected option shows bg/selected and a check, as Menu Item State=Selected. */
export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem({ icon, className, children, ...rest }, ref) {
  return (
    <SelectPrimitive.Item ref={ref} {...rest} className={cn(menuItemClass, className)}>
      {icon && <Icon name={icon} size="sm" className="text-(--item-icon)" />}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="ml-auto flex">
        <Icon name="check" size="sm" className="text-icon-brand" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

export const SelectGroup = SelectPrimitive.Group;

export function SelectLabel({ className, ...rest }: ComponentPropsWithoutRef<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label {...rest} className={cn('px-inset-sm py-inset-xs text-overline uppercase text-text-tertiary', className)} />;
}

export function SelectSeparator({ className, ...rest }: ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator {...rest} className={cn('-mx-inset-xs my-stack-2xs h-px bg-border-subtle', className)} />;
}
