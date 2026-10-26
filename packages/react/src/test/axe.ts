import axe from 'axe-core';

/** Runs axe on a rendered container and returns the violations (empty when accessible). */
export async function axeViolations(container: Element) {
  const { violations } = await axe.run(container, {
    // Colour contrast needs real layout and CSS; it is covered by the token contrast check
    // and by the Storybook a11y addon in a real browser.
    rules: { 'color-contrast': { enabled: false } },
  });
  return violations.map((v) => `${v.id}: ${v.help}`);
}
