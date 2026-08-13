import { HTMLAttributes } from 'react';
import { adorn } from './adorn.css';

export type AdornStyle = 'semibold' | 'bold' | 'italic' | 'code' | 'muted' | 'accent' | 'danger';

export interface AdornProps extends HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  with?: AdornStyle;
}

export function Adorn({ as: Component = 'span', with: adornStyle, className, children, ...props }: AdornProps) {
  return (
    <Component
      className={[adornStyle && adorn({ with: adornStyle }), className].filter(Boolean).join(' ') || undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
