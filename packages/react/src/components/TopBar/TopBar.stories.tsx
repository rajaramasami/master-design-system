import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopBar } from './TopBar';
import { TextField } from '../TextField/TextField';
import { IconButton } from '../IconButton/IconButton';
import { Button } from '../Button/Button';
import { Avatar } from '../Avatar/Avatar';

const meta = {
  title: 'Components/Navigation/Top Bar',
  component: TopBar,
  tags: ['autodocs'],
  args: { title: 'Results' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Mirrors the Figma **Top Bar** (Platform Web, iOS, Android), 14 Navigation. It follows the toolbar's Platform unless you set \`platform\`.

- **Web** (56): page title, search, notifications, account. Sits to the right of the Sidebar.
- **iOS** (44): "‹ Back", centred title, one text action. The status bar is not included.
- **Android** (64): navigation icon, title on the left, up to two actions plus overflow.

**Accessibility**: the title is the page's \`h1\` (change with \`titleAs\`). Icon buttons need labels; Back is named after \`backLabel\`.
`,
      },
    },
  },
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Web: Story = {
  args: {
    platform: 'web',
    actions: (
      <>
        <TextField label="Search records" hideLabel placeholder="Search records" prefixIcon="search" size="sm" wrapperClassName="w-[280px]" />
        <IconButton variant="ghost" icon="bell" label="Notifications" />
        <Avatar name="Raja R" size="sm" />
      </>
    ),
  },
};

export const IOS: Story = {
  name: 'iOS',
  args: { platform: 'ios', onBack: () => {}, actions: <Button variant="ghost" size="sm" className="text-text-brand">Edit</Button> },
  render: (args) => <div className="max-w-[390px]"><TopBar {...args} /></div>,
};

export const Android: Story = {
  args: {
    platform: 'android',
    onBack: () => {},
    actions: (
      <>
        <IconButton variant="ghost" icon="bell" label="Notifications" />
        <IconButton variant="ghost" icon="more" label="More options" />
      </>
    ),
  },
  render: (args) => <div className="max-w-[390px]"><TopBar {...args} /></div>,
};
