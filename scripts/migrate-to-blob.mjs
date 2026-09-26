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
  {
    "id": "jeonju-wansan-bunker",
    "title": "Jeonju Wansan Bunker The Space",
    "category": "Cultural & Public Spaces",
    "location": "Jeonju",
    "year": "2024",
    "cover": "projects/jeonju-wansan-bunker/cover.jpg",
    "summary": "An adaptive-reuse bunker reborn as a cultural marketplace, pairing raw concrete history with warm timber displays and moody mosaic-tiled corridors.",
    "sections": [
      {
        "heading": "Gift Shop",
        "body": "The original bunker's rough concrete shell was preserved to keep its accumulated sense of time and texture intact. Wall-mounted timber display cases and freestanding tables let visitors browse a rotating lineup of local cultural goods at their own pace. Curved plaster ceilings and warm spotlighting soften the industrial bones of the space.",
        "image": "projects/jeonju-wansan-bunker/1.jpg"
      },
      {
        "heading": "Restroom Corridor",
        "body": "Silver mosaic tile and brushed metal panels bounce light in layers, adding depth and shifting texture to a narrow corridor. A gridded ceiling and linear fixtures reinforce a clear sense of direction, guiding movement smoothly from end to end. Fixtures were kept simple and sculptural, balancing visual impact with easy upkeep.",
        "image": "projects/jeonju-wansan-bunker/2.jpg"
      }
    ]
  },
  {
    "id": "jeonju-food-tourism-creative-town",
    "title": "Jeonju Food Tourism Creative Town",
    "category": "Cultural & Public Spaces",
    "location": "Jeonju",
    "year": "2025",
    "cover": "projects/jeonju-food-tourism-creative-town/cover.jpg",
    "summary": "A multi-level food-and-culture hub where a hanok-inspired lattice ceiling, a bright retail food hall, and a playful children's cooking library share one open building.",
    "sections": [
      {
        "heading": "Food Store",
        "body": "Timber columns and walls recall the warmth of hanok framing and flooring, while a reflective coffered ceiling reinterprets traditional lattice windows for a contemporary reading. Bright, systematic shelving lets regional food products stand out, and an open plan lets reception, lounge, and cafe functions flow into one another.",
        "image": "projects/jeonju-food-tourism-creative-town/1.jpg"
      },
      {
        "heading": "Cooking Library",
        "body": "A frying-pan-and-egg motif and soft curved furniture turn a children's library into a playful food-themed world. Refrigerator-shaped shelving invites kids to pull out a book the way they would an ingredient, while touch displays and a scan-to-animate wall turn reading into hands-on discovery.",
        "image": "projects/jeonju-food-tourism-creative-town/2.jpg"
      }
    ]
  },
  {
    "id": "gongju-culture-arts-center",
    "title": "Gongju Culture & Arts Center",
    "category": "Cultural & Public Spaces",
    "location": "Gongju",
    "year": "2026",
    "cover": "projects/gongju-culture-arts-center/cover.jpg",
    "summary": "A concert hall where deep timber finishes and vertical acoustic louvers unify stage and seating into a single warm, immersive scene.",
    "sections": []
  },
  {
    "id": "jeonju-drone-sports-complex",
    "title": "Jeonju Drone Sports Complex",
    "category": "Cultural & Public Spaces",
    "location": "Jeonju",
    "year": "2024",
    "cover": "projects/jeonju-drone-sports-complex/cover.jpg",
    "summary": "A black-and-orange sports and entertainment complex that channels the speed and motion of drone racing into every surface, from the soccer arena's screens to a gift shop built like a display case.",
    "sections": [
      {
        "heading": "Drone Experience Hall",
        "body": "An exposed ceiling, irregular linear lighting, and interactive exhibits invite visitors to explore drone technology hands-on. A dedicated drone-soccer arena pushes the theme further, wrapping the room in red graphic patterns that echo the sport's speed and flight paths.",
        "image": "projects/jeonju-drone-sports-complex/1.jpg"
      },
      {
        "heading": "Gift Shop",
        "body": "Circular illuminated display cases and metal finishes turn drone merchandise into objects worth admiring, giving the retail corner a sculptural, showcase quality that matches the complex’s futuristic identity.",
        "image": "projects/jeonju-drone-sports-complex/2.jpg"
      }
    ]
  },
  {
    "id": "namwon-art-center",
    "title": "Namwon Art Center",
    "category": "Cultural & Public Spaces",
    "location": "Namwon",
    "year": "2019",
    "cover": "projects/namwon-art-center/cover.jpg",
    "summary": "An open, public-facing art center lobby built on exposed concrete framing and stone finishes, extended by a green-accented rooftop lounge for rest between performances.",
    "sections": [
      {
        "heading": "Rooftop Lounge",
        "body": "By day, a rooftop lawn scattered with colorful bean bags and simple wood furniture gives visitors an easy, open-air place to linger between programs. Globe lights double as sculptural markers scattered across the grass.",
        "image": "projects/namwon-art-center/1.jpg"
      },
      {
        "heading": "Evening Terrace",
        "body": "As dusk falls, the same lawn shifts mood entirely: glowing orbs and the softly lit facade turn the rooftop into an intimate gathering spot, extending the center's hours of use well past sunset.",
        "image": "projects/namwon-art-center/2.jpg"
      }
    ]
  },
  {
    "id": "jeonju-subculture-complex",
    "title": "Jeonju Subculture Complex",
    "category": "Cultural & Public Spaces",
    "location": "Jeonju",
    "year": "2023",
    "cover": "projects/jeonju-subculture-complex/cover.jpg",
    "summary": "A rooftop-driven cultural platform where an arched canopy stage, a garden-view cafe, and a plant-lined atrium staircase let performance, conversation, and daily life mix freely.",
    "sections": [
      {
        "heading": "Cafe Lounge",
        "body": "Floor-to-ceiling glazing frames an open lawn beyond, while a deep green counter and a mix of vintage-industrial furniture give the room a relaxed, collected character. A tall skylight strip and an oversized wall clock anchor the space.",
        "image": "projects/jeonju-subculture-complex/1.jpg"
      },
      {
        "heading": "Atrium Lobby",
        "body": "A dramatic open stair rises past a wall of backlit greenery, connecting the ground-floor lounge to the levels above. Parquet flooring and tall factory-style windows keep the industrial shell feeling warm and lived-in.",
        "image": "projects/jeonju-subculture-complex/2.jpg"
      }
    ]
  },
  {
    "id": "jeonju-1st-industrial-complex-culture-center",
    "title": "Jeonju No.1 Industrial Complex Culture Center",
    "category": "Cultural & Public Spaces",
    "location": "Jeonju",
    "year": "2026",
    "cover": "projects/jeonju-1st-industrial-complex-culture-center/cover.jpg",
    "summary": "A nostalgia-driven cafe built around the memory of a nearby fringe-tree rail line, styled as a vintage train carriage opening onto its own platform.",
    "sections": [
      {
        "heading": "Cafe Hall",
        "body": "Deep green, white, and timber finishes reinterpret the calm of an old train station for a contemporary lounge. High ceilings and generous daylight let a mix of seating and greenery echo the lush scenery once seen from the rail line outside.",
        "image": "projects/jeonju-1st-industrial-complex-culture-center/1.jpg"
      },
      {
        "heading": "Garden Terrace",
        "body": "A second seating area opens fully to the surrounding greenery and concrete courtyard beyond, with a mirrored ceiling detail doubling the sense of space. Long communal tables and a working coffee counter keep the room sociable at any hour.",
        "image": "projects/jeonju-1st-industrial-complex-culture-center/2.jpg"
      }
    ]
  },
  {
    "id": "jeonju-seunghwawon",
    "title": "Jeonju Seunghwawon Memorial Hall",
    "category": "Cultural & Public Spaces",
    "location": "Jeonju",
    "year": "2024",
    "cover": "projects/jeonju-seunghwawon/cover.jpg",
    "summary": "A calm, wood-and-white dining and cafe space designed to give visitors a quiet, unhurried place to rest.",
    "sections": [
      {
        "heading": "Dining Hall",
        "body": "Timber louvers and linear lighting keep the dining hall feeling orderly and composed, while full-height glazing opens the room to the garden outside. Warm wood tones and a restrained palette create a steady, unhurried atmosphere for visitors.",
        "image": "projects/jeonju-seunghwawon/1.jpg"
      }
    ]
  },
  {
    "id": "wanju-multipurpose-gym",
    "title": "Wanju Multipurpose Gymnasium",
    "category": "Sports & Community",
    "location": "Wanju",
    "year": "2025",
    "cover": "projects/wanju-multipurpose-gym/cover.jpg",
    "summary": "A mint-accented multipurpose gymnasium that pairs durable porcelain tile with a rippling white grid louver for a fresh, energetic first impression.",
    "sections": [
      {
        "heading": "Entry & Ticketing",
        "body": "A porcelain-tiled lobby leads to a self-service ticketing counter, with clear wayfinding signage directing visitors toward the courts, shower rooms, and fitness center beyond. Mint-colored accent walls carry the building’s energetic identity down every corridor.",
        "image": "projects/wanju-multipurpose-gym/1.jpg"
      }
    ]
  },
  {
    "id": "jbnu-jinsudang-gain-hall",
    "title": "JBNU Jinsudang Gain Hall",
    "category": "Sports & Community",
    "location": "Jeonju",
    "year": "2022",
    "cover": "projects/jbnu-jinsudang-gain-hall/cover.jpg",
    "summary": "A multipurpose university hall where warm timber and sculptural acoustic paneling create a formal yet inviting setting for lectures and performances alike.",
    "sections": []
  },
  {
    "id": "jbnu-rotc-fitness-center",
    "title": "JBNU ROTC Fitness Center",
    "category": "Sports & Community",
    "location": "Jeonju",
    "year": "2023",
    "cover": "projects/jbnu-rotc-fitness-center/cover.jpg",
    "summary": "A dark, high-contrast training facility where track-pattern flooring and motivational wall graphics sharpen focus and reinforce discipline.",
    "sections": [
      {
        "heading": "Weight Training Hall",
        "body": "Metal mesh partitions, an exposed ceiling, and graphic linear lighting give the training hall a tough, functional edge, with equipment lined along a clear circulation path that keeps training organized and efficient.",
        "image": "projects/jbnu-rotc-fitness-center/1.jpg"
      }
    ]
  },
  {
    "id": "jbnu-jinsudang-fitness-center",
    "title": "JBNU Jinsudang Fitness Center",
    "category": "Sports & Community",
    "location": "Jeonju",
    "year": "2023",
    "cover": "projects/jbnu-jinsudang-fitness-center/cover.jpg",
    "summary": "A light-filled fitness center where warm timber louvers and generous glazing connect indoor training with the campus greenery outside.",
    "sections": [
      {
        "heading": "Training Floor",
        "body": "Overhead timber louvers and linear lighting draw the eye down the length of the room, reinforcing a calm, orderly rhythm. Large windows keep the surrounding campus greenery visible from every machine, letting exercise and rest coexist naturally.",
        "image": "projects/jbnu-jinsudang-fitness-center/1.jpg"
      }
    ]
  },
  {
    "id": "unist-challenge-convergence-hall",
    "title": "UNIST Challenge Convergence Hall",
    "category": "Education & Library",
    "location": "Ulsan",
    "year": "2024",
    "cover": "projects/unist-challenge-convergence-hall/cover.jpg",
    "summary": "A university convergence hall whose black marble lobby and vertical timber striping set a composed, sophisticated tone for a research and collaboration hub.",
    "sections": [
      {
        "heading": "Study Lounge",
        "body": "A wide, sky-lit lounge threads bookable tables, window-side booths, and a loose scatter of pebble-shaped ottomans into one open floor. Timber slat partitions and a soft ceiling coffer break the length into calmer zones without closing anything off, so studying alone and gathering in groups can happen side by side.",
        "image": "projects/unist-challenge-convergence-hall/1.jpg"
      }
    ]
  },
  {
    "id": "jeonju-hwajeong-elementary",
    "title": "Jeonju Hwajeong Elementary School",
    "category": "Education & Library",
    "location": "Jeonju",
    "year": "2023",
    "cover": "projects/jeonju-hwajeong-elementary/cover.jpg",
    "summary": "A children's library that turns its floor plan into a village of house-shaped nooks and wave-like shelving, each corner its own small world for reading.",
    "sections": [
      {
        "heading": "Waterlight Bay",
        "body": "Curved blue seating and shelving that ripples like water give this bay its name. Globe pendants of varying size hang at different heights to suggest light dancing on the surface, adding a playful sparkle above rows of picture books.",
        "image": "projects/jeonju-hwajeong-elementary/1.jpg"
      }
    ]
  },
  {
    "id": "gimje-wolchon-elementary",
    "title": "Gimje Wolchon Elementary School",
    "category": "Education & Library",
    "location": "Gimje",
    "year": "2025",
    "cover": "projects/gimje-wolchon-elementary/cover.jpg",
    "summary": "An elementary library built as a 'small village of books,' its gabled house-shaped shelving opening onto a rooftop deck beneath a scatter of paper-lantern pendants.",
    "sections": [
      {
        "heading": "Sky Library",
        "body": "Tall glazing and a soaring double-height void give the upper library its 'library in the sky' concept. Globe pendants of different sizes float at staggered heights like clouds and starlight, while house-shaped reading pods along the void keep quiet study close to the open, airy space.",
        "image": "projects/gimje-wolchon-elementary/1.jpg"
      }
    ]
  },
  {
    "id": "jeonbuk-school-for-the-blind-library",
    "title": "Jeonbuk School for the Blind Library",
    "category": "Education & Library",
    "location": "Iksan",
    "year": "2025",
    "cover": "projects/jeonbuk-school-for-the-blind-library/cover.jpg",
    "summary": "A tactile, wood-and-green library organized around a central tree-shaped column, its wide clear circulation built for students who read the room with more than their eyes.",
    "sections": [
      {
        "heading": "Lobby",
        "body": "Curved wood-slat ceilings and a white, light-filled palette give the entrance lobby a calm, open first impression. Modular blue seating and a display wall turn the space into an easy gathering point for rest, reading, and conversation before and after school.",
        "image": "projects/jeonbuk-school-for-the-blind-library/1.jpg"
      }
    ]
  },
  {
    "id": "jeonju-hwasan-elementary",
    "title": "Jeonju Hwasan Elementary School",
    "category": "Education & Library",
    "location": "Jeonju",
    "year": "2024",
    "cover": "projects/jeonju-hwasan-elementary/cover.jpg",
    "summary": "A school library whose deep blue, vaulted ceiling reads as a quiet sky over rows of pale timber shelving and a scatter of bright, oversized ottomans.",
    "sections": [
      {
        "heading": "Gallery Corridor",
        "body": "A curving corridor of house-shaped display frames turns the fourth-floor home base into an open gallery for student artwork. Each green-framed 'house' holds a rotating exhibition, inviting classmates and family to slow down and read the walls the way they read the library's shelves.",
        "image": "projects/jeonju-hwasan-elementary/1.jpg"
      }
    ]
  },
  {
    "id": "namwon-ayeong-elementary",
    "title": "Namwon Ayeong Elementary School",
    "category": "Education & Library",
    "location": "Namwon",
    "year": "2023",
    "cover": "projects/namwon-ayeong-elementary/cover.jpg",
    "summary": "A high-ceilinged children's library where a wraparound staircase of shelving doubles as the room's centerpiece, a storybook projected large on the end wall.",
    "sections": [
      {
        "heading": "Window Nook",
        "body": "Along the tall street-facing windows, a run of green built-in benches gives readers a quiet perch with a view. Soft cushioned seating and low tables let children settle in for as long as a chapter, or several, takes.",
        "image": "projects/namwon-ayeong-elementary/1.jpg"
      }
    ]
  },
  {
    "id": "wanju-samnye-elementary",
    "title": "Wanju Samnye Elementary School",
    "category": "Education & Library",
    "location": "Wanju",
    "year": "2023",
    "cover": "projects/wanju-samnye-elementary/cover.jpg",
    "summary": "A two-story elementary library whose sunny yellow second floor gives way to a calmer blue third floor, punctuated by cave-like circular reading pods sunk into the shelving.",
    "sections": [
      {
        "heading": "Atrium Hall",
        "body": "A stone-clad atrium rises through the building's full height, hung with trailing plants and stitched together by open corridors on every floor. Curved wood benches and loose seating turn the crossing point into a natural gathering spot between classes.",
        "image": "projects/wanju-samnye-elementary/1.jpg"
      }
    ]
  },
  {
    "id": "jeonju-misan-elementary",
    "title": "Jeonju Misan Elementary School",
    "category": "Education & Library",
    "location": "Jeonju",
    "year": "2025",
    "cover": "projects/jeonju-misan-elementary/cover.jpg",
    "summary": "A library whose round, cloud-soft ceiling and curling moss-green benches wrap the room into a single continuous gesture for sitting and staying awhile.",
    "sections": [
      {
        "heading": "Dream Floor Atrium",
        "body": "Named the 'Dream Floor,' this full-height atrium lobby wraps a stone feature wall and a canopy of hanging planters around a quiet lounge of curved built-in benches. Natural light falls through the surrounding classroom windows above, making the ground floor the school's brightest crossroads.",
        "image": "projects/jeonju-misan-elementary/1.jpg"
      }
    ]
  },
  {
    "id": "jeonju-yeoul-elementary",
    "title": "Jeonju Yeoul Elementary School",
    "category": "Education & Library",
    "location": "Jeonju",
    "year": "2023",
    "cover": "projects/jeonju-yeoul-elementary/cover.jpg",
    "summary": "A library named for a stream, its curved green seating and light timber shelving echoing the gentle motion of flowing water.",
    "sections": [
      {
        "heading": "Reading Room",
        "body": "A plainer companion space to the library's curved centerpiece, this reading room pairs mobile tables with a green-shelved corner for browsing. An arched window motif and a librarian's curved desk give the everyday classroom-style room a softer, more welcoming edge.",
        "image": "projects/jeonju-yeoul-elementary/1.jpg"
      }
    ]
  },
  {
    "id": "jeonju-songwon-elementary",
    "title": "Jeonju Songwon Elementary School",
    "category": "Education & Library",
    "location": "Jeonju",
    "year": "2025",
    "cover": "projects/jeonju-songwon-elementary/cover.jpg",
    "summary": "A children's library where gabled, house-shaped shelving in forest green turns browsing into a walk through a small wooden village.",
    "sections": [
      {
        "heading": "Computer Lab",
        "body": "Just off the library, a light wood and white computer lab keeps things calm and easy to maintain, with grey flooring and even, glare-free lighting. Rows of shared desks and a teacher's station support both focused digital learning and quiet independent reading.",
        "image": "projects/jeonju-songwon-elementary/1.jpg"
      }
    ]
  },
  {
    "id": "gunsan-sinpung-elementary",
    "title": "Gunsan Sinpung Elementary School",
    "category": "Education & Library",
    "location": "Gunsan",
    "year": "2024",
    "cover": "projects/gunsan-sinpung-elementary/cover.jpg",
    "summary": "A school lobby built around a stepped lounge and a screen-sized void, turning assembly, rest, and gathering into one open vertical space.",
    "sections": [
      {
        "heading": "Library",
        "body": "On the floor below, a lighter-touch library wraps pale timber shelving around a wavy, stepped reading platform. Blue seating and soft stools face full-height windows, giving children a sunlit spot to browse, sit on the floor, or curl up against the shelves.",
        "image": "projects/gunsan-sinpung-elementary/1.jpg"
      }
    ]
  },
  {
    "id": "gwangyang-hwanggeum-school",
    "title": "Gwangyang Hwanggeum Combined School",
    "category": "Education & Library",
    "location": "Gwangyang",
    "year": "2024",
    "cover": "projects/gwangyang-hwanggeum-school/cover.jpg",
    "summary": "A combined elementary-and-middle school library where a golden arched corridor turns rows of bookshelves into a small adventure of its own.",
    "sections": [
      {
        "heading": "Dining Hall",
        "body": "Striped bands of green and lime wrap the ceiling above long communal tables, echoed by a fluted wood-paneled wall running the length of the room. The palette keeps the space playful without losing its sense of order, making a large cafeteria feel welcoming table by table.",
        "image": "projects/gwangyang-hwanggeum-school/1.jpg"
      }
    ]
  },
  {
    "id": "wanju-sambong-middle",
    "title": "Wanju Sambong Middle School",
    "category": "Education & Library",
    "location": "Wanju",
    "year": "2025",
    "cover": "projects/wanju-sambong-middle/cover.jpg",
    "summary": "A calm, light-filled library where white walls and pale wood shelving invite students to browse, sit, and stay awhile.",
    "sections": [
      {
        "heading": "Lobby",
        "body": "Timber louvers unify the two-story lobby, softening the transition between floors while framing views of the courtyard beyond. Loose lounge seating and abundant daylight turn the space into an easy gathering spot between classes.",
        "image": "projects/wanju-sambong-middle/1.jpg"
      }
    ]
  },
  {
    "id": "jeonju-jeolla-middle",
    "title": "Jeonju Jeolla Middle School",
    "category": "Education & Library",
    "location": "Jeonju",
    "year": "2024",
    "cover": "projects/jeonju-jeolla-middle/cover.jpg",
    "summary": "A dramatic tiered lobby where a sculptural blue staircase and a canopy of pendant lights turn the entry hall into the school's social heart.",
    "sections": [
      {
        "heading": "Science Lab",
        "body": "Deep teal cabinetry lines one wall of the science classroom, its glass panels opening the room to the corridor beyond. Mobile desks and task chairs let the space reconfigure easily between lectures, group work, and hands-on experiments.",
        "image": "projects/jeonju-jeolla-middle/1.jpg"
      }
    ]
  },
  {
    "id": "sokcho-middle",
    "title": "Sokcho Middle School",
    "category": "Education & Library",
    "location": "Sokcho",
    "year": "2024",
    "cover": "projects/sokcho-middle/cover.jpg",
    "summary": "A wood-paneled library with linear lighting and terrazzo-toned flooring, built for quiet, sunlit reading.",
    "sections": [
      {
        "heading": "Dining Hall",
        "body": "Bands of green and warm wood wrap the ceiling of the dining hall in a continuous rhythm, echoed by matching green chairs below. The repeating pattern brings order and energy to a room built to serve the whole school at once.",
        "image": "projects/sokcho-middle/1.jpg"
      }
    ]
  },
  {
    "id": "iksan-bucheon-middle",
    "title": "Iksan Bucheon Middle School",
    "category": "Education & Library",
    "location": "Iksan",
    "year": "2024",
    "cover": "projects/iksan-bucheon-middle/cover.jpg",
    "summary": "A circular wood stage anchors the school's atrium, turning a stair landing into a place to sit, read, and gather beneath a soaring skylight.",
    "sections": [
      {
        "heading": "Library",
        "body": "Warm wood tones and gray furnishings sit against a light terrazzo floor, giving the reading room a quiet, understated calm. Wraparound windows and an information desk at the center keep the space bright and easy to navigate.",
        "image": "projects/iksan-bucheon-middle/1.jpg"
      }
    ]
  },
  {
    "id": "mokpo-combined-high",
    "title": "Mokpo Combined High School",
    "category": "Education & Library",
    "location": "Mokpo",
    "year": "2025",
    "cover": "projects/mokpo-combined-high/cover.jpg",
    "summary": "A modular lounge of blue seating and warm wood paneling gives students a flexible common room to rest, study, or gather between classes.",
    "sections": [
      {
        "heading": "Library",
        "body": "Open reading tables and bookshelves interlock beneath a green acoustic ceiling, with a curved orange enclosure marking out the reference collection. The mix of green and orange keeps the room lively while still feeling like a place to settle in and read.",
        "image": "projects/mokpo-combined-high/1.jpg"
      }
    ]
  },
  {
    "id": "imsil-high",
    "title": "Imsil High School",
    "category": "Education & Library",
    "location": "Imsil",
    "year": "2023",
    "cover": "projects/imsil-high/cover.jpg",
    "summary": "A softly lit lobby where a backlit wood lattice wall, reminiscent of traditional hanji screens, frames a quiet lounge for waiting and conversation.",
    "sections": [
      {
        "heading": "Smart Classroom",
        "body": "A continuous band of yellow wraps the ceiling of the smart classroom, giving an otherwise flexible teaching space a strong sense of direction and identity. Light wood furniture and a dark carpet tile ground the room, balancing the bold color overhead.",
        "image": "projects/imsil-high/1.jpg"
      }
    ]
  },
  {
    "id": "jeonbuk-science-high",
    "title": "Jeonbuk Science High School",
    "category": "Education & Library",
    "location": "Iksan",
    "year": "2025",
    "cover": "projects/jeonbuk-science-high/cover.jpg",
    "summary": "A restrained corridor of vertical wood slats and backlit media walls leads students from the entrance toward the school's central hall.",
    "sections": [
      {
        "heading": "Auditorium",
        "body": "Perforated wood panels line the walls and ceiling of the auditorium, tuned for both acoustics and appearance. Tiered seating and a central aisle keep sightlines clear to the stage from every row, making the hall equally suited to lectures, assemblies, and performances.",
        "image": "projects/jeonbuk-science-high/1.jpg"
      }
    ]
  },
  {
    "id": "iksan-wonkwang-girls-high",
    "title": "Iksan Wonkwang Girls' High School",
    "category": "Education & Library",
    "location": "Iksan",
    "year": "2023",
    "cover": "projects/iksan-wonkwang-girls-high/cover.jpg",
    "summary": "Each floor of the school takes on its own color story, from a deep-blue third-floor reading lounge to a sculptural stone-toned homebase upstairs.",
    "sections": [
      {
        "heading": "Homebase",
        "body": "Cloud-shaped upholstered seating clusters beneath ring-shaped pendant lights, giving students a soft, informal alternative to the desks lining the window wall. A row of computer stations and built-in bench seating round out a space meant for study, breaks, and everything between.",
        "image": "projects/iksan-wonkwang-girls-high/1.jpg"
      }
    ]
  },
  {
    "id": "jeonju-jeolla-high",
    "title": "Jeonju Jeolla High School",
    "category": "Education & Library",
    "location": "Jeonju",
    "year": "2025",
    "cover": "projects/jeonju-jeolla-high/cover.jpg",
    "summary": "A wood-lined atrium welcomes students beneath an open stairwell, with a built-in library nook tucked into the base of the stair.",
    "sections": [
      {
        "heading": "Open Library",
        "body": "Curved wood shelving and a mix of seating styles spill out of the library proper and into the surrounding corridor, blurring the line between browsing and passing through. Warm timber slats overhead tie the reading nook to the rest of the hall.",
        "image": "projects/jeonju-jeolla-high/1.jpg"
      }
    ]
  },
  {
    "id": "wanju-gosan-youth-center",
    "title": "Wanju Gosan Youth Center",
    "category": "Education & Library",
    "location": "Wanju",
    "year": "2022",
    "cover": "projects/wanju-gosan-youth-center/cover.jpg",
    "summary": "A whale-shaped play structure, built from waves of blue tile and rope netting, gives teens a place to climb, read, and quietly work through their feelings.",
    "sections": []
  },
  {
    "id": "jeonbuk-student-training-center",
    "title": "Jeonbuk Student Training Center",
    "category": "Education & Library",
    "location": "Namwon",
    "year": "2022",
    "cover": "projects/jeonbuk-student-training-center/cover.jpg",
    "summary": "A lobby modeled on the ridgelines of Jirisan, its wavy graphic wall tracing the mountain contours visible just outside.",
    "sections": []
  },
  {
    "id": "jbnu-main-administration",
    "title": "JBNU Main Administration Building",
    "category": "Education & Library",
    "location": "Jeonju",
    "year": "2022",
    "cover": "projects/jbnu-main-administration/cover.jpg",
    "summary": "A reception hall of warm wood and a backlit lattice screen reinterprets traditional Korean window patterns for a modern university lobby.",
    "sections": [
      {
        "heading": "Reading Nook",
        "body": "Along a sunlit corridor, a run of low wood shelving turns a stretch of glazing into an informal reading nook. Simple materials and abundant daylight keep the space feeling calm despite its central location within the building.",
        "image": "projects/jbnu-main-administration/1.jpg"
      }
    ]
  },
  {
    "id": "jeonju-deokjin-urban-regeneration-center",
    "title": "Jeonju Deokjin Urban Regeneration Center",
    "category": "Government",
    "location": "Jeonju",
    "year": "2025",
    "cover": "projects/jeonju-deokjin-urban-regeneration-center/cover.jpg",
    "summary": "An open atrium of metal, glass, and bright stone anchors this tech-and-content hub in Jeonju.",
    "sections": [
      {
        "heading": "Conference Room",
        "body": "A long oak table and leather chairs sit beneath a skyline of floor-to-ceiling glass, giving the meeting room a quiet, executive calm. Pendant lighting and warm wood grain soften the metal-and-glass language of the building's public face.",
        "image": "projects/jeonju-deokjin-urban-regeneration-center/1.jpg"
      },
      {
        "heading": "Shared Lounge",
        "body": "Below a folded blue soffit and hanging greenery, an open co-working floor mixes standing desks with communal tables built for solo founders and small teams alike. Comfortable, open seating throughout invites rest, conversation, and casual networking between work sessions.",
        "image": "projects/jeonju-deokjin-urban-regeneration-center/2.jpg"
      }
    ]
  },
  {
    "id": "jeonju-city-hall-annex-cafe",
    "title": "Jeonju City Hall Annex Cafe",
    "category": "Government",
    "location": "Jeonju",
    "year": "2026",
    "cover": "projects/jeonju-city-hall-annex-cafe/cover.jpg",
    "summary": "A civic cafe that reinterprets Baekje's stacked stone walls in rough basalt and warm wood.",
    "sections": [
      {
        "heading": "Lobby",
        "body": "A curved wall of glass block filters daylight beside board-formed stone, marking the transition from street to interior. Metal detailing traces the lines and patterns of Baekje relics across the stone surface, giving the entry a quiet sense of history.",
        "image": "projects/jeonju-city-hall-annex-cafe/1.jpg"
      },
      {
        "heading": "Cafe Seating",
        "body": "Bench seating runs the length of a glazed facade overlooking the plaza, pairing pale stone columns with oak tables for long, easy stays. The bright, white-toned half of the room balances the cafe's darker stone-and-timber side, meeting at a long communal table in the center.",
        "image": "projects/jeonju-city-hall-annex-cafe/2.jpg"
      }
    ]
  },
  {
    "id": "iksan-knowledge-industry-center",
    "title": "Iksan Knowledge Industry Center",
    "category": "Government",
    "location": "Iksan",
    "year": "2026",
    "cover": "projects/iksan-knowledge-industry-center/cover.jpg",
    "summary": "White and neutral tones define a refined, media-forward home for Iksan's knowledge industry.",
    "sections": [
      {
        "heading": "Large Conference Hall",
        "body": "Repeating wood louvers and an acoustic ceiling wrap a tiered lecture hall, tuned for focus and calm under restrained lighting. The rhythm of vertical timber slats carries through from the lobby, unifying the building's public and working spaces.",
        "image": "projects/iksan-knowledge-industry-center/1.jpg"
      },
      {
        "heading": "Cafe",
        "body": "Wood louvers and pendant globes soften a lounge that opens onto the park, where benches and a curved counter blur the line between working and unwinding. Soft textures of timber and fabric ease the transition between focused work and relaxed rest.",
        "image": "projects/iksan-knowledge-industry-center/2.jpg"
      }
    ]
  },
  {
    "id": "jeonju-bio-materials-industry-center",
    "title": "Jeonju Bio-Materials Industry Center",
    "category": "Government",
    "location": "Jeonju",
    "year": "2026",
    "cover": "projects/jeonju-bio-materials-industry-center/cover.jpg",
    "summary": "Bright ivory and warm wood soften the industrial ambitions of this bio-materials research center.",
    "sections": [
      {
        "heading": "VIP Reception",
        "body": "A private reception room pairs dark wood cabinetry with a backlit bronze inlay and framed art, creating a composed setting for formal greetings and tea service. Neutral stone walls and soft pendant lighting add quiet restraint befitting distinguished guests.",
        "image": "projects/jeonju-bio-materials-industry-center/1.jpg"
      },
      {
        "heading": "Garden Lounge",
        "body": "Floor-to-ceiling glazing opens the VIP lounge onto a landscaped lawn, letting daylight and greenery temper the room's dark wood and metal accents. Understated furnishings keep the focus on the view and the conversation.",
        "image": "projects/jeonju-bio-materials-industry-center/2.jpg"
      }
    ]
  },
  {
    "id": "gunsan-saemangeum-seafood-complex",
    "title": "Gunsan Saemangeum Smart Seafood Complex",
    "category": "Government",
    "location": "Gunsan",
    "year": "2024",
    "cover": "projects/gunsan-saemangeum-seafood-complex/cover.jpg",
    "summary": "Metal paneling and a rippling wave-form ceiling give this seafood-processing complex a clean, futuristic edge.",
    "sections": [
      {
        "heading": "Product Display Hall",
        "body": "Navy metal casework and refrigerated display cases present the complex's packaged goods beneath a wall tracing its manufacturing process. Bright, hygienic finishes throughout reinforce the facility's focus on food safety and modern processing.",
        "image": "projects/gunsan-saemangeum-seafood-complex/1.jpg"
      },
      {
        "heading": "Local Village Cafeteria",
        "body": "A deep-blue tiled counter and playful retro signage bring a friendly, approachable energy to the complex's public cafe. Curved counters and cheerful lettering soften the building's industrial backbone into a genuinely welcoming public space.",
        "image": "projects/gunsan-saemangeum-seafood-complex/2.jpg"
      }
    ]
  },
  {
    "id": "gunsan-gyeongam-soc-complex",
    "title": "Gunsan Gyeongam-dong Community SOC Complex",
    "category": "Government",
    "location": "Gunsan",
    "year": "2024",
    "cover": "projects/gunsan-gyeongam-soc-complex/cover.jpg",
    "summary": "A multi-use civic complex layers a curved blue service counter, a children's library, and a reading hall into one welcoming public building.",
    "sections": [
      {
        "heading": "Reading Hall",
        "body": "Warm wood shelving and a wall of glazing line a reading hall furnished with window-side benches for catching natural light and views. Repeating vertical louvers and stacks add a steady, calming rhythm to the space, encouraging long, unhurried visits.",
        "image": "projects/gunsan-gyeongam-soc-complex/1.jpg"
      },
      {
        "heading": "Reception Lounge",
        "body": "Timber slats and potted greenery wrap a quiet meeting lounge, where dark leather chairs and low lamps add depth against pale walls. The room's warm materials and black grid ceiling create a grounded, contemplative counterpoint to the complex's brighter civic spaces.",
        "image": "projects/gunsan-gyeongam-soc-complex/2.jpg"
      }
    ]
  },
  {
    "id": "jeonbuk-education-office-hq",
    "title": "Jeonbuk Office of Education Headquarters",
    "category": "Government",
    "location": "Jeonju",
    "year": "2022",
    "cover": "projects/jeonbuk-education-office-hq/cover.jpg",
    "summary": "A white-and-light-wood conference room brings a calm, orderly clarity to this education administration headquarters.",
    "sections": [
      {
        "heading": "Conference Room",
        "body": "Acoustic ceiling panels and carpet tile keep the long meeting room quiet, while a wall of factory-style windows fills it with soft daylight. Warm brown leather chairs and light wood cabinetry add a grounded, professional finish to the otherwise pared-back interior.",
        "image": "projects/jeonbuk-education-office-hq/1.jpg"
      }
    ]
  },
  {
    "id": "korea-liquor-theme-museum",
    "title": "Korea Liquor Theme Museum",
    "category": "Museum & Exhibition",
    "location": "Wanju",
    "year": "2024",
    "cover": "projects/korea-liquor-theme-museum/cover.jpg",
    "summary": "A rolling lawn dotted with oversized bottle and mug sculptures turns this museum into a playful outdoor stage for Korea's drinking culture.",
    "sections": [
      {
        "heading": "Mirror Bottle Garden",
        "body": "A grove of mirror-polished bottle forms rises among the trees, reflecting sky, foliage, and visitors into a single shimmering, ever-changing scene. Playing with scale and reflection, the installation turns a familiar object into something genuinely dreamlike.",
        "image": "projects/korea-liquor-theme-museum/1.jpg"
      },
      {
        "heading": "Giant Mug Plaza",
        "body": "Two oversized beer mugs, cast in resin and full of amber 'liquid,' anchor a favorite photo spot on the museum's grassy hillside. Vivid color against green lawn gives the whole landscape a lighthearted, unmistakably playful rhythm.",
        "image": "projects/korea-liquor-theme-museum/2.jpg"
      }
    ]
  },
  {
    "id": "gochang-county-art-museum",
    "title": "Gochang County Art Museum",
    "category": "Museum & Exhibition",
    "location": "Gochang",
    "year": "2024",
    "cover": "projects/gochang-county-art-museum/cover.jpg",
    "summary": "A restrained white gallery lets art take center stage, framed by a perforated, light-dappled lobby ceiling.",
    "sections": [
      {
        "heading": "Lobby",
        "body": "A perforated ceiling casts a constellation of light across the entry lobby, drawing visitors past a curved information desk and into the galleries beyond. Reflective black surfaces and quiet circular details lend the arrival sequence a subtle sense of drama.",
        "image": "projects/gochang-county-art-museum/1.jpg"
      },
      {
        "heading": "Cafe",
        "body": "Warm oak paneling and full-height glazing turn the museum cafe toward the surrounding garden, extending the calm of the galleries into a space for rest and conversation. Visitors linger here after viewing the collection, carrying the exhibition's mood into an easy, unhurried pause.",
        "image": "projects/gochang-county-art-museum/2.jpg"
      }
    ]
  },
  {
    "id": "seoul-sangsangnara-children-museum",
    "title": "Seoul Sangsangnara Children's Museum",
    "category": "Museum & Exhibition",
    "location": "Seoul",
    "year": "2018",
    "cover": "projects/seoul-sangsangnara-children-museum/cover.jpg",
    "summary": "Bold primary colors and organic, child-scaled forms turn this Seoul exhibition hall into a hands-on playground for discovery.",
    "sections": [
      {
        "heading": "Interactive Play Zone",
        "body": "Rounded openings and soft-cornered exhibit walls in yellow and red mark out distinct play zones scaled to a child's eye level and reach. Hands-on dials, screens, and tactile panels invite children to touch, turn, and explore, blending play and learning into one continuous experience.",
        "image": "projects/seoul-sangsangnara-children-museum/1.jpg"
      }
    ]
  },
  {
    "id": "ulsan-carbon-neutrality-science-museum",
    "title": "Ulsan Carbon Neutrality Science Museum",
    "category": "Museum & Exhibition",
    "location": "Ulsan",
    "year": "2024",
    "cover": "projects/ulsan-carbon-neutrality-science-museum/cover.jpg",
    "summary": "Clean white surfaces and softly curving corridors give this science museum a bright, forward-looking clarity.",
    "sections": [
      {
        "heading": "Lobby",
        "body": "A dark stone reception desk sits against full-height glazing, anchoring a colonnaded lobby that curves gently toward the exhibition halls. Repeating linear ceiling elements echo the flow of energy, quietly guiding visitors deeper into the museum.",
        "image": "projects/ulsan-carbon-neutrality-science-museum/1.jpg"
      },
      {
        "heading": "Museum Shop",
        "body": "Exposed ceiling services and clean white millwork give the museum shop an unfinished, laboratory-like edge that suits its subject. Open sightlines link the shop directly to the surrounding public space, keeping browsing and rest closely connected.",
        "image": "projects/ulsan-carbon-neutrality-science-museum/2.jpg"
      }
    ]
  },
  {
    "id": "wanju-yongjin-exhibition-hall",
    "title": "Wanju Yongjin Cultural District Exhibition Hall",
    "category": "Museum & Exhibition",
    "location": "Wanju",
    "year": "2023",
    "cover": "projects/wanju-yongjin-exhibition-hall/cover.jpg",
    "summary": "Contrasting bright and dark galleries give each exhibition at this Wanju hall its own distinct sense of atmosphere and depth.",
    "sections": [
      {
        "heading": "Gallery Hall",
        "body": "White columns and pale oak flooring frame a flexible gallery where sculpture and works on paper share the same open floor. Independently adjustable lighting lets each exhibition reset the room’s mood, from bright and even to sharply focused.",
        "image": "projects/wanju-yongjin-exhibition-hall/1.jpg"
      },
      {
        "heading": "Reception",
        "body": "A pared-back reception desk in pale stone greets visitors beneath soft, diffused lighting, keeping the entry sequence understated ahead of the galleries. Framed photography lines the surrounding walls, previewing the exhibition beyond.",
        "image": "projects/wanju-yongjin-exhibition-hall/2.jpg"
      }
    ]
  },
  {
    "id": "jbnu-samsung-culture-hall",
    "title": "JBNU Samsung Culture Hall",
    "category": "Museum & Exhibition",
    "location": "Jeonju",
    "year": "2024",
    "cover": "projects/jbnu-samsung-culture-hall/cover.jpg",
    "summary": "White tones and pale wood flooring give this university exhibition hall a calm, versatile backdrop for art and culture.",
    "sections": []
  },
  {
    "id": "jbnu-hospital-lounge",
    "title": "JBNU Hospital Lounge",
    "category": "Medical Center & Pharmacy",
    "location": "Jeonju",
    "year": "2022",
    "cover": "projects/jbnu-hospital-lounge/cover.jpg",
    "summary": "A hospital courtyard where petal-shaped modular seating and built-in wood planters soften a clinical setting with warmth and greenery.",
    "sections": [
      {
        "heading": "Modular Seating",
        "body": "Low, wide seating modules are arranged like flower petals so patients and caregivers can settle in at their own pace, with orientation and spacing adjusted to each moment of use. Wood planter-benches fuse greenery with rest, threading natural warmth through an otherwise clinical courtyard so movement, waiting, and quiet conversation all find their place.",
        "image": "projects/jbnu-hospital-lounge/1.jpg"
      }
    ]
  },
  {
    "id": "jeonju-dain-pharmacy",
    "title": "Jeonju Dain Pharmacy",
    "category": "Medical Center & Pharmacy",
    "location": "Jeonju",
    "year": "2024",
    "cover": "projects/jeonju-dain-pharmacy/cover.jpg",
    "summary": "A pharmacy where black-and-white contrast and a gridded display wall turn clinical function into gallery-like precision.",
    "sections": [
      {
        "heading": "Reception Lounge",
        "body": "A marble counter and linear lighting anchor the consultation area with a bright, trustworthy presence, while low sofas and a shared table extend the purchase-driven flow into moments of waiting and rest. The result balances medical cleanliness with lounge-like comfort, reframing the pharmacy as a considered space to linger in.",
        "image": "projects/jeonju-dain-pharmacy/1.jpg"
      }
    ]
  },
  {
    "id": "jeonju-gyeongam-hotel",
    "title": "Jeonju Gyeongam-dong Hotel",
    "category": "Hotel & Villa",
    "location": "Jeonju",
    "year": "2020",
    "cover": "projects/jeonju-gyeongam-hotel/cover.jpg",
    "summary": "A hotel lobby where louvers and marble come together for a composed, quietly luxurious welcome.",
    "sections": [
      {
        "heading": "Lounge & Cafe",
        "body": "Restrained ceiling lighting at reception adds a touch of glamour and spatial depth, while black-and-white furniture and generously spaced seating balance elegance with ease. An adjoining wood-toned lounge and cafe invite guests to linger, extending the same quiet luxury past check-in.",
        "image": "projects/jeonju-gyeongam-hotel/1.jpg"
      }
    ]
  },
  {
    "id": "samcheon-dong-residence",
    "title": "Samcheon-dong Residence & Retail",
    "category": "Apartment & Residence",
    "location": "Jeonju",
    "year": "2021",
    "cover": "projects/samcheon-dong-residence/cover.jpg",
    "summary": "A home where living, dining, and kitchen align along a single axis for an open, continuous flow.",
    "sections": [
      {
        "heading": "Living & Dining",
        "body": "White panels paired with dark wood millwork lend the interior a calm sense of depth, while a long island table becomes the anchor for cooking, eating, and conversation alike. Built-in storage and a sliding media wall keep the plan uncluttered, letting the open axis read cleanly from entry to window.",
        "image": "projects/samcheon-dong-residence/1.jpg"
      }
    ]
  },
  {
    "id": "gyeongbuk-nh-bank",
    "title": "Gyeongbuk NH Bank Branch",
    "category": "Office",
    "location": "Gyeongbuk",
    "year": "2024",
    "cover": "projects/gyeongbuk-nh-bank/cover.jpg",
    "summary": "A bank headquarters where a sculptural spiral stair and a fern-printed ceiling reinterpret NH's nature-friendly identity for a bright, modern lobby.",
    "sections": [
      {
        "heading": "Conference Room",
        "body": "A ribbed ceiling strung with pendant lights and a lettered wall set a more focused tone for meetings and briefings. White stone and wood finishes carry through from the lobby, while long conference tables and a monitor wall give the gathering space its own distinct register within the same restrained material language.",
        "image": "projects/gyeongbuk-nh-bank/1.jpg"
      }
    ]
  },
  {
    "id": "wanju-yongjin-water-office",
    "title": "Wanju Yongjin Water & Sewage Office",
    "category": "Office",
    "location": "Wanju",
    "year": "2023",
    "cover": "projects/wanju-yongjin-water-office/cover.jpg",
    "summary": "A public water and sewage office where a rippling ceiling panel and streamlined lighting visualize the constant circulation of water.",
    "sections": []
  },
  {
    "id": "gangnam-model-house",
    "title": "Gangnam Model House",
    "category": "Office",
    "location": "Seoul",
    "year": "2024",
    "cover": "projects/gangnam-model-house/cover.jpg",
    "summary": "A model-house sales office where deep blue furniture and a wall-sized aquarium screen bring a sensory calm to a bright, white-toned workspace.",
    "sections": [
      {
        "heading": "Reception & Exhibition Hall",
        "body": "Glass-walled meeting rooms and a white reception counter lead visitors past a circular lounge of blue egg chairs toward the numbered exhibition halls beyond. Abundant daylight and sweeping city views keep the sequence open and refined, setting a composed, gallery-like tone before clients even sit down.",
        "image": "projects/gangnam-model-house/1.jpg"
      }
    ]
  },
  {
    "id": "seoul-namboo-court-law-office",
    "title": "Seoul Namboo District Court Law Office",
    "category": "Office",
    "location": "Seoul",
    "year": "2024",
    "cover": "projects/seoul-namboo-court-law-office/cover.jpg",
    "summary": "A judicial scrivener's office where a black storage wall and vertical wood louvers balance document-driven efficiency with quiet trust.",
    "sections": [
      {
        "heading": "Private Office",
        "body": "A nameplated private office sits behind a slatted wood screen that keeps the plan open while softly marking each threshold. Long white desks and paired floor lamps bring the same restrained, linear discipline into the individual workspace, reinforcing the sense of accuracy and professionalism set by the black storage wall beyond.",
        "image": "projects/seoul-namboo-court-law-office/1.jpg"
      }
    ]
  },
  {
    "id": "seocho-inbasket",
    "title": "Seocho Inbasket Office",
    "category": "Office",
    "location": "Seoul",
    "year": "2024",
    "cover": "projects/seocho-inbasket/cover.jpg",
    "summary": "An assessment-center office where oversized typography and a single yellow accent wall turn corporate evaluation spaces into a memorable brand experience.",
    "sections": [
      {
        "heading": "Brand Wall & Reception",
        "body": "A wall of overlapping words, interview, network, business case, strategy, spells out Inbasket's competency-evaluation identity at full scale behind a marble reception counter. Black pendant lights and dark furniture keep the space grounded, so the graphic wall, and elsewhere a bold yellow doorway, can carry the personality.",
        "image": "projects/seocho-inbasket/1.jpg"
      }
    ]
  },
  {
    "id": "mapo-office",
    "title": "Mapo Office",
    "category": "Office",
    "location": "Seoul",
    "year": "2024",
    "cover": "projects/mapo-office/cover.jpg",
    "summary": "An office where warm wood desking softens a disciplined black-and-white palette, dividing open work areas from quieter focus rooms.",
    "sections": [
      {
        "heading": "Meeting Room",
        "body": "A blacked-out meeting room reverses the daytime palette entirely, wrapping a long wood table in dark millwork, potted greenery, and pools of task lighting. The contrast against the bright open desks elsewhere sharpens each space’s role, keeping collaborative and focused work clearly, sensibly apart.",
        "image": "projects/mapo-office/1.jpg"
      }
    ]
  },
  {
    "id": "iksan-yanggiwa",
    "title": "Iksan Yanggiwa",
    "category": "Commercial",
    "location": "Iksan",
    "year": "2022",
    "cover": "projects/iksan-yanggiwa/cover.jpg",
    "summary": "A lamb-specialty restaurant where a reinterpreted timber rafter ceiling and traditional dancheong accents give a modern dining hall real ceremonial warmth.",
    "sections": []
  },
  {
    "id": "jeonju-songcheon-pinetree-mall",
    "title": "Jeonju Songcheon Pinetree Mall",
    "category": "Commercial",
    "location": "Jeonju",
    "year": "2019",
    "cover": "projects/jeonju-songcheon-pinetree-mall/cover.jpg",
    "summary": "A shopping mall where white tile and black-framed storefronts sharpen into an urbane, gallery-like retail promenade.",
    "sections": [
      {
        "heading": "Luxury Retail Corridor",
        "body": "Escalators and a central circulation spine drive a dynamic flow past glass-fronted flagship boutiques, their black frames and backlit signage cut cleanly against polished stone floors. The same tile gloss and restrained framing carry through the mall’s public areas, extending a sense of considered, high-gloss sophistication throughout.",
        "image": "projects/jeonju-songcheon-pinetree-mall/1.jpg"
      }
    ]
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
