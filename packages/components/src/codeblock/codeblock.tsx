import { useEffect, useRef, useState, type HTMLAttributes, type Ref } from 'react';
import { IconButton } from '../iconbutton';
import { Tooltip } from '../tooltip';
import { visuallyHidden } from '../visually-hidden.css';
import { bar, code as codeStyle, label as labelStyle, pre as preStyle, root } from './codeblock.css';

export interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
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
