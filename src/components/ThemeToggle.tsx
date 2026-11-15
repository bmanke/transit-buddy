import { useEffect, useState } from 'react'

const THEMES = ['light', 'dark', 'cupcake', 'dracula', 'nord', 'synthwave']

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <select
      className="select select-sm w-32"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      aria-label="Theme"
    >
      {THEMES.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  )
}