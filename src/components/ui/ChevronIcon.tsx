export function ChevronIcon({
  direction = 'right',
  className = '',
}: {
  direction?: 'left' | 'right' | 'up' | 'down'
  className?: string
}) {
  const rotation = {
    right: '',
    left: 'rotate-180',
    up: '-rotate-90',
    down: 'rotate-90',
  }[direction]

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-3 transition-transform duration-300 ease-out ${rotation} ${className}`}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}
