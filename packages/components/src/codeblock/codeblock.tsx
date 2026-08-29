import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type Ref } from 'react';
import { IconButton } from '../iconbutton';
import { Tooltip } from '../tooltip';
import { visuallyHidden } from '../visually-hidden.css';
import { bar, code as codeStyle, label as labelStyle, pre as preStyle, root } from './codeblock.css';

// The root is always a `div` — unlike Stack or Typography there is no `as`
// here — so the props are that element's, not a generic HTMLElement's.
// `children` is narrowed to a string because the snippet gets dedented and
// measured as text.
export interface CodeBlockProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Display a script name, language, etc. at top of block. */
  label?: string;
  /** Content to display as a plain string. */
  children: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Strips the indentation a template literal picks up from the JSX it is
 * written in, so the snippet renders at the indentation it was authored at
 * rather than wherever it happened to sit in the source.
 */
function dedent(source: string): string {
  const lines = source.split('\n');

  while (lines.length && lines[0]?.trim() === '') lines.shift();
  while (lines.length && lines[lines.length - 1]?.trim() === '') lines.pop();

  const indent = lines
    .filter((line) => line.trim() !== '')
    .reduce((shortest, line) => Math.min(shortest, line.length - line.trimStart().length), Infinity);

  return indent === Infinity ? lines.join('\n') : lines.map((line) => line.slice(indent)).join('\n');
}

/**
 * A block of source code with a copy button.
 *
 * `children` is the code as a plain string — not markup, and not a
 * `<pre>`/`<code>` pair, which the component renders for you. Indentation is
 * preserved exactly, so template literals should be trimmed before they are
 * passed.
 *
 * `label` names the snippet in the bar above it: a file path, a language, or
 * whatever identifies it. The copy button confirms in place for two seconds
 * and needs a secure context, since it uses the async clipboard API.
 *
 * Long lines scroll horizontally rather than wrapping.
 *
 * @example
 * <CodeBlock label="vite.config.ts">
 *   {`export default defineConfig({\n  plugins: [react()],\n})`}
 * </CodeBlock>
 */
export function CodeBlock({ label, className, children, ...props }: CodeBlockProps) {
  const source = dedent(children);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access is denied outside a secure context, and can be
      // refused anywhere. Leaving the label alone is the honest signal that
      // nothing reached the clipboard.
    }
  };

  return (
    <div className={[root, className].filter(Boolean).join(' ')} {...props}>
      <div className={bar}>
        <span className={labelStyle}>{label}</span>
        {/*
          Copying is an action, not a state the button stays in — so it is an
          IconButton whose name changes, rather than a toggle. The icon swap is
          the visual half of the same feedback.
        */}
        <Tooltip content={copied ? 'Copied' : 'Copy'} delay={0}>
          <IconButton
            size="sm"
            icon={copied ? 'check' : 'copy'}
            label={copied ? 'Copied' : 'Copy'}
            onClick={copy}
          />
        </Tooltip>
        {/*
          Renaming the button mid-interaction is not reliably announced, so the
          confirmation goes through a live region that is empty until there is
          something to say.
        */}
        <span role="status" className={visuallyHidden}>
          {copied ? 'Copied to clipboard' : ''}
        </span>
      </div>
      {/* Focusable so the overflow is reachable by keyboard, not just by drag. */}
      <pre className={preStyle} tabIndex={0}>
        <code className={codeStyle}>{source}</code>
      </pre>
    </div>
  );
}
