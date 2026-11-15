import { QRCodeSVG } from 'qrcode.react'

export default function MyQrCode({ userId }: { userId: string }) {
  const base = import.meta.env.VITE_APP_URL ?? window.location.origin
  const url = `${base}/add/${userId}`

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body items-center text-center">
        <h2 className="card-title">My QR code</h2>
        <div className="rounded-box bg-white p-3">
          <QRCodeSVG value={url} size={200} level="M" marginSize={2} bgColor="#ffffff" fgColor="#000000" />
        </div>
        <p className="text-sm opacity-70">Scan to add me as a friend</p>
      </div>
    </div>
  )
}