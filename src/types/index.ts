export type ProjectCategory = 'Residential' | 'Office' | 'Commercial' | 'Exhibition' | 'Hotel'

export type ProjectSection = {
  heading: string
  body: string
  image: string
}

export type Project = {
  id: string
  title: string
  category: ProjectCategory
  location: string
  year: string
  cover: string
  summary: string
  sections: ProjectSection[]
}
