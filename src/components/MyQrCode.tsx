// src/components/MyQrCode.tsx

import { QRCodeSVG } from 'qrcode.react'

export default function MyQrCode({ userId }: { userId: string }) {
  const base = import.meta.env.VITE_APP_URL ?? window.location.origin
  const url = `${base}/add/${userId}`

  return (
    <div>
      <QRCodeSVG value={url} size={220} level="M" marginSize={4} bgColor="#ffffff" fgColor="#000000" />
      <p>Scan to add me as a friend</p>
    </div>
  )
}