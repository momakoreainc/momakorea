// One-time migration: uploads the current public/projects/* images to Vercel
// Blob and seeds data/projects.json there, so the live site (which now reads
// project content from /api/projects at runtime) and the admin panel have
// something to start from. Requires BLOB_READ_WRITE_TOKEN in the environment
// (copy it from the Vercel dashboard's Storage > Blob store > .env.local tab).
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { put } from '@vercel/blob'

const root = path.resolve(import.meta.dirname, '..')
const publicDir = path.join(root, 'public')

const PROJECTS_SEED = [
  {
    id: 'jeonju-exhibition-convention-center',
    title: 'Jeonju Exhibition & Convention Center',
    category: 'Cultural & Public Spaces',
    location: 'Jeonju',
    year: '2025',
    cover: 'projects/jeonju-exhibition-convention-center/cover.jpg',
    summary:
      'A large-scale convention and exhibition venue built around open circulation, warm timber, and flexible event spaces.',
    sections: [
      {
        heading: 'Entrance Hall',
        body: 'Tall timber columns and louvered walls bring warmth and gravitas to a soaring entrance hall built for smooth crowd flow. A black-lined ceiling and evenly spaced fixtures keep the space calm and orderly, ready to shift from everyday lounge to press-conference and registration hub.',
        image: 'projects/jeonju-exhibition-convention-center/1.jpg',
      },
      {
        heading: 'VIP Lounge',
        body: 'Deep wood tones and muted colors give the VIP lounge a grounded, refined atmosphere. Diffused ceiling light spreads softly through the room, while brown leather and fabric furniture balance formality with comfort — a private retreat for important meetings.',
        image: 'projects/jeonju-exhibition-convention-center/2.jpg',
      },
      {
        heading: 'Grand Ballroom',
        body: 'Walnut-toned acoustic panels and a darkened ceiling lend the grand hall a stately presence. Angled walls and horizontal cove lighting add depth and rhythm, while a chandelier casts a soft veil of light — a space equally suited to international conferences and galas.',
        image: 'projects/jeonju-exhibition-convention-center/3.jpg',
      },
    ],
  },
  {
    id: 'jeonju-indie-film-house',
    title: 'Jeonju Independent Film House',
    category: 'Cultural & Public Spaces',
    location: 'Jeonju',
    year: '2024',
    cover: 'projects/jeonju-indie-film-house/cover.jpg',
    summary: "An open cultural space where film, books, and people's stories intersect.",
    sections: [
      {
        heading: 'Lobby',
        body: 'A wall of open shelving invites visitors to browse film and culture titles freely. Bronze steel and perforated bronze panels reinterpret the flicker of a film frame in modern detail, linking exhibition, reading, and lounge areas into one continuous cultural experience.',
        image: 'projects/jeonju-indie-film-house/1.jpg',
      },
      {
        heading: 'Cinema Lounge',
        body: 'Black tones and soft lighting set an immersive mood for moviegoing. Small wall fixtures echo light scattering from a film frame, while repeating linear frames mark the theater entrance. Ticketing and snacks are combined for convenience, with window seating for lingering before and after a screening.',
        image: 'projects/jeonju-indie-film-house/2.jpg',
      },
    ],
  },
  {
    id: 'jeonju-ecocity-community-center',
    title: 'Jeonju Ecocity Community Center',
    category: 'Sports & Community',
    location: 'Jeonju',
    year: '2025',
    cover: 'projects/jeonju-ecocity-community-center/cover.jpg',
    summary:
      'A sports and community complex where dynamic ceiling lines and angled walls give athletic spaces a refined energy.',
    sections: [
      {
        heading: 'Lounge & Reception',
        body: 'Long ceiling lines and angled walls express the dynamism of the sports facility with a refined touch. A black reception counter anchors the space, working with lounge furniture to create a comfortable place to gather.',
        image: 'projects/jeonju-ecocity-community-center/1.jpg',
      },
      {
        heading: 'Interior',
        body: 'Open sightlines and a restrained material palette carry the same clarity through the building, keeping circulation legible for the large crowds a community sports center draws.',
        image: 'projects/jeonju-ecocity-community-center/2.jpg',
      },
    ],
  },
  {
    id: 'wanju-sambong-library',
    title: 'Wanju Sambong Library',
    category: 'Education & Library',
    location: 'Wanju',
    year: '2023',
    cover: 'projects/wanju-sambong-library/cover.jpg',
    summary:
      'A three-story public library that lets reading, study, and rest flow naturally from lobby to reading room.',
    sections: [
      {
        heading: '1st Floor — Reading Hall',
        body: 'Abundant natural light and views of the surrounding landscape carry through from the lobby to the reading and lounge areas. Warm wood and a restrained palette shape a variety of study seating and relaxed lounging spots, completing an open library where reading, study, and rest flow together.',
        image: 'projects/wanju-sambong-library/1.jpg',
      },
      {
        heading: "2nd Floor — Children's Library",
        body: 'Rainbow-hued shelving brings energy to a bright, open space built for children to discover books on their own. Low shelves and child-sized furniture keep everything within easy reach, while a house-shaped reading nook invites kids to step inside a story.',
        image: 'projects/wanju-sambong-library/2.jpg',
      },
    ],
  },
  {
    id: 'namwon-public-library',
    title: 'Namwon Public Library',
    category: 'Education & Library',
    location: 'Namwon',
    year: '2020',
    cover: 'projects/namwon-public-library/cover.jpg',
    summary: "A library whose repeating gabled shelving forms a warm, symbolic skyline of its own.",
    sections: [
      {
        heading: 'Reading Hall',
        body: 'Rows of shelving shaped like rooftops repeat to form a friendly, symbolic landscape unique to the library. Wood shelving set between white frames adds warmth to a light, airy structure, while shelving and reading seats merge into a single architectural gesture for browsing and staying awhile.',
        image: 'projects/namwon-public-library/1.jpg',
      },
      {
        heading: 'Lobby',
        body: 'High ceilings and exposed concrete overhead keep an open, gallery-like atmosphere, with windows framing the city and a range of reading spots turning an everyday library into a cultural destination.',
        image: 'projects/namwon-public-library/2.jpg',
      },
    ],
  },
  {
    id: 'hwaseong-city-council',
    title: 'Hwaseong City Council Hall',
    category: 'Government',
    location: 'Hwaseong',
    year: '2026',
    cover: 'projects/hwaseong-city-council/cover.jpg',
    summary: 'A civic hall balancing approachable public lobbies with the quiet formality of council offices.',
    sections: [
      {
        heading: 'Lobby',
        body: 'Curved wood benches invite visitors to linger and connect in a welcoming public lobby, with timber carried throughout for warmth and stability. The elevator hall, finished in marble and bronze steel, adds a further note of quality.',
        image: 'projects/hwaseong-city-council/1.jpg',
      },
      {
        heading: 'Council Offices',
        body: 'A calm, considered atmosphere built for the dignity of civic work, using deep wood, neutral fabric, stone, and leather with restraint. Black and brown tones balance with light beige and grey for a settled, cohesive image, with consistent design language scaling across offices of different rank and function.',
        image: 'projects/hwaseong-city-council/2.jpg',
      },
    ],
  },
  {
    id: 'cheonan-buldang-complex',
    title: 'Cheonan Buldang-dong Complex',
    category: 'Government',
    location: 'Cheonan',
    year: '2026',
    cover: 'projects/cheonan-buldang-complex/cover.jpg',
    summary: 'A civic complex blending a welcoming public service center with community reading and meeting spaces.',
    sections: [
      {
        heading: "Children's Reading Room",
        body: 'Circular shelving, low sofas, and seating in varied sizes let children read and linger freely. Soft curves and repeating circular ceiling elements add a friendly rhythm, rounding out a joyful reading experience.',
        image: 'projects/cheonan-buldang-complex/1.jpg',
      },
      {
        heading: 'Council Chamber',
        body: 'A bright, refined council chamber built around white and light wood. A large U-shaped table anchors the room, keeping sightlines and dialogue open between participants — a dignified, professional meeting space fitting a civic building.',
        image: 'projects/cheonan-buldang-complex/2.jpg',
      },
    ],
  },
  {
    id: 'jeonju-museum-of-art',
    title: 'Jeonju Museum of Art',
    category: 'Museum & Exhibition',
    location: 'Jeonju',
    year: '2024',
    cover: 'projects/jeonju-museum-of-art/cover.jpg',
    summary: 'A contemporary museum built from board-formed concrete, metal, and glass.',
    sections: [
      {
        heading: 'Lobby & Entrance',
        body: 'Board-formed exposed concrete, metal, and glass shape a restrained, contemporary entrance and lobby. The solid texture of concrete meets fine wood grain for a space that feels calm yet warm, while translucent glass and natural light draw visitors gently toward the galleries.',
        image: 'projects/jeonju-museum-of-art/1.jpg',
      },
      {
        heading: 'Galleries',
        body: 'Conservation, exhibition, and experience are woven into a single visitor flow. A glass-fronted storage vault keeps works safe while letting visitors view the collection up close, and restrained color paired with high-quality gallery lighting lets the texture and form of each piece read clearly.',
        image: 'projects/jeonju-museum-of-art/2.jpg',
      },
    ],
  },
  {
    id: 'jeonju-culture-content-center',
    title: 'Jeonju Korean Culture Experience Center',
    category: 'Museum & Exhibition',
    location: 'Jeonju',
    year: '2024',
    cover: 'projects/jeonju-culture-content-center/cover.jpg',
    summary: 'A digital media and exhibition space reimagining the roots of Korean culture for a contemporary audience.',
    sections: [
      {
        heading: 'Interactive Lobby',
        body: 'A curved interactive media wall greets visitors in the basement lobby, drawing them naturally toward the galleries. A regular grid of louvers and lighting keeps brightness even and the ceiling composition orderly, while an open gallery layout flexibly hosts a range of media and sculptural works.',
        image: 'projects/jeonju-culture-content-center/1.jpg',
      },
      {
        heading: 'Reception Hall',
        body: 'Bright tones and a long, open circulation welcome visitors into the hall. Repeating sculptural fixtures — hanji paper set between acrylic panels — layer light with a sense of depth, casting a soft glow that reinterprets Korean tradition in a contemporary register.',
        image: 'projects/jeonju-culture-content-center/2.jpg',
      },
    ],
  },
  {
    id: 'namwon-medical-center',
    title: 'Namwon Medical Center',
    category: 'Medical Center & Pharmacy',
    location: 'Namwon',
    year: '2025',
    cover: 'projects/namwon-medical-center/cover.jpg',
    summary:
      "A hospital ward where a curved nurses' station and calm, healing-focused interiors support both patients and staff.",
    sections: [
      {
        heading: "Nurses' Station & Ward",
        body: "A softly curved nurses' station with indirect lighting balances staff efficiency with patients' peace of mind. The lounge pairs large windows and natural light with blue benches and bright wood furniture for easy rest and conversation, while patient rooms in white and neutral grey create a stable environment for healing.",
        image: 'projects/namwon-medical-center/1.jpg',
      },
      {
        heading: 'Wayfinding',
        body: 'Symmetrical planning, linear lighting, and a clear floor-by-floor signage system make the ward easy to navigate, completing a consistent, calming image across the hospital.',
        image: 'projects/namwon-medical-center/2.jpg',
      },
    ],
  },
  {
    id: 'jeonju-kkotsim-hotel',
    title: 'Jeonju Kkotsim Hotel',
    category: 'Hotel & Villa',
    location: 'Jeonju',
    year: '2022',
    cover: 'projects/jeonju-kkotsim-hotel/cover.jpg',
    summary:
      "A hotel that reinterprets Jeonju's spirit of 'kkotsim' — communal warmth, artistry, integrity, and innovation — in a contemporary language.",
    sections: [
      {
        heading: 'Lobby',
        body: "An open layout and a long reception counter capture Jeonju's spirit of communal warmth. Metal petal sculptures overhead and soft light express an appreciation for art and grace, while restrained stone and composed lines give the lobby a steady, dignified order.",
        image: 'projects/jeonju-kkotsim-hotel/1.jpg',
      },
      {
        heading: 'Junior Suite',
        body: 'Warm walnut wood and grey fabric panelling create a stable, cozy retreat, with black metal accents adding depth and a modern edge. Layered textiles — a fabric headboard, rug, and curtains — bring visual and tactile comfort under natural and soft indirect light.',
        image: 'projects/jeonju-kkotsim-hotel/2.jpg',
      },
    ],
  },
  {
    id: 'jeju-townhouse',
    title: 'Jeju Townhouse',
    category: 'Apartment & Residence',
    location: 'Jeju',
    year: '2017',
    cover: 'projects/jeju-townhouse/cover.jpg',
    summary:
      "A townhouse that draws Jeju's landscape indoors through wide windows, herringbone wood floors, and a restrained black-and-white palette.",
    sections: [
      {
        heading: 'Living & Kitchen',
        body: "Wide windows pull Jeju's scenery into the interior, while a restrained black-and-white palette and herringbone wood flooring add warmth and depth. Living room, kitchen, and study connect fluidly, balancing openness with each space's own sense of privacy.",
        image: 'projects/jeju-townhouse/1.jpg',
      },
      {
        heading: 'Bedroom',
        body: "A sloped ceiling and skylight bring Jeju's sky indoors, deepening the mood of the bedroom. Low shelving, a rattan chair, and the contrast between white walls and dark wood complete a quiet space where reading and rest coexist.",
        image: 'projects/jeju-townhouse/2.jpg',
      },
    ],
  },
  {
    id: 'momakorea-hq',
    title: 'MoMaKorea Headquarters',
    category: 'Office',
    location: 'Jeonju',
    year: '2024',
    cover: 'projects/momakorea-hq/cover.jpg',
    summary: "MoMaKorea's own studio — raw concrete and black frames shaping a restrained, industrial-edged workspace.",
    sections: [
      {
        heading: 'Studio',
        body: 'Raw concrete texture and black framing set an industrial, restrained tone throughout the studio. Open work areas connect organically with enclosed meeting rooms, balancing collaboration with focus, while abundant greenery and natural light keep the environment lively.',
        image: 'projects/momakorea-hq/1.jpg',
      },
      {
        heading: 'Library Wall',
        body: 'Open shelving and practical storage double as spatial dividers, keeping the plan open while defining each function — a place where creative work and easy rest coexist.',
        image: 'projects/momakorea-hq/2.jpg',
      },
    ],
  },
  {
    id: 'naju-udelight-cafe',
    title: 'Naju Udelight Cafe',
    category: 'Commercial',
    location: 'Naju',
    year: '2020',
    cover: 'projects/naju-udelight-cafe/cover.jpg',
    summary: 'A cafe where exposed concrete and wood louvers balance raw texture with warmth.',
    sections: [
      {
        heading: 'Main Hall',
        body: 'Exposed concrete and wood louvers bring together raw texture and warmth. Point lighting and a multi-level layout add depth and openness, while terrazzo and black furniture complete a refined, understated contrast.',
        image: 'projects/naju-udelight-cafe/1.jpg',
      },
      {
        heading: 'Lounge & Terrace',
        body: 'Repeating ceiling louvers and abundant planting add depth and life, with lounge, bar, and stepped seating linked together so guests can settle in however they like.',
        image: 'projects/naju-udelight-cafe/2.jpg',
      },
    ],
  },
]

const urlCache = new Map()

async function uploadImage(relativePath) {
  if (urlCache.has(relativePath)) return urlCache.get(relativePath)

  const filePath = path.join(publicDir, relativePath)
  const buffer = await readFile(filePath)
  const contentType = relativePath.endsWith('.png') ? 'image/png' : 'image/jpeg'

  const blob = await put(relativePath, buffer, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  })

  urlCache.set(relativePath, blob.url)
  console.log(`uploaded ${relativePath}`)
  return blob.url
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is not set. See scripts/migrate-to-blob.mjs header.')
    process.exit(1)
  }

  const projects = []
  for (const seed of PROJECTS_SEED) {
    const cover = await uploadImage(seed.cover)
    const sections = []
    for (const section of seed.sections) {
      sections.push({ ...section, image: await uploadImage(section.image) })
    }
    projects.push({ ...seed, cover, sections })
  }

  await put('data/projects.json', JSON.stringify(projects, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })

  console.log(`\nSeeded ${projects.length} projects to Blob.`)
}

main()
