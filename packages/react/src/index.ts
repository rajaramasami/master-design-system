// Foundations (Phase 0)
export { ThemeProvider, useMds } from './provider/ThemeProvider';
export type { ThemeProviderProps, Theme, Platform, Density, IconFamily, MdsSettings } from './provider/ThemeProvider';
export { Icon } from './icons/Icon';
export type { IconProps, IconSize } from './icons/Icon';
export { icons, iconNames, filledIcons } from './icons/registry';
export type { IconName, FilledIconName } from './icons/registry';
export { cn } from './lib/cn';

// Phase 1: Actions
export { Button, buttonVariants } from './components/Button/Button';
export type { ButtonProps } from './components/Button/Button';
export { IconButton, iconButtonVariants } from './components/IconButton/IconButton';
export type { IconButtonProps } from './components/IconButton/IconButton';

// Phase 2: Form controls
export { FieldMessage } from './components/FieldMessage/FieldMessage';
export type { FieldMessageProps, FieldMessageTone } from './components/FieldMessage/FieldMessage';
export { TextField } from './components/TextField/TextField';
export type { TextFieldProps } from './components/TextField/TextField';
export { Textarea } from './components/Textarea/Textarea';
export type { TextareaProps } from './components/Textarea/Textarea';
export { Checkbox, CheckboxGroup } from './components/Checkbox/Checkbox';
export type { CheckboxProps, CheckboxGroupProps } from './components/Checkbox/Checkbox';
export { RadioGroup, Radio } from './components/Radio/Radio';
export type { RadioGroupProps, RadioProps } from './components/Radio/Radio';
export { Switch } from './components/Switch/Switch';
export type { SwitchProps } from './components/Switch/Switch';
