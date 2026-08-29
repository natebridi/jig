import { Combobox as Base } from '@base-ui/react/combobox';
import { Field } from '@base-ui/react/field';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { Icon } from '../icon';
import {
  label as tokenLabel,
  remove as tokenRemove,
  token as tokenStyle,
  tokenIconSize,
} from '../token/token.css';
import { ScrollArea } from '../scrollarea';
import {
  chips as chipsClass,
  control,
  description as descriptionClass,
  empty as emptyClass,
  error as errorClass,
  field,
  groupLabel as groupLabelClass,
  iconSize,
  indicator as indicatorClass,
  input as inputClass,
  item as itemRecipe,
  label as labelClass,
  list as listClass,
  popup as popupClass,
  positioner as positionerClass,
  trigger as triggerClass,
} from './combobox.css';

export type ComboboxSize = 'sm' | 'md' | 'lg';

/**
 * One option. `label` is what the user reads and what the internal filter
 * matches against; `value` is what comes back.
 */
export interface ComboboxItem<Value = string> {
  value: Value;
  label: string;
  disabled?: boolean;
}

/**
 * A labelled set of options.
 *
 * Groups are a shape inside `items` rather than a separate prop, because that
 * is the shape Base UI's own `items` already reads — its `Group<Item>` is
 * `{ [key: string]: unknown; items: readonly Item[] }`, so this is handed over
 * without a mapping layer. Decided in apps/docs/decisions/0011-combobox.html
 * (D2), which also records the cost: flat data has to be reshaped by the caller.
 */
export interface ComboboxGroup<Value = string> {
  label: string;
  items: readonly ComboboxItem<Value>[];
}

const isGroup = <Value,>(
  entry: ComboboxItem<Value> | ComboboxGroup<Value>
): entry is ComboboxGroup<Value> => Array.isArray((entry as ComboboxGroup<Value>).items);

interface ComboboxOwnProps<Value> {
  /**
   * The options, flat or grouped. A grouped entry is `{ label, items }`; the
   * two shapes can be mixed in one array, and the type discriminates on the
   * presence of `items`.
   */
  items: readonly (ComboboxItem<Value> | ComboboxGroup<Value>)[];
  /**
   * The field's label. Rendered as a real `<label>` bound to the control, so
   * this is how the combobox gets its accessible name — one without it is
   * announced as unlabelled.
   */
  label?: ReactNode;
  /** Hint text below the control, associated via `aria-describedby`. */
  description?: ReactNode;
  /**
   * An error message from outside the component. Passing it marks the field
   * invalid and shows the message unconditionally.
   */
  error?: ReactNode;
  /** Shown in the popup when the query matches nothing. */
  emptyMessage?: ReactNode;
  placeholder?: string;
  size?: ComboboxSize;
  disabled?: boolean;
  required?: boolean;
  /** Identifies the field when a form is submitted. */
  name?: string;
  /**
   * Applied to the field wrapper, not the control — the wrapper is the element
   * the surrounding layout sees. Same reasoning Input records.
   */
  className?: string;
  /** Applied to the field wrapper, for the same reason as `className`. */
  style?: CSSProperties;
  /** The input — the element you would focus or measure. */
  ref?: Ref<HTMLInputElement>;
}

/** Single selection: one value, or `null` for none. */
export type ComboboxSingleProps<Value> = ComboboxOwnProps<Value> & {
  multiple?: false;
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value | null) => void;
};

/**
 * Multiple selection. Selected options render as `Token`s inside the field —
 * 0011 D3, which finally consumes the height 0006 derived from `size.control`
 * so a Token nests inside a field of the same size.
 */
export type ComboboxMultipleProps<Value> = ComboboxOwnProps<Value> & {
  multiple: true;
  value?: readonly Value[];
  defaultValue?: readonly Value[];
  onValueChange?: (value: Value[]) => void;
};

export type ComboboxProps<Value = string> =
  | ComboboxSingleProps<Value>
  | ComboboxMultipleProps<Value>;

/**
 * A text field that filters a list of options as you type.
 *
 * Options are passed as `items` rather than as children. Each is
 * `{ value, label }`, where `label` is shown and matched against the query and
 * `value` is what `onValueChange` reports. To group them, pass
 * `{ label, items }` entries instead; the two shapes can be mixed in one array.
 *
 * `multiple` turns the value into an array and renders each selection as a
 * removable chip inside the field, which grows as chips wrap.
 *
 * `label` is the accessible name and should always be set. `description` and
 * `error` are wired to the control for you; passing `error` also marks the
 * field invalid.
 *
 * Filtering happens inside the component, so `items` should be the full set of
 * options rather than a pre-filtered result.
 *
 * @example
 * <Combobox
 *   label="Reviewers"
 *   multiple
 *   items={[
 *     { label: 'Engineering', items: [{ value: 'ada', label: 'Ada Lovelace' }] },
 *     { label: 'Design', items: [{ value: 'grace', label: 'Grace Hopper' }] },
 *   ]}
 *   value={reviewers}
 *   onValueChange={setReviewers}
 * />
 */
