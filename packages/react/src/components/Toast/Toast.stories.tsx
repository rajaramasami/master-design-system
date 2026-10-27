import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider, useToast, type ToastTone } from './Toast';
import { Button } from '../Button/Button';

const EXAMPLES: Record<ToastTone, { title: string; description?: string; action?: boolean }> = {
  neutral: { title: 'Appointment cancelled', action: true },
  success: { title: 'Appointment booked', description: 'Tue 4 Nov at 10:30' },
  warning: { title: 'You’re offline', description: 'Changes will sync when you reconnect.' },
  danger: { title: 'Couldn’t send message', description: 'Check your connection and try again.' },
  info: { title: 'New results available' },
};

function Launcher() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-inline-sm">
      {(Object.keys(EXAMPLES) as ToastTone[]).map((tone) => {
        const e = EXAMPLES[tone];
        return (
          <Button
            key={tone}
            variant="secondary"
            onClick={() => toast({ tone, title: e.title, description: e.description, action: e.action ? { label: 'Undo', onClick: () => {} } : undefined })}
          >
            {tone.charAt(0).toUpperCase() + tone.slice(1)}
          </Button>
        );
      })}
    </div>
  );
}

const meta = {
  title: 'Components/Feedback/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, iframeHeight: 420 },
      description: {
        component: `
Mirrors the Figma set **Toast** (13 Feedback): Tone Neutral, Success, Warning, Danger, Info, with Show Description, Show Action and Show Close.

**Set up** once, inside \`ThemeProvider\`:

\`\`\`tsx
<ThemeProvider><ToastProvider><App /></ToastProvider></ThemeProvider>

const toast = useToast();
toast({ title: 'Appointment booked', tone: 'success' });
\`\`\`

**Behaviour**: bottom-right on web and bottom-centre on iOS and Android; newest on top, at most three at once (a fourth closes the oldest). Hides after 5 s, pausing while hovered or focused. Danger toasts and toasts with an action stay until dismissed, so nobody misses them. Swipe to dismiss on touch.

**Content**: a short confirmation of what just happened. One action at most (usually Undo). Anything the person must act on belongs in an Alert or Dialog.

**Accessibility**: toasts sit in a "Notifications" landmark; F8 moves focus there. Danger toasts are announced immediately; others politely.
`,
      },
    },
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: null },
  render: () => (
    <div className="p-inset-lg">
      <ToastProvider><Launcher /></ToastProvider>
    </div>
  ),
};

/** Sends all five tones. Only three show at once, so you see the newest three: Neutral, Success and Warning. */
export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  args: { children: null },
  parameters: { controls: { disable: true } },
  render: () => {
    function ShowAll() {
      const toast = useToast();
      return (
        <Button
          ref={(el) => {
            if (el && !el.dataset.done) {
              el.dataset.done = '1';
              (Object.keys(EXAMPLES) as ToastTone[]).reverse().forEach((tone) => {
                const e = EXAMPLES[tone];
                toast({ tone, title: e.title, description: e.description, duration: Infinity, action: e.action ? { label: 'Undo', onClick: () => {} } : undefined });
              });
            }
          }}
          variant="ghost"
        >
          Showing all tones
        </Button>
      );
    }
    return <div className="min-h-[640px] p-inset-lg"><ToastProvider><ShowAll /></ToastProvider></div>;
  },
};
