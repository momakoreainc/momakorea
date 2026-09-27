import { Link } from 'react-router-dom'

const links = [
  { href: '/#work', label: 'Work' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
]

export function Nav() {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-6 py-5 mix-blend-difference md:px-12">
      <Link to="/" className="flex items-center gap-2 text-sm font-medium tracking-wide" data-cursor-hover>
        <img src={`${import.meta.env.BASE_URL}favicon.png`} alt="" className="h-5 w-5" />
        MoMaKorea
      </Link>
      <nav className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="text-sm text-(--color-muted) transition-colors hover:text-(--color-fg)"
            data-cursor-hover
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
