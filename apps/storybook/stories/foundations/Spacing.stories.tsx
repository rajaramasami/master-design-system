import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import compact from '@rajaramasami/mds-tokens/json/compact';
import comfortable from '@rajaramasami/mds-tokens/json/comfortable';
import web from '@rajaramasami/mds-tokens/json/web';
import ios from '@rajaramasami/mds-tokens/json/ios';
import android from '@rajaramasami/mds-tokens/json/android';
import { Page, Section, TokenName } from './helpers';

type Values = Record<string, string>;

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-surface border border-border-default bg-bg-surface">
      <table className="w-full border-collapse text-left text-body-sm">
        <thead>
          <tr className="border-b border-border-default">
            {head.map((h) => <th key={h} className="p-inset-sm text-label-sm text-text-secondary">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border-subtle last:border-0">
              {r.map((c, j) => <td key={j} className="p-inset-sm align-middle">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const bar = (v: string) => <div className="h-[12px] rounded-pill bg-action-primary-default" style={{ width: `var(${v})` }} />;

function SpacingPage() {
  const density = Object.keys(compact);
  const platform = Object.keys(web).filter((n) => !n.includes('typography') && !n.includes('radius'));
  return (
    <Page
      title="Spacing and size"
      intro="Spacing comes from the Density collection and sizes from the Platform collection. The bars use the live variable, so they follow the Density and Platform toolbar switches; the columns show every mode's value."
    >
      <Section title="Spacing (Density)" note="Inset is padding inside a component, stack is vertical gap, inline is horizontal gap, section separates page regions.">
        <Table
          head={['Token', 'Compact', 'Comfortable', 'Current']}
          rows={density.map((n) => [<TokenName name={n.replace('--mds-', '')} />, (compact as Values)[n]!, (comfortable as Values)[n]!, bar(n)])}
        />
      </Section>
      <Section title="Sizes (Platform)" note="Controls, touch targets, icons and component sizes. Touch targets meet 24 px on web, 44 pt on iOS and 48 dp on Android.">
        <Table
          head={['Token', 'Web', 'iOS', 'Android']}
          rows={platform.map((n) => [<TokenName name={n.replace('--mds-', '')} />, (web as Values)[n]!, (ios as Values)[n]!, (android as Values)[n]!])}
        />
      </Section>
    </Page>
  );
}

const meta: Meta = { title: 'Foundations/Spacing and size' };
export default meta;
export const SpacingAndSize: StoryObj = { name: 'Spacing and size', render: () => <SpacingPage /> };
