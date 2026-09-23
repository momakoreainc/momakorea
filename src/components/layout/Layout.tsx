import type { ReactNode } from 'react'
import { CustomCursor } from '../common/CustomCursor'
import { Nav } from './Nav'
import { Preloader } from './Preloader'

type LayoutProps = {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <Nav />
      <main>{children}</main>
    </>
  )
}
