import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// The theme replaces Tailwind's text sizes with the Figma text styles. Without
// this, tailwind-merge would treat `text-body-md` (a size) and
// `text-text-primary` (a colour) as the same group and drop one of them.
const TEXT_STYLES = [
  'display', 'heading-xl', 'heading-lg', 'heading-md', 'heading-sm',
  'body-lg', 'body-md', 'body-md-strong', 'body-sm', 'body-sm-strong',
  'label-md', 'label-sm', 'caption', 'overline', 'code',
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: TEXT_STYLES }],
    },
  },
});

/** Joins class names and resolves Tailwind conflicts, so a `className` prop can override a component's defaults. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
