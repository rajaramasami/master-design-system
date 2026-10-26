import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page, Section, TokenName } from './helpers';

const RADII = ['control', 'surface', 'sheet', 'pill', 'checkbox'];
const ELEVATION = ['xs', 'sm', 'md', 'lg', 'xl'];

function RadiusElevationPage() {
  return (
    <Page
      title="Radius and elevation"
      intro="Radii change by platform (web is tighter, iOS rounder). Elevation shadows switch to darker shadow colours in dark mode, where elevated surfaces also rely on a subtle border."
    >
      <Section title="Radius (Platform)">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-inline-md">
          {RADII.map((r) => (
            <div key={r} className="flex flex-col gap-stack-xs">
              <div className="h-[80px] border-2 border-border-brand bg-action-primary-subtle" style={{ borderRadius: `var(--mds-${r === 'checkbox' ? 'checkbox-radius' : `radius-${r}`})` }} />
              <TokenName name={`rounded-${r}`} />
            </div>
          ))}
        </div>
      </Section>
      <Section title="Elevation">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-inline-lg">
          {ELEVATION.map((e) => (
            <div key={e} className="flex flex-col gap-stack-sm">
              <div className={`h-[96px] rounded-surface border border-border-subtle bg-bg-surface-raised shadow-elevation-${e}`} />
              <TokenName name={`shadow-elevation-${e}`} />
            </div>
          ))}
        </div>
      </Section>
      <Section title="Focus rings" note="A 2 px gap in the canvas colour, then a 2 px ring, so the ring shows on any button colour. Tab to the buttons to see them.">
        <div className="flex flex-wrap gap-inline-md">
          <button type="button" className="h-control-md rounded-control bg-action-primary-default px-inset-md text-label-md text-text-on-action">Brand focus ring</button>
          <button type="button" className="h-control-md rounded-control bg-action-danger-default px-inset-md text-label-md text-text-on-action focus-visible:shadow-focus-ring-danger">Danger focus ring</button>
        </div>
      </Section>
    </Page>
  );
}

const meta: Meta = { title: 'Foundations/Radius and elevation' };
export default meta;
export const RadiusAndElevation: StoryObj = { name: 'Radius and elevation', render: () => <RadiusElevationPage /> };
