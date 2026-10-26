import type { Meta, StoryObj } from '@storybook/react-vite';
import web from '@rajaramasami/mds-tokens/json/web';
import ios from '@rajaramasami/mds-tokens/json/ios';
import android from '@rajaramasami/mds-tokens/json/android';
import { Page, Section, TokenName } from './helpers';

// The 15 text styles from Figma, in Figma order. Sizes come from the Platform collection.
const STYLES = [
  ['display', 'One system for every product'],
  ['heading-xl', 'Heading extra large'],
  ['heading-lg', 'Heading large'],
  ['heading-md', 'Heading medium'],
  ['heading-sm', 'Heading small'],
  ['body-lg', 'Body large reads comfortably at long lengths.'],
  ['body-md', 'Body medium is the default text style for most content.'],
  ['body-md-strong', 'Body medium strong adds emphasis without a heading.'],
  ['body-sm', 'Body small for supporting text and dense layouts.'],
  ['body-sm-strong', 'Body small strong for compact emphasis.'],
  ['label-md', 'Label medium'],
  ['label-sm', 'Label small'],
  ['caption', 'Caption for timestamps and metadata'],
  ['overline', 'OVERLINE'],
  ['code', 'const token = "--mds-color-text-primary";'],
] as const;

// Size / line height on each platform, from the Platform collection.
const PLATFORMS = { Web: web, iOS: ios, Android: android } as Record<string, Record<string, string>>;
const ROLE: Record<string, string> = { 'body-md-strong': 'body-md', 'body-sm-strong': 'body-sm', overline: 'label-sm', code: 'body-sm' };

function Spec({ id }: { id: string }) {
  const role = ROLE[id] ?? id;
  return (
    <span className="text-caption text-text-tertiary">
      {Object.entries(PLATFORMS)
        .map(([p, v]) => `${p} ${parseInt(v[`--mds-typography-${role}-font-size`]!)}/${parseInt(v[`--mds-typography-${role}-line-height`]!)}`)
        .join(' · ')}
    </span>
  );
}

function TypographyPage() {
  return (
    <Page
      title="Typography"
      intro="The 15 Figma text styles. Each is a Tailwind class (for example text-heading-md) that sets size, line height, weight and letter spacing together. Switch Platform in the toolbar to see the iOS and Android type scales."
    >
      <Section title="Text styles">
        <div className="flex flex-col divide-y divide-border-subtle rounded-surface border border-border-default bg-bg-surface">
          {STYLES.map(([id, sample]) => (
            <div key={id} className="grid grid-cols-[200px_1fr] items-baseline gap-inline-lg p-inset-md max-[720px]:grid-cols-1">
              <div className="flex flex-col gap-stack-2xs">
                <TokenName name={`text-${id}`} />
                <Spec id={id} />
              </div>
              <p className={`text-${id} ${id === 'code' ? 'font-mono' : ''}`}>{sample}</p>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
}

const meta: Meta = { title: 'Foundations/Typography' };
export default meta;
export const TextStyles: StoryObj = { name: 'Text styles', render: () => <TypographyPage /> };
