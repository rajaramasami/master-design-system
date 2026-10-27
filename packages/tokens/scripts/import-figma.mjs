// Converts the raw Figma variable export (figma-export/variables.json) into
// W3C DTCG token files under src/. One file per Figma collection and mode, so
// each mode can be built into its own CSS selector, Swift file or Compose object.
//
// Run: pnpm tokens:import (from the repo root)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = JSON.parse(readFileSync(join(root, 'figma-export/variables.json'), 'utf8'));

const BASE = { P: 'primitives', B: 'brand' };
const MODES = {
  C: { name: 'color', modes: { Light: 'light', Dark: 'dark' } },
  P: { name: 'platform', modes: { Web: 'web', iOS: 'ios', Android: 'android' } },
  D: { name: 'density', modes: { Compact: 'compact', Comfortable: 'comfortable' } },
};

// "{Primitives:color/violet/50}" -> "{color.violet.50}"
const ref = (v) =>
  typeof v === 'string' && v.startsWith('{') ? `{${v.slice(1, -1).split(':')[1].split('/').join('.')}}` : v;

// DTCG $type from the Figma type, the name and the scopes
function typeOf(name, figmaType, scopes) {
  if (figmaType === 'C') return 'color';
  if (figmaType === 'S') {
    if (scopes.includes('FONT_FAMILY')) return 'fontFamily';
    if (name.startsWith('motion/easing')) return 'cubicBezier';
    return 'string';
  }
  if (name.startsWith('font/weight')) return 'fontWeight';
  if (name.startsWith('motion/duration')) return 'duration';
  if (name.startsWith('opacity/')) return 'number';
  return 'dimension';
}

function valueOf(type, v) {
  if (typeof v === 'string' && v.startsWith('{')) return ref(v);
  switch (type) {
    case 'dimension': return `${v}px`;
    case 'duration': return `${v}ms`;
    case 'number': return v / 100; // Figma opacity 0-100 -> 0-1
    case 'cubicBezier': return v.replace(/cubic-bezier\(|\)/g, '').split(',').map(Number);
    default: return v;
  }
}

function put(tree, path, token) {
  const parts = path.split('/');
  let node = tree;
  for (const p of parts.slice(0, -1)) node = node[p] ??= {};
  node[parts.at(-1)] = token;
}

const files = {};
const file = (name) => (files[name] ??= {});

for (const [col, name, figmaType, scopes, value] of raw.base) {
  const type = typeOf(name, figmaType, scopes);
  put(file(BASE[col]), name, { $type: type, $value: valueOf(type, value) });
}

for (const [col, name, figmaType, scopes, byMode] of raw.modes) {
  const { name: collection, modes } = MODES[col];
  const type = typeOf(name, figmaType, scopes);
  for (const [figmaMode, mode] of Object.entries(modes)) {
    put(file(`${collection}/${mode}`), name, { $type: type, $value: valueOf(type, byMode[figmaMode]) });
  }
}

// Composite styles: typography and effects, referencing the variables above.
const styles = {};
const weights = { Regular: 400, Medium: 500, 'Semi Bold': 600, Bold: 700 };
for (const s of raw.textStyles) {
  const [family, style] = s.f.split('/');
  const familyRef = family === 'JetBrains Mono' ? '{brand.font.mono}' : '{brand.font.sans}';
  // "typography/heading/xl" -> "text/heading/xl" (the platform file already owns "typography/...")
  put(styles, s.n.replace(/^typography\//, 'text/'), {
    $type: 'typography',
    $value: {
      fontFamily: familyRef,
      fontWeight: weights[style],
      fontSize: `{${s.b.fontSize.split('/').join('.')}}`,
      lineHeight: `{${s.b.lineHeight.split('/').join('.')}}`,
      letterSpacing: `${s.ls / 100}em`,
    },
  });
}
for (const s of raw.effectStyles) {
  if (s.blur) {
    put(styles, s.n, { $type: 'dimension', $value: `${s.blur}px` });
    continue;
  }
  put(styles, s.n, {
    $type: 'shadow',
    $value: s.e.map((e) => ({
      color: `{${e.c.split('/').join('.')}}`,
      offsetX: '0px',
      offsetY: `${e.y}px`,
      blur: `${e.r}px`,
      spread: `${e.sp}px`,
    })),
  });
}
files.styles = styles;

let count = 0;
for (const [name, tree] of Object.entries(files)) {
  const out = join(root, 'src', `${name}.json`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(tree, null, 2) + '\n');
  count++;
}
console.log(`Wrote ${count} DTCG files to src/ from ${raw.base.length + raw.modes.length} Figma variables.`);
