import { forwardRef, type HTMLAttributes } from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import { cn } from '../../lib/cn';
import { Icon, type IconSize } from '../../icons/Icon';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<AvatarSize, { box: string; text: string; icon: IconSize; dot: string }> = {
  xs: { box: 'size-avatar-size-xs', text: 'text-label-sm', icon: 'sm', dot: 'size-[8px]' },
  sm: { box: 'size-avatar-size-sm', text: 'text-label-sm', icon: 'sm', dot: 'size-[8px]' },
  md: { box: 'size-avatar-size-md', text: 'text-label-md', icon: 'md', dot: 'size-[10px]' },
  lg: { box: 'size-avatar-size-lg', text: 'text-body-md-strong', icon: 'md', dot: 'size-[12px]' },
  xl: { box: 'size-avatar-size-xl', text: 'text-heading-sm', icon: 'lg', dot: 'size-[16px]' },
};

/** "Asha Kumar" → "AK"; "Asha" → "A". */
export function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** The person's name: used for the initials and as the accessible name. */
  name?: string;
  /** Photo URL (Figma Type=Image). Falls back to initials, then the user icon, if it fails to load. */
  src?: string;
  /** Figma Size: xs 24, sm 32, md 40, lg 48, xl 64. */
  size?: AvatarSize;
  /**
   * Shows the presence dot (Figma "Show Status") with a 2px surface ring.
   * Presence must also be in text nearby, e.g. "Online".
   */
  online?: boolean;
  /** Next to a visible name, the avatar repeats it: mark it decorative so screen readers skip it. */
  decorative?: boolean;
}

/**
 * Represents a person (Figma "Avatar"): Type Initials (action/primary/subtle + text/brand),
 * Icon (bg/muted + user icon) or Image. Round, sized from avatar/size/*.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, size = 'md', online, decorative = false, className, ...rest },
  ref,
) {
  const s = SIZE[size];
  const initials = name ? initialsOf(name) : '';
  const a11y = decorative || !name ? { 'aria-hidden': true } : { role: 'img', 'aria-label': name };

  return (
    <span ref={ref} {...a11y} {...rest} className={cn('relative inline-flex shrink-0', s.box, className)}>
      <AvatarPrimitive.Root className={cn('inline-flex size-full items-center justify-center overflow-hidden rounded-pill', initials ? 'bg-action-primary-subtle' : 'bg-bg-muted')}>
        {src && <AvatarPrimitive.Image src={src} alt="" className="size-full object-cover" />}
        <AvatarPrimitive.Fallback delayMs={src ? 300 : undefined} className="inline-flex size-full items-center justify-center">
          {initials ? (
            <span className={cn('select-none text-text-brand', s.text)}>{initials}</span>
          ) : (
            <Icon name="user" size={s.icon} className="text-icon-secondary" />
          )}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {online && (
        <span className={cn('absolute right-0 bottom-0 rounded-pill border-2 border-bg-surface bg-icon-success', s.dot)} />
      )}
    </span>
  );
});
