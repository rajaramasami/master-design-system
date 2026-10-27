import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomSheet, BottomSheetTrigger, BottomSheetContent, BottomSheetClose } from './Dialog';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';

const meta = {
  title: 'Components/Overlays/BottomSheet',
  component: BottomSheetContent,
  tags: ['autodocs'],
  args: { title: 'Log a reading', showHandle: true, showClose: true },
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile2' },
    docs: {
      story: { inline: false, iframeHeight: 560 },
      description: {
        component: `
Mirrors the Figma component **Bottom Sheet** (15 Overlays): top corners \`radius/sheet\`, \`elevation/xl\`, drag handle \`sheet/handle-*\`, title, content and a full-width primary action (lg) above the home indicator.

**When to use**: short tasks and options on phones and small tablets: log a reading, choose a time, share. On larger screens use Dialog.

**Dismiss**: drag the handle down, tap the scrim, press Esc or use Close. The handle is never the only way to close. Same focus rules as Dialog. Switch Platform to iOS or Android in the toolbar to see the platform radius and sizes.
`,
      },
    },
  },
  render: (args) => (
    <BottomSheet defaultOpen>
      <BottomSheetTrigger><Button leadingIcon="activity">Log a reading</Button></BottomSheetTrigger>
      <BottomSheetContent
        {...args}
        footer={
          <BottomSheetClose asChild>
            <Button size="lg">Save reading</Button>
          </BottomSheetClose>
        }
      >
        <div className="grid grid-cols-2 gap-inline-md">
          <TextField label="Systolic" inputMode="numeric" description="Top number" />
          <TextField label="Diastolic" inputMode="numeric" description="Bottom number" />
        </div>
      </BottomSheetContent>
    </BottomSheet>
  ),
} satisfies Meta<typeof BottomSheetContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LogReading: Story = { name: 'Log a reading' };
