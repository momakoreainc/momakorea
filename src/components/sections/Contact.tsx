import { useScrollReveal } from '../../hooks/useScrollReveal'

const socials = [
  { label: 'Instagram', href: 'https://instagram.com/moma_1945' },
  { label: 'Facebook', href: 'https://facebook.com/profile.php?id=100078959239422' },
]

export function Contact() {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <footer id="contact" className="px-6 py-32 md:px-12">
      <div ref={ref}>
        <a
          href="mailto:info@momakorea.com"
          className="block text-4xl font-medium tracking-tight md:text-7xl"
          data-reveal
          data-cursor-hover
        >
          Let&apos;s talk →
        </a>
        <div className="mt-6 flex flex-col gap-1 text-sm text-(--color-muted)" data-reveal>
          <span>(+82) 63-236-0908</span>
          <span>전라북도 전주시 덕진구 송천중앙로 181, 3층</span>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6" data-reveal>
          <nav className="flex gap-6">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-(--color-muted) transition-colors hover:text-(--color-fg)"
                data-cursor-hover
              >
                {social.label}
              </a>
            ))}
          </nav>
          <span className="text-sm text-(--color-muted)">&copy; {new Date().getFullYear()} MoMaKorea</span>
        </div>
      </div>
    </footer>
  )
}
