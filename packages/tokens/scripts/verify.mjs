// Checks the built tokens before anything ships:
//  1. every token from the Figma export made it into the CSS
//  2. every var(--mds-*) reference points at a variable that exists
//  3. key colour pairs pass WCAG 2.2 AA in light and dark (4.5:1 text, 3:1 non-text)
//  4. the code syntax set on the Figma variables names real CSS, Swift and Compose symbols
// Exits with code 1 on any failure, so CI blocks a bad token change or brand ramp.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFileSync(join(root, f), 'utf8');
const css = read('dist/css/tokens.css');
const tw = read('dist/tailwind/theme.css');
const raw = JSON.parse(read('figma-export/variables.json'));
const errors = [];

// 1. Coverage
const defined = new Set([...css.matchAll(/^\s*(--mds-[a-z0-9-]+):/gm)].map((m) => m[1]));
const expected = [...raw.base, ...raw.modes].map((r) => `--mds-${r[1].split('/').join('-')}`);
const missing = expected.filter((n) => !defined.has(n));
if (missing.length) errors.push(`Missing from CSS: ${missing.join(', ')}`);

// 2. References
for (const [file, text] of [['tokens.css', css], ['theme.css', tw]]) {
  for (const [, name] of text.matchAll(/var\((--mds-[a-z0-9-]+)\)/g)) {
    if (!defined.has(name)) errors.push(`${file} references undefined ${name}`);
  }
}

// 3. Contrast
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const TEXT = 4.5, UI = 3;
const pairs = [
  ...['primary', 'secondary', 'tertiary', 'brand', 'link', 'success', 'warning', 'danger', 'info'].flatMap((t) =>
    ['canvas', 'surface', 'subtle'].map((bg) => [`text-${t}`, `bg-${bg}`, TEXT])),
  ...['default', 'hover', 'pressed'].flatMap((s) => [[`text-on-action`, `action-primary-${s}`, TEXT], [`text-on-action`, `action-danger-${s}`, TEXT]]),
  ['text-brand', 'action-primary-subtle', TEXT], ['text-brand', 'action-primary-subtle-hover', TEXT], ['text-brand', 'action-primary-subtle-pressed', TEXT],
  ['text-primary', 'bg-selected', TEXT], ['text-inverse', 'bg-inverse', TEXT],
  ...['success', 'warning', 'danger', 'info'].map((s) => [`text-${s}`, `status-${s}-bg`, TEXT]),
  ...['primary', 'secondary', 'brand', 'success', 'warning', 'danger', 'info'].map((i) => [`icon-${i}`, 'bg-canvas', UI]),
  ['border-strong', 'bg-canvas', UI], ['border-brand', 'bg-canvas', UI], ['border-danger', 'bg-canvas', UI],
  ['focus-ring', 'bg-canvas', UI], ['focus-ring-danger', 'bg-canvas', UI],
  ['action-toggle-off', 'bg-canvas', UI], ['action-toggle-thumb', 'action-toggle-off', UI], ['action-toggle-thumb', 'action-primary-default', UI],
];
const results = [];
for (const m of ['light', 'dark']) {
  const v = JSON.parse(read(`dist/json/${m}.json`));
  for (const [fg, bg, min] of pairs) {
    const a = v[`--mds-color-${fg}`], b = v[`--mds-color-${bg}`];
    if (!a || !b) { errors.push(`Contrast pair not found: ${fg} on ${bg}`); continue; }
    const r = ratio(a, b);
    results.push(r);
    if (r < min) errors.push(`${m}: ${fg} on ${bg} is ${r.toFixed(2)}:1, needs ${min}:1`);
  }
}

// 4. Code syntax: every name Figma Dev Mode shows must exist in the generated code.
const syntax = JSON.parse(read('dist/json/code-syntax.json'));
const swift = ['MDSColor', 'MDSPlatform', 'MDSDensity'].map((f) => read(`dist/ios/${f}.swift`)).join('\n');
const kotlin = ['MDSColor', 'MDSPlatform', 'MDSDensity'].map((f) => read(`dist/android/${f}.kt`)).join('\n');
let syntaxChecked = 0;
for (const [name, s] of Object.entries(syntax)) {
  const web = s.WEB.match(/^var\((--mds-[a-z0-9-]+)\)$/);
  if (!web || !defined.has(web[1])) errors.push(`Code syntax for ${name}: ${s.WEB} is not a defined CSS variable`);
  const prop = (x) => x && x.split('.').pop();
  if (s.iOS && !new RegExp(`\\b(let|var) ${prop(s.iOS)}\\b`).test(swift)) errors.push(`Code syntax for ${name}: ${s.iOS} not in the Swift output`);
  if (s.ANDROID && !new RegExp(`\\bval ${prop(s.ANDROID)}\\b`).test(kotlin)) errors.push(`Code syntax for ${name}: ${s.ANDROID} not in the Compose output`);
  syntaxChecked++;
}
if (syntaxChecked !== expected.length) errors.push(`Code syntax covers ${syntaxChecked} of ${expected.length} tokens`);

if (errors.length) {
  console.error(`Token check failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Token check passed: ${expected.length} tokens present, all references resolve, ${results.length} colour pairs pass AA (lowest ${Math.min(...results).toFixed(2)}:1), code syntax for all ${syntaxChecked} matches the generated CSS, Swift and Compose.`);
