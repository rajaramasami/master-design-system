import type { ReactNode } from 'react';

export function Page({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1080px] flex-col gap-section-md">
      <header className="flex flex-col gap-stack-sm">
        <h1 className="text-heading-xl">{title}</h1>
        <p className="max-w-[68ch] text-body-md text-text-secondary">{intro}</p>
      </header>
      {children}
    </div>
  );
}

export function Section({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-stack-md">
      <div className="flex flex-col gap-stack-xs">
        <h2 className="text-heading-sm">{title}</h2>
        {note && <p className="max-w-[68ch] text-body-sm text-text-secondary">{note}</p>}
      </div>
      {children}
    </section>
  );
}

/** A token name in code style, copyable as the CSS variable. */
export function TokenName({ name }: { name: string }) {
  return <code className="text-code break-all text-text-primary">{name}</code>;
}
