export default function Logo({ className = '', color = '#D4A574', size = 'md' }: {
  className?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = { sm: 32, md: 48, lg: 72 }
  const h = sizes[size]

  return (
    <svg
      width={h * 2.5}
      height={h}
      viewBox="0 0 240 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="120"
        y="52"
        textAnchor="middle"
        fill={color}
        style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '48px', fontWeight: '400' }}
      >
        Louise
      </text>
      <line x1="50" y1="65" x2="190" y2="65" stroke={color} strokeWidth="0.8" />
      <polygon points="118,70 122,75 126,70 122,65" fill={color} />
    </svg>
  )
}
