import { useScrollReveal } from '../../hooks/useScrollReveal'

const process = [
  { step: '01', label: 'Open Communication' },
  { step: '02', label: 'Spatial Expression' },
  { step: '03', label: 'From Idea to Space' },
  { step: '04', label: 'Realization' },
]

export function About() {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section id="about" className="px-6 py-32 md:px-12">
      <div ref={ref} className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <p className="max-w-md text-2xl leading-snug font-medium md:text-3xl" data-reveal>
          MoMaKorea doesn&apos;t offer standardized solutions, but applies a standardized way of
          working to guarantee quality, efficiency, and creativity — for the most delicate and
          creative design.
        </p>
        <div className="flex flex-col gap-6" data-reveal>
          {process.map((item) => (
            <div key={item.step} className="flex items-baseline gap-4 border-b border-white/10 pb-4">
              <span className="text-sm text-(--color-muted)">{item.step}</span>
              <span className="text-lg">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
