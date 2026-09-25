export type ProjectCategory =
  | 'Cultural & Public Spaces'
  | 'Sports & Community'
  | 'Education & Library'
  | 'Government'
  | 'Museum & Exhibition'
  | 'Medical Center & Pharmacy'
  | 'Hotel & Villa'
  | 'Apartment & Residence'
  | 'Office'
  | 'Commercial'

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
