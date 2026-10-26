import type { SVGProps } from 'react';
import { cn } from '../lib/cn';
import { useMds, type IconFamily } from '../provider/ThemeProvider';
import { icons, filledIcons, type IconName, type FilledIconName } from './registry';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg';

interface BaseProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'name'> {
  /** Size from the Platform collection: 12/16/20/24 on web. */
  size?: IconSize;
  /** Overrides the family from the ThemeProvider. */
  family?: IconFamily;
  /**
   * Name read by screen readers. Leave empty for decorative icons next to a
   * visible label; they are hidden from assistive technology.
   */
  label?: string;
}

export interface IconProps extends BaseProps {
  name: IconName;
  /** Phosphor Fill glyph for selected or active states. Only the 12 icons in `filledIcons` have one; others ignore it. */
  filled?: boolean;
}

export type { FilledIconName };

/**
 * One of the 51 Figma icons. Colour comes from `currentColor`, so it follows the
 * text colour of its parent; set a `text-icon-*` class to change it.
 * `filled` uses the Phosphor Fill glyph (only for the 12 icons that have one),
 * as in Figma: filled icons mark a selected or active state.
 */
export function Icon({ name, size = 'md', family, filled = false, label, className, style, ...rest }: IconProps) {
  const ctx = useMds();
  const fam = family ?? ctx.iconFamily;
  const useFill = filled && (filledIcons as readonly string[]).includes(name);
  const Glyph = useFill ? icons[name].phosphor : icons[name][fam];
  const familyProps = useFill ? { weight: 'fill' } : fam === 'phosphor' ? { weight: 'regular' } : { strokeWidth: 2 };
  const dimension = `var(--mds-size-icon-${size})`;

  return (
    <Glyph
      {...rest}
      {...familyProps}
      className={cn('shrink-0', className)}
      style={{ width: dimension, height: dimension, ...style }}
      focusable="false"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-icon={name}
    />
  );
}
