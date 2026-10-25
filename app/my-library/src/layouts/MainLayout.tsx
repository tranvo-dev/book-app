import { Header } from '../components'
import './MainLayout.scss'
import type { ReactNode } from 'react'
export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}