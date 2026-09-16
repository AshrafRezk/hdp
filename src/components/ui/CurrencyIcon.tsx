import React from 'react'
import { CURRENCY_CODE } from '../../lib/currency'

interface CurrencyIconProps {
  className?: string
  theme?: 'dark' | 'light'
  style?: React.CSSProperties
}

/** Renders the site currency code (EGP) inline with surrounding price text. */
export default function CurrencyIcon({
  className = 'w-auto object-contain mx-1',
  theme = 'light',
  style,
}: CurrencyIconProps) {
  const isDark =
    typeof document !== 'undefined' &&
    (document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      theme === 'dark')

  return (
    <span
      className={`inline-block align-middle ${className}`}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        fontWeight: 600,
        fontSize: '0.85em',
        letterSpacing: '0.02em',
        color: isDark ? 'inherit' : 'inherit',
        ...style,
      }}
      aria-label={CURRENCY_CODE}
    >
      {CURRENCY_CODE}
    </span>
  )
}
