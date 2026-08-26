interface AvatarProps {
  name: string
  color: string
  image?: string
  size?: number
  className?: string
}

export function Avatar({ name, color, image, size = 32, className = '' }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase()

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{ width: size, height: size, background: color, fontSize: size * 0.42 }}
    >
      {initial}
    </span>
  )
}
