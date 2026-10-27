import { Fragment, forwardRef, type HTMLAttributes } from 'react';
import { DropdownMenu as MenuPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';
import { MenuContent, menuItemClass } from '../Menu/Menu';

export interface BreadcrumbItem {
  label: string;
  /** Ancestors need an href. The last item is the current page and is not a link. */
  href?: string;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /** From the top level down to the current page (last). */
  items: BreadcrumbItem[];
  /** More levels than this collapse the middle into "…" (a menu). Default 4. */
  maxItems?: number;
}

const linkClass = cn(
  'rounded-control p-stack-2xs text-body-sm text-text-secondary underline-offset-2 outline-none',
  'transition-colors duration-(--mds-motion-duration-fast) ease-standard',
  'hovered:text-text-primary hovered:underline focus-visible:text-text-primary focus-visible:shadow-focus-ring-brand',
);

function Separator() {
  return (
    <li role="presentation" aria-hidden="true" className="flex">
      <Icon name="chevron-right" size="sm" className="text-icon-secondary" />
    </li>
  );
}

/**
 * Shows where the page sits in the hierarchy (Figma "Breadcrumbs" and "Breadcrumb Item",
 * 14 Navigation). For web and tablet; on phones, use a Top Bar with Back instead.
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, maxItems = 4, className, 'aria-label': ariaLabel = 'Breadcrumb', ...rest },
  ref,
) {
  const collapse = items.length > maxItems;
  // Keep the first item and the last two; the rest go into the "…" menu.
  const hidden = collapse ? items.slice(1, items.length - 2) : [];
  const shown: (BreadcrumbItem | 'more')[] = collapse ? [items[0]!, 'more', ...items.slice(-2)] : items;

  return (
    <nav ref={ref} aria-label={ariaLabel} {...rest} className={cn('min-w-0', className)}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-stack-2xs p-0">
        {shown.map((item, i) => {
          const last = i === shown.length - 1;
          return (
            <Fragment key={item === 'more' ? 'more' : `${i}-${item.label}`}>
              <li className="flex min-w-0">
                {item === 'more' ? (
                  <MenuPrimitive.Root>
                    <MenuPrimitive.Trigger aria-label={`Show ${hidden.length} more levels`} className={cn(linkClass, 'cursor-pointer px-inline-xs')}>
                      …
                    </MenuPrimitive.Trigger>
                    <MenuContent align="start">
                      {hidden.map((h) => (
                        <MenuPrimitive.Item key={h.label} asChild className={cn(menuItemClass)}>
                          <a href={h.href}>{h.label}</a>
                        </MenuPrimitive.Item>
                      ))}
                    </MenuContent>
                  </MenuPrimitive.Root>
                ) : last || !item.href ? (
                  <span aria-current={last ? 'page' : undefined} className={cn('truncate p-stack-2xs text-body-sm', last ? 'text-body-sm-strong text-text-primary' : 'text-text-secondary')}>
                    {item.label}
                  </span>
                ) : (
                  <a href={item.href} className={cn(linkClass, 'truncate')}>{item.label}</a>
                )}
              </li>
              {!last && <Separator />}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
});
