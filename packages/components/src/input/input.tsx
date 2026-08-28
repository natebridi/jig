import { Field } from '@base-ui/react/field';
import type { CSSProperties, InputHTMLAttributes, ReactNode, Ref } from 'react';
import {
  control,
  description as descriptionClass,
  error as errorClass,
  field,
  label as labelClass,
} from './input.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  // `size` is a native input attribute meaning "width in characters", which
  // nothing here wants and which would collide with the size ramp. Dropped
  // from the inherited props so the design-system meaning is the only one.
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * The field's label. Rendered as a real `<label>` bound to the control, so
   * this is how the input gets its accessible name — an input without one is
   * announced as unlabelled.
   */
  label?: ReactNode;
  /** Hint text below the control, associated via `aria-describedby`. */
  description?: ReactNode;
  /**
   * An error message from outside the component — a server response, or a form
   * library. Passing it marks the field invalid and shows the message
   * unconditionally. Leave it undefined to let the browser's own constraint
   * validation (`required`, `type="email"`, `pattern`) drive the invalid state
   * instead.
   */
  error?: ReactNode;
  size?: InputSize;
  /**
   * Applied to the field wrapper, not the control.
   *
   * The wrapper is the element the surrounding layout sees — it is the flex or
   * grid child, and it is what holds the label and the description as well as
   * the input. Styling the control instead meant a `flexGrow` or a `gridColumn`
   * landed on an element the parent layout never touches, and silently did
   * nothing. `Slider` has always worked this way; Input was the outlier.
   *
   * Everything else spreads onto the control, so `placeholder`, `onChange`,
   * `id` and the rest reach the `<input>` as they read.
   */
  className?: string;
  /** Applied to the field wrapper, for the same reason as `className`. */
  style?: CSSProperties;
  /** The control — the element you would focus, select or measure. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * A single-line text field.
 *
 * The label, description and error are props rather than composable parts:
 * anyone who wants to assemble the pieces by hand is better served by Base UI
 * directly, and making them props means the accessible wiring between them
 * cannot be left out by accident.
 */
export function Input({
  label,
  description,
  error,
  size = 'md',
  disabled,
  name,
  className,
  style,
  ...props
}: InputProps) {
  return (
    <Field.Root
      className={[field, className].filter(Boolean).join(' ')}
      {...(style ? { style } : {})}
      disabled={disabled}
      name={name}
      // Undefined rather than false: passing `false` would assert the field is
      // valid and override the browser's own validation. Undefined leaves
      // validity to Field, which is where it belongs.
      invalid={error != null ? true : undefined}
    >
      {label != null && <Field.Label className={labelClass}>{label}</Field.Label>}

      <Field.Control {...props} disabled={disabled} className={control({ size })} />

      {description != null && (
        <Field.Description className={descriptionClass}>{description}</Field.Description>
      )}

      {/* `match` fixed to true because the message came from outside — Field
          cannot re-derive a server-side error from the input's ValidityState. */}
      {error != null && (
        <Field.Error className={errorClass} match>
          {error}
        </Field.Error>
      )}
    </Field.Root>
  );
}
