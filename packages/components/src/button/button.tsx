import type { ButtonHTMLAttributes } from 'react';
import { button } from './button.css';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={button({
        color: variant,
        size: size
      })}
      {...props}
    >
      {children}
    </button>
  );
}
