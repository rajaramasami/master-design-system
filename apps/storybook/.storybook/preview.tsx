import type { Decorator, Preview } from '@storybook/react-vite';
import { ThemeProvider, type Density, type Platform } from '@rajaramasami/mds-react';
import '@rajaramasami/mds-tokens/css';
import './storybook.css';

// One toolbar switch per Figma variable collection.
const withModes: Decorator = (Story, ctx) => {
  const { theme, brand, platform, density } = ctx.globals as Record<string, string>;
  return (
    <ThemeProvider
      theme={theme as 'light' | 'dark'}
      brand={brand === 'default' ? undefined : brand}
      platform={platform as Platform}
      density={density as Density}
      style={{ padding: 24, minHeight: ctx.viewMode === 'docs' ? undefined : '100vh' }}
    >
      <Story />
    </ThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withModes],
  globalTypes: {
    theme: {
      description: 'Color collection',
      toolbar: { title: 'Theme', icon: 'mirror', items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }], dynamicTitle: true },
    },
    brand: {
      description: 'Brand ramp',
      toolbar: { title: 'Brand', icon: 'paintbrush', items: [{ value: 'default', title: 'Default (violet)' }, { value: 'ocean', title: 'Ocean (sample)' }], dynamicTitle: true },
    },
    platform: {
      description: 'Platform collection',
      toolbar: { title: 'Platform', icon: 'browser', items: [{ value: 'web', title: 'Web' }, { value: 'ios', title: 'iOS' }, { value: 'android', title: 'Android' }], dynamicTitle: true },
    },
    density: {
      description: 'Density collection',
      toolbar: { title: 'Density', icon: 'component', items: [{ value: 'compact', title: 'Compact' }, { value: 'comfortable', title: 'Comfortable' }], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light', brand: 'default', platform: 'web', density: 'compact' },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
    options: { storySort: { order: ['Introduction', 'Foundations', ['Colour', 'Typography', 'Spacing and size', 'Radius and elevation', 'Icons'], 'Components', ['Actions', 'Inputs', 'Overlays', 'Data display', 'Feedback'], 'Patterns'] } },
  },
};

export default preview;
