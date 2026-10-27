import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabBar, TabBarItem } from './TabBar';
import type { IconName } from '../../icons/registry';

const ITEMS: { icon: IconName; label: string; badge?: number }[] = [
  { icon: 'home', label: 'Home' },
  { icon: 'calendar', label: 'Timeline' },
  { icon: 'file', label: 'Results', badge: 2 },
  { icon: 'pill', label: 'Medicines' },
  { icon: 'user', label: 'Profile' },
];

function Demo({ platform }: { platform?: 'ios' | 'android' }) {
  const [current, setCurrent] = useState('Home');
  return (
    <div className="max-w-[390px]">
      <TabBar platform={platform}>
        {ITEMS.map((it) => (
          <TabBarItem key={it.label} icon={it.icon} label={it.label} badge={it.badge} badgeLabel="new" selected={current === it.label} onClick={() => setCurrent(it.label)} />
        ))}
      </TabBar>
    </div>
  );
}

const meta = {
  title: 'Components/Navigation/Tab Bar',
  component: TabBar,
  tags: ['autodocs'],
  args: { children: null },
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma **Tab Bar** and **Tab Bar Item** (Platform iOS, Android × Selected), 14 Navigation. It follows the toolbar's Platform unless you set \`platform\`.

- **iOS**: tab bar (49 pt) on bg/surface with a top border; the selected item uses the filled icon and text/brand.
- **Android**: navigation bar (80 dp) on bg/subtle; the selected item sits in an indicator pill.

**When to use**: primary navigation on phones, 3–5 top-level destinations, one selected per screen. Never for actions. On tablet, iOS keeps the tab bar (or a Sidebar) and Android uses a navigation rail.

**Accessibility**: it is navigation, not a tablist: \`<nav>\` with \`aria-current="page"\` on the selected item. Badges are read after the label ("Results, 2 new"). Safe-area padding is added at the bottom.
`,
      },
    },
  },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IOS: Story = { name: 'iOS', render: () => <Demo platform="ios" /> };
export const Android: Story = { render: () => <Demo platform="android" /> };
/** Follows the Platform in the toolbar. */
export const FollowsPlatform: Story = { render: () => <Demo /> };
