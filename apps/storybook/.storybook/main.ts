import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const reactSrc = fileURLToPath(new URL('../../../packages/react/src/index.ts', import.meta.url));

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
    '../../../packages/react/src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', 'storybook-addon-pseudo-states'],
  docs: { defaultName: 'Docs' },
  async viteFinal(cfg) {
    cfg.plugins = [...(cfg.plugins ?? []), tailwindcss()];
    // Work on the component source directly, so changes show without a package build.
    cfg.resolve ??= {};
    const existing = cfg.resolve.alias ?? [];
    const asArray = Array.isArray(existing)
      ? existing
      : Object.entries(existing).map(([find, replacement]) => ({ find, replacement: replacement as string }));
    cfg.resolve.alias = [{ find: /^@rajaramasami\/mds-react$/, replacement: reactSrc }, ...asArray];
    return cfg;
  },
};

export default config;
