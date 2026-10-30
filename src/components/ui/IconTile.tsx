import React from 'react';

/**
 * IconTile — shared "attractive icon" treatment used across the RailFleet UI.
 *
 * Wraps any lucide-react icon in a rounded gradient tile with a colored glow.
 *
 * Variants:
 *  - "solid": bright gradient tile (for dark backgrounds, active states)
 *  - "soft":  translucent tinted tile with colored border/glow (default; for cards & lists)
 *
 * Tone class maps are written as complete literal strings so Tailwind (v4)
 * can statically detect every utility — never build class names dynamically.
 */

export type IconTone =
  | 'amber'
  | 'orange'
  | 'rose'
  | 'red'
  | 'pink'
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'sky'
  | 'cyan'
  | 'emerald'
  | 'teal'
  | 'lime'
  | 'slate';

export type IconTileSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconTileVariant = 'solid' | 'soft';

interface ToneStyle {
  solid: string;
  soft: string;
}

const TONES: Record<IconTone, ToneStyle> = {
  amber: {
    solid: 'bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 text-slate-950 shadow-amber-500/40',
    soft: 'bg-gradient-to-br from-amber-400/20 to-orange-500/10 text-amber-300 border border-amber-400/30 shadow-amber-500/20',
  },
  orange: {
    solid: 'bg-gradient-to-br from-orange-300 via-orange-400 to-rose-500 text-slate-950 shadow-orange-500/40',
    soft: 'bg-gradient-to-br from-orange-400/20 to-rose-500/10 text-orange-300 border border-orange-400/30 shadow-orange-500/20',
  },
  rose: {
    solid: 'bg-gradient-to-br from-rose-400 via-rose-500 to-rose-700 text-white shadow-rose-500/40',
    soft: 'bg-gradient-to-br from-rose-500/20 to-rose-600/10 text-rose-300 border border-rose-400/30 shadow-rose-500/20',
  },
  red: {
    solid: 'bg-gradient-to-br from-red-400 via-red-500 to-rose-600 text-white shadow-red-500/40',
    soft: 'bg-gradient-to-br from-red-500/20 to-rose-500/10 text-red-300 border border-red-400/30 shadow-red-500/20',
  },
  pink: {
    solid: 'bg-gradient-to-br from-pink-400 via-pink-500 to-fuchsia-600 text-white shadow-pink-500/40',
    soft: 'bg-gradient-to-br from-pink-500/20 to-fuchsia-500/10 text-pink-300 border border-pink-400/30 shadow-pink-500/20',
  },
  violet: {
    solid: 'bg-gradient-to-br from-violet-400 via-violet-500 to-purple-600 text-white shadow-violet-500/40',
    soft: 'bg-gradient-to-br from-violet-500/20 to-purple-500/10 text-violet-300 border border-violet-400/30 shadow-violet-500/20',
  },
  indigo: {
    solid: 'bg-gradient-to-br from-indigo-400 via-indigo-500 to-blue-600 text-white shadow-indigo-500/40',
    soft: 'bg-gradient-to-br from-indigo-500/20 to-blue-500/10 text-indigo-300 border border-indigo-400/30 shadow-indigo-500/20',
  },
  blue: {
    solid: 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 text-white shadow-blue-500/40',
    soft: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-300 border border-blue-400/30 shadow-blue-500/20',
  },
  sky: {
    solid: 'bg-gradient-to-br from-sky-300 via-sky-400 to-cyan-500 text-slate-950 shadow-sky-500/40',
    soft: 'bg-gradient-to-br from-sky-400/20 to-cyan-500/10 text-sky-300 border border-sky-400/30 shadow-sky-500/20',
  },
  cyan: {
    solid: 'bg-gradient-to-br from-cyan-300 via-cyan-400 to-teal-500 text-slate-950 shadow-cyan-500/40',
    soft: 'bg-gradient-to-br from-cyan-400/20 to-teal-500/10 text-cyan-300 border border-cyan-400/30 shadow-cyan-500/20',
  },
  emerald: {
    solid: 'bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-500 text-slate-950 shadow-emerald-500/40',
    soft: 'bg-gradient-to-br from-emerald-400/20 to-teal-500/10 text-emerald-300 border border-emerald-400/30 shadow-emerald-500/20',
  },
  teal: {
    solid: 'bg-gradient-to-br from-teal-300 via-teal-400 to-cyan-500 text-slate-950 shadow-teal-500/40',
    soft: 'bg-gradient-to-br from-teal-400/20 to-cyan-500/10 text-teal-300 border border-teal-400/30 shadow-teal-500/20',
  },
  lime: {
    solid: 'bg-gradient-to-br from-lime-300 via-lime-400 to-emerald-500 text-slate-950 shadow-lime-500/40',
    soft: 'bg-gradient-to-br from-lime-400/20 to-emerald-500/10 text-lime-300 border border-lime-400/30 shadow-lime-500/20',
  },
  slate: {
    solid: 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 text-amber-300 border border-slate-600/60 shadow-black/40',
    soft: 'bg-gradient-to-br from-slate-700/40 to-slate-900/40 text-slate-300 border border-slate-600/50 shadow-black/30',
  },
};

const SIZES: Record<IconTileSize, { box: string; icon: string }> = {
  xs: { box: 'w-6 h-6 rounded-lg', icon: 'w-3 h-3' },
  sm: { box: 'w-8 h-8 rounded-lg', icon: 'w-4 h-4' },
  md: { box: 'w-10 h-10 rounded-xl', icon: 'w-5 h-5' },
  lg: { box: 'w-12 h-12 rounded-xl', icon: 'w-6 h-6' },
  xl: { box: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7' },
};

export interface IconTileProps {
  /** lucide-react icon component */
  icon: React.ElementType;
  tone?: IconTone;
  size?: IconTileSize;
  variant?: IconTileVariant;
  /** add a gentle pulse (for "live" style indicators) */
  pulse?: boolean;
  /** extra classes on the tile box */
  className?: string;
  /** extra classes on the icon itself */
  iconClassName?: string;
  title?: string;
}

export const IconTile: React.FC<IconTileProps> = ({
  icon: Icon,
  tone = 'amber',
  size = 'md',
  variant = 'soft',
  pulse = false,
  className = '',
  iconClassName = '',
  title,
}) => {
  const toneStyle = TONES[tone] ?? TONES.amber;
  const sizeStyle = SIZES[size] ?? SIZES.md;

  return (
    <span
      title={title}
      className={[
        'inline-flex items-center justify-center flex-shrink-0',
        'shadow-lg ring-1 ring-white/10',
        'transition-all duration-300 group-hover:scale-110',
        sizeStyle.box,
        toneStyle[variant],
        pulse ? 'animate-pulse' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon className={`${sizeStyle.icon} ${iconClassName}`} strokeWidth={2.25} />
    </span>
  );
};

export default IconTile;
