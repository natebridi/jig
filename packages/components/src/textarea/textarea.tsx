import { Field } from '@base-ui/react/field';
import type { ComponentProps, CSSProperties, ReactNode, Ref, TextareaHTMLAttributes } from 'react';
import { Icon, type IconName } from '../icon';
import { warnInDev } from '../dev';
import {
  control,
  description as descriptionClass,
  error as errorClass,
  field,
  fieldIconSize,
  glyph,
  HEIGHT,
  label as labelClass,
  LINES,
  MAX_HEIGHT,
  slot,
} from './textarea.css';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps
  // `size` is dropped for the reason it is dropped on `Input` — the native
  // attribute means something else. `rows` and `cols` are dropped because
  // `field-sizing: content` makes them inert: they would type-check, read
  // correctly, and do nothing. `lines` is the prop that works.
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'rows' | 'cols'> {
  /**
   * The field's label. Rendered as a real `<label>` bound to the control, so
   * this is how the textarea gets its accessible name.
   */
  label?: ReactNode;
  /** Hint text below the control, associated via `aria-describedby`. */
  description?: ReactNode;
  /**
   * An error message from outside the component — a server response, or a form
   * library. Passing it marks the field invalid and shows the message
   * unconditionally. Leave it undefined to let the browser's own constraint
   * validation (`required`, `maxLength`) drive the invalid state instead.
   */
  error?: ReactNode;
  size?: TextareaSize;
  /**
   * A decorative icon on the leading edge, from the curated set. Sized and
   * placed by the field; it aligns to the first line rather than to the middle
   * of the box, so it stays put as the control grows.
   */
  icon?: IconName;
  /**
   * How many lines of text the control shows before it grows — its floor, not
   * its height.
   *
   * Deliberately not `rows`: `field-sizing: content` ignores that attribute, so
   * the count is applied as a `min-height` instead. One line of this is
   * exactly one `Input`, and each line after it adds one line box.
   *
   * @default 3
   */
  lines?: number;
  /**
   * How many lines the control grows to before it stops and scrolls. Unset by
   * default, so the field grows with its value.
   *
   * It caps a manual resize as well, because `max-height` clamps the inline
   * height the drag handle writes.
   */
  maxLines?: number;
  /**
   * Applied to the field wrapper, not the control — the wrapper is the element
   * the surrounding layout sees. Same contract as `Input`.
   */
  className?: string;
  /** Applied to the field wrapper, for the same reason as `className`. */
  style?: CSSProperties;
  /** The control — the element you would focus, select or measure. */
  ref?: Ref<HTMLTextAreaElement>;
}

/**
 * A multi-line text field.
 *
 * Styled as `Input` is, and sized so that a one-line Textarea is exactly as
 * tall as an Input beside it. It grows with its value through
 * `field-sizing: content`; `lines` sets the floor and `maxLines` the cap.
 *
 * The control can be dragged taller by its grip. Doing so hands the height to
 * the user permanently — the browser writes an inline height, and nothing in
 * the platform clears it — so the field stops growing on its own from then on.
 * The drag is still clamped by `lines` and `maxLines`.
 *
 * `label` is the accessible name and should always be set. `className` and
 * `style` land on the field wrapper; every other prop reaches the
 * `<textarea>`.
 *
 * @example
 * <Textarea
 *   label="Release note"
 *   icon="pencil-simple"
 *   lines={3}
 *   maxLines={12}
 *   description="Markdown is fine."
 * />
 */
export function Textarea({
  label,
  description,
  error,
  size = 'md',
  icon,
  lines = 3,
  maxLines,
  disabled,
  name,
  className,
  style,
  ...props
}: TextareaProps) {
  if (maxLines != null && maxLines < lines) {
    // Not clamped, because clamping would make the rendered height disagree
    // with the props that produced it. CSS already resolves the conflict in
    // `min-height`'s favour; this just says so out loud. 0020 D3.
    warnInDev(
      `Textarea: maxLines (${maxLines}) is below lines (${lines}), so the cap has no effect — a shorter maximum than minimum is ignored by the browser.`
    );
  }

  const controlElement = (
    <Field.Control
      // `Field.Control` renders an `<input>` by default and its props are
      // typed for one; `render` swaps the element but not the types, so every
      // handler here carries an `HTMLTextAreaElement` where Base UI declares
      // an `HTMLInputElement`. The cast is at this boundary only — the public
      // `TextareaProps` above is the type that is right about the element, and
      // the props still travel through `Field.Control` so that Field's own
      // value tracking (`filled`, `dirty`) keeps working.
      {...(props as ComponentProps<typeof Field.Control>)}
      render={<textarea />}
      disabled={disabled}
      className={control({ size, hasIcon: icon != null })}
      // The counts, not the heights — textarea.css.ts owns the arithmetic.
      // The cap is the exception: "no cap" has to reach CSS as `none`, which
      // no calc can produce, so it is passed as a whole value or not at all.
      style={
        {
          [LINES]: lines,
          ...(maxLines != null
            ? { [MAX_HEIGHT]: `calc(var(${HEIGHT}) + ${maxLines - 1} * 1lh)` }
            : {}),
        } as CSSProperties
      }
    />
  );

  return (
    <Field.Root
      className={[field, className].filter(Boolean).join(' ')}
      {...(style ? { style } : {})}
      disabled={disabled}
      name={name}
      // Undefined rather than false, so an absent error leaves validity to the
      // browser rather than asserting the field is valid. See Input.
      invalid={error != null ? true : undefined}
    >
      {label != null && <Field.Label className={labelClass}>{label}</Field.Label>}

      {icon != null ? (
        <span className={slot}>
          <Icon icon={icon} size={fieldIconSize} className={glyph({ size })} />
          {controlElement}
        </span>
      ) : (
        controlElement
      )}

      {description != null && (
        <Field.Description className={descriptionClass}>{description}</Field.Description>
      )}

      {/* `match` fixed to true because the message came from outside — Field
          cannot re-derive a server-side error from the control's ValidityState. */}
      {error != null && (
        <Field.Error className={errorClass} match>
          {error}
        </Field.Error>
      )}
    </Field.Root>
  );
}
