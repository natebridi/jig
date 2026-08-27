import { Dialog as Base } from '@base-ui/react/dialog';
import type { ReactElement, ReactNode, Ref } from 'react';
import { warnInDev } from '../dev';
import { Icon } from '../icon';
import { ScrollArea } from '../scrollarea';
import {
  actions as actionsClass,
  backdrop,
  body,
  bodyNoActions,
  bodyNoHeader,
  close,
  description as descriptionClass,
  header,
  headerInsetForClose,
  panel,
  popup,
  popupOutsideClose,
  sizes,
  title as titleClass,
  viewport,
} from './dialog.css';

export type DialogSize = 'sm' | 'md' | 'lg';

/** Where the close button sits relative to the visible frame. */
export type DialogClosePlacement = 'inside' | 'outside';

export interface DialogProps {
  /**
   * The body. Scrolls in a ScrollArea when it overflows, between the pinned
   * header and actions.
   */
  children?: ReactNode;
  /**
   * The dialog's heading, and what gives it its accessible name. Optional —
   * pass `aria-label` instead when the dialog has no visible heading.
   */
  title?: ReactNode;
  /** Sub-heading below the title, associated as the accessible description. */
  description?: ReactNode;
  /**
   * The button row, laid out at the trailing edge. Buttons are the caller's:
   * count, order, variant and handlers.
   */
  actions?: ReactNode;
  /**
   * A button that opens the dialog. Base UI composes its open-state handlers
   * onto whatever element is passed, so this is normally a `Button`.
   */
  trigger?: ReactElement;
  /** Controlled open state. Omit to let the dialog manage its own. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: DialogSize;
  /**
   * `outside` lifts the close button above the frame, onto the scrim — for a
   * dialog whose content should reach its own edges, such as an image.
   */
  closePlacement?: DialogClosePlacement;
  /** Names the close button for assistive technology. */
  closeLabel?: string;
  /**
   * The accessible name, when there is no `title` to take it from. A dialog
   * with neither logs a development warning.
   */
  'aria-label'?: string;
  /** Applied to the visible frame, which is the element a caller would size. */
  className?: string;
  style?: React.CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A modal panel over a scrim.
 *
 * Every frame prop is optional. Passing none of them leaves a plain panel
 * around whatever the children are, which is also how a dialog that should
 * scroll as one page is reached — with nothing pinned above or below it, the
 * body is the whole frame. Decided in apps/docs/decisions/0008-dialog.html.
 *
 * The popup is two elements: Base UI's `Popup` positions and reserves space,
 * and an inner panel carries the surface. That is what lets the close button
 * sit outside the frame without escaping the popup's own box (D1's note).
 */
export function Dialog({
  children,
  title,
  description,
  actions,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  size = 'md',
  closePlacement = 'inside',
  closeLabel = 'Close',
  className,
  style,
  ref,
  ...props
}: DialogProps) {
  const label = props['aria-label'];

  // The type cannot express "required only when `title` is absent", so the
  // runtime check is what remains — the same answer 0005 reached for
  // ToggleButton's `value`. An unnamed dialog is announced as just "dialog".
  if (title == null && label == null) {
    warnInDev(
      'Dialog: pass `title`, or `aria-label` when the dialog has no visible heading. Without one the dialog has no accessible name.'
    );
  }

  const hasHeader = title != null || description != null;
  const closeInside = closePlacement === 'inside';

  return (
    <Base.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange: (next: boolean) => onOpenChange(next) } : {})}
    >
      {trigger != null && <Base.Trigger render={trigger} />}

      <Base.Portal>
        <Base.Backdrop className={backdrop} />
        <Base.Viewport className={viewport}>
          <Base.Popup
            className={[popup, sizes[size], closeInside ? undefined : popupOutsideClose]
              .filter(Boolean)
              .join(' ')}
            {...(label != null ? { 'aria-label': label } : {})}
          >
            <div
              ref={ref}
              className={[panel, className].filter(Boolean).join(' ')}
              {...(style ? { style } : {})}
            >
              {hasHeader && (
                <div
                  className={[header, closeInside ? headerInsetForClose : undefined]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {title != null && <Base.Title className={titleClass}>{title}</Base.Title>}
                  {description != null && (
                    <Base.Description className={descriptionClass}>{description}</Base.Description>
                  )}
                </div>
              )}

              <ScrollArea
                className={[body, hasHeader ? undefined : bodyNoHeader, actions ? undefined : bodyNoActions]
                  .filter(Boolean)
                  .join(' ')}
              >
                {children}
              </ScrollArea>

              {actions != null && <div className={actionsClass}>{actions}</div>}
            </div>

            {/* A sibling of the panel rather than a child of it, so `outside`
                is a different offset rather than a different structure. Base UI
                asks for a Close inside every modal popup so touch screen
                readers can escape it. */}
            <Base.Close className={close[closePlacement]} aria-label={closeLabel}>
              <Icon icon="x" size="1.1em" />
            </Base.Close>
          </Base.Popup>
        </Base.Viewport>
      </Base.Portal>
    </Base.Root>
  );
}
