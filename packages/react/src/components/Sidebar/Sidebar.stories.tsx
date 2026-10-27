import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar, SidebarItem } from './Sidebar';
import { Avatar } from '../Avatar/Avatar';
import { IconButton } from '../IconButton/IconButton';

function Demo({ initialCollapsed = false }: { initialCollapsed?: boolean }) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [current, setCurrent] = useState('Home');
  const items = [
    { icon: 'home', label: 'Home' },
    { icon: 'calendar', label: 'Timeline' },
    { icon: 'file', label: 'Results' },
    { icon: 'pill', label: 'Medicines' },
    { icon: 'message', label: 'Messages', count: 2 },
  ] as const;
  return (
    <div className="h-[640px]">
      <Sidebar
        productName="Product"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        footer={
          <>
            <SidebarItem as="div" icon="settings" label="Settings" onClick={() => setCurrent('Settings')} selected={current === 'Settings'} />
            <div className={collapsed ? 'flex justify-center py-inset-xs' : 'flex items-center gap-inline-sm p-inset-xs'}>
              <Avatar name="Raja R" size="sm" decorative={!collapsed} />
              {!collapsed && (
                <>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-body-sm-strong text-text-primary">Raja R</span>
                    <span className="text-caption text-text-secondary">Patient</span>
                  </span>
                  <IconButton variant="ghost" size="sm" icon="more" label="Account menu" />
                </>
              )}
            </div>
          </>
        }
      >
        {items.map((it) => (
          <SidebarItem key={it.label} icon={it.icon} label={it.label} count={'count' in it ? it.count : undefined} countLabel="unread" selected={current === it.label} onClick={() => setCurrent(it.label)} />
        ))}
      </Sidebar>
    </div>
  );
}

const meta = {
  title: 'Components/Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Mirrors the Figma **Sidebar** (Collapsed False, True) and **Nav Item** (Collapsed × State Default, Hover, Pressed, Focus, Selected, Disabled, with Show Count), 14 Navigation.

**When to use**: primary navigation for web apps and tablet. Below 1024 px wide, replace it with a Top Bar menu button that opens a Drawer (side left) with the same items.

**Behaviour**: 256 px wide (\`sidebar/width/expanded\`) or 64 collapsed, icons only with the label in a tooltip. Items are links with \`href\` or buttons with \`onClick\`. Put Settings and the account in \`footer\`, using \`<SidebarItem as="div">\`.

**Accessibility**: \`<nav aria-label="Main">\`. The current page has \`aria-current="page"\`; collapsed items keep their name (and count). The collapse button has \`aria-expanded\`.
`,
      },
    },
  },
  args: { productName: 'Product', children: null },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = { render: () => <Demo /> };
export const Collapsed: Story = { render: () => <Demo initialCollapsed /> };

const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Selected', 'Disabled'] as const;

export const NavItemStates: Story = {
  name: 'Nav item states (Figma matrix)',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    pseudo: {
      hover: ['[data-state-cell="Hover"] button'],
      active: ['[data-state-cell="Pressed"] button'],
      focusVisible: ['[data-state-cell="Focus"] button'],
    },
  },
  render: () => (
    <div className="flex gap-inline-xl">
      {[false, true].map((collapsed) => (
        <div key={String(collapsed)} className="flex flex-col gap-stack-xs">
          {STATES.map((s) => (
            <div key={s} data-state-cell={s} className="flex items-center gap-inline-md">
              <span className="w-[64px] text-label-sm text-text-tertiary">{s}</span>
              <Sidebar productName="P" collapsed={collapsed} aria-label={`${s} ${collapsed}`} className="h-auto w-auto border-0 bg-transparent p-0 [&>div:first-child]:hidden">
                <SidebarItem icon="home" label="Home" onClick={() => {}} selected={s === 'Selected'} disabled={s === 'Disabled'} className={collapsed ? undefined : 'w-[232px]'} />
              </Sidebar>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
