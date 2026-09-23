import type { Project, ProjectCategory } from '../types'

export const categoryDescriptions: Record<ProjectCategory, string> = {
  Residential:
    'A private residence reimagined around light, material honesty, and the rhythms of daily life.',
  Office: 'A workspace built for open communication and everyday clarity.',
  Commercial: 'A commercial space designed to turn everyday visits into considered experiences.',
  Exhibition:
    'An exhibition environment shaped around spatial storytelling and material research.',
  Hotel: 'A hospitality space where planning, lighting, and materials come together for guests.',
}

function dummyImage(seed: string, width: number, height: number) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

type ProjectSeed = {
  id: string
  title: string
  category: ProjectCategory
  location: string
  year: string
}

const projectSeeds: ProjectSeed[] = [
  { id: 'jeju-town-house', title: 'Jeju Town House', category: 'Residential', location: 'Jeju', year: '2017' },
  { id: 'doosung-korea-office', title: 'Doosung Korea Office', category: 'Office', location: 'Jeonju', year: '2017' },
  { id: 'gunsan-hardy-cafe', title: 'Gunsan Hardy Cafe', category: 'Commercial', location: 'Gunsan', year: '2017' },
  { id: 'lx-exhibition', title: 'LX Exhibition', category: 'Exhibition', location: 'Jeju', year: '2017' },
  { id: 'theme-museum-of-korean-liquor', title: 'Theme Museum of Korean Liquor', category: 'Exhibition', location: 'Wanju', year: '2017' },
  { id: 'huawei', title: 'Huawei', category: 'Exhibition', location: 'Jeonju', year: '2017' },
  { id: 'wanju-exhibition-hall', title: 'Wanju Exhibition Hall', category: 'Exhibition', location: 'Wanju', year: '2017' },
  { id: 'jeonju-kyungwon-hotel', title: 'Jeonju Kyungwon Hotel', category: 'Hotel', location: 'Jeonju', year: '2017' },
]

export const projects: Project[] = projectSeeds.map((seed) => ({
  ...seed,
  cover: dummyImage(seed.id, 1600, 1000),
  summary: categoryDescriptions[seed.category],
  sections: [
    {
      heading: 'Overview',
      body: `Placeholder overview for ${seed.title} — replace with the real project story: the brief, the site, and what made it worth designing for.`,
      image: dummyImage(`${seed.id}-1`, 1000, 750),
    },
    {
      heading: 'Approach',
      body: 'Placeholder approach notes — describe the spatial planning, material choices, and lighting decisions that shaped the space.',
      image: dummyImage(`${seed.id}-2`, 1000, 750),
    },
    {
      heading: 'Result',
      body: 'Placeholder result summary — capture the finished space and how it reads once it was in use.',
      image: dummyImage(`${seed.id}-3`, 1000, 750),
    },
  ],
}))
