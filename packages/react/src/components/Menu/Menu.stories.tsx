import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Menu, MenuTrigger, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuRadioGroup, MenuRadioItem,
  MenuSub, MenuSubTrigger, MenuSubContent, menuItemClass,
} from './Menu';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Icon } from '../../icons/Icon';
import { cn } from '../../lib/cn';

const meta = {
  title: 'Components/Overlays/Menu',
  component: MenuContent,
  subcomponents: { MenuItem, MenuRadioItem, MenuLabel, MenuSeparator },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      story: { inline: false, iframeHeight: 380 },
      description: {
        component: `
Mirrors the Figma components **Menu** and **Menu Item** (15 Overlays). Menu Item: Type Default or Danger × State Default, Hover, Pressed, Focus, Selected, Disabled; height \`size/row/sm\`.

**When to use**: a list of actions opened from a Button or IconButton ("More actions"), or a single choice such as sort order (\`MenuRadioGroup\`). To pick a form value, use Select.

**Keyboard**: Enter, Space or Down opens it on the first item; arrows move; typing jumps to a match; Enter selects; Right opens a submenu and Left closes it; Esc closes and returns focus to the trigger. Danger items use \`text/danger\` with a danger tint, so a destructive action stands out without relying on colour alone: give it a clear label ("Delete record").
`,
      },
    },
  },
} satisfies Meta<typeof MenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Actions: Story = {
  name: 'Actions with a submenu',
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger><IconButton variant="secondary" icon="more" label="More actions" /></MenuTrigger>
      <MenuContent>
        <MenuLabel>Appointment</MenuLabel>
        <MenuItem icon="edit" shortcut="⌘E">Edit</MenuItem>
        <MenuItem icon="copy" shortcut="⌘D">Duplicate</MenuItem>
        <MenuSub>
          <MenuSubTrigger icon="external-link">Share</MenuSubTrigger>
          <MenuSubContent>
            <MenuItem icon="mail">Email</MenuItem>
            <MenuItem icon="message">Text message</MenuItem>
            <MenuItem icon="link">Copy link</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuItem icon="download" disabled>Download PDF</MenuItem>
        <MenuSeparator />
        <MenuItem icon="trash" variant="danger">Cancel appointment</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const SingleChoice: Story = {
  name: 'Single choice (sort)',
  parameters: { docs: { story: { iframeHeight: 260 } } },
  render: function Render() {
    const [sort, setSort] = useState('date');
    return (
      <Menu defaultOpen modal={false}>
        <MenuTrigger><Button variant="secondary" trailingIcon="chevron-down">Sort by</Button></MenuTrigger>
        <MenuContent>
          <MenuRadioGroup value={sort} onValueChange={setSort}>
            <MenuRadioItem value="date">Appointment date</MenuRadioItem>
            <MenuRadioItem value="name">Patient name</MenuRadioItem>
            <MenuRadioItem value="clinic">Clinic</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    );
  },
};

const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Selected', 'Disabled'] as const;
const forced: Record<(typeof STATES)[number], [string, string]> = {
  Default: ['', ''],
  Hover: ['bg-action-ghost-hover', 'bg-status-danger-bg'],
  Pressed: ['bg-action-ghost-pressed', 'bg-status-danger-bg'],
  Focus: ['bg-action-ghost-hover shadow-focus-ring-brand', 'bg-status-danger-bg shadow-focus-ring-danger'],
  Selected: ['bg-bg-selected', ''],
  Disabled: ['', ''],
};

/**
 * The Figma Menu Item matrix, drawn statically with the same classes so every state is
 * visible at once. In a real menu, Radix sets the highlight from pointer and keyboard.
 */
export const ItemStates: Story = {
  name: 'Menu Item states (Figma matrix)',
  parameters: { a11y: { test: 'todo' }, docs: { story: { iframeHeight: 300 } } },
  render: () => (
    <div className="grid grid-cols-[80px_repeat(2,248px)] items-center gap-x-inline-lg gap-y-stack-xs">
      <span />
      <span className="text-label-sm text-text-tertiary">Default</span>
      <span className="text-label-sm text-text-tertiary">Danger</span>
      {STATES.map((state) => (
        <div key={state} className="contents">
          <span className="text-label-sm text-text-tertiary">{state}</span>
          {(['default', 'danger'] as const).map((variant, i) => state === 'Selected' && variant === 'danger' ? <span key={variant} /> : (
            <div
              key={variant}
              data-variant={variant}
              data-disabled={state === 'Disabled' ? '' : undefined}
              className={cn(menuItemClass, 'pointer-events-none', forced[state][i])}
            >
              <Icon name="edit" size="sm" className="text-(--item-icon)" />
              <span className="flex-1">Label</span>
              {state === 'Selected' && variant === 'default' && <Icon name="check" size="sm" className="text-icon-brand" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
