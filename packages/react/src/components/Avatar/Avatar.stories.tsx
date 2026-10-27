import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, type AvatarSize } from './Avatar';

const SIZES: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
// A neutral generated image, so the story works offline and contains no real person.
const IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7aa7d6"/><stop offset="1" stop-color="#2f5d8a"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="26" r="11" fill="#e8eef5"/><path d="M12 60c3-12 11-18 20-18s17 6 20 18z" fill="#e8eef5"/></svg>')}`;

const meta = {
  title: 'Components/Data display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Anita Raman', size: 'md' },
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma set **Avatar** (12 Data display): Type Initials, Icon, Image × Size xs–xl (\`avatar/size/*\`), with Online.

**Behaviour**: shows the image when \`src\` loads, otherwise the person's initials, otherwise a person icon.

**Accessibility**: a named \`img\` when it stands alone. Set \`decorative\` when the name is already shown next to it (as in a List Row), so it isn't read twice. The online dot is visual only; say "Online" in text where it matters.
`,
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[110px_repeat(5,max-content)] items-center gap-x-inline-lg gap-y-stack-md">
      <span />
      {SIZES.map((s) => <span key={s} className="text-label-sm text-text-tertiary">{s}</span>)}
      {(['Initials', 'Icon', 'Image', 'Online'] as const).map((type) => (
        <div key={type} className="contents">
          <span className="text-label-sm text-text-tertiary">{type}</span>
          {SIZES.map((s) => (
            <span key={s}>
              <Avatar size={s} name={type === 'Icon' ? undefined : 'Anita Raman'} src={type === 'Image' ? IMAGE : undefined} online={type === 'Online'} />
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
};
