import { createContext, useContext, useMemo, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export type Theme = 'light' | 'dark' | 'system';
export type Platform = 'web' | 'ios' | 'android';
export type Density = 'compact' | 'comfortable';
export type IconFamily = 'lucide' | 'phosphor';

export interface MdsSettings {
  theme: Theme;
  platform: Platform;
  density: Density;
  brand?: string;
  iconFamily: IconFamily;
}

const MdsContext = createContext<MdsSettings>({
  theme: 'system',
  platform: 'web',
  density: 'compact',
  iconFamily: 'lucide',
});

/** The current theme, platform, density, brand and icon family. */
export const useMds = () => useContext(MdsContext);

const PortalContext = createContext<HTMLElement | null>(null);

/**
 * Where overlays (Dialog, Menu, Tooltip…) render. They portal into the nearest
 * ThemeProvider instead of <body>, so they keep its theme, brand, platform and density.
 */
export const usePortalContainer = () => useContext(PortalContext) ?? undefined;

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  /** Light, dark, or follow the system setting. Matches the Figma Color collection. */
  theme?: Theme;
  /** Sizes, radii and type scale. Matches the Figma Platform collection. */
  platform?: Platform;
  /** Spacing and row heights. Matches the Figma Density collection. Compact is the Figma default. */
  density?: Density;
  /**
   * A brand name your CSS defines, e.g. `[data-brand="carepath"] { --mds-brand-primary-600: … }`.
   * Leave empty for the default violet ramp.
   */
  brand?: string;
  /** Lucide for web apps, Phosphor for mobile (the Figma icon rule). Defaults from `platform`. */
  iconFamily?: IconFamily;
  children?: ReactNode;
}

/**
 * Wraps an app, or any part of one, in a set of Figma modes. Providers can be
 * nested: an inner provider with `theme="dark"` makes only that region dark.
 */
export function ThemeProvider({
  theme = 'system',
  platform = 'web',
  density = 'compact',
  brand,
  iconFamily,
  className,
  children,
  ...rest
}: ThemeProviderProps) {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const family: IconFamily = iconFamily ?? (platform === 'web' ? 'lucide' : 'phosphor');
  const value = useMemo(
    () => ({ theme, platform, density, brand, iconFamily: family }),
    [theme, platform, density, brand, family],
  );
  return (
    <MdsContext.Provider value={value}>
      <PortalContext.Provider value={root}>
      <div
        {...rest}
        ref={setRoot}
        className={cn('mds-root', className)}
        data-theme={theme === 'system' ? undefined : theme}
        data-platform={platform}
        data-density={density}
        data-brand={brand || undefined}
      >
        {children}
      </div>
      </PortalContext.Provider>
    </MdsContext.Provider>
  );
}
