interface AvatarProps {
  name: string
  color: string
  size?: number
  className?: string
}

export function Avatar({ name, color, size = 32, className = '' }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase()
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{ width: size, height: size, background: color, fontSize: size * 0.42 }}
    >
      {initial}
    </span>
  )
}