export function Combobox<Value = string>({
  items,
  label,
  description,
  error,
  emptyMessage = 'No results',
  placeholder,
  size = 'md',
  disabled,
  required,
  name,
  multiple,
  value,
  defaultValue,
  onValueChange,
  className,
  style,
  ref,
}: ComboboxProps<Value>) {
  // Values come back from Base UI on their own, so a chip needs the label
  // looked up. Flat and grouped entries both contribute.
  const labelOf = (needle: Value) => {
    for (const entry of items) {
      const candidates = isGroup(entry) ? entry.items : [entry];
      for (const option of candidates) {
        if (option.value === needle) return option.label;
      }
    }
    return String(needle);
  };

  const renderItem = (option: ComboboxItem<Value>) => (
    <Base.Item
      key={String(option.value)}
      // The caller's own value, not the item object. `items` entries are
      // `{ value, label }`, which is Base UI's own `LabeledItem` shape, so it
      // resolves the label for display and for filtering without help — and
      // `value` / `onValueChange` then speak in the same currency the public
      // API declares.
      value={option.value}
      disabled={option.disabled}
      className={itemRecipe({ size })}
    >
      {option.label}
      <Base.ItemIndicator className={indicatorClass}>
        <Icon icon="check" size={iconSize} />
      </Base.ItemIndicator>
    </Base.Item>
  );

  return (
    <Field.Root
      className={[field, className].filter(Boolean).join(' ')}
      {...(style ? { style } : {})}
      disabled={disabled}
      name={name}
      // Undefined rather than false: `false` would assert the field is valid
      // and override the browser's own validation.
      invalid={error != null ? true : undefined}
    >
      <Base.Root
        items={items as readonly never[]}
        multiple={multiple as never}
        value={value as never}
        defaultValue={defaultValue as never}
        onValueChange={onValueChange as never}
        disabled={disabled}
        required={required}
        name={name}
      >
        {/* Base UI's own Label, not `Field.Label`. Both `Combobox.Label` and
            `Combobox.Input` read `useFieldRootContext`, so the Combobox parts
            wire themselves into the surrounding `Field.Root`; nesting one in
            `Field.Label` left the input with no accessible name at all. */}
        {label != null && <Base.Label className={labelClass}>{label}</Base.Label>}

        {/* Base UI's own InputGroup, not a plain div: it registers itself as
            `inputGroupElement`, which is what the Positioner anchors the popup
            to. Without it the popup anchors to the input, which in a multiple
            combobox starts after the chips — so the list hung off the middle
            of the field. It also carries Field's state as data attributes. */}
        <Base.InputGroup className={control({ size, multiple: multiple === true })}>
          {multiple === true && (
            <Base.Chips className={chipsClass}>
              <Base.Value>
                {(selected: readonly Value[]) =>
                  selected.map((selectedValue) => ({ value: selectedValue, label: labelOf(selectedValue) })).map((option) => (
                    /*
                     * Token's *styles*, not the Token component. 0011 D3 chose
                     * "Jig Tokens as the chips" on the grounds that its remove
                     * control already exists — but Token owns that button, and
                     * `Combobox.ChipRemove` is also a button (useButton,
                     * nativeButton: true) and is the only one wired to the
                     * combobox's own removal. Nesting them is invalid HTML, and
                     * Base UI exposes no imperative remove to hand to Token's.
                     * So the pill wears `tokenStyle`, `tokenLabel` and
                     * `tokenRemove`, and the button inside it is Base UI's.
                     * Recorded in the doc's As built.
                     */
                    <Base.Chip
                      key={String(option.value)}
                      render={<span />}
                      className={tokenStyle({ color: 'warm', size })}
                    >
                      <span className={tokenLabel}>{option.label}</span>
                      <Base.ChipRemove
                        className={tokenRemove}
                        aria-label={`Remove ${option.label}`}
                      >
                        <Icon icon="x" size={tokenIconSize} />
                      </Base.ChipRemove>
                    </Base.Chip>
                  ))
                }
              </Base.Value>
            </Base.Chips>
          )}

          <Base.Input
            ref={ref}
            className={inputClass}
            placeholder={placeholder}
            disabled={disabled}
          />

          <Base.Trigger className={triggerClass} aria-label="Open">
            <Base.Icon>
              <Icon icon="caret-down" size={iconSize} />
            </Base.Icon>
          </Base.Trigger>
        </Base.InputGroup>

        <Base.Portal>
          <Base.Positioner className={positionerClass} sideOffset={4}>
            <Base.Popup className={popupClass}>
              <Base.Empty className={emptyClass}>{emptyMessage}</Base.Empty>
              <ScrollArea>
                <Base.List className={listClass}>
                  {(entry: ComboboxItem<Value> | ComboboxGroup<Value>) =>
                    isGroup(entry) ? (
                      <Base.Group key={entry.label} items={entry.items}>
                        <Base.GroupLabel className={groupLabelClass}>
                          {entry.label}
                        </Base.GroupLabel>
                        <Base.Collection>
                          {(option: ComboboxItem<Value>) => renderItem(option)}
                        </Base.Collection>
                      </Base.Group>
                    ) : (
                      renderItem(entry)
                    )
                  }
                </Base.List>
              </ScrollArea>
            </Base.Popup>
          </Base.Positioner>
        </Base.Portal>
      </Base.Root>

      {description != null && (
        <Field.Description className={descriptionClass}>{description}</Field.Description>
      )}

      {error != null && (
        <Field.Error className={errorClass} match>
          {error}
        </Field.Error>
      )}
    </Field.Root>
  );
}
