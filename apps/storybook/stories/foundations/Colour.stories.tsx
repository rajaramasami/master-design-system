import type { Meta, StoryObj } from '@storybook/react-vite';
import light from '@rajaramasami/mds-tokens/json/light';
import dark from '@rajaramasami/mds-tokens/json/dark';
import { Page, Section, TokenName } from './helpers';

const GROUPS: Record<string, string> = {
  bg: 'Backgrounds',
  action: 'Actions',
  text: 'Text',
  icon: 'Icons',
  border: 'Borders',
  focus: 'Focus',
  status: 'Status',
  chart: 'Charts',
  shadow: 'Shadows',
};

const names = Object.keys(light) as (keyof typeof light)[];
const groupOf = (n: string) => n.replace('--mds-color-', '').split('-')[0]!;

function Swatch({ name }: { name: keyof typeof light }) {
  const isText = groupOf(name) === 'text';
  return (
    <div className="flex flex-col overflow-hidden rounded-surface border border-border-default bg-bg-surface">
      <div
        className="flex h-[64px] items-center justify-center border-b border-border-subtle"
        style={isText ? { color: `var(${name})` } : { background: `var(${name})` }}
      >
        {isText && <span className="text-heading-md">Aa</span>}
      </div>
      <div className="flex flex-col gap-stack-2xs p-inset-sm">
        <TokenName name={name.replace('--mds-', '')} />
        <span className="text-caption text-text-tertiary">
          {light[name]} · {(dark as Record<string, string>)[name]}
        </span>
      </div>
    </div>
  );
}

function ColourPage() {
  return (
    <Page
      title="Colour"
      intro="The 73 semantic colours from the Figma Color collection. Components only use these, never the primitive ramps, so switching Theme or Brand in the toolbar restyles everything. Values under each swatch are light · dark for the default brand; the swatches themselves follow the toolbar."
    >
      {Object.entries(GROUPS).map(([key, title]) => (
        <Section key={key} title={title}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-inline-md">
            {names.filter((n) => groupOf(n) === key).map((n) => <Swatch key={n} name={n} />)}
          </div>
        </Section>
      ))}
    </Page>
  );
}

const meta: Meta = { title: 'Foundations/Colour', parameters: { a11y: { test: 'todo' } } };
export default meta;
export const SemanticColours: StoryObj = { name: 'Semantic colours', render: () => <ColourPage /> };
