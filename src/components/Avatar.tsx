export default function Avatar({ name }: { name: string }) {
  return (
    <div className="avatar avatar-placeholder">
      <div className="bg-neutral text-neutral-content w-10 rounded-full">
        <span>{name.charAt(0).toUpperCase()}</span>
      </div>
    </div>
  )
}