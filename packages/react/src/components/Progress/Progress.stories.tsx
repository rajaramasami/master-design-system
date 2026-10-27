import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar, Spinner, Skeleton, SkeletonListRow } from './Progress';

const meta = {
  title: 'Components/Feedback/Progress and loading',
  component: ProgressBar,
  tags: ['autodocs'],
  args: { label: 'Uploading results', value: 64, size: 'md' },
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma sets **Progress Bar**, **Spinner**, **Skeleton** and **Skeleton / List Row** (13 Feedback).

**Which one**
- **ProgressBar**: the amount done is known (uploads, multi-step tasks). Size sm (4 px) or md (8 px).
- **Spinner**: unknown duration, under about 10 s. Sizes sm, md, lg follow \`size/icon/*\`.
- **Skeleton**: the layout is known; show the shapes to avoid layout jumps. Text, Circle, Rect.

**Motion**: the spinner turns every 0.8 s and the skeleton shimmers every 1.5 s. With reduced motion, the spinner pulses and the skeleton stays still.

**Accessibility**: ProgressBar is a named \`progressbar\` with its value. Spinner is a \`role="status"\` with a label. Skeletons are hidden from assistive technology; mark the loading container \`aria-busy="true"\`.
`,
      },
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid max-w-[720px] grid-cols-2 gap-x-inline-xl gap-y-stack-xl">
      <div className="flex flex-col gap-stack-lg">
        <span className="text-label-sm text-text-tertiary">Progress Bar</span>
        <ProgressBar size="sm" label="Syncing records" value={25} />
        <ProgressBar size="md" label="Uploading results" value={64} />
        <ProgressBar size="md" label="Complete" value={100} />
      </div>
      <div className="flex flex-col gap-stack-lg">
        <span className="text-label-sm text-text-tertiary">Spinner</span>
        <div className="flex items-center gap-inline-lg">
          <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
        </div>
      </div>
      <div className="flex flex-col gap-stack-md">
        <span className="text-label-sm text-text-tertiary">Skeleton</span>
        <Skeleton className="w-[60%]" />
        <Skeleton shape="circle" />
        <Skeleton shape="rect" className="h-[96px]" />
      </div>
      <div className="flex flex-col gap-stack-sm" aria-busy="true">
        <span className="text-label-sm text-text-tertiary">Skeleton / List Row</span>
        <SkeletonListRow /><SkeletonListRow /><SkeletonListRow />
      </div>
    </div>
  ),
};
