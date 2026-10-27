import { forwardRef, useId, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { Icon } from '../../icons/Icon';

/*
 * Mirrors the Figma set "Card" (12 Data display): Style Outline, Elevated, Filled × State Default,
 * Hover, Pressed, Focus, Selected, Disabled. Hover, Pressed and Focus apply only when the whole
 * card is one target (`href` or `onClick`): the title becomes that link or button and a stretched
 * layer makes the whole card clickable, while buttons in the card still work on their own.
 */
const cardVariants = cva(
  [
    'group/card relative flex flex-col gap-stack-md rounded-surface p-inset-lg text-text-primary',
    'transition-[background-color,border-color,box-shadow] duration-(--mds-motion-duration-fast) ease-standard',
  ],
  {
    variants: {
      variant: {
        outline: 'border border-border-default bg-bg-surface',
        elevated: 'border border-border-subtle bg-bg-surface shadow-elevation-sm',
        filled: 'border border-transparent bg-bg-subtle',
      },
      interactive: { true: '', false: '' },
    },
    compoundVariants: [
      { variant: 'outline', interactive: true, className: 'has-[[data-card-action]:hover]:border-border-strong has-[[data-card-action]:active]:border-border-strong has-[[data-card-action]:active]:bg-bg-subtle' },
      { variant: 'elevated', interactive: true, className: 'has-[[data-card-action]:hover]:shadow-elevation-md has-[[data-card-action]:active]:bg-bg-subtle has-[[data-card-action]:active]:shadow-elevation-xs' },
      { variant: 'filled', interactive: true, className: 'has-[[data-card-action]:hover]:bg-bg-muted has-[[data-card-action]:active]:bg-action-secondary-pressed' },
    ],
    defaultVariants: { variant: 'outline', interactive: false },
  },
);

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onClick'> {
  /** Figma Style: Outline (default), Elevated (elevation/sm, md on hover) or Filled (bg/subtle). */
  variant?: 'outline' | 'elevated' | 'filled';
  /** Heading (heading/sm). */
  title?: ReactNode;
  /** Heading level for the title, to fit the page outline. */
  titleAs?: 'h2' | 'h3' | 'h4' | 'p';
  /** One line under the title. */
  description?: ReactNode;
  /** Top-right control, e.g. a ghost IconButton "More actions" (Figma "Header Action"). */
  action?: ReactNode;
  /** Bottom actions (Figma "Footer"), e.g. Secondary and Primary sm Buttons. */
  footer?: ReactNode;
  /** Makes the whole card one link. */
  href?: string;
  /** Makes the whole card one button. Use `selected` for a choice card. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** 2px border/brand, bg/selected and a check icon, so selection isn't colour alone. Read as pressed on a button card. */
  selected?: boolean;
  disabled?: boolean;
}

/** Groups one item's content and actions. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'outline', title, titleAs: Title = 'h3', description, action, footer, href, onClick, selected, disabled, className, children, ...rest },
  ref,
) {
  const descriptionId = useId();
  const isLink = href != null && !disabled;
  const isButton = onClick != null;
  const interactive = (isLink || isButton) && !disabled;

  const stretched = 'outline-none after:absolute after:inset-0 after:rounded-surface after:content-[""] focus-visible:shadow-none';
  const titleText = isLink ? (
    <a data-card-action href={href} className={stretched} aria-describedby={description ? descriptionId : undefined}>{title}</a>
  ) : isButton ? (
    <button
      data-card-action
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected === undefined ? undefined : selected}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(stretched, 'cursor-pointer text-left disabled:cursor-not-allowed')}
    >
      {title}
    </button>
  ) : (
    title
  );

  return (
    <div
      ref={ref}
      {...rest}
      data-selected={selected ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        cardVariants({ variant, interactive }),
        interactive && 'has-[[data-card-action]:focus-visible]:shadow-focus-ring-brand',
        selected && 'border-2 border-border-brand bg-bg-selected p-[calc(var(--mds-spacing-inset-lg)-1px)]',
        disabled && 'border-border-disabled bg-bg-disabled text-text-disabled shadow-none',
        className,
      )}
    >
      {(title || action || selected) && (
        <div className="flex items-start gap-inline-md">
          {selected && <Icon name="success" size="md" label="Selected" className="shrink-0 text-icon-brand" />}
          <div className="flex min-w-0 flex-1 flex-col gap-stack-xs">
            {title && <Title className={cn('m-0 text-heading-sm', disabled ? 'text-text-disabled' : 'text-text-primary')}>{titleText}</Title>}
            {description && <p id={descriptionId} className={cn('m-0 text-body-sm', disabled ? 'text-text-disabled' : 'text-text-secondary')}>{description}</p>}
          </div>
          {/* Above the stretched layer, so it stays separately clickable. */}
          {action && <div className="relative z-10 -mt-inset-xs -mr-inset-xs shrink-0">{action}</div>}
        </div>
      )}
      {children && <div className="relative min-w-0">{children}</div>}
      {footer && <div className="relative z-10 flex flex-wrap items-center gap-inline-sm">{footer}</div>}
    </div>
  );
});
