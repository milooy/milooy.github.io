// 그림 파일의 가로·세로 픽셀을 헤더만 읽어서 알아낸다 (jpg, png, gif, webp).
// 빌드에서 <img width height>를 채워, 그림이 뜨기 전에도 자리를 잡게 한다.
import fs from "node:fs"

export type Size = { width: number; height: number }

const png = (b: Buffer): Size | undefined =>
  b.toString("ascii", 1, 4) === "PNG"
    ? { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }
    : undefined

const gif = (b: Buffer): Size | undefined =>
  b.toString("ascii", 0, 3) === "GIF"
    ? { width: b.readUInt16LE(6), height: b.readUInt16LE(8) }
    : undefined

const webp = (b: Buffer): Size | undefined => {
  if (
    b.toString("ascii", 0, 4) !== "RIFF" ||
    b.toString("ascii", 8, 12) !== "WEBP"
  )
    return undefined
  const chunk = b.toString("ascii", 12, 16)
  if (chunk === "VP8 ")
    return {
      width: b.readUInt16LE(26) & 0x3fff,
      height: b.readUInt16LE(28) & 0x3fff,
    }
  if (chunk === "VP8L") {
    const bits = b.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  if (chunk === "VP8X")
    return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 }
  return undefined
}

// JPEG는 SOF 마커(크기가 적힌 블록)가 나올 때까지 블록을 건너뛴다
const jpeg = (b: Buffer): Size | undefined => {
  if (b[0] !== 0xff || b[1] !== 0xd8) return undefined
  let i = 2
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) return undefined
    const marker = b[i + 1]
    const sof =
      marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)
    if (sof)
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) }
    i += 2 + b.readUInt16BE(i + 2)
  }
  return undefined
}

export const imageSize = (file: string): Size | undefined => {
  const b = fs.readFileSync(file)
  return png(b) ?? gif(b) ?? webp(b) ?? jpeg(b)
}
