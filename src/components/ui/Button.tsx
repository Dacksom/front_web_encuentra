/**
 * Botón reutilizable. Misma forma, cambia color (accent) y peso (variant/size).
 *
 *  variant: primary (relleno) · secondary (borde slate) · soft (fondo claro) · ghost (plano)
 *  size:    sm (pill) · md (default) · lg (acción principal / full-width)
 */
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Accent, SOLID, SOFT } from './accents';

type Variant = 'primary' | 'secondary' | 'soft' | 'ghost';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  children?: React.ReactNode;
  variant?: Variant;
  accent?: Accent; // usado por primary y soft
  size?: Size;
  fullWidth?: boolean;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  iconSize?: number;
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  title?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  id?: string;
  className?: string;
}

const SIZES: Record<Size, string> = {
  sm: 'px-2.5 py-1 text-[11px] gap-1.5 rounded-md',
  md: 'px-4 py-2 text-xs gap-2 rounded-xl',
  lg: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
  xl: 'py-3.5 text-base gap-2 rounded-xl',
};

const ICON_SIZE: Record<Size, number> = { sm: 14, md: 16, lg: 18, xl: 20 };

function variantClasses(variant: Variant, accent: Accent): string {
  switch (variant) {
    case 'primary':
      return `${SOLID[accent]} text-white shadow-md hover:shadow-lg`;
    case 'secondary':
      return 'border bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
    case 'soft':
      return `border shadow-sm ${SOFT[accent]}`;
    case 'ghost':
      return 'text-slate-600 hover:bg-slate-50';
  }
}

export default function Button({
  children,
  variant = 'primary',
  accent = 'slate',
  size = 'md',
  fullWidth,
  icon: Icon,
  iconRight: IconRight,
  iconSize,
  type = 'button',
  className = '',
  ...rest
}: Props) {
  const sz = iconSize ?? ICON_SIZE[size];
  const cls = [
    'inline-flex items-center justify-center font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed',
    SIZES[size],
    variantClasses(variant, accent),
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type={type} className={cls} {...rest}>
      {Icon && <Icon size={sz} className="shrink-0" />}
      {children}
      {IconRight && <IconRight size={sz} className="shrink-0" />}
    </button>
  );
}
