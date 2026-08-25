const MAX_DATA_URL_BYTES = 700_000

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read image'))
    img.src = URL.createObjectURL(file)
  })
}

function toDataUrl(img: HTMLImageElement, maxWidth: number, quality: number): string {
  const scale = Math.min(1, maxWidth / img.naturalWidth)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.naturalWidth * scale)
  canvas.height = Math.round(img.naturalHeight * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', quality)
}

/**
 * Resizes/compresses an image client-side into a JPEG data URL small enough
 * to store as a Firestore field (no Storage/Blaze plan needed).
 */
export async function compressImageToDataUrl(file: File): Promise<string> {
  const img = await loadImage(file)
  let width = 900
  let quality = 0.7
  let dataUrl = toDataUrl(img, width, quality)

  for (let attempt = 0; attempt < 4 && dataUrl.length > MAX_DATA_URL_BYTES; attempt++) {
    quality = Math.max(0.35, quality - 0.15)
    width = Math.round(width * 0.85)
    dataUrl = toDataUrl(img, width, quality)
  }

  if (dataUrl.length > MAX_DATA_URL_BYTES) {
    throw new Error('Image too large even after compression')
  }
  return dataUrl
}
