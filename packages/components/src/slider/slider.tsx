import { Slider as Base } from '@base-ui/react/slider';
import { useEffect, useId, useRef, useState, type ReactNode, type Ref } from 'react';
import { IconButton } from '../iconbutton';
import * as css from './slider.css';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps {
  /** The field's label, rendered as a real `<label>` bound to the control. */
  label?: ReactNode;
  /** Hint text below the control. */
  description?: ReactNode;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** The jump for Page Up/Down and Shift + Arrow. @default 10 */
  largeStep?: number;
  /** Controlled value. Leave undefined and pass `defaultValue` instead to let the slider manage its own. */
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  /** Identifies the field when a form is submitted. */
  name?: string;
  /** `Intl.NumberFormat` options for the value readout. */
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  onValueChange?: (value: number) => void;
  /** Fires when the interaction ends, rather than on every movement. */
  onValueCommitted?: (value: number) => void;
  /**
   * Show minus and plus buttons flanking the track, for adjusting by exactly
   * one step without dragging.
   *
   * @default false
   */
  steppers?: boolean;
  /**
   * Sets the row height from the shared control ramp, so a slider lines up
   * with an Input or Button of the same size.
   *
   * @default 'md'
   */
  size?: SliderSize;
  /** Applied to the root, not the track. */
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/** Snaps to the step grid measured from `min`, then clamps to the range. */
const snap = (value: number, min: number, max: number, step: number) =>
  Math.min(max, Math.max(min, Math.round((value - min) / step) * step + min));

/**
 * A slider for choosing one number from a range.
 *
 * `min`, `max` and `step` bound it; `largeStep` is the jump on Page Up and Page
 * Down. `steppers` adds decrement and increment buttons at each end.
 *
 * `onValueChange` fires continuously while dragging; `onValueCommitted` fires
 * once the drag or key press ends — use that one for anything expensive.
 *
 * `format` takes `Intl.NumberFormat` options, so the value can be shown as a
 * percentage, a currency or a plain number, and is what assistive technology
 * announces.
 *
 * The control occupies exactly the width you give it, so it lines up with the
 * fields around it.
 *
 * @example
 * <Slider
 *   label="Quality"
 *   min={0}
 *   max={1}
 *   step={0.05}
 *   format={{ style: 'percent' }}
 *   value={quality}
 *   onValueCommitted={save}
 * />
 */
export function Slider({
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  largeStep,
  value,
  defaultValue,
  disabled,
  name,
  format,
  locale,
  onValueChange,
  onValueCommitted,
  steppers = false,
  size = 'md',
  className,
  ref,
}: SliderProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const anchorName = `--jig-slider-${uid}`;
  const descriptionId = description != null ? `jig-slider-description-${uid}` : undefined;

  // Mirrored so the steppers know what to add to. The slider is handed a value
  // either way, which keeps one code path rather than branching on whether the
  // caller controls it.
  const [internal, setInternal] = useState(defaultValue ?? min);
  const current = value ?? internal;

  const change = (next: number) => {
    const snapped = snap(next, min, max, step);
    if (value === undefined) setInternal(snapped);
    onValueChange?.(snapped);
  };

  // Base UI puts the accessible slider on an input nested inside the thumb, and
  // Thumb's props land on the wrapping div — so the description has to be tied
  // to the input directly. Field integration would replace this; see 0004's
  // "deliberately not proposed".
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (descriptionId) input.setAttribute('aria-describedby', descriptionId);
    else input.removeAttribute('aria-describedby');
  }, [descriptionId]);

  const stepper = (direction: -1 | 1) => (
    <IconButton
      icon={direction === -1 ? 'minus' : 'plus'}
      label={`${direction === -1 ? 'Decrease' : 'Increase'}${typeof label === 'string' ? ` ${label}` : ''}`}
      variant="ghost"
      size={size}
      disabled={disabled || (direction === -1 ? current <= min : current >= max)}
      onClick={() => {
        const next = snap(current + direction * step, min, max, step);
        change(next);
        onValueCommitted?.(next);
      }}
    />
  );

  return (
    <Base.Root
      ref={ref}
      className={[css.root, css.sizes[size], className].filter(Boolean).join(' ')}
      // Fixed rather than exposed: the thumb insets at min and max so the
      // control's box is exactly its declared width.
      thumbAlignment="edge"
      min={min}
      max={max}
      step={step}
      largeStep={largeStep}
      value={current}
      disabled={disabled}
      name={name}
      format={format}
      locale={locale}
      onValueChange={(next) => change(next as number)}
      onValueCommitted={(next) => onValueCommitted?.(next as number)}
    >
      {label != null && <Base.Label className={css.label}>{label}</Base.Label>}

      <div className={css.row}>
        {steppers && stepper(-1)}

        <Base.Control className={css.control}>
          <Base.Track className={css.track}>
            <Base.Indicator className={css.indicator} />
            <Base.Thumb className={css.thumb} inputRef={inputRef} style={{ anchorName }} />
          </Base.Track>

          {/* The thumb's input already announces the value, so the bubble is
              decorative — hidden from assistive technology rather than read twice. */}
          <Base.Value
            className={css.bubble}
            style={{ positionAnchor: anchorName }}
            aria-hidden
          />
        </Base.Control>

        {steppers && stepper(1)}
      </div>

      {description != null && (
        <div id={descriptionId} className={css.description}>
          {description}
        </div>
      )}
    </Base.Root>
  );
}
