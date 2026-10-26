import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, iconNames, filledIcons, type IconFamily } from '@rajaramasami/mds-react';
import { Page, Section, TokenName } from './helpers';

function Grid({ family, filled = false }: { family: IconFamily; filled?: boolean }) {
  const list = filled ? [...filledIcons] : iconNames;
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-inline-sm">
      {list.map((n) => (
        <div key={n} className="flex flex-col items-center gap-stack-xs rounded-control border border-border-subtle bg-bg-surface p-inset-sm text-icon-primary">
          <Icon name={n as never} family={family} filled={filled} size="lg" />
          <TokenName name={n} />
        </div>
      ))}
    </div>
  );
}

function IconsPage() {
  return (
    <Page
      title="Icons"
      intro="The 51 icons from the Figma library, each in Lucide and Phosphor, plus 12 filled icons for selected states. Use the Icon component with a name; the ThemeProvider picks the family (Lucide on web, Phosphor on iOS and Android)."
    >
      <Section title="Lucide (web default)"><Grid family="lucide" /></Section>
      <Section title="Phosphor (iOS and Android default)"><Grid family="phosphor" /></Section>
      <Section title="Filled (Phosphor Fill)" note="Only for selected or active states, such as the current tab or a saved item."><Grid family="phosphor" filled /></Section>
    </Page>
  );
}

const meta: Meta = { title: 'Foundations/Icons' };
export default meta;
export const Library: StoryObj = { name: 'Icon library', render: () => <IconsPage /> };
