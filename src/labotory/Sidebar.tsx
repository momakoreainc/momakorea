import { Link, useSearchParams } from 'react-router-dom'
import { CATEGORIES } from './categories'

type SidebarProps = {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get('category')

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-neutral-200 bg-white px-8 py-10 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link to="/" onClick={onClose} className="text-lg font-semibold tracking-tight text-neutral-900">
          MoMaKorea
        </Link>
        <p className="mt-2 text-sm text-neutral-500">Interior Design Studio, Jeonju</p>

        <div className="mt-12">
          <p className="text-xs tracking-widest text-neutral-400 uppercase">Categories</p>
          <nav className="mt-4 flex flex-col gap-2 text-sm">
            <Link
              to="/"
              onClick={onClose}
              className={
                activeCategory === null
                  ? 'font-medium text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
              }
            >
              All
            </Link>
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/?category=${encodeURIComponent(category)}`}
                onClick={onClose}
                className={
                  activeCategory === category
                    ? 'font-medium text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-900'
                }
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>

        <nav className="mt-12 flex flex-col gap-2 text-sm text-neutral-500">
          <Link to="/#about" onClick={onClose} className="hover:text-neutral-900">
            About
          </Link>
          <Link to="/" onClick={onClose} className="hover:text-neutral-900">
            Work
          </Link>
          <Link to="/#contact" onClick={onClose} className="hover:text-neutral-900">
            Contact
          </Link>
        </nav>

        <div className="mt-auto pt-12 text-xs leading-relaxed text-neutral-400">
          MoMaKorea
          <br />
          3F, 181 Songcheonjungang-ro, Deokjin-gu, Jeonju
          <br />
          info@momakorea.com
          <br />
          (+82) 63-236-0908
        </div>
      </aside>
    </>
  )
}
