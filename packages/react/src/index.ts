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

// Phase 3: Overlays
export { Scrim } from './components/Overlay/shared';
export type { ScrimProps } from './components/Overlay/shared';
export { Tooltip } from './components/Tooltip/Tooltip';
export type { TooltipProps } from './components/Tooltip/Tooltip';
export { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './components/Popover/Popover';
export type { PopoverContentProps } from './components/Popover/Popover';
export {
  Menu, MenuTrigger, MenuContent, MenuItem, MenuRadioGroup, MenuRadioItem, MenuCheckboxItem,
  MenuLabel, MenuSeparator, MenuGroup, MenuSub, MenuSubTrigger, MenuSubContent,
} from './components/Menu/Menu';
export type { MenuContentProps, MenuItemProps, MenuRadioItemProps, MenuCheckboxItemProps } from './components/Menu/Menu';
export { Select, SelectItem, SelectGroup, SelectLabel, SelectSeparator } from './components/Select/Select';
export type { SelectProps, SelectItemProps } from './components/Select/Select';
export {
  Dialog, DialogTrigger, DialogContent, DialogClose,
  Drawer, DrawerTrigger, DrawerContent, DrawerClose,
  BottomSheet, BottomSheetTrigger, BottomSheetContent, BottomSheetClose,
} from './components/Dialog/Dialog';
export type { DialogContentProps, DrawerContentProps, BottomSheetContentProps } from './components/Dialog/Dialog';
export { usePortalContainer } from './provider/ThemeProvider';

// Phase 4: Data display and feedback
export { Card } from './components/Card/Card';
export type { CardProps } from './components/Card/Card';
export { Badge } from './components/Badge/Badge';
export type { BadgeProps, BadgeTone } from './components/Badge/Badge';
export { Tag } from './components/Tag/Tag';
export type { TagProps } from './components/Tag/Tag';
export { Avatar, initialsOf } from './components/Avatar/Avatar';
export type { AvatarProps, AvatarSize } from './components/Avatar/Avatar';
export { List, ListRow } from './components/ListRow/ListRow';
export type { ListProps, ListRowProps } from './components/ListRow/ListRow';
export { Alert } from './components/Alert/Alert';
export type { AlertProps, AlertTone } from './components/Alert/Alert';
export { ToastProvider, useToast } from './components/Toast/Toast';
export type { ToastOptions, ToastTone } from './components/Toast/Toast';
export { ProgressBar, Spinner, Skeleton, SkeletonListRow } from './components/Progress/Progress';
export type { ProgressBarProps, SpinnerProps, SkeletonProps } from './components/Progress/Progress';
export { EmptyState } from './components/EmptyState/EmptyState';
export type { EmptyStateProps, EmptyStateType } from './components/EmptyState/EmptyState';
