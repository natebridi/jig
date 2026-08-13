import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { Button } from '../button';
import { bar, code as codeStyle, label as labelStyle, pre as preStyle, root } from './codeblock.css';

export interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
  /** Shown at the left of the bar — a script name, a language, a file path. */
  label?: string;
  /** The code itself, as a plain string. */
  children: string;
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
        <Button variant="ghost" size="sm" onClick={copy} aria-live="polite">
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      {/* Focusable so the overflow is reachable by keyboard, not just by drag. */}
      <pre className={preStyle} tabIndex={0}>
        <code className={codeStyle}>{source}</code>
      </pre>
    </div>
  );
}
